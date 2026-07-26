import React from 'react';
import { Droplets, ShieldCheck, Activity, Users, LogOut, ChevronDown } from 'lucide-react';

const Navbar = ({ user, sectors, selectedSector, setSelectedSector, activeTab, setActiveTab, onLogout }) => {
  return (
    <header className="gvmc-panel" style={{ borderRadius: '0', borderLeft: 'none', borderRight: 'none', borderTop: 'none', padding: '12px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', zIndex: 1000 }}>
      {/* Brand */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{ background: 'linear-gradient(135deg, #00e5ff 0%, #0284c7 100%)', padding: '8px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Droplets color="#070d19" size={24} />
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h1 style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '0.5px' }}>GVMC</h1>
            <span style={{ background: 'rgba(0, 229, 255, 0.2)', color: '#00e5ff', padding: '2px 8px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 700 }}>SMART CITY</span>
          </div>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Greater Visakhapatnam Municipal Corporation</p>
        </div>
      </div>

      {/* Center Controls: Zone Dropdown & Quick Modes */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        {/* Zone Dropdown */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(15, 23, 42, 0.8)', padding: '6px 14px', borderRadius: '8px', border: '1px solid var(--border-cyan)' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>GVMC ZONE:</span>
          {user?.role === 'GVMC_HQ_ADMIN' || user?.role === 'MAIN' ? (
            <select
              value={selectedSector}
              onChange={(e) => setSelectedSector(e.target.value)}
              style={{ background: 'transparent', color: '#00e5ff', border: 'none', fontWeight: 700, outline: 'none', cursor: 'pointer' }}
            >
              <option value="ALL" style={{ background: '#0b1329', color: '#fff' }}>All Visakhapatnam (HQ)</option>
              {sectors.map(s => (
                <option key={s.id} value={s.id} style={{ background: '#0b1329', color: '#fff' }}>
                  {s.zone} — {s.name}
                </option>
              ))}
            </select>
          ) : (
            <span style={{ color: '#00e5ff', fontWeight: 700, fontSize: '0.9rem' }}>
              {sectors.find(s => s.id === user?.sector_id)?.name || user?.sector_id || 'Sector Assigned'}
            </span>
          )}
        </div>

        {/* View Tabs */}
        <div style={{ display: 'flex', background: 'rgba(7, 13, 25, 0.8)', padding: '4px', borderRadius: '8px', border: '1px solid var(--border-light)' }}>
          <button
            onClick={() => setActiveTab('command')}
            style={{ background: activeTab === 'command' ? 'var(--primary-cyan)' : 'transparent', color: activeTab === 'command' ? '#070d19' : 'var(--text-muted)', border: 'none', padding: '6px 14px', borderRadius: '6px', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <Activity size={16} /> Command Center
          </button>
          <button
            onClick={() => setActiveTab('complaints')}
            style={{ background: activeTab === 'complaints' ? 'var(--primary-cyan)' : 'transparent', color: activeTab === 'complaints' ? '#070d19' : 'var(--text-muted)', border: 'none', padding: '6px 14px', borderRadius: '6px', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <ShieldCheck size={16} /> Citizen Complaints
          </button>
          {(user?.role === 'GVMC_HQ_ADMIN' || user?.role === 'MAIN') && (
            <button
              onClick={() => setActiveTab('sector_admins')}
              style={{ background: activeTab === 'sector_admins' ? 'var(--primary-cyan)' : 'transparent', color: activeTab === 'sector_admins' ? '#070d19' : 'var(--text-muted)', border: 'none', padding: '6px 14px', borderRadius: '6px', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <Users size={16} /> Sector Heads
            </button>
          )}
        </div>
      </div>

      {/* User Profile & Logout */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(15, 23, 42, 0.6)', padding: '6px 12px', borderRadius: '8px', border: '1px solid var(--border-light)' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--primary-blue)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: '#fff' }}>
            {user?.full_name ? user.full_name.charAt(0) : 'A'}
          </div>
          <div>
            <div style={{ fontSize: '0.85rem', fontWeight: 700 }}>{user?.full_name || 'Municipal Commissioner'}</div>
            <div style={{ fontSize: '0.7rem', color: 'var(--primary-cyan)' }}>{user?.role === 'GVMC_HQ_ADMIN' || user?.role === 'MAIN' ? 'GVMC HQ Main Admin' : `Sector Admin (${user?.sector_id})`}</div>
          </div>
        </div>

        <button onClick={onLogout} title="Logout" style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#fca5a5', padding: '8px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
          <LogOut size={18} />
        </button>
      </div>
    </header>
  );
};

export default Navbar;
