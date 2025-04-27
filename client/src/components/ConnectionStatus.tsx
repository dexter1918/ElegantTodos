import { useState, useEffect } from "react";
import { AlertCircle, CheckCircle, CloudOff, Database } from "lucide-react";

/**
 * Component to display the current connection status with the database
 */
export function ConnectionStatus() {
  const [isConnected, setIsConnected] = useState<boolean | null>(null);

  useEffect(() => {
    const checkConnection = async () => {
      try {
        const response = await fetch('/api/todos');
        const storageMode = response.headers.get('X-Storage-Mode');
        setIsConnected(storageMode === 'mongoDB');
      } catch (error) {
        setIsConnected(false);
      }
    };
    
    // Check connection status immediately and then every 30 seconds
    checkConnection();
    const interval = setInterval(checkConnection, 30000);
    
    return () => clearInterval(interval);
  }, []);

  // Don't show anything while we're still checking
  if (isConnected === null) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className={`flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium ${
        isConnected 
          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
          : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      }`}>
        {isConnected ? (
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