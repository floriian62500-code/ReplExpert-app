import { useState } from "react";
import { useLocation } from "wouter";
import { 
  Users, 
  LogOut, 
  Plus, 
  Search, 
  Bell,
  Briefcase,
  Edit,
  Trash2,
  FileText,
  Hammer
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MOCK_TECHNICIANS, TRADE_CONFIG, Technician } from "@/lib/mockData";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";

export default function AdminDashboard() {
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState("technicians");
  const { toast } = useToast();

  // Technician Management State
  const [technicians, setTechnicians] = useState<Technician[]>(MOCK_TECHNICIANS);
  const [editingTech, setEditingTech] = useState<Technician | null>(null);
  const [isEditingTech, setIsEditingTech] = useState(false);
  const [newTech, setNewTech] = useState<Partial<Technician>>({
      firstName: "",
      lastName: "",
      monthlyGoal: 10000,
      daysPresent: 20,
      status: "active"
  });
  const [isAddingTech, setIsAddingTech] = useState(false);
  
  // RT Creation State
  const [isCreatingRT, setIsCreatingRT] = useState(false);
  const [selectedUniverse, setSelectedUniverse] = useState<string>("");
  const [rtFields, setRtFields] = useState<string[]>([]); // To simulate showing "creation part"

  const handleUniverseSelect = (universe: string) => {
      setSelectedUniverse(universe);
      // Mock fields based on universe to show "What is in this RT"
      if (universe === 'plomberie') setRtFields(["Type de fuite", "Matériau", "Diamètre"]);
      else if (universe === 'serrurerie') setRtFields(["Type de serrure", "Dimensions Cylindre", "Marque"]);
      else if (universe === 'vitrerie') setRtFields(["Type de vitrage", "Clair de jour", "Épaisseur"]);
      else if (universe === 'electricite') setRtFields(["Type de panne", "Installation (Mono/Tri)"]);
      else setRtFields(["Prise de cotes libre", "Photos"]);
  };

  const handleSaveTech = () => {
      if (editingTech) {
          setTechnicians(technicians.map(t => t.id === editingTech.id ? editingTech : t));
          setIsEditingTech(false);
          setEditingTech(null);
          toast({ title: "Technicien mis à jour", description: "Les modifications ont été enregistrées." });
      }
  };

  const handleAddTech = () => {
      const techToAdd: Technician = {
          id: `tech-${Date.now()}`,
          firstName: newTech.firstName || "Nouveau",
          lastName: newTech.lastName || "Technicien",
          monthlyGoal: newTech.monthlyGoal || 10000,
          daysPresent: newTech.daysPresent || 20,
          monthlyRevenue: 0,
          status: "active"
      };
      setTechnicians([...technicians, techToAdd]);
      setIsAddingTech(false);
      setNewTech({ firstName: "", lastName: "", monthlyGoal: 10000, daysPresent: 20, status: "active" });
      toast({ title: "Technicien créé", description: "Le nouveau technicien a été ajouté à l'équipe." });
  };

  const handleCreateRT = () => {
      setIsCreatingRT(false);
      toast({ title: "Relevé Technique Créé", description: "Le dossier a été ouvert et assigné." });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar - Desktop */}
      <aside className="w-64 bg-white border-r hidden md:flex flex-col fixed h-full z-10">
        <div className="p-6 border-b">
          <h1 className="text-2xl font-bold text-blue-600 flex items-center gap-2">
            <Briefcase className="h-6 w-6" />
            HELPCONFORT
          </h1>
          <p className="text-xs text-muted-foreground mt-1">Administration</p>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          <Button 
            variant={activeTab === "technicians" ? "secondary" : "ghost"} 
            className="w-full justify-start" 
            onClick={() => setActiveTab("technicians")}
          >
            <Users className="mr-3 h-5 w-5" />
            Gestion Techniciens
          </Button>
          <Button 
            variant={activeTab === "rt" ? "secondary" : "ghost"} 
            className="w-full justify-start"
            onClick={() => setActiveTab("rt")}
          >
            <FileText className="mr-3 h-5 w-5" />
            Création RT
          </Button>
        </nav>

        <div className="p-4 border-t">
          <Button 
            variant="ghost" 
            className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
            onClick={() => setLocation("/")}
          >
            <LogOut className="mr-3 h-5 w-5" />
            Retour Portail
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 p-8">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-800">
              {activeTab === 'technicians' && 'Gestion des Techniciens'}
              {activeTab === 'rt' && 'Création de Relevé Technique'}
            </h2>
            <p className="text-muted-foreground">Espace d'administration simplifié.</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Rechercher..." className="pl-9 w-64 bg-white" />
            </div>
            <Button size="icon" variant="outline" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-2 right-2 h-2 w-2 bg-red-500 rounded-full" />
            </Button>
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>AD</AvatarFallback>
            </Avatar>
          </div>
        </header>

        {activeTab === "technicians" && (
            <div className="space-y-6">
                 <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle>Équipe Technique</CardTitle>
                      <CardDescription>Créez les profils, définissez les objectifs (CA) et les compétences par univers.</CardDescription>
                    </div>
                    <Dialog open={isAddingTech} onOpenChange={setIsAddingTech}>
                        <DialogTrigger asChild>
                            <Button className="bg-blue-600 hover:bg-blue-700">
                                <Plus className="mr-2 h-4 w-4" /> Créer Technicien
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Nouveau Technicien</DialogTitle>
                                <DialogDescription>Renseignez les informations du collaborateur.</DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="firstName" className="text-right">Prénom</Label>
                                    <Input id="firstName" value={newTech.firstName} onChange={e => setNewTech({...newTech, firstName: e.target.value})} className="col-span-3" />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="lastName" className="text-right">Nom</Label>
                                    <Input id="lastName" value={newTech.lastName} onChange={e => setNewTech({...newTech, lastName: e.target.value})} className="col-span-3" />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="goal" className="text-right">Objectif CA (€)</Label>
                                    <Input id="goal" type="number" value={newTech.monthlyGoal} onChange={e => setNewTech({...newTech, monthlyGoal: parseInt(e.target.value)})} className="col-span-3" />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="days" className="text-right">Jours Présence</Label>
                                    <div className="col-span-3 flex items-center gap-2">
                                        <Input id="days" type="number" value={newTech.daysPresent} onChange={e => setNewTech({...newTech, daysPresent: parseInt(e.target.value)})} />
                                        <span className="text-xs text-muted-foreground whitespace-nowrap">
                                            Obj. Jour: {Math.round((newTech.monthlyGoal || 0) / (newTech.daysPresent || 1))}€
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <DialogFooter>
                                <Button onClick={handleAddTech}>Valider la création</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Technicien</TableHead>
                          <TableHead>Statut</TableHead>
                          <TableHead>Objectif Mensuel</TableHead>
                          <TableHead>Jours Prés.</TableHead>
                          <TableHead>Objectif Jour</TableHead>
                          <TableHead>Compétences (Univers)</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {technicians.map((tech) => (
                          <TableRow key={tech.id}>
                            <TableCell className="font-medium">
                                <div className="flex items-center gap-3">
                                    <Avatar>
                                        <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${tech.firstName}`} />
                                        <AvatarFallback>{tech.firstName[0]}{tech.lastName[0]}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="font-semibold">{tech.firstName} {tech.lastName}</p>
                                        <p className="text-xs text-muted-foreground">ID: {tech.id}</p>
                                    </div>
                                </div>
                            </TableCell>
                            <TableCell>
                                <Badge variant={tech.status === 'active' ? 'default' : 'secondary'}>
                                    {tech.status === 'active' ? 'Actif' : tech.status === 'break' ? 'En pause' : 'Absent'}
                                </Badge>
                            </TableCell>
                            <TableCell>{tech.monthlyGoal} €</TableCell>
                            <TableCell>{tech.daysPresent}j</TableCell>
                            <TableCell className="font-medium text-blue-600">
                                {Math.round(tech.monthlyGoal / (tech.daysPresent || 1))} €
                            </TableCell>
                            <TableCell>
                                <div className="flex flex-wrap gap-1">
                                    {/* Mock dynamic skills display */}
                                    <Badge variant="outline" className="text-xs border-cyan-200 bg-cyan-50 text-cyan-700">Plomberie</Badge>
                                    <Badge variant="outline" className="text-xs border-pink-200 bg-pink-50 text-pink-700">Serrurerie</Badge>
                                </div>
                            </TableCell>
                            <TableCell className="text-right">
                                <Button variant="ghost" size="icon" onClick={() => {
                                    setEditingTech(tech);
                                    setIsEditingTech(true);
                                }}>
                                    <Edit className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600">
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>

                {/* Edit Technician Dialog */}
                <Dialog open={isEditingTech} onOpenChange={setIsEditingTech}>
                    <DialogContent className="sm:max-w-[600px]">
                        <DialogHeader>
                            <DialogTitle>Modifier Technicien</DialogTitle>
                            <DialogDescription>Gérez les objectifs financiers et les compétences métiers.</DialogDescription>
                        </DialogHeader>
                        {editingTech && (
                            <div className="grid gap-6 py-4">
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label className="text-right">Nom</Label>
                                    <Input value={`${editingTech.firstName} ${editingTech.lastName}`} disabled className="col-span-3 bg-muted" />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="edit-goal" className="text-right">Obj. Mensuel (€)</Label>
                                    <Input 
                                        id="edit-goal" 
                                        type="number" 
                                        value={editingTech.monthlyGoal} 
                                        onChange={(e) => setEditingTech({...editingTech, monthlyGoal: parseInt(e.target.value)})}
                                        className="col-span-3" 
                                    />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="edit-days" className="text-right">Jours Présence</Label>
                                    <div className="col-span-3 flex items-center gap-2">
                                        <Input 
                                            id="edit-days" 
                                            type="number" 
                                            value={editingTech.daysPresent} 
                                            onChange={(e) => setEditingTech({...editingTech, daysPresent: parseInt(e.target.value)})}
                                        />
                                        <div className="text-xs text-muted-foreground whitespace-nowrap bg-blue-50 px-2 py-1 rounded border border-blue-100">
                                            Obj. Jour: <span className="font-bold text-blue-700">{Math.round((editingTech.monthlyGoal || 0) / (editingTech.daysPresent || 1))}€</span>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="space-y-4 border rounded-lg p-4 bg-gray-50/50">
                                    <h4 className="font-medium flex items-center gap-2">
                                        <Hammer className="h-4 w-4" />
                                        Compétences par Univers
                                    </h4>
                                    <div className="grid grid-cols-2 gap-4">
                                        {Object.entries(TRADE_CONFIG).map(([key, config]) => (
                                            <div key={key} className="flex items-center space-x-2 bg-white p-2 rounded border">
                                                <Checkbox id={`skill-${key}`} defaultChecked={['plomberie', 'serrurerie'].includes(key)} />
                                                <Label htmlFor={`skill-${key}`} className="text-sm font-normal cursor-pointer flex-1">
                                                    {config.label}
                                                </Label>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsEditingTech(false)}>Annuler</Button>
                            <Button onClick={handleSaveTech} className="bg-blue-600 hover:bg-blue-700">Enregistrer les modifications</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        )}

        {activeTab === "rt" && (
            <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Left Col: Universe Selection */}
                <Card className="md:col-span-1 h-fit">
                    <CardHeader>
                        <CardTitle className="text-lg">1. Choisir l'Univers</CardTitle>
                        <CardDescription>Sélectionnez le métier pour configurer le RT.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        {Object.entries(TRADE_CONFIG).map(([key, config]) => (
                            <div 
                                key={key}
                                className={`p-3 rounded-lg border cursor-pointer transition-all flex items-center gap-3 ${selectedUniverse === key ? 'bg-blue-50 border-blue-500 ring-1 ring-blue-500' : 'hover:bg-gray-50'}`}
                                onClick={() => handleUniverseSelect(key)}
                            >
                                <div className={`w-3 h-3 rounded-full ${selectedUniverse === key ? 'bg-blue-500' : 'bg-gray-200'}`} />
                                <span className="font-medium text-sm">{config.label}</span>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                {/* Right Col: Creation Form */}
                <Card className="md:col-span-2">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple-100 rounded-lg">
                            <FileText className="h-6 w-6 text-purple-600" />
                        </div>
                        <div>
                            <CardTitle>2. Création de Relevé Technique (RT)</CardTitle>
                            <CardDescription>
                                {selectedUniverse ? `Configuration pour : ${TRADE_CONFIG[selectedUniverse]?.label}` : "Veuillez sélectionner un univers à gauche"}
                            </CardDescription>
                        </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {selectedUniverse ? (
                        <div className="space-y-4">
                            <div className="bg-slate-50 p-4 rounded-md border border-slate-200 mb-6">
                                <h4 className="text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                                    <Hammer className="h-4 w-4" />
                                    Champs spécifiques inclus pour ce RT :
                                </h4>
                                <ul className="list-disc list-inside text-sm text-slate-600 space-y-1">
                                    {rtFields.map((field, idx) => (
                                        <li key={idx}>{field}</li>
                                    ))}
                                    <li className="italic text-slate-400">... + Prise de cotes libre & Photos</li>
                                </ul>
                            </div>

                            <div className="space-y-2">
                                <Label>Client</Label>
                                <Input placeholder="Nom du client" />
                            </div>
                            <div className="space-y-2">
                                <Label>Adresse d'intervention</Label>
                                <Input placeholder="Adresse complète" />
                            </div>
                            
                            <div className="space-y-2">
                                <Label>Description de la demande</Label>
                                <Input placeholder="Détails..." />
                            </div>

                            <div className="space-y-2">
                                <Label>Technicien Assigné</Label>
                                <Select>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Choisir un technicien..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {technicians.map((tech) => (
                                            <SelectItem key={tech.id} value={tech.id}>{tech.firstName} {tech.lastName}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <Button onClick={handleCreateRT} className="w-full bg-purple-600 hover:bg-purple-700 h-12 text-lg mt-4">
                                Créer et Assigner le RT {TRADE_CONFIG[selectedUniverse]?.label}
                            </Button>
                        </div>
                    ) : (
                        <div className="h-64 flex flex-col items-center justify-center text-muted-foreground bg-muted/10 rounded-lg border-2 border-dashed">
                            <Briefcase className="h-12 w-12 mb-4 opacity-20" />
                            <p>Sélectionnez un univers métier dans la colonne de gauche</p>
                            <p>pour commencer la création du RT.</p>
                        </div>
                    )}
                  </CardContent>
                </Card>
            </div>
        )}
      </main>
    </div>
  );
}