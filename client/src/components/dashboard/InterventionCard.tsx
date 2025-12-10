import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Intervention, TRADE_ICONS, TRADE_LABELS, CRM_TYPE_LABELS, CRM_TYPE_COLORS } from "@/lib/mockData";
import { MapPin, Clock, MessageSquare, ArrowRight, Play, Wrench } from "lucide-react";
import { Link } from "wouter";
import { cn } from "@/lib/utils";

interface InterventionCardProps {
  intervention: Intervention;
}

export function InterventionCard({ intervention }: InterventionCardProps) {
  const TradeIcon = TRADE_ICONS[intervention.types[0]] || Wrench;

  return (
    <Card className="border-l-4 border-l-primary shadow-sm hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-primary/10 rounded-full text-primary">
              <TradeIcon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">{intervention.clientName}</p>
              <div className="flex gap-2 mt-1">
                 <Badge variant="outline" className="text-[10px] py-0 h-5 text-muted-foreground font-normal border-border bg-muted/50">
                   {TRADE_LABELS[intervention.types[0]]}
                 </Badge>
                 <Badge variant="outline" className={cn("text-[10px] py-0 h-5 font-normal border", CRM_TYPE_COLORS[intervention.crmType])}>
                    {CRM_TYPE_LABELS[intervention.crmType]}
                 </Badge>
              </div>
            </div>
          </div>
          <Badge variant={intervention.status === "in_progress" ? "default" : "secondary"} className="uppercase text-[10px]">
            {intervention.status === "todo" ? "À faire" : intervention.status === "in_progress" ? "En cours" : "Terminé"}
          </Badge>
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex items-start text-sm text-muted-foreground">
            <Clock className="h-4 w-4 mr-2 mt-0.5 shrink-0" />
            <span>{intervention.timeSlot}</span>
          </div>
          <div className="flex items-start text-sm text-muted-foreground">
            <MapPin className="h-4 w-4 mr-2 mt-0.5 shrink-0" />
            <span className="line-clamp-1">{intervention.address}, {intervention.city}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="bg-muted/30 p-2 px-4 flex justify-between items-center border-t border-border">
         <div className="flex space-x-2">
            <Button size="icon" variant="ghost" className="h-8 w-8 text-muted-foreground hover:text-primary">
                <MessageSquare className="h-4 w-4" />
            </Button>
         </div>
         <Link href={`/intervention/${intervention.id}`}>
            <Button size="sm" className="gap-2 text-xs h-8">
               {intervention.status === "todo" ? (
                   <>
                    <Play className="h-3 w-3 fill-current" />
                    Démarrer
                   </>
               ) : (
                   <>
                    Voir détail
                    <ArrowRight className="h-3 w-3" />
                   </>
               )}
            </Button>
         </Link>
      </CardFooter>
    </Card>
  );
}
