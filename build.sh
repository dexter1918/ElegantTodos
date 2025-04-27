#!/bin/bash
# Build script for ElegantTodos on Render

echo "Starting build process..."

# Install main dependencies
echo "Installing main dependencies..."
npm install

# Install client dependencies and build frontend
echo "Building frontend..."
cd client
npm install
npm run build
cd ..

# Create server/public directory and copy client build
echo "Setting up static files..."
mkdir -p server/public
cp -r client/dist/* server/public/

echo "Build completed successfully!"