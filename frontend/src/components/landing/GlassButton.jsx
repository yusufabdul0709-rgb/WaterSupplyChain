import React from 'react';

const GlassButton = ({ 
  children, 
  variant = 'primary', 
  icon: Icon, 
  onClick, 
  className = '', 
  style = {},
  type = 'button',
  disabled = false 
}) => {
  const getVariantClass = () => {
    switch (variant) {
      case 'primary': return 'glass-btn-primary';
      case 'secondary': return 'glass-btn-secondary';
      case 'accent': return 'glass-btn-accent';
      default: return 'glass-btn-primary';
    }
  };

  return (
    <button
      type={type}
      disabled={disabled}
      className={`glass-btn ${getVariantClass()} ${className}`}
      style={{ opacity: disabled ? 0.6 : 1, cursor: disabled ? 'not-allowed' : 'pointer', ...style }}
      onClick={onClick}
    >
      {Icon && <Icon size={18} />}
      <span>{children}</span>
    </button>
  );
};

export default GlassButton;
