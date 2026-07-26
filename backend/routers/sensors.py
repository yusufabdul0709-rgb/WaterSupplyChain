"""
Sensors Router — REST endpoints for sensor history data.

GET /api/v1/sensors/{node_id}/history?minutes=30
"""

from __future__ import annotations
from fastapi import APIRouter, Query

from services.database import get_sensor_history

router = APIRouter(prefix="/api/v1/sensors", tags=["sensors"])


@router.get("/{node_id}/history")
async def get_history(
    node_id: str,
    minutes: int = Query(default=30, ge=1, le=1440),
) -> dict:
    """Return the last N minutes of sensor readings for a node."""
    readings = await get_sensor_history(node_id, minutes)
    return {
        "node_id": node_id,
        "readings": readings,
        "count": len(readings),
    }
