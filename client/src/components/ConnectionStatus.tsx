import { AlertCircle, CloudOff } from "lucide-react";

/**
 * Component to display the current connection status with the database
 * This is a static version since we're having issues with zustand state updates
 */
export function ConnectionStatus() {
  // We're in localStorage mode since MongoDB connection is failing
  // This is a static implementation for now
  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
        <CloudOff size={14} />
        <span>Using localStorage</span>
        <AlertCircle size={14} />
      </div>
    </div>
  );
}