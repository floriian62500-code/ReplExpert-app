import { Layout } from "@/components/layout/Layout";
import { Header } from "@/components/layout/Header";
import { MOCK_TECHNICIAN } from "@/lib/mockData";
import { Button } from "@/components/ui/button";
import { LogOut, Settings, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function Profile() {
  return (
    <Layout>
      <Header technician={MOCK_TECHNICIAN} />
      <div className="p-4 space-y-6">
        <div className="flex flex-col items-center py-8">
           <Avatar className="h-24 w-24 border-4 border-background shadow-xl">
             <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${MOCK_TECHNICIAN.firstName}`} />
             <AvatarFallback>TD</AvatarFallback>
           </Avatar>
           <h2 className="mt-4 text-xl font-bold">{MOCK_TECHNICIAN.firstName} {MOCK_TECHNICIAN.lastName}</h2>
           <p className="text-muted-foreground">Technicien Senior</p>
        </div>

        <div className="space-y-2">
            <Button variant="outline" className="w-full justify-start h-12" size="lg">
                <User className="mr-3 h-5 w-5" />
                Informations personnelles
            </Button>
            <Button variant="outline" className="w-full justify-start h-12" size="lg">
                <Settings className="mr-3 h-5 w-5" />
                Paramètres
            </Button>
            <Button variant="destructive" className="w-full justify-start h-12 mt-8" size="lg">
                <LogOut className="mr-3 h-5 w-5" />
                Déconnexion
            </Button>
        </div>
      </div>
    </Layout>
  );
}
