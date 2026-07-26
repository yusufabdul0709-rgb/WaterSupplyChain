"""
Network Router — REST endpoints for network topology data.

GET /api/v1/network/nodes  — All 15 nodes with current sensor readings
GET /api/v1/network/pipes  — GeoJSON FeatureCollection of all 18 pipes
"""

from __future__ import annotations
from fastapi import APIRouter

from services.mqtt_subscriber import get_node_state

router = APIRouter(prefix="/api/v1/network", tags=["network"])

# ── Node and pipe metadata (same as simulation/network_model.py) ────────────

NODES_META = [
    {"node_id": "RESERVOIR_1",  "lat": 17.4239, "lon": 78.4738, "type": "RESERVOIR"},
    {"node_id": "JUNCTION_01",  "lat": 17.4150, "lon": 78.4700, "type": "JUNCTION"},
    {"node_id": "JUNCTION_02",  "lat": 17.4080, "lon": 78.4760, "type": "JUNCTION"},
    {"node_id": "JUNCTION_03",  "lat": 17.4200, "lon": 78.4800, "type": "JUNCTION"},
    {"node_id": "JUNCTION_04",  "lat": 17.4120, "lon": 78.4850, "type": "JUNCTION"},
    {"node_id": "JUNCTION_05",  "lat": 17.4050, "lon": 78.4820, "type": "JUNCTION"},
    {"node_id": "JUNCTION_06",  "lat": 17.4310, "lon": 78.4780, "type": "JUNCTION"},
    {"node_id": "JUNCTION_07",  "lat": 17.4260, "lon": 78.4840, "type": "JUNCTION"},
    {"node_id": "JUNCTION_08",  "lat": 17.4180, "lon": 78.4910, "type": "JUNCTION"},
    {"node_id": "JUNCTION_09",  "lat": 17.4100, "lon": 78.4950, "type": "JUNCTION"},
    {"node_id": "JUNCTION_10",  "lat": 17.4050, "lon": 78.4880, "type": "JUNCTION"},
    {"node_id": "JUNCTION_11",  "lat": 17.4280, "lon": 78.4680, "type": "JUNCTION"},
    {"node_id": "JUNCTION_12",  "lat": 17.4220, "lon": 78.4640, "type": "JUNCTION"},
    {"node_id": "PUMP_STATION", "lat": 17.4170, "lon": 78.4720, "type": "PUMP"},
    {"node_id": "TANK_01",      "lat": 17.4050, "lon": 78.4750, "type": "TANK"},
]

PIPES_META = [
    {"pipe_id": "PIPE_01", "from_node": "RESERVOIR_1",  "to_node": "JUNCTION_01",  "diameter_mm": 400, "length_m": 850},
    {"pipe_id": "PIPE_02", "from_node": "JUNCTION_01",  "to_node": "JUNCTION_02",  "diameter_mm": 300, "length_m": 620},
    {"pipe_id": "PIPE_03", "from_node": "JUNCTION_01",  "to_node": "JUNCTION_03",  "diameter_mm": 350, "length_m": 740},
    {"pipe_id": "PIPE_04", "from_node": "JUNCTION_02",  "to_node": "JUNCTION_04",  "diameter_mm": 250, "length_m": 510},
    {"pipe_id": "PIPE_05", "from_node": "JUNCTION_03",  "to_node": "JUNCTION_05",  "diameter_mm": 300, "length_m": 680},
    {"pipe_id": "PIPE_06", "from_node": "JUNCTION_04",  "to_node": "JUNCTION_05",  "diameter_mm": 200, "length_m": 430},
    {"pipe_id": "PIPE_07", "from_node": "JUNCTION_03",  "to_node": "JUNCTION_07",  "diameter_mm": 300, "length_m": 590},
    {"pipe_id": "PIPE_08", "from_node": "JUNCTION_06",  "to_node": "JUNCTION_07",  "diameter_mm": 250, "length_m": 460},
    {"pipe_id": "PIPE_09", "from_node": "JUNCTION_07",  "to_node": "JUNCTION_08",  "diameter_mm": 280, "length_m": 720},
    {"pipe_id": "PIPE_10", "from_node": "JUNCTION_08",  "to_node": "JUNCTION_09",  "diameter_mm": 250, "length_m": 530},
    {"pipe_id": "PIPE_11", "from_node": "JUNCTION_09",  "to_node": "JUNCTION_10",  "diameter_mm": 200, "length_m": 410},
    {"pipe_id": "PIPE_12", "from_node": "JUNCTION_05",  "to_node": "JUNCTION_10",  "diameter_mm": 200, "length_m": 380},
    {"pipe_id": "PIPE_13", "from_node": "JUNCTION_01",  "to_node": "JUNCTION_11",  "diameter_mm": 300, "length_m": 650},
    {"pipe_id": "PIPE_14", "from_node": "JUNCTION_11",  "to_node": "JUNCTION_12",  "diameter_mm": 250, "length_m": 480},
    {"pipe_id": "PIPE_15", "from_node": "JUNCTION_12",  "to_node": "JUNCTION_01",  "diameter_mm": 280, "length_m": 520},
    {"pipe_id": "PIPE_16", "from_node": "PUMP_STATION", "to_node": "JUNCTION_02",  "diameter_mm": 350, "length_m": 300},
    {"pipe_id": "PIPE_17", "from_node": "JUNCTION_10",  "to_node": "TANK_01",      "diameter_mm": 200, "length_m": 290},
    {"pipe_id": "PIPE_18", "from_node": "JUNCTION_06",  "to_node": "RESERVOIR_1",  "diameter_mm": 350, "length_m": 700},
]

NODE_COORDS = {n["node_id"]: (n["lat"], n["lon"]) for n in NODES_META}


@router.get("/nodes")
async def get_nodes() -> list[dict]:
    """Return all 15 nodes with current sensor readings."""
    current_state = get_node_state()
    result = []
    for node in NODES_META:
        nid = node["node_id"]
        state = current_state.get(nid, {})
        result.append({
            "node_id": nid,
            "lat": node["lat"],
            "lon": node["lon"],
            "type": node["type"],
            "current": {
                "pressure_bar": state.get("pressure_bar", 0),
                "flow_lps": state.get("flow_lps", 0),
                "ph": state.get("ph", 7.2),
                "status": state.get("status", "OFFLINE"),
                "anomaly_score": state.get("anomaly_score", 0),
            },
        })
    return result


@router.get("/pipes")
async def get_pipes() -> dict:
    """Return GeoJSON FeatureCollection of all 18 pipes."""
    features = []
    for pipe in PIPES_META:
        from_coords = NODE_COORDS.get(pipe["from_node"], (0, 0))
        to_coords = NODE_COORDS.get(pipe["to_node"], (0, 0))
        features.append({
            "type": "Feature",
            "properties": {
                "pipe_id": pipe["pipe_id"],
                "from_node": pipe["from_node"],
                "to_node": pipe["to_node"],
                "diameter_mm": pipe["diameter_mm"],
                "length_m": pipe["length_m"],
                "flow_lps": 0,
                "velocity_mps": 0,
                "status": "NORMAL",
            },
            "geometry": {
                "type": "LineString",
                "coordinates": [
                    [from_coords[1], from_coords[0]],
                    [to_coords[1], to_coords[0]],
                ],
            },
        })
    return {"type": "FeatureCollection", "features": features}
