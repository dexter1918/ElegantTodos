#!/bin/bash

# Make the script executable
chmod +x deploy.sh

# Build the frontend only
echo "Building frontend for GitHub Pages..."
npx vite build --outDir=gh-pages-dist client

# Run the deployment preparation script
echo "Running deployment preparation script..."
node deploy-to-gh-pages.js

echo "Files prepared for GitHub Pages deployment in gh-pages-dist/"
echo ""
echo "To deploy to GitHub Pages manually:"
echo "1. Create a gh-pages branch: git checkout -b gh-pages"
echo "2. Remove all files from the gh-pages branch: git rm -rf ."
echo "3. Copy the contents of gh-pages-dist to the root: cp -r gh-pages-dist/* ."
echo "4. Add the files: git add ."
echo "5. Commit: git commit -m 'Deploy to GitHub Pages'"
echo "6. Push to GitHub: git push origin gh-pages"
echo ""
echo "Alternatively, you can enable GitHub Actions in your repository to automate deployment."