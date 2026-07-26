"""
Water Digital Twin — Backend API Server.

FastAPI application serving:
  - REST API for network topology, sensor data, alerts, and simulation
  - WebSocket endpoint for real-time live updates
  - MQTT subscriber for ingesting simulation sensor data
  - Anomaly detection engine running in background
  - SQLite database with WAL mode
"""

from __future__ import annotations
import asyncio
import time
from contextlib import asynccontextmanager
from datetime import datetime, timezone

# pyrefly: ignore [missing-import]
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
# pyrefly: ignore [missing-import]
from fastapi.middleware.cors import CORSMiddleware
# pyrefly: ignore [missing-import]
from loguru import logger

from services.database import init_db, cleanup_old_readings
from services.mqtt_subscriber import (
    start_mqtt_subscriber,
    stop_mqtt_subscriber,
    set_event_loop,
    get_node_state,
    is_mqtt_connected,
)
from services.anomaly_detector import rolling_window_loop
from websocket_manager import manager
from routers import network, sensors, alerts, simulation, auth, sectors, complaints

# ── App State ────────────────────────────────────────────────────────────────

START_TIME = time.time()


# ── Lifespan ─────────────────────────────────────────────────────────────────

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application startup and shutdown lifecycle."""
    logger.info("=" * 60)
    logger.info("  Water Digital Twin — Backend API Starting")
    logger.info("=" * 60)

    # Initialize database
    await init_db()

    # Set event loop for MQTT → async bridge
    loop = asyncio.get_running_loop()
    set_event_loop(loop)

    # Start MQTT subscriber
    start_mqtt_subscriber()

    # Start background tasks
    anomaly_task = asyncio.create_task(rolling_window_loop())
    ping_task = asyncio.create_task(_ws_ping_loop())
    cleanup_task = asyncio.create_task(_db_cleanup_loop())

    logger.info("All background services started")

    yield

    # Shutdown
    logger.info("Shutting down backend services...")
    anomaly_task.cancel()
    ping_task.cancel()
    cleanup_task.cancel()
    stop_mqtt_subscriber()
    logger.info("Backend shutdown complete")


# ── Background Tasks ─────────────────────────────────────────────────────────

async def _ws_ping_loop() -> None:
    """Ping all WebSocket clients every 30s to keep connections alive."""
    while True:
        await asyncio.sleep(30)
        await manager.ping_all()


async def _db_cleanup_loop() -> None:
    """Clean up old sensor readings every hour."""
    while True:
        await asyncio.sleep(3600)
        try:
            deleted = await cleanup_old_readings(hours=24)
            if deleted:
                logger.info(f"Cleaned up {deleted} old sensor readings")
        except Exception as e:
            logger.error(f"DB cleanup error: {e}")


# ── FastAPI App ──────────────────────────────────────────────────────────────

app = FastAPI(
    title="Water Digital Twin API",
    description="Real-time urban water network monitoring and anomaly detection",
    version="1.0.0",
    lifespan=lifespan,
)

# CORS — allow all origins for demo
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(network.router)
app.include_router(sensors.router)
app.include_router(alerts.router)
app.include_router(simulation.router)
app.include_router(auth.router)
app.include_router(sectors.router)
app.include_router(complaints.router)


# ── Health Check ─────────────────────────────────────────────────────────────

@app.get("/api/v1/health")
async def health_check() -> dict:
    """Health check endpoint."""
    state = get_node_state()
    return {
        "status": "ok",
        "mqtt_connected": is_mqtt_connected(),
        "db": "ok",
        "uptime_seconds": round(time.time() - START_TIME, 1),
        "sensor_count": len(state),
        "ws_clients": manager.client_count,
    }


# ── WebSocket Endpoint ──────────────────────────────────────────────────────

@app.websocket("/ws/live")
async def websocket_endpoint(websocket: WebSocket) -> None:
    """
    WebSocket endpoint for live dashboard updates.
    On connect: sends full network snapshot.
    Then receives NODE_UPDATE and ALERT broadcasts from MQTT subscriber.
    """
    await manager.connect(websocket)

    # Send initial snapshot
    try:
        state = get_node_state()
        snapshot = {
            "type": "SNAPSHOT",
            "nodes": list(state.values()),
            "timestamp": datetime.now(timezone.utc).isoformat(),
        }
        await manager.send_personal(websocket, snapshot)
    except Exception as e:
        logger.error(f"Error sending snapshot: {e}")

    # Keep connection alive and handle incoming messages
    try:
        while True:
            # Wait for any client message (ping/pong, etc.)
            data = await websocket.receive_text()
            # Client can send ping/pong or other control messages
            if data == "ping":
                await websocket.send_text('{"type":"PONG"}')
    except WebSocketDisconnect:
        await manager.disconnect(websocket)
    except Exception:
        await manager.disconnect(websocket)
