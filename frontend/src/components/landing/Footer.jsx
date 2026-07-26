import React from 'react';
import { Droplets, Phone, Mail, MapPin, ExternalLink, ShieldCheck, Globe, HelpCircle } from 'lucide-react';

const Footer = ({ onOpenLogin, t }) => {
  return (
    <footer id="footer-section" style={{
      background: 'linear-gradient(180deg, rgba(246, 248, 251, 0.5) 0%, #E3ECF7 100%)',
      borderTop: '1px solid rgba(0, 91, 172, 0.15)',
      paddingTop: '64px',
      paddingBottom: '32px',
      color: 'var(--gvmc-text)',
      marginTop: '40px'
    }}>
      <div style={{ maxWidth: '1360px', margin: '0 auto', padding: '0 32px' }}>
        
        {/* Main Footer Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '40px',
          marginBottom: '48px'
        }}>
          
          {/* Col 1: Government Branding */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '16px' }}>
              <div style={{
                background: 'linear-gradient(135deg, var(--gvmc-primary) 0%, var(--gvmc-secondary) 100%)',
                padding: '10px',
                borderRadius: '14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff'
              }}>
                <Droplets size={24} />
              </div>
              <div>
                <span style={{ fontSize: '1.2rem', fontWeight: 800, letterSpacing: '-0.3px', color: 'var(--gvmc-text)' }}>GVMC</span>
                <p style={{ fontSize: '0.75rem', color: 'var(--gvmc-primary)', fontWeight: 700, margin: 0 }}>
                  {t?.govtBadge || "GOVERNMENT OF ANDHRA PRADESH"}
                </p>
              </div>
            </div>

            <p style={{ fontSize: '0.88rem', color: 'var(--gvmc-text-muted)', lineHeight: 1.6, marginBottom: '20px' }}>
              {t?.footerDesc || "Official Smart City Digital Twin & Municipal Water Management Portal of the Greater Visakhapatnam Municipal Corporation."}
            </p>

            <div style={{ display: 'flex', gap: '10px' }}>
              <div style={{ background: 'rgba(0, 91, 172, 0.1)', padding: '8px 12px', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 700, color: 'var(--gvmc-primary)' }}>
                AMRUT 2.0
              </div>
              <div style={{ background: 'rgba(0, 184, 217, 0.1)', padding: '8px 12px', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 700, color: 'var(--gvmc-accent)' }}>
                SMART CITY
              </div>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--gvmc-text)', marginBottom: '18px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Quick Links
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.9rem', color: 'var(--gvmc-text-muted)' }}>
              <li><a onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} style={{ cursor: 'pointer', color: 'inherit', textDecoration: 'none' }}>Home Portal</a></li>
              <li><a onClick={onOpenLogin} style={{ cursor: 'pointer', color: 'var(--gvmc-primary)', fontWeight: 600, textDecoration: 'none' }}>Digital Twin Command Center 🔐</a></li>
              <li><a href="#services-section" style={{ color: 'inherit', textDecoration: 'none' }}>Citizen Grievance Portal</a></li>
              <li><a href="#schemes-section" style={{ color: 'inherit', textDecoration: 'none' }}>Flagship AMRUT 2.0 Schemes</a></li>
              <li><a href="#map-preview-section" style={{ color: 'inherit', textDecoration: 'none' }}>Interactive Network Map</a></li>
              <li><a href="#news-section" style={{ color: 'inherit', textDecoration: 'none' }}>Public Notices &amp; Tenders</a></li>
            </ul>
          </div>

          {/* Col 3: Emergency Numbers */}
          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--gvmc-text)', marginBottom: '18px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Emergency Numbers
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '0.9rem' }}>
              <div style={{ background: 'rgba(255, 255, 255, 0.8)', padding: '12px', borderRadius: '12px', border: '1px solid rgba(0, 91, 172, 0.15)' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--gvmc-text-muted)', display: 'block' }}>24/7 Water Helpline (Toll-Free)</span>
                <strong style={{ fontSize: '1.1rem', color: 'var(--gvmc-primary)' }}>1800-425-0000</strong>
              </div>
              <div style={{ background: 'rgba(255, 255, 255, 0.8)', padding: '12px', borderRadius: '12px', border: '1px solid rgba(0, 91, 172, 0.15)' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--gvmc-text-muted)', display: 'block' }}>GVMC Command Control Room</span>
                <strong style={{ fontSize: '1.05rem', color: 'var(--gvmc-text)' }}>0891-2866666</strong>
              </div>
              <div style={{ background: 'rgba(255, 255, 255, 0.8)', padding: '12px', borderRadius: '12px', border: '1px solid rgba(0, 91, 172, 0.15)' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--gvmc-text-muted)', display: 'block' }}>WhatsApp Citizen Assistant</span>
                <strong style={{ fontSize: '1.05rem', color: 'var(--gvmc-success)' }}>+91-81060-00000</strong>
              </div>
            </div>
          </div>

          {/* Col 4: Citizen Support & Address */}
          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--gvmc-text)', marginBottom: '18px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Citizen Support
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.88rem', color: 'var(--gvmc-text-muted)' }}>
              <p style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', margin: 0 }}>
                <MapPin size={18} color="var(--gvmc-primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span>GVMC Main Administrative Building, Tenneti Bhavan, Asilmetta, Visakhapatnam, A.P. - 530003</span>
              </p>
              <p style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
                <Mail size={16} color="var(--gvmc-primary)" />
                <span>commissioner_gvmc@yahoo.com</span>
              </p>
              <p style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
                <Globe size={16} color="var(--gvmc-primary)" />
                <span>www.gvmc.gov.in</span>
              </p>
            </div>
          </div>

        </div>

        {/* Bottom Bar: Copyright & Socials */}
        <div style={{
          borderTop: '1px solid rgba(0, 91, 172, 0.12)',
          paddingTop: '24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px',
          fontSize: '0.8rem',
          color: 'var(--gvmc-text-muted)'
        }}>
          <div>
            &copy; {new Date().getFullYear()} Greater Visakhapatnam Municipal Corporation. All Rights Reserved. • Designed for Smart City Mission.
          </div>

          <div style={{ display: 'flex', gap: '20px' }}>
            <span style={{ cursor: 'pointer' }}>Privacy Policy</span>
            <span style={{ cursor: 'pointer' }}>Terms of Service</span>
            <span style={{ cursor: 'pointer' }}>Hyperlinking Policy</span>
            <span style={{ cursor: 'pointer' }}>SLA Standards</span>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
