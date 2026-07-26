import React from 'react';

const GlassCard = ({ children, className = '', style = {}, hoverEffect = false, onClick }) => {
  return (
    <div
      className={`glass-card ${hoverEffect ? 'glass-card-hover' : ''} ${className}`}
      style={style}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default GlassCard;
