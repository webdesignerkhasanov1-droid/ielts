import React from 'react';
import { ArrowLeft, Play, Clock, FileText, Headphones } from 'lucide-react';

interface MockSet {
  id: number;
  title: string;
  listening: { url: string; title: string; category: 'listening' };
  reading: { url: string; title: string; category: 'reading' };
  writing: { url: string; title: string; category: 'writing' };
}

interface FullTestSelectProps {
  lang: 'UZ' | 'EN';
  onBack: () => void;
  onSelectSet: (setIndex: number) => void;
}

export const MOCK_SETS: MockSet[] = [
  {
    id: 1,
    title: "Mock Test Set 1",
    listening: { url: "/tests/listening/test_1.html", title: "Authentic Listening Full Test 1", category: "listening" },
    reading: { url: "/tests/reading/test_1.html", title: "Authentic Reading Mock 10", category: "reading" },
    writing: { url: "/tests/writing/test_1.html", title: "Practice Writing", category: "writing" }
  },
  {
    id: 2,
    title: "Mock Test Set 2",
    listening: { url: "/tests/listening/test_2.html", title: "Authentic Listening Full Test 4", category: "listening" },
    reading: { url: "/tests/reading/test_2.html", title: "Cloud Science (2)", category: "reading" },
    writing: { url: "/tests/writing/test_2.html", title: "Writing", category: "writing" }
  },
  {
    id: 3,
    title: "Mock Test Set 3",
    listening: { url: "/tests/listening/test_3.html", title: "Authentic Listening Mock", category: "listening" },
    reading: { url: "/tests/reading/test_3.html", title: "Passage 2 - Antarctica", category: "reading" },
    writing: { url: "/tests/writing/test_1.html", title: "Practice Writing", category: "writing" }
  }
];

export const FullTestSelect: React.FC<FullTestSelectProps> = ({ lang, onBack, onSelectSet }) => {
  return (
    <div style={{ minHeight: '100vh', paddingTop: '80px', paddingLeft: '24px', paddingRight: '24px' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <button 
          onClick={onBack} 
          style={{
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px',
            background: 'rgba(255,255,255,0.1)', 
            border: '1px solid var(--border-subtle)',
            color: 'var(--text-primary)', 
            padding: '8px 16px', 
            borderRadius: '8px',
            cursor: 'pointer', 
            fontSize: '14px', 
            fontWeight: 500, 
            marginBottom: '24px',
            backdropFilter: 'blur(4px)'
          }}
        >
          <ArrowLeft size={16} /> {lang === 'UZ' ? 'Orqaga' : 'Back'}
        </button>

        <h1 style={{ fontSize: '32px', fontWeight: 800, marginBottom: '8px', color: 'var(--text-primary)' }}>
          {lang === 'UZ' ? 'Imtihon To\'plamni Tanlang' : 'Select Exam Set'}
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '16px', marginBottom: '32px' }}>
          {lang === 'UZ' 
            ? 'Haqiqiy imtihon muhiti. Listening, Reading va Writing testlari ketma-ket topshiriladi.' 
            : 'Real exam environment. Listening, Reading and Writing tests will be taken sequentially.'}
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {MOCK_SETS.map((set, idx) => (
            <div 
              key={set.id} 
              className="glass-panel" 
              style={{ 
                padding: '24px', 
                borderRadius: '16px',
                borderLeft: '5px solid #e11d48',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '20px'
              }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <h3 style={{ fontSize: '1.4rem', margin: 0, color: 'var(--text-primary)' }}>
                  {lang === 'UZ' ? `Mock Test To'plami #${set.id}` : `Mock Test Set #${set.id}`}
                </h3>
                <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Headphones size={14} /> {set.listening.title}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <FileText size={14} /> {set.reading.title}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Clock size={14} /> 2 Hours 30 Mins
                  </span>
                </div>
              </div>
              <button 
                onClick={() => onSelectSet(idx)}
                className="btn-primary"
                style={{ background: '#e11d48', display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px' }}
              >
                <Play size={16} fill="white" />
                {lang === 'UZ' ? 'Imtihonni Boshlash' : 'Start Exam'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
