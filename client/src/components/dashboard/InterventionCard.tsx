import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Intervention, TRADE_CONFIG, CRM_TYPE_LABELS, CRM_TYPE_COLORS } from "@/lib/mockData";
import { MapPin, Clock, MessageSquare, ArrowRight, Play, BellRing, Package, Users, Building2 } from "lucide-react";
import { Link } from "wouter";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

import { ChatSheet } from "@/components/chat/ChatSheet";

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
      "border-2 shadow-sm hover:shadow-md transition-all",
      primaryConfig.color.replace("text-", "border-"),
      primaryConfig.bgColor.replace("100", "50")
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
              <p className="text-base font-bold text-foreground line-clamp-1">{intervention.clientName}</p>
              
              <div className="flex gap-2 mt-1 flex-wrap items-center">
                 {intervention.types.map(type => (
                     <Badge key={type} variant="outline" className={cn("text-[10px] py-0 h-5 font-normal border bg-white/80 backdrop-blur-sm", TRADE_CONFIG[type]?.color, "border-current")}>
                        {TRADE_CONFIG[type]?.label}
                     </Badge>
                 ))}
                 <Badge variant="outline" className={cn("text-[10px] py-0 h-5 font-bold uppercase tracking-wider border-0 shadow-sm", CRM_TYPE_COLORS[intervention.crmType])}>
                    {CRM_TYPE_LABELS[intervention.crmType]}
                 </Badge>
              </div>
            </div>
          </div>
          <Badge className={cn(
            "uppercase text-[10px] px-3 py-1 rounded-full border-0 font-bold",
            intervention.status === "todo" && "bg-orange-500 text-white hover:bg-orange-600",
            intervention.status === "in_progress" && "bg-blue-500 text-white hover:bg-blue-600",
            intervention.status === "done" && "bg-green-500 text-white hover:bg-green-600"
          )}>
            {intervention.status === "todo" ? "À faire" : intervention.status === "in_progress" ? "En cours" : "Réalisé"}
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

          <div className={cn(
             "mt-2 text-xs p-2 rounded border flex flex-col gap-1",
             // Logic: Green if supplies needed (provided or to_buy), Red if none needed
             intervention.materialsStatus === "none" ? "bg-red-50 border-red-200 text-red-700" :
             "bg-green-50 border-green-200 text-green-700"
          )}>
             <div className="flex items-center gap-2 font-medium">
                 <Package className="h-3 w-3 shrink-0" />
                 <span className="line-clamp-1">
                    {intervention.materialsStatus === "none" ? "Aucune fourniture requise" : 
                     intervention.materialsStatus === "provided" ? "Matériel fourni" : "Matériel à acheter"}
                 </span>
             </div>
             {intervention.materialsList && (
                 <p className="opacity-90 pl-5 border-l-2 border-current/30 text-[11px] line-clamp-2">
                    {intervention.materialsList}
                 </p>
             )}
          </div>
        </div>
      </CardContent>
      <CardFooter className="bg-white/50 p-3 px-4 flex justify-between items-center border-t border-border/50 gap-2">
         <Button variant="outline" size="sm" className="h-9 text-blue-600 border-blue-200 hover:bg-blue-50 hover:text-blue-700 text-xs px-3 bg-white" onClick={handleNotifyClient}>
            <BellRing className="h-4 w-4 mr-2" />
            Prévenir client
         </Button>
         
         <div className="flex gap-2">
            <ChatSheet context={`Intervention #${intervention.id.split('-')[1]}`} trigger={
                <Button size="sm" variant="outline" className={cn(
                    "h-9 gap-2 relative bg-white border-blue-200 text-blue-700 hover:bg-blue-50 px-3",
                    intervention.id === "int-101" && "border-blue-300 bg-blue-50 text-blue-700"
                )}>
                    <Building2 className="h-4 w-4" />
                    <span className="text-xs font-medium hidden sm:inline">Contacter bureau</span>
                    <span className="text-xs font-medium sm:hidden">Bureau</span>
                    {intervention.id === "int-101" && (
                        <>
                            <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full animate-ping opacity-75" />
                            <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full border-2 border-white z-10" />
                        </>
                    )}
                </Button>
            } />
            
            <Link href={`/intervention/${intervention.id}`}>
            <Button size="sm" className="gap-2 text-xs h-9 px-4 font-bold bg-blue-800 hover:bg-blue-900 shadow-sm">
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
         </div>
      </CardFooter>
    </Card>
  );
}
