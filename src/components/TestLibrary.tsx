import React, { useState } from 'react';
import { Headphones, BookOpen, PenTool, Play, Lock, ChevronRight, ArrowLeft, Star, Clock, Users } from 'lucide-react';

import testData from '../data/testLibraryData.json';

interface TestItem {
  id: number;
  title: string;
  subtitle: string;
  duration: string;
  questions: number;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  url: string;
  free: boolean;
  source: string;
  originalFile?: string;
}

interface TestCategory {
  id: string;
  title: string;
  titleUz: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  tests: TestItem[];
}

const TEST_CATEGORIES: TestCategory[] = [
  {
    id: 'listening',
    title: 'Listening',
    titleUz: 'Listening',
    icon: <Headphones size={22} />,
    color: '#2563eb',
    bgColor: '#eff6ff',
    tests: testData.listening as any[]
  },
  {
    id: 'reading',
    title: 'Reading',
    titleUz: 'Reading',
    icon: <BookOpen size={22} />,
    color: '#059669',
    bgColor: '#ecfdf5',
    tests: testData.reading as any[]
  },
  {
    id: 'writing',
    title: 'Writing',
    titleUz: 'Writing',
    icon: <PenTool size={22} />,
    color: '#d97706',
    bgColor: '#fffbeb',
    tests: testData.writing as any[]
  }
];

const difficultyColors: Record<string, { bg: string; text: string }> = {
  'Beginner': { bg: '#dcfce7', text: '#166534' },
  'Intermediate': { bg: '#fef9c3', text: '#854d0e' },
  'Advanced': { bg: '#fee2e2', text: '#991b1b' },
};

interface TestLibraryProps {
  lang: 'UZ' | 'EN';
  onBack: () => void;
  onStartTest: (testUrl: string, testTitle: string, testCategory: 'listening' | 'reading' | 'writing', duration?: string, questionsCount?: number) => void;
  onSelectFullMock?: () => void;
  initialCategory?: 'listening' | 'reading' | 'writing';
}

