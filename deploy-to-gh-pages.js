// This script prepares files for GitHub Pages deployment
const fs = require('fs');
const path = require('path');

// Define the output directory for GitHub Pages
const outputDir = 'gh-pages-dist';

// Create output directory if it doesn't exist
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir);
}

// Copy index.html to the output folder with modified paths
const indexHtml = fs.readFileSync('client/index.html', 'utf8');
const modifiedIndexHtml = indexHtml
  .replace('<script type="module" src="/src/main.tsx"></script>', '<script type="module" src="./assets/main.js"></script>')
  .replace('<script type="text/javascript" src="https://replit.com/public/js/replit-badge-v3.js"></script>', '')
  .replace('<head>', '<head>\n    <title>Todo App</title>\n    <link rel="stylesheet" href="./assets/index.css" />');

fs.writeFileSync(`${outputDir}/index.html`, modifiedIndexHtml);

// Create a simple base URL configuration for GitHub Pages
const ghPagesConfig = `
// GitHub Pages base path configuration
window.BASE_PATH = '${process.env.REPO_NAME || ''}';
`;
fs.writeFileSync(`${outputDir}/gh-pages-config.js`, ghPagesConfig);

// Create .nojekyll file to prevent GitHub Pages from ignoring files that start with an underscore
fs.writeFileSync(`${outputDir}/.nojekyll`, '');

console.log(`Files prepared for GitHub Pages deployment in ${outputDir}/`);