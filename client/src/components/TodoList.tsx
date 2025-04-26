import { Todo } from "@/lib/utils";
import { TodoItem } from "./TodoItem";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import { CircleCheck, CheckIcon, SearchX } from "lucide-react";
import { useTodoStore } from "@/hooks/use-todo-store";

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
  const { searchTerm } = useTodoStore();
  const isSearching = !!searchTerm.trim();
  const activeTodos = todos.filter((todo) => !todo.completed);
  const completedTodos = todos.filter((todo) => todo.completed);

  const handleDragEnd = (result: any) => {
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
      {isSearching && (
        <div className="mb-6 px-4 py-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-lg">
          <p className="text-sm text-blue-600 dark:text-blue-300 flex items-center">
            <SearchX size={16} className="mr-2" />
            Showing search results for "<span className="font-medium">{searchTerm}</span>"
            {todos.length === 0 ? (
              <span className="ml-1">- No matches found</span>
            ) : (
              <span className="ml-1">- {todos.length} {todos.length === 1 ? 'match' : 'matches'} found</span>
            )}
          </p>
        </div>
      )}
      
      <div id="todo-container" className="mb-8">
        <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100 flex items-center">
          <CircleCheck className="mr-2 text-primary" />
          {isSearching ? 'Matching Active Tasks' : 'Active Tasks'}
        </h2>

        <Droppable droppableId="active-todos">
          {(provided: any) => (
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
                  {isSearching ? (
                    <p className="text-gray-500 dark:text-gray-400">No matching active tasks found for "{searchTerm}"</p>
                  ) : (
                    <p className="text-gray-500 dark:text-gray-400">No active tasks. Add a new task to get started!</p>
                  )}
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
          {isSearching ? 'Matching Completed Tasks' : 'Completed Tasks'}
        </h2>

        <Droppable droppableId="completed-todos">
          {(provided: any) => (
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
                  {isSearching ? (
                    <p className="text-gray-500 dark:text-gray-400">No matching completed tasks found for "{searchTerm}"</p>
                  ) : (
                    <p className="text-gray-500 dark:text-gray-400">No completed tasks yet. Start by checking off a task!</p>
                  )}
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
