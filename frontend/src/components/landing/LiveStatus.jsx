import React from 'react';
import { Activity, CheckCircle2, ShieldCheck, Cpu, Droplets, Gauge } from 'lucide-react';
import GlassCard from './GlassCard';

const LiveStatus = ({ t }) => {
  return (
    <section id="live-status-section" className="landing-section">
      <div className="section-header">
        <div className="section-badge">{t?.telemetryTitle || "Real-Time Municipal Telemetry"}</div>
        <h2 className="section-title">{t?.navSmartWater ? `${t.navSmartWater} Status` : "Live Water Network Status"}</h2>
        <p className="section-subtitle">
          Continuous telemetry stream monitored by GVMC Command Center AI across all 8 municipal zones and 14 major pumping stations.
        </p>
      </div>

      <GlassCard style={{ padding: '36px', background: 'rgba(255, 255, 255, 0.75)' }}>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '24px',
          alignItems: 'center'
        }}>
          
          {/* Metric 1: Water Supply */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.8)',
            padding: '24px',
            borderRadius: '20px',
            border: '1px solid rgba(0, 91, 172, 0.15)',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.03)',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--gvmc-text-muted)' }}>Water Supply</span>
              <div style={{ background: 'rgba(0, 200, 83, 0.15)', padding: '6px', borderRadius: '10px', color: 'var(--gvmc-success)' }}>
                <Droplets size={20} />
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
              <span style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--gvmc-success)' }}>Healthy</span>
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--gvmc-text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <CheckCircle2 size={14} color="var(--gvmc-success)" />
              <span>SLA: Continuous 24/7 Supply</span>
            </div>
          </div>

          {/* Metric 2: Pressure */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.8)',
            padding: '24px',
            borderRadius: '20px',
            border: '1px solid rgba(0, 91, 172, 0.15)',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.03)',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--gvmc-text-muted)' }}>Network Pressure</span>
              <div style={{ background: 'rgba(0, 119, 204, 0.15)', padding: '6px', borderRadius: '10px', color: 'var(--gvmc-secondary)' }}>
                <Gauge size={20} />
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
              <span style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--gvmc-secondary)' }}>Normal</span>
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--gvmc-text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Activity size={14} color="var(--gvmc-secondary)" />
              <span>Optimal 2.8 - 3.4 Bar across zones</span>
            </div>
          </div>

          {/* Metric 3: Reservoir Capacity */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.8)',
            padding: '24px',
            borderRadius: '20px',
            border: '1px solid rgba(0, 91, 172, 0.15)',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.03)',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--gvmc-text-muted)' }}>Reservoir Capacity</span>
              <div style={{ background: 'rgba(0, 184, 217, 0.15)', padding: '6px', borderRadius: '10px', color: 'var(--gvmc-accent)' }}>
                <Activity size={20} />
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
              <span style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--gvmc-primary)' }}>82%</span>
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--gvmc-success)' }}>+1.4% this week</span>
            </div>
            {/* Mini Progress Bar */}
            <div style={{ width: '100%', height: '6px', background: 'rgba(0,0,0,0.06)', borderRadius: '100px', overflow: 'hidden' }}>
              <div style={{ width: '82%', height: '100%', background: 'linear-gradient(90deg, var(--gvmc-primary), var(--gvmc-accent))', borderRadius: '100px' }} />
            </div>
          </div>

          {/* Metric 4: Network Health */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.8)',
            padding: '24px',
            borderRadius: '20px',
            border: '1px solid rgba(0, 91, 172, 0.15)',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.03)',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--gvmc-text-muted)' }}>Network Health</span>
              <div style={{ background: 'rgba(0, 200, 83, 0.15)', padding: '6px', borderRadius: '10px', color: 'var(--gvmc-success)' }}>
                <ShieldCheck size={20} />
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
              <span style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--gvmc-success)' }}>97%</span>
            </div>
            {/* Mini Progress Bar */}
            <div style={{ width: '100%', height: '6px', background: 'rgba(0,0,0,0.06)', borderRadius: '100px', overflow: 'hidden' }}>
              <div style={{ width: '97%', height: '100%', background: 'var(--gvmc-success)', borderRadius: '100px' }} />
            </div>
          </div>

          {/* Metric 5: AI Alerts */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.8)',
            padding: '24px',
            borderRadius: '20px',
            border: '1px solid rgba(0, 91, 172, 0.15)',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.03)',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--gvmc-text-muted)' }}>AI Active Alerts</span>
              <div style={{ background: 'rgba(0, 91, 172, 0.1)', padding: '6px', borderRadius: '10px', color: 'var(--gvmc-primary)' }}>
                <Cpu size={20} />
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
              <span style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--gvmc-text)' }}>0</span>
              <span style={{ fontSize: '0.75rem', background: 'rgba(0, 200, 83, 0.15)', color: 'var(--gvmc-success)', padding: '2px 8px', borderRadius: '6px', fontWeight: 700 }}>All Clear</span>
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--gvmc-text-muted)' }}>
              Rolling window anomaly detection
            </div>
          </div>

        </div>

        <div style={{
          marginTop: '28px',
          paddingTop: '20px',
          borderTop: '1px solid rgba(0, 91, 172, 0.1)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px',
          fontSize: '0.85rem',
          color: 'var(--gvmc-text-muted)'
        }}>
          <span>⚡ Data auto-refreshed from Visakhapatnam Municipal SCADA server (Dummy Telemetry)</span>
          <span style={{ fontWeight: 600, color: 'var(--gvmc-primary)' }}>Official GVMC SLA Standard 2026</span>
        </div>

      </GlassCard>
    </section>
  );
};

export default LiveStatus;
