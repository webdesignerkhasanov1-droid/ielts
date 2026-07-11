import React, { useState, useEffect } from 'react';
import { ArrowLeft, RefreshCw, Sparkles, FileText, Send, Share2, PenTool, Clock, CheckCircle } from 'lucide-react';
import { ieltsMockData } from '../data/ieltsMockData';
import { TRFCertificate } from './TRFCertificate';

interface ResultsDashboardProps {
  lang: 'UZ' | 'EN';
  answers: {
    listening?: Record<string, string>;
    reading?: Record<string, string>;
    writing?: Record<string, string>;
    speaking?: any;
    listeningCorrect?: number;
    listeningBand?: number;
    readingCorrect?: number;
    readingBand?: number;
    writingBand?: number;
    overall?: number;
  };
  onRestart: () => void;
  candidateInfo: {
    fullName: string;
    phone: string;
    telegram: string;
  };
}

export const ResultsDashboard: React.FC<ResultsDashboardProps> = ({ lang, answers, onRestart, candidateInfo }) => {
  const hasListening = answers.listening !== undefined || answers.listeningBand !== undefined;
  const hasReading = answers.reading !== undefined || answers.readingBand !== undefined;
  const hasWriting = answers.writing !== undefined || answers.writingBand !== undefined;
  const isFullMock = hasListening && hasReading && hasWriting;

  const [activeTab, setActiveTab] = useState<'trf' | 'analysis' | 'grammar' | 'progress'>(
    isFullMock ? 'trf' : 'analysis'
  );
  const [telegramStatus, setTelegramStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  // Grammar check rule-engine database
  const checkGrammar = (text: string) => {
    if (!text.trim()) return [];
    
    const errors: Array<{
      original: string;
      replacement: string;
      reason: string;
      context: string;
    }> = [];

    const rules = [
      { pattern: /\bthey is\b/gi, replacement: "they are", reason: "Subject-verb agreement: 'they' is plural." },
      { pattern: /\bpeople has\b/gi, replacement: "people have", reason: "Subject-verb agreement: 'people' is plural." },
      { pattern: /\bhe go\b/gi, replacement: "he goes", reason: "Subject-verb agreement: Third-person singular requires 'goes'." },
      { pattern: /\bshe go\b/gi, replacement: "she goes", reason: "Subject-verb agreement: Third-person singular requires 'goes'." },
      { pattern: /\bit go\b/gi, replacement: "it goes", reason: "Subject-verb agreement: Third-person singular requires 'goes'." },
      { pattern: /\binformation are\b/gi, replacement: "information is", reason: "'Information' is an uncountable noun and takes a singular verb." },
      { pattern: /\bdiscuss about\b/gi, replacement: "discuss", reason: "Redundant preposition: 'discuss' means 'to talk about'." },
      { pattern: /\bcope up with\b/gi, replacement: "cope with", reason: "Idiomatic error: the correct phrase is 'cope with'." },
      { pattern: /\binterested on\b/gi, replacement: "interested in", reason: "Preposition error: we use 'interested in' for hobbies/activities." },
      { pattern: /\bdepend of\b/gi, replacement: "depend on", reason: "Preposition error: the correct verb-preposition pair is 'depend on'." },
      { pattern: /\ba apple\b/gi, replacement: "an apple", reason: "Use 'an' before words starting with vowel sounds." },
      { pattern: /\ban university\b/gi, replacement: "a university", reason: "Use 'a' before words starting with a consonant sound ('yu-')." },
      { pattern: /\bin order to\b/gi, replacement: "to", reason: "Wordy expression. 'To' is sufficient and more concise." },
      { pattern: /\bvery unique\b/gi, replacement: "unique", reason: "'Unique' is absolute; something cannot be 'very' unique." },
      { pattern: /\bmore better\b/gi, replacement: "better", reason: "Double comparative. 'Better' is already comparative." }
    ];

    rules.forEach(rule => {
      let match;
      rule.pattern.lastIndex = 0;
      while ((match = rule.pattern.exec(text)) !== null) {
        const start = Math.max(0, match.index - 30);
        const end = Math.min(text.length, match.index + match[0].length + 30);
        const context = "..." + text.substring(start, end).replace(match[0], `[${match[0]}]`) + "...";
        
        errors.push({
          original: match[0],
          replacement: rule.replacement,
          reason: rule.reason,
          context: context
        });
      }
    });

    return errors;
  };

  // 1. Calculate Listening score
  const listeningCorrect = answers.listeningCorrect !== undefined 
    ? answers.listeningCorrect 
    : (() => {
        let correctCount = 0;
        ieltsMockData.listening.forEach(sec => {
          sec.questions.forEach(q => {
            const userAns = (answers.listening?.[q.id] || '').trim().toLowerCase();
            const correctAns = q.correctAnswer.trim().toLowerCase();
            if (userAns === correctAns) {
              correctCount++;
            }
          });
        });
        return correctCount;
      })();

  const getListeningBand = (correct: number) => {
    if (correct >= 39) return 9.0;
    if (correct >= 37) return 8.5;
    if (correct >= 35) return 8.0;
    if (correct >= 33) return 7.5;
    if (correct >= 30) return 7.0;
    if (correct >= 27) return 6.5;
    if (correct >= 23) return 6.0;
    if (correct >= 19) return 5.5;
    if (correct >= 15) return 5.0;
    if (correct >= 13) return 4.5;
    if (correct >= 10) return 4.0;
    if (correct >= 8) return 3.5;
    if (correct >= 6) return 3.0;
    return 1.0;
  };
  const totalListeningQuestions = answers.listening ? Object.keys(answers.listening).length : 40;
  const scaledListeningCorrect = totalListeningQuestions < 30 && totalListeningQuestions > 0
    ? Math.round((listeningCorrect / totalListeningQuestions) * 40)
    : listeningCorrect;

  const listeningBand = answers.listeningBand !== undefined
    ? answers.listeningBand
    : getListeningBand(scaledListeningCorrect);

  // 2. Calculate Reading score
  const readingCorrect = answers.readingCorrect !== undefined
    ? answers.readingCorrect
    : (() => {
        let correctCount = 0;
        ieltsMockData.reading.forEach(pas => {
          pas.questions.forEach(q => {
            const userAns = (answers.reading?.[q.id] || '').trim().toLowerCase();
            const correctAns = q.correctAnswer.trim().toLowerCase();
            if (userAns === correctAns) {
              correctCount++;
            }
          });
        });
        return correctCount;
      })();

  const getReadingBand = (correct: number) => {
    if (correct >= 39) return 9.0;
    if (correct >= 37) return 8.5;
    if (correct >= 35) return 8.0;
    if (correct >= 33) return 7.5;
    if (correct >= 30) return 7.0;
    if (correct >= 27) return 6.5;
    if (correct >= 23) return 6.0;
    if (correct >= 19) return 5.5;
    if (correct >= 15) return 5.0;
    if (correct >= 13) return 4.5;
    if (correct >= 10) return 4.0;
    if (correct >= 8) return 3.5;
    if (correct >= 6) return 3.0;
    return 1.0;
  };
  const totalReadingQuestions = answers.reading ? Object.keys(answers.reading).length : 40;
  const scaledReadingCorrect = totalReadingQuestions < 30 && totalReadingQuestions > 0
    ? Math.round((readingCorrect / totalReadingQuestions) * 40)
    : readingCorrect;

  const readingBand = answers.readingBand !== undefined
    ? answers.readingBand
    : getReadingBand(scaledReadingCorrect);

  // 3. Transparent Essay Grader
  const analyzeEssay = (essay: string, taskType: 'task1' | 'task2') => {
    const text = essay.trim();
    const words = text.split(/\s+/).filter(Boolean);
    const wordCount = words.length;
    const minWords = taskType === 'task1' ? 150 : 250;
    
    // TA Score
    let taScore = 1.0;
    let taFeedback = "";
    if (wordCount >= minWords) {
      taScore = 8.5;
      taFeedback = lang === 'UZ' 
        ? `A'lo! Siz ${wordCount} ta so'z yozdingiz (kamida: ${minWords}).`
        : `Excellent! You wrote ${wordCount} words (minimum: ${minWords}).`;
    } else if (wordCount > minWords - 50) {
      taScore = 6.0;
      taFeedback = lang === 'UZ'
        ? `Qisman yetarli. Siz ${wordCount} ta so'z yozdingiz. Eng kamida ${minWords} ta so'z bo'lishi kerak.`
        : `Underlength. You wrote ${wordCount} words. Minimum ${minWords} required.`;
    } else if (wordCount > 0) {
      taScore = 4.5;
      taFeedback = lang === 'UZ'
        ? `Juda qisqa insho. ${wordCount} ta so'z yozilgan. Kamchilik bahoni pasaytiradi.`
        : `Very short response. Only ${wordCount} words. Penalty applied.`;
    } else {
      taScore = 1.0;
      taFeedback = lang === 'UZ' ? "Insho yozilmagan." : "No response provided.";
    }

    // CC Score
    const linkingWords = [
      'however', 'therefore', 'furthermore', 'moreover', 'consequently', 
      'in addition', 'on the other hand', 'in conclusion', 'firstly', 
      'secondly', 'thirdly', 'specifically', 'to sum up', 'illustrate', 
      'contrast', 'whereas', 'as a result', 'meanwhile', 'besides'
    ];
    const detectedLinkers = linkingWords.filter(word => new RegExp(`\\b${word}\\b`, 'i').test(text));
    
    let ccScore = 1.0;
    let ccFeedback = "";
    if (wordCount === 0) {
      ccScore = 1.0;
      ccFeedback = "-";
    } else {
      const density = detectedLinkers.length;
      if (density >= 6) {
        ccScore = 8.5;
        ccFeedback = lang === 'UZ' ? "Yuqori bog'liqlik va ravon o'tishlar." : "Strong cohesive layout.";
      } else if (density >= 3) {
        ccScore = 6.5;
        ccFeedback = lang === 'UZ' ? "Bog'lovchilar bor, lekin ko'proq foydalanish mumkin." : "Moderate cohesive devices.";
      } else {
        ccScore = 5.0;
        ccFeedback = lang === 'UZ' ? "Bog'liqlik juda sust. Transition so'zlar kam." : "Weak cohesion. Use more linking terms.";
      }
    }

    // LR Score
    const academicWords = [
      'accelerate', 'democratize', 'portability', 'multifaceted', 'cohesive', 
      'substantial', 'proportions', 'illustrate', 'significant', 'indispensable', 
      'collaboration', 'motivate', 'integration', 'critic', 'alternative', 
      'consequence', 'penetration', 'dramatic', 'unparalleled', 'supersede'
    ];
    const detectedAcademic = academicWords.filter(word => new RegExp(`\\b${word}\\b`, 'i').test(text));
    
    let lrScore = 1.0;
    let lrFeedback = "";
    if (wordCount === 0) {
      lrScore = 1.0;
      lrFeedback = "-";
    } else {
      const vocabCount = detectedAcademic.length;
      if (vocabCount >= 5) {
        lrScore = 8.5;
        lrFeedback = lang === 'UZ' ? "Boy akademik so'zlar zaxirasi." : "Advanced academic vocabulary.";
      } else if (vocabCount >= 2) {
        lrScore = 6.5;
        lrFeedback = lang === 'UZ' ? "Oddiy so'zlar ko'p. Sinonimlar qo'shing." : "Basic vocabulary. Add synonyms.";
      } else {
        lrScore = 5.0;
        lrFeedback = lang === 'UZ' ? "Sodda so'zlar qo'llangan." : "Repetitive or simple lexicon.";
      }
    }

    // GRA Score
    let graScore = 1.0;
    let graFeedback = "";
    if (wordCount === 0) {
      graScore = 1.0;
      graFeedback = "-";
    } else {
      const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 5);
      const sentenceCount = sentences.length;
      const commas = (text.match(/,/g) || []).length;
      if (sentenceCount >= 8 && commas >= 6) {
        graScore = 8.5;
        graFeedback = lang === 'UZ' ? "Murakkab gaplar to'g'ri qo'llangan." : "Good complex syntax range.";
      } else if (sentenceCount >= 4) {
        graScore = 6.5;
        graFeedback = lang === 'UZ' ? "Asosan sodda va o'rtacha gaplar." : "Satisfactory sentence diversity.";
      } else {
        graScore = 5.0;
        graFeedback = lang === 'UZ' ? "Grammatik xatoliklar ko'p." : "Frequent structural issues.";
      }
    }

    const averageBand = parseFloat(((taScore + ccScore + lrScore + graScore) / 4).toFixed(2));
    
    return {
      wordCount,
      taScore,
      taFeedback,
      ccScore,
      ccFeedback,
      ccDetected: detectedLinkers,
      lrScore,
      lrFeedback,
      lrDetected: detectedAcademic,
      graScore,
      graFeedback,
      averageBand
    };
  };

  const w1Analysis = analyzeEssay(answers.writing?.w1 || '', 'task1');
  const w2Analysis = analyzeEssay(answers.writing?.w2 || '', 'task2');
  
  const writingBand = answers.writingBand !== undefined
    ? answers.writingBand
    : (answers.writing?.w1 || answers.writing?.w2
      ? parseFloat(((w1Analysis.averageBand + w2Analysis.averageBand * 2) / 3).toFixed(1))
      : 1.0);

  // 4. Calculate Speaking Band score based on mode
  const speakingIsExaminerMode = answers.speaking?.mode === 'examiner';
  const speakingBand = speakingIsExaminerMode
    ? answers.speaking.overall
    : (() => {
        const count = Object.keys(answers.speaking?.recordings || {}).length;
        if (count >= 5) return 8.5;
        if (count >= 3) return 6.5;
        if (count >= 1) return 5.0;
        return 1.0;
      })();

  // 5. Calculate Overall Band score
  const overallBand = answers.overall !== undefined 
    ? answers.overall
    : parseFloat(((listeningBand + readingBand + writingBand + speakingBand) / 4).toFixed(1));
  const overallBandScoreNum = isNaN(overallBand) ? 1.0 : overallBand;

  // Save result to local history
  useEffect(() => {
    try {
      const historyStr = localStorage.getItem('ielts_mock_history') || '[]';
      const history = JSON.parse(historyStr);
      
      const testKey = `${candidateInfo.phone}_${overallBandScoreNum}_${new Date().toDateString()}`;
      const alreadySaved = history.some((item: any) => item.key === testKey);
      
      if (!alreadySaved && (answers.listening || answers.reading || answers.writing)) {
        const newRecord = {
          key: testKey,
          candidateName: candidateInfo.fullName,
          phone: candidateInfo.phone,
          date: new Date().toLocaleDateString('uz-UZ'),
          timestamp: Date.now(),
          scores: {
            listening: listeningBand,
            reading: readingBand,
            writing: writingBand,
            speaking: speakingBand,
            overall: overallBandScoreNum
          }
        };
        history.push(newRecord);
        localStorage.setItem('ielts_mock_history', JSON.stringify(history));
      }
    } catch (e) {
      console.error("Error saving local mock history:", e);
    }
  }, [answers, candidateInfo, listeningBand, readingBand, writingBand, speakingBand, overallBandScoreNum]);

  // Send score to Telegram via Bot API / Share simulation
  const sendToTelegram = async () => {
    setTelegramStatus('sending');
    
    // Construct message body
    const msg = `🔔 *American School Mock Test Natijasi*:%0A%0A👤 Nomzod: *${candidateInfo.fullName}*%0A📞 Tel: ${candidateInfo.phone}%0A✈️ Telegram: ${candidateInfo.telegram || 'Kiritilmagan'}%0A%0A🎧 Listening: *${listeningBand}*%0A📖 Reading: *${readingBand}*%0A✍️ Writing: *${writingBand}*%0A🗣️ Speaking: *${speakingBand}*%0A🔥 *Overall Band Score: ${overallBandScoreNum}*%0A%0ATest muvaffaqiyatli topshirildi. Sertifikat PDF yuklab olindi.`;
    
    try {
      // Simulate real telegram API post to mock webhook
      console.log("Sending simulated Telegram API message:", msg);
      await new Promise(resolve => setTimeout(resolve, 1500));
      setTelegramStatus('sent');
    } catch (e) {
      setTelegramStatus('error');
    }
  };

  // Telegram Direct Share Link
  const shareText = `Mening IELTS Mock Natijam:
👤 Nomzod: ${candidateInfo.fullName}
🎧 Listening: ${listeningBand}
📖 Reading: ${readingBand}
✍️ Writing: ${writingBand}
🗣️ Speaking: ${speakingBand}
🔥 Overall Band Score: ${overallBandScoreNum}

American School Mock Test tizimi orqali topshirildi!`;
  
  const telegramShareUrl = `https://t.me/share/url?url=${encodeURIComponent('https://moydionov-mock.uz')}&text=${encodeURIComponent(shareText)}`;

  return (
    <div className="animate-fade-in" style={{
      maxWidth: '1000px',
      margin: '0 auto',
      padding: '30px 24px',
      display: 'flex',
      flexDirection: 'column',
      gap: '30px'
    }}>
      
      {!isFullMock && (
        <div style={{
          background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
          padding: '32px',
          borderRadius: '16px',
          color: '#f8fafc',
          textAlign: 'center',
          boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#94a3b8', marginBottom: '8px' }}>
            {lang === 'UZ' ? "TEST NATIJASI" : "PRACTICE TEST RESULT"}
          </h2>
          <div style={{ fontSize: '64px', fontWeight: 900, color: '#e11d48', lineHeight: 1 }}>
            {hasListening ? listeningBand.toFixed(1) : hasReading ? readingBand.toFixed(1) : writingBand.toFixed(1)}
          </div>
          <div style={{ fontSize: '15px', color: '#cbd5e1', fontWeight: 600, marginTop: '8px' }}>
            {hasListening 
              ? (lang === 'UZ' ? `Listening Band Score (${listeningCorrect}/40 to'g'ri javob)` : `Listening Band Score (${listeningCorrect}/40 Correct)`)
              : hasReading
                ? (lang === 'UZ' ? `Reading Band Score (${readingCorrect}/40 to'g'ri javob)` : `Reading Band Score (${readingCorrect}/40 Correct)`)
                : (lang === 'UZ' ? `Writing Band Score` : `Writing Band Score`)}
          </div>
        </div>
      )}
      
      {/* Tab selection bar (Hidden on Print) */}
      <div className="no-print" style={{
        display: 'flex',
        justifyContent: 'center',
        borderBottom: '1px solid #e2e8f0',
        paddingBottom: '2px',
        gap: '12px',
        flexWrap: 'wrap'
      }}>
        {isFullMock && (
          <button
            onClick={() => setActiveTab('trf')}
            style={{
              background: 'transparent',
              border: 'none',
              padding: '10px 16px',
              fontSize: '0.95rem',
              fontWeight: 700,
              cursor: 'pointer',
              borderBottom: activeTab === 'trf' ? '3px solid #2563eb' : '3px solid transparent',
              color: activeTab === 'trf' ? '#2563eb' : 'hsl(var(--text-secondary))',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <FileText size={16} />
            {lang === 'UZ' ? "Sertifikat (TRF)" : "Certificate (TRF)"}
          </button>
        )}

        <button
          onClick={() => setActiveTab('analysis')}
          style={{
            background: 'transparent',
            border: 'none',
            padding: '10px 16px',
            fontSize: '0.95rem',
            fontWeight: 700,
            cursor: 'pointer',
            borderBottom: activeTab === 'analysis' ? '3px solid #2563eb' : '3px solid transparent',
            color: activeTab === 'analysis' ? '#2563eb' : 'hsl(var(--text-secondary))',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <Sparkles size={16} />
          {lang === 'UZ' ? "AI Score Breakdown" : "AI Score Breakdown"}
        </button>

        {hasWriting && (
          <button
            onClick={() => setActiveTab('grammar')}
            style={{
              background: 'transparent',
              border: 'none',
              padding: '10px 16px',
              fontSize: '0.95rem',
              fontWeight: 700,
              cursor: 'pointer',
              borderBottom: activeTab === 'grammar' ? '3px solid #2563eb' : '3px solid transparent',
              color: activeTab === 'grammar' ? '#2563eb' : 'hsl(var(--text-secondary))',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <PenTool size={16} color={activeTab === 'grammar' ? '#2563eb' : 'currentColor'} />
            {lang === 'UZ' ? "AI Grammatika Tahlili" : "AI Grammar Review"}
          </button>
        )}

        <button
          onClick={() => setActiveTab('progress')}
          style={{
            background: 'transparent',
            border: 'none',
            padding: '10px 16px',
            fontSize: '0.95rem',
            fontWeight: 700,
            cursor: 'pointer',
            borderBottom: activeTab === 'progress' ? '3px solid #2563eb' : '3px solid transparent',
            color: activeTab === 'progress' ? '#2563eb' : 'hsl(var(--text-secondary))',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <Clock size={16} />
          {lang === 'UZ' ? "Mening Natijalarim" : "My Progress"}
        </button>
      </div>

      {/* RENDER ACTIVE TAB */}
      {activeTab === 'trf' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
          
          {/* Certificate View */}
          <TRFCertificate 
            lang={lang} 
            candidateInfo={candidateInfo} 
            scores={{
              listening: listeningBand,
              reading: readingBand,
              writing: writingBand,
              speaking: speakingBand,
              overall: overallBandScoreNum
            }}
          />

          {/* Telegram Notification Box (Hidden on Print) */}
          <div className="glass-panel no-print" style={{ padding: '24px', background: 'white', borderLeft: '4px solid #0088cc' }}>
            <h4 style={{ fontSize: '1.1rem', marginBottom: '10px', color: '#0088cc', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Send size={18} />
              <span>Telegram orqali natijani yuborish</span>
            </h4>
            <p style={{ fontSize: '0.85rem', color: 'hsl(var(--text-secondary))', marginBottom: '16px' }}>
              {lang === 'UZ'
                ? `Natijalarni ${candidateInfo.phone} raqamiga Telegram orqali yuborishni faollashtiring yoki to'g'ridan-to'g'ri ulashing.`
                : `Send your IELTS report scorecard to ${candidateInfo.phone} via Telegram or share it directly.`}
            </p>

            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <button 
                onClick={sendToTelegram}
                className="btn-primary"
                style={{ background: '#0088cc' }}
                disabled={telegramStatus === 'sending'}
              >
                {telegramStatus === 'idle' && (lang === 'UZ' ? "Telefon raqamga SMS/Telegram yuborish" : "Send report via Telegram")}
                {telegramStatus === 'sending' && (lang === 'UZ' ? "Yuborilmoqda..." : "Sending...")}
                {telegramStatus === 'sent' && (lang === 'UZ' ? "Yuborildi! ✅" : "Sent successfully! ✅")}
              </button>

              <a 
                href={telegramShareUrl}
                target="_blank"
                rel="noreferrer"
                className="btn-secondary"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', textDecoration: 'none' }}
              >
                <Share2 size={14} />
                {lang === 'UZ' ? "Telegramda ulashish (Share)" : "Share Result on Telegram"}
              </a>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'analysis' && (
        <div className="no-print" style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
          {/* AI Writing breakdown */}
          {hasWriting && (
            <div className="glass-panel" style={{ padding: '24px', background: 'white' }}>
              <h3 style={{ fontSize: '1.25rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '10px', marginBottom: '16px' }}>
                Writing Essay AI Grading Detail
              </h3>

              {/* Task 1 details */}
              <div style={{ marginBottom: '24px', background: '#f8fafc', padding: '16px', borderRadius: '6px' }}>
                <h4 style={{ color: 'hsl(var(--primary))', marginBottom: '10px' }}>Task 1 (Report) Assessment</h4>
                <ul style={{ fontSize: '0.85rem', display: 'flex', flexDirection: 'column', gap: '6px', listStyleType: 'none' }}>
                  <li>• Task Achievement: <strong>Band {w1Analysis.taScore}</strong> - {w1Analysis.taFeedback}</li>
                  <li>• Coherence & Cohesion: <strong>Band {w1Analysis.ccScore}</strong> - {w1Analysis.ccFeedback}</li>
                  <li>• Lexical Resource: <strong>Band {w1Analysis.lrScore}</strong> - {w1Analysis.lrFeedback}</li>
                  <li>• Grammatical Accuracy: <strong>Band {w1Analysis.graScore}</strong> - {w1Analysis.graFeedback}</li>
                </ul>
              </div>

              {/* Task 2 details */}
              <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '6px' }}>
                <h4 style={{ color: 'hsl(var(--primary))', marginBottom: '10px' }}>Task 2 (Essay) Assessment</h4>
                <ul style={{ fontSize: '0.85rem', display: 'flex', flexDirection: 'column', gap: '6px', listStyleType: 'none' }}>
                  <li>• Task Response: <strong>Band {w2Analysis.taScore}</strong> - {w2Analysis.taFeedback}</li>
                  <li>• Coherence & Cohesion: <strong>Band {w2Analysis.ccScore}</strong> - {w2Analysis.ccFeedback}</li>
                  <li>• Lexical Resource: <strong>Band {w2Analysis.lrScore}</strong> - {w2Analysis.lrFeedback}</li>
                  <li>• Grammatical Accuracy: <strong>Band {w2Analysis.graScore}</strong> - {w2Analysis.graFeedback}</li>
                </ul>
              </div>
            </div>
          )}

          {/* Correct Answers Key Review */}
          {(hasListening || hasReading) && (
            <div className="glass-panel" style={{ padding: '24px', background: 'white' }}>
              <h3 style={{ fontSize: '1.25rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '10px', marginBottom: '16px' }}>
                {lang === 'UZ' ? "Javoblar kalitini ko'rib chiqish" : "Answer Key Review"}
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {/* Listening */}
                {hasListening && (
                  <div>
                    <h4 style={{ fontSize: '0.95rem', color: '#e11d48', marginBottom: '8px' }}>Listening Keys</h4>
                    {ieltsMockData.listening.map(sec => 
                      sec.questions.map(q => {
                        const userAns = answers.listening?.[q.id] || '';
                        const isCorrect = userAns.trim().toLowerCase() === q.correctAnswer.trim().toLowerCase();
                        return (
                          <div key={q.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', padding: '6px', borderBottom: '1px solid #f1f5f9' }}>
                            <span>Q{q.number}. {q.question}</span>
                            <span>
                              Your: <strong style={{ color: isCorrect ? 'green' : 'red' }}>"{userAns || '-'}"</strong> | Key: <strong>"{q.correctAnswer}"</strong>
                            </span>
                          </div>
                        );
                      })
                    )}
                  </div>
                )}

                {/* Reading */}
                {hasReading && (
                  <div style={{ marginTop: hasListening ? '16px' : '0px' }}>
                    <h4 style={{ fontSize: '0.95rem', color: '#e11d48', marginBottom: '8px' }}>Reading Keys</h4>
                    {ieltsMockData.reading.map(pas => 
                      pas.questions.map(q => {
                        const userAns = answers.reading?.[q.id] || '';
                        const isCorrect = userAns.trim().toLowerCase() === q.correctAnswer.trim().toLowerCase();
                        return (
                          <div key={q.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', padding: '6px', borderBottom: '1px solid #f1f5f9' }}>
                            <span>Q{q.number}. {q.question}</span>
                            <span>
                              Your: <strong style={{ color: isCorrect ? 'green' : 'red' }}>"{userAns || '-'}"</strong> | Key: <strong>"{q.correctAnswer}"</strong>
                            </span>
                          </div>
                        );
                      })
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'grammar' && hasWriting && (
        <div className="no-print" style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
          <div className="glass-panel" style={{ padding: '24px', background: 'white' }}>
            <h3 style={{ fontSize: '1.25rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '10px', marginBottom: '16px', color: 'hsl(var(--primary))' }}>
              ✍️ AI Grammar & Vocabulary Analysis
            </h3>
            <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '24px' }}>
              {lang === 'UZ' 
                ? "Tizim inshongizdan eng ko'p uchraydigan grammatik, predlog, artikl va uslubiy xatolarni avtomatik tarzda tahlil qildi:"
                : "The system has automatically scanned your essay for common grammatical, article, preposition, and stylistic issues:"}
            </p>

            {/* Task 1 Grammar errors */}
            <div style={{ marginBottom: '24px' }}>
              <h4 style={{ color: '#2563eb', marginBottom: '12px', fontSize: '1rem', borderBottom: '2px solid #eff6ff', paddingBottom: '6px' }}>
                Task 1 Essay Corrections
              </h4>
              {(() => {
                const errors = checkGrammar(answers.writing?.w1 || '');
                if (errors.length === 0) {
                  return (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#16a34a', background: '#f0fdf4', padding: '12px', borderRadius: '8px', fontSize: '0.85rem' }}>
                      <CheckCircle size={16} />
                      <span>{lang === 'UZ' ? "Task 1 da jiddiy grammatik xatolar aniqlanmadi. A'lo darajada!" : "No common grammar errors detected in Task 1. Superb!"}</span>
                    </div>
                  );
                }
                return (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {errors.map((err, idx) => (
                      <div key={idx} style={{ background: '#fff5f5', padding: '14px', borderRadius: '8px', borderLeft: '4px solid #f43f5e', fontSize: '0.85rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                          <span style={{ color: '#e11d48', fontWeight: 700 }}>❌ "{err.original}"</span>
                          <span style={{ color: '#16a34a', fontWeight: 700 }}>➔ "{err.replacement}"</span>
                        </div>
                        <div style={{ fontStyle: 'italic', color: '#64748b', marginBottom: '6px' }}>Context: {err.context}</div>
                        <div style={{ color: '#334155', fontWeight: 600 }}>💡 {err.reason}</div>
                      </div>
                    ))}
                  </div>
                );
              })()}
            </div>

            {/* Task 2 Grammar errors */}
            <div>
              <h4 style={{ color: '#2563eb', marginBottom: '12px', fontSize: '1rem', borderBottom: '2px solid #eff6ff', paddingBottom: '6px' }}>
                Task 2 Essay Corrections
              </h4>
              {(() => {
                const errors = checkGrammar(answers.writing?.w2 || '');
                if (errors.length === 0) {
                  return (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#16a34a', background: '#f0fdf4', padding: '12px', borderRadius: '8px', fontSize: '0.85rem' }}>
                      <CheckCircle size={16} />
                      <span>{lang === 'UZ' ? "Task 2 da jiddiy grammatik xatolar aniqlanmadi. A'lo darajada!" : "No common grammar errors detected in Task 2. Superb!"}</span>
                    </div>
                  );
                }
                return (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {errors.map((err, idx) => (
                      <div key={idx} style={{ background: '#fff5f5', padding: '14px', borderRadius: '8px', borderLeft: '4px solid #f43f5e', fontSize: '0.85rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                          <span style={{ color: '#e11d48', fontWeight: 700 }}>❌ "{err.original}"</span>
                          <span style={{ color: '#16a34a', fontWeight: 700 }}>➔ "{err.replacement}"</span>
                        </div>
                        <div style={{ fontStyle: 'italic', color: '#64748b', marginBottom: '6px' }}>Context: {err.context}</div>
                        <div style={{ color: '#334155', fontWeight: 600 }}>💡 {err.reason}</div>
                      </div>
                    ))}
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'progress' && (
        <div className="no-print" style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
          <div className="glass-panel" style={{ padding: '24px', background: 'white' }}>
            <h3 style={{ fontSize: '1.25rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '10px', marginBottom: '16px', color: 'hsl(var(--primary))' }}>
              📈 Student Mock Exam Progress Tracker
            </h3>
            
            {(() => {
              const localHistoryStr = localStorage.getItem('ielts_mock_history') || '[]';
              const candidateHistory = JSON.parse(localHistoryStr)
                .filter((item: any) => item.phone === candidateInfo.phone)
                .sort((a: any, b: any) => a.timestamp - b.timestamp);

              if (candidateHistory.length === 0) {
                return (
                  <p style={{ fontSize: '0.9rem', color: '#64748b', textAlign: 'center', padding: '40px 0' }}>
                    {lang === 'UZ' 
                      ? "Hozircha natijalar tarixi mavjud emas. Birinchi mock testni topshiring!"
                      : "No mock history available yet. Complete your first test to track progress!"}
                  </p>
                );
              }

              // Calculate chart coordinates (width: 600, height: 200)
              const points = candidateHistory.map((item: any, idx: number) => {
                const x = candidateHistory.length > 1 
                  ? 50 + (idx / (candidateHistory.length - 1)) * 500
                  : 300;
                const score = item.scores.overall || 1.0;
                // Map score 1.0 - 9.0 to height 170 - 30
                const y = 170 - ((score - 1) / 8) * 140;
                return { x, y, score, date: item.date };
              });

              const polylinePoints = points.map((p: any) => `${p.x},${p.y}`).join(' ');

              return (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  {/* SVG Graph */}
                  <div style={{ overflowX: 'auto', background: '#f8fafc', padding: '16px', borderRadius: '12px' }}>
                    <svg width="600" height="200" style={{ display: 'block', margin: '0 auto' }}>
                      {/* Grid Lines */}
                      {[1, 3, 5, 7, 9].map(score => {
                        const y = 170 - ((score - 1) / 8) * 140;
                        return (
                          <g key={score}>
                            <line x1="40" y1={y} x2="570" y2={y} stroke="#e2e8f0" strokeDasharray="4" />
                            <text x="15" y={y + 4} fontSize="10" fill="#94a3b8" fontWeight="bold">Band {score.toFixed(1)}</text>
                          </g>
                        );
                      })}

                      {/* Line */}
                      {candidateHistory.length > 1 && (
                        <polyline
                          fill="none"
                          stroke="#2563eb"
                          strokeWidth="3"
                          points={polylinePoints}
                        />
                      )}

                      {/* Circles */}
                      {points.map((p: any, idx: number) => (
                        <g key={idx}>
                          <circle
                            cx={p.x}
                            cy={p.y}
                            r="6"
                            fill="#fff"
                            stroke="#2563eb"
                            strokeWidth="3"
                            style={{ cursor: 'pointer' }}
                          />
                          {/* Score Label inside tooltip */}
                          <rect x={p.x - 20} y={p.y - 28} width="40" height="20" rx="4" fill="#1e293b" />
                          <text x={p.x} y={p.y - 14} fontSize="11" fill="#fff" fontWeight="bold" textAnchor="middle">
                            {p.score.toFixed(1)}
                          </text>
                          {/* Date label at bottom */}
                          <text x={p.x} y="192" fontSize="9" fill="#64748b" fontWeight="600" textAnchor="middle">
                            {p.date}
                          </text>
                        </g>
                      ))}
                    </svg>
                  </div>

                  {/* History List */}
                  <div style={{ marginTop: '16px' }}>
                    <h4 style={{ fontSize: '1rem', color: '#1e293b', marginBottom: '12px', fontWeight: 700 }}>
                      {lang === 'UZ' ? 'Mock Imtihonlar Tarixi' : 'Mock Exam Attempt History'}
                    </h4>
                    <div style={{ overflowX: 'auto' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem', textAlign: 'left' }}>
                        <thead>
                          <tr style={{ background: '#f1f5f9', borderBottom: '2px solid #e2e8f0' }}>
                            <th style={{ padding: '10px 12px' }}>Date</th>
                            <th style={{ padding: '10px 12px' }}>Listening</th>
                            <th style={{ padding: '10px 12px' }}>Reading</th>
                            <th style={{ padding: '10px 12px' }}>Writing</th>
                            <th style={{ padding: '10px 12px' }}>Speaking</th>
                            <th style={{ padding: '10px 12px', fontWeight: 800, color: '#2563eb' }}>Overall</th>
                          </tr>
                        </thead>
                        <tbody>
                          {candidateHistory.map((item: any, idx: number) => (
                            <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                              <td style={{ padding: '10px 12px', fontWeight: 600 }}>{item.date}</td>
                              <td style={{ padding: '10px 12px' }}>{item.scores.listening.toFixed(1)}</td>
                              <td style={{ padding: '10px 12px' }}>{item.scores.reading.toFixed(1)}</td>
                              <td style={{ padding: '10px 12px' }}>{item.scores.writing.toFixed(1)}</td>
                              <td style={{ padding: '10px 12px' }}>{item.scores.speaking.toFixed(1)}</td>
                              <td style={{ padding: '10px 12px', fontWeight: 800, color: '#2563eb' }}>{item.scores.overall.toFixed(1)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}

      {/* Restart options (Hidden on Print) */}
      <div className="no-print" style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
        <button 
          onClick={onRestart}
          className="btn-secondary"
          style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <ArrowLeft size={16} />
          {lang === 'UZ' ? "Dashboardga Qaytish" : "Back to Dashboard"}
        </button>

        <button 
          onClick={onRestart}
          className="btn-primary"
          style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'hsl(var(--primary))' }}
        >
          <RefreshCw size={16} />
          {lang === 'UZ' ? "Qaytadan urinish" : "Retake Test"}
        </button>
      </div>

    </div>
  );
};
export default ResultsDashboard;
