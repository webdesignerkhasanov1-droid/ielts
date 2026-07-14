const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');
const { Jimp, loadFont } = require('jimp');
const { SANS_16_BLACK, SANS_32_BLACK } = require('jimp/fonts');

const PORT = process.env.PORT || 5001;
const DB_FILE = path.join(__dirname, 'database.json');
const BOT_TOKEN = '8783518807:AAEd4t8OtZqQXDpGqtaM1NsgyGcQuobZH3Y';

// Helper to read/write JSON database
const readDB = () => {
  if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify({ candidates: [], results: [] }, null, 2));
  }
  try {
    return JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
  } catch (e) {
    return { candidates: [], results: [] };
  }
};

const writeDB = (data) => {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
};

// Clean phone numbers to compare (keep only digits)
const cleanPhone = (phone) => {
  if (!phone) return '';
  return phone.replace(/\D/g, '');
};

// ── IMAGE DRAWING HELPERS FOR TRF GENERATION ──
const drawHLine = (image, x, y, length, thickness, color) => {
  for (let t = 0; t < thickness; t++) {
    for (let i = 0; i < length; i++) {
      image.setPixelColor(color, x + i, y + t);
    }
  }
};

const drawVLine = (image, x, y, length, thickness, color) => {
  for (let t = 0; t < thickness; t++) {
    for (let i = 0; i < length; i++) {
      image.setPixelColor(color, x + t, y + i);
    }
  }
};

const drawRect = (image, x, y, w, h, color) => {
  for (let i = 0; i < w; i++) {
    for (let j = 0; j < h; j++) {
      image.setPixelColor(color, x + i, y + j);
    }
  }
};

// Bresenham's line algorithm with thickness
const drawLine = (image, x0, y0, x1, y1, thickness, color) => {
  const dx = Math.abs(x1 - x0);
  const dy = Math.abs(y1 - y0);
  const sx = (x0 < x1) ? 1 : -1;
  const sy = (y0 < y1) ? 1 : -1;
  let err = dx - dy;

  let x = x0;
  let y = y0;

  while (true) {
    const radius = Math.floor(thickness / 2);
    for (let tx = -radius; tx <= radius; tx++) {
      for (let ty = -radius; ty <= radius; ty++) {
        image.setPixelColor(color, x + tx, y + ty);
      }
    }

    if (x === x1 && y === y1) break;
    const e2 = 2 * err;
    if (e2 > -dy) {
      err -= dy;
      x += sx;
    }
    if (e2 < dx) {
      err += dx;
      y += sy;
    }
  }
};

// Draw the real American School Monogram Logo (A + S)
const drawAmericanSchoolLogo = (image, x, y, size, navyColor, greenColor) => {
  // 1. Draw outer rounded square (white fill, navy border)
  drawRect(image, x, y, size, size, 0xFFFFFFFF); // White background
  drawHLine(image, x, y, size, 3, navyColor); // Top
  drawHLine(image, x, y + size - 3, size, 3, navyColor); // Bottom
  drawVLine(image, x, y, size, 3, navyColor); // Left
  drawVLine(image, x + size - 3, y, size, 3, navyColor); // Right

  // 2. Draw 'A' Triangle legs (Navy)
  const peakX = Math.floor(x + size / 2);
  const peakY = y + 16;
  const leftX = x + 20;
  const rightX = x + size - 20;
  const bottomY = y + 62;

  // Left Leg
  drawLine(image, peakX, peakY, leftX, bottomY, 4, navyColor);
  // Right Leg
  drawLine(image, peakX, peakY, rightX, bottomY, 4, navyColor);
  // Peak cap
  drawLine(image, peakX - 2, peakY, peakX + 2, peakY, 4, navyColor);

  // 3. Draw 'S' Monogram inside (Green)
  const sLeftX = x + 32;
  const sRightX = x + size - 32;
  const sTopY = y + 36;
  const sMidY = y + 46;
  const sBotY = y + 56;

  drawLine(image, sLeftX, sTopY, sRightX, sTopY, 3.5, greenColor); // Top horizontal
  drawLine(image, sLeftX, sTopY, sLeftX, sMidY, 3.5, greenColor); // Left vertical
  drawLine(image, sLeftX, sMidY, sRightX, sMidY, 3.5, greenColor); // Middle horizontal
  drawLine(image, sRightX, sMidY, sRightX, sBotY, 3.5, greenColor); // Right vertical
  drawLine(image, sLeftX, sBotY, sRightX, sBotY, 3.5, greenColor); // Bottom horizontal

  // 4. Draw Green Bottom Bar
  drawLine(image, x + 12, y + 67, x + size - 12, y + 67, 3.5, greenColor);

  // 5. Draw Navy Text Box at the bottom
  drawRect(image, x + 10, y + 73, size - 20, 10, navyColor);
  drawHLine(image, x + 15, y + 77, size - 30, 2, 0xFFFFFFFF);
};

