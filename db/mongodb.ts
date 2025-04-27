import mongoose from 'mongoose';
import { MongoClient, ServerApiVersion } from 'mongodb';
import { log } from '../server/vite';

// MongoDB connection URL from environment variable
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/todo_app';
const DB_NAME = "ElegantTodosDB"; // Your database name

// Connect to MongoDB with timeout
export const connectToMongoDB = async (): Promise<void> => {
  return new Promise<void>(async (resolve) => {
    console.log('Starting MongoDB connection process...');
    
    // Set timeout to avoid hanging the server startup
    const timeout = setTimeout(() => {
      console.error('MongoDB connection timeout - proceeding with local storage mode');
      log('MongoDB connection timeout - using local storage fallback', 'mongodb');
      resolve();
    }, 10000); // 10 second timeout
    
    try {
      console.log('Attempting to connect to MongoDB...');
      console.log(`MongoDB URI: ${MONGODB_URI.slice(0, 15)}...`); // Only show the beginning for security

      // Simplified connection - using just Mongoose with appropriate options
      await mongoose.connect(MONGODB_URI, {
        serverSelectionTimeoutMS: 8000,  
        socketTimeoutMS: 10000,
        connectTimeoutMS: 10000,
        dbName: DB_NAME,
        ssl: true,           // Enable SSL for secure connections
        tls: true,           // Enable TLS for secure connections
      });
      
      clearTimeout(timeout);
      console.log('Connected to MongoDB successfully!');
      log('Connected to MongoDB with database: ' + DB_NAME, 'mongodb');
      resolve();
    } catch (error) {
      clearTimeout(timeout);
      console.error('Error connecting to MongoDB:', error);
      log(`Error connecting to MongoDB: ${error}`, 'mongodb');
      
      // Fallback to local in-memory mode for testing/development
      log('Starting server without MongoDB connection - using local storage fallback', 'mongodb');
      resolve();
    } finally {
      console.log('MongoDB connection process completed');
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