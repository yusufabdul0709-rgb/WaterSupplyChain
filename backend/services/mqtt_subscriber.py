"""
MQTT Subscriber — Subscribes to sensor telemetry from the simulation engine.

Runs paho-mqtt in a background thread, processes incoming sensor readings,
stores them in the database, updates the in-memory node state, and broadcasts
updates via WebSocket to all connected dashboard clients.
"""

from __future__ import annotations
import asyncio
import json
import os
import threading
import time
from datetime import datetime, timezone
from typing import Any

import paho.mqtt.client as mqtt
from loguru import logger

from services.database import insert_sensor_reading, insert_alert
from websocket_manager import manager

# ── Configuration ────────────────────────────────────────────────────────────

MQTT_HOST: str = os.environ.get("MQTT_HOST", "localhost")
MQTT_PORT: int = int(os.environ.get("MQTT_PORT", "1883"))
TOPIC_PREFIX: str = "waterdt/zone3"

# ── In-memory state ─────────────────────────────────────────────────────────

# Latest readings per node — updated on every MQTT message
node_state: dict[str, dict] = {}
node_state_lock = threading.Lock()

# MQTT connection status
mqtt_connected: bool = False
mqtt_client_ref: mqtt.Client | None = None

# Event loop reference for async callbacks from MQTT thread
_loop: asyncio.AbstractEventLoop | None = None


def set_event_loop(loop: asyncio.AbstractEventLoop) -> None:
    """Set the asyncio event loop for scheduling async callbacks."""
    global _loop
    _loop = loop


def get_node_state() -> dict[str, dict]:
    """Get a copy of current node state."""
    with node_state_lock:
        return {k: v.copy() for k, v in node_state.items()}


def is_mqtt_connected() -> bool:
    """Check if MQTT is connected."""
    return mqtt_connected


# ── MQTT Callbacks ───────────────────────────────────────────────────────────

def _on_connect(client: mqtt.Client, userdata: Any, flags: dict, rc: int) -> None:
    """MQTT on_connect callback."""
    global mqtt_connected
    if rc == 0:
        logger.info(f"✅ Backend MQTT connected to {MQTT_HOST}:{MQTT_PORT}")
        mqtt_connected = True
        # Subscribe to all sensor telemetry and anomaly events
        client.subscribe(f"{TOPIC_PREFIX}/+/telemetry", qos=0)
        client.subscribe(f"{TOPIC_PREFIX}/events/anomaly", qos=1)
        logger.info(f"Subscribed to {TOPIC_PREFIX}/+/telemetry and events/anomaly")
    else:
        logger.error(f"MQTT connection failed: rc={rc}")


def _on_disconnect(client: mqtt.Client, userdata: Any, rc: int) -> None:
    """MQTT on_disconnect callback."""
    global mqtt_connected
    mqtt_connected = False
    logger.warning(f"Backend MQTT disconnected (rc={rc})")


def _on_message(client: mqtt.Client, userdata: Any, msg: mqtt.MQTTMessage) -> None:
    """MQTT message handler — process sensor telemetry and anomaly events."""
    try:
        payload = json.loads(msg.payload.decode())
        topic = msg.topic

        if topic.endswith("/telemetry"):
            _handle_telemetry(payload)
        elif topic.endswith("/anomaly"):
            _handle_anomaly(payload)
    except json.JSONDecodeError:
        pass  # Ignore non-JSON messages (individual metric topics)
    except Exception as e:
        logger.error(f"Error processing MQTT message: {e}")


def _handle_telemetry(payload: dict) -> None:
    """Process a sensor telemetry message."""
    node_id = payload.get("node_id", "")
    if not node_id:
        return

    # Update in-memory state
    with node_state_lock:
        node_state[node_id] = {
            "node_id": node_id,
            "timestamp": payload.get("timestamp", ""),
            "pressure_bar": payload.get("pressure_bar", 0),
            "flow_lps": payload.get("flow_lps", 0),
            "ph": payload.get("ph", 7.2),
            "status": payload.get("status", "NORMAL"),
            "anomaly_score": payload.get("anomaly_score", 0),
        }

    # Schedule async operations (DB write + WebSocket broadcast)
    if _loop and _loop.is_running():
        asyncio.run_coroutine_threadsafe(_async_handle_telemetry(payload), _loop)