// Generate high fidelity TRF certificate image
const generateTRFImage = async (candidateName, phone, date, scores, outputPath) => {
  const image = new Jimp({ width: 800, height: 600, color: 0xFFFFFFFF });

  const navyColor = 0x0B2265FF;
  const greenColor = 0x108B58FF;

  // 1. Composite academic pattern background first for watermarked premium look
  try {
    const bgPath = path.join(__dirname, 'public', 'bg_academic_pattern.png');
    if (fs.existsSync(bgPath)) {
      const bgImage = await Jimp.read(bgPath);
      bgImage.resize({ w: 800, h: 600 });
      image.composite(bgImage, 0, 0);
    }
  } catch (err) {
    console.warn("Failed to load background pattern watermark:", err);
  }

  // 2. Draw Borders
  drawHLine(image, 15, 15, 770, 5, navyColor); // Top
  drawHLine(image, 15, 580, 770, 5, navyColor); // Bottom
  drawVLine(image, 15, 15, 570, 5, navyColor); // Left
  drawVLine(image, 780, 15, 570, 5, navyColor); // Right

  drawHLine(image, 23, 23, 754, 2, greenColor); // Top
  drawHLine(image, 23, 575, 754, 2, greenColor); // Bottom
  drawVLine(image, 23, 23, 554, 2, greenColor); // Left
  drawVLine(image, 775, 23, 554, 2, greenColor); // Right

  // 3. Load Fonts
  const font32 = await loadFont(SANS_32_BLACK);
  const font16 = await loadFont(SANS_16_BLACK);

  // 4. Load and Composite the Transparent HD Logo Image (preserving 16:9 aspect ratio)
  // 4. Load and Composite the Cropped HD Logo Image (preserving aspect ratio, margins trimmed)
  try {
    const logoPath = path.join(__dirname, 'public', 'logo_cropped.png');
    const logoImage = await Jimp.read(logoPath);
    logoImage.resize({ w: 160, h: 102 });
    image.composite(logoImage, 50, 35);
  } catch (err) {
    console.error("Failed to load logo image in Jimp, falling back to basic drawing:", err);
    // Draw fallback basic border if image fails to load
    drawRect(image, 50, 35, 160, 102, navyColor);
  }

  image.print({ font: font32, x: 230, y: 50, text: "AMERICAN MOCK TESTING" });
  image.print({ font: font16, x: 230, y: 88, text: "Official IELTS Mock Examination System" });
  drawHLine(image, 50, 150, 700, 2, navyColor);

  // Document Title
  image.print({ font: font32, x: 220, y: 165, text: "TEST REPORT FORM" });

  // 4. Candidate Information
  image.print({ font: font16, x: 50, y: 225, text: "Candidate Name:" });
  image.print({ font: font32, x: 220, y: 215, text: candidateName });

  image.print({ font: font16, x: 50, y: 265, text: "Phone Number:" });
  image.print({ font: font16, x: 220, y: 265, text: phone });

  image.print({ font: font16, x: 50, y: 300, text: "Date of Test:" });
  image.print({ font: font16, x: 220, y: 300, text: date });

  // 5. Scores Table Grid
  drawRect(image, 50, 350, 700, 40, 0xF1F5F9FF);
  
  drawHLine(image, 50, 350, 700, 2, navyColor); // Table Top
  drawHLine(image, 50, 390, 700, 1, navyColor); // Header Divider
  drawHLine(image, 50, 450, 700, 2, navyColor); // Table Bottom

  drawVLine(image, 50, 350, 100, 2, navyColor); // Left Outer
  drawVLine(image, 190, 350, 100, 1, navyColor); // Col 1
  drawVLine(image, 330, 350, 100, 1, navyColor); // Col 2
  drawVLine(image, 470, 350, 100, 1, navyColor); // Col 3
  drawVLine(image, 610, 350, 100, 1, navyColor); // Col 4
  drawVLine(image, 750, 350, 100, 2, navyColor); // Right Outer

  image.print({ font: font16, x: 75, y: 360, text: "Listening" });
  image.print({ font: font16, x: 220, y: 360, text: "Reading" });
  image.print({ font: font16, x: 360, y: 360, text: "Writing" });
  image.print({ font: font16, x: 500, y: 360, text: "Speaking" });
  image.print({ font: font16, x: 630, y: 360, text: "Overall Band" });

  const getScoreStr = (score) => (score ? score.toFixed(1) : "0.0");
  image.print({ font: font32, x: 95, y: 400, text: getScoreStr(scores.listening) });
  image.print({ font: font32, x: 235, y: 400, text: getScoreStr(scores.reading) });
  image.print({ font: font32, x: 375, y: 400, text: getScoreStr(scores.writing) });
  image.print({ font: font32, x: 515, y: 400, text: getScoreStr(scores.speaking) });
  
  drawRect(image, 611, 391, 138, 58, 0xE0F2FEFF); // highlight background
  image.print({ font: font32, x: 650, y: 400, text: getScoreStr(scores.overall) });

  // 6. Footer - Centered VERIFIED Stamp
  drawRect(image, 310, 490, 180, 50, greenColor);
  drawRect(image, 314, 494, 172, 42, 0xFFFFFFFF);
  image.print({ font: font16, x: 360, y: 505, text: "VERIFIED" });

  await image.write(outputPath);
};

