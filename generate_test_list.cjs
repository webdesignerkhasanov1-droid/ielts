const fs = require('fs');
const path = require('path');

const srcDir = 'C:\\Users\\User\\.gemini\\antigravity-ide\\scratch\\111';
const outputDir = 'C:\\Users\\User\\.gemini\\antigravity\\scratch\\ielts-mock-portal\\src\\data';

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const files = fs.readdirSync(srcDir);

const cleanTitle = (filename) => {
  return filename
    .replace('.html', '')
    .replace(/VIP.*$/, 'VIP')
    .replace(/@.*$/, '')
    .trim();
};

const cleanSource = (filename) => {
  const match = filename.match(/@([a-zA-Z0-9_]+)/);
  return match ? match[1] : 'Cambridge / Official';
};

const listeningTests = [];
const readingTests = [];
const writingTests = [];

// Separate files into categories
const lists = {
  listening: [],
  reading: [],
  writing: []
};

files.forEach(file => {
  const lowerFile = file.toLowerCase();
  if (lowerFile.includes('listening')) {
    lists.listening.push(file);
  } else if (lowerFile.includes('reading') || lowerFile.includes('science') || lowerFile.includes('antarctica') || lowerFile.includes('passage 2')) {
    lists.reading.push(file);
  } else if (lowerFile.includes('writing')) {
    lists.writing.push(file);
  }
});

// Sort them so they are in a nice order
lists.listening.sort();
lists.reading.sort();
lists.writing.sort();

lists.listening.forEach((file, idx) => {
  listeningTests.push({
    id: idx + 1,
    title: cleanTitle(file),
    subtitle: `Full 40-question listening test #${idx + 1} based on authentic practice paper.`,
    duration: '30 min',
    questions: 40,
    difficulty: (idx % 2 === 0) ? 'Intermediate' : 'Advanced',
    url: `/tests/listening/test_${idx + 1}.html`,
    free: true,
    source: cleanSource(file),
    originalFile: file
  });
});

lists.reading.forEach((file, idx) => {
  readingTests.push({
    id: idx + 1,
    title: cleanTitle(file),
    subtitle: `3-passage academic reading test #${idx + 1} containing all core questions.`,
    duration: '60 min',
    questions: 40,
    difficulty: (idx % 3 === 0) ? 'Beginner' : (idx % 3 === 1 ? 'Intermediate' : 'Advanced'),
    url: `/tests/reading/test_${idx + 1}.html`,
    free: true,
    source: cleanSource(file),
    originalFile: file
  });
});

lists.writing.forEach((file, idx) => {
  writingTests.push({
    id: idx + 1,
    title: cleanTitle(file),
    subtitle: `Academic writing tasks with task 1 and task 2 response boxes.`,
    duration: '60 min',
    questions: 2,
    difficulty: (idx % 2 === 0) ? 'Intermediate' : 'Advanced',
    url: `/tests/writing/test_${idx + 1}.html`,
    free: true,
    source: cleanSource(file),
    originalFile: file
  });
});

const data = {
  listening: listeningTests,
  reading: readingTests,
  writing: writingTests
};

fs.writeFileSync(path.join(outputDir, 'testLibraryData.json'), JSON.stringify(data, null, 2));
console.log('Successfully generated testLibraryData.json with exact file mappings!');
