"""
Database Service — Async SQLite database for the Water Digital Twin.

Manages three tables:
  - sensor_readings: Time-series sensor telemetry
  - alerts: Anomaly alerts with acknowledgment tracking
  - simulation_results: Latest hydraulic simulation outputs

Uses aiosqlite for non-blocking database access with WAL journal mode.
"""

from __future__ import annotations
import os
import aiosqlite
from loguru import logger

# ── Configuration ────────────────────────────────────────────────────────────

DB_PATH: str = os.environ.get("DB_PATH", "./data/waterdt.db")

# ── Schema ───────────────────────────────────────────────────────────────────

SCHEMA_SQL = """
CREATE TABLE IF NOT EXISTS sensor_readings (
    id             INTEGER PRIMARY KEY AUTOINCREMENT,
    node_id        TEXT NOT NULL,
    timestamp      DATETIME DEFAULT CURRENT_TIMESTAMP,
    pressure_bar   REAL,
    flow_lps       REAL,
    ph             REAL,
    status         TEXT DEFAULT 'NORMAL',
    anomaly_score  REAL DEFAULT 0.0
);

CREATE TABLE IF NOT EXISTS alerts (
    id             INTEGER PRIMARY KEY AUTOINCREMENT,
    timestamp      DATETIME DEFAULT CURRENT_TIMESTAMP,
    type           TEXT,
    severity       TEXT,
    node_id        TEXT,
    pipe_id        TEXT,
    description    TEXT,
    acknowledged   INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS simulation_results (
    id                  INTEGER PRIMARY KEY AUTOINCREMENT,
    timestamp           DATETIME DEFAULT CURRENT_TIMESTAMP,
    node_id             TEXT,
    sim_pressure_bar    REAL,
    sim_flow_lps        REAL,
    residual_pressure   REAL,
    residual_flow       REAL
);

CREATE TABLE IF NOT EXISTS users (
    id             INTEGER PRIMARY KEY AUTOINCREMENT,
    username       TEXT UNIQUE NOT NULL,
    email          TEXT UNIQUE NOT NULL,
    password_hash  TEXT NOT NULL,
    role           TEXT NOT NULL,
    sector_id      TEXT DEFAULT 'HQ',
    full_name      TEXT,
    phone          TEXT,
    created_at     DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS sectors (
    id             TEXT PRIMARY KEY,
    name           TEXT NOT NULL,
    zone           TEXT NOT NULL,
    admin_email    TEXT,
    center_lat     REAL,
    center_lon     REAL,
    contact_phone  TEXT,
    created_at     DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS complaints (
    id                TEXT PRIMARY KEY,
    citizen_name      TEXT,
    phone             TEXT,
    email             TEXT,
    ward              TEXT,
    location          TEXT,
    lat               REAL,
    lon               REAL,
    issue_type        TEXT NOT NULL,
    priority          TEXT DEFAULT 'HIGH',
    status            TEXT DEFAULT 'PENDING',
    sector_id         TEXT NOT NULL,
    description       TEXT,
    ai_recommendation TEXT,
    assigned_engineer TEXT,
    created_at        DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_sensor_node_ts ON sensor_readings(node_id, timestamp);
CREATE INDEX IF NOT EXISTS idx_alerts_ts ON alerts(timestamp);
CREATE INDEX IF NOT EXISTS idx_sim_ts ON simulation_results(timestamp);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_complaints_sector ON complaints(sector_id);
"""


async def get_db() -> aiosqlite.Connection:
    """Open a database connection with WAL mode enabled."""
    os.makedirs(os.path.dirname(DB_PATH) or ".", exist_ok=True)
    db = await aiosqlite.connect(DB_PATH)
    await db.execute("PRAGMA journal_mode=WAL")
    await db.execute("PRAGMA synchronous=NORMAL")
    db.row_factory = aiosqlite.Row
    return db


async def init_db() -> None:
    """Initialize database tables and seed default GVMC accounts."""
    logger.info(f"Initializing database at {DB_PATH}")
    db = await get_db()
    try:
        await db.executescript(SCHEMA_SQL)
        await db.commit()
        await _seed_default_data(db)
        logger.info("Database tables and seed data initialized successfully")
    finally:
        await db.close()


