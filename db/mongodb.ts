import mongoose from 'mongoose';
import { log } from '../server/vite';

// MongoDB connection URL
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/todo_app';

// Connect to MongoDB with timeout
export const connectToMongoDB = async (): Promise<void> => {
  return new Promise<void>(async (resolve) => {
    // Set timeout to avoid hanging the server startup
    const timeout = setTimeout(() => {
      console.error('MongoDB connection timeout - proceeding with local storage mode');
      log('MongoDB connection timeout - using local storage fallback', 'mongodb');
      resolve();
    }, 5000); // 5 second timeout
    
    try {
      console.log('Attempting to connect to MongoDB...');
      console.log(`MongoDB URI: ${MONGODB_URI.slice(0, 15)}...`); // Only show the beginning for security

      // Connection options with shorter timeouts
      const options = {
        serverSelectionTimeoutMS: 5000, // Default is 30 seconds
        connectTimeoutMS: 10000, // Default is no timeout
      };
      
      await mongoose.connect(MONGODB_URI, options);
      clearTimeout(timeout);
      console.log('Connected to MongoDB successfully!');
      log('Connected to MongoDB', 'mongodb');
      resolve();
    } catch (error) {
      clearTimeout(timeout);
      console.error('Error connecting to MongoDB:', error);
      log(`Error connecting to MongoDB: ${error}`, 'mongodb');
      
      // Fallback to local in-memory mode for testing/development
      log('Starting server without MongoDB connection - using local storage fallback', 'mongodb');
      resolve();
    }
  });
};

// Disconnect from MongoDB (useful for tests or graceful shutdown)
export const disconnectFromMongoDB = async (): Promise<void> => {
  try {
    await mongoose.disconnect();
    log('Disconnected from MongoDB', 'mongodb');
  } catch (error) {
    log(`Error disconnecting from MongoDB: ${error}`, 'mongodb');
  }
};

// Export the mongoose connection
export const db = mongoose.connection;

// Set up event listeners for the connection
db.on('error', (error) => {
  log(`MongoDB connection error: ${error}`, 'mongodb');
});

db.on('reconnected', () => {
  log('MongoDB reconnected', 'mongodb');
});

db.on('disconnected', () => {
  log('MongoDB disconnected', 'mongodb');
});

// Export mongoose for use in models
export { mongoose };