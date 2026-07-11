import React, { useState, useEffect } from 'react';
import { Clock, CheckCircle2, ChevronRight, Search, Highlighter } from 'lucide-react';
import { ieltsMockData } from '../data/ieltsMockData';

interface ReadingSimulatorProps {
  lang: 'UZ' | 'EN';
  onComplete: (answers: Record<string, string>) => void;
}

export const ReadingSimulator: React.FC<ReadingSimulatorProps> = ({ lang, onComplete }) => {
  const passages = ieltsMockData.reading;
  const [activePasIdx, setActivePasIdx] = useState(0);
  const [timeLeft, setTimeLeft] = useState(3600); // 60 minutes in seconds
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [searchTerm, setSearchTerm] = useState('');

  const currentPassage = passages[activePasIdx];

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

  const handleAnswerChange = (qId: string, val: string) => {
    setAnswers(prev => ({
      ...prev,
      [qId]: val
    }));
  };

  const handleNextPassage = () => {
    if (activePasIdx < passages.length - 1) {
      setActivePasIdx(prev => prev + 1);
    } else {
      handleFinish();
    }
  };

  const handleFinish = () => {
    onComplete(answers);
  };

  // Simple highlight renderer helper
  const renderHighlightedContent = (content: string) => {
    if (!searchTerm.trim()) {
      return content.split('\n\n').map((p, i) => <p key={i} style={{ marginBottom: '16px' }}>{p}</p>);
    }

    const regex = new RegExp(`(${searchTerm})`, 'gi');
    return content.split('\n\n').map((p, i) => {
      const parts = p.split(regex);
      return (
        <p key={i} style={{ marginBottom: '16px' }}>
          {parts.map((part, k) => 
            regex.test(part) || part.toLowerCase() === searchTerm.toLowerCase()
              ? <mark key={k} style={{ backgroundColor: 'rgba(253, 224, 71, 0.4)', color: 'white', padding: '0 2px', borderRadius: '2px' }}>{part}</mark>
              : part
          )}
        </p>
      );
    });
  };

  return (
    <div className="ielts-layout animate-fade-in" style={{ flexDirection: 'column' }}>
      {/* Top Banner with Passage selector and Timer */}
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
        {/* Passages tabs */}
        <div style={{ display: 'flex', gap: '8px' }}>
          {passages.map((p, idx) => (
            <button
              key={p.id}
              onClick={() => setActivePasIdx(idx)}
              className="btn-secondary"
              style={{
                padding: '6px 14px',
                fontSize: '0.85rem',
                borderRadius: 'var(--radius-sm)',
                background: activePasIdx === idx ? 'rgba(99, 102, 241, 0.15)' : 'transparent',
                borderColor: activePasIdx === idx ? 'hsl(var(--primary))' : 'var(--glass-border)',
                color: activePasIdx === idx ? 'white' : 'hsl(var(--text-secondary))'
              }}
            >
              Passage {idx + 1}
            </button>
          ))}
        </div>

        {/* Highlight Finder Toolbar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: 'rgba(0,0,0,0.2)',
          padding: '4px 10px',
          borderRadius: 'var(--radius-sm)',
          border: '1px solid var(--glass-border)'
        }}>
          <Search size={14} color="hsl(var(--text-muted))" />
          <input 
            type="text"
            placeholder={lang === 'UZ' ? "So'z qidirish..." : "Find word..."}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'white',
              fontSize: '0.85rem',
              outline: 'none',
              width: '120px'
            }}
          />
          {searchTerm && (
            <button 
              onClick={() => setSearchTerm('')} 
              style={{ background: 'transparent', border: 'none', color: 'hsl(var(--text-muted))', cursor: 'pointer', fontSize: '0.8rem' }}
            >
              ✕
            </button>
          )}
        </div>

        {/* Countdown timer */}
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

      {/* Main split screens */}
      <div className="reading-split" style={{ flex: 1, overflow: 'hidden' }}>
        {/* Left Side: Scrollable Passage Content */}
        <div className="passage-panel">
          <h2 style={{ fontSize: '1.6rem', marginBottom: '20px', color: 'hsl(var(--primary))', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '12px' }}>
            {currentPassage.title}
          </h2>
          <div style={{ fontSize: '1rem', color: 'hsl(var(--text-secondary))', lineHeight: 1.7, textAlign: 'justify' }}>
            {renderHighlightedContent(currentPassage.content)}
          </div>
        </div>

        {/* Right Side: Scrollable Savollar Panel */}
        <div className="questions-panel">
          <h3 style={{ fontSize: '1.25rem', marginBottom: '20px', color: 'hsl(var(--accent-red))', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Highlighter size={18} />
            <span>Questions 1–{currentPassage.questions.length}</span>
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {currentPassage.questions.map((q) => (
              <div className="question-group" key={q.id}>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                  <span style={{
                    background: 'hsl(var(--bg-tertiary))',
                    padding: '2px 8px',
                    borderRadius: '4px',
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    color: 'hsl(var(--primary))'
                  }}>
                    Q{q.number}
                  </span>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: '0.95rem', color: 'hsl(var(--text-primary))', marginBottom: '12px', fontWeight: 600 }}>
                      {q.question}
                    </p>

                    {/* Inputs based on type */}
                    {q.type === 'text' && (
                      <input 
                        type="text" 
                        placeholder={lang === 'UZ' ? "Javobingizni yozing..." : "Type answer here..."}
                        value={answers[q.id] || ''}
                        onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                        style={{
                          width: '100%',
                          padding: '10px 14px',
                          borderRadius: 'var(--radius-sm)',
                          border: '1px solid var(--border-subtle)',
                          background: 'hsl(var(--bg-secondary))',
                          color: 'hsl(var(--text-primary))',
                          outline: 'none',
                          fontSize: '0.9rem'
                        }}
                      />
                    )}

                    {q.type === 'choice' && q.options && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {q.options.map((opt, idx) => (
                          <label key={idx} style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            cursor: 'pointer',
                            padding: '8px 12px',
                            borderRadius: 'var(--radius-sm)',
                            background: answers[q.id] === opt ? 'rgba(225, 29, 72, 0.05)' : 'transparent',
                            border: `1px solid ${answers[q.id] === opt ? 'rgba(225, 29, 72, 0.2)' : 'transparent'}`,
                            fontSize: '0.9rem',
                            color: answers[q.id] === opt ? 'hsl(var(--accent-red))' : 'hsl(var(--text-secondary))',
                            fontWeight: answers[q.id] === opt ? 600 : 400
                          }}>
                            <input 
                              type="radio" 
                              name={q.id}
                              checked={answers[q.id] === opt}
                              onChange={() => handleAnswerChange(q.id, opt)}
                              style={{ accentColor: 'hsl(var(--accent-red))' }}
                            />
                            {opt}
                          </label>
                        ))}
                      </div>
                    )}

                    {q.type === 'boolean' && q.options && (
                      <div style={{ display: 'flex', gap: '12px' }}>
                        {q.options.map((opt, idx) => (
                          <button 
                            key={idx}
                            onClick={() => handleAnswerChange(q.id, opt)}
                            className="btn-secondary"
                            style={{
                              flex: 1,
                              padding: '8px 12px',
                              fontSize: '0.85rem',
                              background: answers[q.id] === opt ? 'rgba(225, 29, 72, 0.05)' : 'hsl(var(--bg-secondary))',
                              borderColor: answers[q.id] === opt ? 'hsl(var(--accent-red))' : 'var(--glass-border)',
                              color: answers[q.id] === opt ? 'hsl(var(--accent-red))' : 'hsl(var(--text-secondary))',
                              fontWeight: answers[q.id] === opt ? 700 : 500
                            }}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    )}

                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation Action Buttons */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '30px', gap: '16px' }}>
            <button 
              onClick={handleNextPassage}
              className="btn-primary"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <span>
                {activePasIdx < passages.length - 1 
                  ? (lang === 'UZ' ? "Keyingi Matn" : "Next Passage") 
                  : (lang === 'UZ' ? "Yakunlash" : "Finish Section")}
              </span>
              {activePasIdx < passages.length - 1 ? <ChevronRight size={16} /> : <CheckCircle2 size={16} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
