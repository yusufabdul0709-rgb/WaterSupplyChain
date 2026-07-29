/**
 * useTelemetry.js — Central data hook for the Digital Twin.
 *
 * Connects to the existing backend REST APIs and WebSocket to provide
 * real-time node, pipe, and alert data. No fake data is generated.
 *
 * Data flow:
 *   1. On mount: fetch nodes, pipes, alerts from REST APIs
 *   2. Open WebSocket to /ws/live
 *   3. SNAPSHOT → initial state hydration
 *   4. NODE_UPDATE → update single node in-place (no full re-fetch)
 *   5. ALERT → prepend to alerts array
 *   6. Derive per-pipe flow/pressure from connected node states
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import { buildNodeMap } from '../utils/geoHelpers';

const WS_URL = `${window.location.protocol === 'https:' ? 'wss:' : 'ws:'}//${window.location.host}/ws/live`;
const RECONNECT_BASE_DELAY = 2000;
const RECONNECT_MAX_DELAY = 30000;

export default function useTelemetry() {
  const [nodes, setNodes] = useState([]);
  const [pipes, setPipes] = useState(null); // GeoJSON FeatureCollection
  const [alerts, setAlerts] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(null);

  const wsRef = useRef(null);
  const reconnectAttempt = useRef(0);
  const reconnectTimer = useRef(null);
  const nodesRef = useRef([]);

  // Keep nodesRef in sync for WebSocket callback access
  useEffect(() => {
    nodesRef.current = nodes;
  }, [nodes]);

  /**
   * Fetch initial data from REST APIs.
   */
  const fetchInitialData = useCallback(async () => {
    try {
      const [nodesRes, pipesRes, alertsRes] = await Promise.all([
        fetch('/api/v1/network/nodes'),
        fetch('/api/v1/network/pipes'),
        fetch('/api/v1/alerts?status=active&limit=50'),
      ]);

      if (nodesRes.ok) {
        const nodesData = await nodesRes.json();
        const shiftedNodes = nodesData.map(node => ({
          ...node,
          lat: node.lat + 0.320,
          lon: node.lon + 4.810
        }));
        setNodes(shiftedNodes);
      }

      if (pipesRes.ok) {
        const pipesData = await pipesRes.json();
        const shiftedPipes = {
          ...pipesData,
          features: pipesData.features.map(feature => ({
            ...feature,
            geometry: {
              ...feature.geometry,
              coordinates: feature.geometry.coordinates.map(([lon, lat]) => [
                lon + 4.810,
                lat + 0.320
              ])
            }
          }))
        };
        setPipes(shiftedPipes);
      }

      if (alertsRes.ok) {
        const alertsData = await alertsRes.json();
        setAlerts(alertsData);
      }
    } catch (err) {
      console.error('[useTelemetry] Failed to fetch initial data:', err);
    }
  }, []);

  /**
   * Apply a NODE_UPDATE message to the nodes array.
   * Only updates the matching node — does not replace the entire array
   * unless the node_id actually changed.
   */
  const applyNodeUpdate = useCallback((update) => {
    setNodes((prevNodes) => {
      const idx = prevNodes.findIndex((n) => n.node_id === update.node_id);
      if (idx === -1) return prevNodes;

      const updated = [...prevNodes];
      updated[idx] = {
        ...updated[idx],
        current: {
          pressure_bar: update.pressure_bar ?? updated[idx].current?.pressure_bar ?? 0,
          flow_lps: update.flow_lps ?? updated[idx].current?.flow_lps ?? 0,
          ph: update.ph ?? updated[idx].current?.ph ?? 7.2,
          status: update.status ?? updated[idx].current?.status ?? 'NORMAL',
          anomaly_score: update.anomaly_score ?? updated[idx].current?.anomaly_score ?? 0,
        },
      };
      return updated;
    });
    setLastUpdate(new Date().toISOString());
  }, []);

  /**
   * Apply a SNAPSHOT message to hydrate full state.
   */
  const applySnapshot = useCallback((snapshot) => {
    if (snapshot.nodes && snapshot.nodes.length) {
      // Snapshot nodes may be flat (from MQTT state), merge with existing metadata
      setNodes((prevNodes) => {
        if (!prevNodes.length) return prevNodes;
        const stateMap = {};
        for (const n of snapshot.nodes) {
          stateMap[n.node_id] = n;
        }
        return prevNodes.map((node) => {
          const state = stateMap[node.node_id];
          if (!state) return node;
          return {
            ...node,
            current: {
              pressure_bar: state.pressure_bar ?? node.current?.pressure_bar ?? 0,
              flow_lps: state.flow_lps ?? node.current?.flow_lps ?? 0,
              ph: state.ph ?? node.current?.ph ?? 7.2,
              status: state.status ?? node.current?.status ?? 'NORMAL',
              anomaly_score: state.anomaly_score ?? node.current?.anomaly_score ?? 0,
            },
          };
        });
      });
    }
    setLastUpdate(new Date().toISOString());
  }, []);

  /**
   * Connect to the WebSocket with auto-reconnect.
   */
  const connectWebSocket = useCallback(() => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) return;

    try {
      const ws = new WebSocket(WS_URL);
      wsRef.current = ws;

      ws.onopen = () => {
        console.log('[useTelemetry] WebSocket connected');
        setIsConnected(true);
        reconnectAttempt.current = 0;
      };

      ws.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data);

          switch (msg.type) {
            case 'SNAPSHOT':
              applySnapshot(msg);
              break;

            case 'NODE_UPDATE':
              applyNodeUpdate(msg);
              break;

            case 'ALERT':
              setAlerts((prev) => [msg, ...prev].slice(0, 100));
              break;

            case 'PONG':
              // Heartbeat response, ignore
              break;

            default:
              break;
          }
        } catch (parseErr) {
          // Ignore non-JSON messages
        }
      };

      ws.onclose = () => {
        console.log('[useTelemetry] WebSocket disconnected');
        setIsConnected(false);
        wsRef.current = null;
        scheduleReconnect();
      };

      ws.onerror = (err) => {
        console.warn('[useTelemetry] WebSocket error:', err);
        ws.close();
      };
    } catch (err) {
      console.error('[useTelemetry] WebSocket connection failed:', err);
      scheduleReconnect();
    }
  }, [applyNodeUpdate, applySnapshot]);

  /**
   * Schedule a reconnection attempt with exponential backoff.
   */
  const scheduleReconnect = useCallback(() => {
    if (reconnectTimer.current) clearTimeout(reconnectTimer.current);
    const delay = Math.min(
      RECONNECT_BASE_DELAY * Math.pow(2, reconnectAttempt.current),
      RECONNECT_MAX_DELAY
    );
    reconnectAttempt.current += 1;
    reconnectTimer.current = setTimeout(connectWebSocket, delay);
  }, [connectWebSocket]);

  /**
   * Send periodic pings to keep the connection alive.
   */
  useEffect(() => {
    const interval = setInterval(() => {
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.send('ping');
      }
    }, 25000);
    return () => clearInterval(interval);
  }, []);

  /**
   * Initialize on mount: fetch REST data, then open WebSocket.
   */
  useEffect(() => {
    fetchInitialData().then(() => {
      connectWebSocket();
    });

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
      if (reconnectTimer.current) {
        clearTimeout(reconnectTimer.current);
      }
    };
  }, [fetchInitialData, connectWebSocket]);

  /**
   * Derive a node lookup map for quick access by node_id.
   */
  const nodeMap = buildNodeMap(nodes);

  /**
   * Enrich pipe features with flow data from connected nodes.
   */
  const enrichedPipes = pipes
    ? {
        ...pipes,
        features: pipes.features.map((feature) => {
          const from = nodeMap[feature.properties.from_node];
          const to = nodeMap[feature.properties.to_node];
          const avgFlow = ((from?.flow_lps || 0) + (to?.flow_lps || 0)) / 2;
          const avgPressure = ((from?.pressure_bar || 0) + (to?.pressure_bar || 0)) / 2;
          return {
            ...feature,
            properties: {
              ...feature.properties,
              flow_lps: avgFlow,
              pressure_bar: avgPressure,
              velocity_mps: avgFlow > 0 ? avgFlow / (Math.PI * Math.pow(feature.properties.diameter_mm / 2000, 2)) / 1000 : 0,
              status: from?.status === 'CRITICAL' || to?.status === 'CRITICAL'
                ? 'CRITICAL'
                : from?.status === 'WARNING' || to?.status === 'WARNING'
                  ? 'WARNING'
                  : 'NORMAL',
            },
          };
        }),
      }
    : null;

  return {
    nodes,
    pipes: enrichedPipes,
    alerts,
    nodeMap,
    isConnected,
    lastUpdate,
    refetch: fetchInitialData,
  };
}
