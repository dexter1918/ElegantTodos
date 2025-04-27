import type { Express } from "express";
import { createServer, type Server } from "http";
import todoRouter from "./todoRoutes";
import { connectToMongoDB } from "../db/mongodb";

export async function registerRoutes(app: Express): Promise<Server> {
  try {
    // Connect to MongoDB when the server starts
    console.log('Starting MongoDB connection process...');
    await connectToMongoDB();
    console.log('MongoDB connection process completed');
  } catch (err) {
    console.error('MongoDB connection error (caught in routes):', err);
    // We'll continue anyway, using localStorage fallback
  }
  
  // Register todo API routes
  app.use('/api/todos', todoRouter);

  const httpServer = createServer(app);

  return httpServer;
}
