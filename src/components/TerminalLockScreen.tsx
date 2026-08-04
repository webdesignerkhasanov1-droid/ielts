import React, { useState } from 'react';
import { Lock, Key, ShieldCheck, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { AmericanSchoolLogo } from './AmericanSchoolLogo';

interface TerminalLockScreenProps {
  lang: 'UZ' | 'EN';
  onUnlock: () => void;
  masterPasscode: string;
}

export const TerminalLockScreen: React.FC<TerminalLockScreenProps> = ({
  lang,
  onUnlock,
  masterPasscode
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

    if (inputPasscode.trim() === masterPasscode || inputPasscode.trim() === 'AMERICAN2026' || inputPasscode.trim() === '7777') {
      sessionStorage.setItem('portal_terminal_unlocked', 'true');
      localStorage.removeItem('portal_terminal_unlocked');
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
    <div className="min-h-screen flex items-center justify-center bg-slate-900 px-4 py-12 relative overflow-hidden select-none">
      
      {/* Ambient background glow effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-red-600/15 rounded-full blur-3xl pointer-events-none" />

      <div className={`max-w-md w-full bg-slate-800/90 backdrop-blur-xl border border-slate-700/80 rounded-3xl p-8 shadow-2xl z-10 transition-all transform ${shake ? 'animate-bounce border-red-500/80' : ''}`}>
        
        {/* Header Branding */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-emerald-600 rounded-2xl flex items-center justify-center text-white mb-4 shadow-lg shadow-blue-500/20">
            <Lock size={32} />
          </div>
          
          <div className="mb-2">
            <AmericanSchoolLogo />
          </div>

          <h2 className="text-xl font-bold text-white mt-2">
            {lang === 'UZ' ? "Qurilma Himoyalangan" : "Terminal Protected"}
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-xs">
            {lang === 'UZ'
              ? "Ushbu kompyuterdan foydalanish uchun o'qituvchi/administrator parolini kiriting."
              : "Enter the master passcode to unlock this computer terminal for test sessions."}
          </p>
        </div>

        {/* Passcode Form */}
        <form onSubmit={handleUnlockSubmit} className="space-y-5">
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
              {lang === 'UZ' ? "Kompyuter Kirish Paroli (Passcode):" : "Terminal Security Passcode:"}
            </label>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Key size={18} />
              </div>

              <input
                type={showPassword ? "text" : "password"}
                value={inputPasscode}
                onChange={(e) => {
                  setInputPasscode(e.target.value);
                  if (errorMsg) setErrorMsg('');
                }}
                placeholder={lang === 'UZ' ? "Parolni kiriting..." : "Enter passcode..."}
                className="w-full bg-slate-900/90 border border-slate-700 rounded-xl py-3.5 pl-11 pr-11 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-base transition"
                autoFocus
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-200 transition"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {errorMsg && (
            <div className="flex items-center space-x-2 text-red-400 bg-red-950/50 border border-red-800/60 p-3 rounded-xl text-xs font-medium">
              <AlertCircle size={16} className="shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-500 hover:to-emerald-500 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-blue-600/30 transition transform active:scale-98 flex items-center justify-center space-x-2 text-sm"
          >
            <ShieldCheck size={18} />
            <span>{lang === 'UZ' ? "Terminalni Ochiqlash" : "Unlock Terminal"}</span>
          </button>
        </form>

        {/* Footer Hint */}
        <div className="mt-8 pt-6 border-t border-slate-700/60 text-center">
          <p className="text-[11px] text-slate-500">
            {lang === 'UZ'
              ? "Boshlang'ich administrator paroli: AMERICAN2026 yoki 7777"
              : "Default master passcode: AMERICAN2026 or 7777"}
          </p>
        </div>
      </div>
    </div>
  );
};
