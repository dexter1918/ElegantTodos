import { Router, Request, Response } from 'express';
import { Todo } from '../models/Todo';
import { log } from './vite';

const todoRouter = Router();

// Get all todos
todoRouter.get('/', async (req: Request, res: Response) => {
  try {
    // Check if connected to MongoDB
    if (!Todo.db.readyState) {
      console.log('MongoDB not connected, returning empty todos array');
      return res.json([]);
    }
    
    try {
      const todos = await Todo.find({});
      // Sort in memory since we have a custom find implementation
      const sortedTodos = todos.sort((a: any, b: any) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      res.json(sortedTodos);
    } catch (sortError) {
      console.error('Error sorting todos:', sortError);
      const todos = await Todo.find({});
      res.json(todos);
    }
  } catch (error) {
    console.error('Error getting todos:', error);
    log(`Error getting todos: ${error}`, 'api');
    res.status(500).json({ error: 'Failed to fetch todos' });
  }
});

// Search todos (text search through text and notes fields)
todoRouter.get('/search/:term', async (req: Request, res: Response) => {
  try {
    // Check if connected to MongoDB
    if (!Todo.db.readyState) {
      console.log('MongoDB not connected, returning empty search results');
      return res.json([]);
    }
    
    const searchTerm = req.params.term;
    
    try {
      // We need to do this differently with our custom Todo implementation
      const todos = await Todo.find();
      
      // Implement simple search logic in-memory
      const filteredTodos = todos.filter((todo: any) => {
        const text = todo.text || '';
        const notes = todo.notes || '';
        return text.toLowerCase().includes(searchTerm.toLowerCase()) || 
               notes.toLowerCase().includes(searchTerm.toLowerCase());
      });
      
      res.json(filteredTodos);
    } catch (searchError) {
      console.error('Error processing search:', searchError);
      // Fallback to empty results
      res.json([]);
    }
  } catch (error) {
    console.error('Error searching todos:', error);
    log(`Error searching todos: ${error}`, 'api');
    res.status(500).json({ error: 'Failed to search todos' });
  }
});

// Get a single todo by id
todoRouter.get('/:id', async (req: Request, res: Response) => {
  try {
    // Check if connected to MongoDB
    if (!Todo.db.readyState) {
      console.log('MongoDB not connected, returning 404 for individual todo fetch');
      return res.status(404).json({ error: 'Todo not found - MongoDB disconnected' });
    }
    
    const todo = await Todo.findOne({ id: req.params.id });
    if (!todo) {
      return res.status(404).json({ error: 'Todo not found' });
    }
    res.json(todo);
  } catch (error) {
    console.error('Error getting todo:', error);
    log(`Error getting todo ${req.params.id}: ${error}`, 'api');
    res.status(500).json({ error: 'Failed to fetch todo' });
  }
});

// Create a new todo
todoRouter.post('/', async (req: Request, res: Response) => {
  try {
    // Check if connected to MongoDB
    if (!Todo.db.readyState) {
      console.log('MongoDB not connected, returning client-side created todo');
      return res.status(201).json(req.body); // Return the todo as-is for client-side storage
    }
    
    // Use the custom saveTask method that handles collection routing
    const savedTodo = await Todo.saveTask(req.body);
    res.status(201).json(savedTodo);
  } catch (error) {
    console.error('Error creating todo:', error);
    log(`Error creating todo: ${error}`, 'api');
    
    // Fall back to client-side storage
    res.status(201).json(req.body);
  }
});

// Update a todo
todoRouter.put('/:id', async (req: Request, res: Response) => {
  try {
    // Check if connected to MongoDB
    if (!Todo.db.readyState) {
      console.log('MongoDB not connected, returning updated todo for client-side storage');
      return res.json(req.body); // Return the todo as-is for client-side storage
    }
    
    const updatedTodo = await Todo.findOneAndUpdate(
      { id: req.params.id },
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!updatedTodo) {
      return res.status(404).json({ error: 'Todo not found' });
    }
    
    res.json(updatedTodo);
  } catch (error) {
    console.error('Error updating todo:', error);
    log(`Error updating todo ${req.params.id}: ${error}`, 'api');
    
    // Fall back to client-side storage
    res.json(req.body);
  }
});

// Toggle todo completion status
todoRouter.patch('/:id/toggle', async (req: Request, res: Response) => {
  try {
    // Check if connected to MongoDB
    if (!Todo.db.readyState) {
      console.log('MongoDB not connected, returning toggled todo for client-side storage');
      const toggledTodo = req.body;
      toggledTodo.completed = !toggledTodo.completed;
      return res.json(toggledTodo);
    }
    
    const todo = await Todo.findOne({ id: req.params.id });
    
    if (!todo) {
      return res.status(404).json({ error: 'Todo not found' });
    }
    
    todo.completed = !todo.completed;
    const updatedTodo = await todo.save();
    
    res.json(updatedTodo);
  } catch (error) {
    console.error('Error toggling todo completion:', error);
    log(`Error toggling todo ${req.params.id}: ${error}`, 'api');
    
    // Create a fallback response
    const fallbackTodo = { 
      id: req.params.id,
      completed: req.body.completed // We'll just toggle whatever was sent
    };
    res.json(fallbackTodo);
  }
});

// Delete a todo
todoRouter.delete('/:id', async (req: Request, res: Response) => {
  try {
    // Check if connected to MongoDB
    if (!Todo.db.readyState) {
      console.log('MongoDB not connected, returning success for client-side delete');
      return res.json({ message: 'Todo deleted successfully (client-side only)' });
    }
    
    const deletedTodo = await Todo.findOneAndDelete({ id: req.params.id });
    
    if (!deletedTodo) {
      return res.status(404).json({ error: 'Todo not found' });
    }
    
    res.json({ message: 'Todo deleted successfully' });
  } catch (error) {
    console.error('Error deleting todo:', error);
    log(`Error deleting todo ${req.params.id}: ${error}`, 'api');
    
    // Fall back to a successful response for client-side storage
    res.json({ message: 'Todo marked for deletion (client-side fallback)' });
  }
});

export default todoRouter;