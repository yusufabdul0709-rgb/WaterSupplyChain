/**
 * Controls.jsx — Digital Twin layer controls panel.
 *
 * Top-right floating glassmorphism panel with:
 * - View mode selection (Surface/Hybrid/Underground)
 * - Layer toggles (Pressure, Flow, Buildings, Sensors, etc.)
 * - Fullscreen toggle
 */

import React from 'react';
import { Eye, Layers, Mountain, Droplets, Activity, Building, Thermometer, Radio, Maximize, MapPin } from 'lucide-react';

const VIEW_MODES = [
  { id: 'SURFACE', label: 'Surface View', icon: Eye },
  { id: 'HYBRID', label: 'Hybrid View', icon: Layers },
  { id: 'UNDERGROUND', label: 'Underground', icon: Mountain },
];

const LAYER_TOGGLES = [
  { id: 'pressure', label: 'Pressure Heatmap', icon: Thermometer },
  { id: 'flow', label: 'Flow Animation', icon: Droplets },
  { id: 'sensors', label: 'Sensors', icon: Radio },
  { id: 'buildings', label: '3D Buildings', icon: Building },
  { id: 'reservoirs', label: 'Reservoirs', icon: MapPin },
];

const Toggle = ({ on, onClick }) => (
  <div
    className={`dt-toggle-switch ${on ? 'on' : ''}`}
    onClick={onClick}
    role="switch"
    aria-checked={on}
  />
);

const Controls = ({ viewMode, setViewMode, layers, toggleLayer, onFullscreen }) => {
  return (
    <div className="dt-controls">
      {/* View Mode Selection */}
      <div className="dt-controls-panel">
        <div className="dt-controls-title">View Mode</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {VIEW_MODES.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              className={`dt-view-btn ${viewMode === id ? 'active' : ''}`}
              onClick={() => setViewMode(id)}
            >
              <Icon size={16} />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Layer Toggles */}
      <div className="dt-controls-panel">
        <div className="dt-controls-title">Layers</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          {LAYER_TOGGLES.map(({ id, label }) => (
            <div key={id} className="dt-toggle" onClick={() => toggleLayer(id)}>
              <span>{label}</span>
              <Toggle on={layers[id]} onClick={() => toggleLayer(id)} />
            </div>
          ))}
        </div>
      </div>

      {/* Fullscreen */}
      <button
        className="dt-view-btn"
        onClick={onFullscreen}
        style={{
          background: 'rgba(7, 13, 25, 0.92)',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(0, 229, 255, 0.2)',
          borderRadius: '12px',
          padding: '10px 14px',
          justifyContent: 'center',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.6)',
        }}
      >
        <Maximize size={16} />
        Fullscreen
      </button>
    </div>
  );
};

export default Controls;
