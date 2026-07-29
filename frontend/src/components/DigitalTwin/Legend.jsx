/**
 * Legend.jsx — Digital Twin map legend panel.
 *
 * Bottom-left floating panel showing:
 * - Pressure color scale bar (1–7+ bar)
 * - Node type icons
 * - Status indicators
 */

import React from 'react';

const Legend = ({ viewMode }) => {
  return (
    <div className="dt-legend">
      <div className="dt-legend-title">Legend</div>

      {/* Pressure Scale */}
      <div style={{ marginBottom: '10px' }}>
        <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginBottom: '4px', fontWeight: 600 }}>
          Pressure (bar)
        </div>
        <div className="dt-pressure-bar" />
        <div className="dt-pressure-labels">
          <span>1 bar</span>
          <span>3 bar</span>
          <span>5 bar</span>
          <span>7+ bar</span>
        </div>
      </div>

      {/* Node Types */}
      <div style={{ marginBottom: '8px' }}>
        <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginBottom: '4px', fontWeight: 600 }}>
          Infrastructure
        </div>
        <div className="dt-legend-item">
          <span className="dt-legend-dot" style={{ background: '#0ea5e9' }} />
          Reservoir
        </div>
        <div className="dt-legend-item">
          <span className="dt-legend-dot" style={{ background: '#10b981' }} />
          Tank
        </div>
        <div className="dt-legend-item">
          <span className="dt-legend-dot" style={{ background: '#f59e0b' }} />
          Pump Station
        </div>
        <div className="dt-legend-item">
          <span className="dt-legend-dot" style={{ background: '#00e5ff' }} />
          Junction
        </div>
      </div>

      {/* Status */}
      <div>
        <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginBottom: '4px', fontWeight: 600 }}>
          Status
        </div>
        <div className="dt-legend-item">
          <span className="dt-legend-dot" style={{ background: '#10b981' }} />
          Normal
        </div>
        <div className="dt-legend-item">
          <span className="dt-legend-dot" style={{ background: '#facc15' }} />
          Warning
        </div>
        <div className="dt-legend-item">
          <span className="dt-legend-dot" style={{ background: '#ef4444' }} />
          Critical
        </div>
      </div>

      {/* View Mode Indicator */}
      <div style={{
        marginTop: '10px',
        paddingTop: '8px',
        borderTop: '1px solid rgba(255,255,255,0.08)',
        fontSize: '0.7rem',
        color: '#64748b',
      }}>
        Mode: <strong style={{ color: '#00e5ff' }}>{viewMode}</strong>
      </div>
    </div>
  );
};

export default Legend;
