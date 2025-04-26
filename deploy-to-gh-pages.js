// This script prepares files for GitHub Pages deployment
const fs = require('fs');
const path = require('path');

// Create dist directory if it doesn't exist
if (!fs.existsSync('dist')) {
  fs.mkdirSync('dist');
}

// Copy index.html to the dist folder with modified paths
const indexHtml = fs.readFileSync('client/index.html', 'utf8');
const modifiedIndexHtml = indexHtml
  .replace('<script type="module" src="/src/main.tsx"></script>', '<script type="module" src="./main.js"></script>')
  .replace('<script type="text/javascript" src="https://replit.com/public/js/replit-badge-v3.js"></script>', '')
  .replace('<head>', '<head>\n    <title>Todo App</title>');

fs.writeFileSync('dist/index.html', modifiedIndexHtml);

console.log('Files prepared for GitHub Pages deployment');