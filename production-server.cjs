// Simple production server for Render deployment
const express = require('express');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const mongoose = require('mongoose');

// MongoDB connection
const connectToMongoDB = async () => {
  const MONGODB_URI = process.env.MONGODB_URI;
  
  if (!MONGODB_URI) {
    console.error('MongoDB URI is not defined in environment variables');
    throw new Error('MongoDB URI is not defined');
  }
  
  console.log('Attempting to connect to MongoDB...');
  console.log(`MongoDB URI: ${MONGODB_URI.replace(/\/\/(.+?):(.+?)@/, '//***:***@')}`);
  
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB successfully!');
    return true;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
};

// Todo model setup for MongoDB
const setupTodoModel = () => {
  const { Schema } = mongoose;
  
  const todoSchema = new Schema({
    id: { type: String, required: true, unique: true },
    text: { type: String, required: true },
    completed: { type: Boolean, default: false },
    notes: String,
    priority: Boolean,
    dueDate: String,
    reminderEnabled: Boolean,
    reminderDate: String,
    category: { 
      type: String, 
      enum: ['work', 'personal', 'errands', 'other'],
      required: false 
    },
    userId: String,
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
  });
  
  // Return models for both active and completed tasks
  const ActiveTasks = mongoose.models.ActiveTasks || mongoose.model('ActiveTasks', todoSchema);
  const CompletedTasks = mongoose.models.CompletedTasks || mongoose.model('CompletedTasks', todoSchema);
  
  return {
    ActiveTasks,
    CompletedTasks,
    // Helper methods for task operations
    findAllTasks: async () => {
      const activeTasks = await ActiveTasks.find().sort({ createdAt: -1 });
      const completedTasks = await CompletedTasks.find().sort({ createdAt: -1 });
      return [...activeTasks, ...completedTasks];
    },
    findById: async (id) => {
      const task = await ActiveTasks.findOne({ id }) || await CompletedTasks.findOne({ id });
      return task;
    },
    createTask: async (taskData) => {
      const task = new ActiveTasks(taskData);
      await task.save();
      return task;
    },
    updateTask: async (id, taskData) => {
      // Find in both collections
      const activeTask = await ActiveTasks.findOne({ id });
      if (activeTask) {
        Object.assign(activeTask, taskData, { updatedAt: new Date() });
        await activeTask.save();
        return activeTask;
      }
      
      const completedTask = await CompletedTasks.findOne({ id });
      if (completedTask) {
        Object.assign(completedTask, taskData, { updatedAt: new Date() });
        await completedTask.save();
        return completedTask;
      }
      
      return null;
    },
    deleteTask: async (id) => {
      // Try to delete from both collections
      const activeResult = await ActiveTasks.deleteOne({ id });
      const completedResult = await CompletedTasks.deleteOne({ id });
      return activeResult.deletedCount > 0 || completedResult.deletedCount > 0;
    },
    toggleCompleted: async (id) => {
      // Find the task
      const activeTask = await ActiveTasks.findOne({ id });
      const completedTask = await CompletedTasks.findOne({ id });
      
      if (activeTask) {
        // Move to completed
        const completedTaskData = activeTask.toObject();
        const newCompletedTask = new CompletedTasks(completedTaskData);
        await newCompletedTask.save();
        await ActiveTasks.deleteOne({ id });
        return newCompletedTask;
      } else if (completedTask) {
        // Move to active
        const activeTaskData = completedTask.toObject();
        const newActiveTask = new ActiveTasks(activeTaskData);
        await newActiveTask.save();
        await CompletedTasks.deleteOne({ id });
        return newActiveTask;
      }
      
      return null;
    },
    searchTasks: async (term) => {
      const regex = new RegExp(term, 'i');
      const query = {
        $or: [
          { text: regex },
          { notes: regex },
          { category: regex }
        ]
      };
      
      const activeTasks = await ActiveTasks.find(query);
      const completedTasks = await CompletedTasks.find(query);
      return [...activeTasks, ...completedTasks];
    }
  };
};

// Application setup
const app = express();

// Enable CORS
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? [
        "https://eleganttodos.onrender.com",
        "https://eleganttodos.onrender.com/",
        "http://localhost:5000", 
        "http://localhost:3000"
      ]
    : "*",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
  optionsSuccessStatus: 204
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Set up logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      console.log(logLine);
    }
  });

  next();
});

