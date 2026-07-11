import { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Dashboard } from './components/Dashboard';
import { ListeningSimulator } from './components/ListeningSimulator';
import { ReadingSimulator } from './components/ReadingSimulator';
import { WritingSimulator } from './components/WritingSimulator';
import { SpeakingSimulator } from './components/SpeakingSimulator';
import { ResultsDashboard } from './components/ResultsDashboard';
import { VocabularyPractice } from './components/VocabularyPractice';
import { TestLibrary } from './components/TestLibrary';
import { TestRunner } from './components/TestRunner';
import { AdminPortal } from './components/AdminPortal';
import { FullTestSelect, MOCK_SETS } from './components/FullTestSelect';
import { db } from './utils/db';
import { CheckCircle, Sparkles, BookOpen } from 'lucide-react';
import testLibraryData from './data/testLibraryData.json';

type Section = 'dashboard' | 'listening' | 'reading' | 'writing' | 'speaking' | 'results' | 'vocabulary' | 'library' | 'admin' | 'full-select' | 'pending-speaking';

interface AnswersState {
  listening?: Record<string, string>;
  reading?: Record<string, string>;
  writing?: Record<string, string>;
  speaking?: Record<string, any>;
}

function App() {
  const [currentSection, setCurrentSection] = useState<Section>('dashboard');
  const [lang, setLang] = useState<'UZ' | 'EN'>('EN');
  const [isFullTest, setIsFullTest] = useState(false);
  const [selectedSetIndex, setSelectedSetIndex] = useState<number | null>(null);
  const [answers, setAnswers] = useState<AnswersState & {
    listeningCorrect?: number;
    listeningBand?: number;
    readingCorrect?: number;
    readingBand?: number;
    writingBand?: number;
  }>({});
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [activeTest, setActiveTest] = useState<{
    url: string;
    title: string;
    category: 'listening' | 'reading' | 'writing';
    duration?: string;
    questions?: number;
  } | null>(null);

  // Transition States
  const [listeningTransferTimeLeft, setListeningTransferTimeLeft] = useState<number | null>(null);
  const [readingFinishedPrompt, setReadingFinishedPrompt] = useState<boolean>(false);

  const [libraryCategory, setLibraryCategory] = useState<'listening' | 'reading' | 'writing'>('listening');

  // Candidate Details state
  const [candidateInfo, setCandidateInfo] = useState({
    fullName: 'Abdurahmon Moydionov',
    phone: '+998 50 075 84 44',
    telegram: '@amoyd1novvv'
  });

  // Listening 2-minute transfer countdown timer
  useEffect(() => {
    if (listeningTransferTimeLeft === null) return;
    if (listeningTransferTimeLeft <= 0) {
      setListeningTransferTimeLeft(null);
      if (selectedSetIndex !== null) {
        const currentSet = MOCK_SETS[selectedSetIndex];
        setActiveTest(currentSet.reading);
      }
      return;
    }
    const timer = setTimeout(() => {
      setListeningTransferTimeLeft(prev => prev !== null ? prev - 1 : null);
    }, 1000);
    return () => clearTimeout(timer);
  }, [listeningTransferTimeLeft, selectedSetIndex]);

  const formatTransferTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStartReadingNow = () => {
    setListeningTransferTimeLeft(null);
    if (selectedSetIndex !== null) {
      const currentSet = MOCK_SETS[selectedSetIndex];
      setActiveTest(currentSet.reading);
    }
  };

  const handleStartWritingNow = () => {
    setReadingFinishedPrompt(false);
    if (selectedSetIndex !== null) {
      const currentSet = MOCK_SETS[selectedSetIndex];
      setActiveTest(currentSet.writing);
    }
  };

  // Toggle Theme class on document Element
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark-theme');
      root.classList.remove('light-theme');
    } else {
      root.classList.add('light-theme');
      root.classList.remove('dark-theme');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const handleSelectSection = (selection: 'full' | 'listening' | 'reading' | 'writing' | 'speaking' | 'vocabulary' | 'library') => {
    setAnswers({}); // Clear past answers on new start
    
    // Save registered candidate to local database
    if (selection !== 'vocabulary' && selection !== 'library') {
      db.saveCandidate(candidateInfo.fullName, candidateInfo.phone, candidateInfo.telegram);
    }
    
    if (selection === 'full') {
      setIsFullTest(true);
      setSelectedSetIndex(0);
      const chosenSet = MOCK_SETS[0];
      setActiveTest(chosenSet.listening);
    } else {
      setIsFullTest(false);
      setCurrentSection(selection as Section);
    }
  };

  const _startSectionalTestFromDashboard = (category: 'listening' | 'reading' | 'writing', setNumber: number) => {
    // Save registered candidate to local database
    db.saveCandidate(candidateInfo.fullName, candidateInfo.phone, candidateInfo.telegram);

    const mapping = {
      1: {
        listening: { url: '/tests/listening/test_1.html', title: 'Authentic Listening Full Test 1' },
        reading: { url: '/tests/reading/test_1.html', title: 'Authentic Reading Mock 10' },
        writing: { url: '/tests/writing/test_1.html', title: 'Practice Writing' }
      },
      2: {
        listening: { url: '/tests/listening/test_2.html', title: 'Authentic Listening Full Test 4' },
        reading: { url: '/tests/reading/test_2.html', title: 'Cloud Science (2)' },
        writing: { url: '/tests/writing/test_2.html', title: 'Writing' }
      },
      3: {
        listening: { url: '/tests/listening/test_3.html', title: 'Authentic Listening Mock' },
        reading: { url: '/tests/reading/test_3.html', title: 'Passage 2 - Antarctica' },
        writing: { url: '/tests/writing/test_1.html', title: 'Practice Writing' }
      }
    }[setNumber as 1 | 2 | 3][category];

    // Find test metadata in testLibraryData
    const testList = testLibraryData[category] as any[];
    const foundTest = testList.find(t => t.url === mapping.url);

    setIsFullTest(false);
    setActiveTest({
      url: mapping.url,
      title: mapping.title,
      category,
      duration: foundTest?.duration,
      questions: foundTest?.questions
    });
  };

  const startFullTestFromDashboard = (setNumber: number) => {
    // Save registered candidate to local database
    db.saveCandidate(candidateInfo.fullName, candidateInfo.phone, candidateInfo.telegram);

    setSelectedSetIndex(setNumber - 1);
    setIsFullTest(true);
    
    const chosenSet = MOCK_SETS[setNumber - 1];
    setActiveTest(chosenSet.listening);
  };

  const startFullTest = (setIndex: number) => {
    setSelectedSetIndex(setIndex);
    const chosenSet = MOCK_SETS[setIndex];
    setActiveTest(chosenSet.listening);
  };

  const handleListeningComplete = (listeningAns: Record<string, string>) => {
    setAnswers(prev => ({ ...prev, listening: listeningAns }));
    if (isFullTest) {
      setCurrentSection('reading');
    } else {
      setCurrentSection('results');
    }
  };

  const handleReadingComplete = (readingAns: Record<string, string>) => {
    setAnswers(prev => ({ ...prev, reading: readingAns }));
    if (isFullTest) {
      setCurrentSection('writing');
    } else {
      setCurrentSection('results');
    }
  };

  const handleWritingComplete = (writingAns: Record<string, string>) => {
    setAnswers(prev => ({ ...prev, writing: writingAns }));
    if (isFullTest) {
      setCurrentSection('speaking');
    } else {
      setCurrentSection('results');
    }
  };

  const handleSpeakingComplete = (speakingAns: Record<string, any>) => {
    setAnswers(prev => ({ ...prev, speaking: speakingAns }));
    setCurrentSection('results');
  };

  const handleRestart = () => {
    setAnswers({});
    setIsFullTest(false);
    setCurrentSection('dashboard');
  };

  // Dynamic background selector based on active test category or current section
  const getDynamicBackground = () => {
    // 1. If running a library test, use its category
    if (activeTest) {
      if (activeTest.category === 'listening') return '/bg_listening.png';
      if (activeTest.category === 'reading') return '/bg_reading.png';
      if (activeTest.category === 'writing') return '/bg_writing.png';
    }
    // 2. If running section practice
    if (currentSection === 'listening') return '/bg_listening.png';
    if (currentSection === 'reading') return '/bg_reading.png';
    if (currentSection === 'writing') return '/bg_writing.png';
    if (currentSection === 'speaking') return '/bg_listening.png'; // Speaking can share audio/waves theme
    
    // Default academic background
    return '/bg_academic_pattern.png';
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', position: 'relative' }}>
      {/* Premium Glassmorphic Mesh Background Blobs & Image Pattern */}
      <div style={{ 
        position: 'fixed', 
        top: 0, 
        left: 0, 
        right: 0, 
        bottom: 0, 
        zIndex: -1, 
        overflow: 'hidden', 
        pointerEvents: 'none',
        backgroundImage: `url(${getDynamicBackground()})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        transition: 'all 0.3s ease'
      }}>
        {/* Semi-transparent color overlay for premium text contrast and readability */}
        <div style={{
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          background: theme === 'dark' 
            ? 'linear-gradient(135deg, rgba(8, 13, 26, 0.94) 0%, rgba(3, 7, 18, 0.98) 100%)'
            : 'linear-gradient(135deg, rgba(248, 250, 252, 0.92) 0%, rgba(241, 245, 249, 0.96) 100%)',
          transition: 'background 0.3s ease'
        }}></div>

        {/* Navy/Blue Blob */}
        <div style={{ 
          position: 'absolute', 
          top: '-15%', 
          left: '-10%', 
          width: '60vw', 
          height: '60vw', 
          borderRadius: '50%', 
          background: theme === 'dark'
            ? 'radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, rgba(99, 102, 241, 0) 70%)'
            : 'radial-gradient(circle, rgba(11, 34, 101, 0.08) 0%, rgba(11, 34, 101, 0) 70%)',
          filter: 'blur(80px)',
          animation: 'float-slow 20s infinite alternate'
        }}></div>
        
        {/* Green/Teal Blob */}
        <div style={{ 
          position: 'absolute', 
          bottom: '-15%', 
          right: '-10%', 
          width: '60vw', 
          height: '60vw', 
          borderRadius: '50%', 
          background: theme === 'dark'
            ? 'radial-gradient(circle, rgba(16, 185, 129, 0.1) 0%, rgba(16, 185, 129, 0) 70%)'
            : 'radial-gradient(circle, rgba(16, 139, 88, 0.08) 0%, rgba(16, 139, 88, 0) 70%)',
          filter: 'blur(80px)',
          animation: 'float-slow-reverse 25s infinite alternate'
        }}></div>
      </div>

      <Navbar 
        currentSection={currentSection} 
        lang={lang} 
        setLang={setLang} 
        resetTest={handleRestart}
        theme={theme}
        toggleTheme={toggleTheme}
        onAdminClick={() => setCurrentSection('admin')}
      />

      <main style={{ flex: 1 }}>
        {currentSection === 'dashboard' && (
          <Dashboard 
            lang={lang} 
            onStartFullTest={startFullTestFromDashboard}
            onSelectSectionalCategory={(cat) => {
              setLibraryCategory(cat);
              setCurrentSection('library');
            }}
            onSelectSection={handleSelectSection}
            candidateInfo={candidateInfo}
            setCandidateInfo={setCandidateInfo}
          />
        )}

        {currentSection === 'listening' && (
          <ListeningSimulator 
            lang={lang} 
            onComplete={handleListeningComplete} 
          />
        )}

        {currentSection === 'reading' && (
          <ReadingSimulator 
            lang={lang} 
            onComplete={handleReadingComplete} 
          />
        )}

        {currentSection === 'writing' && (
          <WritingSimulator 
            lang={lang} 
            onComplete={handleWritingComplete} 
          />
        )}

        {currentSection === 'speaking' && (
          <SpeakingSimulator 
            lang={lang} 
            onComplete={handleSpeakingComplete} 
          />
        )}

        {currentSection === 'results' && (
          <ResultsDashboard 
            lang={lang} 
            answers={answers} 
            onRestart={handleRestart}
            candidateInfo={candidateInfo}
          />
        )}

        {currentSection === 'vocabulary' && (
          <VocabularyPractice 
            lang={lang} 
            onBack={handleRestart} 
          />
        )}

        {currentSection === 'library' && (
          <TestLibrary
            lang={lang}
            initialCategory={libraryCategory}
            onBack={handleRestart}
            onStartTest={(testUrl, testTitle, testCategory, duration, questionsCount) => {
              setActiveTest({ url: testUrl, title: testTitle, category: testCategory, duration, questions: questionsCount });
            }}
            onSelectFullMock={() => setCurrentSection('full-select')}
          />
        )}

        {currentSection === 'admin' && (
          <AdminPortal
            lang={lang}
            onBack={handleRestart}
          />
        )}

        {currentSection === 'full-select' && (
          <FullTestSelect 
            lang={lang} 
            onBack={handleRestart} 
            onSelectSet={startFullTest} 
          />
        )}

        {currentSection === 'pending-speaking' && (
          <div style={{
            maxWidth: '600px',
            margin: '80px auto',
            padding: '40px',
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            boxShadow: '0 10px 25px rgba(0,0,0,0.05)',
            textAlign: 'center',
            fontFamily: 'var(--font-heading)'
          }}>
            <div style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              backgroundColor: '#ecfdf5',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 24px',
              color: '#10b981'
            }}>
              <CheckCircle size={40} />
            </div>
            <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#1e293b', marginBottom: '16px' }}>
              Written Sections Completed!
            </h2>
            <p style={{ color: '#64748b', fontSize: '15px', lineHeight: 1.6, marginBottom: '32px' }}>
              Congratulations! You have completed the Listening, Reading, and Writing sections of your mock exam.
              <br /><br />
              Your Speaking section is conducted separately. Please contact your administrator to schedule/complete your Speaking test. Once graded, your final official certificate will be generated and sent directly to your Telegram.
            </p>
            <button
              onClick={handleRestart}
              style={{
                backgroundColor: '#1e293b',
                color: '#ffffff',
                border: 'none',
                padding: '12px 32px',
                borderRadius: '8px',
                fontWeight: 700,
                fontSize: '15px',
                cursor: 'pointer',
                transition: 'background-color 0.2s'
              }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = '#0f172a'}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = '#1e293b'}
            >
              Back to Dashboard
            </button>
          </div>
        )}

        {listeningTransferTimeLeft !== null && (
          <div style={{
            maxWidth: '600px',
            margin: '80px auto',
            padding: '40px',
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            boxShadow: '0 10px 25px rgba(0,0,0,0.05)',
            textAlign: 'center',
            fontFamily: 'var(--font-heading)'
          }}>
            <div style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              backgroundColor: '#eff6ff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 24px',
              color: '#3b82f6'
            }}>
              <Sparkles size={40} />
            </div>
            <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#1e293b', marginBottom: '16px' }}>
              Listening Section Completed!
            </h2>
            <p style={{ color: '#64748b', fontSize: '15px', lineHeight: 1.6, marginBottom: '24px' }}>
              You have 2 minutes to check your answers before the Reading section starts.
            </p>
            <div style={{
              fontSize: '48px',
              fontWeight: 900,
              color: '#e11d48',
              fontFamily: 'monospace',
              marginBottom: '32px'
            }}>
              {formatTransferTime(listeningTransferTimeLeft)}
            </div>
            <button
              onClick={handleStartReadingNow}
              style={{
                backgroundColor: '#1e293b',
                color: '#ffffff',
                border: 'none',
                padding: '12px 32px',
                borderRadius: '8px',
                fontWeight: 700,
                fontSize: '15px',
                cursor: 'pointer',
                transition: 'background-color 0.2s'
              }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = '#0f172a'}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = '#1e293b'}
            >
              Start Reading Section Now
            </button>
          </div>
        )}

        {readingFinishedPrompt && (
          <div style={{
            maxWidth: '600px',
            margin: '80px auto',
            padding: '40px',
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            boxShadow: '0 10px 25px rgba(0,0,0,0.05)',
            textAlign: 'center',
            fontFamily: 'var(--font-heading)'
          }}>
            <div style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              backgroundColor: '#faf5ff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 24px',
              color: '#a855f7'
            }}>
              <BookOpen size={40} />
            </div>
            <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#1e293b', marginBottom: '16px' }}>
              Reading Section Completed!
            </h2>
            <p style={{ color: '#64748b', fontSize: '15px', lineHeight: 1.6, marginBottom: '32px' }}>
              You are ready to proceed to the Writing section. Click the button below to start your 60-minute Writing section.
            </p>
            <button
              onClick={handleStartWritingNow}
              style={{
                backgroundColor: '#a855f7',
                color: '#ffffff',
                border: 'none',
                padding: '14px 40px',
                borderRadius: '8px',
                fontWeight: 700,
                fontSize: '15px',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(168, 85, 247, 0.2)',
                transition: 'background-color 0.2s, transform 0.1s'
              }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = '#9333ea'}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = '#a855f7'}
            >
              Start Writing Section Now
            </button>
          </div>
        )}
      </main>

      {/* Conditionally render full screen TestRunner */}
      {activeTest && (
        <TestRunner
          lang={lang}
          testUrl={activeTest.url}
          testTitle={activeTest.title}
          testCategory={activeTest.category}
          duration={activeTest.duration}
          questionsCount={activeTest.questions}
          isFullTest={isFullTest}
          candidateInfo={candidateInfo}
          onExit={() => {
            setActiveTest(null);
            if (isFullTest) {
              setIsFullTest(false);
              setSelectedSetIndex(null);
              setCurrentSection('dashboard');
            }
          }}
          onComplete={(testResults) => {
            // Save candidate to database (just in case they opened directly from library)
            db.saveCandidate(candidateInfo.fullName, candidateInfo.phone, candidateInfo.telegram);

            if (isFullTest && selectedSetIndex !== null) {
              const currentSet = MOCK_SETS[selectedSetIndex];
              setAnswers(prev => {
                const newAnswers = { ...prev, ...testResults };
                
                // If it's a full test, check what part we finished
                if (activeTest.category === 'listening') {
                  // Save listening results specifically
                  newAnswers.listeningCorrect = testResults.listeningCorrect;
                  newAnswers.listeningBand = testResults.listeningBand;
                  
                  // Go to reading after 2 minutes check time
                  setTimeout(() => {
                    setActiveTest(null);
                    setListeningTransferTimeLeft(120); // 2 minutes countdown
                  }, 500);
                } else if (activeTest.category === 'reading') {
                  // Save reading results specifically
                  newAnswers.readingCorrect = testResults.readingCorrect;
                  newAnswers.readingBand = testResults.readingBand;
                  
                  // Go to writing transition prompt
                  setTimeout(() => {
                    setActiveTest(null);
                    setReadingFinishedPrompt(true);
                  }, 500);
                } else if (activeTest.category === 'writing') {
                  // Save writing results specifically
                  newAnswers.writingBand = testResults.writingBand;
                  
                  const lBand = newAnswers.listeningBand || 0;
                  const rBand = newAnswers.readingBand || 0;
                  const wBand = newAnswers.writingBand || 0;
                  
                  // Speaking is null (pending assessment by administrator)
                  const scoresObj = {
                    listening: lBand,
                    reading: rBand,
                    writing: wBand,
                    overall: 0
                  };

                  // Save full test result to database
                  db.saveResult(
                    candidateInfo.phone,
                    candidateInfo.fullName,
                    'full',
                    currentSet.title,
                    scoresObj
                  );

                  // Close test runner and go to pending-speaking page
                  setTimeout(() => {
                    setActiveTest(null);
                    setIsFullTest(false);
                    setSelectedSetIndex(null);
                    setCurrentSection('pending-speaking');
                  }, 500);
                }
                return newAnswers;
              });
            } else {
              // Single test flow (from library)
              setAnswers(prev => {
                const newAnswers = { ...prev, ...testResults };
                const isListening = activeTest.category === 'listening';
                const isReading = activeTest.category === 'reading';
                const isWriting = activeTest.category === 'writing';
                
                const scoresObj = {
                  listening: isListening ? (testResults.listeningBand || 0) : 0,
                  reading: isReading ? (testResults.readingBand || 0) : 0,
                  writing: isWriting ? (testResults.writingBand || 0) : 0,
                  speaking: 0,
                  overall: isListening 
                    ? (testResults.listeningBand || 0) 
                    : isReading 
                      ? (testResults.readingBand || 0) 
                      : (testResults.writingBand || 0)
                };
                
                db.saveResult(
                  candidateInfo.phone,
                  candidateInfo.fullName,
                  activeTest.category,
                  activeTest.title,
                  scoresObj
                );
                
                setTimeout(() => {
                  setActiveTest(null);
                  setCurrentSection('results');
                }, 500);

                return newAnswers;
              });
            }
          }}
        />
      )}
    </div>
  );
}

export default App;
