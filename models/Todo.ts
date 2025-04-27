import { mongoose } from '../db/mongodb';
import { Schema, Document, model, Model } from 'mongoose';

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
todoSchema.index({ text: 'text', notes: 'text' }); // Text index for search functionality

// Create models for both collections
const ActiveTaskModel = model<ITodo>('ActiveTask', todoSchema, 'ActiveTasks');
const CompletedTaskModel = model<ITodo>('CompletedTask', todoSchema, 'CompletedTasks');

// Define a type for our custom Todo model with extra methods
export interface TodoModelInterface extends Model<ITodo> {
  getModels: () => { 
    ActiveTaskModel: Model<ITodo>; 
    CompletedTaskModel: Model<ITodo> 
  };
  saveTask: (taskData: any) => Promise<Document<unknown, {}, ITodo> & ITodo>;
}

// Create a unified Todo "model" that handles both collections
export const Todo = {
  ...ActiveTaskModel,
  
  // Expose the models for direct access when needed
  getModels: () => {
    return { 
      ActiveTaskModel, 
      CompletedTaskModel 
    };
  },
  
  find: async (query: any = {}) => {
    // Combine results from both collections
    const activeTasks = await ActiveTaskModel.find(query);
    const completedTasks = await CompletedTaskModel.find(query);
    return [...activeTasks, ...completedTasks];
  },

  findOne: async ({ id, ...query }: any) => {
    // Try to find in active tasks first
    let task = await ActiveTaskModel.findOne({ id, ...query });
    if (!task) {
      // If not found, try completed tasks
      task = await CompletedTaskModel.findOne({ id, ...query });
    }
    return task;
  },

  // Custom save method that puts the task in the right collection
  saveTask: async (taskData: any) => {
    if (taskData.completed) {
      // Move to completed collection
      const completedTask = new CompletedTaskModel(taskData);
      // Delete from active if it exists there
      if (taskData.id) {
        await ActiveTaskModel.deleteOne({ id: taskData.id });
      }
      return await completedTask.save();
    } else {
      // Move to active collection
      const activeTask = new ActiveTaskModel(taskData);
      // Delete from completed if it exists there
      if (taskData.id) {
        await CompletedTaskModel.deleteOne({ id: taskData.id });
      }
      return await activeTask.save();
    }
  },
  
  // Override findOneAndUpdate to handle both collections
  findOneAndUpdate: async ({ id, ...query }: any, update: any, options: any) => {
    // Determine which model to use based on the completed status in the update
    if (update.completed === true) {
      // Move to completed if needed
      const task = await ActiveTaskModel.findOne({ id, ...query });
      if (task) {
        // First remove from active tasks
        await ActiveTaskModel.deleteOne({ id });
        // Then add to completed tasks
        const completedTask = new CompletedTaskModel({ ...task.toObject(), ...update });
        return await completedTask.save();
      }
      return await CompletedTaskModel.findOneAndUpdate({ id, ...query }, update, options);
    } else if (update.completed === false) {
      // Move to active if needed
      const task = await CompletedTaskModel.findOne({ id, ...query });
      if (task) {
        // First remove from completed tasks
        await CompletedTaskModel.deleteOne({ id });
        // Then add to active tasks
        const activeTask = new ActiveTaskModel({ ...task.toObject(), ...update });
        return await activeTask.save();
      }
      return await ActiveTaskModel.findOneAndUpdate({ id, ...query }, update, options);
    } else {
      // No change in completed status, try to update in both collections
      let result = await ActiveTaskModel.findOneAndUpdate({ id, ...query }, update, options);
      if (!result) {
        result = await CompletedTaskModel.findOneAndUpdate({ id, ...query }, update, options);
      }
      return result;
    }
  },
  
  // Override findOneAndDelete to handle both collections
  findOneAndDelete: async ({ id, ...query }: any) => {
    // Try to delete from both collections
    let result = await ActiveTaskModel.findOneAndDelete({ id, ...query });
    if (!result) {
      result = await CompletedTaskModel.findOneAndDelete({ id, ...query });
    }
    return result;
  },
  
  // Property to access the db
  db: mongoose.connection
};