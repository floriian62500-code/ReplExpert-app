import { Bell } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Technician } from "@/lib/mockData";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface HeaderProps {
  technician: Technician;
}

export function Header({ technician }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 w-full bg-background/80 backdrop-blur-md border-b border-border pt-safe">
      <div className="flex items-center justify-between px-4 h-16">
        <div className="flex items-center space-x-3">
          <Avatar className="h-10 w-10 border-2 border-primary/10">
            <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${technician.firstName}`} alt={technician.firstName} />
            <AvatarFallback>{technician.firstName[0]}{technician.lastName[0]}</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-xs text-muted-foreground font-medium">Bonjour,</p>
            <h1 className="text-base font-bold text-foreground leading-tight">{technician.firstName}</h1>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="icon" className="relative text-muted-foreground">
            <Bell className="h-5 w-5" />
            <span className="absolute top-2 right-2 h-2 w-2 bg-secondary rounded-full border border-background" />
          </Button>
          
          <DropdownMenu>
             <DropdownMenuTrigger asChild>
                <Button 
                  variant={technician.status === "active" ? "default" : "outline"} 
                  size="sm"
                  className={technician.status === "active" ? "bg-green-600 hover:bg-green-700 text-white" : "border-dashed"}
                >
                  {technician.status === "active" ? "En service" : "Déconnecté"}
                </Button>
             </DropdownMenuTrigger>
             <DropdownMenuContent align="end">
                <DropdownMenuLabel>Pointeuse</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>▶️ Démarrer ma journée</DropdownMenuItem>
                <DropdownMenuItem>⏸️ Pause déjeuner</DropdownMenuItem>
                <DropdownMenuItem className="text-destructive">⏹️ Fin de journée</DropdownMenuItem>
             </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
