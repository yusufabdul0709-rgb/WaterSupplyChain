/**
 * NodeDetailPanel.jsx — Slide-in detail panel for node inspection.
 *
 * Opens when a node/sensor is clicked. Shows:
 * - Current readings (pressure, flow, pH, status, anomaly score)
 * - Historical chart from /sensors/{id}/history
 * - Health score
 */

import React, { useState, useEffect } from 'react';
import { X, Activity, Droplets, Beaker, Shield, Clock } from 'lucide-react';
import { pressureToCss, statusToCss, nodeTypeIcon } from '../../utils/colorScale';

const NodeDetailPanel = ({ node, onClose }) => {
  const [history, setHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  useEffect(() => {
    if (!node) return;

    setLoadingHistory(true);
    fetch(`/api/v1/sensors/${node.node_id}/history?minutes=30`)
      .then((res) => res.ok ? res.json() : { readings: [] })
      .then((data) => setHistory(data.readings || []))
      .catch(() => setHistory([]))
      .finally(() => setLoadingHistory(false));
  }, [node?.node_id]);

  if (!node) return null;

  const current = node.current || {};
  const pressure = current.pressure_bar ?? 0;
  const flow = current.flow_lps ?? 0;
  const ph = current.ph ?? 7.2;
  const status = current.status ?? 'OFFLINE';
  const anomaly = current.anomaly_score ?? 0;

  // Simple health score based on status and anomaly
  const healthScore = status === 'NORMAL'
    ? Math.round(95 - anomaly * 30)
    : status === 'WARNING'
      ? Math.round(70 - anomaly * 20)
      : Math.round(40 - anomaly * 10);

  // Mini sparkline from history (last 20 readings)
  const sparklineData = history.slice(-20);
  const maxPressure = Math.max(...sparklineData.map((r) => r.pressure_bar || 0), 1);

  return (
    <div className="dt-detail-panel">
      {/* Header */}
      <div className="dt-detail-header">
        <div className="dt-detail-title">
          <span>{nodeTypeIcon(node.type)}</span>
          <div>
            <div>{node.node_id}</div>
            <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 400 }}>{node.type}</div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{
            background: `${statusToCss(status)}22`,
            color: statusToCss(status),
            padding: '2px 10px',
            borderRadius: '4px',
            fontSize: '0.7rem',
            fontWeight: 700,
          }}>
            {status}
          </span>
          <button className="dt-close-btn" onClick={onClose}>
            <X size={14} />
          </button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="dt-detail-grid">
        <div className="dt-metric-card">
          <div className="dt-metric-value" style={{ color: pressureToCss(pressure) }}>
            {pressure.toFixed(1)}
          </div>
          <div className="dt-metric-label">Pressure (bar)</div>
        </div>
        <div className="dt-metric-card">
          <div className="dt-metric-value" style={{ color: '#00e5ff' }}>
            {flow.toFixed(1)}
          </div>
          <div className="dt-metric-label">Flow (L/s)</div>
        </div>
        <div className="dt-metric-card">
          <div className="dt-metric-value" style={{ color: ph < 6.5 || ph > 8.5 ? '#ef4444' : '#10b981' }}>
            {ph.toFixed(1)}
          </div>
          <div className="dt-metric-label">pH Level</div>
        </div>
        <div className="dt-metric-card">
          <div className="dt-metric-value" style={{ color: healthScore > 80 ? '#10b981' : healthScore > 50 ? '#facc15' : '#ef4444' }}>
            {healthScore}%
          </div>
          <div className="dt-metric-label">Health</div>
        </div>
      </div>

      {/* Mini History Chart */}
      <div style={{ marginTop: '16px' }}>
        <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 600, marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
          <Clock size={12} />
          Last 30 min — Pressure History
        </div>
        <div style={{
          background: 'rgba(15, 23, 42, 0.6)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '8px',
          padding: '12px',
          height: '80px',
          display: 'flex',
          alignItems: 'flex-end',
          gap: '2px',
        }}>
          {loadingHistory ? (
            <div style={{ width: '100%', textAlign: 'center', color: '#64748b', fontSize: '0.75rem' }}>Loading...</div>
          ) : sparklineData.length === 0 ? (
            <div style={{ width: '100%', textAlign: 'center', color: '#64748b', fontSize: '0.75rem' }}>No history data</div>
          ) : (
            sparklineData.map((reading, idx) => {
              const barHeight = Math.max(4, (reading.pressure_bar / maxPressure) * 60);
              return (
                <div
                  key={idx}
                  style={{
                    flex: 1,
                    height: `${barHeight}px`,
                    background: pressureToCss(reading.pressure_bar),
                    borderRadius: '2px 2px 0 0',
                    minWidth: '3px',
                    opacity: 0.85,
                    transition: 'height 0.5s ease',
                  }}
                  title={`${reading.pressure_bar?.toFixed(1)} bar`}
                />
              );
            })
          )}
        </div>
      </div>

      {/* Anomaly Score */}
      {anomaly > 0 && (
        <div style={{ marginTop: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Shield size={14} color={anomaly > 0.5 ? '#ef4444' : '#facc15'} />
          <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
            Anomaly Score: <strong style={{ color: anomaly > 0.5 ? '#ef4444' : '#facc15' }}>
              {(anomaly * 100).toFixed(0)}%
            </strong>
          </span>
        </div>
      )}
    </div>
  );
};

export default NodeDetailPanel;
