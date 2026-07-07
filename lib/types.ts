export type SpaceId = string;

export type SplitDay = "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday" | "sunday";

export interface SpaceTheme {
  id: SpaceId;
  name: string;
  tagline: string;
  tone: string;
  gradientFrom: string;
  gradientTo: string;
  accent: string;
  accentSoft: string;
  softIsDark: boolean;
  chip: string;
}

export interface CalendarEvent {
  id: string;
  space: SpaceId;
  title: string;
  date: string;
  endDate?: string;
  kind: "match" | "shooting" | "partenaire" | "publication" | "reunion" | "evenement";
  time?: string;
  note?: string;
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
}