async def _seed_default_data(db: aiosqlite.Connection) -> None:
    """Seed initial GVMC HQ Admin, Sector Admins, and Visakhapatnam sectors."""
    sectors_data = [
        ("SEC_GAJUWAKA", "Gajuwaka Sector", "Zone 1", "gajuwaka@gvmc.gov.in", 17.6850, 83.2150, "+91 891 250001"),
        ("SEC_MVP", "MVP Colony Sector", "Zone 2", "mvpcolony@gvmc.gov.in", 17.7350, 83.3300, "+91 891 250002"),
        ("SEC_SEETHAM", "Seethammadhara Sector", "Zone 3", "seethammadhara@gvmc.gov.in", 17.7400, 83.3050, "+91 891 250003"),
        ("SEC_MADHURA", "Madhurawada Sector", "Zone 4", "madhurawada@gvmc.gov.in", 17.8100, 83.3500, "+91 891 250004"),
        ("SEC_ANAKAPALLE", "Anakapalle Sector", "Zone 5", "anakapalle@gvmc.gov.in", 17.6900, 83.0000, "+91 891 250005"),
    ]

    for sec in sectors_data:
        await db.execute(
            """INSERT OR IGNORE INTO sectors
               (id, name, zone, admin_email, center_lat, center_lon, contact_phone)
               VALUES (?, ?, ?, ?, ?, ?, ?)""",
            sec,
        )

    users_data = [
        ("admin", "admin@gvmc.gov.in", "gvmc2026", "GVMC_HQ_ADMIN", "HQ", "GVMC Municipal Commissioner HQ", "+91 891 275000"),
        ("sec_gajuwaka", "gajuwaka@gvmc.gov.in", "sec_gajuwaka", "SECTOR_ADMIN", "SEC_GAJUWAKA", "Er. K. Rao (Gajuwaka Head)", "+91 98480 11111"),
        ("sec_mvp", "mvpcolony@gvmc.gov.in", "sec_mvp", "SECTOR_ADMIN", "SEC_MVP", "Er. S. Naidu (MVP Head)", "+91 98480 22222"),
        ("sec_seetham", "seethammadhara@gvmc.gov.in", "sec_seetham", "SECTOR_ADMIN", "SEC_SEETHAM", "Er. P. Verma (Seethammadhara Head)", "+91 98480 33333"),
        ("sec_madhura", "madhurawada@gvmc.gov.in", "sec_madhura", "SECTOR_ADMIN", "SEC_MADHURA", "Er. B. Reddy (Madhurawada Head)", "+91 98480 44444"),
        ("sec_anakapalle", "anakapalle@gvmc.gov.in", "anakapalle@gvmc.gov.in", "SECTOR_ADMIN", "SEC_ANAKAPALLE", "Er. M. Sharma (Anakapalle Head)", "+91 98480 55555"),
    ]

    for u in users_data:
        await db.execute(
            """INSERT OR IGNORE INTO users
               (username, email, password_hash, role, sector_id, full_name, phone)
               VALUES (?, ?, ?, ?, ?, ?, ?)""",
            u,
        )

    await db.commit()


# ── Authentication & User CRUD ───────────────────────────────────────────────

async def get_user_by_email(email: str) -> dict | None:
    """Find a user by email address."""
    db = await get_db()
    try:
        cursor = await db.execute("SELECT * FROM users WHERE email = ?", (email,))
        row = await cursor.fetchone()
        if row:
            return dict(row)
        return None
    finally:
        await db.close()


async def create_user(
    username: str,
    email: str,
    password_hash: str,
    role: str,
    sector_id: str = "HQ",
    full_name: str = "",
    phone: str = "",
) -> dict:
    """Create a new user / sector admin account."""
    db = await get_db()
    try:
        cursor = await db.execute(
            """INSERT INTO users (username, email, password_hash, role, sector_id, full_name, phone)
               VALUES (?, ?, ?, ?, ?, ?, ?)""",
            (username, email, password_hash, role, sector_id, full_name, phone),
        )
        await db.commit()
        user_id = cursor.lastrowid
        return {
            "id": user_id,
            "username": username,
            "email": email,
            "role": role,
            "sector_id": sector_id,
            "full_name": full_name,
            "phone": phone,
        }
    finally:
        await db.close()


# ── Sector Management ────────────────────────────────────────────────────────

async def get_all_sectors() -> list[dict]:
    """Return all GVMC sectors."""
    db = await get_db()
    try:
        cursor = await db.execute("SELECT * FROM sectors ORDER BY name ASC")
        rows = await cursor.fetchall()
        return [dict(r) for r in rows]
    finally:
        await db.close()


