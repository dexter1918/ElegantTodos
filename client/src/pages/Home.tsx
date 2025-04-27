import { useState, useEffect } from "react";
import { AddTodoForm } from "@/components/AddTodoForm";
import { TodoList } from "@/components/TodoList";
import { TodoEditor } from "@/components/TodoEditor";
import { SearchBox } from "@/components/SearchBox";
import { useTodoStore } from "@/hooks/use-todo-store";
import { Todo } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

export default function Home() {
  const { 
    todos, 
    filteredTodos, 
    searchTerm,
    isLoading,
    error,
    loadTodos,
    addTodo, 
    updateTodo, 
    deleteTodo, 
    toggleCompleted, 
    reorderActive, 
    reorderCompleted 
  } = useTodoStore();
  
  // Load todos from API when component mounts
  useEffect(() => {
    loadTodos();
  }, [loadTodos]);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);

  const handleAddTodo = (text: string) => {
    addTodo(text);
  };

  const handleEditTodo = (todo: Todo) => {
    setEditingTodo(todo);
    setIsEditorOpen(true);
  };

  const handleSaveTodo = (todo: Todo) => {
    updateTodo(todo);
    setEditingTodo(null);
    setIsEditorOpen(false);
  };

  const handleCloseEditor = () => {
    setEditingTodo(null);
    setIsEditorOpen(false);
  };

  return (
    <div className="container max-w-3xl mx-auto p-4 sm:p-6 min-h-screen">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Todo List</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">Organize your tasks efficiently</p>
      </header>

      {/* Show error message if API fails */}
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <AddTodoForm onAddTodo={handleAddTodo} />
        <SearchBox />
      </div>

      {/* Show loading skeletons while loading */}
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center space-x-4">
              <Skeleton className="h-6 w-6 rounded-full" />
              <Skeleton className="h-12 w-full rounded-md" />
            </div>
          ))}
        </div>
      ) : (
        <TodoList
          todos={searchTerm ? filteredTodos : todos}
          onToggleComplete={toggleCompleted}
          onEdit={handleEditTodo}
          onDelete={deleteTodo}
          onReorderActive={reorderActive}
          onReorderCompleted={reorderCompleted}
        />
      )}

      <TodoEditor
        todo={editingTodo}
        isOpen={isEditorOpen}
        onClose={handleCloseEditor}
        onSave={handleSaveTodo}
      />
    </div>
  );
}
