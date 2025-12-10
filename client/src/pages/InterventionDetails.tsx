import { Layout } from "@/components/layout/Layout";
import { useRoute, useLocation } from "wouter";
import { MapPin, Clock, Phone, MessageSquare, ArrowLeft, Camera, FileText, Play, Pause, CheckSquare, Navigation, BellRing, Package, Info, ImageIcon, FolderOpen, Ban, Upload, FileCheck, ShoppingCart, Eye, Wrench, Plus, Trash2, Receipt, PenLine, Minus, Ruler } from "lucide-react";
import { MOCK_INTERVENTIONS, TRADE_CONFIG, CRM_TYPE_LABELS, CRM_TYPE_COLORS, MATERIALS_LABELS, MOCK_ARTICLES } from "@/lib/mockData";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Link } from "wouter";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { ChatSheet } from "@/components/chat/ChatSheet";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger, DrawerFooter, DrawerClose } from "@/components/ui/drawer";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useState } from "react";

import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { X } from "lucide-react";

// Stock images
import stockLeakRepair from "@assets/stock_images/plumbing_under_sink__edbe1fe8.jpg";
import stockFaucetNew from "@assets/stock_images/new_kitchen_sink_fau_fbbe7b23.jpg";

export default function InterventionDetails() {
  const [, params] = useRoute("/intervention/:id");
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const intervention = MOCK_INTERVENTIONS.find(i => i.id === params?.id);
  const [cancelReason, setCancelReason] = useState("client_absent");
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const [status, setStatus] = useState(intervention?.status || "todo");

  // Mock state for photos
  const [photosBefore, setPhotosBefore] = useState([
      { id: 1, url: stockLeakRepair, room: "cuisine" }
  ]);
  const [photosAfter, setPhotosAfter] = useState([
      { id: 2, url: stockFaucetNew, room: "cuisine" }
  ]);

  if (!intervention) return <div>Intervention non trouvée</div>;

  // Primary config based on first type for colors
  const primaryType = intervention.types[0];
  const primaryConfig = TRADE_CONFIG[primaryType] || TRADE_CONFIG["plomberie"];

  // Local state for crmType to allow switching in prototype
  const [currentCrmType, setCurrentCrmType] = useState(intervention.crmType);
  const [showTypeSelection, setShowTypeSelection] = useState(false);
  const [showDepannageReport, setShowDepannageReport] = useState(false);
  const [showRDFReport, setShowRDFReport] = useState(false);
  
  // Depannage Report State
  const [diagnostic, setDiagnostic] = useState("");
  const [workDone, setWorkDone] = useState("");
  const [invoiceItems, setInvoiceItems] = useState([
      { id: "labor", name: "Main d'oeuvre (1h)", price: 65, quantity: 1, type: "service" },
      { id: "travel", name: "Déplacement", price: 45, quantity: 1, type: "service" },
      { id: "supplies", name: "Petites fournitures", price: 15, quantity: 1, type: "service" }
  ]);
  const [isAddingArticle, setIsAddingArticle] = useState(false);
  const [signature, setSignature] = useState(false); // Mock signature state
  const [showFinishDialog, setShowFinishDialog] = useState(false);
  
  // RDF Report State
  const [rdfNotes, setRdfNotes] = useState("");
  const [rdfMeasurements, setRdfMeasurements] = useState("");
  
  // Specific RDF State
  const [rdfSpecific1, setRdfSpecific1] = useState(""); // Generic slot 1
  const [rdfSpecific2, setRdfSpecific2] = useState(""); // Generic slot 2
  const [rdfSpecific3, setRdfSpecific3] = useState(""); // Generic slot 3

  const handleNotifyClient = () => {
    toast({
      title: "Client prévenu",
      description: "Un SMS automatique a été envoyé au client pour signaler votre arrivée.",
      duration: 3000,
    });
  };
  
  const handleStartIntervention = () => {
      setStatus("in_progress");
      handleNotifyClient();
  };

  const handleFinishIntervention = () => {
      if (currentCrmType === 'travaux') {
          setShowDepannageReport(true);
      } else if (currentCrmType === 'rdf') {
          setShowRDFReport(true);
      } else {
          setShowTypeSelection(true);
      }
  };

  const selectInterventionType = (type: "travaux" | "rdf") => {
      setCurrentCrmType(type);
      setShowTypeSelection(false);
      
      if (type === 'travaux') {
          setShowDepannageReport(true);
      } else {
        toast({
            title: "Type d'intervention défini",
            description: `Mode Relevé Technique activé.`,
        });
        setShowRDFReport(true);
        setTimeout(handleNotifyClient, 500);
      }
  };

  const addArticle = (article: any) => {
      setInvoiceItems([...invoiceItems, { 
          id: article.id, 
          name: article.name, 
          price: article.price, 
          quantity: 1, 
          type: "article" 
      }]);
      setIsAddingArticle(false);
  };
  
  const removeInvoiceItem = (index: number) => {
      const newItems = [...invoiceItems];
      newItems.splice(index, 1);
      setInvoiceItems(newItems);
  };

  const updateQuantity = (index: number, delta: number) => {
      const newItems = [...invoiceItems];
      const newQuantity = Math.max(1, newItems[index].quantity + delta);
      newItems[index] = { ...newItems[index], quantity: newQuantity };
      setInvoiceItems(newItems);
  };

  const calculateTotal = () => {
      return invoiceItems.reduce((acc, item) => acc + (item.price * item.quantity), 0).toFixed(2);
  };

  const submitCantDo = () => {
      const reasons: Record<string, string> = {
          client_absent: "Client absent",
          no_time: "Manque de temps",
          wrong_material: "Pas le bon matériel",
          sav_product: "SAV produit"
      };
      
      toast({
          title: "Signalement enregistré",
          description: `Motif : ${reasons[cancelReason]}`,
          variant: "destructive"
      });
  };

  const wazeUrl = `https://www.waze.com/ul?q=${encodeURIComponent(intervention.address + " " + intervention.city)}`;
  const phoneNumber = "06 12 34 56 78"; // Mock phone number

  return (
    <Layout>
      {/* Custom Header for Detail View */}
      {/* Depannage / Invoice Report Drawer/Dialog */}
      <Drawer open={showDepannageReport} onOpenChange={setShowDepannageReport}>
        <DrawerContent className="h-[90vh]">
            <div className="mx-auto w-full max-w-lg h-full flex flex-col">
                <DrawerHeader>
                    <DrawerTitle className="flex items-center gap-2">
                        <Wrench className="h-5 w-5 text-blue-600" />
                        Rapport de Dépannage
                    </DrawerTitle>
                </DrawerHeader>
                
                <ScrollArea className="flex-1 px-4">
                    <div className="space-y-6 pb-6">
                        
                        {/* Diagnostic */}
                        <div className="space-y-2">
                            <Label className="font-semibold flex items-center gap-2">
                                <Info className="h-4 w-4" /> Diagnostic
                            </Label>
                            <Textarea 
                                placeholder="Décrivez le problème constaté..." 
                                value={diagnostic}
                                onChange={(e) => setDiagnostic(e.target.value)}
                                className="min-h-[80px]"
                            />
                        </div>

                        {/* Travaux Réalisés */}
                        <div className="space-y-2">
                            <Label className="font-semibold flex items-center gap-2">
                                <CheckSquare className="h-4 w-4" /> Travaux Réalisés
                            </Label>
                            <Textarea 
                                placeholder="Détaillez les actions effectuées..." 
                                value={workDone}
                                onChange={(e) => setWorkDone(e.target.value)}
                                className="min-h-[80px]"
                            />
                        </div>

                        <Separator />

                        {/* Facturation / Panier */}
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <Label className="font-semibold flex items-center gap-2 text-lg">
                                    <Receipt className="h-5 w-5" /> Facturation
                                </Label>
                                <span className="font-bold text-lg">{calculateTotal()} €</span>
                            </div>

                            <div className="space-y-2">
                                {invoiceItems.map((item, index) => (
                                    <div key={index} className="flex items-center justify-between p-3 bg-muted/40 rounded-lg border">
                                        <div className="flex-1">
                                            <p className="font-medium text-sm">{item.name}</p>
                                            <div className="flex items-center gap-2 mt-1">
                                                <Button 
                                                    variant="outline" 
                                                    size="icon" 
                                                    className="h-6 w-6" 
                                                    onClick={() => updateQuantity(index, -1)}
                                                >
                                                    <Minus className="h-3 w-3" />
                                                </Button>
                                                <span className="text-sm font-medium w-6 text-center">{item.quantity}</span>
                                                <Button 
                                                    variant="outline" 
                                                    size="icon" 
                                                    className="h-6 w-6" 
                                                    onClick={() => updateQuantity(index, 1)}
                                                >
                                                    <Plus className="h-3 w-3" />
                                                </Button>
                                                <span className="text-xs text-muted-foreground ml-2">x {item.price}€</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className="font-semibold text-sm">{(item.price * item.quantity).toFixed(2)}€</span>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-600" onClick={() => removeInvoiceItem(index)}>
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <Popover open={isAddingArticle} onOpenChange={setIsAddingArticle}>
                                <PopoverTrigger asChild>
                                    <Button variant="outline" className="w-full border-dashed">
                                        <Plus className="mr-2 h-4 w-4" /> Ajouter un article
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="p-0" align="start">
                                    <Command>
                                        <CommandInput placeholder="Rechercher un article..." />
                                        <CommandList>
                                            <CommandEmpty>Aucun article trouvé.</CommandEmpty>
                                            <CommandGroup heading="Base Article">
                                                {MOCK_ARTICLES.map((article) => (
                                                    <CommandItem
                                                        key={article.id}
                                                        onSelect={() => addArticle(article)}
                                                        className="flex justify-between"
                                                    >
                                                        <span>{article.name}</span>
                                                        <span className="text-muted-foreground ml-2">{article.price}€</span>
                                                    </CommandItem>
                                                ))}
                                            </CommandGroup>
                                        </CommandList>
                                    </Command>
                                </PopoverContent>
                            </Popover>
                        </div>

                        <Separator />

                        {/* Signature Client */}
                        <div className="space-y-2">
                            <Label className="font-semibold flex items-center gap-2">
                                <PenLine className="h-4 w-4" /> 
                                {currentCrmType === 'travaux' ? "Signature PV selon devis" : "Signature du Client"}
                            </Label>
                            {currentCrmType === 'travaux' && (
                                <p className="text-xs text-muted-foreground -mt-1 mb-2">
                                    Veuillez faire signer le PV de réception confirmant la conformité avec le devis initial.
                                </p>
                            )}
                            <div 
                                className={cn(
                                    "border-2 border-dashed rounded-lg h-32 flex items-center justify-center cursor-pointer transition-colors",
                                    signature ? "bg-blue-50 border-blue-200" : "bg-muted/30 hover:bg-muted/50"
                                )}
                                onClick={() => setSignature(!signature)}
                            >
                                {signature ? (
                                    <div className="text-center">
                                        <p className="font-handwriting text-2xl text-blue-800 rotate-[-5deg]">
                                            {currentCrmType === 'travaux' ? "PV Signé / Conforme" : "Lu et Approuvé"}
                                        </p>
                                        <p className="text-xs text-blue-600 mt-2">Signé numériquement</p>
                                    </div>
                                ) : (
                                    <p className="text-sm text-muted-foreground">Cliquer pour signer</p>
                                )}
                            </div>
                        </div>

                    </div>
                </ScrollArea>

                <DrawerFooter className="border-t pt-4">
                    <Button 
                        onClick={() => {
                            if (!signature) {
                                toast({ title: "Signature manquante", description: "Veuillez faire signer le client.", variant: "destructive" });
                                return;
                            }
                            // Validate and close report first (User flow: Validate -> Then Ask)
                            setShowDepannageReport(false);
                            toast({ title: "Rapport validé", description: "L'intervention est enregistrée." });
                            
                            // Open the follow-up question dialog after a short delay for smooth transition
                            setTimeout(() => setShowFinishDialog(true), 300);
                        }} 
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                    >
                        Valider et Terminer
                    </Button>
                    <DrawerClose asChild>
                        <Button variant="outline">Annuler</Button>
                    </DrawerClose>
                </DrawerFooter>
            </div>
        </DrawerContent>
      </Drawer>

      {/* RDF (Relevé Technique) Drawer */}
      <Drawer open={showRDFReport} onOpenChange={setShowRDFReport}>
        <DrawerContent className="h-[90vh]">
            <div className="mx-auto w-full max-w-lg h-full flex flex-col">
                <DrawerHeader>
                    <DrawerTitle className="flex items-center gap-2">
                        <FileText className="h-5 w-5 text-purple-600" />
                        Relevé Technique
                    </DrawerTitle>
                </DrawerHeader>
                
                <ScrollArea className="flex-1 px-4">
                    <div className="space-y-6 pb-6">
                        <div className="bg-purple-50 p-4 rounded-lg border border-purple-100 mb-4">
                            <p className="text-sm text-purple-800">
                                <Info className="h-4 w-4 inline mr-2" />
                                Prenez les mesures et photos nécessaires pour l'établissement du devis.
                            </p>
                        </div>

                        {/* Description */}
                        <div className="space-y-2">
                            <Label className="font-semibold flex items-center gap-2">
                                <Info className="h-4 w-4" /> Description du besoin
                            </Label>
                            <Textarea 
                                placeholder="Que souhaite le client ?" 
                                value={rdfNotes}
                                onChange={(e) => setRdfNotes(e.target.value)}
                                className="min-h-[80px]"
                            />
                        </div>

                        {/* Specific Fields based on Trade */}
                        <div className="space-y-4 border-l-2 border-purple-100 pl-4 py-2">
                            <h4 className="font-semibold text-sm text-purple-700 uppercase tracking-wide mb-3">
                                Spécifique {TRADE_CONFIG[primaryType]?.label || "Métier"}
                            </h4>

                            {primaryType === 'plomberie' && (
                                <>
                                    <div className="space-y-2">
                                        <Label className="text-sm">Type de fuite / Panne</Label>
                                        <Select onValueChange={setRdfSpecific1}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Sélectionner..." />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="fuite_joint">Fuite sur joint</SelectItem>
                                                <SelectItem value="fuite_canalisation">Rupture canalisation</SelectItem>
                                                <SelectItem value="wc_hs">Mécanisme WC HS</SelectItem>
                                                <SelectItem value="robinet_hs">Robinetterie à remplacer</SelectItem>
                                                <SelectItem value="bouchon">Engorgement / Bouchon</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label className="text-sm">Matériau</Label>
                                            <Select onValueChange={setRdfSpecific2}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Cuivre/PVC..." />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="cuivre">Cuivre</SelectItem>
                                                    <SelectItem value="pvc">PVC</SelectItem>
                                                    <SelectItem value="per">PER</SelectItem>
                                                    <SelectItem value="multicouche">Multicouche</SelectItem>
                                                    <SelectItem value="acier">Acier</SelectItem>
                                                    <SelectItem value="plomb">Plomb</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-sm">Diamètre (mm)</Label>
                                            <Input placeholder="ex: 14, 32, 40" value={rdfSpecific3} onChange={(e) => setRdfSpecific3(e.target.value)} />
                                        </div>
                                    </div>
                                </>
                            )}

                            {primaryType === 'serrurerie' && (
                                <>
                                    <div className="space-y-2">
                                        <Label className="text-sm">Type de serrure</Label>
                                        <Select onValueChange={setRdfSpecific1}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Sélectionner..." />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="monopoint">Monopoint</SelectItem>
                                                <SelectItem value="3_points">3 points applique</SelectItem>
                                                <SelectItem value="3_points_encastre">3 points encastré</SelectItem>
                                                <SelectItem value="5_points">5 points</SelectItem>
                                                <SelectItem value="carennee">Carénée</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-sm">Dimensions Cylindre (mm)</Label>
                                        <div className="flex items-center gap-2">
                                            <Input placeholder="Ext." className="w-20" />
                                            <span>x</span>
                                            <Input placeholder="Int." className="w-20" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-sm">Marque</Label>
                                        <Input placeholder="Vachette, Bricard, Picard..." value={rdfSpecific2} onChange={(e) => setRdfSpecific2(e.target.value)} />
                                    </div>
                                </>
                            )}

                            {primaryType === 'vitrerie' && (
                                <>
                                    <div className="space-y-2">
                                        <Label className="text-sm">Type de vitrage</Label>
                                        <Select onValueChange={setRdfSpecific1}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Sélectionner..." />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="simple">Simple vitrage</SelectItem>
                                                <SelectItem value="double">Double vitrage 4/16/4</SelectItem>
                                                <SelectItem value="securit">Verre Sécurit</SelectItem>
                                                <SelectItem value="feuillete">Feuilleté (Stadip)</SelectItem>
                                                <SelectItem value="arme">Verre armé</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-sm">Dimensions Clair de jour (mm)</Label>
                                        <div className="flex items-center gap-2">
                                            <Input placeholder="Largeur" />
                                            <span>x</span>
                                            <Input placeholder="Hauteur" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-sm">Épaisseur totale</Label>
                                        <Input placeholder="ex: 24mm" value={rdfSpecific2} onChange={(e) => setRdfSpecific2(e.target.value)} />
                                    </div>
                                </>
                            )}
                            
                            {primaryType === 'electricite' && (
                                <>
                                    <div className="space-y-2">
                                        <Label className="text-sm">Type d'intervention</Label>
                                        <Select onValueChange={setRdfSpecific1}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Sélectionner..." />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="panne_totale">Panne totale</SelectItem>
                                                <SelectItem value="panne_partielle">Panne partielle (1 circuit)</SelectItem>
                                                <SelectItem value="tableau">Tableau électrique</SelectItem>
                                                <SelectItem value="appareillage">Prise / Interrupteur</SelectItem>
                                                <SelectItem value="eclairage">Éclairage</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-sm">Installation</Label>
                                        <RadioGroup defaultValue="monophase" className="flex gap-4">
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem value="monophase" id="mono" />
                                                <Label htmlFor="mono">Monophasé</Label>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem value="triphase" id="tri" />
                                                <Label htmlFor="tri">Triphasé</Label>
                                            </div>
                                        </RadioGroup>
                                    </div>
                                </>
                            )}

                             {/* Default / Fallback */}
                            {!['plomberie', 'serrurerie', 'vitrerie', 'electricite'].includes(primaryType) && (
                                <div className="p-3 bg-muted/50 rounded text-sm text-muted-foreground italic">
                                    Utilisez la zone de prise de cotes libre ci-dessous pour ce métier.
                                </div>
                            )}

                        </div>

                        {/* Prise de cotes (Generic fallback/addition) */}
                        <div className="space-y-2">
                            <Label className="font-semibold flex items-center gap-2">
                                <Ruler className="h-4 w-4" /> Prise de cotes / Notes complémentaires
                            </Label>
                            <Textarea 
                                placeholder="Dimensions, références supplémentaires, accès..." 
                                value={rdfMeasurements}
                                onChange={(e) => setRdfMeasurements(e.target.value)}
                                className="min-h-[100px] font-mono text-sm"
                            />
                        </div>
                        
                         {/* Photos Placeholder */}
                         <div className="space-y-2">
                            <Label className="font-semibold flex items-center gap-2">
                                <Camera className="h-4 w-4" /> Photos
                            </Label>
                            <div className="grid grid-cols-2 gap-2">
                                <div className="aspect-square bg-muted rounded-lg flex items-center justify-center border-2 border-dashed border-muted-foreground/20 cursor-pointer hover:bg-muted/80">
                                    <Plus className="h-6 w-6 text-muted-foreground" />
                                </div>
                            </div>
                        </div>

                    </div>
                </ScrollArea>

                <DrawerFooter className="border-t pt-4">
                    <Button onClick={() => {
                        setShowRDFReport(false);
                        toast({ 
                            title: "Relevé enregistré", 
                            description: "Une nouvelle intervention a été créée pour la suite des travaux." 
                        });
                        setTimeout(() => setLocation("/"), 1500);
                    }} className="w-full bg-purple-600 hover:bg-purple-700 text-white">
                        Transmettre et Créer Suite
                    </Button>
                    <DrawerClose asChild>
                        <Button variant="outline">Annuler</Button>
                    </DrawerClose>
                </DrawerFooter>
            </div>
        </DrawerContent>
      </Drawer>

      <Dialog open={showFinishDialog} onOpenChange={setShowFinishDialog}>
        <DialogContent className="sm:max-w-md">
            <div className="flex flex-col items-center gap-4 py-4 text-center">
                <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                    <Info className="h-6 w-6 text-blue-600" />
                </div>
                <div className="space-y-2">
                    <h3 className="text-lg font-semibold">Devis complémentaire à réaliser ?</h3>
                    <p className="text-sm text-muted-foreground">
                        Y a-t-il des travaux supplémentaires nécessitant un devis ?
                    </p>
                </div>
                <div className="grid grid-cols-2 gap-3 w-full mt-2">
                    <Button 
                        variant="outline"
                        className="h-24 flex flex-col gap-2 hover:bg-gray-100"
                        onClick={() => {
                            setShowFinishDialog(false);
                            // Report already closed
                            toast({ 
                                title: "Dossier clôturé", 
                                description: "L'intervention est passée au statut 'Terminé'." 
                            });
                            setTimeout(() => setLocation("/"), 1000);
                        }}
                    >
                        <Ban className="h-6 w-6 text-gray-500" />
                        <span className="font-semibold">Non</span>
                        <span className="text-xs text-muted-foreground font-normal">Clôturer le dossier</span>
                    </Button>
                    <Button 
                        className="h-24 flex flex-col gap-2 bg-blue-600 hover:bg-blue-700 text-white"
                        onClick={() => {
                            setShowFinishDialog(false);
                            // Report already closed
                            // Open RDF module
                            setTimeout(() => setShowRDFReport(true), 300);
                        }}
                    >
                        <FileText className="h-6 w-6" />
                        <span className="font-semibold">Oui</span>
                        <span className="text-xs text-white/80 font-normal">Ouvrir Relevé Tech.</span>
                    </Button>
                </div>
            </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showTypeSelection} onOpenChange={setShowTypeSelection}>
        <DialogContent className="sm:max-w-md">
            <div className="flex flex-col items-center gap-4 py-4 text-center">
                <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                    <Info className="h-6 w-6 text-blue-600" />
                </div>
                <div className="space-y-2">
                    <h3 className="text-lg font-semibold">Type d'intervention</h3>
                    <p className="text-sm text-muted-foreground">
                        Cette intervention n'est pas qualifiée. Que souhaitez-vous faire ?
                    </p>
                </div>
                <div className="grid grid-cols-2 gap-3 w-full mt-2">
                    <Button 
                        variant="outline" 
                        className="h-24 flex flex-col gap-2 hover:border-blue-500 hover:bg-blue-50"
                        onClick={() => selectInterventionType('travaux')}
                    >
                        <Wrench className="h-6 w-6 text-blue-600" />
                        <span className="font-semibold">Dépanner</span>
                        <span className="text-xs text-muted-foreground font-normal">Réparation immédiate</span>
                    </Button>
                    <Button 
                        variant="outline" 
                        className="h-24 flex flex-col gap-2 hover:border-purple-500 hover:bg-purple-50"
                        onClick={() => selectInterventionType('rdf')}
                    >
                        <FileText className="h-6 w-6 text-purple-600" />
                        <span className="font-semibold">Relevé Tech.</span>
                        <span className="text-xs text-muted-foreground font-normal">Prise de cotes / Devis</span>
                    </Button>
                </div>
            </div>
        </DialogContent>
      </Dialog>

      <Dialog open={!!selectedPhoto} onOpenChange={(open) => !open && setSelectedPhoto(null)}>
        <DialogContent className="max-w-3xl p-0 overflow-hidden bg-black/90 border-none h-full md:h-auto flex flex-col justify-center">
            <div className="relative w-full h-full flex items-center justify-center">
                <Button 
                    variant="ghost" 
                    size="icon" 
                    className="absolute top-4 right-4 text-white z-50 hover:bg-white/20" 
                    onClick={() => setSelectedPhoto(null)}
                >
                    <X className="h-6 w-6" />
                    <span className="sr-only">Fermer</span>
                </Button>
                {selectedPhoto && (
                    <img 
                        src={selectedPhoto} 
                        alt="Photo en grand" 
                        className="max-h-[80vh] w-auto object-contain"
                    />
                )}
            </div>
            <div className="p-4 text-center">
                <Button variant="outline" className="w-full max-w-xs mx-auto" onClick={() => setSelectedPhoto(null)}>
                    Retour
                </Button>
            </div>
        </DialogContent>
      </Dialog>

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
                <Button variant="outline" size="sm" className={cn(
                    "gap-2 text-primary border-primary/20 bg-primary/5 relative",
                    intervention.id === "int-101" && "animate-pulse border-blue-300 bg-blue-50"
                )}>
                   <MessageSquare className="h-4 w-4" />
                   <span className="hidden sm:inline">Discussion</span>
                   {intervention.id === "int-101" && (
                        <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full border-2 border-white" />
                   )}
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
                                <Badge variant="outline" className={cn("text-[10px] font-medium border", CRM_TYPE_COLORS[currentCrmType])}>
                                    {CRM_TYPE_LABELS[currentCrmType]}
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

            {/* Action Buttons (Moved from bottom) */}
            {intervention.status === "todo" && (
                <div className="flex gap-3 mb-2">
                    <Drawer>
                        <DrawerTrigger asChild>
                            <Button variant="outline" className="flex-1 h-12 border-red-200 text-red-600 hover:text-red-700 hover:bg-red-50 text-xs sm:text-sm">
                                <Ban className="h-4 w-4 sm:mr-2 shrink-0" />
                                <span className="hidden sm:inline">Je ne peux pas</span>
                                <span className="sm:hidden">Impossible</span>
                            </Button>
                        </DrawerTrigger>
                        <DrawerContent>
                            <div className="mx-auto w-full max-w-sm">
                                <DrawerHeader>
                                    <DrawerTitle>Pourquoi ne pouvez-vous pas intervenir ?</DrawerTitle>
                                </DrawerHeader>
                                <div className="p-4 pb-0">
                                    <RadioGroup value={cancelReason} onValueChange={setCancelReason} className="gap-3">
                                        <div className="flex items-center space-x-2 border p-3 rounded-lg has-[:checked]:bg-red-50 has-[:checked]:border-red-200">
                                            <RadioGroupItem value="client_absent" id="r1" />
                                            <Label htmlFor="r1" className="flex-1 cursor-pointer">Client absent</Label>
                                        </div>
                                        <div className="flex items-center space-x-2 border p-3 rounded-lg has-[:checked]:bg-red-50 has-[:checked]:border-red-200">
                                            <RadioGroupItem value="no_time" id="r2" />
                                            <Label htmlFor="r2" className="flex-1 cursor-pointer">Manque de temps</Label>
                                        </div>
                                        <div className="flex items-center space-x-2 border p-3 rounded-lg has-[:checked]:bg-red-50 has-[:checked]:border-red-200">
                                            <RadioGroupItem value="wrong_material" id="r3" />
                                            <Label htmlFor="r3" className="flex-1 cursor-pointer">Pas le bon matériel</Label>
                                        </div>
                                        <div className="flex items-center space-x-2 border p-3 rounded-lg has-[:checked]:bg-red-50 has-[:checked]:border-red-200">
                                            <RadioGroupItem value="sav_product" id="r4" />
                                            <Label htmlFor="r4" className="flex-1 cursor-pointer">SAV produit</Label>
                                        </div>
                                    </RadioGroup>
                                </div>
                                <DrawerFooter>
                                    <DrawerClose asChild>
                                        <Button onClick={submitCantDo} className="w-full bg-red-600 hover:bg-red-700 text-white">Confirmer</Button>
                                    </DrawerClose>
                                    <DrawerClose asChild>
                                        <Button variant="outline">Annuler</Button>
                                    </DrawerClose>
                                </DrawerFooter>
                            </div>
                        </DrawerContent>
                    </Drawer>

                    <Button className="flex-1 h-12 bg-green-600 hover:bg-green-700 text-white shadow-md text-xs sm:text-sm" onClick={handleStartIntervention}>
                        <Play className="h-4 w-4 sm:mr-2 shrink-0 fill-current" />
                        Commencer
                    </Button>
                </div>
            )}

            {/* Media & Docs Tabs */}
            <Tabs defaultValue="photos" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="photos" className="gap-2">
                        <ImageIcon className="h-4 w-4" /> Médiathèque
                    </TabsTrigger>
                    <TabsTrigger value="docs" className="gap-2">
                        <FolderOpen className="h-4 w-4" /> Documents
                    </TabsTrigger>
                </TabsList>
                
                <TabsContent value="photos" className="space-y-6 mt-4">
                    {/* Section Avant Travaux */}
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <h3 className="text-sm font-semibold flex items-center gap-2">
                                <span className="bg-orange-100 text-orange-700 text-xs px-2 py-1 rounded-md border border-orange-200">AVANT</span>
                                Travaux
                            </h3>
                            <span className="text-xs text-muted-foreground">{photosBefore.length} photos</span>
                        </div>
                        
                        {/* Photos Grid Avant */}
                        {photosBefore.length > 0 && (
                            <div className="grid grid-cols-3 gap-2">
                                {photosBefore.map(photo => (
                                    <div 
                                        key={photo.id} 
                                        className="aspect-square rounded-md overflow-hidden relative cursor-pointer border border-border"
                                        onClick={() => setSelectedPhoto(photo.url)}
                                    >
                                        <img src={photo.url} className="w-full h-full object-cover" alt="Avant travaux" />
                                        <Badge className="absolute bottom-1 right-1 text-[10px] px-1 h-4 bg-black/60 hover:bg-black/70 backdrop-blur-sm border-none text-white">
                                            {photo.room}
                                        </Badge>
                                    </div>
                                ))}
                            </div>
                        )}

                        <Card className="border-dashed border-2 bg-muted/10">
                            <CardContent className="flex flex-col items-center justify-center py-6 gap-3">
                                <div className="bg-muted p-3 rounded-full">
                                    <Camera className="h-5 w-5 text-muted-foreground" />
                                </div>
                                <div className="w-full max-w-[200px]">
                                    <Label className="text-xs text-muted-foreground mb-1.5 block text-center">Pièce concernée</Label>
                                    <Select defaultValue="cuisine">
                                        <SelectTrigger className="h-8 text-xs bg-background">
                                            <SelectValue placeholder="Choisir pièce" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="cuisine">Cuisine</SelectItem>
                                            <SelectItem value="sdb">Salle de bain</SelectItem>
                                            <SelectItem value="salon">Salon</SelectItem>
                                            <SelectItem value="entree">Entrée</SelectItem>
                                            <SelectItem value="exterieur">Extérieur</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <Button size="sm" variant="outline" className="mt-1 w-full max-w-[200px]">
                                    <Camera className="mr-2 h-3.5 w-3.5" /> Ajouter photo Avant
                                </Button>
                            </CardContent>
                        </Card>
                    </div>

                    <Separator />

                    {/* Section Après Travaux */}
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <h3 className="text-sm font-semibold flex items-center gap-2">
                                <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-md border border-green-200">APRÈS</span>
                                Travaux
                            </h3>
                            <span className="text-xs text-muted-foreground">{photosAfter.length} photos</span>
                        </div>

                        {/* Photos Grid Après */}
                        {photosAfter.length > 0 && (
                            <div className="grid grid-cols-3 gap-2">
                                {photosAfter.map(photo => (
                                    <div 
                                        key={photo.id} 
                                        className="aspect-square rounded-md overflow-hidden relative cursor-pointer border border-border"
                                        onClick={() => setSelectedPhoto(photo.url)}
                                    >
                                        <img src={photo.url} className="w-full h-full object-cover" alt="Après travaux" />
                                        <Badge className="absolute bottom-1 right-1 text-[10px] px-1 h-4 bg-black/60 hover:bg-black/70 backdrop-blur-sm border-none text-white">
                                            {photo.room}
                                        </Badge>
                                    </div>
                                ))}
                            </div>
                        )}

                        <Card className="border-dashed border-2 bg-muted/10">
                            <CardContent className="flex flex-col items-center justify-center py-6 gap-3">
                                <div className="bg-muted p-3 rounded-full">
                                    <Camera className="h-5 w-5 text-muted-foreground" />
                                </div>
                                <div className="w-full max-w-[200px]">
                                    <Label className="text-xs text-muted-foreground mb-1.5 block text-center">Pièce concernée</Label>
                                    <Select defaultValue="cuisine">
                                        <SelectTrigger className="h-8 text-xs bg-background">
                                            <SelectValue placeholder="Choisir pièce" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="cuisine">Cuisine</SelectItem>
                                            <SelectItem value="sdb">Salle de bain</SelectItem>
                                            <SelectItem value="salon">Salon</SelectItem>
                                            <SelectItem value="entree">Entrée</SelectItem>
                                            <SelectItem value="exterieur">Extérieur</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <Button size="sm" variant="outline" className="mt-1 w-full max-w-[200px]">
                                    <Camera className="mr-2 h-3.5 w-3.5" /> Ajouter photo Après
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="docs" className="space-y-3 mt-4">
                    {/* Documents List */}
                    <div className="space-y-2">
                        {/* Devis */}
                        <Card className="overflow-hidden">
                            <div className="flex items-center p-3 gap-3">
                                <div className="bg-blue-100 p-2 rounded-lg shrink-0">
                                    <FileText className="h-5 w-5 text-blue-600" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold truncate">Devis sans prix</p>
                                    <p className="text-xs text-muted-foreground">PDF • 1.2 MB</p>
                                </div>
                                <Button size="icon" variant="ghost" className="shrink-0 text-muted-foreground">
                                    <Eye className="h-4 w-4" />
                                </Button>
                            </div>
                        </Card>

                        {/* Relevé Technique (RT) - Only show if RDF or A Definir */}
                        {(currentCrmType === 'rdf' || currentCrmType === 'a_definir') && (
                        <Card className="overflow-hidden">
                            <div className="flex items-center p-3 gap-3">
                                <div className="bg-purple-100 p-2 rounded-lg shrink-0">
                                    <FileCheck className="h-5 w-5 text-purple-600" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold truncate">Relevé Technique (RT)</p>
                                    <p className="text-xs text-muted-foreground">Document à compléter</p>
                                </div>
                                <Button size="icon" variant="ghost" className="shrink-0 text-muted-foreground">
                                    <Eye className="h-4 w-4" />
                                </Button>
                            </div>
                        </Card>
                        )}

                        {/* Commande - Only show if Travaux */}
                        {currentCrmType === 'travaux' && (
                        <Card className="overflow-hidden">
                            <div className="flex items-center p-3 gap-3">
                                <div className="bg-orange-100 p-2 rounded-lg shrink-0">
                                    <ShoppingCart className="h-5 w-5 text-orange-600" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold truncate">Bon de Commande</p>
                                    <p className="text-xs text-muted-foreground">Matériel validé</p>
                                </div>
                                <Button size="icon" variant="ghost" className="shrink-0 text-muted-foreground">
                                    <Eye className="h-4 w-4" />
                                </Button>
                            </div>
                        </Card>
                        )}
                    </div>

                    <Button size="sm" variant="outline" className="w-full mt-2 border-dashed">
                        <Upload className="mr-2 h-4 w-4" /> Ajouter un autre document
                    </Button>
                </TabsContent>
            </Tabs>

        </div>
      </div>

      {/* Floating Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background border-t pb-safe z-50 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
         <div className="flex gap-3">
            {status === "in_progress" ? (
                <>
                    <Button variant="outline" className="flex-1 h-12 border-orange-200 text-orange-600 hover:text-orange-700 hover:bg-orange-50">
                        <Pause className="h-5 w-5 mr-2" /> Pause
                    </Button>
                    <Button 
                        className="flex-[2] h-12 bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-600/20"
                        onClick={handleFinishIntervention}
                    >
                        <CheckSquare className="h-5 w-5 mr-2" /> Terminer
                    </Button>
                </>
            ) : status === "todo" && (
                <div className="flex w-full gap-3">
                    <Drawer>
                        <DrawerTrigger asChild>
                            <Button variant="outline" className="flex-1 h-12 border-red-200 text-red-600 hover:text-red-700 hover:bg-red-50 text-xs sm:text-sm">
                                <Ban className="h-4 w-4 sm:mr-2 shrink-0" />
                                <span className="hidden sm:inline">Je ne peux pas</span>
                                <span className="sm:hidden">Impossible</span>
                            </Button>
                        </DrawerTrigger>
                        <DrawerContent>
                            <div className="mx-auto w-full max-w-sm">
                                <DrawerHeader>
                                    <DrawerTitle>Pourquoi ne pouvez-vous pas intervenir ?</DrawerTitle>
                                </DrawerHeader>
                                <div className="p-4 pb-0">
                                    <RadioGroup value={cancelReason} onValueChange={setCancelReason} className="gap-3">
                                        <div className="flex items-center space-x-2 border p-3 rounded-lg has-[:checked]:bg-red-50 has-[:checked]:border-red-200">
                                            <RadioGroupItem value="client_absent" id="r1" />
                                            <Label htmlFor="r1" className="flex-1 cursor-pointer">Client absent</Label>
                                        </div>
                                        <div className="flex items-center space-x-2 border p-3 rounded-lg has-[:checked]:bg-red-50 has-[:checked]:border-red-200">
                                            <RadioGroupItem value="no_time" id="r2" />
                                            <Label htmlFor="r2" className="flex-1 cursor-pointer">Manque de temps</Label>
                                        </div>
                                        <div className="flex items-center space-x-2 border p-3 rounded-lg has-[:checked]:bg-red-50 has-[:checked]:border-red-200">
                                            <RadioGroupItem value="wrong_material" id="r3" />
                                            <Label htmlFor="r3" className="flex-1 cursor-pointer">Pas le bon matériel</Label>
                                        </div>
                                        <div className="flex items-center space-x-2 border p-3 rounded-lg has-[:checked]:bg-red-50 has-[:checked]:border-red-200">
                                            <RadioGroupItem value="sav_product" id="r4" />
                                            <Label htmlFor="r4" className="flex-1 cursor-pointer">SAV produit</Label>
                                        </div>
                                    </RadioGroup>
                                </div>
                                <DrawerFooter>
                                    <DrawerClose asChild>
                                        <Button onClick={submitCantDo} className="w-full bg-red-600 hover:bg-red-700 text-white">Confirmer</Button>
                                    </DrawerClose>
                                    <DrawerClose asChild>
                                        <Button variant="outline">Annuler</Button>
                                    </DrawerClose>
                                </DrawerFooter>
                            </div>
                        </DrawerContent>
                    </Drawer>

                    <Button className="flex-1 h-12 bg-green-600 hover:bg-green-700 text-white shadow-md text-xs sm:text-sm" onClick={handleStartIntervention}>
                        <Play className="h-4 w-4 sm:mr-2 shrink-0 fill-current" />
                        Commencer
                    </Button>
                </div>
            )}
         </div>
      </div>
    </Layout>
  );
}
