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
            "todo-item bg-white rounded-lg shadow-sm p-4 flex items-center gap-3 border border-gray-200",
            todo.completed && "completed-item bg-gray-50",
            snapshot.isDragging && "opacity-50 bg-gray-50"
          )}
        >
          <div
            {...provided.dragHandleProps}
            className="drag-handle text-gray-400 hover:text-gray-600 transition-colors"
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
              "todo-text flex-grow",
              todo.completed && "text-gray-500"
            )}
          >
            {todo.text}
          </span>
          
          <button
            className="edit-todo-btn text-gray-500 hover:text-primary transition-colors"
            onClick={() => onEdit(todo)}
            aria-label="Edit todo"
          >
            <Pencil size={18} />
          </button>
          
          <button
            className="delete-todo-btn text-gray-500 hover:text-red-500 transition-colors"
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
