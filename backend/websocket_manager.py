"""
WebSocket Manager — Manages WebSocket connections and broadcasts.

Handles client registration, disconnection, keepalive pings, and
broadcast of real-time updates (node telemetry, alerts, snapshots).
"""

from __future__ import annotations
import asyncio
import json
from typing import Any

from fastapi import WebSocket, WebSocketDisconnect
from loguru import logger


class ConnectionManager:
    """Manages active WebSocket connections with broadcast capability."""

    def __init__(self) -> None:
        self.active_connections: list[WebSocket] = []
        self._lock = asyncio.Lock()

    async def connect(self, websocket: WebSocket) -> None:
        """Accept and register a new WebSocket connection."""
        await websocket.accept()
        async with self._lock:
            self.active_connections.append(websocket)
        logger.info(
            f"WebSocket connected — total clients: {len(self.active_connections)}"
        )

    async def disconnect(self, websocket: WebSocket) -> None:
        """Remove a WebSocket connection."""
        async with self._lock:
            if websocket in self.active_connections:
                self.active_connections.remove(websocket)
        logger.info(
            f"WebSocket disconnected — total clients: {len(self.active_connections)}"
        )

    async def broadcast(self, message: dict | str) -> None:
        """Broadcast a message to all connected clients."""
        if not self.active_connections:
            return

        if isinstance(message, dict):
            data = json.dumps(message)
        else:
            data = message

        disconnected: list[WebSocket] = []
        async with self._lock:
            for ws in self.active_connections:
                try:
                    await ws.send_text(data)
                except Exception:
                    disconnected.append(ws)

        # Clean up broken connections
        for ws in disconnected:
            async with self._lock:
                if ws in self.active_connections:
                    self.active_connections.remove(ws)

    async def send_personal(self, websocket: WebSocket, message: dict) -> None:
        """Send a message to a specific client."""
        try:
            await websocket.send_text(json.dumps(message))
        except Exception as e:
            logger.error(f"Failed to send personal message: {e}")
            await self.disconnect(websocket)

    @property
    def client_count(self) -> int:
        """Return number of active connections."""
        return len(self.active_connections)

    async def ping_all(self) -> None:
        """Send ping to all clients to keep connections alive."""
        disconnected: list[WebSocket] = []
        async with self._lock:
            for ws in self.active_connections:
                try:
                    await ws.send_text(json.dumps({"type": "PING"}))
                except Exception:
                    disconnected.append(ws)

        for ws in disconnected:
            async with self._lock:
                if ws in self.active_connections:
                    self.active_connections.remove(ws)


# Singleton instance
manager = ConnectionManager()