// ── STATIC FILE SERVING (React build) ──
const DIST_DIR = path.join(__dirname, 'dist');

const MIME_TYPES = {
  '.html': 'text/html',
  '.js':   'application/javascript',
  '.css':  'text/css',
  '.png':  'image/png',
  '.jpg':  'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg':  'image/svg+xml',
  '.ico':  'image/x-icon',
  '.json': 'application/json',
  '.woff': 'font/woff',
  '.woff2':'font/woff2',
  '.ttf':  'font/ttf',
  '.webp': 'image/webp',
};

const serveStatic = (res, filePath) => {
  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404);
      res.end('Not Found');
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(data);
    }
  });
};

// HTTP Server
const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  const parsedUrl = new URL(req.url, `http://${req.headers.host}`);

  if (parsedUrl.pathname === '/api/register' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const { fullName, phone, telegram } = JSON.parse(body);
        if (!fullName || !phone) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'fullName and phone are required' }));
          return;
        }

        const dbData = readDB();
        const cleaned = cleanPhone(phone);
        
        let candidate = dbData.candidates.find(c => cleanPhone(c.phone) === cleaned);
        if (!candidate) {
          candidate = {
            id: 'CAND_' + Math.floor(100000 + Math.random() * 900000),
            fullName,
            phone,
            telegram: telegram || '',
            registeredAt: new Date().toISOString()
          };
          dbData.candidates.push(candidate);
          writeDB(dbData);
        } else {
          candidate.fullName = fullName;
          candidate.telegram = telegram || '';
          writeDB(dbData);
        }

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(candidate));
      } catch (e) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: e.message }));
      }
    });
  }
  
  else if (parsedUrl.pathname === '/api/result' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const { phone, candidateName, testType, testTitle, scores } = JSON.parse(body);
        if (!phone || !scores) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'phone and scores are required' }));
          return;
        }

        const dbData = readDB();
        const result = {
          id: 'RES_' + Math.floor(100000 + Math.random() * 900000),
          phone,
          candidateName: candidateName || 'Anonymous',
          testType: testType || 'mock',
          testTitle: testTitle || 'IELTS Test',
          scores,
          date: new Date().toISOString()
        };

        dbData.results.push(result);
        writeDB(dbData);

        // If it is a Full Mock Test, notify the Admin immediately for Speaking evaluation
        if (testType === 'full') {
          const adminNotifyText = `🔔 *YANGI MOCK TOPSHIRILDI!* (American Mock Testing)

👤 *Nomzod:* ${result.candidateName}
📞 *Tel:* \`+${cleanPhone(phone)}\`
📚 *Test:* ${result.testTitle}

📊 *AI Natijalari:*
🎧 Listening: *${(scores.listening || 0).toFixed(1)}*
📖 Reading: *${(scores.reading || 0).toFixed(1)}*
✍️ Writing: *${(scores.writing || 0).toFixed(1)}*

⏳ *Speaking bo'limi baholanishi kutilmoqda.*
👉 Admin panelga kirib baholang!`;

          sendTelegramMessage('6241470340', adminNotifyText);
        }

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(result));
      } catch (e) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: e.message }));
      }
    });
  }
  
  else if (parsedUrl.pathname === '/api/result/update-speaking' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', async () => {
      try {
        const { resultId, speaking } = JSON.parse(body);
        if (!resultId || speaking === undefined) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'resultId and speaking are required' }));
          return;
        }

        const dbData = readDB();
        const result = dbData.results.find(r => r.id === resultId);
        if (!result) {
          res.writeHead(404, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Result not found' }));
          return;
        }

        // 1. Update speaking score
        result.scores.speaking = parseFloat(speaking);

        // 2. Recalculate Overall Band score based on IELTS rounding rules
        const s = result.scores;
        const avg = ((s.listening || 0) + (s.reading || 0) + (s.writing || 0) + s.speaking) / 4;
        
        // Rounded to nearest 0.5
        result.scores.overall = Math.round(avg * 2) / 2;

        writeDB(dbData);

        // 3. Generate updated TRF image
        const cleaned = cleanPhone(result.phone);
        const tempPath = path.join(__dirname, `cert_${cleaned}_updated.png`);

        await generateTRFImage(
          result.candidateName,
          result.phone,
          new Date(result.date).toLocaleDateString('uz-UZ'),
          result.scores,
          tempPath
        );

        // 4. Send updated certificate via Telegram
        const caption = `🎓 *IMTIHON SERTIFIKATI* (American Mock Testing)

👤 *Nomzod:* ${result.candidateName}
📚 *Test:* ${result.testTitle}
🎧 Listening: *${(result.scores.listening || 0).toFixed(1)}*
📖 Reading: *${(result.scores.reading || 0).toFixed(1)}*
✍️ Writing: *${(result.scores.writing || 0).toFixed(1)}*
🗣️ Speaking: *${result.scores.speaking.toFixed(1)}*
🏆 *Overall Band:* *${result.scores.overall.toFixed(1)}*`;

        // Send to candidate if telegramChatId exists
        const candidate = dbData.candidates.find(c => cleanPhone(c.phone) === cleaned);
        if (candidate && candidate.telegramChatId) {
          sendTelegramPhoto(candidate.telegramChatId, tempPath, caption);
        }

        // Send to Admin chat ID (6241470340) as a backup and notification
        sendTelegramPhoto('6241470340', tempPath, `👨‍💻 *ADMIN NOTIFICATION* (Speaking Evaluated)\n\n${caption}`);

        // Cleanup
        setTimeout(() => {
          if (fs.existsSync(tempPath)) {
            fs.unlinkSync(tempPath);
          }
        }, 15000);

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(result));
      } catch (e) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: e.message }));
      }
    });
  }

  else if (parsedUrl.pathname === '/api/candidates' && req.method === 'GET') {
    const dbData = readDB();
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(dbData.candidates));
  }

  else if (parsedUrl.pathname === '/api/results' && req.method === 'GET') {
    const dbData = readDB();
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(dbData.results));
  }

  else {
    // Serve static files from dist (React build)
    let filePath = path.join(DIST_DIR, parsedUrl.pathname);

    // If requesting a directory, serve index.html
    if (parsedUrl.pathname === '/' || !path.extname(filePath)) {
      filePath = path.join(DIST_DIR, 'index.html');
    }

    if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
      serveStatic(res, filePath);
    } else {
      // SPA fallback — all unknown routes → index.html
      serveStatic(res, path.join(DIST_DIR, 'index.html'));
    }
  }
});

