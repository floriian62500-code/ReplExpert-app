import { LucideIcon } from "lucide-react";
import { 
  Wrench, 
  Droplet, 
  Maximize2, 
  Hammer, 
  Zap, 
  PaintBucket, 
  Thermometer, 
  Blinds, 
  Key, 
  BrickWall 
} from "lucide-react";

export type InterventionStatus = "todo" | "in_progress" | "done";

export interface Intervention {
  id: string;
  clientName: string;
  clientType: "particulier" | "pro" | "bailleur";
  address: string;
  city: string;
  timeSlot: string;
  date: string;
  types: string[]; // e.g., ["plomberie", "vitrerie"]
  status: InterventionStatus;
  description: string;
  reportStatus?: "pending" | "submitted"; // New field for report status
}

export interface Technician {
  id: string;
  firstName: string;
  lastName: string;
  monthlyRevenue: number;
  monthlyGoal: number;
  status: "active" | "break" | "off_work";
}

export interface HRData {
  weeklyHours: number;
  overtime: number;
  documentsToSign: number;
  pendingLeaveRequests: number;
}

export const MOCK_TECHNICIAN: Technician = {
  id: "tech-001",
  firstName: "Thomas",
  lastName: "Dubois",
  monthlyRevenue: 8500,
  monthlyGoal: 12000,
  status: "off_work"
};

export const MOCK_HR: HRData = {
  weeklyHours: 32,
  overtime: 2.5,
  documentsToSign: 2,
  pendingLeaveRequests: 1
};

export const MOCK_INTERVENTIONS: Intervention[] = [
  {
    id: "int-101",
    clientName: "Mme. Martin",
    clientType: "particulier",
    address: "12 Rue des Lilas",
    city: "Lyon 3ème",
    timeSlot: "09:00 - 10:30",
    date: new Date().toISOString().split('T')[0], // Today
    types: ["plomberie"],
    status: "todo",
    description: "Fuite sous évier cuisine + remplacement joint.",
    reportStatus: "pending"
  },
  {
    id: "int-102",
    clientName: "Agence Immobilière Durant",
    clientType: "pro",
    address: "45 Avenue Jean Jaurès",
    city: "Villeurbanne",
    timeSlot: "11:00 - 12:30",
    date: new Date().toISOString().split('T')[0], // Today
    types: ["serrurerie", "menuiserie"],
    status: "todo",
    description: "Porte bloquée locataire + réglage fenêtre salon.",
    reportStatus: "pending"
  },
  {
    id: "int-103",
    clientName: "M. Bernard",
    clientType: "particulier",
    address: "8 Impasse du Soleil",
    city: "Bron",
    timeSlot: "14:00 - 16:00",
    date: new Date().toISOString().split('T')[0], // Today
    types: ["vitrerie"],
    status: "todo",
    description: "Remplacement double vitrage cassé suite effraction.",
    reportStatus: "pending"
  },
  {
    id: "int-104",
    clientName: "Syndic Le Parc",
    clientType: "bailleur",
    address: "102 Cours Lafayette",
    city: "Lyon 6ème",
    timeSlot: "09:00 - 11:00",
    date: new Date(Date.now() + 86400000).toISOString().split('T')[0], // Tomorrow
    types: ["electricite"],
    status: "todo",
    description: "Panne éclairage parties communes hall B.",
    reportStatus: "pending"
  },
  // History items
  {
    id: "int-098",
    clientName: "M. Dupuis",
    clientType: "particulier",
    address: "5 Rue de la République",
    city: "Lyon 2ème",
    timeSlot: "10:00 - 11:30",
    date: new Date(Date.now() - 86400000).toISOString().split('T')[0], // Yesterday
    types: ["plomberie"],
    status: "done",
    description: "Remplacement robinet cuisine.",
    reportStatus: "pending" // Needs finalizing
  },
  {
    id: "int-097",
    clientName: "Boulangerie Paul",
    clientType: "pro",
    address: "15 Rue Victor Hugo",
    city: "Lyon 2ème",
    timeSlot: "14:00 - 15:30",
    date: new Date(Date.now() - 172800000).toISOString().split('T')[0], // 2 days ago
    types: ["electricite"],
    status: "done",
    description: "Installation nouvelles prises fournil.",
    reportStatus: "submitted"
  },
  {
    id: "int-096",
    clientName: "Mme. Lefebvre",
    clientType: "particulier",
    address: "33 Cours Vitton",
    city: "Lyon 6ème",
    timeSlot: "09:00 - 10:00",
    date: new Date(Date.now() - 259200000).toISOString().split('T')[0], // 3 days ago
    types: ["serrurerie"],
    status: "done",
    description: "Ouverture de porte claquée.",
    reportStatus: "submitted"
  }
];

export const TRADE_ICONS: Record<string, LucideIcon> = {
  plomberie: Droplet,
  vitrerie: Maximize2,
  menuiserie: Hammer,
  electricite: Zap,
  platrerie: BrickWall,
  peinture: PaintBucket,
  isolation: Thermometer,
  "volet roulant": Blinds,
  serrurerie: Key,
  chauffage: Thermometer // Using thermometer for heating too
};

export const TRADE_LABELS: Record<string, string> = {
  plomberie: "Plomberie",
  vitrerie: "Vitrerie",
  menuiserie: "Menuiserie",
  electricite: "Électricité",
  platrerie: "Plâtrerie",
  peinture: "Peinture",
  isolation: "Isolation",
  "volet roulant": "Volet Roulant",
  serrurerie: "Serrurerie",
  chauffage: "Chauffage"
};

export const TODOS = [
  { id: 1, text: "Valider heures du 08/12", urgent: false },
  { id: 2, text: "Signer avenant contrat", urgent: true },
];
