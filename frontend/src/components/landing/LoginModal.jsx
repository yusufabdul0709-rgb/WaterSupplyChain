import React, { useState } from 'react';
import { X, Lock, User, Building2, ShieldCheck, Phone, Mail, Key, ArrowRight, Droplets, Sparkles } from 'lucide-react';
import GlassButton from './GlassButton';

const LoginModal = ({ isOpen, onClose, onLoginSuccess }) => {
  const [activeTab, setActiveTab] = useState('citizen'); // 'citizen' or 'admin'
  const [secretAdminToggle, setSecretAdminToggle] = useState(false);

  // Citizen form state
  const [citizenId, setCitizenId] = useState('');
  const [citizenOTP, setCitizenOTP] = useState('');

  // Admin form state
  const [username, setUsername] = useState('mainadmin');
  const [password, setPassword] = useState('admin123');
  const [department, setDepartment] = useState('Water Supply & Distribution');
  const [role, setRole] = useState('GVMC_HQ_ADMIN');

  if (!isOpen) return null;

  const handleCitizenSubmit = (e) => {
    e.preventDefault();
    // Pure UI simulation as required by instructions
    onLoginSuccess({
      username: citizenId || 'citizen_vizag',
      full_name: 'Visakhapatnam Citizen',
      role: 'CITIZEN',
      sector_id: 'SEC_GAJUWAKA',
      token: 'ui_mock_token_citizen'
    });
  };

  const handleAdminSubmit = (e) => {
    e.preventDefault();
    // Pure UI simulation as required by instructions
    onLoginSuccess({
      username: username || 'mainadmin',
      full_name: role === 'GVMC_HQ_ADMIN' ? 'GVMC Municipal Commissioner HQ' : `${username} (${role})`,
      role: role,
      department: department,
      sector_id: role === 'GVMC_HQ_ADMIN' ? 'HQ' : 'SEC_GAJUWAKA',
      token: 'ui_mock_token_admin_' + Date.now()
    });
  };

  const handleQuickDemoLogin = (demoRole, demoUser, demoDept) => {
    onLoginSuccess({
      username: demoUser,
      full_name: demoRole === 'GVMC_HQ_ADMIN' ? 'GVMC Municipal Commissioner HQ' : `Sector Engineer (${demoUser})`,
      role: demoRole,
      department: demoDept,
      sector_id: demoRole === 'GVMC_HQ_ADMIN' ? 'HQ' : 'SEC_GAJUWAKA',
      token: 'ui_mock_token_demo'
    });
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div 
        className="modal-content glass-card"
        style={{
          width: '100%',
          maxWidth: '480px',
          padding: '36px',
          background: 'rgba(255, 255, 255, 0.88)',
          boxShadow: '0 24px 64px rgba(0, 50, 100, 0.22)',
          border: '1px solid rgba(255, 255, 255, 0.9)',
          position: 'relative'
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'rgba(0, 91, 172, 0.08)',
            border: 'none',
            borderRadius: '50%',
            width: '36px',
            height: '36px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--gvmc-text)',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
        >
          <X size={18} />
        </button>

        {/* Header Emblem */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{
            display: 'inline-flex',
            background: 'linear-gradient(135deg, var(--gvmc-primary) 0%, var(--gvmc-secondary) 100%)',
            padding: '12px',
            borderRadius: '16px',
            marginBottom: '12px',
            boxShadow: '0 8px 20px rgba(0, 91, 172, 0.2)'
          }}>
            <Droplets color="#ffffff" size={28} />
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--gvmc-text)', letterSpacing: '-0.3px' }}>
            GVMC Portal Login
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--gvmc-text-muted)', marginTop: '4px' }}>
            Greater Visakhapatnam Smart Water Platform
          </p>
        </div>

        {/* Citizen | Admin Toggle */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          background: 'rgba(0, 91, 172, 0.06)',
          padding: '4px',
          borderRadius: '14px',
          marginBottom: '24px'
        }}>
          <button
            type="button"
            onClick={() => setActiveTab('citizen')}
            style={{
              padding: '10px',
              border: 'none',
              borderRadius: '10px',
              background: activeTab === 'citizen' ? '#ffffff' : 'transparent',
              color: activeTab === 'citizen' ? 'var(--gvmc-primary)' : 'var(--gvmc-text-muted)',
              fontWeight: 700,
              fontSize: '0.9rem',
              cursor: 'pointer',
              boxShadow: activeTab === 'citizen' ? '0 2px 8px rgba(0, 0, 0, 0.08)' : 'none',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}
          >
            <User size={16} />
            <span>Citizen Login</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('admin')}
            style={{
              padding: '10px',
              border: 'none',
              borderRadius: '10px',
              background: activeTab === 'admin' ? '#ffffff' : 'transparent',
              color: activeTab === 'admin' ? 'var(--gvmc-primary)' : 'var(--gvmc-text-muted)',
              fontWeight: 700,
              fontSize: '0.9rem',
              cursor: 'pointer',
              boxShadow: activeTab === 'admin' ? '0 2px 8px rgba(0, 0, 0, 0.08)' : 'none',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}
          >
            <ShieldCheck size={16} />
            <span>Admin Login</span>
          </button>
        </div>

        {/* Citizen Login Form */}
        {activeTab === 'citizen' && (
          <form onSubmit={handleCitizenSubmit}>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--gvmc-text)', marginBottom: '6px' }}>
                Citizen ID / Mobile Number / Email
              </label>
              <div style={{ position: 'relative' }}>
                <Phone size={18} color="var(--gvmc-text-muted)" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="text"
                  required
                  placeholder="+91 98765 43210 or VZG-2026-88"
                  value={citizenId}
                  onChange={(e) => setCitizenId(e.target.value)}
                  className="landing-form-input"
                  style={{ paddingLeft: '42px' }}
                />
              </div>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--gvmc-text)', marginBottom: '6px' }}>
                One-Time Password (OTP) or PIN
              </label>
              <div style={{ position: 'relative' }}>
                <Key size={18} color="var(--gvmc-text-muted)" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="password"
                  required
                  placeholder="• • • • • •"
                  value={citizenOTP}
                  onChange={(e) => setCitizenOTP(e.target.value)}
                  className="landing-form-input"
                  style={{ paddingLeft: '42px', letterSpacing: '2px' }}
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '6px' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--gvmc-primary)', cursor: 'pointer', fontWeight: 600 }}>
                  Send OTP via SMS / WhatsApp
                </span>
              </div>
            </div>

            <GlassButton type="submit" variant="primary" icon={ArrowRight} style={{ width: '100%', padding: '14px' }}>
              Login to Citizen Portal
            </GlassButton>
          </form>
        )}

        {/* Admin Login Form */}
        {activeTab === 'admin' && (
          <form onSubmit={handleAdminSubmit}>
            <div style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--gvmc-text)', marginBottom: '6px' }}>
                Username
              </label>
              <div style={{ position: 'relative' }}>
                <User size={18} color="var(--gvmc-text-muted)" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="text"
                  required
                  placeholder="e.g. mainadmin"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="landing-form-input"
                  style={{ paddingLeft: '42px' }}
                />
              </div>
            </div>

            <div style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--gvmc-text)', marginBottom: '6px' }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <Lock size={18} color="var(--gvmc-text-muted)" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="password"
                  required
                  placeholder="• • • • • • • •"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="landing-form-input"
                  style={{ paddingLeft: '42px' }}
                />
              </div>
            </div>

            <div style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--gvmc-text)', marginBottom: '6px' }}>
                Department
              </label>
              <div style={{ position: 'relative' }}>
                <Building2 size={18} color="var(--gvmc-text-muted)" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="landing-form-input"
                  style={{ paddingLeft: '42px', cursor: 'pointer' }}
                >
                  <option value="Water Supply & Distribution">Water Supply & Distribution</option>
                  <option value="Water Quality & Telemetry">Water Quality & Telemetry</option>
                  <option value="Emergency Response & Leakage">Emergency Response & Leakage</option>
                  <option value="Revenue & Property Tax">Revenue & Property Tax</option>
                </select>
              </div>
            </div>

            <div style={{ marginBottom: '22px' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--gvmc-text)', marginBottom: '6px' }}>
                Role
              </label>
              <div style={{ position: 'relative' }}>
                <ShieldCheck size={18} color="var(--gvmc-text-muted)" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="landing-form-input"
                  style={{ paddingLeft: '42px', cursor: 'pointer' }}
                >
                  <option value="GVMC_HQ_ADMIN">GVMC HQ Commissioner / Main Admin</option>
                  <option value="SECTOR_ADMIN">Sector Engineer / Zonal Head</option>
                  <option value="WARD_OFFICER">Ward Officer / Inspector</option>
                  <option value="ANALYST">Digital Twin AI Analyst</option>
                </select>
              </div>
            </div>

            <GlassButton type="submit" variant="primary" icon={ShieldCheck} style={{ width: '100%', padding: '14px' }}>
              Login to Digital Twin Dashboard
            </GlassButton>
          </form>
        )}

        {/* Secret Admin Access Toggle */}
        <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid rgba(0, 91, 172, 0.12)', textAlign: 'center' }}>
          <button
            type="button"
            onClick={() => setSecretAdminToggle(!secretAdminToggle)}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--gvmc-text-muted)',
              fontSize: '0.75rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Sparkles size={14} color="var(--gvmc-accent)" />
            <span>Secret Admin Access Toggle {secretAdminToggle ? '(Active)' : ''}</span>
          </button>

          {secretAdminToggle && (
            <div style={{ marginTop: '12px', display: 'flex', gap: '8px', justifyContent: 'center' }}>
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('GVMC_HQ_ADMIN', 'mainadmin', 'Water Supply & Distribution')}
                style={{
                  padding: '6px 12px',
                  borderRadius: '8px',
                  background: 'rgba(0, 91, 172, 0.1)',
                  border: '1px solid var(--gvmc-primary)',
                  color: 'var(--gvmc-primary)',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                ⚡ Commissioner HQ
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('SECTOR_ADMIN', 'sec_gajuwaka', 'Emergency Response')}
                style={{
                  padding: '6px 12px',
                  borderRadius: '8px',
                  background: 'rgba(0, 184, 217, 0.1)',
                  border: '1px solid var(--gvmc-accent)',
                  color: '#008499',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                ⚡ Gajuwaka Zonal
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
