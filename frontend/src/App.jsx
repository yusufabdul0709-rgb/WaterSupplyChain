import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import MapView from './components/MapView';
import ComplaintsTab from './components/ComplaintsTab';
import SectorAdminManager from './components/SectorAdminManager';
import Login from './components/Login';
import LandingPage from './pages/LandingPage';
import { Activity, ShieldAlert, Cpu, CheckCircle } from 'lucide-react';

function App() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [sectors, setSectors] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [selectedSector, setSelectedSector] = useState('ALL');
  const [activeTab, setActiveTab] = useState('command'); // 'command', 'complaints', 'sector_admins'
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check saved session
    const savedUser = localStorage.getItem('gvmc_user');
    if (savedUser) {
      const parsed = JSON.parse(savedUser);
      setUser(parsed);
      if (parsed.role !== 'GVMC_HQ_ADMIN' && parsed.role !== 'MAIN') {
        setSelectedSector(parsed.sector_id || 'SEC_GAJUWAKA');
      }
    }
  }, []);

  useEffect(() => {
    if (user) {
      fetchSectors();
      fetchComplaints();
    }
  }, [user, selectedSector]);

  const fetchSectors = async () => {
    try {
      const res = await fetch('/api/v1/sectors');
      if (res.ok) {
        const data = await res.json();
        setSectors(data);
      }
    } catch (e) {
      console.error('Error fetching sectors', e);
    }
  };

  const fetchComplaints = async () => {
    try {
      const sectorQuery = selectedSector !== 'ALL' ? `?sector_id=${selectedSector}` : '';
      const res = await fetch(`/api/v1/complaints${sectorQuery}`);
      if (res.ok) {
        const data = await res.json();
        setComplaints(data);
      }
    } catch (e) {
      console.error('Error fetching complaints', e);
    }
  };

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    localStorage.setItem('gvmc_user', JSON.stringify(userData));
    if (userData.role !== 'GVMC_HQ_ADMIN' && userData.role !== 'MAIN') {
      setSelectedSector(userData.sector_id || 'SEC_GAJUWAKA');
    } else {
      setSelectedSector('ALL');
    }
    navigate('/dashboard');
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('gvmc_user');
    navigate('/');
  };

  return (
    <Routes>
      <Route path="/" element={<LandingPage onLoginSuccess={handleLoginSuccess} user={user} />} />
      <Route path="/login" element={<Login onLoginSuccess={handleLoginSuccess} />} />
      <Route
        path="/dashboard"
        element={
          !user ? (
            <Login onLoginSuccess={handleLoginSuccess} />
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', width: '100vw', overflow: 'hidden', background: '#070d19' }}>
      {/* Top Navigation */}
      <Navbar
        user={user}
        sectors={sectors}
        selectedSector={selectedSector}
        setSelectedSector={setSelectedSector}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onLogout={handleLogout}
      />

      {/* Main Body */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Left Navigation Sidebar */}
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Center Main View Area */}
        <main style={{ flex: 1, padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px', overflow: 'hidden' }}>
          {activeTab === 'command' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '16px', height: '100%' }}>
              {/* Map & Telemetry Dashboard Left */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', height: '100%' }}>
                {/* Mapbox Visakhapatnam Map */}
                <div style={{ flex: 1, position: 'relative' }}>
                  <MapView selectedSector={selectedSector} complaints={complaints} />
                </div>
              </div>

              {/* AI Intelligence & System Feed Panel Right */}
              <div className="gvmc-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '20px', overflowY: 'auto' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, fontSize: '1rem', color: '#00e5ff' }}>
                    <Cpu size={20} /> AI Command Intelligence
                  </div>
                  <span style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#34d399', padding: '2px 8px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 700 }}>ONLINE</span>
                </div>

                <div className="gvmc-card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.85rem' }}>
                    <span style={{ color: 'var(--text-muted)' }}>AI HEALTH</span>
                    <span style={{ color: 'var(--primary-emerald)', fontWeight: 700 }}>98.4% Excellent</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                    <span style={{ color: 'var(--text-muted)' }}>CURRENT NRW LOSS</span>
                    <span style={{ color: '#facc15', fontWeight: 700 }}>14.8% (Target &lt;10%)</span>
                  </div>
                </div>

                {/* AI Daily Insight */}
                <div className="gvmc-card" style={{ borderLeft: '4px solid #00e5ff' }}>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: '6px', color: '#fff' }}>
                    AI Autonomous Zone Analysis
                  </div>
                  <ul style={{ paddingLeft: '16px', fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <li>One pipe rupture risk detected in Sector 7 (Junction 04).</li>
                    <li>Two low pressure pockets identified in Ward 18.</li>
                    <li style={{ color: 'var(--primary-emerald)' }}>No chemical contamination detected across all 8 reservoirs.</li>
                  </ul>
                </div>

                {/* Live Complaints Summary in Sidebar */}
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <ShieldAlert size={16} color="#ef4444" /> Sector Complaints Feed
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {complaints.slice(0, 3).map(c => (
                      <div key={c.id} style={{ background: 'rgba(7, 13, 25, 0.6)', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-light)', fontSize: '0.8rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600, color: '#fff' }}>
                          <span>{c.issue_type || c.title}</span>
                          <span style={{ color: '#00e5ff' }}>{c.sector_name || c.sector_id}</span>
                        </div>
                        <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: '2px' }}>{c.description}</div>
                      </div>
                    ))}
                    {complaints.length === 0 && (
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'center', padding: '12px' }}>No active sector complaints</div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'complaints' && (
            <ComplaintsTab complaints={complaints} selectedSector={selectedSector} />
          )}

          {activeTab === 'sector_admins' && (
            <SectorAdminManager sectors={sectors} onRefresh={fetchSectors} />
          )}
        </main>
      </div>

      {/* Bottom Telemetry Bar */}
      <footer className="gvmc-panel" style={{ borderRadius: '0', borderLeft: 'none', borderRight: 'none', borderBottom: 'none', padding: '8px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
        <div style={{ display: 'flex', gap: '20px' }}>
          <span>Telemetry Live: <strong style={{ color: 'var(--primary-emerald)' }}>Connected</strong></span>
          <span>Active Sensors: <strong style={{ color: '#fff' }}>215</strong></span>
          <span>Pressure Zones: <strong style={{ color: '#fff' }}>12</strong></span>
        </div>
        <div>
          GVMC Smart City Command Headquarters &bull; Visakhapatnam, Andhra Pradesh
        </div>
      </footer>
            </div>
          )
        }
      />
      <Route path="/*" element={<Navigate to={user ? "/dashboard" : "/"} replace />} />
    </Routes>
  );
}

export default App;
