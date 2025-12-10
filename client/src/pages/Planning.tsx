import { Layout } from "@/components/layout/Layout";
import { Header } from "@/components/layout/Header";
import { MOCK_TECHNICIAN, MOCK_INTERVENTIONS } from "@/lib/mockData";
import { Calendar } from "@/components/ui/calendar";
import { useState } from "react";
import { fr } from "date-fns/locale";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { InterventionCard } from "@/components/dashboard/InterventionCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Planning() {
  const [date, setDate] = useState<Date | undefined>(new Date());

  // Filter interventions for selected date
  const selectedDateStr = date?.toISOString().split('T')[0];
  const interventionsForDate = MOCK_INTERVENTIONS.filter(i => i.date === selectedDateStr);

  return (
    <Layout>
      <Header technician={MOCK_TECHNICIAN} />
      
      <div className="px-4 py-4 space-y-4">
        <h1 className="text-2xl font-bold">Mon Planning</h1>

        <Tabs defaultValue="day" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="day">Jour</TabsTrigger>
            <TabsTrigger value="week">Semaine</TabsTrigger>
          </TabsList>
          
          <TabsContent value="day" className="space-y-4">
            <Card>
              <CardContent className="p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  locale={fr}
                  className="rounded-md border shadow-none w-full flex justify-center"
                />
              </CardContent>
            </Card>

            <div className="space-y-3">
               <h3 className="font-semibold text-muted-foreground text-sm uppercase tracking-wide">
                 {date?.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
               </h3>
               
               {interventionsForDate.length > 0 ? (
                 interventionsForDate.map(int => (
                   <InterventionCard key={int.id} intervention={int} />
                 ))
               ) : (
                 <div className="text-center py-12 bg-muted/10 rounded-lg border border-dashed">
                   <p className="text-muted-foreground">Aucune intervention prévue</p>
                 </div>
               )}
            </div>
          </TabsContent>
          
          <TabsContent value="week">
            <div className="text-center py-12">
               <p className="text-muted-foreground">Vue semaine à implémenter (Mock)</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