server.listen(PORT, () => {
  console.log(`Mock Backend server listening on http://localhost:${PORT}`);
});


// ── TELEGRAM BOT POLLING & PHOTO SENDING LOGIC ──

const sendTelegramMessage = (chatId, text, replyMarkup = null) => {
  const data = JSON.stringify({
    chat_id: chatId,
    text: text,
    parse_mode: 'Markdown',
    reply_markup: replyMarkup
  });

  const options = {
    hostname: 'api.telegram.org',
    port: 443,
    path: `/bot${BOT_TOKEN}/sendMessage`,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': data.length
    }
  };

  const req = https.request(options);
  req.write(data);
  req.end();
};

const sendTelegramPhoto = (chatId, photoPath, caption) => {
  const boundary = '----TelegramBotBoundary';
  const photoBuffer = fs.readFileSync(photoPath);
  const filename = path.basename(photoPath);

  let postData = [];
  postData.push(Buffer.from(`--${boundary}\r\n`));
  postData.push(Buffer.from(`Content-Disposition: form-data; name="chat_id"\r\n\r\n${chatId}\r\n`));
  
  postData.push(Buffer.from(`--${boundary}\r\n`));
  postData.push(Buffer.from(`Content-Disposition: form-data; name="photo"; filename="${filename}"\r\n`));
  postData.push(Buffer.from(`Content-Type: image/png\r\n\r\n`));
  postData.push(photoBuffer);
  postData.push(Buffer.from(`\r\n`));
  
  if (caption) {
    postData.push(Buffer.from(`--${boundary}\r\n`));
    postData.push(Buffer.from(`Content-Disposition: form-data; name="caption"\r\n\r\n${caption}\r\n`));
    postData.push(Buffer.from(`--${boundary}\r\n`));
    postData.push(Buffer.from(`Content-Disposition: form-data; name="parse_mode"\r\n\r\nMarkdown\r\n`));
  }
  
  postData.push(Buffer.from(`--${boundary}--\r\n`));

  const finalBuffer = Buffer.concat(postData);

  const options = {
    hostname: 'api.telegram.org',
    port: 443,
    path: `/bot${BOT_TOKEN}/sendPhoto`,
    method: 'POST',
    headers: {
      'Content-Type': `multipart/form-data; boundary=${boundary}`,
      'Content-Length': finalBuffer.length
    }
  };

  const req = https.request(options, (res) => {
    res.on('data', () => {});
  });
  req.on('error', (e) => {
    console.error('sendPhoto request error:', e);
  });
  req.write(finalBuffer);
  req.end();
};

