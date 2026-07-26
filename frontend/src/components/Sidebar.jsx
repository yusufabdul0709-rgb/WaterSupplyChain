import React from 'react';
import { LayoutDashboard, Map, Activity, Zap, Database, Droplets, AlertTriangle, Cpu, MessageSquare, Settings } from 'lucide-react';

const Sidebar = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    { id: 'command', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'command', label: 'Water Network Map', icon: Map },
    { id: 'command', label: 'Pumping Stations', icon: Zap, badge: '14' },
    { id: 'command', label: 'Reservoirs', icon: Database, badge: '8' },
    { id: 'command', label: 'Water Quality PH', icon: Droplets, badge: 'PH' },
    { id: 'command', label: 'Leak Intelligence', icon: AlertTriangle, badge: 'AI' },
    { id: 'complaints', label: 'Citizen Complaints', icon: MessageSquare },
    { id: 'sector_admins', label: 'Sector Heads', icon: Cpu },
  ];

  return (
    <aside className="gvmc-panel" style={{ width: '260px', borderRadius: '0', borderLeft: 'none', borderTop: 'none', borderBottom: 'none', padding: '20px 16px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '1px', textTransform: 'uppercase' }}>
        GVMC Command Navigation
      </div>

      <nav style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {menuItems.map((item, idx) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={idx}
              onClick={() => setActiveTab(item.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px 14px',
                borderRadius: '8px',
                background: isActive ? 'rgba(0, 229, 255, 0.12)' : 'transparent',
                border: isActive ? '1px solid rgba(0, 229, 255, 0.3)' : '1px solid transparent',
                color: isActive ? '#00e5ff' : 'var(--text-muted)',
                fontWeight: isActive ? 700 : 500,
                fontSize: '0.9rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Icon size={18} color={isActive ? '#00e5ff' : 'var(--text-muted)'} />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span style={{ background: 'rgba(255, 255, 255, 0.08)', color: '#fff', fontSize: '0.7rem', padding: '2px 6px', borderRadius: '4px' }}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* System Status Footnote */}
      <div style={{ marginTop: 'auto', paddingTop: '16px', borderTop: '1px solid var(--border-light)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.75rem' }}>
          <span style={{ color: 'var(--text-muted)' }}>AI Core Version</span>
          <span style={{ color: '#00e5ff', fontWeight: 700 }}>v3.2 GVMC</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.75rem', marginTop: '6px' }}>
          <span style={{ color: 'var(--text-muted)' }}>Model Accuracy</span>
          <span style={{ color: 'var(--primary-emerald)', fontWeight: 700 }}>98.4%</span>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
