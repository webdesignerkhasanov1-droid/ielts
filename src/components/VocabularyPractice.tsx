import React, { useState } from 'react';
import { ArrowLeft, Layers, CheckCircle2, RotateCcw, Sparkles, HelpCircle, Award } from 'lucide-react';

interface VocabularyPracticeProps {
  lang: 'UZ' | 'EN';
  onBack: () => void;
}

interface WordItem {
  word: string;
  definition: string;
  synonyms: string;
  uzbekTranslation: string;
  example: string;
}

const vocabularyData: WordItem[] = [
  { 
    word: "Cartography", 
    definition: "The science or practice of drawing maps", 
    synonyms: "mapmaking, charting", 
    uzbekTranslation: "Xaritagrafiya, xarita chizish ilmi",
    example: "The invention of satellite imagery revolutionized modern cartography."
  },
  { 
    word: "Democratize", 
    definition: "Make something accessible to everyone", 
    synonyms: "popularize, share", 
    uzbekTranslation: "Hamma uchun ochiq, erkin va teng qilish",
    example: "The internet has helped to democratize access to academic research."
  },
  { 
    word: "Portability", 
    definition: "The ability to be easily carried or moved", 
    synonyms: "mobility, lightness", 
    uzbekTranslation: "Oson olib yuruvchanlik, ixchamlik",
    example: "The main advantage of these laptops is their portability and battery life."
  },
  { 
    word: "Multifaceted", 
    definition: "Having many different aspects or features", 
    synonyms: "diverse, complex, varied", 
    uzbekTranslation: "Ko'p qirrali, murakkab, serqirra",
    example: "The challenges of global climate change are multifaceted and complex."
  },
  { 
    word: "Cohesive", 
    definition: "Characterized by fitting or sticking together well", 
    synonyms: "united, connected, unified", 
    uzbekTranslation: "Zich bog'langan, jipslashgan, ahil",
    example: "A cohesive argument is essential to achieve a high score in IELTS Writing Task 2."
  },
  { 
    word: "Substantial", 
    definition: "Of considerable importance, size, or worth", 
    synonyms: "significant, major, large", 
    uzbekTranslation: "Muhim, salmoqli, sezilarli darajada katta",
    example: "There has been a substantial increase in online learning over the past decade."
  },
  { 
    word: "Chemosynthesis", 
    definition: "Conversion of carbon-containing molecules into organic matter using inorganic molecules", 
    synonyms: "chemical synthesis", 
    uzbekTranslation: "Kimyoviy sintez (quyoshsiz energiya yaratish)",
    example: "Deep-sea bacteria rely on chemosynthesis rather than photosynthesis to survive."
  },
  { 
    word: "FOXP2", 
    definition: "A gene required for proper development of speech and language", 
    synonyms: "speech gene", 
    uzbekTranslation: "Nutq va til rivojlanishini boshqaruvchi maxsus gen",
    example: "Mutations in the FOXP2 gene can lead to severe speech and language disorders."
  },
  { 
    word: "Acquire", 
    definition: "Buy or obtain an asset or object; learn or develop a skill", 
    synonyms: "obtain, gain, attain", 
    uzbekTranslation: "Egallamoq, orttirmoq, sotib olmoq",
    example: "Children acquire language naturally through exposure and interaction."
  },
  { 
    word: "Ambiguous", 
    definition: "Open to more than one interpretation; having a double meaning", 
    synonyms: "vague, unclear, uncertain", 
    uzbekTranslation: "Ikki ma'noli, noaniq, tushunarsiz",
    example: "The instructions were ambiguous, leading to confusion among the candidates."
  },
  { 
    word: "Cognitive", 
    definition: "Relating to the mental action or process of acquiring knowledge and understanding", 
    synonyms: "intellectual, mental, reasoning", 
    uzbekTranslation: "Kognitiv, aqliy, bilishga oid",
    example: "Reading stimulates cognitive development and improves analytical thinking."
  },
  { 
    word: "Corroborate", 
    definition: "Confirm or give support to a statement, theory, or finding", 
    synonyms: "confirm, verify, validate", 
    uzbekTranslation: "Tasdiqlamoq, quvvatlamoq, isbotlamoq",
    example: "Several studies corroborate the theory that sleep benefits long-term memory."
  },
  { 
    word: "Differentiate", 
    definition: "Recognize or identify the difference between two or more things", 
    synonyms: "distinguish, separate, discriminate", 
    uzbekTranslation: "Farqlamoq, ajratmoq, farqini bilmoq",
    example: "It is crucial to differentiate between reliable news sources and misinformation."
  },
  { 
    word: "Empirical", 
    definition: "Based on, concerned with, or verifiable by observation or experience rather than theory", 
    synonyms: "factual, experimental, observed", 
    uzbekTranslation: "Empirik, tajriba va kuzatishga asoslangan",
    example: "The scientist presented empirical evidence to support her hypothesis."
  },
  { 
    word: "Equivocal", 
    definition: "Open to more than one interpretation; ambiguous or undecided", 
    synonyms: "ambiguous, indefinite, vague", 
    uzbekTranslation: "Noaniq, shubhali, chalkash",
    example: "The results of the preliminary trial were equivocal, requiring further research."
  },
  { 
    word: "Fluctuate", 
    definition: "Rise and fall irregularly in number or amount", 
    synonyms: "vary, shift, alternate", 
    uzbekTranslation: "Tebranmoq, doimiy o'zgarib turmoq",
    example: "Prices of imports fluctuate depending on the global exchange rate."
  },
  { 
    word: "Hypothesis", 
    definition: "A proposed explanation made on the basis of limited evidence as a starting point for investigation", 
    synonyms: "theory, premise, assumption", 
    uzbekTranslation: "Gipotiza, faraz, taxmin",
    example: "The researchers formulated a hypothesis about the causes of the economic recession."
  },
  { 
    word: "Implicate", 
    definition: "Show someone to be involved in a crime or event; convey a meaning indirectly", 
    synonyms: "incriminate, involve, imply", 
    uzbekTranslation: "Aloqadorligini ko'rsatmoq, aybdor deb hisoblamoq",
    example: "The discovery of the documents implicated several high-ranking officials."
  },
  { 
    word: "Pragmatic", 
    definition: "Dealing with things sensibly and realistically in a way that is based on practical considerations", 
    synonyms: "practical, realistic, sensible", 
    uzbekTranslation: "Pragmatik, amaliy, hayotiy",
    example: "A pragmatic approach to education focuses on developing employable skills."
  },
  { 
    word: "Subsequent", 
    definition: "Coming after something in time; following", 
    synonyms: "following, succeeding, later", 
    uzbekTranslation: "Keyingi, ketma-ket keladigan",
    example: "The initial failure did not deter him from achieving success in subsequent attempts."
  }
];

