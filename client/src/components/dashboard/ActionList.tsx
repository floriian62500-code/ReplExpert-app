import { CheckCircle2, AlertCircle, FileText, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TODOS, MOCK_INTERVENTIONS } from "@/lib/mockData";
import { Link } from "wouter";
import { Card } from "@/components/ui/card";

export function ActionList() {
  const pendingInterventions = MOCK_INTERVENTIONS.filter(i => i.status === "done" && i.reportStatus === "pending");

  return (
    <div className="space-y-3">
      {/* Pending Interventions to Finalize */}
      {pendingInterventions.map((int) => (
        <Card key={`finalize-${int.id}`} className="p-3 bg-orange-50 border-orange-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
               <AlertCircle className="h-5 w-5 text-orange-600" />
               <div>
                  <span className="text-sm font-medium text-foreground block">Finaliser interv. #{int.id.split('-')[1]}</span>
                  <span className="text-xs text-muted-foreground">{int.clientName}</span>
               </div>
            </div>
            <Link href={`/intervention/${int.id}`}>
               <Button size="sm" variant="outline" className="h-8 border-orange-200 text-orange-700 hover:bg-orange-100">
                  Finaliser
               </Button>
            </Link>
          </div>
        </Card>
      ))}

      {/* Standard Todos */}
      {TODOS.map((todo) => (
        <Card key={todo.id} className="p-3 bg-white border-border shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
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
        </Card>
      ))}
      <Button variant="outline" className="w-full text-primary border-primary/20 hover:bg-primary/5">
        Demander un congé / repos
      </Button>
    </div>
  );
}
