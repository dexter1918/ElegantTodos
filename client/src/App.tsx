import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ThemeToggle } from "@/components/ThemeToggle";
import { ReminderNotifications } from "@/components/ReminderNotifications";
import { ConnectionStatus } from "@/components/ConnectionStatus";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <div className="relative min-h-screen flex flex-col">
          <div className="fixed top-4 right-4 z-50">
            <ThemeToggle />
          </div>
          <div className="flex-grow">
            <Router />
            <ConnectionStatus />
            <ReminderNotifications />
            <Toaster />
          </div>
          <footer className="py-3 text-center text-sm text-muted-foreground border-t">
            <p>© {new Date().getFullYear()} Sk. Salman Haider. All rights reserved.</p>
          </footer>
        </div>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
