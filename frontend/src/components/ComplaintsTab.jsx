import React from 'react';
import { AlertCircle, CheckCircle2, MapPin, User, Phone } from 'lucide-react';

const ComplaintsTab = ({ complaints, selectedSector }) => {
  const filtered = selectedSector === 'ALL' ? complaints : complaints.filter(c => c.sector_id === selectedSector || selectedSector.includes(c.sector_id.replace('SEC_', '')));

  return (
    <div className="gvmc-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px', height: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Citizen Complaints Management</h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Showing {filtered.length} complaints {selectedSector !== 'ALL' ? `for ${selectedSector}` : 'across all GVMC sectors'}
          </p>
        </div>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-light)', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              <th style={{ padding: '12px' }}>Complaint ID</th>
              <th style={{ padding: '12px' }}>Issue & Description</th>
              <th style={{ padding: '12px' }}>Citizen Info</th>
              <th style={{ padding: '12px' }}>Sector</th>
              <th style={{ padding: '12px' }}>Location (Lat/Lon)</th>
              <th style={{ padding: '12px' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((c) => (
              <tr key={c.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)', fontSize: '0.9rem' }}>
                <td style={{ padding: '14px 12px', fontWeight: 700, color: '#00e5ff' }}>
                  {c.id}
                </td>
                <td style={{ padding: '14px 12px' }}>
                  <div style={{ fontWeight: 600, color: '#fff' }}>{c.issue_type || c.title || 'Water Supply Problem'}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', maxWidth: '300px' }}>{c.description}</div>
                </td>
                <td style={{ padding: '14px 12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600 }}>
                    <User size={14} color="var(--primary-blue)" /> {c.citizen_name || c.user_name || 'Citizen'}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    <Phone size={12} /> {c.phone || c.user_phone || '+91 98480 00000'}
                  </div>
                </td>
                <td style={{ padding: '14px 12px' }}>
                  <span style={{ background: 'rgba(14, 165, 233, 0.15)', color: '#38bdf8', padding: '4px 10px', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 600 }}>
                    {c.sector_name || c.sector_id}
                  </span>
                </td>
                <td style={{ padding: '14px 12px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <MapPin size={14} color="#ef4444" />
                    <span>{c.lat ? c.lat.toFixed(4) : '17.7200'}, {c.lon || c.lng ? (c.lon || c.lng).toFixed(4) : '83.2800'}</span>
                  </div>
                </td>
                <td style={{ padding: '14px 12px' }}>
                  <span className={c.status === 'PENDING' ? 'badge-pending' : 'badge-resolved'}>
                    {c.status}
                  </span>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', padding: '32px', color: 'var(--text-muted)' }}>
                  No active complaints found for this sector.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ComplaintsTab;
