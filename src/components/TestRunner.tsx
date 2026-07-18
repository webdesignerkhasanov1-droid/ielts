import React, { useRef, useState, useEffect } from 'react';
import { User, Clock } from 'lucide-react';
import { AmericanSchoolLogo } from './AmericanSchoolLogo';

interface TestRunnerProps {
  lang: 'UZ' | 'EN';
  testUrl: string;
  testTitle: string;
  testCategory: 'listening' | 'reading' | 'writing';
  duration?: string;
  questionsCount?: number;
  isFullTest?: boolean;
  candidateInfo: {
    fullName: string;
    phone: string;
    telegram: string;
  };
  onComplete: (data: {
    listeningCorrect?: number;
    listeningBand?: number;
    readingCorrect?: number;
    readingBand?: number;
    writingBand?: number;
  }) => void;
  onExit: () => void;
}

export const TestRunner: React.FC<TestRunnerProps> = ({
  lang,
  testUrl,
  testTitle,
  testCategory,
  duration,
  questionsCount,
  isFullTest = false,
  candidateInfo,
  onComplete,
  onExit
}) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [loading, setLoading] = useState(true);
  const isConfirmingExit = useRef(false);

  const forceSubmitTest = () => {
    try {
      const iframe = iframeRef.current;
      const iframeDoc = iframe?.contentDocument || iframe?.contentWindow?.document;
      const iframeWin = iframe?.contentWindow as any;
      if (iframeDoc && iframeWin) {
        const submitBtn = iframeDoc.getElementById('deliverBtn') || 
                          iframeDoc.getElementById('submitBtn') || 
                          iframeDoc.querySelector('.deliver-btn') || 
                          iframeDoc.querySelector('button[type="submit"]') ||
                          iframeDoc.querySelector('.footer__deliverButton___3FM07') ||
                          iframeDoc.getElementById('deliver-btn') ||
                          iframeDoc.getElementById('submit-btn') || 
                          iframeDoc.getElementById('submit-test') || 
                          iframeDoc.querySelector('.submit-button') ||
                          iframeDoc.getElementById('show-results') ||
                          iframeDoc.getElementById('check-answers') ||
                          iframeDoc.querySelector('button.submit-test');
        if (submitBtn) {
          (submitBtn as HTMLElement).click();
        } else if (typeof iframeWin.checkAnswers === 'function') {
          iframeWin.checkAnswers();
        } else if (typeof iframeWin.deliver === 'function') {
          iframeWin.deliver();
        } else if (typeof iframeWin.showResults === 'function') {
          iframeWin.showResults();
        } else if (typeof iframeWin.submitTest === 'function') {
          iframeWin.submitTest();
        } else {
          onComplete({});
        }
      } else {
        onComplete({});
      }
    } catch (err) {
      console.error("Auto submit failed", err);
      onComplete({});
    }
  };

  const handleExitDetection = () => {
    setTimeout(() => {
      // If the browser window itself still has focus (meaning they focused inside the iframe or clicked a scrollbar)
      if (document.hasFocus() && !document.hidden) {
        return;
      }
      
      // Auto submit immediately!
      forceSubmitTest();
    }, 200);
  };

  useEffect(() => {
    document.addEventListener('visibilitychange', handleExitDetection);
    window.addEventListener('blur', handleExitDetection);
    return () => {
      document.removeEventListener('visibilitychange', handleExitDetection);
      window.removeEventListener('blur', handleExitDetection);
    };
  }, [lang]);

  // Dynamically calculate timer limits
  const getInitialTime = () => {
    if (isFullTest) {
      return testCategory === 'listening' ? 1800 : 3600;
    }
    
    // Fallbacks for sectional practice tests
    if (testCategory === 'listening') {
      if (questionsCount && questionsCount <= 10) {
        return 600; // 10 minutes for single section
      }
      return 1800; // 30 minutes for full section
    } else if (testCategory === 'reading') {
      if (questionsCount && questionsCount <= 14) {
        return 1200; // 20 minutes for single passage
      }
      return 3600; // 60 minutes for full reading
    } else if (testCategory === 'writing') {
      const lowerTitle = testTitle.toLowerCase();
      if (lowerTitle.includes('task 1') || (duration && duration.includes('20'))) {
        return 1200; // 20 minutes for Task 1
      }
      if (lowerTitle.includes('task 2') || (duration && duration.includes('40'))) {
        return 2400; // 40 minutes for Task 2
      }
      return 3600; // 60 minutes default
    }
    return 3600;
  };

  const [timeLeft, setTimeLeft] = useState(getInitialTime());

  useEffect(() => {
    setTimeLeft(getInitialTime());
  }, [testCategory, testTitle, duration, questionsCount, isFullTest]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          // Auto-submit test in the iframe when time runs out
          try {
            const iframe = iframeRef.current;
            const iframeDoc = iframe?.contentDocument || iframe?.contentWindow?.document;
            const iframeWin = iframe?.contentWindow as any;
            if (iframeDoc && iframeWin) {
              const submitBtn = iframeDoc.getElementById('deliverBtn') || 
                                iframeDoc.getElementById('submitBtn') || 
                                iframeDoc.querySelector('.deliver-btn') || 
                                iframeDoc.querySelector('button[type="submit"]') ||
                                iframeDoc.querySelector('.footer__deliverButton___3FM07') ||
                                iframeDoc.getElementById('deliver-btn');
              if (submitBtn) {
                (submitBtn as HTMLElement).click();
              } else if (typeof iframeWin.checkAnswers === 'function') {
                iframeWin.checkAnswers();
              } else if (typeof iframeWin.deliver === 'function') {
                iframeWin.deliver();
              }
            }
          } catch (e) {
            console.error("Auto-submit failed", e);
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [testCategory]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Poll iframe contents to detect completion
  useEffect(() => {
    let intervalId: any;

    const checkIframeCompletion = () => {
      const iframe = iframeRef.current;
      if (!iframe) return;

      try {
        const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
        const iframeWin = iframe.contentWindow as any;
        if (!iframeDoc || !iframeWin) return;

        const isElementVisible = (el: HTMLElement | null) => {
          if (!el) return false;
          try {
            const style = iframeWin.getComputedStyle(el);
            return style.display !== 'none' && style.visibility !== 'hidden';
          } catch (e) {
            return el.offsetWidth > 0 || el.offsetHeight > 0;
          }
        };

        // 1. Listening completion check
        if (testCategory === 'listening') {
          const compModal = iframeDoc.getElementById('completion-modal') || iframeDoc.getElementById('resultModal');
          const isSubmitted = isElementVisible(compModal) || iframeDoc.body.classList.contains('test-submitted');

          if (isSubmitted && iframeWin._lastCorrectCount !== undefined) {
            const correctCount = iframeWin._lastCorrectCount;
            const bandText = iframeDoc.getElementById('completion-band')?.textContent || 
                             iframeDoc.getElementById('score-summary')?.textContent?.split('Band')?.[1]?.trim() || '0';
            const bandScore = parseFloat(bandText);
            
            clearInterval(intervalId);
            onComplete({
              listeningCorrect: correctCount,
              listeningBand: bandScore > 0 ? bandScore : undefined
            });
          }
        }

        // 2. Reading completion check
        if (testCategory === 'reading') {
          const resultsModal = iframeDoc.getElementById('results-modal') || iframeDoc.getElementById('resultModal');
          const isSubmitted = isElementVisible(resultsModal);

          if (isSubmitted) {
            const scoreText = iframeDoc.getElementById('results-score')?.textContent || 
                              iframeDoc.getElementById('score-summary')?.textContent?.split('/')?.[0]?.replace(/[^0-9]/g, '') || '0';
            const score = parseInt(scoreText, 10);
            const bandText = iframeDoc.getElementById('results-band')?.textContent || 
                             iframeDoc.getElementById('score-summary')?.textContent?.split('Band')?.[1]?.trim() || '0';
            const bandScore = parseFloat(bandText);

            clearInterval(intervalId);
            onComplete({
              readingCorrect: score,
              readingBand: bandScore > 0 ? bandScore : undefined
            });
          }
        }

        // 3. Writing completion check
        if (testCategory === 'writing') {
          const resultsContainer = iframeDoc.getElementById('resultsContainer') || iframeDoc.getElementById('resultModal');
          const isSubmitted = isElementVisible(resultsContainer);

          if (isSubmitted) {
            const overallBandText = iframeDoc.getElementById('overallBand')?.textContent || 
                                   iframeDoc.getElementById('score-summary')?.textContent?.split('Band')?.[1]?.trim() || '0';
            const overallBand = parseFloat(overallBandText);

            clearInterval(intervalId);
            onComplete({
              writingBand: overallBand > 0 ? overallBand : undefined
            });
          }
        }

      } catch (e) {
        // Cross-origin issues (shouldn't happen on localhost)
      }
    };

    intervalId = setInterval(checkIframeCompletion, 1000);
    return () => clearInterval(intervalId);
  }, [testCategory, onComplete]);

  // Hook into iframe window functions on load to detect immediate submissions
  const handleLoad = () => {
    setLoading(false);
    const iframe = iframeRef.current;
    if (!iframe) return;

    try {
      const iframeWin = iframe.contentWindow as any;
      const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
      if (!iframeWin || !iframeDoc) return;

      if (iframeWin) {
        iframeWin.addEventListener('blur', handleExitDetection);
      }

      // Inject custom styling inside the iframe to match light-academic look
      const style = iframeDoc.createElement('style');
      let extraStyles = `
        /* Hide original header links or external promotional bars if present */
        .telegram-link { display: none !important; }
        .header { display: none !important; }
        .main-container, .container { margin-top: 0 !important; height: 100vh !important; max-width: 100% !important; width: 100% !important; }
        body { padding-top: 0 !important; }
      `;

      if (testCategory === 'listening') {
        extraStyles += `
          /* Always hide transcripts/audio scripts */
          .right-panel { display: none !important; }
          #transcription-container, #transcription-text, .transcription-instruction, #transcription-data, #trans-data, .trans-text, .trans-data { display: none !important; }
          [id*="transcription"], [class*="transcription"] { display: none !important; }
          .left-panel, .main-wrap.results-mode .left-panel { width: 100% !important; float: none !important; margin: 0 !important; padding: 28px 32px !important; }
        `;
      }

      if (isFullTest) {
        extraStyles += `
          /* In Full Test mode, hide all instant feedback like results modal and red/green answers */
          #resultModal, #results-modal, #completion-modal, .modal-overlay, .modal-box { display: none !important; }
          .correct-inline, .incorrect-inline, .correct-answer { display: none !important; }
          .ans-input.correct, .ans-input.incorrect {
            border-color: #9aa3ad !important;
            background: #ffffff !important;
            color: #1a1a2e !important;
          }
          [data-theme="dark"] .ans-input.correct, [data-theme="dark"] .ans-input.incorrect {
            border-color: #555 !important;
            background: #1e1e30 !important;
            color: #ffffff !important;
          }
          .sub-q.correct, .sub-q.incorrect {
            background: #ffffff !important;
            color: #1a1a2e !important;
            border-color: #dde1e9 !important;
          }
          [data-theme="dark"] .sub-q.correct, [data-theme="dark"] .sub-q.incorrect {
            background: #13131f !important;
            color: #e8eaf6 !important;
            border-color: #2d2d45 !important;
          }
        `;
      }

      style.textContent = extraStyles;
      iframeDoc.head.appendChild(style);

      // Dynamically replace template logo images with American School logo
      const allImgs = iframeDoc.querySelectorAll('img');
      allImgs.forEach((img: any) => {
        const src = img.getAttribute('src') || '';
        const alt = img.getAttribute('alt') || '';
        const cls = img.className || '';
        if (
          src.includes('base64') || 
          src.includes('logo') || 
          src.includes('pinimg') || 
          alt.toLowerCase().includes('logo') || 
          cls.toLowerCase().includes('logo')
        ) {
          img.setAttribute('src', '/american_school_logo.png');
          img.style.width = '130px';
          img.style.height = 'auto';
          img.style.objectFit = 'contain';
          img.style.borderRadius = '8px';
        }
      });

      // Dynamically replace any template Telegram links
      const allLinks = iframeDoc.querySelectorAll('a');
      allLinks.forEach((link: any) => {
        const href = link.getAttribute('href') || '';
        if (
          href.includes('t.me/IELTSbyAbdullokh') || 
          href.includes('t.me/FOZILBEK_IELTS') || 
          href.includes('t.me/shohrukhposts')
        ) {
          link.setAttribute('href', 'https://t.me/americanschoolmock_bot');
        }
      });

      // Recursively replace template handles and branding text in DOM
      const walkDOM = (node: Node) => {
        if (node.nodeType === Node.TEXT_NODE) {
          let text = node.nodeValue || '';
          if (text.includes('@IELTSbyAbdullokh') || text.includes('@FOZILBEK_IELTS') || text.includes('@shohrukhposts')) {
            text = text.replace(/@IELTSbyAbdullokh|@FOZILBEK_IELTS|@shohrukhposts/g, '@americanschoolmock_bot');
          }
          if (text.includes('IELTS CD MATERIALS')) {
            text = text.replace(/IELTS CD MATERIALS/g, 'American School Mock');
          }
          node.nodeValue = text;
        } else {
          node.childNodes.forEach(walkDOM);
        }
      };
      if (iframeDoc.body) {
        walkDOM(iframeDoc.body);
      }

    } catch (e) {
      console.error("Iframe optimization failed", e);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: '#f8fafc',
      zIndex: 9999,
      display: 'flex',
      flexDirection: 'column',
      fontFamily: 'var(--font-heading)'
    }}>
      {/* Real CD-IELTS Style Header Bar */}
      <div style={{
        height: '64px',
        background: '#1e293b',
        color: '#f8fafc',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 20px',
        borderBottom: '3px solid #e11d48',
        boxShadow: '0 4px 10px rgba(0,0,0,0.15)'
      }}>
        {/* Left Side: Mock Logo & Test Name */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <AmericanSchoolLogo size={28} textColor="#ffffff" showText={false} />
          <div style={{ borderLeft: '1px solid #475569', paddingLeft: '16px' }}>
            <span style={{ fontSize: '15px', fontWeight: 700, color: '#f1f5f9' }}>
              IELTS {testCategory.toUpperCase()} PRACTICE
            </span>
            <span style={{ display: 'block', fontSize: '11px', color: '#94a3b8' }}>
              {testTitle}
            </span>
          </div>
        </div>

        {/* Center: Time Management Countdown Timer */}
        <div style={{
          display: testCategory === 'listening' ? 'none' : 'flex',
          alignItems: 'center',
          gap: '8px',
          background: 'rgba(225, 29, 72, 0.15)',
          border: '1px solid #e11d48',
          padding: '8px 20px',
          borderRadius: '20px',
          color: '#fda4af',
          fontWeight: 700,
          fontSize: '16px',
          fontFamily: 'monospace',
          letterSpacing: '1px',
          boxShadow: '0 0 10px rgba(225, 29, 72, 0.2)'
        }}>
          <Clock size={16} />
          <span>{formatTime(timeLeft)}</span>
        </div>

        {/* Right Side: Candidate Info & Exit button */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(255,255,255,0.08)',
            padding: '6px 12px',
            borderRadius: '8px',
            fontSize: '13px'
          }}>
            <User size={14} color="#38bdf8" />
            <span style={{ fontWeight: 600, color: '#f1f5f9' }}>{candidateInfo.fullName}</span>
            <span style={{ color: '#64748b' }}>|</span>
            <span style={{ color: '#38bdf8', fontWeight: 700 }}>MOCK-EL75</span>
          </div>

          <button
            onClick={() => {
              const confirmExit = window.confirm(
                lang === 'UZ' 
                  ? "Haqiqatdan ham orqaga qaytmoqchimisiz? Joriy test javoblaringiz saqlanmaydi."
                  : "Are you sure you want to go back? Your current test progress will be lost."
              );
              if (confirmExit) {
                onExit();
              }
            }}
            style={{
              background: '#475569',
              border: '1px solid #64748b',
              borderRadius: '8px',
              color: 'white',
              padding: '8px 16px',
              fontSize: '13px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'background 0.2s'
            }}
            onMouseEnter={e => e.currentTarget.style.background = '#334155'}
            onMouseLeave={e => e.currentTarget.style.background = '#475569'}
          >
            <span>◀</span> {lang === 'UZ' ? 'ORQAGA QAYTISH' : 'BACK TO PORTAL'}
          </button>
        </div>
      </div>

      {/* Test Container Iframe */}
      <div style={{ flex: 1, position: 'relative' }}>
        {loading && (
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: '#ffffff',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            zIndex: 10
          }}>
            <div style={{
              width: '40px',
              height: '40px',
              border: '4px solid #cbd5e1',
              borderTopColor: '#e11d48',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }} />
            <style>{`
              @keyframes spin {
                to { transform: rotate(360deg); }
              }
            `}</style>
            <div style={{ fontSize: '14px', color: '#64748b', fontWeight: 600 }}>
              {lang === 'UZ' ? 'Material yuklanmoqda...' : 'Loading Test Material...'}
            </div>
          </div>
        )}

        <iframe
          ref={iframeRef}
          src={testUrl}
          onLoad={handleLoad}
          style={{
            width: '100%',
            height: '100%',
            border: 'none',
            display: 'block'
          }}
          title={testTitle}
        />
      </div>
    </div>
  );
};