async def create_sector(
    sector_id: str,
    name: str,
    zone: str,
    admin_email: str,
    center_lat: float,
    center_lon: float,
    contact_phone: str,
) -> dict:
    """Create a new sector."""
    db = await get_db()
    try:
        await db.execute(
            """INSERT INTO sectors (id, name, zone, admin_email, center_lat, center_lon, contact_phone)
               VALUES (?, ?, ?, ?, ?, ?, ?)""",
            (sector_id, name, zone, admin_email, center_lat, center_lon, contact_phone),
        )
        await db.commit()
        return {
            "id": sector_id,
            "name": name,
            "zone": zone,
            "admin_email": admin_email,
            "center_lat": center_lat,
            "center_lon": center_lon,
            "contact_phone": contact_phone,
        }
    finally:
        await db.close()


# ── Complaint & GPS Auto-Routing ──────────────────────────────────────────────

async def insert_complaint(complaint_data: dict) -> dict:
    """Insert a citizen complaint with auto-assigned sector_id."""
    db = await get_db()
    try:
        await db.execute(
            """INSERT INTO complaints
               (id, citizen_name, phone, email, ward, location, lat, lon, issue_type, priority, status, sector_id, description, ai_recommendation, assigned_engineer)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)""",
            (
                complaint_data["id"],
                complaint_data.get("citizen_name", "Anonymous"),
                complaint_data.get("phone", ""),
                complaint_data.get("email", ""),
                complaint_data.get("ward", ""),
                complaint_data.get("location", ""),
                complaint_data.get("lat", 17.7231),
                complaint_data.get("lon", 83.3012),
                complaint_data["issue_type"],
                complaint_data.get("priority", "HIGH"),
                complaint_data.get("status", "PENDING"),
                complaint_data["sector_id"],
                complaint_data.get("description", ""),
                complaint_data.get("ai_recommendation", "AI analyzing line telemetry..."),
                complaint_data.get("assigned_engineer", "Sector Auto-Dispatch"),
            ),
        )
        await db.commit()
        return complaint_data
    finally:
        await db.close()


async def get_complaints_by_sector(sector_id: str | None = None) -> list[dict]:
    """Retrieve complaints. If sector_id is provided, filter by that sector only."""
    db = await get_db()
    try:
        if sector_id and sector_id != "HQ":
            cursor = await db.execute(
                "SELECT * FROM complaints WHERE sector_id = ? ORDER BY created_at DESC",
                (sector_id,),
            )
        else:
            cursor = await db.execute("SELECT * FROM complaints ORDER BY created_at DESC")
        rows = await cursor.fetchall()
        return [dict(r) for r in rows]
    finally:
        await db.close()


# ── Sensor Readings ─────────────────────────────────────────────────────────

async def insert_sensor_reading(
    node_id: str,
    timestamp: str,
    pressure_bar: float,
    flow_lps: float,
    ph: float,
    status: str,
    anomaly_score: float,
) -> None:
    """Insert a sensor reading into the database."""
    db = await get_db()
    try:
        await db.execute(
            """INSERT INTO sensor_readings
               (node_id, timestamp, pressure_bar, flow_lps, ph, status, anomaly_score)
               VALUES (?, ?, ?, ?, ?, ?, ?)""",
            (node_id, timestamp, pressure_bar, flow_lps, ph, status, anomaly_score),
        )
        await db.commit()
    finally:
        await db.close()


async def get_sensor_history(node_id: str, minutes: int = 30) -> list[dict]:
    """Get the last N minutes of sensor readings for a node."""
    db = await get_db()
    try:
        cursor = await db.execute(
            """SELECT node_id, timestamp, pressure_bar, flow_lps, ph, status, anomaly_score
               FROM sensor_readings
               WHERE node_id = ?
                 AND timestamp >= datetime('now', ?)
               ORDER BY timestamp DESC
               LIMIT 5000""",
            (node_id, f"-{minutes} minutes"),
        )
        rows = await cursor.fetchall()
        return [
            {
                "node_id": row["node_id"],
                "timestamp": row["timestamp"],
                "pressure_bar": row["pressure_bar"],
                "flow_lps": row["flow_lps"],
                "ph": row["ph"],
                "status": row["status"],
                "anomaly_score": row["anomaly_score"],
            }
            for row in rows
        ]
    finally:
        await db.close()


# ── Alerts ───────────────────────────────────────────────────────────────────

