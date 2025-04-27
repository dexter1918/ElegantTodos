import mongoose from 'mongoose';
import { log } from '../server/vite';

// MongoDB connection URL
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/todo_app';

// Connect to MongoDB
export const connectToMongoDB = async (): Promise<void> => {
  try {
    await mongoose.connect(MONGODB_URI);
    log('Connected to MongoDB', 'mongodb');
  } catch (error) {
    log(`Error connecting to MongoDB: ${error}`, 'mongodb');
    // Don't exit the process, as this might be a temporary failure
    // and we want the app to continue trying to connect
  }
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