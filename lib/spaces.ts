import { SplitScheduleEntry } from "./types";

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
