"""
Alerts Router — REST endpoints for anomaly alerts.

GET  /api/v1/alerts?status=active&limit=50
POST /api/v1/alerts/{alert_id}/acknowledge
"""

from __future__ import annotations
from fastapi import APIRouter, Query, HTTPException

from services.database import get_alerts, acknowledge_alert

router = APIRouter(prefix="/api/v1/alerts", tags=["alerts"])


@router.get("")
async def list_alerts(
    status: str = Query(default="all", pattern="^(all|active)$"),
    limit: int = Query(default=50, ge=1, le=500),
) -> list[dict]:
    """Return alerts ordered by timestamp DESC."""
    return await get_alerts(status=status, limit=limit)


@router.post("/{alert_id}/acknowledge")
async def ack_alert(alert_id: int) -> dict:
    """Acknowledge an alert by ID."""
    result = await acknowledge_alert(alert_id)
    if result is None:
        raise HTTPException(status_code=404, detail="Alert not found")
    return result
