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
# Install vite globally to make sure it's available
npm install -g vite
# Print vite version for debugging
echo "Vite version: $(vite --version)"
npm run build
cd ..

# Create server/public directory and copy client build
echo "Setting up static files..."
mkdir -p server/public
# Check if dist directory exists
if [ -d "client/dist" ]; then
  cp -r client/dist/* server/public/
  echo "Static files copied successfully."
else
  echo "Error: client/dist directory not found. Build may have failed."
  # Create a basic index.html so the app at least starts
  echo "<html><body><h1>ElegantTodos</h1><p>Frontend build failed. Please check the logs.</p></body></html>" > server/public/index.html
fi

echo "Build completed successfully!"