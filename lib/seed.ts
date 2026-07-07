import { CalendarEvent, ChecklistItem, JournalEntry, SpaceTheme } from "./types";

export const SEED_SPACES: SpaceTheme[] = [
  {
    id: "gtp",
    name: "GTP",
    tagline: "Geneva Trophy Promotion",
    tone: "Institutionnel & sportif",
    gradientFrom: "#0b2545",
    gradientTo: "#134074",
    accent: "#f2b705",
    accentSoft: "#fdf0cc",
    softIsDark: false,
    chip: "#134074",
  },
  {
    id: "fourteen",
    name: "Fourteen",
    tagline: "Passion Is Always Right",
    tone: "Mode & attitude",
    gradientFrom: "#1a1a1a",
    gradientTo: "#3d0e2b",
    accent: "#ff2e63",
    accentSoft: "#2a0a18",
    softIsDark: true,
    chip: "#3d0e2b",
  },
];

export const SEED_CALENDAR: CalendarEvent[] = [
  { id: "c1", space: "gtp", title: "Match GTP vs Lyon", date: "2026-07-06", kind: "match", time: "18:00" },
  { id: "c2", space: "gtp", title: "Publication recap match", date: "2026-07-06", kind: "publication", time: "21:00" },
  { id: "c3", space: "fourteen", title: "Shooting capsule ete", date: "2026-07-06", kind: "shooting", time: "10:00" },
  { id: "c4", space: "fourteen", title: "Reunion planning FIBA content", date: "2026-07-08", kind: "reunion", time: "14:00" },
  { id: "c5", space: "gtp", title: "Coverage joueur - interview", date: "2026-07-09", kind: "match", time: "11:00" },
  { id: "c6", space: "fourteen", title: "Livraison shooting capsule ete", date: "2026-07-09", kind: "shooting", time: "17:00" },
  { id: "c7", space: "gtp", title: "Contenu partenaire - teasing", date: "2026-07-11", kind: "partenaire", time: "09:00" },
];

export const SEED_CHECKLIST: ChecklistItem[] = [
  { id: "cl1", space: "gtp", label: "Hashtag officiel du tournoi ajoute", checked: true },
  { id: "cl2", space: "gtp", label: "Mention du sponsor titre visible", checked: false },
  { id: "cl3", space: "gtp", label: "Visuel valide par la com externe si partenaire", checked: false },
  { id: "cl4", space: "gtp", label: "Ton institutionnel / sportif respecte", checked: true },
  { id: "cl5", space: "fourteen", label: "Mention du studio / photographe", checked: true },
  { id: "cl6", space: "fourteen", label: "Hashtag officiel de la capsule ajoute", checked: false },
  { id: "cl7", space: "fourteen", label: "Ton 'Passion Is Always Right' respecte", checked: true },
  { id: "cl8", space: "fourteen", label: "Credits FIBA / Swiss Basketball si repost", checked: false },
];

export const SEED_JOURNAL: JournalEntry[] = [
  {
    space: "gtp",
    whereImAt: "Carrousel stats pret a etre valide, en attente retour visuel partenaire.",
    waitingOn: "Swiss Basketball (com externe) - validation visuel",
    updatedAt: "2026-07-04T18:25:00",
  },
  {
    space: "fourteen",
    whereImAt: "Tri des photos du shooting, montage teaser video en cours.",
    waitingOn: "Studio Noir & Or - fichiers HD",
    updatedAt: "2026-07-04T21:10:00",
  },
];
