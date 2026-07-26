import React from 'react';
import { ArrowRight } from 'lucide-react';
import GlassCard from './GlassCard';

const ServiceCard = ({ icon: Icon, title, description, onClick }) => {
  return (
    <GlassCard 
      hoverEffect={true} 
      onClick={onClick}
      style={{ padding: '28px', cursor: 'pointer', display: 'flex', flexDirection: 'column', height: '100%' }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '20px' }}>
        <div style={{ 
          background: 'linear-gradient(135deg, rgba(0, 91, 172, 0.12) 0%, rgba(0, 184, 217, 0.15) 100%)', 
          padding: '14px', 
          borderRadius: '16px', 
          display: 'inline-flex',
          color: 'var(--gvmc-primary)',
          boxShadow: '0 4px 12px rgba(0, 91, 172, 0.08)'
        }}>
          {Icon && <Icon size={26} />}
        </div>
        <div style={{
          width: '36px',
          height: '36px',
          borderRadius: '50%',
          background: 'rgba(0, 91, 172, 0.05)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--gvmc-primary)',
          transition: 'transform 0.2s ease'
        }}>
          <ArrowRight size={18} />
        </div>
      </div>
      <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--gvmc-text)', marginBottom: '8px' }}>
        {title}
      </h3>
      <p style={{ fontSize: '0.9rem', color: 'var(--gvmc-text-muted)', lineHeight: 1.5, flex: 1 }}>
        {description}
      </p>
    </GlassCard>
  );
};

export default ServiceCard;
