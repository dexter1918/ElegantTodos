import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type Todo = {
  id: string;
  text: string;
  completed: boolean;
  notes?: string;
  priority?: boolean;
  dueDate?: string;
  category?: "work" | "personal" | "errands" | "other";
};

export function generateId(): string {
  return Date.now().toString() + Math.random().toString(36).substring(2, 10);
}

export function saveTodos(todos: Todo[]): void {
  localStorage.setItem("todos", JSON.stringify(todos));
}

export function loadTodos(): Todo[] {
  const stored = localStorage.getItem("todos");
  if (!stored) return [];
  
  try {
    return JSON.parse(stored) as Todo[];
  } catch (error) {
    console.error("Failed to parse todos from localStorage", error);
    return [];
  }
}

export function reorderTodos(
  list: Todo[],
  startIndex: number,
  endIndex: number
): Todo[] {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
}
