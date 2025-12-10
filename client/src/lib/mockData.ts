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

// Imports des pictogrammes
import pictoMenuiserie from "@assets/PICTO_MENUISERIE_1765373201530.png";
import pictoPlomberie from "@assets/PICTO_PLOMBERIE_1765373201531.png";
import pictoPMR from "@assets/PICTO_PMR_1765373201531.png";
import pictoRenovation from "@assets/PICTO_RENOVATION_1765373201531.png";
import pictoVR from "@assets/PICTO_VR_1765373201531.png";
import pictoSerrurerie from "@assets/PICTO_SERRURERIE_1765373201532.png";
import pictoVitrerie from "@assets/PICTO_VITRERIE_1765373201532.png";
import pictoElec from "@assets/PICTO_ELEC_1765373201533.png";

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
  reportStatus?: "pending" | "submitted";
  crmType: "a_definir" | "travaux" | "rdf";
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

export const CRM_TYPE_LABELS: Record<string, string> = {
  a_definir: "À définir",
  travaux: "Travaux",
  rdf: "RDF"
};

export const CRM_TYPE_COLORS: Record<string, string> = {
  a_definir: "bg-gray-100 text-gray-700 border-gray-200",
  travaux: "bg-blue-50 text-blue-700 border-blue-200",
  rdf: "bg-purple-50 text-purple-700 border-purple-200"
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
    reportStatus: "pending",
    crmType: "travaux"
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
    reportStatus: "pending",
    crmType: "a_definir"
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
    reportStatus: "pending",
    crmType: "travaux"
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
    reportStatus: "pending",
    crmType: "rdf"
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
    reportStatus: "pending", // Needs finalizing
    crmType: "travaux"
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
    reportStatus: "submitted",
    crmType: "travaux"
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
    reportStatus: "submitted",
    crmType: "rdf"
  }
];

export interface TradeConfig {
  label: string;
  icon: string; // URL/Path to image
  color: string; // Tailwind color class for text/border
  bgColor: string; // Tailwind color class for background
}

export const TRADE_CONFIG: Record<string, TradeConfig> = {
  plomberie: {
    label: "Plomberie",
    icon: pictoPlomberie,
    color: "text-cyan-600",
    bgColor: "bg-cyan-100"
  },
  vitrerie: {
    label: "Vitrerie",
    icon: pictoVitrerie,
    color: "text-green-600",
    bgColor: "bg-green-100"
  },
  menuiserie: {
    label: "Menuiserie",
    icon: pictoMenuiserie,
    color: "text-orange-600",
    bgColor: "bg-orange-100"
  },
  electricite: {
    label: "Électricité",
    icon: pictoElec,
    color: "text-amber-500",
    bgColor: "bg-amber-100"
  },
  platrerie: {
    label: "Plâtrerie",
    icon: pictoRenovation,
    color: "text-stone-600",
    bgColor: "bg-stone-100"
  },
  peinture: {
    label: "Peinture",
    icon: pictoRenovation,
    color: "text-stone-600",
    bgColor: "bg-stone-100"
  },
  isolation: {
    label: "Isolation",
    icon: pictoPMR, // Using PMR/Adaptation picto as fallback or if appropriate
    color: "text-blue-600",
    bgColor: "bg-blue-100"
  },
  "volet roulant": {
    label: "Volet Roulant",
    icon: pictoVR,
    color: "text-purple-600",
    bgColor: "bg-purple-100"
  },
  serrurerie: {
    label: "Serrurerie",
    icon: pictoSerrurerie,
    color: "text-pink-600",
    bgColor: "bg-pink-100"
  },
  chauffage: {
    label: "Chauffage",
    icon: pictoPlomberie, // Fallback
    color: "text-cyan-600",
    bgColor: "bg-cyan-100"
  }
};

export const TODOS = [
  { id: 1, text: "Valider heures du 08/12", urgent: false },
  { id: 2, text: "Signer avenant contrat", urgent: true },
];
