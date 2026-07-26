import React from 'react';
import { Calendar, Clock, FileText, ShieldAlert } from 'lucide-react';
import GlassCard from './GlassCard';

const NewsSection = ({ t }) => {
  const newsItems = [
    {
      category: t?.todayNotice || "Today's Maintenance Notice",
      title: 'Scheduled Valve Calibration in Sector 4 (Gajuwaka)',
      date: '26 July 2026 • 2:00 PM to 4:30 PM',
      description: t?.todayNoticeDesc || 'Routine SCADA flow meter calibration and valve maintenance will be conducted in Gajuwaka industrial zone. Backup drinking water reservoirs have been pre-charged.',
      icon: Clock,
      badgeColor: '#0077CC',
      type: 'MAINTENANCE'
    },
    {
      category: t?.pressurizedSchedule || 'Pressurized Supply Schedule',
      title: 'AMRUT 2.0 Pressurized Supply Timings Updated',
      date: 'Effective from 1st August 2026',
      description: t?.pressurizedScheduleDesc || 'Residential sectors in MVP Colony, Seethammadhara, and Madhurawada will transition to continuous 24x7 pressurized drinking water under the Phase 3 municipal rollout.',
      icon: Calendar,
      badgeColor: '#005BAC',
      type: 'SCHEDULE'
    },
    {
      category: t?.publicAdvisory || 'Public Advisory',
      title: 'Mandatory Rainwater Harvesting & Borewell Registry',
      date: 'Official Notice GVMC/ENG/2026-99',
      description: t?.publicAdvisoryDesc || 'All commercial complexes and multi-story apartments in Visakhapatnam must register their percolation structures with the municipal town planning board by August 31st.',
      icon: FileText,
      badgeColor: '#10B981',
      type: 'NOTICE'
    },
    {
      category: t?.monsoonAlert || 'Monsoon Emergency Preparedness',
      title: 'No Active Municipal Alarms — Normal Monsoon Operations',
      date: 'Live Status: All Clear',
      description: t?.monsoonAlertDesc || 'All 8 reservoir spillways and coastal stormwater pumping stations are functioning within normal safety tolerances. Zero flooding hazards identified.',
      icon: ShieldAlert,
      badgeColor: '#00C853',
      type: 'EMERGENCY'
    }
  ];

  return (
    <section id="news-section" className="landing-section">
      <div className="section-header">
        <div className="section-badge">{t?.newsBadge || "Updates & Bulletins"}</div>
        <h2 className="section-title">{t?.newsTitle || "News & Announcements"}</h2>
        <p className="section-subtitle">
          {t?.newsSubtitle || "Latest municipal notices, supply schedules, maintenance alerts, and public advisories from Tenneti Bhavan."}
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '24px'
      }}>
        {newsItems.map((item, idx) => (
          <GlassCard key={idx} style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <span style={{
                  fontSize: '0.68rem',
                  fontWeight: 800,
                  color: '#fff',
                  background: item.badgeColor,
                  padding: '3px 10px',
                  borderRadius: '100px',
                  letterSpacing: '0.5px'
                }}>
                  {item.category}
                </span>
                <div style={{ color: item.badgeColor }}>
                  <item.icon size={20} />
                </div>
              </div>

              <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--gvmc-text)', marginBottom: '8px', lineHeight: 1.35 }}>
                {item.title}
              </h3>

              <div style={{ fontSize: '0.72rem', color: 'var(--gvmc-primary)', fontWeight: 600, marginBottom: '14px' }}>
                {item.date}
              </div>

              <p style={{ fontSize: '0.85rem', color: 'var(--gvmc-text-muted)', lineHeight: 1.5, margin: 0 }}>
                {item.description}
              </p>
            </div>
          </GlassCard>
        ))}
      </div>
    </section>
  );
};

export default NewsSection;
