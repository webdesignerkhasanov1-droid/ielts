import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Volume2, Clock, CheckCircle2, ChevronRight } from 'lucide-react';
import { ieltsMockData } from '../data/ieltsMockData';

interface ListeningSimulatorProps {
  lang: 'UZ' | 'EN';
  onComplete: (answers: Record<string, string>) => void;
}

export const ListeningSimulator: React.FC<ListeningSimulatorProps> = ({ lang, onComplete }) => {
  const sections = ieltsMockData.listening;
  const [activeSecIdx, setActiveSecIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [timeLeft, setTimeLeft] = useState(1800); // 30 minutes in seconds
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentSection = sections[activeSecIdx];

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

  // Audio Events
  useEffect(() => {
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
  }, [activeSecIdx]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(err => console.log("Audio play blocked: ", err));
    }
  };

  const handleTimeUpdate = () => {
    if (!audioRef.current) return;
    setCurrentTime(audioRef.current.currentTime);
  };

  const handleLoadedMetadata = () => {
    if (!audioRef.current) return;
    setDuration(audioRef.current.duration);
  };

  const handleAudioEnded = () => {
    setIsPlaying(false);
    setCurrentTime(0);
  };

  const handleAnswerChange = (qId: string, val: string) => {
    setAnswers(prev => ({
      ...prev,
      [qId]: val
    }));
  };

  const handleNextSection = () => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    if (activeSecIdx < sections.length - 1) {
      setActiveSecIdx(prev => prev + 1);
    } else {
      handleFinish();
    }
  };

  const handleFinish = () => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    onComplete(answers);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const progressPercent = duration ? (currentTime / duration) * 100 : 0;

  return (
    <div className="ielts-layout animate-fade-in" style={{ flexDirection: 'column' }}>
      {/* Top Banner with Clock */}
      <div style={{
        padding: '12px 24px',
        borderBottom: '1px solid var(--glass-border)',
        background: 'rgba(10, 15, 30, 0.5)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <h3 style={{ fontSize: '1.1rem', color: 'hsl(var(--secondary))' }}>
            Listening Practice - {currentSection.title}
          </h3>
        </div>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '6px 14px',
          borderRadius: 'var(--radius-sm)',
          background: timeLeft < 300 ? 'rgba(239, 68, 68, 0.15)' : 'rgba(99, 102, 241, 0.1)',
          border: `1px solid ${timeLeft < 300 ? 'hsl(var(--accent-red))' : 'hsl(var(--primary))'}`,
          color: timeLeft < 300 ? 'hsl(var(--accent-red))' : 'hsl(var(--text-primary))',
          fontWeight: 700
        }}>
          <Clock size={16} />
          <span>{formatTime(timeLeft)}</span>
        </div>
      </div>

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Left Panel: Audio Player & Instruction */}
        <div className="passage-panel" style={{ flex: 1.2, display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div className="glass-panel" style={{ padding: '24px', position: 'relative' }}>
            <h4 style={{ fontSize: '1.2rem', marginBottom: '14px', color: 'hsl(var(--text-primary))' }}>
              {lang === 'UZ' ? "Audio Simulyatori" : "Audio Simulator"}
            </h4>
            <p style={{ fontSize: '0.85rem', color: 'hsl(var(--text-secondary))', marginBottom: '20px' }}>
              {lang === 'UZ' 
                ? "IELTS imtihonida audio faqat bir marta qo'yiladi. Mashq davomida audioni to'xtatib turishingiz mumkin." 
                : "In IELTS, the audio plays only once. For practice, you may pause and play."}
            </p>

            {/* Audio tag */}
            <audio 
              ref={audioRef}
              src={currentSection.audioUrl}
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={handleLoadedMetadata}
              onEnded={handleAudioEnded}
            />

            {/* Custom Audio Control UI */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <button 
                onClick={togglePlay}
                style={{
                  background: 'linear-gradient(135deg, hsl(var(--primary)), hsl(var(--secondary)))',
                  border: 'none',
                  color: 'white',
                  width: '50px',
                  height: '50px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  boxShadow: '0 0 15px rgba(99, 102, 241, 0.4)',
                  transition: 'all 0.2s'
                }}
              >
                {isPlaying ? <Pause size={20} fill="white" /> : <Play size={20} fill="white" style={{ marginLeft: '4px' }} />}
              </button>

              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'hsl(var(--text-muted))', marginBottom: '6px' }}>
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
                {/* Progress bar */}
                <div style={{
                  height: '6px',
                  borderRadius: '3px',
                  background: 'hsl(var(--bg-tertiary))',
                  position: 'relative',
                  overflow: 'hidden',
                  cursor: 'pointer'
                }}>
                  <div style={{
                    width: `${progressPercent}%`,
                    height: '100%',
                    background: 'linear-gradient(90deg, hsl(var(--primary)), hsl(var(--secondary)))',
                    borderRadius: '3px'
                  }} />
                </div>
              </div>

              <Volume2 size={18} color="hsl(var(--text-secondary))" />
            </div>
          </div>

          {/* Instructions for Real Exam Feel */}
          <div className="glass-panel" style={{ padding: '24px', flex: 1, overflowY: 'auto' }}>
            <h4 style={{ fontSize: '1rem', color: 'hsl(var(--secondary))', marginBottom: '10px' }}>
              {lang === 'UZ' ? "Imtihon Yo'riqnomasi" : "Test Instructions"}
            </h4>
            <ul style={{
              fontSize: '0.9rem',
              color: 'hsl(var(--text-secondary))',
              lineHeight: 1.6,
              paddingLeft: '20px',
              margin: 0
            }}>
              <li>{lang === 'UZ' ? "Savollarni diqqat bilan o'qing." : "Read the questions carefully before the audio starts."}</li>
              <li>{lang === 'UZ' ? "Audio faqat bir marta eshittiriladi." : "The audio will be played only once."}</li>
              <li>{lang === 'UZ' ? "Javoblarni o'ng tomondagi kataklarga kiriting." : "Type your answers in the input boxes on the right."}</li>
              <li>{lang === 'UZ' ? "Belgilangan vaqt tugashi bilan test avtomatik ravishda yakunlanadi." : "The test will end automatically when the timer reaches zero."}</li>
            </ul>
          </div>
        </div>

        {/* Right Panel: Interactive Questions */}
        <div className="questions-panel" style={{ flex: 1 }}>
          <h4 style={{ fontSize: '1.25rem', marginBottom: '20px', color: 'hsl(var(--primary))' }}>
            {lang === 'UZ' ? "Javoblar Varoqchasi" : "Answer Sheet"}
          </h4>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {currentSection.questions.map((q) => (
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

          {/* Action buttons */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '30px', gap: '16px' }}>
            <button 
              onClick={handleNextSection}
              className="btn-primary"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <span>
                {activeSecIdx < sections.length - 1 
                  ? (lang === 'UZ' ? "Keyingi Bo'lim" : "Next Section") 
                  : (lang === 'UZ' ? "Yakunlash" : "Finish Section")}
              </span>
              {activeSecIdx < sections.length - 1 ? <ChevronRight size={16} /> : <CheckCircle2 size={16} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
