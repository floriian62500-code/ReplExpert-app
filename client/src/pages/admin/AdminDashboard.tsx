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
  Save,
  Image as ImageIcon,
  CheckSquare,
  Settings,
  AlertCircle
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
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

// Enhanced Logic Types
type LogicRule = {
    triggerValue: string;
    action: 'show_field' | 'require_photo' | 'show_message';
    targetId?: string; // For show_field
    message?: string; // For show_message
};

type FieldOption = {
    id: string;
    label: string;
    value: string;
};

type EditorField = {
    id: string;
    label: string;
    type: 'text' | 'select' | 'photo' | 'checkbox' | 'info';
    parent?: string;
    options?: FieldOption[];
    logic?: LogicRule[];
    required?: boolean;
    placeholder?: string;
};

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
  
  // Enhanced Editor State
  const [editorFields, setEditorFields] = useState<EditorField[]>([
      { id: '1', label: 'Type de panne', type: 'select', options: [
          { id: 'opt1', label: 'Fuite', value: 'fuite' },
          { id: 'opt2', label: 'Bouchon', value: 'bouchon' },
          { id: 'opt3', label: 'Autre', value: 'autre' }
      ]},
      { id: '2', label: 'Localisation', type: 'text', placeholder: 'Ex: Cuisine, SDB...' }
  ]);
  
  const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null);
  const [newFieldLabel, setNewFieldLabel] = useState("");

  const addField = (type: EditorField['type']) => {
      const newField: EditorField = {
          id: Date.now().toString(),
          label: newFieldLabel || "Nouveau champ",
          type,
          parent: isArboMode && editorFields.length > 0 ? editorFields[editorFields.length - 1].id : undefined,
          options: type === 'select' ? [{ id: 'opt1', label: 'Option 1', value: 'opt1' }] : undefined,
          required: false
      };
      setEditorFields([...editorFields, newField]);
      setNewFieldLabel("");
      setSelectedFieldId(newField.id); // Auto-select new field
  };

  const updateField = (id: string, updates: Partial<EditorField>) => {
      setEditorFields(fields => fields.map(f => f.id === id ? { ...f, ...updates } : f));
  };

  const addOptionToField = (fieldId: string) => {
      const field = editorFields.find(f => f.id === fieldId);
      if (field && field.options) {
          const newOptId = `opt${field.options.length + 1}`;
          updateField(fieldId, {
              options: [...field.options, { id: newOptId, label: `Option ${field.options.length + 1}`, value: newOptId }]
          });
      }
  };

  const addLogicToField = (fieldId: string, rule: LogicRule) => {
       const field = editorFields.find(f => f.id === fieldId);
       if (field) {
           const currentLogic = field.logic || [];
           updateField(fieldId, { logic: [...currentLogic, rule] });
       }
  };

  const handleUniverseSelect = (universe: string) => {
      setSelectedUniverse(universe);
      setSelectedTemplate(null);
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
              { id: '1', label: 'Description', type: 'text', required: true },
              { id: '2', label: 'Localisation', type: 'select', options: [
                  { id: 'l1', label: 'Intérieur', value: 'interieur' },
                  { id: 'l2', label: 'Extérieur', value: 'exterieur' }
              ]},
              { id: '3', label: 'Photos', type: 'photo', required: true }
          ]);
      } else if (type === 'complex') {
          setTemplateName("Diagnostic Complet");
          setIsArboMode(true);
          setEditorFields([
              { id: '1', label: 'Zone', type: 'select', options: [{id:'z1', label:'Zone A', value:'A'}, {id:'z2', label:'Zone B', value:'B'}] },
              { id: '2', label: 'Sous-Zone', type: 'select', parent: '1', options: [] },
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

  const handleDeleteTech = (techId: string) => {
      setTechnicians(technicians.filter(t => t.id !== techId));
      toast({ title: "Technicien supprimé", description: "Le technicien a été retiré de la liste." });
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
                                <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    className="text-red-500 hover:text-red-600"
                                    onClick={() => {
                                        if (confirm("Êtes-vous sûr de vouloir supprimer ce technicien ?")) {
                                            handleDeleteTech(tech.id);
                                        }
                                    }}
                                >
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
                                        <div className="flex items-center justify-between">
                                            <Label className="text-base font-semibold">Structure du formulaire</Label>
                                            <div className="flex gap-2">
                                                <Button size="sm" variant="outline" className="h-9 gap-2" onClick={() => addField('text')}>
                                                    <FileText className="h-4 w-4 text-gray-500" /> + Texte
                                                </Button>
                                                <Button size="sm" variant="outline" className="h-9 gap-2" onClick={() => addField('select')}>
                                                    <CheckSquare className="h-4 w-4 text-blue-500" /> + Choix
                                                </Button>
                                                <Button size="sm" variant="outline" className="h-9 gap-2" onClick={() => addField('photo')}>
                                                    <ImageIcon className="h-4 w-4 text-purple-500" /> + Photo
                                                </Button>
                                            </div>
                                        </div>
                                        
                                        <div className="bg-white border rounded-lg p-4 min-h-[400px] space-y-4 shadow-inner relative">
                                            {editorFields.length === 0 ? (
                                                <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground bg-gray-50/50">
                                                    <div className="p-4 bg-white rounded-full shadow-sm mb-4">
                                                        <Plus className="h-8 w-8 opacity-20" />
                                                    </div>
                                                    <p className="font-medium">Commencez par ajouter des champs</p>
                                                    <p className="text-sm opacity-70">Utilisez les boutons ci-dessus</p>
                                                </div>
                                            ) : (
                                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
                                                    {/* Builder Canvas */}
                                                    <div className="lg:col-span-2 space-y-3">
                                                        {editorFields.map((field, idx) => (
                                                            <div 
                                                                key={field.id} 
                                                                onClick={() => setSelectedFieldId(field.id)}
                                                                className={`
                                                                    group relative p-4 rounded-xl border-2 transition-all cursor-pointer hover:shadow-md
                                                                    ${selectedFieldId === field.id ? 'border-blue-500 bg-blue-50/30' : 'border-gray-100 bg-white hover:border-blue-200'}
                                                                    ${field.parent ? 'ml-8' : ''}
                                                                `}
                                                            >
                                                                {/* Connection Line for hierarchy */}
                                                                {field.parent && (
                                                                    <div className="absolute -left-6 top-1/2 w-6 h-0.5 bg-gray-300 rounded-l" />
                                                                )}

                                                                <div className="flex items-start gap-4">
                                                                    <div className={`
                                                                        p-2.5 rounded-lg shrink-0
                                                                        ${field.type === 'text' && 'bg-gray-100 text-gray-600'}
                                                                        ${field.type === 'select' && 'bg-blue-100 text-blue-600'}
                                                                        ${field.type === 'photo' && 'bg-purple-100 text-purple-600'}
                                                                    `}>
                                                                        {field.type === 'text' && <FileText className="h-5 w-5" />}
                                                                        {field.type === 'select' && <CheckSquare className="h-5 w-5" />}
                                                                        {field.type === 'photo' && <ImageIcon className="h-5 w-5" />}
                                                                    </div>
                                                                    
                                                                    <div className="flex-1 min-w-0">
                                                                        <div className="flex items-center justify-between mb-1">
                                                                            <span className="font-semibold text-gray-900 truncate pr-2">
                                                                                {field.label}
                                                                            </span>
                                                                            <Badge variant="outline" className="text-[10px] uppercase font-bold tracking-wider opacity-60">
                                                                                {field.type}
                                                                            </Badge>
                                                                        </div>
                                                                        
                                                                        {/* Preview of content */}
                                                                        {field.type === 'select' && (
                                                                            <div className="flex flex-wrap gap-1 mt-2">
                                                                                {field.options?.map(opt => (
                                                                                    <span key={opt.id} className="text-xs bg-white border px-2 py-0.5 rounded-full text-gray-600">
                                                                                        {opt.label}
                                                                                    </span>
                                                                                ))}
                                                                                {(!field.options || field.options.length === 0) && (
                                                                                    <span className="text-xs text-red-400 italic flex items-center gap-1">
                                                                                        <AlertCircle className="h-3 w-3" /> Aucune option définie
                                                                                    </span>
                                                                                )}
                                                                            </div>
                                                                        )}
                                                                        
                                                                        {field.logic && field.logic.length > 0 && (
                                                                            <div className="mt-2 flex items-center gap-1 text-xs text-amber-600 font-medium bg-amber-50 px-2 py-1 rounded w-fit">
                                                                                <GitFork className="h-3 w-3" />
                                                                                {field.logic.length} règle(s) active(s)
                                                                            </div>
                                                                        )}
                                                                    </div>

                                                                    <Button 
                                                                        variant="ghost" 
                                                                        size="icon" 
                                                                        className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-red-600 -mr-2"
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            setEditorFields(editorFields.filter(f => f.id !== field.id));
                                                                            if (selectedFieldId === field.id) setSelectedFieldId(null);
                                                                        }}
                                                                    >
                                                                        <Trash2 className="h-4 w-4" />
                                                                    </Button>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>

                                                    {/* Properties Panel */}
                                                    <div className="border-l pl-6 space-y-6">
                                                        {selectedFieldId ? (
                                                            (() => {
                                                                const field = editorFields.find(f => f.id === selectedFieldId);
                                                                if (!field) return null;
                                                                return (
                                                                    <div className="space-y-6 animate-in slide-in-from-right-2 duration-200">
                                                                        <div>
                                                                            <h4 className="font-semibold text-gray-900 mb-1">Propriétés du champ</h4>
                                                                            <p className="text-xs text-muted-foreground">ID: {field.id}</p>
                                                                        </div>

                                                                        <div className="space-y-3">
                                                                            <div className="space-y-1">
                                                                                <Label className="text-xs">Libellé (Question)</Label>
                                                                                <Input 
                                                                                    value={field.label} 
                                                                                    onChange={(e) => updateField(field.id, { label: e.target.value })}
                                                                                    className="h-8"
                                                                                />
                                                                            </div>

                                                                            <div className="flex items-center space-x-2 py-2">
                                                                                <Switch 
                                                                                    id="req-field" 
                                                                                    checked={field.required}
                                                                                    onCheckedChange={(c) => updateField(field.id, { required: c })}
                                                                                />
                                                                                <Label htmlFor="req-field" className="text-sm font-normal">Champ obligatoire</Label>
                                                                            </div>
                                                                        </div>

                                                                        <Separator />

                                                                        {field.type === 'select' && (
                                                                            <div className="space-y-3">
                                                                                <div className="flex items-center justify-between">
                                                                                    <Label className="text-xs font-semibold text-blue-600">Options de réponse</Label>
                                                                                    <Button size="sm" variant="ghost" className="h-6 text-xs" onClick={() => addOptionToField(field.id)}>
                                                                                        <Plus className="h-3 w-3 mr-1" /> Ajouter
                                                                                    </Button>
                                                                                </div>
                                                                                <ScrollArea className="h-[120px] pr-2">
                                                                                    <div className="space-y-2">
                                                                                        {field.options?.map((opt, idx) => (
                                                                                            <div key={opt.id} className="flex gap-2">
                                                                                                <Input 
                                                                                                    value={opt.label}
                                                                                                    onChange={(e) => {
                                                                                                        const newOpts = [...(field.options || [])];
                                                                                                        newOpts[idx] = { ...opt, label: e.target.value };
                                                                                                        updateField(field.id, { options: newOpts });
                                                                                                    }}
                                                                                                    className="h-7 text-xs"
                                                                                                    placeholder={`Option ${idx + 1}`}
                                                                                                />
                                                                                            </div>
                                                                                        ))}
                                                                                    </div>
                                                                                </ScrollArea>
                                                                            </div>
                                                                        )}

                                                                        {/* Logic Builder Section */}
                                                                        {field.type === 'select' && (
                                                                           <div className="space-y-3 pt-2">
                                                                               <div className="flex items-center gap-2">
                                                                                   <GitFork className="h-3 w-3 text-amber-600" />
                                                                                   <Label className="text-xs font-semibold text-amber-600">Règles conditionnelles</Label>
                                                                               </div>
                                                                               
                                                                               <div className="bg-amber-50 rounded-lg p-3 space-y-3 border border-amber-100">
                                                                                   <p className="text-[10px] text-amber-800">
                                                                                       Si la réponse est...
                                                                                   </p>
                                                                                   <Select onValueChange={(val) => addLogicToField(field.id, {
                                                                                       triggerValue: val,
                                                                                       action: 'require_photo'
                                                                                   })}>
                                                                                       <SelectTrigger className="h-7 text-xs bg-white">
                                                                                           <SelectValue placeholder="Choisir une réponse..." />
                                                                                       </SelectTrigger>
                                                                                       <SelectContent>
                                                                                           {field.options?.map(opt => (
                                                                                               <SelectItem key={opt.id} value={opt.value}>{opt.label}</SelectItem>
                                                                                           ))}
                                                                                       </SelectContent>
                                                                                   </Select>
                                                                                   
                                                                                   <p className="text-[10px] text-amber-800">
                                                                                       Alors...
                                                                                   </p>
                                                                                   <div className="flex gap-2 text-xs font-medium text-amber-900 items-center">
                                                                                        <ArrowLeft className="h-3 w-3" />
                                                                                        Exiger une photo
                                                                                   </div>
                                                                               </div>
                                                                           </div> 
                                                                        )}
                                                                    </div>
                                                                );
                                                            })()
                                                        ) : (
                                                            <div className="h-full flex flex-col items-center justify-center text-center text-muted-foreground space-y-2 opacity-50">
                                                                <Settings className="h-8 w-8" />
                                                                <p className="text-sm">Sélectionnez un champ pour le configurer</p>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            )}
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