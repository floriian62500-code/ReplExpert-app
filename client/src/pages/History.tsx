import { Layout } from "@/components/layout/Layout";
import { Header } from "@/components/layout/Header";
import { MOCK_TECHNICIAN, MOCK_INTERVENTIONS } from "@/lib/mockData";
import { InterventionCard } from "@/components/dashboard/InterventionCard";
import { ArrowLeft, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function History() {
  const historyInterventions = MOCK_INTERVENTIONS
    .filter(i => i.status === "done")
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <Layout>
      <Header technician={MOCK_TECHNICIAN} />
      
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur border-b border-border pt-safe">
        <div className="flex items-center justify-between px-4 h-14">
            <div className="flex items-center space-x-2">
                <Link href="/">
                    <Button variant="ghost" size="icon" className="-ml-2">
                        <ArrowLeft className="h-6 w-6" />
                    </Button>
                </Link>
                <h1 className="font-semibold text-lg">Historique</h1>
            </div>
            <Button variant="ghost" size="icon">
                <Filter className="h-5 w-5 text-muted-foreground" />
            </Button>
        </div>
      </div>

      <div className="px-4 py-4 space-y-4">
        {historyInterventions.length > 0 ? (
          historyInterventions.map(int => (
            <div key={int.id}>
                <div className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide px-1">
                    {new Date(int.date).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
                </div>
                <InterventionCard intervention={int} />
            </div>
          ))
        ) : (
          <div className="text-center py-12 bg-muted/10 rounded-lg border border-dashed">
            <p className="text-muted-foreground">Aucune intervention terminée</p>
          </div>
        )}
      </div>
    </Layout>
  );
}
