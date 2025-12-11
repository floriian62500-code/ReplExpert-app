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
  Hammer,
  GitFork,
  ArrowLeft,
  Save
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
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

  // New RT Editor State
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [templateName, setTemplateName] = useState("");
  const [isArboMode, setIsArboMode] = useState(false);
  const [editorFields, setEditorFields] = useState<{id: string, label: string, type: string, parent?: string}[]>([
      { id: '1', label: 'Type de panne', type: 'select', parent: undefined },
      { id: '2', label: 'Localisation', type: 'text', parent: undefined }
  ]);
  const [newFieldLabel, setNewFieldLabel] = useState("");

  const addField = (type: string) => {
      const newField = {
          id: Date.now().toString(),
          label: newFieldLabel || "Nouveau champ",
          type,
          parent: isArboMode && editorFields.length > 0 ? editorFields[editorFields.length - 1].id : undefined
      };
      setEditorFields([...editorFields, newField]);
      setNewFieldLabel("");
  };

  const handleUniverseSelect = (universe: string) => {
      setSelectedUniverse(universe);
      setSelectedTemplate(null);
      // Mock fields based on universe to show "What is in this RT"
      if (universe === 'plomberie') setRtFields(["Type de fuite", "Matériau", "Diamètre"]);
      else if (universe === 'serrurerie') setRtFields(["Type de serrure", "Dimensions Cylindre", "Marque"]);
      else if (universe === 'vitrerie') setRtFields(["Type de vitrage", "Clair de jour", "Épaisseur"]);
      else if (universe === 'electricite') setRtFields(["Type de panne", "Installation (Mono/Tri)"]);
      else setRtFields(["Prise de cotes libre", "Photos"]);
  };

  const handleTemplateClick = (type: 'new' | 'standard' | 'complex') => {
      setSelectedTemplate(type);
      if (type === 'new') {
          setTemplateName("");
          setIsArboMode(false);
          setEditorFields([]);
      } else if (type === 'standard') {
          setTemplateName("RT Standard");
          setIsArboMode(false);
          setEditorFields([
              { id: '1', label: 'Description', type: 'text', parent: undefined },
              { id: '2', label: 'Localisation', type: 'select', parent: undefined },
              { id: '3', label: 'Photos', type: 'photo', parent: undefined }
          ]);
      } else if (type === 'complex') {
          setTemplateName("Diagnostic Complet");
          setIsArboMode(true);
          setEditorFields([
              { id: '1', label: 'Zone', type: 'select', parent: undefined },
              { id: '2', label: 'Sous-Zone', type: 'select', parent: '1' },
              { id: '3', label: 'Détail', type: 'text', parent: '2' }
          ]);
      }
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
                                <div className="w-10 h-10 bg-white rounded-full p-1.5 border shadow-sm flex items-center justify-center">
                                    <img src={config.icon} alt={config.label} className="w-full h-full object-contain" />
                                </div>
                                <span className="font-medium text-sm flex-1">{config.label}</span>
                                {selectedUniverse === key && <div className="w-2 h-2 rounded-full bg-blue-500" />}
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
                            <CardTitle>2. Configuration des Relevés Techniques</CardTitle>
                            <CardDescription>
                                {selectedUniverse ? `Gérez les modèles de RT pour : ${TRADE_CONFIG[selectedUniverse]?.label}` : "Veuillez sélectionner un univers à gauche"}
                            </CardDescription>
                        </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {selectedUniverse ? (
                        selectedTemplate ? (
                            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                                <Button 
                                    variant="ghost" 
                                    onClick={() => setSelectedTemplate(null)} 
                                    className="mb-2 pl-0 hover:pl-2 transition-all text-muted-foreground hover:text-gray-900"
                                >
                                    <ArrowLeft className="h-4 w-4 mr-2" />
                                    Retour aux modèles
                                </Button>

                                <div className="bg-slate-50 p-6 rounded-xl border space-y-6 shadow-sm">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900">
                                                {selectedTemplate === 'new' ? 'Nouveau Modèle' : 'Édition du Modèle'}
                                            </h3>
                                            <p className="text-sm text-muted-foreground">Configuration des champs et de la structure</p>
                                        </div>
                                        <div className="flex items-center space-x-2 bg-white px-3 py-1.5 rounded-lg border">
                                            <Switch 
                                                id="arbo-mode" 
                                                checked={isArboMode}
                                                onCheckedChange={setIsArboMode}
                                            />
                                            <Label htmlFor="arbo-mode" className="cursor-pointer text-sm font-medium">Mode Arborescence</Label>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <Label>Nom du Relevé Technique</Label>
                                            <Input 
                                                placeholder="Ex: Dépannage Fuite" 
                                                value={templateName}
                                                onChange={(e) => setTemplateName(e.target.value)}
                                                className="bg-white"
                                            />
                                        </div>

                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between">
                                                <Label>Structure des données</Label>
                                                <div className="flex gap-2">
                                                    <Input 
                                                        placeholder="Libellé du champ..." 
                                                        value={newFieldLabel}
                                                        onChange={(e) => setNewFieldLabel(e.target.value)}
                                                        className="w-40 h-8 text-xs bg-white"
                                                    />
                                                    <Button size="sm" variant="outline" className="h-8 text-xs" onClick={() => addField('text')}>+ Texte</Button>
                                                    <Button size="sm" variant="outline" className="h-8 text-xs" onClick={() => addField('select')}>+ Choix</Button>
                                                    <Button size="sm" variant="outline" className="h-8 text-xs" onClick={() => addField('photo')}>+ Photo</Button>
                                                </div>
                                            </div>
                                            
                                            <div className="bg-white border rounded-lg p-4 text-sm min-h-[200px] space-y-2 shadow-inner">
                                                {editorFields.length === 0 ? (
                                                    <div className="text-muted-foreground text-center py-12 border-2 border-dashed rounded-lg">
                                                        <div className="flex flex-col items-center gap-2">
                                                            <Plus className="h-8 w-8 opacity-20" />
                                                            <p>Ajoutez des champs pour commencer</p>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    editorFields.map((field, idx) => (
                                                        <div key={field.id} className={`p-3 border rounded-lg bg-gray-50 flex items-center gap-3 transition-all hover:border-blue-200 hover:bg-blue-50/50 ${field.parent ? 'ml-8 border-l-4 border-l-purple-300' : ''}`}>
                                                            <div className="p-1.5 bg-white rounded border shadow-sm text-gray-500">
                                                                {field.type === 'text' && <Edit className="h-3.5 w-3.5" />}
                                                                {field.type === 'select' && <GitFork className="h-3.5 w-3.5 text-blue-500" />}
                                                                {field.type === 'photo' && <FileText className="h-3.5 w-3.5 text-purple-500" />}
                                                            </div>
                                                            <div className="flex-1">
                                                                <div className="font-medium text-gray-900">{field.label}</div>
                                                                <div className="text-xs text-muted-foreground">ID: {field.id}</div>
                                                            </div>
                                                            <Badge variant="secondary" className="text-[10px] uppercase tracking-wider">{field.type}</Badge>
                                                            {isArboMode && idx < editorFields.length - 1 && (
                                                                <div className="w-px h-4 bg-gray-300 mx-1" />
                                                            )}
                                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-red-600 hover:bg-red-50" onClick={() => {
                                                                setEditorFields(editorFields.filter(f => f.id !== field.id));
                                                            }}>
                                                                <Trash2 className="h-4 w-4" />
                                                            </Button>
                                                        </div>
                                                    ))
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex justify-end gap-3 pt-4 border-t">
                                        <Button variant="outline" onClick={() => setSelectedTemplate(null)}>Annuler</Button>
                                        <Button className="bg-blue-600 hover:bg-blue-700 shadow-sm" onClick={() => {
                                            toast({ title: "Modèle enregistré", description: `Le modèle "${templateName || 'Nouveau RT'}" a été sauvegardé.` });
                                            setSelectedTemplate(null);
                                        }}>
                                            <Save className="w-4 h-4 mr-2" />
                                            Enregistrer le modèle
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-6 animate-in fade-in duration-300">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* Existing Templates */}
                                    <div 
                                        className="p-5 border rounded-xl bg-white hover:border-blue-400 hover:shadow-md cursor-pointer transition-all group relative"
                                        onClick={() => handleTemplateClick('standard')}
                                    >
                                        <div className="flex justify-between items-start mb-3">
                                            <div className="p-2.5 bg-blue-50 text-blue-600 rounded-lg">
                                                <FileText className="h-6 w-6" />
                                            </div>
                                            <Badge variant="secondary" className="bg-blue-50 text-blue-700 hover:bg-blue-100">Standard</Badge>
                                        </div>
                                        <h3 className="font-semibold text-lg text-gray-900">RT Standard</h3>
                                        <p className="text-sm text-muted-foreground mt-1">Formulaire simple linéaire</p>
                                        <div className="mt-4 flex items-center gap-2 text-xs text-gray-500">
                                            <span className="px-2 py-1 bg-gray-100 rounded">3 champs</span>
                                            <span className="px-2 py-1 bg-gray-100 rounded">Dernière modif: 10/12/2024</span>
                                        </div>
                                    </div>

                                    <div 
                                        className="p-5 border rounded-xl bg-white hover:border-purple-400 hover:shadow-md cursor-pointer transition-all group relative"
                                        onClick={() => handleTemplateClick('complex')}
                                    >
                                        <div className="flex justify-between items-start mb-3">
                                            <div className="p-2.5 bg-purple-50 text-purple-600 rounded-lg">
                                                <GitFork className="h-6 w-6" />
                                            </div>
                                            <Badge variant="secondary" className="bg-purple-50 text-purple-700 hover:bg-purple-100">Complexe</Badge>
                                        </div>
                                        <h3 className="font-semibold text-lg text-gray-900">Diagnostic Complet</h3>
                                        <p className="text-sm text-muted-foreground mt-1">Mode Arborescence activé</p>
                                        <div className="mt-4 flex items-center gap-2 text-xs text-gray-500">
                                            <span className="px-2 py-1 bg-gray-100 rounded">5 niveaux</span>
                                            <span className="px-2 py-1 bg-gray-100 rounded">Dernière modif: 08/12/2024</span>
                                        </div>
                                    </div>

                                    {/* Add New Button */}
                                    <div 
                                        className="border-2 border-dashed border-gray-200 rounded-xl p-4 flex flex-col items-center justify-center gap-3 cursor-pointer hover:border-blue-400 hover:bg-blue-50/50 transition-all text-muted-foreground hover:text-blue-600 h-full min-h-[160px]"
                                        onClick={() => handleTemplateClick('new')}
                                    >
                                        <div className="p-3 bg-gray-50 rounded-full group-hover:bg-white transition-colors">
                                            <Plus className="h-8 w-8" />
                                        </div>
                                        <span className="font-medium">Créer un nouveau modèle</span>
                                    </div>
                                </div>
                            </div>
                        )
                    ) : (
                        <div className="h-64 flex flex-col items-center justify-center text-muted-foreground bg-muted/10 rounded-lg border-2 border-dashed">
                            <Briefcase className="h-12 w-12 mb-4 opacity-20" />
                            <p>Sélectionnez un univers métier dans la colonne de gauche</p>
                            <p>pour configurer ses modèles de RT.</p>
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