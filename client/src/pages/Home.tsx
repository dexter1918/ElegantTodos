import { useState } from "react";
import { AddTodoForm } from "@/components/AddTodoForm";
import { TodoList } from "@/components/TodoList";
import { TodoEditor } from "@/components/TodoEditor";
import { useTodoStore } from "@/hooks/use-todo-store";
import { Todo } from "@/lib/utils";

export default function Home() {
  const { todos, addTodo, updateTodo, deleteTodo, toggleCompleted, reorderActive, reorderCompleted } = useTodoStore();
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
        <h1 className="text-3xl font-bold text-gray-800">Todo List</h1>
        <p className="text-gray-600 mt-2">Organize your tasks efficiently</p>
      </header>

      <AddTodoForm onAddTodo={handleAddTodo} />

      <TodoList
        todos={todos}
        onToggleComplete={toggleCompleted}
        onEdit={handleEditTodo}
        onDelete={deleteTodo}
        onReorderActive={reorderActive}
        onReorderCompleted={reorderCompleted}
      />

      <TodoEditor
        todo={editingTodo}
        isOpen={isEditorOpen}
        onClose={handleCloseEditor}
        onSave={handleSaveTodo}
      />
    </div>
  );
}
