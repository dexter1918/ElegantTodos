import mongoose from 'mongoose';
import { MongoClient, ServerApiVersion } from 'mongodb';
import { log } from '../server/vite';

// MongoDB connection URL
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/todo_app';
const DB_NAME = "ElegantTodosDB"; // Your database name

// Connect to MongoDB with timeout
export const connectToMongoDB = async (): Promise<void> => {
  return new Promise<void>(async (resolve) => {
    // Set timeout to avoid hanging the server startup
    const timeout = setTimeout(() => {
      console.error('MongoDB connection timeout - proceeding with local storage mode');
      log('MongoDB connection timeout - using local storage fallback', 'mongodb');
      resolve();
    }, 8000); // 8 second timeout
    
    try {
      console.log('Attempting to connect to MongoDB...');
      console.log(`MongoDB URI: ${MONGODB_URI.slice(0, 15)}...`); // Only show the beginning for security

      // MongoDB client options
      const clientOptions = {
        serverApi: {
          version: ServerApiVersion.v1,
          strict: true,
          deprecationErrors: true,
        },
        ssl: true,
        tlsAllowInvalidCertificates: false,
        tlsCAFile: undefined, // Atlas uses system CA certs
      };
      
      // Mongoose connection options
      const mongooseOptions = {
        serverSelectionTimeoutMS: 7000, // Default is 30 seconds
        connectTimeoutMS: 10000, // Default is no timeout
        dbName: DB_NAME, // Specify database name
        ssl: true,
        tls: true,
        tlsAllowInvalidCertificates: false,
      };
      
      // Try the direct MongoClient connection first to verify connectivity
      try {
        const client = new MongoClient(MONGODB_URI, clientOptions);
        await client.connect();
        await client.db("admin").command({ ping: 1 });
        console.log("✓ MongoDB Atlas ping successful!");
        await client.close();
      } catch (pingError) {
        console.error("MongoDB Atlas ping failed:", pingError);
        throw pingError; // Rethrow to be caught by the outer try/catch
      }
      
      // If ping successful, connect with Mongoose
      await mongoose.connect(MONGODB_URI, mongooseOptions);
      
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