export const TestLibrary: React.FC<TestLibraryProps> = ({ lang, onBack, onStartTest, onSelectFullMock, initialCategory = 'listening' }) => {
  const [activeCategory, setActiveCategory] = useState<string>(initialCategory);
  const [selectedSet, setSelectedSet] = useState<'all' | 1 | 2 | 3>('all');

  React.useEffect(() => {
    setActiveCategory(initialCategory);
  }, [initialCategory]);

  const currentCategory = TEST_CATEGORIES.find(c => c.id === activeCategory)!;

  const handleOpenTest = (test: TestItem) => {
    onStartTest(test.url, test.title, activeCategory as any, test.duration, test.questions);
  };

  const getFilteredTests = () => {
    const allTests = currentCategory.tests;
    if (selectedSet === 'all') return allTests;
    
    // Define urls for each set
    const setMapping: Record<number, { listening: string; reading: string; writing: string }> = {
      1: {
        listening: '/tests/listening/test_1.html',
        reading: '/tests/reading/test_1.html',
        writing: '/tests/writing/test_1.html'
      },
      2: {
        listening: '/tests/listening/test_2.html',
        reading: '/tests/reading/test_2.html',
        writing: '/tests/writing/test_2.html'
      },
      3: {
        listening: '/tests/listening/test_3.html',
        reading: '/tests/reading/test_3.html',
        writing: '/tests/writing/test_1.html'
      }
    };
    
    const mapping = setMapping[selectedSet];
    if (!mapping) return [];
    
    const targetUrl = mapping[activeCategory as 'listening' | 'reading' | 'writing'];
    return allTests.filter(t => t.url === targetUrl);
  };

  const filteredTests = getFilteredTests();

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc', paddingTop: '80px' }}>
      {/* Page Header */}
      <div style={{
        background: 'linear-gradient(135deg, #1e3a5f 0%, #2563eb 100%)',
        padding: '40px 24px 60px',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* decorative circles */}
        <div style={{
          position: 'absolute', top: '-40px', right: '-40px',
          width: '200px', height: '200px', borderRadius: '50%',
          background: 'rgba(255,255,255,0.05)'
        }} />
        <div style={{
          position: 'absolute', bottom: '-60px', left: '10%',
          width: '150px', height: '150px', borderRadius: '50%',
          background: 'rgba(255,255,255,0.04)'
        }} />

        <div style={{ maxWidth: '1100px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <button onClick={onBack} style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            background: 'rgba(255,255,255,0.15)', border: 'none',
            color: '#fff', padding: '8px 16px', borderRadius: '8px',
            cursor: 'pointer', fontSize: '14px', fontWeight: 500, marginBottom: '24px',
            backdropFilter: 'blur(4px)'
          }}>
            <ArrowLeft size={16} /> {lang === 'UZ' ? 'Orqaga' : 'Back'}
          </button>

          <h1 style={{ color: '#fff', fontSize: '32px', fontWeight: 800, marginBottom: '8px', fontFamily: 'Outfit, sans-serif' }}>
            📚 {lang === 'UZ' ? 'Test Kutubxonasi' : 'Test Library'}
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '16px', maxWidth: '600px' }}>
            {lang === 'UZ'
              ? 'Authentic materiallar asosida tayyorlangan real IELTS test namunalari'
              : 'Real IELTS mock tests from authentic materials'}
          </p>

          {/* Stats row */}
          <div style={{ display: 'flex', gap: '24px', marginTop: '24px', flexWrap: 'wrap' }}>
            {[
              { icon: <Headphones size={16}/>, label: lang === 'UZ' ? `${testData.listening.length} ta Listening` : `${testData.listening.length} Listening Tests` },
              { icon: <BookOpen size={16}/>, label: lang === 'UZ' ? `${testData.reading.length} ta Reading` : `${testData.reading.length} Reading Tests` },
              { icon: <PenTool size={16}/>, label: lang === 'UZ' ? `${testData.writing.length} ta Writing` : `${testData.writing.length} Writing Tests` },
              { icon: <Users size={16}/>, label: lang === 'UZ' ? 'Barchasi bepul' : 'All Free' },
            ].map((s, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                background: 'rgba(255,255,255,0.12)', padding: '8px 16px',
                borderRadius: '20px', color: '#fff', fontSize: '14px',
                backdropFilter: 'blur(4px)'
              }}>
                {s.icon} {s.label}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Set Filter Bar */}
      <div style={{ maxWidth: '1100px', margin: '-28px auto 0', padding: '0 24px', position: 'relative', zIndex: 10 }}>
        <div style={{
          display: 'flex', gap: '8px',
          background: '#fff', borderRadius: '16px', padding: '12px 16px',
          boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
          flexWrap: 'wrap',
          alignItems: 'center',
          marginBottom: '16px',
          border: '1px solid #e2e8f0'
        }}>
          <span style={{ fontSize: '14px', fontWeight: 700, color: '#475569', marginRight: '8px' }}>
            {lang === 'UZ' ? 'Imtihon bo\'limlari (Set):' : 'Exam Sets Filter:'}
          </span>
          {[
            { id: 'all', label: lang === 'UZ' ? 'Barcha testlar' : 'All Practice' },
            { id: 1, label: 'Test 1' },
            { id: 2, label: 'Test 2' },
            { id: 3, label: 'Test 3' },
          ].map(set => (
            <button
              key={set.id}
              onClick={() => setSelectedSet(set.id as any)}
              style={{
                padding: '8px 16px', borderRadius: '8px', border: 'none',
                cursor: 'pointer', fontWeight: 600, fontSize: '14px',
                transition: 'all 0.2s ease',
                background: selectedSet === set.id ? '#2563eb' : '#f1f5f9',
                color: selectedSet === set.id ? '#fff' : '#475569',
              }}
            >
              {set.label}
            </button>
          ))}
          
          {onSelectFullMock && (
            <button
              onClick={onSelectFullMock}
              style={{
                marginLeft: 'auto',
                padding: '8px 16px', borderRadius: '8px', 
                border: '1px solid #f43f5e',
                cursor: 'pointer', fontWeight: 700, fontSize: '14px',
                transition: 'all 0.2s ease',
                background: '#fff1f2',
                color: '#e11d48',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = '#ffe4e6';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = '#fff1f2';
              }}
            >
              👑 {lang === 'UZ' ? 'To\'liq Mock Imtihon' : 'Full Mock Exam'}
            </button>
          )}
        </div>
      </div>

      {/* Category Tabs */}
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 24px', position: 'relative', zIndex: 10 }}>
        <div style={{
          display: 'flex', gap: '12px',
          background: '#fff', borderRadius: '16px', padding: '8px',
          boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
          flexWrap: 'wrap',
          border: '1px solid #e2e8f0'
        }}>
          {TEST_CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: '10px',
                padding: '12px 24px', borderRadius: '10px', border: 'none',
                cursor: 'pointer', fontWeight: 600, fontSize: '15px',
                transition: 'all 0.2s ease', flex: '1',
                background: activeCategory === cat.id ? cat.color : 'transparent',
                color: activeCategory === cat.id ? '#fff' : '#64748b',
              }}
            >
              {cat.icon}
              {lang === 'UZ' ? cat.titleUz : cat.title}
              <span style={{
                marginLeft: 'auto',
                background: activeCategory === cat.id ? 'rgba(255,255,255,0.25)' : '#f1f5f9',
                color: activeCategory === cat.id ? '#fff' : '#94a3b8',
                padding: '2px 8px', borderRadius: '10px', fontSize: '12px', fontWeight: 700
              }}>
                {cat.tests.length}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Test Grid */}
      <div style={{ maxWidth: '1100px', margin: '32px auto', padding: '0 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
          {filteredTests.map((test) => (
            <div key={test.id} style={{
              background: '#fff', borderRadius: '16px',
              boxShadow: '0 2px 16px rgba(0,0,0,0.06)',
              border: '1px solid #e2e8f0',
              overflow: 'hidden', cursor: 'pointer',
              transition: 'all 0.25s ease',
            }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)';
                (e.currentTarget as HTMLElement).style.boxShadow = '0 12px 32px rgba(0,0,0,0.12)';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                (e.currentTarget as HTMLElement).style.boxShadow = '0 2px 16px rgba(0,0,0,0.06)';
              }}
            >
              {/* Card header color stripe */}
              <div style={{
                background: `linear-gradient(135deg, ${currentCategory.color}22, ${currentCategory.color}11)`,
                borderBottom: `3px solid ${currentCategory.color}`,
                padding: '20px 20px 16px',
              }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px' }}>
                  <div style={{
                    width: '44px', height: '44px', borderRadius: '12px',
                    background: currentCategory.color, display: 'flex',
                    alignItems: 'center', justifyContent: 'center', color: '#fff', flexShrink: 0
                  }}>
                    {currentCategory.icon}
                  </div>
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                    {test.free && (
                      <span style={{
                        fontSize: '11px', fontWeight: 700,
                        background: '#dcfce7', color: '#166534',
                        padding: '3px 10px', borderRadius: '10px'
                      }}>
                        FREE
                      </span>
                    )}
                  </div>
                </div>
                <div style={{ marginTop: '12px' }}>
                  <div style={{ fontSize: '12px', color: currentCategory.color, fontWeight: 600, marginBottom: '4px' }}>
                    {currentCategory.title} · Test {test.id}
                  </div>
                  <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#1e293b', lineHeight: 1.3, margin: 0 }}>
                    {test.title}
                  </h3>
                </div>
              </div>

              {/* Card body */}
              <div style={{ padding: '16px 20px' }}>
                <p style={{ fontSize: '13px', color: '#64748b', lineHeight: 1.5, margin: '0 0 16px' }}>
                  {test.subtitle}
                </p>

                <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#64748b' }}>
                    <Clock size={14} style={{ color: currentCategory.color }} />
                    {test.duration}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#64748b' }}>
                    <Star size={14} style={{ color: currentCategory.color }} />
                    {test.questions} {lang === 'UZ' ? 'savol' : 'questions'}
                  </div>
                </div>

                <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '16px' }}>
                  📌 Source: {test.source}
                </div>

                <button
                  onClick={() => handleOpenTest(test)}
                  style={{
                    width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    gap: '8px', padding: '12px 20px',
                    background: currentCategory.color,
                    color: '#fff', border: 'none', borderRadius: '10px',
                    fontWeight: 700, fontSize: '14px', cursor: 'pointer',
                    transition: 'opacity 0.2s ease',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.opacity = '0.9')}
                  onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
                >
                  <Play size={16} fill="white" /> {lang === 'UZ' ? 'Testni Boshlash' : 'Start Test'}
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom info banner */}
        <div style={{
          marginTop: '40px', padding: '20px 24px',
          background: 'linear-gradient(135deg, #1e3a5f11, #2563eb08)',
          border: '1px solid #2563eb22', borderRadius: '16px',
          display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap'
        }}>
          <div style={{
            width: '48px', height: '48px', borderRadius: '12px',
            background: 'linear-gradient(135deg, #2563eb, #1e3a5f)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
          }}>
            <Lock size={20} color="white" />
          </div>
          <div>
            <p style={{ fontWeight: 700, color: '#1e293b', margin: '0 0 4px', fontSize: '15px' }}>
              {lang === 'UZ' ? '🔒 Barcha testlar yangi oynada ochiladi' : '🔒 All tests open in a new window'}
            </p>
            <p style={{ color: '#64748b', fontSize: '13px', margin: 0 }}>
              {lang === 'UZ'
                ? 'Test yakunida platforma orqali natijangizni TRF sertifikat formatida oling'
                : 'After the test, return here to get your results as an official TRF Certificate'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
