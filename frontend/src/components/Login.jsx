import React, { useState } from 'react';
import { Droplets, Lock, User, ShieldCheck } from 'lucide-react';

const Login = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/v1/auth/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const data = await res.json();
      if (res.ok) {
        onLoginSuccess(data);
      } else {
        setError(data.detail || 'Invalid username or password credentials');
      }
    } catch (err) {
      setError('Connection failed. Ensure Python backend is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'radial-gradient(at 0% 0%, rgba(0, 229, 255, 0.12) 0px, transparent 50%), radial-gradient(at 100% 100%, rgba(14, 165, 233, 0.15) 0px, transparent 50%), #070d19', padding: '20px' }}>
      <div className="gvmc-panel" style={{ width: '100%', maxWidth: '440px', padding: '40px 32px' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ display: 'inline-flex', background: 'linear-gradient(135deg, #00e5ff 0%, #0284c7 100%)', padding: '12px', borderRadius: '16px', marginBottom: '16px' }}>
            <Droplets color="#070d19" size={32} />
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#fff', letterSpacing: '0.5px' }}>GVMC SMART CITY</h1>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }}>Visakhapatnam Municipal Corporation Portal</p>
        </div>

        {error && (
          <div style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.4)', color: '#fca5a5', padding: '12px', borderRadius: '8px', marginBottom: '20px', fontSize: '0.85rem', textAlign: 'center' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '6px', display: 'block' }}>Username / Email</label>
            <div style={{ position: 'relative' }}>
              <User size={18} style={{ position: 'absolute', left: '12px', top: '14px', color: 'var(--text-muted)' }} />
              <input
                type="text"
                className="gvmc-input"
                style={{ paddingLeft: '40px' }}
                placeholder="mainadmin or sec_gajuwaka"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '6px', display: 'block' }}>Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{ position: 'absolute', left: '12px', top: '14px', color: 'var(--text-muted)' }} />
              <input
                type="password"
                className="gvmc-input"
                style={{ paddingLeft: '40px' }}
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button type="submit" className="btn-gvmc" disabled={loading} style={{ width: '100%', justifyContent: 'center', padding: '14px', marginTop: '10px' }}>
            {loading ? 'Authenticating...' : 'Sign In to Dashboard'}
          </button>
        </form>

        {/* Demo Credentials Hint Box */}
        <div style={{ marginTop: '28px', paddingTop: '20px', borderTop: '1px solid var(--border-light)', fontSize: '0.8rem' }}>
          <div style={{ fontWeight: 700, color: 'var(--primary-cyan)', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <ShieldCheck size={14} /> Available Demo Credentials:
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', color: 'var(--text-muted)' }}>
            <div><strong>GVMC Main Admin:</strong> mainadmin / admin123</div>
            <div><strong>Gajuwaka Sector Head:</strong> sec_gajuwaka / sec_gajuwaka</div>
            <div><strong>MVP Colony Sector Head:</strong> sec_mvp / sec_mvp</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
