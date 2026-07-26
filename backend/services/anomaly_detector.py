"""
Anomaly Detector — Rule-based anomaly detection for the Water Digital Twin.

Applies instant threshold checks on every sensor reading and periodic
rolling-window analysis for trend detection.

Instant rules:
  - pressure_bar < 1.5       → CRITICAL "Low Pressure Warning"
  - pressure_bar > 9.0       → HIGH     "High Pressure Warning"
  - flow_lps > 45.0          → HIGH     "Abnormal Flow Rate"
  - flow_lps < 0.5 (peak)    → HIGH     "Flow Blockage Suspected"
  - ph < 6.5 or ph > 8.5     → CRITICAL "Water Quality Alert"

Rolling window (5-min, checked every 60s):
  - Pressure drop > 1.5 bar in 60s  → CRITICAL "Sudden Pressure Drop — Burst?"
  - Flow increase > 30% in 60s      → HIGH     "Flow Spike Detected"
"""

from __future__ import annotations
import asyncio
import time
from collections import deque
from datetime import datetime, timezone
from typing import Any

from loguru import logger

from services.database import insert_alert
from websocket_manager import manager

# ── Rolling window storage ──────────────────────────────────────────────────

# Per-node history for rolling window checks: deque of (timestamp, pressure, flow)
_node_history: dict[str, deque] = {}
WINDOW_SIZE = 300  # 5 minutes in seconds

# Deduplication: prevent duplicate alerts within cooldown period
_recent_alerts: dict[str, float] = {}  # key → timestamp
ALERT_COOLDOWN = 120  # seconds


def _is_peak_hour() -> bool:
    """Check if current time is during peak demand hours (6-10 AM, 5-10 PM IST)."""
    hour = datetime.now().hour  # System timezone
    return (6 <= hour <= 10) or (17 <= hour <= 22)


def _should_alert(alert_key: str) -> bool:
    """Check if we should fire an alert (respects cooldown period)."""
    now = time.time()
    last_alert = _recent_alerts.get(alert_key, 0)
    if now - last_alert < ALERT_COOLDOWN:
        return False
    _recent_alerts[alert_key] = now
    return True


async def _fire_alert(
    alert_type: str,
    severity: str,
    node_id: str,
    pipe_id: str,
    description: str,
) -> None:
    """Create and broadcast an alert."""
    alert_key = f"{alert_type}:{node_id}:{pipe_id}"
    if not _should_alert(alert_key):
        return

    timestamp = datetime.now(timezone.utc).isoformat()
    logger.warning(f"⚠ Alert: [{severity}] {description} (node={node_id})")

    try:
        alert_id = await insert_alert(
            alert_type=alert_type,
            severity=severity,
            node_id=node_id,
            pipe_id=pipe_id,
            description=description,
            timestamp=timestamp,
        )

        await manager.broadcast({
            "type": "ALERT",
            "id": alert_id,
            "alert_type": alert_type,
            "severity": severity,
            "node_id": node_id,
            "pipe_id": pipe_id,
            "description": description,
            "timestamp": timestamp,
        })
    except Exception as e:
        logger.error(f"Failed to fire alert: {e}")


async def check_reading(reading: dict) -> None:
    """
    Run instant threshold checks on a sensor reading.
    Called for every incoming MQTT telemetry message.
    """
    node_id = reading.get("node_id", "")
    pressure = reading.get("pressure_bar", 4.0)
    flow = reading.get("flow_lps", 10.0)
    ph = reading.get("ph", 7.2)

    # Update rolling window
    now = time.time()
    if node_id not in _node_history:
        _node_history[node_id] = deque(maxlen=500)
    _node_history[node_id].append((now, pressure, flow))

    # ── Instant threshold checks ──

    if pressure < 1.5:
        await _fire_alert(
            "PRESSURE", "CRITICAL", node_id, "",
            f"Low Pressure Warning at {node_id}: {pressure:.2f} bar",
        )

    if pressure > 9.0:
        await _fire_alert(
            "PRESSURE", "HIGH", node_id, "",
            f"High Pressure Warning at {node_id}: {pressure:.2f} bar",
        )

    if flow > 45.0:
        await _fire_alert(
            "FLOW", "HIGH", node_id, "",
            f"Abnormal Flow Rate at {node_id}: {flow:.1f} L/s",
        )

    if flow < 0.5 and _is_peak_hour():
        await _fire_alert(
            "FLOW", "HIGH", node_id, "",
            f"Flow Blockage Suspected at {node_id}: {flow:.1f} L/s during peak hours",
        )

    if ph < 6.5 or ph > 8.5:
        await _fire_alert(
            "QUALITY", "CRITICAL", node_id, "",
            f"Water Quality Alert at {node_id}: pH {ph:.2f}",
        )


async def check_rolling_windows() -> None:
    """
    Periodic check for rolling-window anomalies.
    Should be called every 60 seconds.
    """
    now = time.time()

    for node_id, history in _node_history.items():
        if len(history) < 10:
            continue

        # Clean old entries
        while history and (now - history[0][0]) > WINDOW_SIZE:
            history.popleft()

        if len(history) < 5:
            continue

        # Get readings from ~60 seconds ago and now
        recent = history[-1]
        target_time = now - 60

        # Find the reading closest to 60s ago
        older = None
        for entry in history:
            if entry[0] >= target_time:
                older = entry
                break

        if older is None or older == recent:
            continue

        # Check for sudden pressure drop
        pressure_drop = older[1] - recent[1]
        if pressure_drop > 1.5:
            await _fire_alert(
                "BURST", "CRITICAL", node_id, "",
                f"Sudden Pressure Drop at {node_id}: -{pressure_drop:.2f} bar in 60s — Burst?",
            )

        # Check for flow spike (>30% increase)
        if older[2] > 0:
            flow_increase_pct = (recent[2] - older[2]) / older[2]
            if flow_increase_pct > 0.30:
                await _fire_alert(
                    "FLOW", "HIGH", node_id, "",
                    f"Flow Spike Detected at {node_id}: +{flow_increase_pct*100:.0f}% in 60s",
                )


async def rolling_window_loop(stop_event: asyncio.Event | None = None) -> None:
    """
    Background task that runs rolling window checks every 60 seconds.
    """
    logger.info("Rolling window anomaly detector started")
    while True:
        if stop_event and stop_event.is_set():
            break
        await asyncio.sleep(60)
        try:
            await check_rolling_windows()
        except Exception as e:
            logger.error(f"Rolling window check error: {e}")
