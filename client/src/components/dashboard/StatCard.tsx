import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArrowRight, TrendingUp } from "lucide-react";
import { Technician } from "@/lib/mockData";
import { cn } from "@/lib/utils";

interface StatCardProps {
  technician: Technician;
}

export function StatCard({ technician }: StatCardProps) {
  const progress = (technician.monthlyRevenue / technician.monthlyGoal) * 100;
  const isAhead = progress > 70; // Arbitrary logic for demo

  return (
    <Card className="overflow-hidden border-none shadow-md bg-gradient-to-br from-primary to-blue-800 text-primary-foreground rounded-xl">
      <CardContent className="p-5">
        <div className="flex justify-between items-start mb-4">
          <div>
            <p className="text-blue-100 text-xs font-medium uppercase tracking-wider opacity-80">Chiffre d'Affaires (Mois)</p>
            <h3 className="text-3xl font-bold mt-1">{technician.monthlyRevenue.toLocaleString('fr-FR')} €</h3>
            <p className="text-sm text-blue-100 mt-1">
              Objectif : {technician.monthlyGoal.toLocaleString('fr-FR')} €
            </p>
          </div>
          <div className="bg-white/10 p-2 rounded-lg backdrop-blur-sm">
            <TrendingUp className="h-6 w-6 text-white" />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-xs text-blue-100 font-medium">
            <span>Progression</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2 bg-blue-950/30 [&>div]:bg-secondary" />
        </div>

        <div className="mt-4 flex items-center justify-between">
            <span className={cn(
                "text-xs px-2 py-1 rounded-full font-medium",
                isAhead ? "bg-green-500/20 text-green-100" : "bg-orange-500/20 text-orange-100"
            )}>
                {isAhead ? "En avance 🔥" : "À accélérer ⚡"}
            </span>
            <button className="text-xs text-white hover:text-secondary transition-colors flex items-center font-medium">
                Voir détail <ArrowRight className="ml-1 h-3 w-3" />
            </button>
        </div>
      </CardContent>
    </Card>
  );
}
