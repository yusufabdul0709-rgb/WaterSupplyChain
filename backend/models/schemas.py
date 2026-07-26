"""
Pydantic v2 schemas for the Water Digital Twin API.

All request/response models used across REST endpoints and WebSocket messages.
"""

from __future__ import annotations
from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field


# ── Sensor Data ──────────────────────────────────────────────────────────────

class SensorReading(BaseModel):
    """A single sensor telemetry reading from a node."""
    node_id: str
    timestamp: str
    pressure_bar: float = Field(ge=0, le=15)
    flow_lps: float = Field(ge=0)
    ph: float = Field(ge=4, le=11)
    status: str = "NORMAL"  # NORMAL, WARNING, CRITICAL, OFFLINE
    anomaly_score: float = Field(ge=0, le=1, default=0.0)


class NodeCurrent(BaseModel):
    """Current readings for a node (embedded in NodeInfo)."""
    pressure_bar: float = 0.0
    flow_lps: float = 0.0
    ph: float = 7.2
    status: str = "NORMAL"
    anomaly_score: float = 0.0


class NodeInfo(BaseModel):
    """Full node information including position and current readings."""
    node_id: str
    lat: float
    lon: float
    type: str  # RESERVOIR, JUNCTION, PUMP, TANK
    current: NodeCurrent = Field(default_factory=NodeCurrent)


class SensorHistory(BaseModel):
    """Time-series sensor data for a node."""
    node_id: str
    readings: list[SensorReading] = []
    count: int = 0


# ── Pipe Data ────────────────────────────────────────────────────────────────

class PipeProperties(BaseModel):
    """Properties for a GeoJSON pipe feature."""
    pipe_id: str
    from_node: str
    to_node: str
    diameter_mm: float
    flow_lps: float = 0.0
    velocity_mps: float = 0.0
    status: str = "NORMAL"


class PipeFeature(BaseModel):
    """GeoJSON Feature for a pipe."""
    type: str = "Feature"
    properties: PipeProperties
    geometry: dict


class PipeCollection(BaseModel):
    """GeoJSON FeatureCollection for all pipes."""
    type: str = "FeatureCollection"
    features: list[PipeFeature] = []


# ── Alerts ───────────────────────────────────────────────────────────────────

class Alert(BaseModel):
    """An anomaly alert record."""
    id: int = 0
    timestamp: str = ""
    type: str  # BURST, LEAK, BLOCK, PRESSURE, QUALITY, FLOW
    severity: str  # CRITICAL, HIGH, WARNING
    node_id: str = ""
    pipe_id: str = ""
    description: str = ""
    acknowledged: bool = False


class AlertCreate(BaseModel):
    """Schema for creating a new alert."""
    type: str
    severity: str
    node_id: str = ""
    pipe_id: str = ""
    description: str = ""


# ── Simulation ───────────────────────────────────────────────────────────────

class SimulationResult(BaseModel):
    """Simulation result for a single node."""
    node_id: str
    timestamp: str = ""
    sim_pressure_bar: float = 0.0
    sim_flow_lps: float = 0.0
    residual_pressure: float = 0.0
    residual_flow: float = 0.0


# ── WebSocket Messages ──────────────────────────────────────────────────────

class WSNodeUpdate(BaseModel):
    """WebSocket message for node updates."""
    type: str = "NODE_UPDATE"
    node_id: str
    timestamp: str
    pressure_bar: float
    flow_lps: float
    ph: float
    status: str
    anomaly_score: float


class WSAlert(BaseModel):
    """WebSocket message for alert events."""
    type: str = "ALERT"
    id: int = 0
    alert_type: str = ""
    severity: str
    node_id: str = ""
    pipe_id: str = ""
    description: str
    timestamp: str


class WSSnapshot(BaseModel):
    """Full network snapshot sent on WebSocket connect."""
    type: str = "SNAPSHOT"
    nodes: list[dict] = []
    pipes: list[dict] = []
    alerts: list[dict] = []
    timestamp: str = ""


# ── Health ───────────────────────────────────────────────────────────────────

class HealthResponse(BaseModel):
    """Health check response."""
    status: str = "ok"
    mqtt_connected: bool = False
    db: str = "ok"
    uptime_seconds: float = 0.0
    sensor_count: int = 0
