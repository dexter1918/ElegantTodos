#!/bin/sh
set -e

# Log setup information (without revealing secrets)
echo "Starting ElegantTodos container..."
echo "Node version: $(node --version)"
echo "Environment: $NODE_ENV"
echo "Connection: MongoDB (External)"

# Check if MongoDB connection is available
echo "Checking MongoDB connection..."
node -e "
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URI, { 
  useNewUrlParser: true, 
  useUnifiedTopology: true 
})
.then(() => {
  console.log('MongoDB connection successful');
  process.exit(0);
})
.catch(err => {
  console.error('MongoDB connection error:', err.message);
  process.exit(1);
});" || exit 1

# Start the application
echo "Starting application..."
exec "$@"