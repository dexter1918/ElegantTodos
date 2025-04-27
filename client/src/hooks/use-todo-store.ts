import { create } from "zustand";
import { Todo, reorderTodos, fuzzySearchTodos, loadTodos } from "@/lib/utils";
import { fetchTodos, createTodo, updateTodo as apiUpdateTodo, deleteTodo as apiDeleteTodo, toggleTodoCompletion, saveTodoOrder } from "@/lib/api-client";

// Helper function to update localStorage (used as fallback when API fails)
const saveToLocalStorage = (todos: Todo[]): void => {
  localStorage.setItem("todos", JSON.stringify(todos));
};

interface TodoState {
  todos: Todo[];
  searchTerm: string;
  filteredTodos: Todo[];
  isLoading: boolean;
  error: string | null;
  loadTodos: () => Promise<void>;
  addTodo: (text: string) => Promise<void>;
  updateTodo: (todo: Todo) => Promise<void>;
  deleteTodo: (id: string) => Promise<void>;
  toggleCompleted: (id: string) => Promise<void>;
  reorderActive: (startIndex: number, endIndex: number) => void;
  reorderCompleted: (startIndex: number, endIndex: number) => void;
  setSearchTerm: (term: string) => void;
}

export const useTodoStore = create<TodoState>((set, get) => ({
  // Start with localStorage data and then fetch from API
  todos: loadTodos(),
  searchTerm: "",
  filteredTodos: loadTodos(),
  isLoading: false,
  error: null,
  
  // Load todos from API
  loadTodos: async () => {
    set({ isLoading: true, error: null });
    try {
      const todos = await fetchTodos();
      set({ 
        todos, 
        filteredTodos: todos,
        isLoading: false 
      });
    } catch (error) {
      console.error("Failed to load todos:", error);
      set({ 
        error: "Failed to load todos. Using local data instead.",
        isLoading: false
      });
    }
  },
  
  setSearchTerm: (term) =>
    set((state) => {
      const filtered = term.trim() === "" 
        ? state.todos 
        : fuzzySearchTodos(state.todos, term);
      
      return { 
        searchTerm: term,
        filteredTodos: filtered
      };
    }),
  
  addTodo: async (text) => {
    set({ isLoading: true, error: null });
    try {
      const newTodo = await createTodo({
        text,
        completed: false
      });
      
      set((state) => {
        const updatedTodos = [newTodo, ...state.todos];
        
        // Update filtered todos based on search term
        const filtered = state.searchTerm.trim() === ""
          ? updatedTodos
          : fuzzySearchTodos(updatedTodos, state.searchTerm);
        
        // Save to localStorage as backup
        saveToLocalStorage(updatedTodos);
        
        return { 
          todos: updatedTodos,
          filteredTodos: filtered,
          isLoading: false
        };
      });
    } catch (error) {
      console.error("Failed to add todo:", error);
      set({ error: "Failed to add todo", isLoading: false });
      
      // Fallback to local storage in case of API error
      set((state) => {
        const fallbackTodo: Todo = {
          id: Math.random().toString(36).substring(2, 9),
          text,
          completed: false,
        };
        
        const updatedTodos = [fallbackTodo, ...state.todos];
        
        // Save locally
        saveToLocalStorage(updatedTodos);
        
        // Update filtered todos
        const filtered = state.searchTerm.trim() === ""
          ? updatedTodos
          : fuzzySearchTodos(updatedTodos, state.searchTerm);
        
        return { 
          todos: updatedTodos,
          filteredTodos: filtered
        };
      });
    }
  },
    
  updateTodo: async (todo) => {
    set({ isLoading: true, error: null });
    try {
      await apiUpdateTodo(todo);
      
      set((state) => {
        const updatedTodos = state.todos.map((t) =>
          t.id === todo.id ? todo : t
        );
        
        // Update filtered todos based on search term
        const filtered = state.searchTerm.trim() === ""
          ? updatedTodos
          : fuzzySearchTodos(updatedTodos, state.searchTerm);
        
        // Save to localStorage as backup
        saveToLocalStorage(updatedTodos);
        
        return { 
          todos: updatedTodos,
          filteredTodos: filtered,
          isLoading: false
        };
      });
    } catch (error) {
      console.error("Failed to update todo:", error);
      set({ error: "Failed to update todo", isLoading: false });
      
      // Fallback to local storage in case of API error
      set((state) => {
        const updatedTodos = state.todos.map((t) =>
          t.id === todo.id ? todo : t
        );
        
        // Save locally
        saveToLocalStorage(updatedTodos);
        
        // Update filtered todos
        const filtered = state.searchTerm.trim() === ""
          ? updatedTodos
          : fuzzySearchTodos(updatedTodos, state.searchTerm);
        
        return {
          todos: updatedTodos,
          filteredTodos: filtered
        };
      });
    }
  },
    
  deleteTodo: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await apiDeleteTodo(id);
      
      set((state) => {
        const updatedTodos = state.todos.filter((todo) => todo.id !== id);
        
        // Update filtered todos based on search term
        const filtered = state.searchTerm.trim() === ""
          ? updatedTodos
          : fuzzySearchTodos(updatedTodos, state.searchTerm);
        
        // Save to localStorage as backup
        saveToLocalStorage(updatedTodos);
        
        return { 
          todos: updatedTodos,
          filteredTodos: filtered,
          isLoading: false
        };
      });
    } catch (error) {
      console.error("Failed to delete todo:", error);
      set({ error: "Failed to delete todo", isLoading: false });
      
      // Fallback to local storage in case of API error
      set((state) => {
        const updatedTodos = state.todos.filter((todo) => todo.id !== id);
        
        // Save locally
        saveToLocalStorage(updatedTodos);
        
        // Update filtered todos
        const filtered = state.searchTerm.trim() === ""
          ? updatedTodos
          : fuzzySearchTodos(updatedTodos, state.searchTerm);
        
        return {
          todos: updatedTodos,
          filteredTodos: filtered
        };
      });
    }
  },
    
  toggleCompleted: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const updatedTodo = await toggleTodoCompletion(id);
      
      set((state) => {
        const updatedTodos = state.todos.map((todo) =>
          todo.id === id ? updatedTodo : todo
        );
        
        // Update filtered todos based on search term
        const filtered = state.searchTerm.trim() === ""
          ? updatedTodos
          : fuzzySearchTodos(updatedTodos, state.searchTerm);
        
        // Save to localStorage as backup
        saveToLocalStorage(updatedTodos);
        
        return { 
          todos: updatedTodos,
          filteredTodos: filtered,
          isLoading: false
        };
      });
    } catch (error) {
      console.error("Failed to toggle todo completion:", error);
      set({ error: "Failed to update todo status", isLoading: false });
      
      // Fallback to local storage in case of API error
      set((state) => {
        const updatedTodos = state.todos.map((todo) =>
          todo.id === id ? { ...todo, completed: !todo.completed } : todo
        );
        
        // Save locally
        saveToLocalStorage(updatedTodos);
        
        // Update filtered todos
        const filtered = state.searchTerm.trim() === ""
          ? updatedTodos
          : fuzzySearchTodos(updatedTodos, state.searchTerm);
        
        return {
          todos: updatedTodos,
          filteredTodos: filtered
        };
      });
    }
  },
    
  reorderActive: (startIndex, endIndex) =>
    set((state) => {
      const activeTodos = state.todos.filter((todo) => !todo.completed);
      const completedTodos = state.todos.filter((todo) => todo.completed);
      
      const reorderedActive = reorderTodos(activeTodos, startIndex, endIndex);
      const updatedTodos = [...reorderedActive, ...completedTodos];
      
      // Always save to localStorage first for immediate persistence
      saveToLocalStorage(updatedTodos);
      
      // Use setTimeout to avoid the flickering during dragging
      // and to handle API calls after UI update
      setTimeout(async () => {
        try {
          await saveTodoOrder(updatedTodos);
        } catch (error) {
          console.error("Failed to save todo order:", error);
          // Fallback to local storage already done
        }
      }, 0);
      
      // Update filtered todos based on search term
      const filtered = state.searchTerm.trim() === ""
        ? updatedTodos
        : fuzzySearchTodos(updatedTodos, state.searchTerm);
      
      return { 
        todos: updatedTodos,
        filteredTodos: filtered
      };
    }),
    
  reorderCompleted: (startIndex, endIndex) =>
    set((state) => {
      const activeTodos = state.todos.filter((todo) => !todo.completed);
      const completedTodos = state.todos.filter((todo) => todo.completed);
      
      const reorderedCompleted = reorderTodos(completedTodos, startIndex, endIndex);
      const updatedTodos = [...activeTodos, ...reorderedCompleted];
      
      // Always save to localStorage first for immediate persistence
      saveToLocalStorage(updatedTodos);
      
      // Use setTimeout to avoid the flickering during dragging
      // and to handle API calls after UI update
      setTimeout(async () => {
        try {
          await saveTodoOrder(updatedTodos);
        } catch (error) {
          console.error("Failed to save todo order:", error);
          // Fallback to local storage already done
        }
      }, 0);
      
      // Update filtered todos based on search term
      const filtered = state.searchTerm.trim() === ""
        ? updatedTodos
        : fuzzySearchTodos(updatedTodos, state.searchTerm);
      
      return { 
        todos: updatedTodos,
        filteredTodos: filtered
      };
    }),
}));
