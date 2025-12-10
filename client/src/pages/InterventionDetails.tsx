import { Layout } from "@/components/layout/Layout";
import { useRoute } from "wouter";
import { MOCK_INTERVENTIONS, TRADE_CONFIG, CRM_TYPE_LABELS, CRM_TYPE_COLORS, MATERIALS_LABELS } from "@/lib/mockData";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Clock, Phone, MessageSquare, ArrowLeft, Camera, FileText, Play, Pause, CheckSquare, Navigation, BellRing, Package, Info } from "lucide-react";
import { Link } from "wouter";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

import { ChatSheet } from "@/components/chat/ChatSheet";

export default function InterventionDetails() {
  const [, params] = useRoute("/intervention/:id");
  const { toast } = useToast();
  const intervention = MOCK_INTERVENTIONS.find(i => i.id === params?.id);

  if (!intervention) return <div>Intervention non trouvée</div>;

  // Primary config based on first type for colors
  const primaryType = intervention.types[0];
  const primaryConfig = TRADE_CONFIG[primaryType] || TRADE_CONFIG["plomberie"];

  const handleNotifyClient = () => {
    toast({
      title: "Client prévenu",
      description: "Un SMS automatique a été envoyé au client pour signaler votre arrivée.",
      duration: 3000,
    });
  };

  const wazeUrl = `https://www.waze.com/ul?q=${encodeURIComponent(intervention.address + " " + intervention.city)}`;
  const phoneNumber = "06 12 34 56 78"; // Mock phone number

  return (
    <Layout>
      {/* Custom Header for Detail View */}
      <div className="sticky top-0 z-40 w-full bg-background/95 backdrop-blur border-b border-border pt-safe">
        <div className="flex items-center px-4 h-14 space-x-4">
          <Link href="/">
             <Button variant="ghost" size="icon" className="-ml-2">
                <ArrowLeft className="h-6 w-6" />
             </Button>
          </Link>
          <div className="flex-1 overflow-hidden">
             <h1 className="font-semibold text-lg truncate">Intervention #{intervention.id.split('-')[1]}</h1>
             <p className="text-xs text-muted-foreground truncate">{intervention.clientName}</p>
          </div>
          <div className="flex space-x-2">
             <ChatSheet context={`Intervention #${intervention.id.split('-')[1]}`} trigger={
                <Button variant="ghost" size="icon" className="text-primary">
                   <MessageSquare className="h-5 w-5" />
                </Button>
             } />
          </div>
        </div>
      </div>

      <div className="pb-24">
        {/* Map Placeholder */}
        <div className="h-48 bg-muted relative w-full overflow-hidden">
             <img 
               src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/OpenStreetMap_Logo_2011.svg/1024px-OpenStreetMap_Logo_2011.svg.png" 
               className="w-full h-full object-cover opacity-50 blur-[2px]"
               alt="Map Background"
             />
             <div className="absolute inset-0 flex items-center justify-center">
                 <a href={wazeUrl} target="_blank" rel="noopener noreferrer">
                   <Button variant="secondary" size="sm" className="shadow-lg gap-2 font-semibold text-blue-600">
                      <Navigation className="h-4 w-4 fill-current" />
                      Y aller avec Waze
                   </Button>
                 </a>
             </div>
        </div>

        <div className="px-4 -mt-6 relative z-10 space-y-6">
            
            {/* Main Info Card */}
            <Card className={cn(
                "shadow-lg border-2 overflow-hidden",
                primaryConfig.color.replace("text-", "border-")
            )}>
                <div className={cn("h-2 w-full", primaryConfig.bgColor.replace("bg-", "bg-"))} style={{backgroundColor: "currentColor"}} />
                <CardContent className="p-5 space-y-4 pt-6">
                    <div className="flex justify-between items-start">
                        <div>
                            <div className="flex items-center gap-2 mb-2 flex-wrap">
                                <Badge variant="outline" className={cn("text-[10px] font-medium border", CRM_TYPE_COLORS[intervention.crmType])}>
                                    {CRM_TYPE_LABELS[intervention.crmType]}
                                </Badge>
                                {/* Display all trade badges */}
                                {intervention.types.map(type => {
                                    const conf = TRADE_CONFIG[type];
                                    if (!conf) return null;
                                    return (
                                        <Badge key={type} variant="outline" className={cn("text-[10px] font-medium border bg-white", conf.color, "border-current opacity-80")}>
                                           {conf.label}
                                        </Badge>
                                    );
                                })}
                            </div>
                            <h2 className="text-xl font-bold">{intervention.clientName}</h2>
                            <p className="text-muted-foreground text-sm uppercase font-medium tracking-wide">{intervention.clientType}</p>
                        </div>
                        
                        {/* Stacked Icons if multiple */}
                        <div className="flex -space-x-3 overflow-hidden pl-2 pb-2">
                           {intervention.types.map((type, index) => {
                               const conf = TRADE_CONFIG[type];
                               if (!conf) return null;
                               return (
                                   <div key={type} className={cn(
                                       "h-14 w-14 rounded-full overflow-hidden shadow-md shrink-0 border-2 border-white relative z-" + (10 - index)
                                   )}>
                                       <img 
                                           src={conf.icon} 
                                           alt={conf.label} 
                                           className="h-full w-full object-cover"
                                       />
                                   </div>
                               );
                           })}
                        </div>
                    </div>
                    
                    <Separator />

                    <div className="space-y-3">
                         <a href={wazeUrl} target="_blank" rel="noopener noreferrer" className="flex items-start gap-3 hover:bg-muted/50 p-2 -mx-2 rounded-lg transition-colors">
                            <MapPin className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                            <div>
                                <p className="text-sm font-medium underline decoration-dotted underline-offset-4">{intervention.address}</p>
                                <p className="text-sm text-muted-foreground">{intervention.city}</p>
                            </div>
                         </a>
                         
                         <div className="flex items-start gap-3 p-2 -mx-2">
                            <Clock className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                            <div>
                                <p className="text-sm font-medium">{intervention.timeSlot}</p>
                                <p className="text-sm text-muted-foreground capitalize">
                                    {new Date(intervention.date).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
                                </p>
                            </div>
                         </div>
                         
                         <a href={`tel:${phoneNumber.replace(/\s/g, '')}`} className="flex items-center gap-3 hover:bg-muted/50 p-2 -mx-2 rounded-lg transition-colors">
                            <div className="bg-green-100 p-2 rounded-full">
                                <Phone className="h-4 w-4 text-green-700 shrink-0" />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-foreground">{phoneNumber}</p>
                                <p className="text-xs text-muted-foreground">Appeler le client</p>
                            </div>
                         </a>
                    </div>

                </CardContent>
            </Card>

            {/* Mission & Materials */}
            <Card className="shadow-sm border border-border">
                <CardContent className="p-4 space-y-4">
                    
                    {/* Mission Description */}
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <Info className="h-4 w-4 text-primary" />
                            <h3 className="font-semibold text-sm">Motif de l'intervention</h3>
                        </div>
                        <p className="text-sm text-foreground bg-muted/50 p-3 rounded-md">
                            {intervention.description}
                        </p>
                    </div>

                    <Separator />

                    {/* Materials */}
                    <div>
                         <div className="flex items-center gap-2 mb-2">
                            <Package className="h-4 w-4 text-secondary" />
                            <h3 className="font-semibold text-sm">Fournitures & Matériel</h3>
                        </div>
                        
                        <div className={cn(
                            "p-3 rounded-md border text-sm",
                            intervention.materialsStatus === "none" && "bg-gray-50 border-gray-200 text-gray-600",
                            intervention.materialsStatus === "provided" && "bg-green-50 border-green-200 text-green-700",
                            intervention.materialsStatus === "to_buy" && "bg-orange-50 border-orange-200 text-orange-700",
                        )}>
                            <p className="font-semibold mb-1">
                                {MATERIALS_LABELS[intervention.materialsStatus]}
                            </p>
                            {intervention.materialsList && (
                                <p className="text-xs opacity-90 mt-1 pl-2 border-l-2 border-current">
                                    {intervention.materialsList}
                                </p>
                            )}
                        </div>
                    </div>

                </CardContent>
            </Card>

            {/* Actions Grid */}
            <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" className="h-20 flex flex-col items-center justify-center gap-2 border-dashed">
                    <Camera className="h-6 w-6 text-muted-foreground" />
                    <span className="text-xs font-medium">Ajouter Photos</span>
                </Button>
                <Button variant="outline" className="h-20 flex flex-col items-center justify-center gap-2 border-dashed">
                    <FileText className="h-6 w-6 text-muted-foreground" />
                    <span className="text-xs font-medium">Relevé Technique</span>
                </Button>
            </div>

        </div>
      </div>

      {/* Floating Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background border-t pb-safe z-50 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
         <div className="flex gap-3">
            {intervention.status === "todo" && (
                <Button className="w-full h-12 text-base shadow-lg shadow-primary/20 gap-2">
                    <Play className="h-5 w-5 fill-current" /> Démarrer l'intervention
                </Button>
            )}
            {intervention.status === "in_progress" && (
                <>
                    <Button variant="outline" className="flex-1 h-12 border-orange-200 text-orange-600 hover:text-orange-700 hover:bg-orange-50">
                        <Pause className="h-5 w-5 mr-2" /> Pause
                    </Button>
                    <Button className="flex-[2] h-12 bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-600/20">
                        <CheckSquare className="h-5 w-5 mr-2" /> Terminer
                    </Button>
                </>
            )}
         </div>
      </div>
    </Layout>
  );
}
