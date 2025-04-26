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

/**
 * Calculates the Levenshtein distance between two strings
 * This measures how many single-character edits it takes to transform one string into another
 */
export function levenshteinDistance(a: string, b: string): number {
  const matrix: number[][] = [];
  
  // Initialize the matrix
  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }
  
  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }
  
  // Fill in the matrix
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          Math.min(
            matrix[i][j - 1] + 1,   // insertion
            matrix[i - 1][j] + 1    // deletion
          )
        );
      }
    }
  }
  
  return matrix[b.length][a.length];
}

/**
 * Calculates a similarity score between two strings (0-100)
 * Higher score means more similar
 */
export function similarityScore(a: string, b: string): number {
  if (!a || !b) return 0;
  
  // Normalize strings for comparison
  const str1 = a.toLowerCase().trim();
  const str2 = b.toLowerCase().trim();
  
  // Exact match gets 100
  if (str1 === str2) return 100;
  
  // Check if one is a substring of the other
  if (str1.includes(str2) || str2.includes(str1)) {
    // Longer the overlap, higher the score (up to 90)
    const longerStr = str1.length > str2.length ? str1 : str2;
    const shorterStr = str1.length > str2.length ? str2 : str1;
    return Math.min(90, Math.round((shorterStr.length / longerStr.length) * 100));
  }
  
  // Calculate Levenshtein distance
  const distance = levenshteinDistance(str1, str2);
  const maxLength = Math.max(str1.length, str2.length);
  
  // Convert distance to a similarity percentage
  const similarity = Math.max(0, Math.round((1 - distance / maxLength) * 100));
  
  return similarity;
}

/**
 * Performs a fuzzy search on todo items
 * Returns matched todos sorted by relevance
 */
export function fuzzySearchTodos(todos: Todo[], searchTerm: string): Todo[] {
  if (!searchTerm || !searchTerm.trim()) return todos;
  
  const normalizedSearchTerm = searchTerm.toLowerCase().trim();
  
  // Special case - search for "completed" or "done" to get completed tasks
  if (normalizedSearchTerm === "completed" || normalizedSearchTerm === "done") {
    return todos.filter(todo => todo.completed);
  }
  
  // Special case - search for "active" or "incomplete" to get active tasks
  if (normalizedSearchTerm === "active" || normalizedSearchTerm === "incomplete") {
    return todos.filter(todo => !todo.completed);
  }
  
  return todos
    .map(todo => {
      // Initial score based on main text match
      let score = similarityScore(todo.text, normalizedSearchTerm);
      
      // Check notes for matches too (we give this equal importance)
      if (todo.notes) {
        const notesScore = similarityScore(todo.notes, normalizedSearchTerm);
        // Take the better score between text and notes
        score = Math.max(score, notesScore);
      }
      
      // Check for exact substring matches and boost score
      if (todo.text.toLowerCase().includes(normalizedSearchTerm)) {
        score += 30; // Significant boost for direct text substring match
      }
      
      if (todo.notes && todo.notes.toLowerCase().includes(normalizedSearchTerm)) {
        score += 30; // Significant boost for direct notes substring match
      }
      
      // Check category
      if (todo.category) {
        const categoryScore = similarityScore(todo.category, normalizedSearchTerm);
        if (categoryScore > 50) { // Lower threshold for category matches
          score = Math.max(score, categoryScore);
        }
      }
      
      // Check due date
      if (todo.dueDate && (normalizedSearchTerm.includes("due") || normalizedSearchTerm.includes("date"))) {
        const formattedDate = formatDate(todo.dueDate);
        if (formattedDate.toLowerCase().includes(normalizedSearchTerm.replace(/due|date/g, "").trim())) {
          score += 40; // Higher boost for date relevance
        }
      }
      
      // Give a small baseline score to ensure results when terms are very different
      score = Math.max(score, 5);
      
      return { todo, score };
    })
    .filter(item => item.score > 10) // Lower threshold to include more potential matches
    .sort((a, b) => b.score - a.score) // Sort by score descending
    .map(item => item.todo); // Return just the todos
}
