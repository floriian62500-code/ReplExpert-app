import { CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TODOS } from "@/lib/mockData";

export function ActionList() {
  return (
    <div className="space-y-3">
      {TODOS.map((todo) => (
        <div key={todo.id} className="flex items-center justify-between p-3 bg-white border border-border rounded-lg shadow-sm">
          <div className="flex items-center space-x-3">
            {todo.urgent ? (
              <AlertCircle className="h-5 w-5 text-secondary" />
            ) : (
              <CheckCircle2 className="h-5 w-5 text-muted-foreground/50" />
            )}
            <span className="text-sm font-medium text-foreground">{todo.text}</span>
          </div>
          {todo.urgent && (
            <div className="h-2 w-2 rounded-full bg-secondary animate-pulse" />
          )}
        </div>
      ))}
      <Button variant="outline" className="w-full text-primary border-primary/20 hover:bg-primary/5">
        Demander un congé / repos
      </Button>
    </div>
  );
}
