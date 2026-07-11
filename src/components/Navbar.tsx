import React from 'react';
import { Globe, Award, Sun, Moon, Shield } from 'lucide-react';
import { AmericanSchoolLogo } from './AmericanSchoolLogo';

interface NavbarProps {
  currentSection: string;
  lang: 'UZ' | 'EN';
  setLang: (lang: 'UZ' | 'EN') => void;
  resetTest: () => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  onAdminClick?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  currentSection, 
  lang, 
  setLang, 
  resetTest,
  theme,
  toggleTheme,
  onAdminClick
}) => {
  return (
    <header className="glass-panel" style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      padding: '12px 24px',
      borderRadius: '0 0 var(--radius-sm) var(--radius-sm)',
      borderTop: 'none',
      borderLeft: 'none',
      borderRight: 'none',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      background: 'hsl(var(--bg-secondary))',
      boxShadow: '0 2px 10px rgba(0,0,0,0.03)'
    }}>
      <div 
        onClick={resetTest}
        style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
      >
        <AmericanSchoolLogo size={36} textColor="hsl(var(--text-primary))" />
      </div>

      {currentSection !== 'dashboard' && (
        <button
          onClick={resetTest}
          className="btn-secondary"
          style={{
            padding: '6.5px 15px',
            fontSize: '0.82rem',
            fontWeight: 700,
            color: 'white',
            background: 'linear-gradient(135deg, #0b2265 0%, #108b58 100%)',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            borderRadius: '8px',
            cursor: 'pointer',
            boxShadow: '0 4px 10px rgba(11,34,101,0.15)',
            transition: 'transform 0.2s'
          }}
          onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.03)'}
          onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
        >
          <span>◀</span>
          <span>{lang === 'UZ' ? 'BOSH SAHIFA' : 'BACK TO HOME'}</span>
          <span style={{ 
            opacity: 0.6, 
            fontSize: '0.72rem', 
            fontWeight: 500, 
            borderLeft: '1px solid rgba(255,255,255,0.3)',
            paddingLeft: '8px',
            textTransform: 'uppercase'
          }}>
            {currentSection}
          </span>
        </button>
      )}

      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        {/* Day/Night Theme Toggle */}
        <button 
          onClick={toggleTheme}
          className="btn-secondary"
          style={{
            padding: '8px',
            borderRadius: 'var(--radius-sm)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          title={lang === 'UZ' ? "Mavzuni almashtirish" : "Toggle theme"}
        >
          {theme === 'dark' ? <Sun size={16} style={{ color: 'hsl(var(--accent-orange))' }} /> : <Moon size={16} style={{ color: 'hsl(var(--primary))' }} />}
        </button>



        {onAdminClick && currentSection === 'dashboard' && (
          <button
            onClick={onAdminClick}
            className="btn-secondary"
            style={{
              padding: '6px 12px',
              fontSize: '0.8rem',
              borderRadius: 'var(--radius-sm)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              borderColor: 'hsl(var(--secondary))',
              color: 'hsl(var(--secondary))',
              background: 'rgba(16, 139, 88, 0.05)'
            }}
            title={lang === 'UZ' ? "Admin Paneli" : "Admin Panel"}
          >
            <Shield size={14} />
            <span>Admin</span>
          </button>
        )}

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          fontSize: '0.85rem',
          color: 'hsl(var(--text-secondary))'
        }}>
          <Award size={16} style={{ color: 'hsl(var(--accent-orange))' }} />
          <span style={{ fontWeight: 700, color: 'hsl(var(--text-primary))' }}>Band 9.0</span> {lang === 'UZ' ? "Target" : "Target"}
        </div>
      </div>
    </header>
  );
};
export default Navbar;
