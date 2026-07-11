const https = require('https');
const fs = require('fs');
const path = require('path');

const url = 'https://ieltstrainingonline.com/wp-content/uploads/2019/06/IETLS-Writing-recent-actual-test-070.jpg';
const dest = path.join(__dirname, '..', 'public', 'tests', 'writing', 'car_production.jpg');

// Ensure directory exists
fs.mkdirSync(path.dirname(dest), { recursive: true });

console.log(`Downloading image from ${url} to ${dest}...`);

const file = fs.createWriteStream(dest);
https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (response) => {
  if (response.statusCode !== 200) {
    console.error(`Failed to download image. Status code: ${response.statusCode}`);
    process.exit(1);
  }
  response.pipe(file);
  file.on('finish', () => {
    file.close();
    console.log('Image download completed successfully!');
  });
}).on('error', (err) => {
  fs.unlink(dest, () => {});
  console.error(`Error downloading image: ${err.message}`);
});