// Start the server
const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectToMongoDB();
    
    // Set up Todo model
    const TodoModel = setupTodoModel();
    
    // Setup API routes
    app.get('/api/todos', async (req, res) => {
      try {
        const todos = await TodoModel.findAllTasks();
        res.json(todos);
      } catch (error) {
        console.error('Error fetching todos:', error);
        res.status(500).json({ message: 'Error fetching todos' });
      }
    });
    
    app.get('/api/todos/search/:term', async (req, res) => {
      try {
        const { term } = req.params;
        const todos = await TodoModel.searchTasks(term);
        res.json(todos);
      } catch (error) {
        console.error('Error searching todos:', error);
        res.status(500).json({ message: 'Error searching todos' });
      }
    });
    
    app.get('/api/todos/:id', async (req, res) => {
      try {
        const { id } = req.params;
        const todo = await TodoModel.findById(id);
        if (!todo) {
          return res.status(404).json({ message: 'Todo not found' });
        }
        res.json(todo);
      } catch (error) {
        console.error('Error fetching todo:', error);
        res.status(500).json({ message: 'Error fetching todo' });
      }
    });
    
    app.post('/api/todos', async (req, res) => {
      try {
        const todo = await TodoModel.createTask(req.body);
        res.status(201).json(todo);
      } catch (error) {
        console.error('Error creating todo:', error);
        res.status(500).json({ message: 'Error creating todo' });
      }
    });
    
    app.put('/api/todos/:id', async (req, res) => {
      try {
        const { id } = req.params;
        const updatedTodo = await TodoModel.updateTask(id, req.body);
        if (!updatedTodo) {
          return res.status(404).json({ message: 'Todo not found' });
        }
        res.json(updatedTodo);
      } catch (error) {
        console.error('Error updating todo:', error);
        res.status(500).json({ message: 'Error updating todo' });
      }
    });
    
    app.patch('/api/todos/:id/toggle', async (req, res) => {
      try {
        const { id } = req.params;
        const updatedTodo = await TodoModel.toggleCompleted(id);
        if (!updatedTodo) {
          return res.status(404).json({ message: 'Todo not found' });
        }
        res.json(updatedTodo);
      } catch (error) {
        console.error('Error toggling todo:', error);
        res.status(500).json({ message: 'Error toggling todo' });
      }
    });
    
    app.delete('/api/todos/:id', async (req, res) => {
      try {
        const { id } = req.params;
        const deleted = await TodoModel.deleteTask(id);
        if (!deleted) {
          return res.status(404).json({ message: 'Todo not found' });
        }
        res.status(204).end();
      } catch (error) {
        console.error('Error deleting todo:', error);
        res.status(500).json({ message: 'Error deleting todo' });
      }
    });
    
    // Serve static files if available
    const staticDir = path.join(__dirname, 'server', 'public');
    if (fs.existsSync(staticDir)) {
      app.use(express.static(staticDir));
      
      // Create a fallback index.html if it doesn't exist
      const indexPath = path.join(staticDir, 'index.html');
      if (!fs.existsSync(indexPath)) {
        console.warn('index.html not found, creating fallback');
        const fallbackHtml = `
          <!DOCTYPE html>
          <html lang="en">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>ElegantTodos</title>
            <style>
              body { font-family: system-ui, sans-serif; line-height: 1.5; padding: 2rem; max-width: 600px; margin: 0 auto; }
              h1 { color: #3b82f6; }
              p { margin: 1rem 0; }
              code { background: #f1f5f9; padding: 0.2rem 0.4rem; border-radius: 0.25rem; }
            </style>
          </head>
          <body>
            <h1>ElegantTodos</h1>
            <p>The API server is running correctly, but the frontend build failed.</p>
            <p>Check the deployment logs for more information.</p>
            <p>API endpoints are available at <code>/api/todos</code></p>
          </body>
          </html>
        `;
        fs.writeFileSync(indexPath, fallbackHtml);
      }
      
      // Serve index.html for all other routes (SPA)
      app.get('*', (req, res) => {
        if (req.path.startsWith('/api')) {
          return res.status(404).json({ error: 'API endpoint not found' });
        }
        res.sendFile(path.join(staticDir, 'index.html'));
      });
    } else {
      console.warn('Static directory not found:', staticDir);
      // Create directory and fallback file
      fs.mkdirSync(staticDir, { recursive: true });
      const fallbackHtml = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>ElegantTodos</title>
          <style>
            body { font-family: system-ui, sans-serif; line-height: 1.5; padding: 2rem; max-width: 600px; margin: 0 auto; }
            h1 { color: #3b82f6; }
            p { margin: 1rem 0; }
          </style>
        </head>
        <body>
          <h1>ElegantTodos API</h1>
          <p>The API server is running, but the frontend is not available.</p>
          <p>This may be due to a build failure or missing static files.</p>
        </body>
        </html>
      `;
      fs.writeFileSync(path.join(staticDir, 'index.html'), fallbackHtml);
      app.use(express.static(staticDir));
      
      // API-only mode fallback with HTML response
      app.get('*', (req, res) => {
        if (req.path.startsWith('/api')) {
          return res.status(404).json({ error: 'API endpoint not found' });
        }
        res.sendFile(path.join(staticDir, 'index.html'));
      });
    }
    
    // Start the server
    const PORT = process.env.PORT || 10000;
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`ElegantTodos server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Start the application
startServer();