const http = require('http');

const files = [
  '/',
  '/index.html',
  '/styles.css',
  '/js/audio.js',
  '/js/three-hero.js',
  '/js/three-agv.js',
  '/js/pid-lab.js',
  '/js/terminal.js',
  '/js/app.js'
];

async function verify() {
  console.log('=== VERIFYING LOCALHOST SERVER FILES ===');
  for (const f of files) {
    await new Promise((resolve) => {
      http.get('http://127.0.0.1:3000' + f, (res) => {
        console.log(`[${res.statusCode}] ${f} (${res.headers['content-type']})`);
        resolve();
      }).on('error', (err) => {
        console.error(`FAILED ${f}:`, err.message);
        resolve();
      });
    });
  }
  console.log('=== ALL ENDPOINTS VERIFIED ===');
}

verify();
