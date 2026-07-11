import React, { useState } from 'react';
import { Headphones, BookOpen, PenTool, Mic, Play, ArrowRight, User, Phone, Send, Info, Library } from 'lucide-react';

interface DashboardProps {
  lang: 'UZ' | 'EN';
  onStartFullTest: (setIndex: number) => void;
  onSelectSectionalCategory: (category: 'listening' | 'reading' | 'writing') => void;
  onSelectSection: (section: 'vocabulary' | 'library') => void;
  candidateInfo: {
    fullName: string;
    phone: string;
    telegram: string;
  };
  setCandidateInfo: React.Dispatch<React.SetStateAction<{
    fullName: string;
    phone: string;
    telegram: string;
  }>>;
}

export const Dashboard: React.FC<DashboardProps> = ({ lang, onStartFullTest, onSelectSectionalCategory, onSelectSection, candidateInfo, setCandidateInfo }) => {
  const [formError, setFormError] = useState('');
  const [selectedSet, setSelectedSet] = useState<number>(1);

  const content = {
    title: lang === 'UZ' ? "American School Mock" : "American School Mock",
    subtitle: lang === 'UZ' 
      ? "American School uslubidagi rasmiy va akademik test topshirish tizimi. Natijalarni TRF sertifikati ko'rinishida oling."
      : "Official academic mock testing platform by American School. Get your official-style TRF certificate.",
    candidateHeading: lang === 'UZ' ? "Nomzod Ma'lumotlari (TRF uchun)" : "Candidate Information (for TRF)",
    nameLabel: lang === 'UZ' ? "To'liq ism-sharifingiz" : "Full Name",
    phoneLabel: lang === 'UZ' ? "Telefon raqamingiz" : "Phone Number",
    telegramLabel: lang === 'UZ' ? "Telegram username (masalan: @username)" : "Telegram Username",
    fullTestTitle: lang === 'UZ' ? "To'liq Mock Imtihonlar (Full Mock)" : "Full Mock Exams",
    fullTestDesc: lang === 'UZ'
      ? "Listening (30m), Reading (60m) va Writing (60m) ketma-ket topshiriladi."
      : "Complete Listening (30m), Reading (60m), and Writing (60m) sequentially.",
    fullTestBtn: lang === 'UZ' ? "Imtihonni Boshlash" : "Start Full Exam",
    sectionalTitle: lang === 'UZ' ? "Alohida Bo'limlar Bo'yicha Mashq" : "Sectional Practice Mode",
    durationText: lang === 'UZ' ? "Davomiyligi" : "Duration",
    startPractice: lang === 'UZ' ? "Mashqni Boshlash" : "Practice Now"
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCandidateInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateAndStartFull = (setIndex: number) => {
    if (!candidateInfo.fullName.trim() || !candidateInfo.phone.trim()) {
      setFormError(lang === 'UZ' ? "Ism-sharif va telefon raqami majburiy!" : "Name and phone number are required!");
      return;
    }
    setFormError('');
    onStartFullTest(setIndex);
  };

  const validateAndStartSectional = (category: 'listening' | 'reading' | 'writing') => {
    if (!candidateInfo.fullName.trim() || !candidateInfo.phone.trim()) {
      setFormError(lang === 'UZ' ? "Ism-sharif va telefon raqami majburiy!" : "Name and phone number are required!");
      return;
    }
    setFormError('');
    onSelectSectionalCategory(category);
  };

  return (
    <div className="animate-fade-in" style={{
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '40px 24px',
      display: 'flex',
      flexDirection: 'column',
      gap: '40px'
    }}>
      
      {/* Welcome Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #0b2265 0%, #108b58 100%)',
        padding: '40px 30px',
        borderRadius: '24px',
        color: 'white',
        boxShadow: '0 10px 30px rgba(11,34,101,0.12)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* decor */}
        <div style={{
          position: 'absolute', right: '-50px', top: '-50px',
          width: '200px', height: '200px', borderRadius: '50%',
          background: 'rgba(255,255,255,0.03)'
        }} />
        <div style={{ position: 'relative', zIndex: 2 }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, margin: '0 0 8px', fontFamily: 'Outfit, sans-serif' }}>
            {content.title}
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.8)', margin: 0, fontSize: '0.95rem', maxWidth: '650px' }}>
            {content.subtitle}
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 2fr', gap: '30px', alignItems: 'start' }}>
        
        {/* Candidate Registration Panel */}
        <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <h3 style={{ fontSize: '1.15rem', color: 'hsl(var(--primary))', borderBottom: '1px solid #cbd5e1', paddingBottom: '10px' }}>
            {content.candidateHeading}
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'hsl(var(--text-secondary))' }}>
                {content.nameLabel}
              </label>
              <input
                type="text"
                name="fullName"
                value={candidateInfo.fullName}
                onChange={handleInputChange}
                placeholder="Abdurahmon Moydionov"
                style={{ padding: '10px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '0.9rem' }}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'hsl(var(--text-secondary))' }}>
                {content.phoneLabel}
              </label>
              <input
                type="text"
                name="phone"
                value={candidateInfo.phone}
                onChange={handleInputChange}
                placeholder="+998 50 075 84 44"
                style={{ padding: '10px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '0.9rem' }}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'hsl(var(--text-secondary))' }}>
                {content.telegramLabel}
              </label>
              <input
                type="text"
                name="telegram"
                value={candidateInfo.telegram}
                onChange={handleInputChange}
                placeholder="@amoyd1novvv"
                style={{ padding: '10px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '0.9rem' }}
              />
            </div>

            {formError && (
              <span style={{ color: '#e11d48', fontSize: '0.8rem', fontWeight: 700 }}>
                ⚠️ {formError}
              </span>
            )}
          </div>
        </div>

        {/* Practice Modes */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Full Mock Exams Section */}
          <div>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '16px', color: 'hsl(var(--primary))', borderLeft: '3px solid #e11d48', paddingLeft: '8px' }}>
              {lang === 'UZ' ? 'To\'liq Mock Imtihonlar (Cambridge 20)' : 'Full Mock Exams (Cambridge 20)'}
            </h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
              {[1, 2, 3].map(setNum => (
                <div key={setNum} className="glass-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px', borderTop: '4px solid #e11d48' }}>
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <Play size={18} color="#e11d48" fill="#e11d48" />
                    <h4 style={{ fontSize: '1.1rem', margin: 0, fontWeight: 800 }}>Test {setNum} Mock</h4>
                  </div>
                  <p style={{ fontSize: '0.8rem', color: 'hsl(var(--text-secondary))', margin: 0, lineHeight: 1.4, flex: 1 }}>
                    {lang === 'UZ'
                      ? 'Listening, Reading va Writing bo\'limlari ketma-ket real vaqtda topshiriladi.'
                      : 'Complete Listening, Reading, and Writing sections sequentially in real-time.'}
                  </p>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'hsl(var(--text-muted))' }}>
                    ⏱️ {lang === 'UZ' ? 'Davomiyligi: ~2.5 soat' : 'Duration: ~2.5 hours'}
                  </div>
                  <button 
                    onClick={() => validateAndStartFull(setNum)} 
                    className="btn-primary" 
                    style={{ width: '100%', padding: '10px 16px', fontSize: '0.85rem', justifyContent: 'center', background: '#e11d48', border: 'none', color: '#fff', borderRadius: '8px', cursor: 'pointer', fontWeight: 700 }}
                  >
                    Start Test {setNum}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Sectional Practice Panels */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '1.2rem', margin: 0, color: 'hsl(var(--primary))', borderLeft: '3px solid hsl(var(--accent-red))', paddingLeft: '8px' }}>
                {content.sectionalTitle}
              </h3>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
              {/* Listening */}
              <div className="glass-card" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <Headphones size={18} color="hsl(var(--accent-red))" />
                  <h4 style={{ fontSize: '1rem' }}>Listening</h4>
                </div>
                <div style={{ fontSize: '0.75rem', color: 'hsl(var(--text-muted))' }}>{content.durationText}: 30 mins</div>
                <button onClick={() => validateAndStartSectional('listening')} className="btn-secondary" style={{ width: '100%', padding: '6px 12px', fontSize: '0.8rem', justifyContent: 'center', marginTop: 'auto' }}>
                  {content.startPractice} <ArrowRight size={12} />
                </button>
              </div>

              {/* Reading */}
              <div className="glass-card" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <BookOpen size={18} color="hsl(var(--accent-red))" />
                  <h4 style={{ fontSize: '1rem' }}>Reading</h4>
                </div>
                <div style={{ fontSize: '0.75rem', color: 'hsl(var(--text-muted))' }}>{content.durationText}: 60 mins</div>
                <button onClick={() => validateAndStartSectional('reading')} className="btn-secondary" style={{ width: '100%', padding: '6px 12px', fontSize: '0.8rem', justifyContent: 'center', marginTop: 'auto' }}>
                  {content.startPractice} <ArrowRight size={12} />
                </button>
              </div>

              {/* Writing */}
              <div className="glass-card" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <PenTool size={18} color="hsl(var(--accent-red))" />
                  <h4 style={{ fontSize: '1rem' }}>Writing</h4>
                </div>
                <div style={{ fontSize: '0.75rem', color: 'hsl(var(--text-muted))' }}>{content.durationText}: 60 mins</div>
                <button onClick={() => validateAndStartSectional('writing')} className="btn-secondary" style={{ width: '100%', padding: '6px 12px', fontSize: '0.8rem', justifyContent: 'center', marginTop: 'auto' }}>
                  {content.startPractice} <ArrowRight size={12} />
                </button>
              </div>
            </div>
          </div>

          {/* Test Library Card (Sanakulov Style) */}
          <div className="glass-panel" style={{
            padding: '20px',
            background: 'linear-gradient(135deg, #1e3a5f08, #2563eb05)',
            border: '2px solid #2563eb',
            borderRadius: '16px',
            marginTop: '20px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
              <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
                <div style={{
                  width: '52px', height: '52px', borderRadius: '14px',
                  background: 'linear-gradient(135deg, #2563eb, #1e40af)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                }}>
                  <Library size={24} color="white" />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.15rem', marginBottom: '4px', fontWeight: 700, color: '#1e293b' }}>
                    📚 {lang === 'UZ' ? "Test Kutubxonasi" : "Test Library"}
                  </h3>
                  <p style={{ color: '#64748b', fontSize: '0.82rem', margin: 0 }}>
                    {lang === 'UZ'
                      ? "Authentic materiallar: 5 Listening · 4 Reading · 2 Writing testlari"
                      : "Authentic materials: 5 Listening · 4 Reading · 2 Writing tests"}
                  </p>
                </div>
              </div>
              <button 
                onClick={() => validateAndStart('library')}
                style={{
                  background: 'linear-gradient(135deg, #2563eb, #1e40af)',
                  color: 'white', border: 'none', borderRadius: '10px',
                  padding: '12px 20px', fontWeight: 700, fontSize: '0.9rem',
                  cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px',
                  boxShadow: '0 4px 12px rgba(37,99,235,0.3)'
                }}
              >
                <Library size={16} /> {lang === 'UZ' ? "Kutubxonani Ochish" : "Open Library"}
              </button>
            </div>
          </div>

          {/* Vocabulary & Flashcards Hub (American School Style) */}
          <div className="glass-panel" style={{
            padding: '20px',
            background: 'linear-gradient(135deg, hsl(var(--bg-secondary)), hsl(var(--bg-tertiary)))',
            borderLeft: '4px solid hsl(var(--secondary))',
            marginTop: '8px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
              <div>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700 }}>
                  <span style={{ color: 'hsl(var(--secondary))' }}>●</span>
                  {lang === 'UZ' ? "American School's Vocab (Lug'at va Fleshkartalar)" : "American School's Vocab Hub"}
                </h3>
                <p style={{ color: 'hsl(var(--text-secondary))', fontSize: '0.8rem' }}>
                  {lang === 'UZ' 
                    ? "IELTS Akademik so'zlarini interaktiv flashcardlar va qiziqarli o'yin yordamida tezkor yodlang."
                    : "Memorize IELTS Academic words quickly using interactive flashcards and matching games."}
                </p>
              </div>
              <button 
                onClick={() => validateAndStart('vocabulary')}
                className="btn-primary"
                style={{ background: 'hsl(var(--secondary))', fontSize: '0.8rem', padding: '8px 16px' }}
              >
                {lang === 'UZ' ? "Lug'atni ochish" : "Enter Hub"}
              </button>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
export default Dashboard;
