import React, { useState } from 'react';
import { UserPlus, Shield, CheckCircle, Lock, User, Mail, MapPin } from 'lucide-react';

const SectorAdminManager = ({ sectors, onRefresh }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [sectorId, setSectorId] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!username || !password || !sectorId) {
      alert('Please fill in username, password, and select a sector.');
      return;
    }
    setLoading(true);
    setMessage('');

    try {
      const res = await fetch('/api/v1/sectors/admin/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username,
          password,
          sector_id: sectorId,
          full_name: fullName,
          email
        })
      });

      const data = await res.json();
      if (res.ok) {
        setMessage('✅ Sector Head account created successfully!');
        setUsername('');
        setPassword('');
        setFullName('');
        setEmail('');
        if (onRefresh) onRefresh();
      } else {
        alert(data.detail || 'Failed to create sector admin');
      }
    } catch (err) {
      alert('Server error creating admin');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', height: '100%' }}>
      {/* Create Form */}
      <div className="gvmc-panel" style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#00e5ff', marginBottom: '6px' }}>
            <UserPlus size={24} />
            <h2 style={{ fontSize: '1.4rem', fontWeight: 700 }}>Add Sector Head Account</h2>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            GVMC Main Admin can generate credentials for sector administrators across Visakhapatnam.
          </p>
        </div>

        {message && (
          <div style={{ background: 'rgba(16, 185, 129, 0.15)', border: '1px solid #10b981', color: '#34d399', padding: '12px', borderRadius: '8px', fontSize: '0.9rem' }}>
            {message}
          </div>
        )}

        <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px', display: 'block' }}>Assign Visakhapatnam Sector</label>
            <select
              className="gvmc-input"
              value={sectorId}
              onChange={(e) => setSectorId(e.target.value)}
              required
            >
              <option value="">Select Sector Town...</option>
              {sectors.map(s => (
                <option key={s.id} value={s.id} style={{ background: '#0b1329' }}>
                  {s.zone} — {s.name} ({s.id})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px', display: 'block' }}>Official Full Name / Title</label>
            <input
              type="text"
              className="gvmc-input"
              placeholder="e.g. Er. K. Rao (Gajuwaka Zone Head)"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>

          <div>
            <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px', display: 'block' }}>Sector Username</label>
            <input
              type="text"
              className="gvmc-input"
              placeholder="e.g. sec_gajuwaka"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div>
            <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px', display: 'block' }}>Password</label>
            <input
              type="password"
              className="gvmc-input"
              placeholder="Set initial password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn-gvmc" disabled={loading} style={{ marginTop: '8px', justifyContent: 'center' }}>
            {loading ? 'Creating...' : 'Create Sector Admin Credentials'}
          </button>
        </form>
      </div>

      {/* Overview Info Card */}
      <div className="gvmc-panel" style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#00e5ff' }}>
          <Shield size={24} />
          <h2 style={{ fontSize: '1.4rem', fontWeight: 700 }}>Registered Sector Heads</h2>
        </div>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          Active credentials for sector heads in Visakhapatnam Municipal Corporation.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', overflowY: 'auto', maxHeight: '420px' }}>
          {sectors.map((s) => (
            <div key={s.id} className="gvmc-card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontWeight: 700, color: '#fff', fontSize: '0.95rem' }}>{s.name}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--primary-cyan)' }}>{s.zone} ({s.id})</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{s.admin_email}</div>
              </div>
              <div style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#34d399', padding: '4px 10px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 700 }}>
                ACTIVE
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SectorAdminManager;
