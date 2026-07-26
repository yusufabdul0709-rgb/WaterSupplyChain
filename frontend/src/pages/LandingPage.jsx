import React, { useState } from 'react';
import '../landing.css';
import { translations } from '../utils/translations';
import Navbar from '../components/landing/Navbar';
import HeroSection from '../components/landing/HeroSection';
import QuickServices from '../components/landing/QuickServices';
import SchemeCards from '../components/landing/SchemeCards';
import InteractiveMapPreview from '../components/landing/InteractiveMapPreview';
import LiveStatus from '../components/landing/LiveStatus';
import NewsSection from '../components/landing/NewsSection';
import Footer from '../components/landing/Footer';
import LoginModal from '../components/landing/LoginModal';

const LandingPage = ({ onLoginSuccess, user }) => {
  const [lang, setLang] = useState('EN');
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [searchNotification, setSearchNotification] = useState(null);

  const t = translations[lang] || translations.EN;

  const handleToggleLang = () => {
    setLang((prev) => (prev === 'EN' ? 'TE' : 'EN'));
  };

  const handleOpenLogin = () => {
    setIsLoginModalOpen(true);
  };

  const handleCloseLogin = () => {
    setIsLoginModalOpen(false);
  };

  const handleModalLoginSuccess = (userData) => {
    setIsLoginModalOpen(false);
    if (onLoginSuccess) {
      onLoginSuccess(userData);
    }
  };

  const handleSearch = (query) => {
    const msg = lang === 'TE' 
      ? `"${query}" కోసం మునిసిపల్ డేటాబేస్‌ను శోధిస్తోంది... సంబంధిత AMRUT 2.0 సేవలు ప్రదర్శించబడుతున్నాయి.` 
      : `Searching municipal database for "${query}"... Displaying matching AMRUT 2.0 services and sector wards.`;
    setSearchNotification(msg);
    setTimeout(() => {
      setSearchNotification(null);
    }, 4000);
  };

  const scrollToServices = () => {
    const el = document.getElementById('services-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToMap = () => {
    const el = document.getElementById('map-preview-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="landing-portal">
      {/* Sticky Navigation Bar */}
      <Navbar
        onOpenLoginModal={handleOpenLogin}
        onSearch={handleSearch}
        lang={lang}
        onToggleLang={handleToggleLang}
        t={t}
      />

      {/* Search Feedback Toast */}
      {searchNotification && (
        <div style={{
          position: 'fixed',
          top: '80px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'rgba(0, 91, 172, 0.95)',
          color: '#fff',
          padding: '12px 24px',
          borderRadius: '100px',
          boxShadow: '0 12px 32px rgba(0,0,0,0.2)',
          zIndex: 1500,
          fontWeight: 600,
          fontSize: '0.88rem',
          backdropFilter: 'blur(10px)',
          animation: 'fadeIn 0.3s ease'
        }}>
          {searchNotification}
        </div>
      )}

      {/* Hero Section */}
      <HeroSection
        onExploreServices={scrollToServices}
        onViewMap={scrollToMap}
        onOpenLogin={handleOpenLogin}
        t={t}
      />

      {/* Live Status Panel */}
      <LiveStatus t={t} />

      {/* Quick Services Section */}
      <QuickServices
        t={t}
        onSelectService={(service) => {
          if (service.title.includes('Complaint') || service.title.includes('Emergency') || service.title.includes('ఫిర్యాదు') || service.title.includes('అత్యవసర')) {
            handleOpenLogin();
          } else {
            scrollToMap();
          }
        }}
      />

      {/* GVMC Schemes Section */}
      <SchemeCards
        t={t}
        onSelectScheme={(scheme) => {
          alert(`Official Scheme Details: ${scheme.title}\n\n${scheme.description}\n\nFor full documentation and application procedures, please login to the Citizen Portal.`);
        }}
      />

      {/* Interactive City Map Preview */}
      <InteractiveMapPreview
        t={t}
        onOpenDigitalTwin={handleOpenLogin}
      />

      {/* News & Announcements */}
      <NewsSection t={t} />

      {/* Footer */}
      <Footer
        t={t}
        onOpenLogin={handleOpenLogin}
      />

      {/* Login Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={handleCloseLogin}
        onLoginSuccess={handleModalLoginSuccess}
        t={t}
      />
    </div>
  );
};

export default LandingPage;