async def _async_handle_telemetry(payload: dict) -> None:
    """Async handler: store reading in DB and broadcast via WebSocket."""
    try:
        # Store in database (throttle: store every reading)
        await insert_sensor_reading(
            node_id=payload["node_id"],
            timestamp=payload.get("timestamp", ""),
            pressure_bar=payload.get("pressure_bar", 0),
            flow_lps=payload.get("flow_lps", 0),
            ph=payload.get("ph", 7.2),
            status=payload.get("status", "NORMAL"),
            anomaly_score=payload.get("anomaly_score", 0),
        )
    except Exception as e:
        logger.error(f"DB write error: {e}")

    try:
        # Broadcast to WebSocket clients
        ws_msg = {
            "type": "NODE_UPDATE",
            **payload,
        }
        await manager.broadcast(ws_msg)
    except Exception as e:
        logger.error(f"WebSocket broadcast error: {e}")


def _handle_anomaly(payload: dict) -> None:
    """Process an anomaly event."""
    logger.warning(f"🚨 Anomaly received: {payload.get('type')} on {payload.get('pipe_id')}")

    if _loop and _loop.is_running():
        asyncio.run_coroutine_threadsafe(_async_handle_anomaly(payload), _loop)


async def _async_handle_anomaly(payload: dict) -> None:
    """Async handler: store alert in DB and broadcast via WebSocket."""
    try:
        alert_id = await insert_alert(
            alert_type=payload.get("type", "UNKNOWN"),
            severity=payload.get("severity", "HIGH"),
            node_id=payload.get("node_id", ""),
            pipe_id=payload.get("pipe_id", ""),
            description=payload.get("description", ""),
            timestamp=payload.get("timestamp", ""),
        )

        ws_msg = {
            "type": "ALERT",
            "id": alert_id,
            "alert_type": payload.get("type", ""),
            "severity": payload.get("severity", "HIGH"),
            "node_id": payload.get("node_id", ""),
            "pipe_id": payload.get("pipe_id", ""),
            "description": payload.get("description", ""),
            "timestamp": payload.get("timestamp", ""),
        }
        await manager.broadcast(ws_msg)
    except Exception as e:
        logger.error(f"Anomaly handling error: {e}")


# ── MQTT Client Management ──────────────────────────────────────────────────

def start_mqtt_subscriber() -> mqtt.Client:
    """Start the MQTT subscriber in a background thread."""
    global mqtt_client_ref

    client = mqtt.Client(client_id="water-dt-backend", clean_session=True)
    client.on_connect = _on_connect
    client.on_disconnect = _on_disconnect
    client.on_message = _on_message
    client.reconnect_delay_set(min_delay=1, max_delay=30)

    mqtt_client_ref = client

    def _connect_loop() -> None:
        """Connection loop with retries."""
        while True:
            try:
                logger.info(f"Backend connecting to MQTT {MQTT_HOST}:{MQTT_PORT}")
                client.connect(MQTT_HOST, MQTT_PORT, keepalive=60)
                client.loop_forever()
            except Exception as e:
                logger.warning(f"MQTT connection error: {e} — retrying in 5s")
                time.sleep(5)

    thread = threading.Thread(target=_connect_loop, daemon=True, name="mqtt-subscriber")
    thread.start()
    logger.info("MQTT subscriber thread started")

    return client


def stop_mqtt_subscriber() -> None:
    """Stop the MQTT subscriber."""
    global mqtt_client_ref
    if mqtt_client_ref:
        mqtt_client_ref.loop_stop()
        mqtt_client_ref.disconnect()
        mqtt_client_ref = None
        logger.info("MQTT subscriber stopped")
