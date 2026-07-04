export type SpaceId = "gtp" | "fourteen";

export type SplitDay = "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday" | "sunday";

export interface SpaceTheme {
  id: SpaceId;
  name: string;
  tagline: string;
  tone: string;
  gradient: string;
  accent: string;
  accentSoft: string;
  softIsDark: boolean;
  ring: string;
  chip: string;
  fontClass: string;
}

export interface DraftPost {
  id: string;
  space: SpaceId;
  title: string;
  status: "brouillon" | "a-valider" | "pret";
  updatedAt: string;
  excerpt: string;
}

export interface Deadline {
  id: string;
  space: SpaceId;
  title: string;
  date: string;
  kind: "match" | "shooting" | "partenaire" | "publication" | "reunion";
}

export interface CalendarEvent {
  id: string;
  space: SpaceId;
  title: string;
  date: string;
  kind: "match" | "shooting" | "partenaire" | "publication" | "reunion";
  time?: string;
}

export interface ChecklistItem {
  id: string;
  space: SpaceId;
  label: string;
  checked: boolean;
}

export interface JournalEntry {
  space: SpaceId;
  whereImAt: string;
  waitingOn: string;
  updatedAt: string;
}

export interface SplitScheduleEntry {
  day: SplitDay;
  spaces: SpaceId[];
  label: string;
}
