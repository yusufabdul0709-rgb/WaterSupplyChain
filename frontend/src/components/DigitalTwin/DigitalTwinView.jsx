/**
 * DigitalTwinView.jsx — Main orchestrator for the Smart City Digital Twin.
 *
 * Renders:
 * - Mapbox map with 3D buildings and terrain
 * - deck.gl overlay via @deck.gl/mapbox MapboxOverlay
 * - All visualization sub-layers based on active view mode and toggles
 * - Controls panel (top-right)
 * - AI overlay panel (right sidebar, collapsible)
 * - Legend (bottom-left)
 * - Node detail panel (on click)
 * - Telemetry HUD (top-left)
 *
 * Manages view mode state: SURFACE | HYBRID | UNDERGROUND
 * All data consumed from useTelemetry — no fake data.
 */

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import Map, { NavigationControl, Source, Layer, Marker } from 'react-map-gl/mapbox';
import { MapboxOverlay } from '@deck.gl/mapbox';
import { PathLayer, ScatterplotLayer } from '@deck.gl/layers';
import { HeatmapLayer } from '@deck.gl/aggregation-layers';
import 'mapbox-gl/dist/mapbox-gl.css';

import useTelemetry from '../../hooks/useTelemetry';
import useFlowAnimation from '../../hooks/useFlowAnimation';
import usePressure from '../../hooks/usePressure';

import Controls from './Controls';
import Legend from './Legend';
import AIOverlay from './AIOverlay';
import NodeDetailPanel from './NodeDetailPanel';

import { pressureToColor, statusToColor, statusToCss, flowToSpeed, nodeTypeIcon } from '../../utils/colorScale';
import { createFlowParticles } from '../../utils/pipeAnimation';
import { getNetworkBounds, pipeWidth } from '../../utils/geoHelpers';

import './digitalTwin.css';

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;

const SECTOR_COORDS = {
  ALL: { center: [17.740, 83.290], zoom: 12 },
  SEC_GAJUWAKA: { center: [17.6850, 83.2150], zoom: 14 },
  SEC_MVP: { center: [17.7380, 83.3320], zoom: 14 },
  SEC_SEETHAM: { center: [17.7400, 83.3050], zoom: 14 },
  SEC_MADHURA: { center: [17.8150, 83.3650], zoom: 14 },
  SEC_ANAKAPALLE: { center: [17.6900, 83.0000], zoom: 13 },
};

/**
 * View mode opacity configurations for smooth transitions.
 * Each mode defines opacity for buildings, terrain, and pipes.
 */
const VIEW_MODE_CONFIG = {
  SURFACE: {
    buildingOpacity: 1.0,
    pipeOpacity: 0.6,
    pipeWidth: 1.0,
    flowOpacity: 0.5,
    terrainOpacity: 1.0,
    label: 'Surface View',
  },
  HYBRID: {
    buildingOpacity: 0.4,
    pipeOpacity: 0.85,
    pipeWidth: 1.3,
    flowOpacity: 0.75,
    terrainOpacity: 0.7,
    label: 'Hybrid View',
  },
  UNDERGROUND: {
    buildingOpacity: 0.1,
    pipeOpacity: 1.0,
    pipeWidth: 1.8,
    flowOpacity: 1.0,
    terrainOpacity: 0.3,
    label: 'Underground View',
  },
};

