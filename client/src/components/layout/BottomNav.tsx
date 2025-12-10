import { Link, useLocation } from "wouter";
import { Home, Calendar, Briefcase, User } from "lucide-react";
import { cn } from "@/lib/utils";

export function BottomNav() {
  const [location] = useLocation();

  const navItems = [
    { icon: Home, label: "Accueil", path: "/" },
    { icon: Calendar, label: "Planning", path: "/planning" },
    { icon: Briefcase, label: "Interventions", path: "/interventions" },
    { icon: User, label: "Compte", path: "/profile" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background border-t border-border pb-safe z-50">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => {
          const isActive = location === item.path || (item.path !== "/" && location.startsWith(item.path));
          return (
            <Link key={item.path} href={item.path}>
              <a className={cn(
                "flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors duration-200",
                isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
              )}>
                <item.icon className={cn("h-6 w-6", isActive && "fill-current/20")} strokeWidth={isActive ? 2.5 : 2} />
                <span className="text-[10px] font-medium">{item.label}</span>
              </a>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
