#!/bin/bash

# Build the frontend only
echo "Building frontend for GitHub Pages..."
npx vite build --outDir=gh-pages-dist

# Run the deployment preparation script
echo "Running deployment preparation script..."
node deploy-to-gh-pages.js

# Create a .nojekyll file to prevent GitHub from treating this as a Jekyll site
touch gh-pages-dist/.nojekyll

echo "Files prepared for GitHub Pages deployment in gh-pages-dist/"
echo "You can now push the contents of gh-pages-dist/ to your gh-pages branch"