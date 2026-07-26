import React from 'react';
import { ArrowUpRight, Droplets, CloudRain, ShieldCheck, Waves, Gauge, GitMerge } from 'lucide-react';
import GlassCard from './GlassCard';

const SchemeCards = ({ onSelectScheme, t }) => {
  const schemes = [
    {
      title: t?.scheme1Title || 'Smart Water Distribution (AMRUT 2.0)',
      description: t?.scheme1Desc || 'Comprehensive 24x7 pressurized water supply project for 1.2+ lakh households with automated SCADA control.',
      icon: Droplets,
      badge: 'FLAGSHIP SCHEME',
      gradient: 'linear-gradient(135deg, #005BAC 0%, #00B8D9 100%)'
    },
    {
      title: t?.scheme2Title || 'Mandatory Rainwater Harvesting',
      description: t?.scheme2Desc || 'GVMC subsidy program encouraging rooftop harvesting pits across residential and commercial buildings.',
      icon: CloudRain,
      badge: 'CONSERVATION',
      gradient: 'linear-gradient(135deg, #0077CC 0%, #10B981 100%)'
    },
    {
      title: t?.scheme3Title || 'Water Conservation Drive',
      description: t?.scheme3Desc || 'Community-driven awareness campaign targeting 20% reduction in non-revenue water (NRW) loss by 2026.',
      icon: ShieldCheck,
      badge: 'SUSTAINABILITY',
      gradient: 'linear-gradient(135deg, #0284C7 0%, #38BDF8 100%)'
    },
    {
      title: t?.scheme4Title || 'Urban Lake Restoration',
      description: t?.scheme4Desc || 'Ecological rejuvenation of Mudasarlova and Meghadrigedda reservoirs to increase storage capacity by 35%.',
      icon: Waves,
      badge: 'REJUVENATION',
      gradient: 'linear-gradient(135deg, #0369A1 0%, #00E5FF 100%)'
    },
    {
      title: t?.scheme5Title || 'Smart AMRI Metering Network',
      description: t?.scheme5Desc || 'Deployment of smart ultrasonic water meters providing real-time telemetry and transparent volumetric billing.',
      icon: Gauge,
      badge: 'SMART CITY',
      gradient: 'linear-gradient(135deg, #0F766E 0%, #14B8A6 100%)'
    },
    {
      title: t?.scheme6Title || 'HDPE Pipeline Modernization',
      description: t?.scheme6Desc || 'Replacing legacy iron mains with non-corrosive high-density polyethylene pipes to ensure zero contamination.',
      icon: GitMerge,
      badge: 'INFRASTRUCTURE',
      gradient: 'linear-gradient(135deg, #1E40AF 0%, #3B82F6 100%)'
    }
  ];

  return (
    <section id="schemes-section" className="landing-section">
      <div className="section-header">
        <div className="section-badge">{t?.schemesBadge || "Government Initiatives"}</div>
        <h2 className="section-title">{t?.schemesTitle || "GVMC Flagship Water Schemes"}</h2>
        <p className="section-subtitle">
          {t?.schemesSubtitle || "Transforming Visakhapatnam into a resilient smart water metropolis under AMRUT 2.0 & National Urban Water Missions."}
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
        gap: '24px'
      }}>
        {schemes.map((scheme, idx) => (
          <GlassCard
            key={idx}
            className="scheme-card"
            onClick={() => onSelectScheme(scheme)}
            style={{
              padding: '28px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            {/* Top Accent Stripe */}
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '4px',
              background: scheme.gradient
            }} />

            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '14px',
                  background: scheme.gradient,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  boxShadow: '0 8px 20px rgba(0, 0, 0, 0.12)'
                }}>
                  <scheme.icon size={24} />
                </div>
                <span style={{
                  fontSize: '0.68rem',
                  fontWeight: 800,
                  letterSpacing: '0.8px',
                  background: 'rgba(0, 91, 172, 0.08)',
                  color: 'var(--gvmc-primary)',
                  padding: '4px 10px',
                  borderRadius: '100px',
                  border: '1px solid rgba(0, 91, 172, 0.15)'
                }}>
                  {scheme.badge}
                </span>
              </div>

              <h3 style={{
                fontSize: '1.2rem',
                fontWeight: 800,
                color: 'var(--gvmc-text)',
                marginBottom: '10px',
                lineHeight: 1.3
              }}>
                {scheme.title}
              </h3>

              <p style={{
                fontSize: '0.88rem',
                color: 'var(--gvmc-text-muted)',
                lineHeight: 1.5,
                marginBottom: '24px'
              }}>
                {scheme.description}
              </p>
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingTop: '16px',
              borderTop: '1px solid rgba(0, 0, 0, 0.06)'
            }}>
              <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--gvmc-primary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                {t?.btnViewDetails || "View Scheme Details"}
              </span>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: 'rgba(0, 91, 172, 0.08)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--gvmc-primary)'
              }}>
                <ArrowUpRight size={18} />
              </div>
            </div>
          </GlassCard>
        ))}
      </div>
    </section>
  );
};

export default SchemeCards;
