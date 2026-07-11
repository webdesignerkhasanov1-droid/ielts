const fs = require('fs');
const path = require('path');

const dirPath = 'C:\\Users\\User\\.gemini\\antigravity\\scratch\\ielts-mock-portal\\public\\tests\\listening';

if (!fs.existsSync(dirPath)) {
  console.error("Directory not found:", dirPath);
  process.exit(1);
}

const files = fs.readdirSync(dirPath).filter(f => f.endsWith('.html'));

files.forEach(file => {
  const filePath = path.join(dirPath, file);
  let content = fs.readFileSync(filePath, 'utf8');
  let changed = false;

  // More flexible regex for pause event listener that includes any spacing or content
  const pauseRegex = /audio\.addEventListener\(\s*['"]pause['"]\s*,\s*[^)]*?\)\s*;?/gs;
  
  // Replace only if it plays audio internally or blocks pause (contains audio.play)
  // Let's search inside the script blocks
  if (content.includes("audio.play()") && content.includes("audio.ended")) {
    // Replace standard block
    const standardPauseBlock = /audio\.addEventListener\(\s*['"]pause['"]\s*,\s*\(\)\s*=>\s*\{\s*if\s*\(!audio\.ended\)\s*\{\s*audio\.play\(\);\s*\}\s*\}\)/g;
    
    // A broader check
    content = content.replace(/audio\.addEventListener\(\s*['"]pause['"]\s*,\s*\(\)\s*=>\s*\{.*?audio\.play\(\);.*?\s*\}\)/gs, (match) => {
      changed = true;
      return `audio.addEventListener('pause', () => {
                const status = document.getElementById('audio-status');
                if (status) {
                  status.textContent = '⏸ Paused';
                  status.classList.remove('playing');
                }
            })`;
    });

    // Replace seeking blockers
    content = content.replace(/audio\.addEventListener\(\s*['"]seeking['"]\s*,\s*\(\)\s*=>\s*\{.*?\s*\}\)/gs, (match) => {
      changed = true;
      return `/* Seeking allowed */`;
    });
  }

  if (changed) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Flexible Patched: ${file}`);
  }
});

console.log("All listening files processed dynamically!");
