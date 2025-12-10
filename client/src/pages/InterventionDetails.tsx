import { Layout } from "@/components/layout/Layout";
import { useRoute } from "wouter";
import { MOCK_INTERVENTIONS, TRADE_ICONS, TRADE_LABELS, CRM_TYPE_LABELS, CRM_TYPE_COLORS } from "@/lib/mockData";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapPin, Clock, Phone, MessageSquare, ArrowLeft, Camera, FileText, Play, Pause, CheckSquare } from "lucide-react";
import { Link } from "wouter";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

export default function InterventionDetails() {
  const [, params] = useRoute("/intervention/:id");
  const intervention = MOCK_INTERVENTIONS.find(i => i.id === params?.id);

  if (!intervention) return <div>Intervention non trouvée</div>;

  const TradeIcon = TRADE_ICONS[intervention.types[0]];

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
             <Button variant="ghost" size="icon" className="text-primary">
               <MessageSquare className="h-5 w-5" />
             </Button>
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
                 <Button variant="secondary" size="sm" className="shadow-lg gap-2">
                    <MapPin className="h-4 w-4" />
                    Ouvrir dans Maps
                 </Button>
             </div>
        </div>

        <div className="px-4 -mt-6 relative z-10 space-y-6">
            
            {/* Main Info Card */}
            <Card className="shadow-lg border-none">
                <CardContent className="p-5 space-y-4">
                    <div className="flex justify-between items-start">
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <Badge variant="outline" className={cn("text-[10px] font-medium border", CRM_TYPE_COLORS[intervention.crmType])}>
                                    {CRM_TYPE_LABELS[intervention.crmType]}
                                </Badge>
                            </div>
                            <h2 className="text-xl font-bold">{intervention.clientName}</h2>
                            <p className="text-muted-foreground text-sm uppercase font-medium tracking-wide">{intervention.clientType}</p>
                        </div>
                        <div className="p-2 bg-primary/10 rounded-full text-primary">
                            {TradeIcon && <TradeIcon className="h-6 w-6" />}
                        </div>
                    </div>
                    
                    <Separator />

                    <div className="space-y-3">
                         <div className="flex items-start gap-3">
                            <MapPin className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                            <div>
                                <p className="text-sm font-medium">{intervention.address}</p>
                                <p className="text-sm text-muted-foreground">{intervention.city}</p>
                            </div>
                         </div>
                         <div className="flex items-start gap-3">
                            <Clock className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                            <div>
                                <p className="text-sm font-medium">{intervention.timeSlot}</p>
                                <p className="text-sm text-muted-foreground capitalize">
                                    {new Date(intervention.date).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
                                </p>
                            </div>
                         </div>
                         <div className="flex items-center gap-3">
                            <Phone className="h-5 w-5 text-muted-foreground shrink-0" />
                            <p className="text-sm font-medium text-primary underline">06 12 34 56 78</p>
                         </div>
                    </div>

                    <div className="flex gap-2 flex-wrap">
                        {intervention.types.map(t => (
                            <Badge key={t} variant="secondary" className="font-normal">
                                {TRADE_LABELS[t]}
                            </Badge>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Description */}
            <section>
                <h3 className="font-semibold mb-2">Description</h3>
                <p className="text-sm text-muted-foreground bg-muted/30 p-3 rounded-lg border">
                    {intervention.description}
                </p>
            </section>

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
