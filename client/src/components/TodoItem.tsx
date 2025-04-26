import { useState } from "react";
import { 
  cn, 
  Todo, 
  formatDate, 
  isOverdue, 
  isDueSoon,
  getDaysUntilDue
} from "@/lib/utils";
import { Draggable } from "react-beautiful-dnd";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { 
  GripVertical, 
  Pencil, 
  Trash2, 
  Calendar, 
  Bell, 
  Clock 
} from "lucide-react";
import { DeleteConfirmation } from "./DeleteConfirmation";

interface TodoItemProps {
  todo: Todo;
  index: number;
  onToggleComplete: (id: string) => void;
  onEdit: (todo: Todo) => void;
  onDelete: (id: string) => void;
}

export function TodoItem({ todo, index, onToggleComplete, onEdit, onDelete }: TodoItemProps) {
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  
  const handleDeleteClick = () => {
    setShowDeleteConfirmation(true);
  };
  
  const handleDeleteCancel = () => {
    setShowDeleteConfirmation(false);
  };
  
  const handleDeleteConfirm = () => {
    onDelete(todo.id);
    setShowDeleteConfirmation(false);
  };
  
  return (
    <>
      <Draggable draggableId={todo.id} index={index}>
        {(provided: any, snapshot: any) => (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            className={cn(
              "todo-item bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 flex items-center gap-3 border border-gray-200 dark:border-gray-700 transition-all",
              todo.completed && "completed-item bg-gray-50 dark:bg-gray-900",
              todo.priority && "bg-red-50 dark:bg-red-900/30 border-red-100 dark:border-red-800",
              snapshot.isDragging && "opacity-80 shadow-md scale-[1.02] z-10"
            )}
          >
            <div
              {...provided.dragHandleProps}
              className="drag-handle flex items-center justify-center w-6 h-6 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors rounded cursor-grab active:cursor-grabbing"
              title="Drag to reorder"
            >
              <GripVertical size={16} />
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
            
            <div className="flex flex-col flex-grow">
              <span
                className={cn(
                  "todo-text dark:text-gray-200",
                  todo.completed && "text-gray-500 dark:text-gray-500"
                )}
              >
                {todo.text}
              </span>
              
              {/* Due date and reminder badges */}
              <div className="flex gap-2 mt-1">
                {todo.dueDate && (
                  <Badge 
                    variant="outline" 
                    className={cn(
                      "text-xs flex gap-1 items-center",
                      isOverdue(todo.dueDate) && !todo.completed && "bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800",
                      isDueSoon(todo.dueDate) && !todo.completed && !isOverdue(todo.dueDate) && "bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200 dark:border-amber-800",
                      todo.completed && "bg-gray-50 text-gray-500 dark:bg-gray-800 dark:text-gray-400 border-gray-200 dark:border-gray-700"
                    )}
                  >
                    <Calendar size={12} />
                    <span>
                      {isOverdue(todo.dueDate) && !todo.completed 
                        ? "Overdue" 
                        : isDueSoon(todo.dueDate) && !todo.completed
                          ? `Due ${getDaysUntilDue(todo.dueDate) === 0 ? "today" : "soon"}`
                          : formatDate(todo.dueDate)}
                    </span>
                  </Badge>
                )}
                
                {todo.reminderEnabled && todo.reminderDate && (
                  <Badge 
                    variant="outline" 
                    className="text-xs flex gap-1 items-center bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800"
                  >
                    <Bell size={12} />
                    <span>Reminder</span>
                  </Badge>
                )}
              </div>
            </div>
            
            <button
              className="edit-todo-btn text-gray-500 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors"
              onClick={() => onEdit(todo)}
              aria-label="Edit todo"
            >
              <Pencil size={18} />
            </button>
            
            <button
              className="delete-todo-btn text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors"
              onClick={handleDeleteClick}
              aria-label="Delete todo"
            >
              <Trash2 size={18} />
            </button>
          </div>
        )}
      </Draggable>
      
      <DeleteConfirmation
        isOpen={showDeleteConfirmation}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        taskText={todo.text}
      />
    </>
  );
}
