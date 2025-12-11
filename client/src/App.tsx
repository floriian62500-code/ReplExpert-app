import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Portal from "@/pages/Portal";
import Dashboard from "@/pages/Dashboard";
import Planning from "@/pages/Planning";
import InterventionDetails from "@/pages/InterventionDetails";
import Profile from "@/pages/Profile";
import History from "@/pages/History";
import HRModule from "@/pages/HRModule";
import AdminDashboard from "@/pages/admin/AdminDashboard";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Portal} />
      <Route path="/technician" component={Dashboard} />
      <Route path="/admin" component={AdminDashboard} />
      <Route path="/planning" component={Planning} />
      <Route path="/interventions" component={Planning} />
      <Route path="/intervention/:id" component={InterventionDetails} />
      <Route path="/profile" component={Profile} />
      <Route path="/history" component={History} />
      <Route path="/hr" component={HRModule} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
