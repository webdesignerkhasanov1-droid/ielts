import React, { useState } from 'react';

interface LogoProps {
  size?: number;
  textColor?: string;
  showText?: boolean;
}

export const AmericanSchoolLogo: React.FC<LogoProps> = ({ size = 36, textColor: _textColor = 'currentColor', showText = true }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      style={{ 
        display: 'inline-flex', 
        alignItems: 'center', 
        gap: '12px',
        cursor: 'pointer',
        userSelect: 'none'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Premium Logo Badge Emblem Container */}
      <div style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '3px',
        borderRadius: '12px',
        background: 'linear-gradient(135deg, #0b2265 0%, #108b58 100%)',
        boxShadow: isHovered 
          ? '0 0 16px rgba(16, 139, 88, 0.4), 0 4px 12px rgba(11, 34, 101, 0.25)' 
          : '0 2px 8px rgba(11, 34, 101, 0.15)',
        transform: isHovered ? 'scale(1.08) rotate(2deg)' : 'scale(1) rotate(0deg)',
        transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
      }}>
        {/* Shiny Overlay reflection effect */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          borderRadius: '9px',
          background: 'linear-gradient(135deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0) 50%)',
          pointerEvents: 'none',
          zIndex: 1
        }}></div>

        <img 
          src="/american_school_logo.png" 
          alt="American School" 
          style={{
            height: `${size}px`,
            width: 'auto',
            borderRadius: '9px',
            backgroundColor: '#ffffff',
            objectFit: 'contain',
            padding: '2px',
            transition: 'transform 0.3s ease'
          }}
        />
      </div>

      {showText && (
        <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.15 }}>
          <span style={{ 
            fontFamily: "'Outfit', sans-serif", 
            fontWeight: 800, 
            fontSize: `${size * 0.44}px`, 
            // Premium text gradient 
            background: 'linear-gradient(135deg, #0b2265 0%, #1e3a8a 50%, #108b58 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: '-0.02em',
            textTransform: 'uppercase',
            transition: 'all 0.3s ease',
            filter: isHovered ? 'brightness(1.1) drop-shadow(0 2px 4px rgba(16, 139, 88, 0.15))' : 'none',
          }}>
            American School
          </span>
          <span style={{ 
            fontFamily: "'Inter', sans-serif", 
            fontWeight: 800, 
            fontSize: `${size * 0.22}px`, 
            color: '#108b58',
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            opacity: 0.9
          }}>
            Mock
          </span>
        </div>
      )}
    </div>
  );
};
export default AmericanSchoolLogo;

