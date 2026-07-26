import React from 'react';
import { ArrowRight, Sparkles, Layers } from 'lucide-react';
import GlassButton from './GlassButton';

const HeroSection = ({ onExploreServices, onViewMap, t }) => {
  return (
    <section className="landing-section" style={{ paddingTop: '60px', paddingBottom: '90px' }}>
      <div style={{
        maxWidth: '860px',
        margin: '0 auto',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}>
        
        {/* Top Badge */}
        <div className="section-badge" style={{ marginBottom: '20px' }}>
          <Sparkles size={14} />
          <span>{t?.heroBadge || "Official Digital Twin Infrastructure • AMRUT 2.0"}</span>
        </div>

        {/* Hero Heading */}
        <h1 style={{
          fontSize: '3.8rem',
          fontWeight: 800,
          lineHeight: 1.15,
          color: 'var(--gvmc-text)',
          letterSpacing: '-1.5px',
          marginBottom: '24px'
        }}>
          {t?.heroTitle1 || "Smart Water"}{' '}
          <span style={{
            background: 'linear-gradient(135deg, var(--gvmc-primary) 0%, var(--gvmc-accent) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            {t?.heroTitle2 || "Management"}
          </span> <br />
          {t?.heroTitle3 || "for Greater Visakhapatnam"}
        </h1>

        {/* Hero Subtitle */}
        <p style={{
          fontSize: '1.25rem',
          color: 'var(--gvmc-text-muted)',
          lineHeight: 1.6,
          marginBottom: '40px',
          maxWidth: '680px',
          fontWeight: 400
        }}>
          {t?.heroDesc || "Building a sustainable, transparent and digitally connected water ecosystem through Digital Twin technology, AI and IoT across all municipal zones."}
        </p>

        {/* CTA Buttons Centered */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
          <GlassButton
            variant="primary"
            icon={ArrowRight}
            onClick={onExploreServices}
            style={{ padding: '16px 36px', fontSize: '1.05rem', borderRadius: '16px' }}
          >
            {t?.btnExploreServices || "Explore Services"}
          </GlassButton>

          <GlassButton
            variant="secondary"
            icon={Layers}
            onClick={onViewMap}
            style={{ padding: '16px 36px', fontSize: '1.05rem', borderRadius: '16px' }}
          >
            {t?.btnViewLiveMap || "View Live Map"}
          </GlassButton>
        </div>

        {/* Quick Metrics Centered */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '48px',
          marginTop: '56px',
          paddingTop: '36px',
          borderTop: '1px solid rgba(0, 91, 172, 0.12)',
          width: '100%',
          maxWidth: '720px'
        }}>
          <div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--gvmc-primary)' }}>{t?.metric1Val || "1.2 Lakh+"}</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--gvmc-text-muted)', fontWeight: 500, marginTop: '4px' }}>{t?.metric1Label || "Smart Meters Connected"}</div>
          </div>
          <div style={{ width: '1px', height: '40px', background: 'rgba(0, 91, 172, 0.15)' }} />
          <div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--gvmc-secondary)' }}>{t?.metric2Val || "8 Zones"}</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--gvmc-text-muted)', fontWeight: 500, marginTop: '4px' }}>{t?.metric2Label || "SCADA Automated Supply"}</div>
          </div>
          <div style={{ width: '1px', height: '40px', background: 'rgba(0, 91, 172, 0.15)' }} />
          <div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--gvmc-success)' }}>{t?.metric3Val || "99.4%"}</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--gvmc-text-muted)', fontWeight: 500, marginTop: '4px' }}>{t?.metric3Label || "AI Leak Detection Accuracy"}</div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default HeroSection;
