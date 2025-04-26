import { cn } from "@/lib/utils";
import { Todo } from "@/lib/utils";
import { Draggable } from "react-beautiful-dnd";
import { Checkbox } from "@/components/ui/checkbox";
import { GripVertical, Pencil, Trash2 } from "lucide-react";

interface TodoItemProps {
  todo: Todo;
  index: number;
  onToggleComplete: (id: string) => void;
  onEdit: (todo: Todo) => void;
  onDelete: (id: string) => void;
}

export function TodoItem({ todo, index, onToggleComplete, onEdit, onDelete }: TodoItemProps) {
  return (
    <Draggable draggableId={todo.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          className={cn(
            "todo-item bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 flex items-center gap-3 border border-gray-200 dark:border-gray-700",
            todo.completed && "completed-item bg-gray-50 dark:bg-gray-900",
            todo.priority && "bg-red-50 dark:bg-red-900/30 border-red-100 dark:border-red-800",
            snapshot.isDragging && "opacity-50 bg-gray-50 dark:bg-gray-900"
          )}
        >
          <div
            {...provided.dragHandleProps}
            className="drag-handle text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors"
          >
            <GripVertical size={18} />
          </div>
          
          <Checkbox
            id={`checkbox-${todo.id}`}
            checked={todo.completed}
            onCheckedChange={() => onToggleComplete(todo.id)}
            className={cn(
              "h-5 w-5 rounded cursor-pointer",
              todo.completed ? "text-green-500 focus:ring-green-500" : "text-primary focus:ring-primary"
            )}
          />
          
          <span
            className={cn(
              "todo-text flex-grow dark:text-gray-200",
              todo.completed && "text-gray-500 dark:text-gray-500"
            )}
          >
            {todo.text}
          </span>
          
          <button
            className="edit-todo-btn text-gray-500 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors"
            onClick={() => onEdit(todo)}
            aria-label="Edit todo"
          >
            <Pencil size={18} />
          </button>
          
          <button
            className="delete-todo-btn text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors"
            onClick={() => onDelete(todo.id)}
            aria-label="Delete todo"
          >
            <Trash2 size={18} />
          </button>
        </div>
      )}
    </Draggable>
  );
}
