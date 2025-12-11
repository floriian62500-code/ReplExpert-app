import { useState } from "react";
import { Link, useLocation } from "wouter";
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  Settings, 
  LogOut, 
  Plus, 
  Search, 
  Bell,
  TrendingUp,
  Briefcase,
  Target,
  Edit,
  Save,
  Trash2,
  Check
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
import { MOCK_INTERVENTIONS, CRM_TYPE_LABELS, CRM_TYPE_COLORS, MOCK_TECHNICIANS, TRADE_CONFIG, Technician } from "@/lib/mockData";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";

export default function AdminDashboard() {
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState("dashboard");
  const { toast } = useToast();

  // Technician Management State
  const [technicians, setTechnicians] = useState<Technician[]>(MOCK_TECHNICIANS);
  const [editingTech, setEditingTech] = useState<Technician | null>(null);
  const [isEditingTech, setIsEditingTech] = useState(false);
  const [newTech, setNewTech] = useState<Partial<Technician>>({
      firstName: "",
      lastName: "",
      monthlyGoal: 10000,
      status: "active"
  });
  const [isAddingTech, setIsAddingTech] = useState(false);
  
  // Intervention Management State
  const [isCreatingIntervention, setIsCreatingIntervention] = useState(false);
  const [newIntervention, setNewIntervention] = useState({
      clientName: "",
      address: "",
      city: "",
      type: "plomberie",
      description: ""
  });

  // Calculate simple stats
  const totalInterventions = MOCK_INTERVENTIONS.length;
  const completedInterventions = MOCK_INTERVENTIONS.filter(i => i.status === "done").length;
  const revenue = completedInterventions * 150; // Mock average revenue
  
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
          monthlyRevenue: 0,
          status: "active"
      };
      setTechnicians([...technicians, techToAdd]);
      setIsAddingTech(false);
      setNewTech({ firstName: "", lastName: "", monthlyGoal: 10000, status: "active" });
      toast({ title: "Technicien créé", description: "Le nouveau technicien a été ajouté à l'équipe." });
  };

  const handleCreateIntervention = () => {
      setIsCreatingIntervention(false);
      toast({ title: "Intervention créée", description: "L'intervention a été assignée." });
      // In a real app, we would add to MOCK_INTERVENTIONS
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
            variant={activeTab === "dashboard" ? "secondary" : "ghost"} 
            className="w-full justify-start" 
            onClick={() => setActiveTab("dashboard")}
          >
            <LayoutDashboard className="mr-3 h-5 w-5" />
            Tableau de bord
          </Button>
          <Button 
            variant={activeTab === "interventions" ? "secondary" : "ghost"} 
            className="w-full justify-start"
            onClick={() => setActiveTab("interventions")}
          >
            <Calendar className="mr-3 h-5 w-5" />
            Interventions
          </Button>
          <Button 
            variant={activeTab === "technicians" ? "secondary" : "ghost"} 
            className="w-full justify-start"
            onClick={() => setActiveTab("technicians")}
          >
            <Users className="mr-3 h-5 w-5" />
            Techniciens
          </Button>
          <Button 
            variant={activeTab === "settings" ? "secondary" : "ghost"} 
            className="w-full justify-start"
            onClick={() => setActiveTab("settings")}
          >
            <Settings className="mr-3 h-5 w-5" />
            Paramètres
          </Button>
        </nav>

        <div className="p-4 border-t">
          <Button 
            variant="ghost" 
            className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
            onClick={() => setLocation("/")}
          >
            <LogOut className="mr-3 h-5 w-5" />
            Retour App Mobile
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 p-8">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-800">
              {activeTab === 'dashboard' && 'Vue d\'ensemble'}
              {activeTab === 'interventions' && 'Gestion des Interventions'}
              {activeTab === 'technicians' && 'Équipe Technique'}
              {activeTab === 'settings' && 'Paramètres'}
            </h2>
            <p className="text-muted-foreground">Bienvenue sur votre espace administrateur.</p>
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

        {activeTab === "dashboard" && (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Interventions du jour</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalInterventions}</div>
                  <p className="text-xs text-muted-foreground">+2 depuis hier</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Chiffre d'affaires (Est.)</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{revenue} €</div>
                  <p className="text-xs text-muted-foreground">+12% par rapport à la semaine dernière</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Techniciens Actifs</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{technicians.length}</div>
                  <p className="text-xs text-muted-foreground">Sur {technicians.length} au total</p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Interventions Table */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Interventions Récentes</CardTitle>
                  <CardDescription>Suivi en temps réel de l'activité terrain.</CardDescription>
                </div>
                <Button onClick={() => setActiveTab("interventions")}>
                   Voir tout
                </Button>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Client</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead>Technicien</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {MOCK_INTERVENTIONS.slice(0, 5).map((intervention) => (
                      <TableRow key={intervention.id}>
                        <TableCell className="font-medium">{intervention.id}</TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="font-medium">{intervention.clientName}</span>
                            <span className="text-xs text-muted-foreground">{intervention.city}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={CRM_TYPE_COLORS[intervention.crmType]}>
                            {CRM_TYPE_LABELS[intervention.crmType]}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={intervention.status === 'done' ? 'default' : intervention.status === 'in_progress' ? 'secondary' : 'outline'}>
                            {intervention.status === 'todo' ? 'À faire' : intervention.status === 'in_progress' ? 'En cours' : 'Terminé'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Avatar className="h-6 w-6">
                              <AvatarFallback className="text-[10px]">TD</AvatarFallback>
                            </Avatar>
                            <span className="text-sm">Thomas D.</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm" asChild>
                            <Link href={`/intervention/${intervention.id}`}>Voir</Link>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === "technicians" && (
            <div className="space-y-6">
                 <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle>Gestion des Techniciens</CardTitle>
                      <CardDescription>Gérez votre équipe, fixez les objectifs et validez les compétences.</CardDescription>
                    </div>
                    <Dialog open={isAddingTech} onOpenChange={setIsAddingTech}>
                        <DialogTrigger asChild>
                            <Button>
                                <Plus className="mr-2 h-4 w-4" /> Nouveau Technicien
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Ajouter un technicien</DialogTitle>
                                <DialogDescription>Créez un nouveau profil utilisateur.</DialogDescription>
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
                                    <Label htmlFor="goal" className="text-right">Obj. Mensuel (€)</Label>
                                    <Input id="goal" type="number" value={newTech.monthlyGoal} onChange={e => setNewTech({...newTech, monthlyGoal: parseInt(e.target.value)})} className="col-span-3" />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button onClick={handleAddTech}>Créer l'utilisateur</Button>
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
                          <TableHead>Objectif</TableHead>
                          <TableHead>Réalisé</TableHead>
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
                            <TableCell className={tech.monthlyRevenue >= tech.monthlyGoal ? "text-green-600 font-bold" : "text-orange-600"}>
                                {tech.monthlyRevenue} €
                            </TableCell>
                            <TableCell>
                                <div className="flex flex-wrap gap-1">
                                    <Badge variant="outline" className="text-xs">Plomberie</Badge>
                                    <Badge variant="outline" className="text-xs">Serrurerie</Badge>
                                    {/* Mock static skills for prototype */}
                                </div>
                            </TableCell>
                            <TableCell className="text-right">
                                <Button variant="ghost" size="icon" onClick={() => {
                                    setEditingTech(tech);
                                    setIsEditingTech(true);
                                }}>
                                    <Edit className="h-4 w-4" />
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
                    <DialogContent className="sm:max-w-[500px]">
                        <DialogHeader>
                            <DialogTitle>Modifier Technicien</DialogTitle>
                            <DialogDescription>Gérez les objectifs et les compétences.</DialogDescription>
                        </DialogHeader>
                        {editingTech && (
                            <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label className="text-right">Nom</Label>
                                    <Input value={`${editingTech.firstName} ${editingTech.lastName}`} disabled className="col-span-3 bg-muted" />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="edit-goal" className="text-right">Objectif (€)</Label>
                                    <Input 
                                        id="edit-goal" 
                                        type="number" 
                                        value={editingTech.monthlyGoal} 
                                        onChange={(e) => setEditingTech({...editingTech, monthlyGoal: parseInt(e.target.value)})}
                                        className="col-span-3" 
                                    />
                                </div>
                                <div className="grid grid-cols-4 items-start gap-4">
                                    <Label className="text-right pt-2">Univers</Label>
                                    <div className="col-span-3 space-y-2 border p-3 rounded-md">
                                        <div className="flex items-center space-x-2">
                                            <Checkbox id="skill1" defaultChecked />
                                            <Label htmlFor="skill1">Plomberie</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Checkbox id="skill2" defaultChecked />
                                            <Label htmlFor="skill2">Serrurerie</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Checkbox id="skill3" />
                                            <Label htmlFor="skill3">Vitrerie</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Checkbox id="skill4" />
                                            <Label htmlFor="skill4">Électricité</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Checkbox id="skill5" />
                                            <Label htmlFor="skill5">Menuiserie</Label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsEditingTech(false)}>Annuler</Button>
                            <Button onClick={handleSaveTech}>Enregistrer</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        )}

        {activeTab === "interventions" && (
            <div className="space-y-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle>Toutes les Interventions</CardTitle>
                      <CardDescription>Gérez le planning et les relevés techniques.</CardDescription>
                    </div>
                    <Dialog open={isCreatingIntervention} onOpenChange={setIsCreatingIntervention}>
                        <DialogTrigger asChild>
                            <Button>
                                <Plus className="mr-2 h-4 w-4" /> Créer Intervention / RT
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Nouvelle Intervention</DialogTitle>
                                <DialogDescription>Créez une intervention ou un relevé technique.</DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="space-y-2">
                                    <Label>Client</Label>
                                    <Input placeholder="Nom du client" />
                                </div>
                                <div className="space-y-2">
                                    <Label>Adresse</Label>
                                    <Input placeholder="Adresse complète" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Type</Label>
                                        <Select>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Choisir..." />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="travaux">Dépannage / Travaux</SelectItem>
                                                <SelectItem value="rdf">Relevé Technique (RT)</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Métier principal</Label>
                                        <Select>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Choisir..." />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {Object.entries(TRADE_CONFIG).map(([key, config]) => (
                                                    <SelectItem key={key} value={key}>{config.label}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label>Description</Label>
                                    <Input placeholder="Détails de la demande..." />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button onClick={handleCreateIntervention}>Assigner</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>ID</TableHead>
                          <TableHead>Client</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Statut</TableHead>
                          <TableHead>Rapport</TableHead>
                          <TableHead>Technicien</TableHead>
                          <TableHead className="text-right">Action</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {MOCK_INTERVENTIONS.map((intervention) => (
                          <TableRow key={intervention.id}>
                            <TableCell className="font-medium">{intervention.id}</TableCell>
                            <TableCell>
                              <div className="flex flex-col">
                                <span className="font-medium">{intervention.clientName}</span>
                                <span className="text-xs text-muted-foreground">{intervention.city}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline" className={CRM_TYPE_COLORS[intervention.crmType]}>
                                {CRM_TYPE_LABELS[intervention.crmType]}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge variant={intervention.status === 'done' ? 'default' : intervention.status === 'in_progress' ? 'secondary' : 'outline'}>
                                {intervention.status === 'todo' ? 'À faire' : intervention.status === 'in_progress' ? 'En cours' : 'Terminé'}
                              </Badge>
                            </TableCell>
                            <TableCell>
                                {intervention.reportStatus === 'submitted' && (
                                    <Badge variant="secondary" className="bg-green-100 text-green-700 hover:bg-green-100 border-green-200">
                                        <Check className="mr-1 h-3 w-3" /> Reçu
                                    </Badge>
                                )}
                                {intervention.reportStatus === 'pending' && intervention.status === 'done' && (
                                    <Badge variant="destructive" className="bg-red-100 text-red-700 hover:bg-red-100 border-red-200">
                                        Manquant
                                    </Badge>
                                )}
                                {intervention.reportStatus === 'pending' && intervention.status !== 'done' && (
                                    <span className="text-muted-foreground text-xs">-</span>
                                )}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Avatar className="h-6 w-6">
                                  <AvatarFallback className="text-[10px]">TD</AvatarFallback>
                                </Avatar>
                                <span className="text-sm">Thomas D.</span>
                              </div>
                            </TableCell>
                            <TableCell className="text-right">
                              <Button variant="ghost" size="sm" asChild>
                                <Link href={`/intervention/${intervention.id}`}>Détails</Link>
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
            </div>
        )}

        {activeTab === "settings" && (
          <div className="flex items-center justify-center h-64 border-2 border-dashed rounded-lg">
            <div className="text-center text-muted-foreground">
              <p>Paramètres globaux en cours de construction</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}