let lastUpdateId = 0;

const pollTelegramUpdates = () => {
  const path = `/bot${BOT_TOKEN}/getUpdates?offset=${lastUpdateId + 1}&timeout=30`;
  
  https.get({
    hostname: 'api.telegram.org',
    path: path,
    timeout: 35000
  }, (res) => {
    let body = '';
    res.on('data', (chunk) => body += chunk);
    res.on('end', () => {
      try {
        const data = JSON.parse(body);
        if (data.ok && data.result.length > 0) {
          data.result.forEach(update => {
            lastUpdateId = update.update_id;
            handleBotUpdate(update);
          });
        }
      } catch (e) {}
      setTimeout(pollTelegramUpdates, 100);
    });
  }).on('error', () => {
    setTimeout(pollTelegramUpdates, 5000);
  });
};

const handleBotUpdate = (update) => {
  const message = update.message;
  if (!message) return;

  const chatId = message.chat.id;
  
  if (message.contact) {
    searchAndSendResults(chatId, message.contact.phone_number);
    return;
  }

  const text = message.text ? message.text.trim() : '';

  if (text.startsWith('/start')) {
    const args = text.split(' ');
    if (args.length > 1 && /^\d+$/.test(args[1])) {
      searchAndSendResults(chatId, args[1]);
      return;
    }
    sendWelcomeMessage(chatId);
  } else if (/^\+?\d[\d\s-]{7,15}\d$/.test(text)) {
    searchAndSendResults(chatId, text);
  } else {
    sendWelcomeMessage(chatId);
  }
};

