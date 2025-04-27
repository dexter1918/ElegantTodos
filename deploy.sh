#!/bin/bash
# Deployment script for ElegantTodos on Render

echo "Starting deployment process..."

# Install main dependencies
echo "Installing main dependencies..."
npm install

# Create client build directory if it doesn't exist
mkdir -p client/dist

# Install and build client
echo "Setting up client build..."
cd client
npm install
echo "Building client application..."
npm run build
cd ..

# Create server/public directory and copy client build
echo "Copying client build to server/public..."
mkdir -p server/public
cp -r client/dist/* server/public/

# Convert deploy-server.js to CommonJS syntax if needed
echo "Setting up deployment server..."
node -e "
const fs = require('fs');
const content = fs.readFileSync('./deploy-server.js', 'utf8')
  .replace('import express from', 'const express = require')
  .replace('import path from', 'const path = require')
  .replace('import fs from', 'const fs = require')
  .replace('import cors from', 'const cors = require')
  .replace('import { fileURLToPath } from', 'const { fileURLToPath } = require')
  .replace('import { dirname } from', 'const { dirname } = require')
  .replace('import { connectToMongoDB } from', 'const { connectToMongoDB } = require')
  .replace('import mongoose from', 'const mongoose = require')
  .replace('import todoRoutes from', 'const todoRoutes = require')
  .replace('export default', 'module.exports =');
fs.writeFileSync('./deploy-server.cjs', content);
"

echo "Deployment setup complete!"
echo "Run 'node deploy-server.cjs' to start the server"