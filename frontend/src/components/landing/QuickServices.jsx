import React from 'react';
import { Droplets, Activity, AlertCircle, ShieldAlert, CreditCard, Wrench } from 'lucide-react';
import ServiceCard from './ServiceCard';

const QuickServices = ({ onSelectService, t }) => {
  const services = [
    {
      icon: Droplets,
      title: t?.service1Title || 'Water Supply & Timings',
      description: t?.service1Desc || 'Check daily sector water distribution schedules, pressure levels, and maintenance alerts for your ward.'
    },
    {
      icon: Activity,
      title: t?.service2Title || 'Real-Time Water Quality',
      description: t?.service2Desc || 'View live pH, turbidity, and chlorine metrics tested continuously by IoT sensors across Vizag zones.'
    },
    {
      icon: AlertCircle,
      title: t?.service3Title || 'Raise Citizen Complaint',
      description: t?.service3Desc || 'Report pipeline leaks, low pressure, contamination, or illegal connections with instant ticket tracking.'
    },
    {
      icon: ShieldAlert,
      title: t?.service4Title || 'Emergency Rapid Response',
      description: t?.service4Desc || 'Direct 24/7 helpline for major pipeline bursts, severe contamination, or emergency water tanker dispatch.'
    },
    {
      icon: CreditCard,
      title: t?.service5Title || 'Property Tax & Water Bills',
      description: t?.service5Desc || 'Pay water consumer charges online, view bill history, apply for subsidies, or download digital receipts.'
    },
    {
      icon: Wrench,
      title: t?.service6Title || 'Municipal Connections',
      description: t?.service6Desc || 'Apply for new residential, commercial, or industrial water service connections with paperless processing.'
    }
  ];

  return (
    <section id="services-section" className="landing-section">
      <div className="section-header">
        <div className="section-badge">{t?.servicesBadge || "Citizen Services Portal"}</div>
        <h2 className="section-title">{t?.servicesTitle || "Quick Municipal Water Services"}</h2>
        <p className="section-subtitle">
          {t?.servicesSubtitle || "Access 24/7 public utility services, file complaints, monitor water quality, or pay municipal water bills directly through the portal."}
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '24px'
      }}>
        {services.map((service, idx) => (
          <ServiceCard
            key={idx}
            icon={service.icon}
            title={service.title}
            description={service.description}
            actionText={t?.btnAccessService || "Access Service"}
            onClick={() => onSelectService(service)}
          />
        ))}
      </div>
    </section>
  );
};

export default QuickServices;
