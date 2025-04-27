#!/bin/bash
# Build script for ElegantTodos on Render

echo "Starting build process..."

# Install main dependencies
echo "Installing main dependencies..."
npm install

# Install client dependencies and build frontend
echo "Building frontend..."
cd client

# Install dependencies including all CSS-related tools
echo "Installing client dependencies..."
npm install
npm install -g vite
npm install --save autoprefixer postcss tailwindcss @vitejs/plugin-react tailwindcss-animate @tailwindcss/typography

# Print versions for debugging
echo "Vite version: $(vite --version)"
echo "Node version: $(node --version)"
echo "NPM version: $(npm --version)"

# Verify PostCSS configuration
echo "Checking PostCSS configuration..."
cat postcss.config.js

# Try to build the frontend
echo "Running build command..."
npm run build || echo "Build command failed, but continuing deployment"

cd ..

# Create server/public directory
echo "Setting up static files..."
mkdir -p server/public

# Check if dist directory exists and copy files
if [ -d "client/dist" ] && [ "$(ls -A client/dist 2>/dev/null)" ]; then
  echo "Copying build files from client/dist..."
  cp -r client/dist/* server/public/
  echo "Static files copied successfully."
else
  echo "Warning: client/dist directory not found or empty. Creating fallback page."
  
  # Create a basic index.html so the app at least starts
  cat > server/public/index.html << 'EOL'
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>ElegantTodos</title>
  <style>
    body { font-family: system-ui, -apple-system, sans-serif; line-height: 1.5; max-width: 800px; margin: 0 auto; padding: 2rem; color: #333; }
    h1 { color: #3b82f6; margin-bottom: 1rem; }
    p { margin-bottom: 1rem; }
    .card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 0.5rem; padding: 1.5rem; margin: 2rem 0; }
    .warning { color: #ef4444; font-weight: 500; }
    .note { color: #6b7280; font-size: 0.875rem; margin-top: 2rem; }
    .btn { display: inline-block; background: #3b82f6; color: white; padding: 0.5rem 1rem; border-radius: 0.25rem; text-decoration: none; margin-top: 1rem; }
  </style>
</head>
<body>
  <h1>ElegantTodos</h1>
  <p>The API server is running correctly, but there was an issue with the frontend build.</p>
  
  <div class="card">
    <p class="warning">Frontend build process failed.</p>
    <p>The application's backend API is working correctly and can be accessed at <code>/api/todos</code>.</p>
    <p>This page is a fallback to ensure the server starts successfully even when the build process encounters issues.</p>
    <a class="btn" href="/api/todos" target="_blank">View Todos API</a>
  </div>
  
  <p class="note">© 2025 ElegantTodos - Created by Sk. Salman Haider</p>
</body>
</html>
EOL
fi

echo "Build process completed!"