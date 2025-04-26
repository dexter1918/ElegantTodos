import { useEffect, useState } from "react";
import { Todo } from "@/lib/utils";
import { useTodoStore } from "@/hooks/use-todo-store";
import { useToast } from "@/hooks/use-toast";
import { formatDate } from "@/lib/utils";
import { Bell } from "lucide-react";

export function ReminderNotifications() {
  const { todos } = useTodoStore();
  const { toast } = useToast();
  const [checkedReminders, setCheckedReminders] = useState<Set<string>>(new Set());
  
  // Check for due reminders every minute
  useEffect(() => {
    const checkReminders = () => {
      const now = new Date();
      
      todos.forEach((todo) => {
        if (
          todo.reminderEnabled && 
          todo.reminderDate && 
          !todo.completed && 
          !checkedReminders.has(todo.id + todo.reminderDate)
        ) {
          const reminderTime = new Date(todo.reminderDate);
          const timeDiff = reminderTime.getTime() - now.getTime();
          
          // If reminder time is within 1 minute
          if (timeDiff > 0 && timeDiff <= 60000) {
            toast({
              title: "Task Reminder",
              description: (
                <div className="flex flex-col gap-1">
                  <span className="font-medium">{todo.text}</span>
                  <span className="text-sm text-gray-500">Due {todo.dueDate ? formatDate(todo.dueDate) : "soon"}</span>
                </div>
              ),
              duration: 10000, // 10 seconds
              action: (
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/20 text-primary">
                  <Bell size={16} />
                </div>
              )
            });
            
            // Mark this reminder as checked so we don't show it again
            setCheckedReminders(prev => {
              const newSet = new Set(prev);
              newSet.add(todo.id + todo.reminderDate);
              return newSet;
            });
          }
          
          // If reminder time has passed and has not been checked yet
          if (timeDiff <= 0 && timeDiff > -300000) { // Within 5 minutes past due
            toast({
              title: "Task Reminder",
              description: (
                <div className="flex flex-col gap-1">
                  <span className="font-medium">{todo.text}</span>
                  <span className="text-sm text-red-500">Reminder was at {reminderTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
              ),
              duration: 10000, // 10 seconds
              variant: "destructive",
              action: (
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-red-100 text-red-600">
                  <Bell size={16} />
                </div>
              )
            });
            
            // Mark this reminder as checked
            setCheckedReminders(prev => {
              const newSet = new Set(prev);
              newSet.add(todo.id + todo.reminderDate);
              return newSet;
            });
          }
        }
      });
    };
    
    // Check immediately on component mount
    checkReminders();
    
    // Then check every 30 seconds
    const interval = setInterval(checkReminders, 30000);
    
    return () => clearInterval(interval);
  }, [todos, toast, checkedReminders]);
  
  // Nothing to render - this is just a notification system
  return null;
}