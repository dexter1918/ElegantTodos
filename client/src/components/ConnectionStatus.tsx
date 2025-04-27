import { AlertCircle, CheckCircle, CloudOff, Database } from "lucide-react";
import { useTodoStore } from "@/hooks/use-todo-store";
import { useEffect } from "react";
import { fetchTodos } from "@/lib/api-client";

/**
 * Component to display the current connection status with the database
 */
export function ConnectionStatus() {
  const { connectionMode, setConnectionMode, error } = useTodoStore((state) => ({
    connectionMode: state.connectionMode,
    setConnectionMode: state.setConnectionMode,
    error: state.error
  }));

  // Check connection status on mount
  useEffect(() => {
    const checkConnection = async () => {
      try {
        await fetchTodos();
        setConnectionMode('mongoDB');
      } catch (error) {
        setConnectionMode('localStorage');
      }
    };
    
    checkConnection();
    
    // Set up interval to check connection status periodically
    const interval = setInterval(checkConnection, 30000);
    return () => clearInterval(interval);
  }, [setConnectionMode]);

  // Return nothing if still loading
  if (connectionMode === 'loading') {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className={`flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium ${
        connectionMode === 'mongoDB' 
          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
          : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      }`}>
        {connectionMode === 'mongoDB' ? (
          <>
            <Database size={14} />
            <span>Connected to MongoDB</span>
            <CheckCircle size={14} />
          </>
        ) : (
          <>
            <CloudOff size={14} />
            <span>Using localStorage</span>
            <AlertCircle size={14} />
          </>
        )}
      </div>
    </div>
  );
}