import { SpaceTheme, SplitScheduleEntry } from "./types";

export const SPACES: Record<string, SpaceTheme> = {
  gtp: {
    id: "gtp",
    name: "GTP",
    tagline: "Grand Tournoi Pro",
    tone: "Institutionnel & sportif",
    gradient: "from-[#0b2545] to-[#134074]",
    accent: "#f2b705",
    accentSoft: "#fdf0cc",
    ring: "#0b2545",
    chip: "#134074",
    fontClass: "font-[600]",
  },
  fourteen: {
    id: "fourteen",
    name: "Fourteen",
    tagline: "Passion Is Always Right",
    tone: "Mode & attitude",
    gradient: "from-[#1a1a1a] to-[#3d0e2b]",
    accent: "#ff2e63",
    accentSoft: "#2a0a18",
    ring: "#ff2e63",
    chip: "#3d0e2b",
    fontClass: "font-[700] tracking-tight",
  },
};

export const SPLIT_SCHEDULE: SplitScheduleEntry[] = [
  { day: "monday", spaces: ["gtp"], label: "Journee GTP" },
  { day: "tuesday", spaces: ["gtp"], label: "Journee GTP" },
  { day: "wednesday", spaces: ["gtp", "fourteen"], label: "Journee mixte" },
  { day: "thursday", spaces: ["fourteen"], label: "Journee Fourteen" },
  { day: "friday", spaces: ["fourteen"], label: "Journee Fourteen" },
  { day: "saturday", spaces: [], label: "Weekend" },
  { day: "sunday", spaces: [], label: "Weekend" },
];

export const DAY_ORDER: SplitScheduleEntry["day"][] = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];

export const DAY_LABEL_FR: Record<string, string> = {
  monday: "Lundi",
  tuesday: "Mardi",
  wednesday: "Mercredi",
  thursday: "Jeudi",
  friday: "Vendredi",
  saturday: "Samedi",
  sunday: "Dimanche",
};
