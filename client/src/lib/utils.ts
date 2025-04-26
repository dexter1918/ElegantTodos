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
  reminderEnabled?: boolean;
  reminderDate?: string;
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

export function formatDate(dateString: string | undefined): string {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short', 
    day: 'numeric'
  });
}

export function isOverdue(dateString: string | undefined): boolean {
  if (!dateString) return false;
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const dueDate = new Date(dateString);
  
  return dueDate < today;
}

export function isDueSoon(dateString: string | undefined): boolean {
  if (!dateString) return false;
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const dueDate = new Date(dateString);
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  const dayAfterTomorrow = new Date(today);
  dayAfterTomorrow.setDate(today.getDate() + 2);
  
  return (dueDate >= today && dueDate <= dayAfterTomorrow);
}

export function getDaysUntilDue(dateString: string | undefined): number | null {
  if (!dateString) return null;
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const dueDate = new Date(dateString);
  dueDate.setHours(0, 0, 0, 0);
  
  const differenceInTime = dueDate.getTime() - today.getTime();
  const differenceInDays = Math.ceil(differenceInTime / (1000 * 3600 * 24));
  
  return differenceInDays;
}