async def insert_alert(
    alert_type: str,
    severity: str,
    node_id: str = "",
    pipe_id: str = "",
    description: str = "",
    timestamp: str = "",
) -> int:
    """Insert an alert and return its ID."""
    db = await get_db()
    try:
        cursor = await db.execute(
            """INSERT INTO alerts (timestamp, type, severity, node_id, pipe_id, description)
               VALUES (COALESCE(NULLIF(?, ''), datetime('now')), ?, ?, ?, ?, ?)""",
            (timestamp, alert_type, severity, node_id, pipe_id, description),
        )
        await db.commit()
        return cursor.lastrowid or 0
    finally:
        await db.close()


async def get_alerts(status: str = "all", limit: int = 50) -> list[dict]:
    """Get alerts, optionally filtering by acknowledgment status."""
    db = await get_db()
    try:
        if status == "active":
            cursor = await db.execute(
                """SELECT * FROM alerts WHERE acknowledged = 0
                   ORDER BY timestamp DESC LIMIT ?""",
                (limit,),
            )
        else:
            cursor = await db.execute(
                "SELECT * FROM alerts ORDER BY timestamp DESC LIMIT ?",
                (limit,),
            )
        rows = await cursor.fetchall()
        return [
            {
                "id": row["id"],
                "timestamp": row["timestamp"],
                "type": row["type"],
                "severity": row["severity"],
                "node_id": row["node_id"],
                "pipe_id": row["pipe_id"],
                "description": row["description"],
                "acknowledged": bool(row["acknowledged"]),
            }
            for row in rows
        ]
    finally:
        await db.close()


async def acknowledge_alert(alert_id: int) -> dict | None:
    """Acknowledge an alert by ID. Returns updated alert or None."""
    db = await get_db()
    try:
        await db.execute(
            "UPDATE alerts SET acknowledged = 1 WHERE id = ?",
            (alert_id,),
        )
        await db.commit()
        cursor = await db.execute("SELECT * FROM alerts WHERE id = ?", (alert_id,))
        row = await cursor.fetchone()
        if row:
            return {
                "id": row["id"],
                "timestamp": row["timestamp"],
                "type": row["type"],
                "severity": row["severity"],
                "node_id": row["node_id"],
                "pipe_id": row["pipe_id"],
                "description": row["description"],
                "acknowledged": bool(row["acknowledged"]),
            }
        return None
    finally:
        await db.close()


# ── Simulation Results ───────────────────────────────────────────────────────

async def insert_simulation_result(
    node_id: str,
    sim_pressure_bar: float,
    sim_flow_lps: float,
    residual_pressure: float = 0.0,
    residual_flow: float = 0.0,
) -> None:
    """Insert a simulation result."""
    db = await get_db()
    try:
        await db.execute(
            """INSERT INTO simulation_results
               (node_id, sim_pressure_bar, sim_flow_lps, residual_pressure, residual_flow)
               VALUES (?, ?, ?, ?, ?)""",
            (node_id, sim_pressure_bar, sim_flow_lps, residual_pressure, residual_flow),
        )
        await db.commit()
    finally:
        await db.close()


async def get_latest_simulation() -> list[dict]:
    """Get the most recent simulation results for all nodes."""
    db = await get_db()
    try:
        cursor = await db.execute(
            """SELECT sr.* FROM simulation_results sr
               INNER JOIN (
                   SELECT node_id, MAX(timestamp) as max_ts
                   FROM simulation_results
                   GROUP BY node_id
               ) latest ON sr.node_id = latest.node_id AND sr.timestamp = latest.max_ts"""
        )
        rows = await cursor.fetchall()
        return [
            {
                "node_id": row["node_id"],
                "timestamp": row["timestamp"],
                "sim_pressure_bar": row["sim_pressure_bar"],
                "sim_flow_lps": row["sim_flow_lps"],
                "residual_pressure": row["residual_pressure"],
                "residual_flow": row["residual_flow"],
            }
            for row in rows
        ]
    finally:
        await db.close()


# ── Maintenance ──────────────────────────────────────────────────────────────

async def cleanup_old_readings(hours: int = 24) -> int:
    """Delete sensor readings older than N hours. Returns count deleted."""
    db = await get_db()
    try:
        cursor = await db.execute(
            """DELETE FROM sensor_readings
               WHERE timestamp < datetime('now', ?)""",
            (f"-{hours} hours",),
        )
        await db.commit()
        return cursor.rowcount
    finally:
        await db.close()