const sendWelcomeMessage = (chatId) => {
  const welcomeText = `🏫 *American Mock Testing IELTS Bot-ga xush kelibsiz!*

Natijalar va shaxsiy TRF sertifikat kartangizni olish uchun pastdagi tugmani bosing yoki telefon raqamingizni yozib yuboring (masalan: \`+998500758444\`).`;

  const replyMarkup = {
    keyboard: [
      [{ text: '📱 Telefon raqamni ulashish', request_contact: true }]
    ],
    resize_keyboard: true,
    one_time_keyboard: true
  };

  sendTelegramMessage(chatId, welcomeText, replyMarkup);
};

const searchAndSendResults = async (chatId, rawPhone) => {
  const cleaned = cleanPhone(rawPhone);
  const dbData = readDB();
  const siteUrl = process.env.RENDER_EXTERNAL_URL || 'http://127.0.0.1';

  // Link telegramChatId to candidate
  let candidate = dbData.candidates.find(c => cleanPhone(c.phone) === cleaned);
  if (candidate) {
    candidate.telegramChatId = chatId;
    writeDB(dbData);
  }

  const candidateResults = dbData.results.filter(r => cleanPhone(r.phone) === cleaned);

  if (candidateResults.length === 0) {
    const errorText = `❌ *Natija topilmadi!*

Telefon raqam: \`+${cleaned}\`

Ushbu raqam bo'yicha bazada mock test natijalari topilmadi. Oldin test topshiring:
👉 ${siteUrl}`;

    sendTelegramMessage(chatId, errorText);
    return;
  }

  // Filter for Full Mock results
  const fullMockResults = candidateResults.filter(r => r.testType === 'full');

  if (fullMockResults.length === 0) {
    const msgText = `ℹ️ *Sertifikat faqat to'liq imtihon (Full Mock Test) uchun beriladi.*

Siz faqat alohida bo'limli mashq testlarini topshirgansiz. To'liq Mock topshirish uchun portalga kiring:
👉 ${siteUrl}`;
    sendTelegramMessage(chatId, msgText);
    return;
  }

  fullMockResults.sort((a, b) => new Date(b.date) - new Date(a.date));
  const latestFullResult = fullMockResults[0];

  // Check if Speaking is evaluated
  if (!latestFullResult.scores.speaking || latestFullResult.scores.speaking === 0) {
    const pendingText = `⏳ *Sizning to'liq Mock imtihoningiz qabul qilindi!*

Hozirda examinerlarimiz tomonidan *Speaking* bo'limi baholanmoqda.
Baholash yakunlangach, rasmiy TRF sertifikatingiz ushbu bot orqali sizga **avtomatik ravishda** yuboriladi! 🎓`;
    sendTelegramMessage(chatId, pendingText);
    return;
  }

  // If Speaking is evaluated, send certificate
  sendTelegramMessage(chatId, "⏳ *Sertifikatingiz tayyorlanmoqda...*");

  const tempPath = path.join(__dirname, `cert_${cleaned}.png`);

  await generateTRFImage(
    latestFullResult.candidateName,
    latestFullResult.phone,
    new Date(latestFullResult.date).toLocaleDateString('uz-UZ'),
    latestFullResult.scores,
    tempPath
  );

  const caption = `🎓 *IMTIHON SERTIFIKATI* (American Mock Testing)

👤 *Nomzod:* ${latestFullResult.candidateName}
📚 *Test:* ${latestFullResult.testTitle}
🎧 Listening: *${latestFullResult.scores.listening.toFixed(1)}*
📖 Reading: *${latestFullResult.scores.reading.toFixed(1)}*
✍️ Writing: *${latestFullResult.scores.writing.toFixed(1)}*
🗣️ Speaking: *${latestFullResult.scores.speaking.toFixed(1)}*
🏆 *Overall Band:* *${latestFullResult.scores.overall.toFixed(1)}*`;

  sendTelegramPhoto(chatId, tempPath, caption);

  setTimeout(() => {
    if (fs.existsSync(tempPath)) {
      fs.unlinkSync(tempPath);
    }
  }, 10000);
};

console.log('Telegram Bot Polling started...');
pollTelegramUpdates();
