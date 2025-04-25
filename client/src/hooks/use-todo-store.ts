import { create } from "zustand";
import { Todo, saveTodos, loadTodos, generateId, reorderTodos } from "@/lib/utils";

interface TodoState {
  todos: Todo[];
  addTodo: (text: string) => void;
  updateTodo: (todo: Todo) => void;
  deleteTodo: (id: string) => void;
  toggleCompleted: (id: string) => void;
  reorderActive: (startIndex: number, endIndex: number) => void;
  reorderCompleted: (startIndex: number, endIndex: number) => void;
}

export const useTodoStore = create<TodoState>((set) => ({
  todos: loadTodos(),
  
  addTodo: (text) =>
    set((state) => {
      const newTodo: Todo = {
        id: generateId(),
        text,
        completed: false,
      };
      const updatedTodos = [newTodo, ...state.todos];
      saveTodos(updatedTodos);
      return { todos: updatedTodos };
    }),
    
  updateTodo: (updatedTodo) =>
    set((state) => {
      const updatedTodos = state.todos.map((todo) =>
        todo.id === updatedTodo.id ? updatedTodo : todo
      );
      saveTodos(updatedTodos);
      return { todos: updatedTodos };
    }),
    
  deleteTodo: (id) =>
    set((state) => {
      const updatedTodos = state.todos.filter((todo) => todo.id !== id);
      saveTodos(updatedTodos);
      return { todos: updatedTodos };
    }),
    
  toggleCompleted: (id) =>
    set((state) => {
      const updatedTodos = state.todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      );
      saveTodos(updatedTodos);
      return { todos: updatedTodos };
    }),
    
  reorderActive: (startIndex, endIndex) =>
    set((state) => {
      const activeTodos = state.todos.filter((todo) => !todo.completed);
      const completedTodos = state.todos.filter((todo) => todo.completed);
      
      const reorderedActive = reorderTodos(activeTodos, startIndex, endIndex);
      const updatedTodos = [...reorderedActive, ...completedTodos];
      
      saveTodos(updatedTodos);
      return { todos: updatedTodos };
    }),
    
  reorderCompleted: (startIndex, endIndex) =>
    set((state) => {
      const activeTodos = state.todos.filter((todo) => !todo.completed);
      const completedTodos = state.todos.filter((todo) => todo.completed);
      
      const reorderedCompleted = reorderTodos(completedTodos, startIndex, endIndex);
      const updatedTodos = [...activeTodos, ...reorderedCompleted];
      
      saveTodos(updatedTodos);
      return { todos: updatedTodos };
    }),
}));
