import { create } from "zustand";
import { Todo, saveTodos, loadTodos, generateId, reorderTodos, fuzzySearchTodos } from "@/lib/utils";

interface TodoState {
  todos: Todo[];
  searchTerm: string;
  filteredTodos: Todo[];
  addTodo: (text: string) => void;
  updateTodo: (todo: Todo) => void;
  deleteTodo: (id: string) => void;
  toggleCompleted: (id: string) => void;
  reorderActive: (startIndex: number, endIndex: number) => void;
  reorderCompleted: (startIndex: number, endIndex: number) => void;
  setSearchTerm: (term: string) => void;
}

export const useTodoStore = create<TodoState>((set, get) => ({
  todos: loadTodos(),
  searchTerm: "",
  filteredTodos: loadTodos(),
  
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
  
  addTodo: (text) =>
    set((state) => {
      const newTodo: Todo = {
        id: generateId(),
        text,
        completed: false,
      };
      const updatedTodos = [newTodo, ...state.todos];
      saveTodos(updatedTodos);
      
      // Update filtered todos based on search term
      const filtered = state.searchTerm.trim() === ""
        ? updatedTodos
        : fuzzySearchTodos(updatedTodos, state.searchTerm);
      
      return { 
        todos: updatedTodos,
        filteredTodos: filtered
      };
    }),
    
  updateTodo: (updatedTodo) =>
    set((state) => {
      const updatedTodos = state.todos.map((todo) =>
        todo.id === updatedTodo.id ? updatedTodo : todo
      );
      saveTodos(updatedTodos);
      
      // Update filtered todos based on search term
      const filtered = state.searchTerm.trim() === ""
        ? updatedTodos
        : fuzzySearchTodos(updatedTodos, state.searchTerm);
      
      return { 
        todos: updatedTodos,
        filteredTodos: filtered
      };
    }),
    
  deleteTodo: (id) =>
    set((state) => {
      const updatedTodos = state.todos.filter((todo) => todo.id !== id);
      saveTodos(updatedTodos);
      
      // Update filtered todos based on search term
      const filtered = state.searchTerm.trim() === ""
        ? updatedTodos
        : fuzzySearchTodos(updatedTodos, state.searchTerm);
      
      return { 
        todos: updatedTodos,
        filteredTodos: filtered
      };
    }),
    
  toggleCompleted: (id) =>
    set((state) => {
      const updatedTodos = state.todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      );
      saveTodos(updatedTodos);
      
      // Update filtered todos based on search term
      const filtered = state.searchTerm.trim() === ""
        ? updatedTodos
        : fuzzySearchTodos(updatedTodos, state.searchTerm);
      
      return { 
        todos: updatedTodos,
        filteredTodos: filtered
      };
    }),
    
  reorderActive: (startIndex, endIndex) =>
    set((state) => {
      const activeTodos = state.todos.filter((todo) => !todo.completed);
      const completedTodos = state.todos.filter((todo) => todo.completed);
      
      const reorderedActive = reorderTodos(activeTodos, startIndex, endIndex);
      const updatedTodos = [...reorderedActive, ...completedTodos];
      
      // Use setTimeout to avoid the flickering during dragging
      setTimeout(() => saveTodos(updatedTodos), 0);
      
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
      
      // Use setTimeout to avoid the flickering during dragging
      setTimeout(() => saveTodos(updatedTodos), 0);
      
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