const DigitalTwinView = ({ selectedSector }) => {
  const mapRef = useRef(null);
  const deckOverlayRef = useRef(null);

  // Data from existing backend
  const { nodes, pipes, alerts, nodeMap, isConnected, lastUpdate } = useTelemetry();
  const { currentTime } = useFlowAnimation();
  const { pressurePoints } = usePressure(nodes);

  // UI State
  const [viewMode, setViewMode] = useState('SURFACE');
  const [layers, setLayers] = useState({
    pressure: false,
    flow: true,
    sensors: true,
    buildings: true,
    reservoirs: true,
  });
  const [showAI, setShowAI] = useState(true);
  const [selectedNode, setSelectedNode] = useState(null);
  const [hoverInfo, setHoverInfo] = useState(null);

  const modeConfig = VIEW_MODE_CONFIG[viewMode];

  // Toggle a layer on/off
  const toggleLayer = useCallback((layerId) => {
    setLayers((prev) => ({ ...prev, [layerId]: !prev[layerId] }));
  }, []);

  // Fullscreen toggle
  const handleFullscreen = useCallback(() => {
    const el = document.getElementById('dt-container');
    if (!el) return;
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      el.requestFullscreen();
    }
  }, []);

  // Focus camera on a specific node
  const handleFocusNode = useCallback((nodeId) => {
    const node = nodes.find((n) => n.node_id === nodeId);
    if (node && mapRef.current) {
      mapRef.current.flyTo({
        center: [node.lon, node.lat],
        zoom: 16,
        pitch: 60,
        bearing: -20,
        duration: 1500,
        essential: true,
      });
      setSelectedNode(node);
    }
  }, [nodes]);

  // Fly to selected sector coordinates
  const targetSectorConfig = SECTOR_COORDS[selectedSector] || SECTOR_COORDS.ALL;

  useEffect(() => {
    if (mapRef.current && targetSectorConfig) {
      mapRef.current.flyTo({
        center: [targetSectorConfig.center[1], targetSectorConfig.center[0]], // [lon, lat]
        zoom: targetSectorConfig.zoom,
        pitch: 60,
        bearing: -20,
        duration: 1500,
        essential: true,
      });
    }
  }, [selectedSector, targetSectorConfig]);

  // ── View Mode Transitions ──────────────────────────────────────────
  // Smooth opacity transitions using Mapbox paint properties
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // Transition 3D building opacity
    try {
      if (layers.buildings) {
        map.setConfigProperty('basemap', 'showPointOfInterests', viewMode !== 'UNDERGROUND');
      }
    } catch (e) {
      // Standard basemap config may not be available
    }
  }, [viewMode, layers.buildings]);

  // ── deck.gl Layers ─────────────────────────────────────────────────

  const deckLayers = useMemo(() => {
    if (!pipes) return [];
    const result = [];

    // 1. PIPE GLOW LAYER — wider translucent path for glow effect
    result.push(
      new PathLayer({
        id: 'pipe-glow',
        data: pipes.features,
        getPath: (d) => d.geometry.coordinates,
        getWidth: (d) => pipeWidth(d.properties.diameter_mm) * modeConfig.pipeWidth * 3,
        getColor: (d) => {
          const [r, g, b] = pressureToColor(d.properties.pressure_bar || 5);
          return [r, g, b, Math.round(40 * modeConfig.pipeOpacity)];
        },
        widthUnits: 'pixels',
        widthMinPixels: 4,
        capRounded: true,
        jointRounded: true,
        updateTriggers: {
          getColor: [nodes, viewMode],
          getWidth: [viewMode],
        },
      })
    );

    // 2. PIPE CORE LAYER — actual pipe path
    result.push(
      new PathLayer({
        id: 'pipe-core',
        data: pipes.features,
        getPath: (d) => d.geometry.coordinates,
        getWidth: (d) => pipeWidth(d.properties.diameter_mm) * modeConfig.pipeWidth,
        getColor: (d) => {
          const [r, g, b] = pressureToColor(d.properties.pressure_bar || 5);
          return [r, g, b, Math.round(220 * modeConfig.pipeOpacity)];
        },
        widthUnits: 'pixels',
        widthMinPixels: 2,
        capRounded: true,
        jointRounded: true,
        pickable: true,
        autoHighlight: true,
        highlightColor: [0, 229, 255, 100],
        onHover: (info) => {
          if (info.object) {
            setHoverInfo({
              x: info.x,
              y: info.y,
              object: info.object.properties,
              type: 'pipe',
            });
          } else {
            setHoverInfo(null);
          }
        },
        onClick: (info) => {
          if (info.object) {
            const props = info.object.properties;
            // Focus on the from_node
            handleFocusNode(props.from_node);
          }
        },
        updateTriggers: {
          getColor: [nodes, viewMode],
          getWidth: [viewMode],
        },
      })
    );

    // 3. FLOW PARTICLES LAYER — animated particles along pipes
    if (layers.flow) {
      const particles = createFlowParticles(pipes.features, nodeMap, currentTime);
      result.push(
        new ScatterplotLayer({
          id: 'flow-particles',
          data: particles,
          getPosition: (d) => d.position,
          getRadius: (d) => d.radius,
          getFillColor: (d) => {
            const [r, g, b, a] = d.color;
            return [r, g, b, Math.round(a * modeConfig.flowOpacity)];
          },
          radiusUnits: 'pixels',
          radiusMinPixels: 2,
          radiusMaxPixels: 8,
          updateTriggers: {
            getPosition: [currentTime],
            getFillColor: [viewMode],
          },
        })
      );
    }

    // 4. PRESSURE HEATMAP LAYER
    if (layers.pressure && pressurePoints.length > 0) {
      result.push(
        new HeatmapLayer({
          id: 'pressure-heatmap',
          data: pressurePoints,
          getPosition: (d) => d.position,
          getWeight: (d) => d.weight,
          radiusPixels: 80,
          intensity: 1.2,
          threshold: 0.1,
          colorRange: [
            [239, 68, 68],    // red (low)
            [250, 204, 21],   // yellow
            [14, 165, 233],   // blue
            [16, 185, 129],   // green (high)
          ],
          opacity: 0.4 * modeConfig.pipeOpacity,
          updateTriggers: {
            getWeight: [nodes],
          },
        })
      );
    }

    // 5. SENSOR/NODE MARKERS LAYER — ScatterplotLayer for all nodes
    if (layers.sensors) {
      // Outer glow ring
      result.push(
        new ScatterplotLayer({
          id: 'sensor-glow',
          data: nodes,
          getPosition: (d) => [d.lon, d.lat],
          getRadius: 18,
          getFillColor: (d) => {
            const [r, g, b] = statusToColor(d.current?.status || 'OFFLINE');
            return [r, g, b, 60];
          },
          radiusUnits: 'pixels',
          radiusMinPixels: 14,
          updateTriggers: {
            getFillColor: [nodes],
          },
        })
      );

      // Inner dot
      result.push(
        new ScatterplotLayer({
          id: 'sensor-core',
          data: nodes,
          getPosition: (d) => [d.lon, d.lat],
          getRadius: 8,
          getFillColor: (d) => statusToColor(d.current?.status || 'OFFLINE'),
          getLineColor: [255, 255, 255, 200],
          lineWidthMinPixels: 2,
          stroked: true,
          radiusUnits: 'pixels',
          radiusMinPixels: 6,
          pickable: true,
          autoHighlight: true,
          highlightColor: [0, 229, 255, 100],
          onHover: (info) => {
            if (info.object) {
              setHoverInfo({
                x: info.x,
                y: info.y,
                object: info.object,
                type: 'node',
              });
            } else if (hoverInfo?.type === 'node') {
              setHoverInfo(null);
            }
          },
          onClick: (info) => {
            if (info.object) {
              setSelectedNode(info.object);
              mapRef.current?.flyTo({
                center: [info.object.lon, info.object.lat],
                zoom: 16,
                pitch: 60,
                duration: 1200,
              });
            }
          },
          updateTriggers: {
            getFillColor: [nodes],
          },
        })
      );
    }

    return result;
  }, [pipes, nodes, nodeMap, currentTime, pressurePoints, layers, viewMode, modeConfig]);

  // ── Attach deck.gl overlay to map ──────────────────────────────────
  const onMapLoad = useCallback((e) => {
    const map = e.target;

    try {
      map.setConfigProperty('basemap', 'lightPreset', 'night');
      map.setConfigProperty('basemap', 'showPointOfInterests', true);
      map.setConfigProperty('basemap', 'showPlaceLabels', true);
    } catch (err) {
      // Standard basemap config may not be available
    }

    // Create deck.gl overlay
    const overlay = new MapboxOverlay({
      layers: [],
      interleaved: true,
    });
    map.addControl(overlay);
    deckOverlayRef.current = overlay;
  }, []);

  // Update deck.gl layers when they change
  useEffect(() => {
    if (deckOverlayRef.current) {
      deckOverlayRef.current.setProps({ layers: deckLayers });
    }
  }, [deckLayers]);

  // ── Reservoir & Pump HTML Markers ──────────────────────────────────
  const reservoirNodes = nodes.filter((n) => n.type === 'RESERVOIR' || n.type === 'TANK');
  const pumpNodes = nodes.filter((n) => n.type === 'PUMP');

  // ── Compute HUD stats ──────────────────────────────────────────────
  const onlineCount = nodes.filter((n) => n.current?.status !== 'OFFLINE').length;
  const avgPressure = nodes.length
    ? (nodes.reduce((sum, n) => sum + (n.current?.pressure_bar || 0), 0) / nodes.length).toFixed(1)
    : '0.0';
  const totalFlow = nodes.reduce((sum, n) => sum + (n.current?.flow_lps || 0), 0).toFixed(1);

  return (
    <div id="dt-container" style={{ position: 'relative', width: '100%', height: '100%', borderRadius: '16px', overflow: 'hidden', border: '1px solid rgba(0, 229, 255, 0.25)', boxShadow: '0 8px 32px rgba(0,0,0,0.5)' }}>
      {/* Mapbox Map */}
      <Map
        ref={mapRef}
        onLoad={onMapLoad}
        initialViewState={{
          longitude: targetSectorConfig.center[1],
          latitude: targetSectorConfig.center[0],
          zoom: targetSectorConfig.zoom,
          pitch: 60,
          bearing: -20,
        }}
        mapboxAccessToken={MAPBOX_TOKEN}
        mapStyle="mapbox://styles/mapbox/standard"
        style={{ width: '100%', height: '100%' }}
        attributionControl={false}
        maxPitch={75}
      >
        <NavigationControl position="top-left" />

        {/* Reservoir Markers (HTML overlays) */}
        {layers.reservoirs && reservoirNodes.map((node) => {
          const current = node.current || {};
          const flow = current.flow_lps || 0;
          const fillPct = Math.min(100, Math.max(5, (flow / 50) * 100));
          const status = current.status || 'OFFLINE';

          return (
            <Marker key={node.node_id} longitude={node.lon} latitude={node.lat} anchor="center">
              <div
                className="dt-reservoir-marker"
                onClick={() => { setSelectedNode(node); }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#f8fafc' }}>
                    {node.type === 'RESERVOIR' ? '🏗️' : '🛢️'} {node.node_id.replace('_', ' ')}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.65rem', color: '#94a3b8' }}>
                  <span>Flow: <strong style={{ color: '#00e5ff' }}>{flow.toFixed(1)}</strong> L/s</span>
                </div>
                <div className="dt-water-fill">
                  <div className="dt-water-fill-inner" style={{ width: `${fillPct}%` }} />
                </div>
              </div>
            </Marker>
          );
        })}

        {/* Pump Station Markers */}
        {pumpNodes.map((node) => {
          const current = node.current || {};
          const flow = current.flow_lps || 0;
          const status = current.status || 'OFFLINE';
          const isOn = status !== 'OFFLINE';

          return (
            <Marker key={node.node_id} longitude={node.lon} latitude={node.lat} anchor="center">
              <div
                className="dt-pump-marker"
                onClick={() => { setSelectedNode(node); }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                  <span className={`dt-pump-icon ${isOn ? '' : 'off'}`}>⚙️</span>
                  <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#f8fafc' }}>PUMP</span>
                  <span style={{
                    fontSize: '0.6rem',
                    fontWeight: 700,
                    padding: '1px 6px',
                    borderRadius: '3px',
                    background: isOn ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                    color: isOn ? '#10b981' : '#ef4444',
                  }}>
                    {isOn ? 'ON' : 'OFF'}
                  </span>
                </div>
                <div style={{ fontSize: '0.65rem', color: '#94a3b8' }}>
                  Flow: <strong style={{ color: '#00e5ff' }}>{flow.toFixed(1)}</strong> L/s
                </div>
              </div>
            </Marker>
          );
        })}
      </Map>

      {/* Telemetry HUD (top-left) */}
      <div className="dt-hud">
        <div className="dt-hud-card">
          <div className="dt-hud-label">Nodes Online</div>
          <div className="dt-hud-value" style={{ color: '#10b981' }}>{onlineCount}/{nodes.length}</div>
        </div>
        <div className="dt-hud-card">
          <div className="dt-hud-label">Avg Pressure</div>
          <div className="dt-hud-value" style={{ color: '#00e5ff' }}>{avgPressure} bar</div>
        </div>
        <div className="dt-hud-card">
          <div className="dt-hud-label">Total Flow</div>
          <div className="dt-hud-value" style={{ color: '#38bdf8' }}>{totalFlow} L/s</div>
        </div>
        <div className="dt-hud-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span className={`dt-status-dot ${isConnected ? 'connected' : 'disconnected'}`} />
            <span style={{ fontSize: '0.75rem', color: isConnected ? '#10b981' : '#ef4444', fontWeight: 600 }}>
              {isConnected ? 'LIVE' : 'OFFLINE'}
            </span>
          </div>
        </div>
      </div>

      {/* Controls Panel (top-right, shifted left when AI panel is open) */}
      <div style={{ position: 'absolute', top: 0, right: showAI ? 340 : 0, transition: 'right 0.4s ease' }}>
        <Controls
          viewMode={viewMode}
          setViewMode={setViewMode}
          layers={layers}
          toggleLayer={toggleLayer}
          onFullscreen={handleFullscreen}
        />
      </div>

      {/* Legend (bottom-left) */}
      <Legend viewMode={viewMode} />

      {/* AI Overlay Panel (right sidebar) */}
      {showAI && (
        <AIOverlay
          alerts={alerts}
          nodes={nodes}
          isConnected={isConnected}
          onClose={() => setShowAI(false)}
          onFocusNode={handleFocusNode}
        />
      )}

      {/* Toggle AI Panel Button (when closed) */}
      {!showAI && (
        <button
          onClick={() => setShowAI(true)}
          style={{
            position: 'absolute',
            bottom: '24px',
            right: '16px',
            zIndex: 10,
            background: 'rgba(7, 13, 25, 0.92)',
            backdropFilter: 'blur(16px)',
            border: '1px solid rgba(0, 229, 255, 0.3)',
            borderRadius: '12px',
            padding: '10px 16px',
            color: '#00e5ff',
            fontWeight: 700,
            fontSize: '0.85rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.6)',
            fontFamily: 'Outfit, sans-serif',
            transition: 'all 0.3s ease',
          }}
        >
          🤖 AI Panel
        </button>
      )}

      {/* Node Detail Panel (on click) */}
      {selectedNode && (
        <NodeDetailPanel
          node={selectedNode}
          onClose={() => setSelectedNode(null)}
        />
      )}

      {/* Hover Tooltip */}
      {hoverInfo && (
        <div
          className="dt-tooltip"
          style={{
            position: 'absolute',
            left: hoverInfo.x + 12,
            top: hoverInfo.y - 12,
            zIndex: 20,
          }}
        >
          {hoverInfo.type === 'pipe' ? (
            <>
              <div className="dt-tooltip-title">{hoverInfo.object.pipe_id}</div>
              <div className="dt-tooltip-row">
                <span className="dt-tooltip-label">Flow</span>
                <span className="dt-tooltip-value">{(hoverInfo.object.flow_lps || 0).toFixed(1)} L/s</span>
              </div>
              <div className="dt-tooltip-row">
                <span className="dt-tooltip-label">Pressure</span>
                <span className="dt-tooltip-value">{(hoverInfo.object.pressure_bar || 0).toFixed(1)} bar</span>
              </div>
              <div className="dt-tooltip-row">
                <span className="dt-tooltip-label">Diameter</span>
                <span className="dt-tooltip-value">{hoverInfo.object.diameter_mm} mm</span>
              </div>
              <div className="dt-tooltip-row">
                <span className="dt-tooltip-label">Status</span>
                <span className="dt-tooltip-value" style={{ color: statusToCss(hoverInfo.object.status) }}>
                  {hoverInfo.object.status}
                </span>
              </div>
            </>
          ) : hoverInfo.type === 'node' ? (
            <>
              <div className="dt-tooltip-title">{hoverInfo.object.node_id}</div>
              <div className="dt-tooltip-row">
                <span className="dt-tooltip-label">Type</span>
                <span className="dt-tooltip-value">{hoverInfo.object.type}</span>
              </div>
              <div className="dt-tooltip-row">
                <span className="dt-tooltip-label">Pressure</span>
                <span className="dt-tooltip-value">{(hoverInfo.object.current?.pressure_bar || 0).toFixed(1)} bar</span>
              </div>
              <div className="dt-tooltip-row">
                <span className="dt-tooltip-label">Flow</span>
                <span className="dt-tooltip-value">{(hoverInfo.object.current?.flow_lps || 0).toFixed(1)} L/s</span>
              </div>
              <div className="dt-tooltip-row">
                <span className="dt-tooltip-label">pH</span>
                <span className="dt-tooltip-value">{(hoverInfo.object.current?.ph || 7.2).toFixed(1)}</span>
              </div>
              <div className="dt-tooltip-row">
                <span className="dt-tooltip-label">Status</span>
                <span className="dt-tooltip-value" style={{ color: statusToCss(hoverInfo.object.current?.status) }}>
                  {hoverInfo.object.current?.status || 'OFFLINE'}
                </span>
              </div>
            </>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default DigitalTwinView;
