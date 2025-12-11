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
  Briefcase
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
import { MOCK_INTERVENTIONS, CRM_TYPE_LABELS, CRM_TYPE_COLORS } from "@/lib/mockData";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function AdminDashboard() {
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState("dashboard");

  // Calculate simple stats
  const totalInterventions = MOCK_INTERVENTIONS.length;
  const completedInterventions = MOCK_INTERVENTIONS.filter(i => i.status === "done").length;
  const revenue = completedInterventions * 150; // Mock average revenue
  
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
                  <div className="text-2xl font-bold">4</div>
                  <p className="text-xs text-muted-foreground">Sur 6 au total</p>
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
                <Button>
                  <Plus className="mr-2 h-4 w-4" /> Nouvelle Intervention
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

        {activeTab !== "dashboard" && (
          <div className="flex items-center justify-center h-64 border-2 border-dashed rounded-lg">
            <div className="text-center text-muted-foreground">
              <p>Module {activeTab} en cours de construction</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}