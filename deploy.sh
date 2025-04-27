#!/bin/bash

# Install dependencies including dev dependencies
npm install --include=dev

# Build the client
cd client
npm install
npm run build
cd ..

# Build the server
npx esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist

echo "Build completed successfully"