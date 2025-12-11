import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Smartphone, MonitorPlay, Briefcase, Wrench } from "lucide-react";

export default function Portal() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center p-3 bg-white rounded-2xl shadow-sm mb-4">
            <Briefcase className="h-8 w-8 text-blue-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">HELPCONFORT</h1>
          <p className="text-lg text-gray-600">Portail d'accès unifié</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Technician App Card */}
          <Link href="/technician">
            <Card className="h-full hover:shadow-xl transition-all cursor-pointer group border-2 hover:border-blue-400">
              <CardHeader className="text-center pb-2">
                <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Smartphone className="h-8 w-8 text-blue-600" />
                </div>
                <CardTitle className="text-2xl">Application Technicien</CardTitle>
                <CardDescription>Pour mobile & tablette</CardDescription>
              </CardHeader>
              <CardContent className="text-center space-y-4">
                <p className="text-muted-foreground">
                  Accédez à votre planning, gérez vos interventions et réalisez vos rapports depuis le terrain.
                </p>
                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  Accéder à l'espace Mobile
                </Button>
              </CardContent>
            </Card>
          </Link>

          {/* Admin Dashboard Card */}
          <Link href="/admin">
            <Card className="h-full hover:shadow-xl transition-all cursor-pointer group border-2 hover:border-indigo-400">
              <CardHeader className="text-center pb-2">
                <div className="mx-auto w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <MonitorPlay className="h-8 w-8 text-indigo-600" />
                </div>
                <CardTitle className="text-2xl">Back-Office Admin</CardTitle>
                <CardDescription>Pour ordinateur de bureau</CardDescription>
              </CardHeader>
              <CardContent className="text-center space-y-4">
                <p className="text-muted-foreground">
                  Gérez les équipes, créez les interventions, validez les rapports et suivez l'activité globale.
                </p>
                <Button variant="secondary" className="w-full border-indigo-200 bg-indigo-50 text-indigo-700 hover:bg-indigo-100">
                  Accéder à l'espace Admin
                </Button>
              </CardContent>
            </Card>
          </Link>
        </div>

        <div className="mt-12 text-center text-sm text-gray-500">
          <p>Version Prototype 1.0 • Environnement de démonstration</p>
        </div>
      </div>
    </div>
  );
}