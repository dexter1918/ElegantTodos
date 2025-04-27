import { Todo } from "./utils";
import { apiRequest, getApiUrl } from "./queryClient";

// API endpoints for Todo CRUD operations
const TODO_API = "/api/todos";

// Get all todos
export const fetchTodos = async (): Promise<Todo[]> => {
  const response = await fetch(getApiUrl(TODO_API));
  
  if (!response.ok) {
    throw new Error("Failed to fetch todos");
  }
  
  const data = await response.json();
  return data;
};

// Create a new todo
export const createTodo = async (todo: Omit<Todo, "id">): Promise<Todo> => {
  const response = await apiRequest("POST", TODO_API, {
    ...todo,
    id: Math.random().toString(36).substring(2, 9), // Generate an id on the client side
  });
  
  const data = await response.json();
  return data;
};

// Update a todo
export const updateTodo = async (todo: Todo): Promise<Todo> => {
  const response = await apiRequest("PUT", `${TODO_API}/${todo.id}`, todo);
  
  const data = await response.json();
  return data;
};

// Delete a todo
export const deleteTodo = async (id: string): Promise<void> => {
  await apiRequest("DELETE", `${TODO_API}/${id}`);
};

// Toggle a todo's completion status
export const toggleTodoCompletion = async (id: string): Promise<Todo> => {
  const response = await apiRequest("PATCH", `${TODO_API}/${id}/toggle`, {});
  
  const data = await response.json();
  return data;
};

// Reorder todos - needs to be implemented server-side in a more advanced version
// For now, we'll update all todos at once
export const saveTodoOrder = async (todos: Todo[]): Promise<Todo[]> => {
  // This is a simple approach - in a production app, you might want a specialized endpoint
  // that efficiently handles reordering without sending all todo data
  const promises = todos.map(todo => updateTodo(todo));
  const results = await Promise.all(promises);
  return results;
};