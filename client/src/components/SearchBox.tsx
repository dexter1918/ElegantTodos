import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";
import { useTodoStore } from "@/hooks/use-todo-store";
import { cn } from "@/lib/utils";

export function SearchBox() {
  const { searchTerm, setSearchTerm } = useTodoStore();
  const [expanded, setExpanded] = useState(!!searchTerm);
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Focus input when expanded
  useEffect(() => {
    if (expanded && inputRef.current) {
      inputRef.current.focus();
    }
  }, [expanded]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  
  const handleClear = () => {
    setSearchTerm("");
    if (!expanded) return;
    
    // If there's no search term and the user clicks clear, collapse the search box
    if (!searchTerm) {
      setExpanded(false);
    }
  };
  
  const handleToggleExpand = () => {
    setExpanded(prev => !prev);
  };
  
  return (
    <div className="relative flex items-center max-w-md mb-6">
      <div className={cn(
        "flex items-center w-full transition-all duration-300 ease-in-out bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden",
        expanded ? "w-full opacity-100" : "w-10 opacity-80"
      )}>
        <button 
          onClick={handleToggleExpand}
          className="p-2 text-gray-500 dark:text-gray-400 hover:text-primary dark:hover:text-primary"
          aria-label={expanded ? "Collapse search" : "Expand search"}
        >
          <Search size={20} />
        </button>
        
        <Input
          ref={inputRef}
          type="text"
          placeholder="Search todos (text, category, notes...)"
          value={searchTerm}
          onChange={handleChange}
          className={cn(
            "flex-1 border-0 focus-visible:ring-0 focus-visible:ring-offset-0 transition-all duration-300",
            !expanded && "w-0 p-0 opacity-0"
          )}
        />
        
        {(searchTerm || expanded) && (
          <button
            onClick={handleClear}
            className={cn(
              "p-2 text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors",
              !expanded && "hidden"
            )}
            aria-label="Clear search"
          >
            <X size={18} />
          </button>
        )}
      </div>
      
      {searchTerm && (
        <div className="absolute -bottom-6 left-0 text-sm text-gray-500 dark:text-gray-400">
          Searching for: <span className="font-medium text-primary">{searchTerm}</span>
          <span className="ml-1 text-xs text-gray-400 dark:text-gray-500">
            (in task text, notes, categories)
          </span>
        </div>
      )}
    </div>
  );
}