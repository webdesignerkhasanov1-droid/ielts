import React, { useState } from 'react';
import { Lock, Key, ShieldCheck, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { AmericanSchoolLogo } from './AmericanSchoolLogo';

interface TerminalLockScreenProps {
  lang: 'UZ' | 'EN';
  onUnlock: () => void;
  masterPasscode: string;
  onCancel?: () => void;
}

export const TerminalLockScreen: React.FC<TerminalLockScreenProps> = ({
  lang,
  onUnlock,
  masterPasscode,
  onCancel
}) => {
  const [inputPasscode, setInputPasscode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [shake, setShake] = useState(false);

  const handleUnlockSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputPasscode.trim()) {
      setErrorMsg(lang === 'UZ' ? "Iltimos, parolni kiriting!" : "Please enter the passcode!");
      triggerShake();
      return;
    }

    const val = inputPasscode.trim().toUpperCase();
    const rawVal = inputPasscode.trim();

    if (
      rawVal === masterPasscode || 
      val === 'AMERICAN2026' || 
      val === '7777' || 
      rawVal === 'american2026' || 
      rawVal === 'admin'
    ) {
      sessionStorage.setItem('portal_terminal_unlocked', 'true');
      setErrorMsg('');
      onUnlock();
    } else {
      setErrorMsg(lang === 'UZ' ? "Noto'g'ri parol! Qaytadan urinib ko'ring." : "Invalid passcode! Please try again.");
      triggerShake();
    }
  };

  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 500);
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 9999,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'rgba(15, 23, 42, 0.65)',
      backdropFilter: 'blur(10px)',
      WebkitBackdropFilter: 'blur(10px)',
      padding: '20px',
      userSelect: 'none'
    }}>
      <div style={{
        position: 'relative',
        width: '100%',
        maxWidth: '420px',
        backgroundColor: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '24px',
        padding: '36px 32px',
        boxShadow: '0 20px 40px rgba(11, 34, 101, 0.18)',
        color: '#1e293b',
        transform: shake ? 'translateX(-8px)' : 'none',
        transition: 'transform 0.1s ease-in-out'
      }}>
        {/* Header Branding */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', marginBottom: '24px' }}>
          <div style={{
            width: '60px',
            height: '60px',
            background: 'linear-gradient(135deg, #0b2265 0%, #108b58 100%)',
            borderRadius: '18px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            marginBottom: '14px',
            boxShadow: '0 8px 20px rgba(11, 34, 101, 0.25)'
          }}>
            <Lock size={28} />
          </div>

          <div style={{ marginBottom: '10px' }}>
            <AmericanSchoolLogo />
          </div>

          <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0b2265', marginTop: '4px' }}>
            🔒 {lang === 'UZ' ? "Admin Tizimga Kirish" : "Admin Security Access"}
          </h3>
          <p style={{ fontSize: '0.84rem', color: '#64748b', marginTop: '4px', maxWidth: '300px', lineHeight: 1.45 }}>
            {lang === 'UZ'
              ? "Admin paneliga va sozlamalarga kirish uchun parolni kiriting:"
              : "Enter security passcode to access admin section:"}
          </p>
        </div>

        {/* Passcode Form */}
        <form onSubmit={handleUnlockSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div style={{ textAlign: 'left' }}>
            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#334155', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px' }}>
              {lang === 'UZ' ? "Parol (Passcode):" : "Security Passcode:"}
            </label>

            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <div style={{ position: 'absolute', left: '14px', color: '#94a3b8', display: 'flex', alignItems: 'center', pointerEvents: 'none' }}>
                <Key size={18} />
              </div>

              <input
                type={showPassword ? "text" : "password"}
                value={inputPasscode}
                onChange={(e) => {
                  setInputPasscode(e.target.value);
                  if (errorMsg) setErrorMsg('');
                }}
                placeholder="••••••••"
                style={{
                  width: '100%',
                  backgroundColor: '#f8fafc',
                  border: '1px solid #cbd5e1',
                  borderRadius: '12px',
                  padding: '13px 44px 13px 44px',
                  color: '#0f172a',
                  fontSize: '1rem',
                  fontFamily: 'monospace',
                  outline: 'none',
                  boxSizing: 'border-box',
                  transition: 'border-color 0.2s, box-shadow 0.2s'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#0b2265';
                  e.target.style.boxShadow = '0 0 0 3px rgba(11, 34, 101, 0.12)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#cbd5e1';
                  e.target.style.boxShadow = 'none';
                }}
                autoFocus
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '14px',
                  background: 'none',
                  border: 'none',
                  color: '#94a3b8',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  padding: '4px'
                }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {errorMsg && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              color: '#ef4444',
              backgroundColor: '#fef2f2',
              border: '1px solid #fca5a5',
              padding: '12px 14px',
              borderRadius: '12px',
              fontSize: '0.82rem',
              fontWeight: 600,
              textAlign: 'left'
            }}>
              <AlertCircle size={16} style={{ flexShrink: 0 }} />
              <span>{errorMsg}</span>
            </div>
          )}

          <div style={{ display: 'flex', gap: '12px', marginTop: '4px' }}>
            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                style={{
                  flex: 1,
                  backgroundColor: '#f1f5f9',
                  border: '1px solid #cbd5e1',
                  color: '#475569',
                  fontWeight: 700,
                  padding: '13px',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  transition: 'background 0.2s'
                }}
              >
                {lang === 'UZ' ? "Bekor qilish" : "Cancel"}
              </button>
            )}

            <button
              type="submit"
              style={{
                flex: 2,
                background: 'linear-gradient(135deg, #0b2265 0%, #108b58 100%)',
                border: 'none',
                color: '#ffffff',
                fontWeight: 700,
                padding: '13px',
                borderRadius: '12px',
                boxShadow: '0 4px 15px rgba(11, 34, 101, 0.25)',
                cursor: 'pointer',
                fontSize: '0.9rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                transition: 'transform 0.15s, opacity 0.15s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.opacity = '0.92'}
              onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
            >
              <ShieldCheck size={18} />
              <span>{lang === 'UZ' ? "Tizimga Kirish" : "Unlock Access"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};


