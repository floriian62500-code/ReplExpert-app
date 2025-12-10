import { Layout } from "@/components/layout/Layout";
import { Header } from "@/components/layout/Header";
import { StatCard } from "@/components/dashboard/StatCard";
import { InterventionCard } from "@/components/dashboard/InterventionCard";
import { ActionList } from "@/components/dashboard/ActionList";
import { MOCK_TECHNICIAN, MOCK_INTERVENTIONS } from "@/lib/mockData";
import { Button } from "@/components/ui/button";
import { ArrowRight, History, Users, MessageSquare } from "lucide-react";
import { Link } from "wouter";
import { ChatSheet } from "@/components/chat/ChatSheet";

export default function Dashboard() {
  const todaysInterventions = MOCK_INTERVENTIONS.filter(i => i.date === new Date().toISOString().split('T')[0]);

  return (
    <Layout>
      <Header technician={MOCK_TECHNICIAN} />
      
      <div className="px-4 py-6 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        
        {/* CA Block */}
        <section>
          <StatCard technician={MOCK_TECHNICIAN} />
        </section>

        {/* Quick Actions - New */}
        <section className="grid grid-cols-1">
            <ChatSheet context="Bureau" trigger={
                <Button variant="outline" className="w-full bg-white shadow-sm border-2 border-dashed border-primary/20 text-primary h-14 gap-2 rounded-xl hover:bg-primary/5 hover:border-primary/40 transition-all">
                    <MessageSquare className="h-5 w-5" />
                    <span className="font-semibold">Contacter le bureau</span>
                </Button>
            } />
        </section>

        {/* Interventions of the day */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold text-foreground">Interventions du jour</h2>
            <Link href="/planning">
              <Button variant="link" size="sm" className="text-primary h-auto p-0">
                Tout voir
              </Button>
            </Link>
          </div>
          
          <div className="space-y-3">
            {todaysInterventions.length > 0 ? (
              todaysInterventions.map(intervention => (
                <InterventionCard key={intervention.id} intervention={intervention} />
              ))
            ) : (
              <div className="text-center py-8 bg-muted/20 rounded-lg border border-dashed">
                <p className="text-muted-foreground text-sm">Aucune intervention aujourd'hui</p>
              </div>
            )}
            <Link href="/planning">
              <Button variant="outline" className="w-full mt-2" size="sm">
                Voir mon planning complet <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </section>

        {/* To-Do Block */}
        <section>
           <h2 className="text-lg font-bold text-foreground mb-3">À faire pour moi</h2>
           <ActionList />
        </section>

      </div>
    </Layout>
  );
}
