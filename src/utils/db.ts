export interface Candidate {
  id: string;
  fullName: string;
  phone: string;
  telegram: string;
  registeredAt: string;
}

export interface TestResult {
  id: string;
  phone: string;
  candidateName: string;
  testType: string;
  testTitle: string;
  scores: {
    listening?: number;
    reading?: number;
    writing?: number;
    speaking?: number;
    overall: number;
  };
  date: string;
}

export interface TelegramConfig {
  botToken: string;
  chatId: string;
}

const CANDIDATES_KEY = 'american_school_candidates';
const RESULTS_KEY = 'american_school_results';
const CONFIG_KEY = 'american_school_telegram_config';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

export const db = {
  // Candidate Database
  saveCandidate: (fullName: string, phone: string, telegram: string): Candidate => {
    const candidates = db.getCandidates();
    
    // Check if candidate already exists by phone
    const existing = candidates.find(c => c.phone === phone);
    let newCandidate: Candidate;

    if (existing) {
      if (existing.telegram !== telegram || existing.fullName !== fullName) {
        existing.telegram = telegram;
        existing.fullName = fullName;
        localStorage.setItem(CANDIDATES_KEY, JSON.stringify(candidates));
      }
      newCandidate = existing;
    } else {
      newCandidate = {
        id: 'CAND_' + Math.floor(100000 + Math.random() * 900000),
        fullName,
        phone,
        telegram,
        registeredAt: new Date().toISOString()
      };
      candidates.push(newCandidate);
      localStorage.setItem(CANDIDATES_KEY, JSON.stringify(candidates));
    }

    // Sync to backend API asynchronously
    fetch(`${API_URL}/api/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fullName, phone, telegram })
    }).catch(err => console.warn("Backend Sync Failed (Offline/Local Mode):", err));

    return newCandidate;
  },

  getCandidates: (): Candidate[] => {
    const data = localStorage.getItem(CANDIDATES_KEY);
    return data ? JSON.parse(data) : [];
  },

  // Results Database
  saveResult: (phone: string, candidateName: string, testType: string, testTitle: string, scores: any): TestResult => {
    const results = db.getResults();
    const newResult: TestResult = {
      id: 'RES_' + Math.floor(100000 + Math.random() * 900000),
      phone,
      candidateName,
      testType,
      testTitle,
      scores,
      date: new Date().toISOString()
    };
    results.push(newResult);
    localStorage.setItem(RESULTS_KEY, JSON.stringify(results));

    // Sync to backend API asynchronously
    fetch(`${API_URL}/api/result`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone, candidateName, testType, testTitle, scores })
    }).catch(err => console.warn("Backend Sync Failed (Offline/Local Mode):", err));

    return newResult;
  },

  getResults: (): TestResult[] => {
    const data = localStorage.getItem(RESULTS_KEY);
    return data ? JSON.parse(data) : [];
  },

  // Telegram settings config
  saveConfig: (botToken: string, chatId: string): void => {
    const config: TelegramConfig = { botToken, chatId };
    localStorage.setItem(CONFIG_KEY, JSON.stringify(config));
  },

  getConfig: (): TelegramConfig => {
    const data = localStorage.getItem(CONFIG_KEY);
    const defaultConfig = { 
      botToken: '8783518807:AAEd4t8OtZqQXDpGqtaM1NsgyGcQuobZH3Y', 
      chatId: '6241470340' 
    };
    if (!data) return defaultConfig;
    try {
      const parsed = JSON.parse(data);
      return {
        botToken: parsed.botToken || defaultConfig.botToken,
        chatId: parsed.chatId || defaultConfig.chatId
      };
    } catch {
      return defaultConfig;
    }
  }
};
