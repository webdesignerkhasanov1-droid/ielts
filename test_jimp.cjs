const { Jimp, loadFont } = require('jimp');
const { SANS_16_BLACK, SANS_32_BLACK } = require('jimp/fonts');
const path = require('path');

// Helper to draw horizontal line
const drawHLine = (image, x, y, length, thickness, color) => {
  for (let t = 0; t < thickness; t++) {
    for (let i = 0; i < length; i++) {
      image.setPixelColor(color, x + i, y + t);
    }
  }
};

// Helper to draw vertical line
const drawVLine = (image, x, y, length, thickness, color) => {
  for (let t = 0; t < thickness; t++) {
    for (let i = 0; i < length; i++) {
      image.setPixelColor(color, x + t, y + i);
    }
  }
};

// Helper to draw filled rectangle
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
    // Draw a square of size 'thickness' centered at (x, y)
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

// Draw the real American School Monogram Logo
const drawAmericanSchoolLogo = (image, x, y, size, navyColor, greenColor) => {
  // 1. Draw outer rounded square (white fill, navy border)
  // Draw outer border
  drawRect(image, x, y, size, size, 0xFFFFFFFF); // White background
  drawHLine(image, x, y, size, 3, navyColor); // Top
  drawHLine(image, x, y + size - 3, size, 3, navyColor); // Bottom
  drawVLine(image, x, y, size, 3, navyColor); // Left
  drawVLine(image, x + size - 3, y, size, 3, navyColor); // Right

  // 2. Draw 'A' Triangle legs (Navy)
  // Peak: (x + size/2, y + 16)
  // Left bottom: (x + 22, y + 60)
  // Right bottom: (x + size - 22, y + 60)
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
  // S curves inside the triangle
  const sLeftX = x + 32;
  const sRightX = x + size - 32;
  const sTopY = y + 36;
  const sMidY = y + 46;
  const sBotY = y + 56;

  // Top horizontal bar
  drawLine(image, sLeftX, sTopY, sRightX, sTopY, 3.5, greenColor);
  // Left vertical curve
  drawLine(image, sLeftX, sTopY, sLeftX, sMidY, 3.5, greenColor);
  // Middle horizontal bar
  drawLine(image, sLeftX, sMidY, sRightX, sMidY, 3.5, greenColor);
  // Right vertical curve
  drawLine(image, sRightX, sMidY, sRightX, sBotY, 3.5, greenColor);
  // Bottom horizontal bar
  drawLine(image, sLeftX, sBotY, sRightX, sBotY, 3.5, greenColor);

  // 4. Draw Green Bottom Bar
  drawLine(image, x + 12, y + 67, x + size - 12, y + 67, 3.5, greenColor);

  // 5. Draw Navy Text Box at the bottom
  drawRect(image, x + 10, y + 73, size - 20, 10, navyColor);
  // (We don't need text, it's tiny decor, but we can write an accent white line)
  drawHLine(image, x + 15, y + 77, size - 30, 2, 0xFFFFFFFF);
};

