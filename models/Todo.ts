import { mongoose } from '../db/mongodb';
import { Schema, Document } from 'mongoose';

// Interface to define a Todo document
export interface ITodo extends Document {
  id: string;
  text: string;
  completed: boolean;
  notes?: string;
  priority?: boolean;
  dueDate?: string;
  reminderEnabled?: boolean;
  reminderDate?: string;
  category?: 'work' | 'personal' | 'errands' | 'other';
  userId?: string; // Optional field for future user authentication
  createdAt: Date;
  updatedAt: Date;
}

// Define the schema for the Todo model
const todoSchema = new Schema<ITodo>(
  {
    id: {
      type: String,
      required: true,
      unique: true
    },
    text: {
      type: String,
      required: true,
      trim: true
    },
    completed: {
      type: Boolean,
      default: false
    },
    notes: {
      type: String,
      trim: true
    },
    priority: {
      type: Boolean,
      default: false
    },
    dueDate: {
      type: String
    },
    reminderEnabled: {
      type: Boolean,
      default: false
    },
    reminderDate: {
      type: String
    },
    category: {
      type: String,
      enum: ['work', 'personal', 'errands', 'other']
    },
    userId: {
      type: String
    }
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt fields
  }
);

// Create indexes for faster queries
// Note: We don't need to explicitly index 'id' as it's already defined as unique
todoSchema.index({ userId: 1 });
todoSchema.index({ completed: 1 });
todoSchema.index({ text: 'text', notes: 'text' }); // Text index for search functionality

// Create and export the Todo model
export const Todo = mongoose.model<ITodo>('Todo', todoSchema);