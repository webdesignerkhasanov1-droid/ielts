const fs = require('fs');
const path = require('path');

const srcDir = 'C:\\Users\\User\\.gemini\\antigravity-ide\\scratch\\111';
const destDir = 'C:\\Users\\User\\.gemini\\antigravity\\scratch\\ielts-mock-portal\\public\\tests';

// Ensure directories exist
const ensureDir = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

ensureDir(path.join(destDir, 'listening'));
ensureDir(path.join(destDir, 'reading'));
ensureDir(path.join(destDir, 'writing'));

const files = fs.readdirSync(srcDir);

// Mapping lists
const listeningTests = [];
const readingTests = [];
const writingTests = [];

files.forEach(file => {
  const lowerFile = file.toLowerCase();
  const srcFile = path.join(srcDir, file);
  
  if (lowerFile.includes('listening')) {
    listeningTests.push({ src: srcFile, orig: file });
  } else if (lowerFile.includes('reading') || lowerFile.includes('science') || lowerFile.includes('antarctica') || lowerFile.includes('passage 2')) {
    readingTests.push({ src: srcFile, orig: file });
  } else if (lowerFile.includes('writing')) {
    writingTests.push({ src: srcFile, orig: file });
  }
});

console.log(`Found ${listeningTests.length} listening, ${readingTests.length} reading, ${writingTests.length} writing tests.`);

// Copy files
listeningTests.forEach((test, idx) => {
  const destName = `test_${idx + 1}.html`;
  fs.copyFileSync(test.src, path.join(destDir, 'listening', destName));
  console.log(`Copied ${test.orig} -> listening/${destName}`);
});

readingTests.forEach((test, idx) => {
  const destName = `test_${idx + 1}.html`;
  fs.copyFileSync(test.src, path.join(destDir, 'reading', destName));
  console.log(`Copied ${test.orig} -> reading/${destName}`);
});

writingTests.forEach((test, idx) => {
  const destName = `test_${idx + 1}.html`;
  fs.copyFileSync(test.src, path.join(destDir, 'writing', destName));
  console.log(`Copied ${test.orig} -> writing/${destName}`);
});

console.log('Copy complete!');
