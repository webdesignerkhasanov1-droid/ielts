import React, { useState, useEffect } from 'react';
import { ArrowLeft, Save, Shield, Users, Trophy, Settings, Send, CheckCircle } from 'lucide-react';
import { db } from '../utils/db';
import type { Candidate, TestResult } from '../utils/db';
import { telegramService } from '../utils/telegram';

interface AdminPortalProps {
  lang: 'UZ' | 'EN';
  onBack: () => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({ lang, onBack }) => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [results, setResults] = useState<TestResult[]>([]);
  const [botToken, setBotToken] = useState('');
  const [chatId, setChatId] = useState('');
  
  // Tab control
  const [activeTab, setActiveTab] = useState<'candidates' | 'results' | 'telegram'>('candidates');
  
  // Notification status
  const [testStatus, setTestStatus] = useState<{ type: 'idle' | 'success' | 'error'; message: string }>({ type: 'idle', message: '' });
  const [saveStatus, setSaveStatus] = useState(false);
  const [speakingScores, setSpeakingScores] = useState<Record<string, number>>({});
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // Load results from backend to get fresh data
  const loadData = () => {
    // Local storage load first
    setCandidates(db.getCandidates());
    setResults(db.getResults());

    // Fetch from backend to sync fresh database
    fetch('/api/results')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setResults(data);
        }
      })
      .catch(err => console.warn("Failed to fetch fresh results from backend:", err));

    fetch('/api/candidates')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setCandidates(data);
        }
      })
      .catch(err => console.warn("Failed to fetch fresh candidates from backend:", err));
  };

  useEffect(() => {
    loadData();
    const config = db.getConfig();
    setBotToken(config.botToken);
    setChatId(config.chatId);
  }, []);

  const handleUpdateSpeaking = async (resultId: string, speakingVal: number) => {
    if (!speakingVal) return;
    setUpdatingId(resultId);
    
    try {
      const response = await fetch('/api/result/update-speaking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resultId, speaking: speakingVal })
      });
      const data = await response.json();
      if (response.ok) {
        alert(lang === 'UZ' ? "Speaking balli muvaffaqiyatli saqlandi va Telegram bot orqali nomzodga yuborildi! ✅" : "Speaking score saved and sent to candidate via Telegram Bot! ✅");
        
        // Sync local storage results
        const localResults = db.getResults();
        const updatedIdx = localResults.findIndex(r => r.id === resultId);
        if (updatedIdx !== -1) {
          localResults[updatedIdx].scores.speaking = speakingVal;
          // Recalculate overall
          const s = localResults[updatedIdx].scores;
          const avg = ((s.listening || 0) + (s.reading || 0) + (s.writing || 0) + speakingVal) / 4;
          // Rounded to nearest 0.5
          const rounded = Math.round(avg * 2) / 2;
          localResults[updatedIdx].scores.overall = rounded;
          localStorage.setItem('american_school_results', JSON.stringify(localResults));
        }

        loadData(); // reload
      } else {
        alert(`Xatolik: ${data.error || "Yangilashda xato"}`);
      }
    } catch (e: any) {
      alert(`Network Error: ${e.message}`);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    db.saveConfig(botToken, chatId);
    setSaveStatus(true);
    setTimeout(() => setSaveStatus(false), 2000);
  };

  const handleTestTelegram = async () => {
    if (!botToken || !chatId) {
      setTestStatus({ type: 'error', message: lang === 'UZ' ? "Token va Chat ID majburiy!" : "Token and Chat ID are required!" });
      return;
    }

    setTestStatus({ type: 'idle', message: lang === 'UZ' ? "Yuborilmoqda..." : "Sending..." });
    
    const res = await telegramService.testConnection(botToken, chatId);
    if (res.success) {
      setTestStatus({
        type: 'success',
        message: lang === 'UZ' ? "Muvaffaqiyatli yuborildi! Telegramni tekshiring." : "Sent successfully! Check your Telegram."
      });
    } else {
      setTestStatus({
        type: 'error',
        message: lang === 'UZ' ? `Xatolik: ${res.error}` : `Error: ${res.error}`
      });
    }
  };

  const handleClearDatabase = () => {
    if (window.confirm(lang === 'UZ' ? "Haqiqatdan ham barcha ma'lumotlarni o'chirmoqchimisiz?" : "Are you sure you want to clear all data?")) {
      localStorage.removeItem('american_school_candidates');
      localStorage.removeItem('american_school_results');
      setCandidates([]);
      setResults([]);
    }
  };

  return (
    <div className="animate-fade-in" style={{
      maxWidth: '1000px',
      margin: '0 auto',
      padding: '40px 24px',
      display: 'flex',
      flexDirection: 'column',
      gap: '24px'
    }}>
      
      {/* Header bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0', paddingBottom: '15px' }}>
        <button onClick={onBack} className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <ArrowLeft size={16} />
          {lang === 'UZ' ? "Orqaga" : "Back"}
        </button>

        <h3 style={{ fontSize: '1.4rem', color: '#0b2265', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Shield size={22} color="#108b58" />
          <span>{lang === 'UZ' ? "Admin Boshqaruv Paneli" : "Admin Dashboard"}</span>
        </h3>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '10px', background: '#f1f5f9', padding: '6px', borderRadius: '12px' }}>
        <button
          onClick={() => setActiveTab('candidates')}
          style={{
            flex: 1, padding: '10px', borderRadius: '8px', border: 'none',
            background: activeTab === 'candidates' ? '#ffffff' : 'transparent',
            color: activeTab === 'candidates' ? '#0b2265' : '#64748b',
            fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
            boxShadow: activeTab === 'candidates' ? '0 2px 8px rgba(0,0,0,0.05)' : 'none',
            transition: 'all 0.2s'
          }}
        >
          <Users size={16} />
          {lang === 'UZ' ? "Nomzodlar" : "Candidates"} ({candidates.length})
        </button>
        <button
          onClick={() => setActiveTab('results')}
          style={{
            flex: 1, padding: '10px', borderRadius: '8px', border: 'none',
            background: activeTab === 'results' ? '#ffffff' : 'transparent',
            color: activeTab === 'results' ? '#0b2265' : '#64748b',
            fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
            boxShadow: activeTab === 'results' ? '0 2px 8px rgba(0,0,0,0.05)' : 'none',
            transition: 'all 0.2s'
          }}
        >
          <Trophy size={16} />
          {lang === 'UZ' ? "Natijalar" : "Results"} ({results.length})
        </button>
        <button
          onClick={() => setActiveTab('telegram')}
          style={{
            flex: 1, padding: '10px', borderRadius: '8px', border: 'none',
            background: activeTab === 'telegram' ? '#ffffff' : 'transparent',
            color: activeTab === 'telegram' ? '#0b2265' : '#64748b',
            fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
            boxShadow: activeTab === 'telegram' ? '0 2px 8px rgba(0,0,0,0.05)' : 'none',
            transition: 'all 0.2s'
          }}
        >
          <Settings size={16} />
          Telegram Bot
        </button>
      </div>

      {/* TAB 1: CANDIDATES LIST */}
      {activeTab === 'candidates' && (
        <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h4 style={{ fontSize: '1.1rem', margin: 0, fontWeight: 700, color: '#1e293b' }}>
              {lang === 'UZ' ? "Ro'yxatdan o'tgan nomzodlar" : "Registered Candidates"}
            </h4>
            <button onClick={handleClearDatabase} className="btn-secondary" style={{ color: '#ef4444', borderColor: '#fee2e2' }}>
              🗑️ {lang === 'UZ' ? "Bazani Tozalash" : "Clear Database"}
            </button>
          </div>

          {candidates.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>
              {lang === 'UZ' ? "Hozircha nomzodlar ro'yxatdan o'tmadi." : "No candidates registered yet."}
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #e2e8f0', color: '#64748b', fontWeight: 600 }}>
                    <th style={{ padding: '12px 8px' }}>ID</th>
                    <th style={{ padding: '12px 8px' }}>Name</th>
                    <th style={{ padding: '12px 8px' }}>Phone Number</th>
                    <th style={{ padding: '12px 8px' }}>Telegram</th>
                    <th style={{ padding: '12px 8px' }}>Registered At</th>
                  </tr>
                </thead>
                <tbody>
                  {candidates.map((c) => (
                    <tr key={c.id} style={{ borderBottom: '1px solid #f1f5f9', color: '#334155' }}>
                      <td style={{ padding: '12px 8px', fontWeight: 700, color: '#64748b' }}>{c.id}</td>
                      <td style={{ padding: '12px 8px', fontWeight: 600 }}>{c.fullName}</td>
                      <td style={{ padding: '12px 8px', fontFamily: 'monospace', fontWeight: 700 }}>{c.phone}</td>
                      <td style={{ padding: '12px 8px', color: '#108b58', fontWeight: 600 }}>{c.telegram}</td>
                      <td style={{ padding: '12px 8px', color: '#64748b', fontSize: '12px' }}>
                        {new Date(c.registeredAt).toLocaleString('uz-UZ')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: TEST RESULTS LIST */}
      {activeTab === 'results' && (
        <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h4 style={{ fontSize: '1.1rem', margin: 0, fontWeight: 700, color: '#1e293b' }}>
            {lang === 'UZ' ? "Imtihon natijalari tarixi" : "Test Results History"}
          </h4>

          {results.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>
              {lang === 'UZ' ? "Hozircha natijalar mavjud emas." : "No test results recorded yet."}
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #e2e8f0', color: '#64748b', fontWeight: 600 }}>
                    <th style={{ padding: '12px 8px' }}>Candidate Name</th>
                    <th style={{ padding: '12px 8px' }}>Test Type</th>
                    <th style={{ padding: '12px 8px' }}>Test Title</th>
                    <th style={{ padding: '12px 8px' }}>Scores (L/R/W/S)</th>
                    <th style={{ padding: '12px 8px' }}>Overall</th>
                    <th style={{ padding: '12px 8px' }}>Date</th>
                    <th style={{ padding: '12px 8px', textAlign: 'center' }}>Evaluate Speaking</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((r) => {
                    const speakingVal = r.scores.speaking || 0;
                    const selectedSpeaking = speakingScores[r.id] || speakingVal || 0;

                    return (
                      <tr key={r.id} style={{ borderBottom: '1px solid #f1f5f9', color: '#334155' }}>
                        <td style={{ padding: '12px 8px', fontWeight: 600 }}>{r.candidateName}</td>
                        <td style={{ padding: '12px 8px', textTransform: 'uppercase', fontWeight: 700, fontSize: '11px', color: '#108b58' }}>
                          {r.testType}
                        </td>
                        <td style={{ padding: '12px 8px', fontSize: '13px' }}>{r.testTitle}</td>
                        <td style={{ padding: '12px 8px', fontFamily: 'monospace' }}>
                          L: {r.scores.listening?.toFixed(1) || '-'} | R: {r.scores.reading?.toFixed(1) || '-'} | W: {r.scores.writing?.toFixed(1) || '-'} | S: {speakingVal > 0 ? speakingVal.toFixed(1) : <span style={{ color: '#dc2626', fontWeight: 700 }}>Pending ⚠️</span>}
                        </td>
                        <td style={{ padding: '12px 8px', fontWeight: 800, color: '#0b2265', fontSize: '15px' }}>
                          {speakingVal > 0 && r.scores.overall > 0 ? r.scores.overall.toFixed(1) : <span style={{ color: '#64748b', fontWeight: 500 }}>-</span>}
                        </td>
                        <td style={{ padding: '12px 8px', color: '#64748b', fontSize: '12px' }}>
                          {new Date(r.date).toLocaleString('uz-UZ')}
                        </td>
                        <td style={{ padding: '12px 8px', textAlign: 'center' }}>
                          <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', alignItems: 'center' }}>
                            <select
                              value={selectedSpeaking}
                              onChange={(e) => setSpeakingScores(prev => ({ ...prev, [r.id]: parseFloat(e.target.value) }))}
                              style={{ padding: '6px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px', background: '#fff' }}
                            >
                              <option value="0">Select Band</option>
                              {[1.0, 1.5, 2.0, 2.5, 3.0, 3.5, 4.0, 4.5, 5.0, 5.5, 6.0, 6.5, 7.0, 7.5, 8.0, 8.5, 9.0].map(val => (
                                <option key={val} value={val}>{val.toFixed(1)}</option>
                              ))}
                            </select>
                            <button
                              onClick={() => handleUpdateSpeaking(r.id, selectedSpeaking)}
                              disabled={selectedSpeaking === 0 || updatingId === r.id}
                              style={{
                                padding: '6px 12px', background: '#108b58', color: '#fff', border: 'none', borderRadius: '6px',
                                fontSize: '12px', fontWeight: 700, cursor: speakingVal === selectedSpeaking ? 'default' : 'pointer',
                                opacity: (selectedSpeaking === 0 || updatingId === r.id) ? 0.5 : 1,
                                display: 'flex', alignItems: 'center', gap: '4px'
                              }}
                            >
                              {updatingId === r.id ? '...' : (speakingVal > 0 ? 'Update & Send' : 'Save & Send')}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: TELEGRAM BOT CONFIG */}
      {activeTab === 'telegram' && (
        <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <h4 style={{ fontSize: '1.1rem', margin: '0 0 6px', fontWeight: 700, color: '#1e293b' }}>
              🤖 Telegram Bot va Kanal Sozlamalari
            </h4>
            <p style={{ color: '#64748b', fontSize: '13px', margin: 0 }}>
              Nomzodlar testni tugatganida, natijalar avtomatik ravishda belgilangan chat yoki kanalga yuborilishi uchun bot ma'lumotlarini kiriting.
            </p>
          </div>

          <form onSubmit={handleSaveConfig} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '13px', fontWeight: 700, color: '#475569' }}>
                Telegram Bot Token
              </label>
              <input
                type="text"
                value={botToken}
                onChange={(e) => setBotToken(e.target.value)}
                placeholder="Masalan: 7492840293:AAHfdks83724..."
                style={{
                  padding: '12px', border: '1px solid #cbd5e1', borderRadius: '10px',
                  fontSize: '14px', fontFamily: 'monospace'
                }}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '13px', fontWeight: 700, color: '#475569' }}>
                Telegram Chat ID (Guruh/Kanal yoki Shaxsiy ID)
              </label>
              <input
                type="text"
                value={chatId}
                onChange={(e) => setChatId(e.target.value)}
                placeholder="Masalan: -100194829482 yoki 59382049"
                style={{
                  padding: '12px', border: '1px solid #cbd5e1', borderRadius: '10px',
                  fontSize: '14px', fontFamily: 'monospace'
                }}
              />
              <span style={{ fontSize: '11px', color: '#94a3b8' }}>
                Kanal yoki guruhga yuborish uchun ID doimo minus (-) belgisi bilan boshlanishi shart (masalan -100 bilan).
              </span>
            </div>

            <div style={{ display: 'flex', gap: '12px', marginTop: '10px' }}>
              <button
                type="submit"
                className="btn-primary"
                style={{
                  background: '#108b58', border: 'none', borderRadius: '10px',
                  padding: '12px 24px', fontWeight: 700, fontSize: '14px',
                  cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px'
                }}
              >
                <Save size={16} />
                {lang === 'UZ' ? "Sozlamalarni Saqlash" : "Save Config"}
              </button>

              <button
                type="button"
                onClick={handleTestTelegram}
                className="btn-secondary"
                style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <Send size={16} />
                {lang === 'UZ' ? "Ulanishni Tekshirish" : "Test Connection"}
              </button>
            </div>
          </form>

          {/* Connection status notification */}
          {testStatus.message && (
            <div style={{
              padding: '12px', borderRadius: '8px', fontSize: '14px', fontWeight: 600,
              background: testStatus.type === 'success' ? '#dcfce7' : testStatus.type === 'error' ? '#fee2e2' : '#f1f5f9',
              color: testStatus.type === 'success' ? '#16a34a' : testStatus.type === 'error' ? '#dc2626' : '#475569',
              border: `1px solid ${testStatus.type === 'success' ? '#bbf7d0' : testStatus.type === 'error' ? '#fecaca' : '#cbd5e1'}`
            }}>
              {testStatus.message}
            </div>
          )}

          {saveStatus && (
            <div style={{
              padding: '12px', borderRadius: '8px', fontSize: '14px', fontWeight: 600,
              background: '#dcfce7', color: '#16a34a', border: '1px solid #bbf7d0',
              display: 'flex', alignItems: 'center', gap: '8px'
            }}>
              <CheckCircle size={16} />
              {lang === 'UZ' ? "Sozlamalar muvaffaqiyatli saqlandi!" : "Settings saved successfully!"}
            </div>
          )}
        </div>
      )}

    </div>
  );
};
export default AdminPortal;
