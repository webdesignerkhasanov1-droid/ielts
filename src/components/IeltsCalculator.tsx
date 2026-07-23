import React, { useState } from 'react';
import { Calculator, Award, Sparkles } from 'lucide-react';

interface IeltsCalculatorProps {
  lang: 'UZ' | 'EN';
}

export const IeltsCalculator: React.FC<IeltsCalculatorProps> = ({ lang }) => {
  const [listening, setListening] = useState<number>(7.0);
  const [reading, setReading] = useState<number>(7.5);
  const [writing, setWriting] = useState<number>(6.5);
  const [speaking, setSpeaking] = useState<number>(7.0);

  // Official IELTS Band Rounding Algorithm
  const calculateOverall = (l: number, r: number, w: number, s: number): number => {
    const avg = (l + r + w + s) / 4;
    const decimal = avg % 1;
    const base = Math.floor(avg);

    if (decimal < 0.25) {
      return base;
    } else if (decimal < 0.75) {
      return base + 0.5;
    } else {
      return base + 1;
    }
  };

  const overallBand = calculateOverall(listening, reading, writing, speaking);

  const getCefrLevel = (band: number): string => {
    if (band >= 8.5) return 'CEFR C2 (Expert Master)';
    if (band >= 7.0) return 'CEFR C1 (Effective Operational)';
    if (band >= 5.5) return 'CEFR B2 (Vantage / Independent)';
    if (band >= 4.0) return 'CEFR B1 (Threshold)';
    return 'CEFR A2 / Lower';
  };

  // Color Coding Rules ("Seven Green" Emerald Palette)
  const getScoreSelectStyle = (score: number) => {
    if (score >= 8.0) {
      return { background: '#ecfdf5', border: '1px solid #6ee7b7', color: '#047857' };
    }
    if (score >= 7.0) {
      return { background: '#f0fdf4', border: '1px solid #86efac', color: '#15803d' };
    }
    if (score >= 6.0) {
      return { background: '#f0f9ff', border: '1px solid #7dd3fc', color: '#0369a1' };
    }
    return { background: '#fffbeb', border: '1px solid #fde68a', color: '#b45309' };
  };

  const getOverallCardStyle = (band: number) => {
    if (band >= 7.0) {
      return {
        background: 'linear-gradient(135deg, #064e3b 0%, #047857 100%)',
        border: '1px solid #10b981',
        badgeBg: '#dcfce7',
        badgeText: '#047857',
        scoreColor: '#34d399',
        titleColor: '#ecfdf5'
      };
    }
    if (band >= 6.0) {
      return {
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
        border: '1px solid #334155',
        badgeBg: '#e2e8f0',
        badgeText: '#334155',
        scoreColor: '#38bdf8',
        titleColor: '#f8fafc'
      };
    }
    return {
      background: 'linear-gradient(135deg, #451a03 0%, #78350f 100%)',
      border: '1px solid #f59e0b',
      badgeBg: '#fef3c7',
      badgeText: '#b45309',
      scoreColor: '#fbbf24',
      titleColor: '#fffbeb'
    };
  };

  const cardTheme = getOverallCardStyle(overallBand);
  const bandOptions = [4.0, 4.5, 5.0, 5.5, 6.0, 6.5, 7.0, 7.5, 8.0, 8.5, 9.0];

  return (
    <div className="glass-panel" style={{
      padding: '24px',
      display: 'flex',
      flexDirection: 'column',
      gap: '16px'
    }}>
      {/* Title Header matching Candidate Info Panel */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #cbd5e1', paddingBottom: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Calculator size={18} color="#10b981" />
          <h3 style={{ margin: 0, fontSize: '1.15rem', color: 'hsl(var(--primary))' }}>
            {lang === 'UZ' ? 'IELTS Kalkulyator' : 'IELTS Overall Calculator'}
          </h3>
        </div>
        <span style={{
          background: '#dcfce7',
          color: '#15803d',
          border: '1px solid #86efac',
          fontSize: '0.7rem',
          fontWeight: 800,
          padding: '2px 8px',
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          gap: '4px'
        }}>
          <Sparkles size={10} />
          {lang === 'UZ' ? 'Ball Simulyatori' : 'Score Tool'}
        </span>
      </div>

      {/* Inputs Grid with Dynamic Color Coding */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        {/* Listening */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'hsl(var(--text-secondary))' }}>
            🎧 Listening
          </label>
          <select
            value={listening}
            onChange={(e) => setListening(parseFloat(e.target.value))}
            style={{
              padding: '8px 10px',
              borderRadius: '8px',
              fontSize: '0.85rem',
              fontWeight: 700,
              outline: 'none',
              transition: 'all 0.2s ease',
              ...getScoreSelectStyle(listening)
            }}
          >
            {bandOptions.map((b) => (
              <option key={b} value={b}>Band {b.toFixed(1)}</option>
            ))}
          </select>
        </div>

        {/* Reading */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'hsl(var(--text-secondary))' }}>
            📖 Reading
          </label>
          <select
            value={reading}
            onChange={(e) => setReading(parseFloat(e.target.value))}
            style={{
              padding: '8px 10px',
              borderRadius: '8px',
              fontSize: '0.85rem',
              fontWeight: 700,
              outline: 'none',
              transition: 'all 0.2s ease',
              ...getScoreSelectStyle(reading)
            }}
          >
            {bandOptions.map((b) => (
              <option key={b} value={b}>Band {b.toFixed(1)}</option>
            ))}
          </select>
        </div>

        {/* Writing */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'hsl(var(--text-secondary))' }}>
            ✍️ Writing
          </label>
          <select
            value={writing}
            onChange={(e) => setWriting(parseFloat(e.target.value))}
            style={{
              padding: '8px 10px',
              borderRadius: '8px',
              fontSize: '0.85rem',
              fontWeight: 700,
              outline: 'none',
              transition: 'all 0.2s ease',
              ...getScoreSelectStyle(writing)
            }}
          >
            {bandOptions.map((b) => (
              <option key={b} value={b}>Band {b.toFixed(1)}</option>
            ))}
          </select>
        </div>

        {/* Speaking */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'hsl(var(--text-secondary))' }}>
            🎙️ Speaking
          </label>
          <select
            value={speaking}
            onChange={(e) => setSpeaking(parseFloat(e.target.value))}
            style={{
              padding: '8px 10px',
              borderRadius: '8px',
              fontSize: '0.85rem',
              fontWeight: 700,
              outline: 'none',
              transition: 'all 0.2s ease',
              ...getScoreSelectStyle(speaking)
            }}
          >
            {bandOptions.map((b) => (
              <option key={b} value={b}>Band {b.toFixed(1)}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Dynamic Colored Result Card */}
      <div style={{
        background: cardTheme.background,
        border: cardTheme.border,
        borderRadius: '14px',
        padding: '14px 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
        transition: 'all 0.3s ease'
      }}>
        <div>
          <span style={{ fontSize: '0.72rem', color: cardTheme.titleColor, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            {lang === 'UZ' ? 'Umumiy Ball (Overall)' : 'Overall Band Score'}
          </span>
          <div style={{
            fontSize: '0.75rem',
            color: cardTheme.badgeText,
            background: cardTheme.badgeBg,
            fontWeight: 800,
            marginTop: '4px',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            padding: '2px 8px',
            borderRadius: '6px'
          }}>
            <Award size={13} />
            {getCefrLevel(overallBand)}
          </div>
        </div>

        <div style={{
          fontSize: '2rem',
          fontWeight: 900,
          color: cardTheme.scoreColor,
          fontFamily: 'Outfit, sans-serif',
          background: 'rgba(0,0,0,0.25)',
          padding: '4px 16px',
          borderRadius: '10px',
          border: '1px solid rgba(255,255,255,0.2)',
          boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
        }}>
          {overallBand.toFixed(1)}
        </div>
      </div>
    </div>
  );
};
