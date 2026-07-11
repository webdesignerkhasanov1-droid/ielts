import { db } from './db';

export const telegramService = {
  /**
   * Sends a formatted test result card to the configured Telegram bot/channel.
   */
  sendTestResult: async (
    candidateName: string,
    phone: string,
    telegramHandle: string,
    testTitle: string,
    scores: {
      listening: number;
      reading: number;
      writing: number;
      speaking: number;
      overall: number;
    }
  ): Promise<{ success: boolean; error?: string }> => {
    const { botToken, chatId } = db.getConfig();
    
    if (!botToken || !chatId) {
      console.warn("Telegram bot token or chatId is not configured. Skipping notification.");
      return { success: false, error: "Bot config missing" };
    }

    const message = `
🔔 *NEW EXAM RESULT* (American School Mock)

👤 *Candidate:* ${candidateName}
📞 *Phone:* \`${phone}\`
✈️ *Telegram:* ${telegramHandle}
📚 *Test:* ${testTitle}
📅 *Date:* ${new Date().toLocaleDateString('en-US')}

📊 *RESULTS (BAND SCORES):*
🎧 *Listening:* ${scores.listening.toFixed(1)}
📖 *Reading:* ${scores.reading.toFixed(1)}
✍️ *Writing:* ${scores.writing.toFixed(1)}
🗣️ *Speaking:* ${scores.speaking.toFixed(1)}

⭐ *OVERALL BAND SCORE:* *${scores.overall.toFixed(1)}*

---
🏫 *American School IELTS Mock Portal*
`;

    try {
      const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          chat_id: chatId,
          text: message,
          parse_mode: 'Markdown'
        })
      });

      const data = await response.json();
      if (!data.ok) {
        throw new Error(data.description || "Failed to send message to Telegram");
      }
      return { success: true };
    } catch (err: any) {
      console.error("Telegram API Error:", err);
      return { success: false, error: err.message || "Network error" };
    }
  },

  /**
   * Test connection function for the configuration dashboard
   */
  testConnection: async (token: string, chatId: string): Promise<{ success: boolean; error?: string }> => {
    const message = `⚙️ *American School Mock:* Telegram bot connection successfully verified!`;
    
    try {
      const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          chat_id: chatId,
          text: message,
          parse_mode: 'Markdown'
        })
      });

      const data = await response.json();
      if (!data.ok) {
        throw new Error(data.description || "Invalid Chat ID or Bot Token");
      }
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || "Connection failed" };
    }
  }
};