const generateTRFImage = async (candidateName, phone, date, scores, outputPath) => {
  try {
    // 1. Create a blank image 800 x 600 with white background
    const image = new Jimp({ width: 800, height: 600, color: 0xFFFFFFFF });

    const navyColor = 0x0B2265FF;
    const greenColor = 0x108B58FF;

    // 2. Draw Borders
    // Outer Navy Border
    drawHLine(image, 15, 15, 770, 5, navyColor); // Top
    drawHLine(image, 15, 580, 770, 5, navyColor); // Bottom
    drawVLine(image, 15, 15, 570, 5, navyColor); // Left
    drawVLine(image, 780, 15, 570, 5, navyColor); // Right

    // Inner Green Border
    drawHLine(image, 23, 23, 754, 2, greenColor); // Top
    drawHLine(image, 23, 575, 754, 2, greenColor); // Bottom
    drawVLine(image, 23, 23, 554, 2, greenColor); // Left
    drawVLine(image, 775, 23, 554, 2, greenColor); // Right

    // 3. Load Fonts
    const font32 = await loadFont(SANS_32_BLACK);
    const font16 = await loadFont(SANS_16_BLACK);

    // 4. Draw Real American School Monogram Logo (90x90)
    drawAmericanSchoolLogo(image, 50, 45, 90, navyColor, greenColor);

    // Text Header
    image.print({ font: font32, x: 160, y: 50, text: "AMERICAN SCHOOL" });
    image.print({ font: font16, x: 160, y: 88, text: "INTERNATIONAL IELTS MOCK TESTING PORTAL" });
    drawHLine(image, 50, 150, 700, 2, navyColor);

    // Document Title
    image.print({ font: font32, x: 220, y: 165, text: "TEST REPORT FORM" });

    // 5. Candidate Information
    image.print({ font: font16, x: 50, y: 225, text: "Candidate Name:" });
    image.print({ font: font32, x: 220, y: 215, text: candidateName });

    image.print({ font: font16, x: 50, y: 265, text: "Phone Number:" });
    image.print({ font: font16, x: 220, y: 265, text: phone });

    image.print({ font: font16, x: 50, y: 300, text: "Date of Test:" });
    image.print({ font: font16, x: 220, y: 300, text: date });

    // 6. Scores Table Grid
    // Table Background Header
    drawRect(image, 50, 350, 700, 40, 0xF1F5F9FF);
    
    // Draw Grid Lines
    drawHLine(image, 50, 350, 700, 2, navyColor); // Table Top
    drawHLine(image, 50, 390, 700, 1, navyColor); // Header Divider
    drawHLine(image, 50, 450, 700, 2, navyColor); // Table Bottom

    // Vertical column lines
    drawVLine(image, 50, 350, 100, 2, navyColor); // Left Outer
    drawVLine(image, 190, 350, 100, 1, navyColor); // Col 1
    drawVLine(image, 330, 350, 100, 1, navyColor); // Col 2
    drawVLine(image, 470, 350, 100, 1, navyColor); // Col 3
    drawVLine(image, 610, 350, 100, 1, navyColor); // Col 4
    drawVLine(image, 750, 350, 100, 2, navyColor); // Right Outer

    // Write Table Headers
    image.print({ font: font16, x: 75, y: 360, text: "Listening" });
    image.print({ font: font16, x: 220, y: 360, text: "Reading" });
    image.print({ font: font16, x: 360, y: 360, text: "Writing" });
    image.print({ font: font16, x: 500, y: 360, text: "Speaking" });
    image.print({ font: font16, x: 630, y: 360, text: "Overall Band" });

    // Write Scores
    const getScoreStr = (score) => (score ? score.toFixed(1) : "0.0");
    image.print({ font: font32, x: 95, y: 400, text: getScoreStr(scores.listening) });
    image.print({ font: font32, x: 235, y: 400, text: getScoreStr(scores.reading) });
    image.print({ font: font32, x: 375, y: 400, text: getScoreStr(scores.writing) });
    image.print({ font: font32, x: 515, y: 400, text: getScoreStr(scores.speaking) });
    
    // Make overall score bold/highlighted
    drawRect(image, 611, 391, 138, 58, 0xE0F2FEFF); // light blue background for overall
    image.print({ font: font32, x: 650, y: 400, text: getScoreStr(scores.overall) });

    // 7. Footer details
    drawHLine(image, 100, 540, 200, 1, navyColor);
    image.print({ font: font16, x: 120, y: 545, text: "Administrator Signature" });

    // Stamp circle (VERIFIED stamp in green)
    drawRect(image, 530, 490, 180, 50, greenColor);
    drawRect(image, 534, 494, 172, 42, 0xFFFFFFFF);
    image.print({ font: font16, x: 580, y: 505, text: "VERIFIED" });

    // Write the output file
    await image.write(outputPath);
    console.log("Certificate image generated successfully at:", outputPath);
  } catch (err) {
    console.error("Failed to generate certificate image:", err);
  }
};

// Test generation
generateTRFImage(
  "Abdurahmon Moydionov",
  "+998 50 075 84 44",
  new Date().toLocaleDateString('uz-UZ'),
  { listening: 8.0, reading: 7.5, writing: 7.0, speaking: 7.5, overall: 7.5 },
  path.join(__dirname, 'test_trf.png')
);
