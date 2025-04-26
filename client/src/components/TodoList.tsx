import { Todo } from "@/lib/utils";
import { TodoItem } from "./TodoItem";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import { CircleCheck, CheckIcon } from "lucide-react";

interface TodoListProps {
  todos: Todo[];
  onToggleComplete: (id: string) => void;
  onEdit: (todo: Todo) => void;
  onDelete: (id: string) => void;
  onReorderActive: (startIndex: number, endIndex: number) => void;
  onReorderCompleted: (startIndex: number, endIndex: number) => void;
}

export function TodoList({
  todos,
  onToggleComplete,
  onEdit,
  onDelete,
  onReorderActive,
  onReorderCompleted,
}: TodoListProps) {
  const activeTodos = todos.filter((todo) => !todo.completed);
  const completedTodos = todos.filter((todo) => todo.completed);

  const handleDragEnd = (result: DropResult) => {
    const { source, destination } = result;

    // Dropped outside a droppable area
    if (!destination) return;

    // Dropped in the same position
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    // Reordering active todos
    if (source.droppableId === "active-todos" && destination.droppableId === "active-todos") {
      onReorderActive(source.index, destination.index);
    }

    // Reordering completed todos
    if (source.droppableId === "completed-todos" && destination.droppableId === "completed-todos") {
      onReorderCompleted(source.index, destination.index);
    }

    // TODO: Handle moving between active and completed lists if needed
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div id="todo-container" className="mb-8">
        <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100 flex items-center">
          <CircleCheck className="mr-2 text-primary" />
          Active Tasks
        </h2>

        <Droppable droppableId="active-todos">
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className="space-y-3"
            >
              {activeTodos.length > 0 ? (
                activeTodos.map((todo, index) => (
                  <TodoItem
                    key={todo.id}
                    todo={todo}
                    index={index}
                    onToggleComplete={onToggleComplete}
                    onEdit={onEdit}
                    onDelete={onDelete}
                  />
                ))
              ) : (
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-8 text-center border border-dashed border-gray-300 dark:border-gray-700">
                  <CheckIcon className="h-10 w-10 text-gray-400 dark:text-gray-500 mx-auto mb-3" />
                  <p className="text-gray-500 dark:text-gray-400">No active tasks. Add a new task to get started!</p>
                </div>
              )}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </div>

      <div id="completed-container">
        <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100 flex items-center">
          <CheckIcon className="mr-2 text-green-500" />
          Completed Tasks
        </h2>

        <Droppable droppableId="completed-todos">
          {(provided: DroppableProvided) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className="space-y-3"
            >
              {completedTodos.length > 0 ? (
                completedTodos.map((todo, index) => (
                  <TodoItem
                    key={todo.id}
                    todo={todo}
                    index={index}
                    onToggleComplete={onToggleComplete}
                    onEdit={onEdit}
                    onDelete={onDelete}
                  />
                ))
              ) : (
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-8 text-center border border-dashed border-gray-300 dark:border-gray-700">
                  <CircleCheck className="h-10 w-10 text-gray-400 dark:text-gray-500 mx-auto mb-3" />
                  <p className="text-gray-500 dark:text-gray-400">No completed tasks yet. Start by checking off a task!</p>
                </div>
              )}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </div>
    </DragDropContext>
  );
}
