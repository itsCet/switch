import { CalendarEvent } from "./types";

export const KIND_LABEL: Record<CalendarEvent["kind"], string> = {
  match: "Match",
  shooting: "Shooting",
  partenaire: "Partenaire",
  publication: "Publication",
  reunion: "Reunion",
  evenement: "Evenement",
};

export const KIND_OPTIONS = Object.keys(KIND_LABEL) as CalendarEvent["kind"][];
