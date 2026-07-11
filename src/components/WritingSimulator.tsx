import React, { useState, useEffect } from 'react';
import { Clock, CheckCircle2, ChevronRight, BarChart2 } from 'lucide-react';
import { ieltsMockData } from '../data/ieltsMockData';

interface WritingSimulatorProps {
  lang: 'UZ' | 'EN';
  onComplete: (answers: Record<string, string>) => void;
}

export const WritingSimulator: React.FC<WritingSimulatorProps> = ({ lang, onComplete }) => {
  const tasks = ieltsMockData.writing;
  const [activeTaskIdx, setActiveTaskIdx] = useState(0);
  const [timeLeft, setTimeLeft] = useState(3600); // 60 minutes in seconds
  const [answers, setAnswers] = useState<Record<string, string>>({
    w1: '',
    w2: ''
  });

  const currentTask = tasks[activeTaskIdx];

  // Timer Countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleFinish();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleTextChange = (val: string) => {
    const key = activeTaskIdx === 0 ? 'w1' : 'w2';
    setAnswers(prev => ({
      ...prev,
      [key]: val
    }));
  };

  const getWordCount = (text: string) => {
    if (!text.trim()) return 0;
    return text.trim().split(/\s+/).length;
  };

  const handleNextTask = () => {
    if (activeTaskIdx < tasks.length - 1) {
      setActiveTaskIdx(prev => prev + 1);
    } else {
      handleFinish();
    }
  };

  const handleFinish = () => {
    onComplete(answers);
  };

  const currentText = activeTaskIdx === 0 ? answers.w1 : answers.w2;
  const currentWordCount = getWordCount(currentText);

  return (
    <div className="ielts-layout animate-fade-in" style={{ flexDirection: 'column' }}>
      {/* Top Banner */}
      <div style={{
        padding: '12px 24px',
        borderBottom: '1px solid var(--glass-border)',
        background: 'rgba(10, 15, 30, 0.5)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <div style={{ display: 'flex', gap: '8px' }}>
          {tasks.map((t, idx) => (
            <button
              key={t.id}
              onClick={() => setActiveTaskIdx(idx)}
              className="btn-secondary"
              style={{
                padding: '6px 14px',
                fontSize: '0.85rem',
                borderRadius: 'var(--radius-sm)',
                background: activeTaskIdx === idx ? 'rgba(99, 102, 241, 0.15)' : 'transparent',
                borderColor: activeTaskIdx === idx ? 'hsl(var(--primary))' : 'var(--glass-border)',
                color: activeTaskIdx === idx ? 'white' : 'hsl(var(--text-secondary))'
              }}
            >
              Writing Task {idx + 1}
            </button>
          ))}
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '6px 14px',
          borderRadius: 'var(--radius-sm)',
          background: timeLeft < 600 ? 'rgba(239, 68, 68, 0.15)' : 'rgba(99, 102, 241, 0.1)',
          border: `1px solid ${timeLeft < 600 ? 'hsl(var(--accent-red))' : 'hsl(var(--primary))'}`,
          color: timeLeft < 600 ? 'hsl(var(--accent-red))' : 'hsl(var(--text-primary))',
          fontWeight: 700
        }}>
          <Clock size={16} />
          <span>{formatTime(timeLeft)}</span>
        </div>
      </div>

      {/* Split screen layout: Left prompt & graph (if Task 1), Right text editor */}
      <div className="reading-split" style={{ flex: 1, overflow: 'hidden' }}>
        {/* Left Side: Prompt content and graph visualization */}
        <div className="passage-panel" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <h2 style={{ fontSize: '1.4rem', color: 'white' }}>{currentTask.title}</h2>
          <p style={{
            background: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid var(--border-subtle)',
            padding: '16px',
            borderRadius: 'var(--radius-md)',
            color: 'hsl(var(--text-secondary))',
            fontSize: '0.95rem',
            lineHeight: '1.6'
          }}>
            {currentTask.prompt}
          </p>

          {/* Visual chart render for Task 1 */}
          {activeTaskIdx === 0 && (
            <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <h4 style={{ fontSize: '0.9rem', color: 'hsl(var(--secondary))', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <BarChart2 size={16} />
                <span>Internet Usage Comparison (%)</span>
              </h4>

              {/* Responsive SVG Chart */}
              <svg viewBox="0 0 400 220" style={{ width: '100%', height: 'auto', background: 'rgba(0,0,0,0.1)', borderRadius: 'var(--radius-sm)', padding: '10px' }}>
                {/* Grid lines */}
                <line x1="40" y1="30" x2="380" y2="30" stroke="rgba(255,255,255,0.05)" />
                <line x1="40" y1="80" x2="380" y2="80" stroke="rgba(255,255,255,0.05)" />
                <line x1="40" y1="130" x2="380" y2="130" stroke="rgba(255,255,255,0.05)" />
                <line x1="40" y1="180" x2="380" y2="180" stroke="rgba(255,255,255,0.1)" />

                {/* Y Axis labels */}
                <text x="30" y="35" fill="hsl(var(--text-muted))" fontSize="10" textAnchor="end">100%</text>
                <text x="30" y="85" fill="hsl(var(--text-muted))" fontSize="10" textAnchor="end">60%</text>
                <text x="30" y="135" fill="hsl(var(--text-muted))" fontSize="10" textAnchor="end">30%</text>
                <text x="30" y="185" fill="hsl(var(--text-muted))" fontSize="10" textAnchor="end">0%</text>

                {/* Country Groups (2010 vs 2025) */}
                {/* Uzbekistan */}
                <rect x="60" y="157.5" width="22" height="22.5" fill="hsl(var(--primary))" rx="2" />
                <rect x="84" y="75" width="22" height="105" fill="hsl(var(--secondary))" rx="2" />
                <text x="83" y="196" fill="white" fontSize="10" textAnchor="middle">Uzbekistan</text>

                {/* South Korea */}
                <rect x="170" y="60" width="22" height="120" fill="hsl(var(--primary))" rx="2" />
                <rect x="194" y="33" width="22" height="147" fill="hsl(var(--secondary))" rx="2" />
                <text x="193" y="196" fill="white" fontSize="10" textAnchor="middle">South Korea</text>

                {/* Germany */}
                <rect x="280" y="67.5" width="22" height="112.5" fill="hsl(var(--primary))" rx="2" />
                <rect x="304" y="42" width="22" height="138" fill="hsl(var(--secondary))" rx="2" />
                <text x="303" y="196" fill="white" fontSize="10" textAnchor="middle">Germany</text>

                {/* Legend */}
                <rect x="260" y="10" width="10" height="10" fill="hsl(var(--primary))" rx="1" />
                <text x="275" y="18" fill="hsl(var(--text-secondary))" fontSize="9">2010</text>

                <rect x="320" y="10" width="10" height="10" fill="hsl(var(--secondary))" rx="1" />
                <text x="335" y="18" fill="hsl(var(--text-secondary))" fontSize="9">2025</text>
              </svg>
            </div>
          )}

          <div style={{
            marginTop: 'auto',
            fontSize: '0.85rem',
            color: 'hsl(var(--text-muted))',
            display: 'flex',
            flexDirection: 'column',
            gap: '4px'
          }}>
            <div>• Minimum: {currentTask.minWords} words</div>
            <div>• Suggested time: {currentTask.suggestedTime} mins</div>
          </div>
        </div>

        {/* Right Side: Text Editor Panel */}
        <div className="questions-panel" style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '14px'
          }}>
            <h3 style={{ fontSize: '1.25rem', color: 'hsl(var(--primary))' }}>
              {lang === 'UZ' ? "Insho yozish maydoni" : "Response Area"}
            </h3>

            <div style={{
              fontSize: '0.9rem',
              fontWeight: 600,
              padding: '4px 10px',
              borderRadius: '6px',
              background: currentWordCount < currentTask.minWords ? 'rgba(251, 146, 60, 0.1)' : 'rgba(74, 222, 128, 0.1)',
              border: `1px solid ${currentWordCount < currentTask.minWords ? 'hsl(var(--accent-orange))' : 'hsl(var(--accent-green))'}`,
              color: currentWordCount < currentTask.minWords ? 'hsl(var(--accent-orange))' : 'hsl(var(--accent-green))'
            }}>
              {lang === 'UZ' ? "So'zlar" : "Words"}: {currentWordCount} / {currentTask.minWords}
            </div>
          </div>

          <textarea
            value={currentText}
            onChange={(e) => handleTextChange(e.target.value)}
            placeholder={lang === 'UZ' ? "Inshongizni shu yerga yozing..." : "Write your response here..."}
            style={{
              flex: 1,
              width: '100%',
              background: 'hsl(var(--bg-secondary))',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              padding: '20px',
              color: 'hsl(var(--text-primary))',
              fontSize: '1rem',
              lineHeight: '1.6',
              outline: 'none',
              resize: 'none',
              fontFamily: 'var(--font-body)'
            }}
          />

          {/* Action buttons */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '16px', marginTop: '20px' }}>
            <button 
              onClick={handleNextTask}
              className="btn-primary"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <span>
                {activeTaskIdx < tasks.length - 1 
                  ? (lang === 'UZ' ? "Keyingi Topshiriq" : "Next Task") 
                  : (lang === 'UZ' ? "Yakunlash" : "Finish Section")}
              </span>
              {activeTaskIdx < tasks.length - 1 ? <ChevronRight size={16} /> : <CheckCircle2 size={16} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
