import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Intervention, TRADE_CONFIG, CRM_TYPE_LABELS, CRM_TYPE_COLORS } from "@/lib/mockData";
import { MapPin, Clock, MessageSquare, ArrowRight, Play, BellRing } from "lucide-react";
import { Link } from "wouter";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface InterventionCardProps {
  intervention: Intervention;
}

export function InterventionCard({ intervention }: InterventionCardProps) {
  const { toast } = useToast();
  const primaryType = intervention.types[0];
  const primaryConfig = TRADE_CONFIG[primaryType] || TRADE_CONFIG["plomberie"];

  const handleNotifyClient = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toast({
      title: "Client prévenu",
      description: "SMS envoyé au client pour signaler votre arrivée.",
      duration: 3000,
    });
  };

  return (
    <Card className={cn(
      "border-2 shadow-sm hover:shadow-md transition-shadow",
      primaryConfig.color.replace("text-", "border-")
    )}>
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center space-x-3">
            <div className="flex -space-x-4">
                {intervention.types.map((type, index) => {
                    const conf = TRADE_CONFIG[type];
                    if (!conf) return null;
                    return (
                        <div key={type} className="h-12 w-12 rounded-full overflow-hidden shadow-sm shrink-0 border-2 border-background relative z-[1]">
                            <img 
                                src={conf.icon} 
                                alt={conf.label} 
                                className="h-full w-full object-cover"
                            />
                        </div>
                    );
                })}
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground line-clamp-1">{intervention.clientName}</p>
              <div className="flex gap-2 mt-1 flex-wrap">
                 {intervention.types.map(type => (
                     <Badge key={type} variant="outline" className={cn("text-[10px] py-0 h-5 font-normal border bg-white", TRADE_CONFIG[type]?.color, "border-current opacity-80")}>
                        {TRADE_CONFIG[type]?.label}
                     </Badge>
                 ))}
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

        <div className="space-y-2 mb-4 pl-[3.75rem]">
          <div className="flex items-start text-sm text-muted-foreground">
            <Clock className="h-4 w-4 mr-2 mt-0.5 shrink-0" />
            <span>{intervention.timeSlot}</span>
          </div>
          <div className="flex items-start text-sm text-muted-foreground">
            <MapPin className="h-4 w-4 mr-2 mt-0.5 shrink-0" />
            <span className="line-clamp-1">{intervention.address}, {intervention.city}</span>
          </div>
          
          {/* Motif d'intervention */}
          <div className="mt-3 text-xs text-muted-foreground bg-muted/50 p-2 rounded border border-dashed">
            <span className="font-semibold text-foreground block mb-1">Motif :</span>
            <span className="line-clamp-2">{intervention.description}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="bg-muted/30 p-2 px-4 flex justify-between items-center border-t border-border gap-2">
         <Button variant="outline" size="sm" className="h-8 text-blue-600 border-blue-200 hover:bg-blue-50 hover:text-blue-700 text-xs px-2" onClick={handleNotifyClient}>
            <BellRing className="h-3 w-3 mr-1.5" />
            Prévenir client
         </Button>
         
         <div className="flex gap-2">
            <Button size="icon" variant="ghost" className="h-8 w-8 text-muted-foreground hover:text-primary">
                <MessageSquare className="h-4 w-4" />
            </Button>
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
