import React, { useState } from 'react';
import { Droplets, Bell, Globe, LogIn, CheckCircle2 } from 'lucide-react';
import SearchBar from './SearchBar';
import GlassButton from './GlassButton';

const Navbar = ({ onOpenLoginModal, onSearch, lang, onToggleLang, t }) => {
  const [showNotifications, setShowNotifications] = useState(false);

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="landing-navbar" style={{ padding: '16px 32px' }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        maxWidth: '1600px',
        margin: '0 auto',
        gap: '24px'
      }}>
        
        {/* Left Branding */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', cursor: 'pointer', flexShrink: 0 }} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <div style={{
            background: 'linear-gradient(135deg, var(--gvmc-primary) 0%, var(--gvmc-secondary) 100%)',
            padding: '9px',
            borderRadius: '14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 14px rgba(0, 91, 172, 0.22)'
          }}>
            <Droplets color="#ffffff" size={24} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--gvmc-text)', letterSpacing: '-0.3px' }}>GVMC</span>
              <span style={{ background: 'rgba(0, 91, 172, 0.08)', color: 'var(--gvmc-primary)', padding: '2px 8px', borderRadius: '6px', fontSize: '0.65rem', fontWeight: 700, border: '1px solid rgba(0, 91, 172, 0.18)' }}>
                {t?.govtBadge || "GOVT OF ANDHRA PRADESH"}
              </span>
            </div>
            <p style={{ fontSize: '0.72rem', color: 'var(--gvmc-text-muted)', fontWeight: 500, margin: 0 }}>
              {t?.corporationName || "Greater Visakhapatnam Municipal Corporation"}
            </p>
          </div>
        </div>

        {/* Center Section: Search Option in Middle + Elegant Fine-Font Spaced Nav Tabs */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '10px',
          flex: 1,
          maxWidth: '820px'
        }}>
          
          {/* Search Option in Middle */}
          <SearchBar onSearch={onSearch} placeholder={t?.navSearchPlaceholder} />

          {/* Fine Font Spaced Navigation Tabs */}
          <nav style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            flexWrap: 'wrap'
          }}>
            <a onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="landing-nav-link active">{t?.navHome || "Home"}</a>
            <a onClick={() => scrollToSection('services-section')} className="landing-nav-link">{t?.navServices || "Services"}</a>
            <a onClick={() => scrollToSection('schemes-section')} className="landing-nav-link">{t?.navSchemes || "Schemes"}</a>
            <a onClick={() => scrollToSection('live-status-section')} className="landing-nav-link">{t?.navSmartWater || "Smart Water"}</a>
            <a onClick={() => scrollToSection('map-preview-section')} className="landing-nav-link">{t?.navMap || "Interactive Map"}</a>
            <a onClick={() => scrollToSection('services-section')} className="landing-nav-link">{t?.navHelp || "Citizen Help"}</a>
            <a onClick={() => scrollToSection('news-section')} className="landing-nav-link">{t?.navAbout || "About"}</a>
            <a onClick={() => scrollToSection('footer-section')} className="landing-nav-link">{t?.navContact || "Contact"}</a>
          </nav>
        </div>

        {/* Right Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexShrink: 0 }}>
          
          {/* Notification Icon */}
          <div style={{ position: 'relative' }}>
            <button
              type="button"
              onClick={() => setShowNotifications(!showNotifications)}
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.8)',
                border: '1px solid rgba(0, 91, 172, 0.18)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: 'var(--gvmc-text)',
                transition: 'all 0.2s ease'
              }}
            >
              <Bell size={18} />
              <span style={{
                position: 'absolute',
                top: '6px',
                right: '8px',
                width: '8px',
                height: '8px',
                background: 'var(--gvmc-success)',
                borderRadius: '50%',
                boxShadow: '0 0 0 2px #fff'
              }} />
            </button>

            {showNotifications && (
              <div className="glass-card" style={{
                position: 'absolute',
                top: '48px',
                right: 0,
                width: '320px',
                padding: '16px',
                background: 'rgba(255, 255, 255, 0.95)',
                zIndex: 1100,
                boxShadow: '0 16px 40px rgba(0, 0, 0, 0.12)'
              }}>
                <h4 style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '10px', color: 'var(--gvmc-text)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <CheckCircle2 size={14} color="var(--gvmc-success)" />
                  System Notifications (Live)
                </h4>
                <div style={{ fontSize: '0.8rem', color: 'var(--gvmc-text-muted)', borderTop: '1px solid rgba(0,0,0,0.06)', paddingTop: '8px' }}>
                  <p style={{ marginBottom: '6px' }}>🟢 All 8 zone reservoirs in Vizag operating at optimal pH (7.2-7.4).</p>
                  <p>🟢 AMRUT 2.0 SCADA Telemetry sync active.</p>
                </div>
              </div>
            )}
          </div>

          {/* Language Toggle Button */}
          <button
            type="button"
            onClick={onToggleLang}
            title="Switch Language / భాషను మార్చండి"
            style={{
              padding: '8px 16px',
              borderRadius: '100px',
              background: lang === 'TE' ? 'var(--gvmc-primary)' : 'rgba(255, 255, 255, 0.95)',
              color: lang === 'TE' ? '#ffffff' : 'var(--gvmc-primary)',
              border: '1.5px solid var(--gvmc-primary)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '0.82rem',
              fontWeight: 800,
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(0, 91, 172, 0.15)',
              transition: 'all 0.25s ease'
            }}
          >
            <Globe size={16} />
            <span>{lang === 'EN' ? 'ENG | తెలుగు' : 'తెలుగు | ENG'}</span>
          </button>

          {/* Login Button */}
          <GlassButton
            variant="primary"
            icon={LogIn}
            onClick={onOpenLoginModal}
            style={{ padding: '10px 22px', fontSize: '0.88rem' }}
          >
            {t?.loginPortal || "Login Portal"}
          </GlassButton>
        </div>

      </div>
    </header>
  );
};

export default Navbar;
