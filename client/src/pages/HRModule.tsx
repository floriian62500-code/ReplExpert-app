import { Layout } from "@/components/layout/Layout";
import { Header } from "@/components/layout/Header";
import { MOCK_TECHNICIAN, MOCK_HR } from "@/lib/mockData";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, FileText, CalendarDays, ArrowLeft, Download, Eye } from "lucide-react";
import { Link } from "wouter";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";

export default function HRModule() {
  return (
    <Layout>
      <Header technician={MOCK_TECHNICIAN} />
      
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur border-b border-border pt-safe">
        <div className="flex items-center px-4 h-14 space-x-2">
            <Link href="/">
                <Button variant="ghost" size="icon" className="-ml-2">
                    <ArrowLeft className="h-6 w-6" />
                </Button>
            </Link>
            <h1 className="font-semibold text-lg">Espace RH</h1>
        </div>
      </div>

      <div className="px-4 py-6 space-y-6">
        
        {/* Weekly Summary */}
        <section className="grid grid-cols-2 gap-4">
            <Card className="shadow-sm">
                <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                    <Clock className="h-8 w-8 text-primary mb-2" />
                    <div className="text-2xl font-bold">{MOCK_HR.weeklyHours}h</div>
                    <div className="text-xs text-muted-foreground">Cette semaine</div>
                </CardContent>
            </Card>
            <Card className="shadow-sm">
                <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                    <div className="h-8 w-8 flex items-center justify-center bg-orange-100 text-orange-600 rounded-full mb-2 text-sm font-bold">
                        +{MOCK_HR.overtime}
                    </div>
                    <div className="text-2xl font-bold text-orange-600">{MOCK_HR.overtime}h</div>
                    <div className="text-xs text-muted-foreground">Heures Supp.</div>
                </CardContent>
            </Card>
        </section>

        <Tabs defaultValue="pointeuse" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="pointeuse">Pointeuse</TabsTrigger>
                <TabsTrigger value="documents">Documents</TabsTrigger>
            </TabsList>

            <TabsContent value="pointeuse" className="space-y-4 pt-4">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">Pointage du jour</CardTitle>
                        <CardDescription>Mardi 10 Décembre</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-muted-foreground">Début de journée</span>
                            <span className="font-mono font-medium">08:00</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-muted-foreground">Pause déjeuner</span>
                            <span className="font-mono font-medium">12:30 - 13:30</span>
                        </div>
                         <div className="flex justify-between items-center text-sm">
                            <span className="text-muted-foreground">Fin de journée</span>
                            <span className="font-mono font-medium text-muted-foreground">--:--</span>
                        </div>
                        <div className="mt-4 pt-4 border-t">
                             <div className="flex justify-between text-sm font-medium mb-2">
                                <span>Total estimé</span>
                                <span>7h30 / 8h00</span>
                             </div>
                             <Progress value={90} className="h-2" />
                        </div>
                    </CardContent>
                </Card>

                <div className="flex justify-end">
                    <Button variant="outline" className="text-sm">
                        Voir l'historique des heures
                    </Button>
                </div>
            </TabsContent>

            <TabsContent value="documents" className="space-y-4 pt-4">
                {MOCK_HR.documentsToSign > 0 && (
                     <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 flex items-start gap-3">
                        <FileText className="h-5 w-5 text-orange-600 mt-0.5 shrink-0" />
                        <div>
                            <h3 className="font-medium text-orange-900 text-sm">Documents à signer ({MOCK_HR.documentsToSign})</h3>
                            <p className="text-xs text-orange-700 mt-1">Merci de régulariser ces documents rapidement.</p>
                        </div>
                     </div>
                )}

                <div className="space-y-3">
                    <Card className="overflow-hidden">
                        <div className="flex items-center justify-between p-4 bg-muted/20">
                             <div className="flex items-center gap-3">
                                <FileText className="h-5 w-5 text-muted-foreground" />
                                <div>
                                    <p className="font-medium text-sm">Avenant Contrat 2024</p>
                                    <p className="text-xs text-red-500 font-medium">À signer</p>
                                </div>
                             </div>
                             <Button size="sm">Signer</Button>
                        </div>
                    </Card>
                    <Card className="overflow-hidden">
                         <div className="flex items-center justify-between p-4">
                             <div className="flex items-center gap-3">
                                <FileText className="h-5 w-5 text-muted-foreground" />
                                <div>
                                    <p className="font-medium text-sm">Bulletin de paie - Nov 2024</p>
                                    <p className="text-xs text-muted-foreground">Disponible depuis le 01/12</p>
                                </div>
                             </div>
                             <div className="flex gap-2">
                                <Button size="icon" variant="ghost" className="h-8 w-8"><Eye className="h-4 w-4" /></Button>
                                <Button size="icon" variant="ghost" className="h-8 w-8"><Download className="h-4 w-4" /></Button>
                             </div>
                        </div>
                    </Card>
                    <Card className="overflow-hidden">
                         <div className="flex items-center justify-between p-4">
                             <div className="flex items-center gap-3">
                                <FileText className="h-5 w-5 text-muted-foreground" />
                                <div>
                                    <p className="font-medium text-sm">Attestation Mutuelle</p>
                                    <p className="text-xs text-muted-foreground">Validé le 15/10</p>
                                </div>
                             </div>
                             <div className="flex gap-2">
                                <Button size="icon" variant="ghost" className="h-8 w-8"><Eye className="h-4 w-4" /></Button>
                                <Button size="icon" variant="ghost" className="h-8 w-8"><Download className="h-4 w-4" /></Button>
                             </div>
                        </div>
                    </Card>
                </div>
            </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