export const VocabularyPractice: React.FC<VocabularyPracticeProps> = ({ lang, onBack }) => {
  const [mode, setMode] = useState<'flashcards' | 'match'>('flashcards');
  
  // Flashcards state
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  // Match Game state
  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const [selectedDef, setSelectedDef] = useState<string | null>(null);
  const [matches, setMatches] = useState<Record<string, string>>({});
  const [shuffledWords, setShuffledWords] = useState<string[]>([]);
  const [shuffledDefs, setShuffledDefs] = useState<string[]>([]);
  const [matchStatus, setMatchStatus] = useState<'idle' | 'success' | 'fail'>('idle');

  // Initializing Match Game
  const startMatchGame = () => {
    const subset = [...vocabularyData].sort(() => 0.5 - Math.random()).slice(0, 5);
    const words = subset.map(w => w.word).sort(() => 0.5 - Math.random());
    const defs = subset.map(w => w.definition).sort(() => 0.5 - Math.random());
    setShuffledWords(words);
    setShuffledDefs(defs);
    setMatches({});
    setSelectedWord(null);
    setSelectedDef(null);
    setMatchStatus('idle');
  };

  React.useEffect(() => {
    if (mode === 'match') {
      startMatchGame();
    }
  }, [mode]);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleNext = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIdx((prev) => (prev + 1) % vocabularyData.length);
    }, 150);
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIdx((prev) => (prev - 1 + vocabularyData.length) % vocabularyData.length);
    }, 150);
  };

  const handleSelectWord = (word: string) => {
    if (matches[word]) return; // Already matched
    
    // Toggle selection
    if (selectedWord === word) {
      setSelectedWord(null);
      return;
    }

    setSelectedWord(word);
    
    // Check match if definition is already selected
    if (selectedDef) {
      checkMatch(word, selectedDef);
    }
  };

  const handleSelectDef = (def: string) => {
    if (Object.values(matches).includes(def)) return; // Already matched
    
    // Toggle selection
    if (selectedDef === def) {
      setSelectedDef(null);
      return;
    }

    setSelectedDef(def);

    // Check match if word is already selected
    if (selectedWord) {
      checkMatch(selectedWord, def);
    }
  };

  const checkMatch = (word: string, def: string) => {
    const correctWordObj = vocabularyData.find(w => w.word === word);
    if (correctWordObj && correctWordObj.definition === def) {
      // Correct Match
      setMatches(prev => ({ ...prev, [word]: def }));
      setMatchStatus('success');
      setSelectedWord(null);
      setSelectedDef(null);
      setTimeout(() => setMatchStatus('idle'), 800);
    } else {
      // Incorrect Match
      setMatchStatus('fail');
      setSelectedWord(null);
      setSelectedDef(null);
      setTimeout(() => setMatchStatus('idle'), 800);
    }
  };

  const isGameComplete = Object.keys(matches).length === 5;

  return (
    <div className="animate-fade-in" style={{
      maxWidth: '900px',
      margin: '0 auto',
      padding: '40px 24px',
      display: 'flex',
      flexDirection: 'column',
      gap: '30px'
    }}>
      
      {/* Premium Header Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #1e3a5f 0%, #1e293b 100%)',
        padding: '30px',
        borderRadius: '20px',
        color: '#fff',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        boxShadow: '0 10px 30px rgba(30,58,95,0.15)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Decorative elements */}
        <div style={{
          position: 'absolute', top: '-50px', right: '-50px',
          width: '180px', height: '180px', borderRadius: '50%',
          background: 'rgba(255,255,255,0.03)'
        }} />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', zIndex: 2 }}>
          <button onClick={onBack} style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            background: 'rgba(255,255,255,0.15)', border: 'none',
            color: '#fff', padding: '8px 16px', borderRadius: '10px',
            cursor: 'pointer', fontSize: '14px', fontWeight: 600,
            transition: 'background 0.2s', backdropFilter: 'blur(4px)'
          }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.25)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.15)'}
          >
            <ArrowLeft size={16} /> {lang === 'UZ' ? 'Orqaga' : 'Back'}
          </button>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button 
              onClick={() => setMode('flashcards')} 
              style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                padding: '10px 20px', borderRadius: '10px', border: 'none',
                cursor: 'pointer', fontWeight: 700, fontSize: '14px',
                transition: 'all 0.2s ease',
                background: mode === 'flashcards' ? '#2563eb' : 'rgba(255,255,255,0.1)',
                color: '#fff'
              }}
            >
              <Layers size={14} /> Flashcards
            </button>
            <button 
              onClick={() => setMode('match')} 
              style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                padding: '10px 20px', borderRadius: '10px', border: 'none',
                cursor: 'pointer', fontWeight: 700, fontSize: '14px',
                transition: 'all 0.2s ease',
                background: mode === 'match' ? '#2563eb' : 'rgba(255,255,255,0.1)',
                color: '#fff'
              }}
            >
              <Sparkles size={14} /> Match Game
            </button>
          </div>
        </div>

        <div style={{ zIndex: 2 }}>
          <h1 style={{ fontSize: '28px', fontWeight: 800, margin: '0 0 6px', fontFamily: 'Outfit, sans-serif', display: 'flex', alignItems: 'center', gap: '10px' }}>
            🔥 American School Vocab
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '14px', margin: 0, maxWidth: '600px' }}>
            {lang === 'UZ' 
              ? "IELTS imtihoni uchun eng muhim akademik so'zlarni interaktiv usulda yodlang." 
              : "Master the most critical IELTS Academic words using smart flashcards and interactive games."}
          </p>
        </div>
      </div>

      {/* FLASHCARDS MODE */}
      {mode === 'flashcards' && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '30px', marginTop: '10px' }}>
          
          {/* 3D Flippable Card */}
          <div 
            onClick={handleFlip}
            style={{
              width: '100%',
              maxWidth: '500px',
              height: '320px',
              perspective: '1200px',
              cursor: 'pointer'
            }}
          >
            <div style={{
              width: '100%',
              height: '100%',
              transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
              transformStyle: 'preserve-3d',
              transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
              position: 'relative',
            }}>
              {/* Front side (Word) */}
              <div style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                backfaceVisibility: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '40px',
                textAlign: 'center',
                backgroundColor: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '24px',
                boxShadow: '0 15px 35px rgba(0,0,0,0.06)'
              }}>
                <div style={{
                  background: '#eff6ff',
                  color: '#2563eb',
                  padding: '4px 12px',
                  borderRadius: '20px',
                  fontSize: '11px',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  marginBottom: '20px'
                }}>
                  IELTS Academic Word
                </div>
                <h2 style={{ 
                  fontSize: '32px', 
                  fontWeight: 800, 
                  color: '#1e293b',
                  fontFamily: 'Outfit, sans-serif',
                  margin: 0
                }}>
                  {vocabularyData[currentIdx].word}
                </h2>
                <div style={{
                  marginTop: '40px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  color: '#94a3b8',
                  fontSize: '13px'
                }}>
                  <RotateCcw size={14} />
                  <span>{lang === 'UZ' ? "Tarjimasini ko'rish uchun bosing" : "Click to view definition"}</span>
                </div>
              </div>

              {/* Back side (Translation & Details) */}
              <div style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                backfaceVisibility: 'hidden',
                transform: 'rotateY(180deg)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                padding: '30px 40px',
                backgroundColor: '#ffffff',
                border: '1px solid #2563eb33',
                borderRadius: '24px',
                boxShadow: '0 15px 35px rgba(37,99,235,0.08)'
              }}>
                {/* Definition */}
                <div style={{ marginBottom: '16px' }}>
                  <span style={{ fontSize: '11px', fontWeight: 800, color: '#2563eb', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
                    Definition
                  </span>
                  <p style={{ fontSize: '15px', color: '#334155', fontWeight: 500, lineHeight: 1.4, margin: 0 }}>
                    {vocabularyData[currentIdx].definition}
                  </p>
                </div>

                {/* Example sentence */}
                <div style={{ marginBottom: '16px', background: '#f8fafc', padding: '10px 14px', borderRadius: '12px', borderLeft: '3px solid #cbd5e1' }}>
                  <span style={{ fontSize: '10px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', display: 'block', marginBottom: '2px' }}>
                    Example Sentence
                  </span>
                  <p style={{ fontSize: '13px', color: '#475569', fontStyle: 'italic', margin: 0, lineHeight: 1.4 }}>
                    "{vocabularyData[currentIdx].example}"
                  </p>
                </div>

                {/* Synonyms & Uzbek */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', borderTop: '1px solid #f1f5f9', paddingTop: '12px' }}>
                  <div>
                    <span style={{ fontSize: '11px', fontWeight: 700, color: '#e11d48', textTransform: 'uppercase', display: 'block', marginBottom: '2px' }}>
                      Synonyms
                    </span>
                    <span style={{ fontSize: '13px', color: '#64748b' }}>
                      {vocabularyData[currentIdx].synonyms}
                    </span>
                  </div>
                  <div>
                    <span style={{ fontSize: '11px', fontWeight: 700, color: '#059669', textTransform: 'uppercase', display: 'block', marginBottom: '2px' }}>
                      O'zbekcha
                    </span>
                    <span style={{ fontSize: '13px', color: '#1e293b', fontWeight: 600 }}>
                      {vocabularyData[currentIdx].uzbekTranslation}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation controls */}
          <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
            <button 
              onClick={handlePrev} 
              style={{
                width: '44px', height: '44px', borderRadius: '50%',
                border: '1px solid #cbd5e1', background: '#fff',
                fontSize: '16px', cursor: 'pointer', display: 'flex',
                alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s'
              }}
              onMouseEnter={e => e.currentTarget.style.borderColor = '#2563eb'}
              onMouseLeave={e => e.currentTarget.style.borderColor = '#cbd5e1'}
            >
              ◀
            </button>
            <span style={{ fontSize: '16px', fontWeight: 700, color: '#1e293b', fontFamily: 'Outfit, sans-serif' }}>
              {currentIdx + 1} <span style={{ color: '#94a3b8', fontWeight: 500 }}>/</span> {vocabularyData.length}
            </span>
            <button 
              onClick={handleNext} 
              style={{
                width: '44px', height: '44px', borderRadius: '50%',
                border: '1px solid #cbd5e1', background: '#fff',
                fontSize: '16px', cursor: 'pointer', display: 'flex',
                alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s'
              }}
              onMouseEnter={e => e.currentTarget.style.borderColor = '#2563eb'}
              onMouseLeave={e => e.currentTarget.style.borderColor = '#cbd5e1'}
            >
              ▶
            </button>
          </div>
        </div>
      )}

      {/* MATCH GAME MODE */}
      {mode === 'match' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Status Indicators */}
          {matchStatus !== 'idle' && (
            <div style={{
              textAlign: 'center',
              padding: '14px',
              borderRadius: '12px',
              fontWeight: 700,
              fontSize: '15px',
              animation: 'pulse 1s infinite',
              background: matchStatus === 'success' ? '#dcfce7' : '#fee2e2',
              color: matchStatus === 'success' ? '#15803d' : '#b91c1c',
              border: `1px solid ${matchStatus === 'success' ? '#bbf7d0' : '#fecaca'}`
            }}>
              {matchStatus === 'success' 
                ? (lang === 'UZ' ? "To'g'ri moslik! 🎉" : "Perfect Match! 🎉")
                : (lang === 'UZ' ? "Noto'g'ri! Qayta urinib ko'ring ❌" : "Incorrect! Try again ❌")}
            </div>
          )}

          {/* Shuffled columns */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.3fr', gap: '30px' }}>
            
            {/* Column 1: Words */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '2px solid #e2e8f0', paddingBottom: '8px' }}>
                <Award size={18} color="#2563eb" />
                <h4 style={{ fontSize: '15px', fontWeight: 700, color: '#1e293b', margin: 0 }}>Words</h4>
              </div>
              {shuffledWords.map((word) => {
                const isMatched = !!matches[word];
                const isSelected = selectedWord === word;
                return (
                  <button
                    key={word}
                    onClick={() => handleSelectWord(word)}
                    disabled={isMatched}
                    style={{
                      width: '100%',
                      padding: '16px',
                      borderRadius: '14px',
                      border: isMatched ? '1px solid #10b981' : isSelected ? '2px solid #2563eb' : '1px solid #e2e8f0',
                      background: isMatched ? '#f0fdf4' : isSelected ? '#eff6ff' : '#fff',
                      color: isMatched ? '#10b981' : isSelected ? '#2563eb' : '#1e293b',
                      fontWeight: isSelected || isMatched ? 700 : 500,
                      fontSize: '14px',
                      cursor: isMatched ? 'default' : 'pointer',
                      transition: 'all 0.2s',
                      boxShadow: isSelected ? '0 4px 12px rgba(37,99,235,0.08)' : 'none',
                      opacity: isMatched ? 0.6 : 1,
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                  >
                    <span>{word}</span>
                    {isMatched && <span style={{ fontSize: '12px', background: '#10b981', color: '#fff', padding: '2px 6px', borderRadius: '6px' }}>MATCHED</span>}
                  </button>
                );
              })}
            </div>

            {/* Column 2: Definitions */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '2px solid #e2e8f0', paddingBottom: '8px' }}>
                <HelpCircle size={18} color="#059669" />
                <h4 style={{ fontSize: '15px', fontWeight: 700, color: '#1e293b', margin: 0 }}>Definitions</h4>
              </div>
              {shuffledDefs.map((def) => {
                const isMatched = Object.values(matches).includes(def);
                const isSelected = selectedDef === def;
                return (
                  <button
                    key={def}
                    onClick={() => handleSelectDef(def)}
                    disabled={isMatched}
                    style={{
                      width: '100%',
                      padding: '16px',
                      borderRadius: '14px',
                      border: isMatched ? '1px solid #10b981' : isSelected ? '2px solid #2563eb' : '1px solid #e2e8f0',
                      background: isMatched ? '#f0fdf4' : isSelected ? '#eff6ff' : '#fff',
                      color: isMatched ? '#10b981' : isSelected ? '#2563eb' : '#334155',
                      fontWeight: isSelected || isMatched ? 700 : 500,
                      fontSize: '13px',
                      cursor: isMatched ? 'default' : 'pointer',
                      transition: 'all 0.2s',
                      boxShadow: isSelected ? '0 4px 12px rgba(37,99,235,0.08)' : 'none',
                      opacity: isMatched ? 0.6 : 1,
                      textAlign: 'left',
                      lineHeight: 1.4
                    }}
                  >
                    {def}
                  </button>
                );
              })}
            </div>

          </div>

          {/* Completion Celebration modal */}
          {isGameComplete && (
            <div style={{
              background: 'linear-gradient(135deg, #dcfce7 0%, #f0fdf4 100%)',
              border: '1px solid #bbf7d0',
              borderRadius: '20px',
              padding: '30px',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '16px',
              boxShadow: '0 10px 25px rgba(16,185,129,0.08)',
              marginTop: '10px',
              animation: 'fadeIn 0.5s ease-out'
            }}>
              <div style={{
                width: '60px', height: '60px', borderRadius: '50%',
                background: '#10b981', display: 'flex',
                alignItems: 'center', justifyContent: 'center', color: '#fff'
              }}>
                <CheckCircle2 size={32} />
              </div>
              <div>
                <h3 style={{ fontSize: '20px', color: '#065f46', fontWeight: 800, margin: '0 0 6px' }}>
                  {lang === 'UZ' ? "Ajoyib! Muvozanat to'liq o'rnatildi!" : "Excellent! Complete Harmony!"}
                </h3>
                <p style={{ color: '#047857', fontSize: '14px', margin: 0 }}>
                  {lang === 'UZ' 
                    ? "Barcha akademik so'zlarni to'g'ri juftlikda moslashtirdingiz." 
                    : "You have successfully matched all the academic vocabulary words."}
                </p>
              </div>
              <button 
                onClick={startMatchGame}
                style={{
                  background: '#10b981',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '10px',
                  padding: '12px 24px',
                  fontWeight: 700,
                  fontSize: '14px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 12px rgba(16,185,129,0.3)',
                  transition: 'opacity 0.2s'
                }}
                onMouseEnter={e => e.currentTarget.style.opacity = '0.9'}
                onMouseLeave={e => e.currentTarget.style.opacity = '1'}
              >
                <RotateCcw size={16} />
                {lang === 'UZ' ? "Yana o'ynash" : "Play Again"}
              </button>
            </div>
          )}

        </div>
      )}

    </div>
  );
};
export default VocabularyPractice;
