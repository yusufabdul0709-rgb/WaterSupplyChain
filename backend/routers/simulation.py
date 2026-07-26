"""
Simulation Router — REST endpoints for hydraulic simulation results.

GET /api/v1/simulation/latest — Latest simulation results for all nodes
"""

from __future__ import annotations
from fastapi import APIRouter

from services.database import get_latest_simulation

router = APIRouter(prefix="/api/v1/simulation", tags=["simulation"])


@router.get("/latest")
async def get_latest() -> list[dict]:
    """Return most recent simulation results for all nodes."""
    return await get_latest_simulation()
