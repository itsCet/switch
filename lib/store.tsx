"use client";

import { createContext, useContext, useEffect, useMemo, useState, ReactNode } from "react";
import {
  CalendarEvent,
  ChecklistItem,
  DraftPost,
  Deadline,
  JournalEntry,
  SpaceId,
} from "./types";
import {
  SEED_CALENDAR,
  SEED_CHECKLIST,
  SEED_DEADLINES,
  SEED_DRAFTS,
  SEED_JOURNAL,
} from "./seed";

interface SwitchState {
  activeSpace: SpaceId;
  drafts: DraftPost[];
  deadlines: Deadline[];
  calendar: CalendarEvent[];
  checklist: ChecklistItem[];
  journal: JournalEntry[];
}

interface SwitchStore extends SwitchState {
  setActiveSpace: (space: SpaceId) => void;
  updateJournal: (space: SpaceId, patch: Partial<Omit<JournalEntry, "space">>) => void;
  toggleChecklistItem: (id: string) => void;
}

const STORAGE_KEY = "switch-app-state-v2";

const DEFAULT_STATE: SwitchState = {
  activeSpace: "gtp",
  drafts: SEED_DRAFTS,
  deadlines: SEED_DEADLINES,
  calendar: SEED_CALENDAR,
  checklist: SEED_CHECKLIST,
  journal: SEED_JOURNAL,
};

const SwitchContext = createContext<SwitchStore | null>(null);

export function SwitchProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<SwitchState>(DEFAULT_STATE);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        setState({ ...DEFAULT_STATE, ...JSON.parse(raw) });
      }
    } catch {
      // ignore corrupted local storage
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state, hydrated]);

  const value = useMemo<SwitchStore>(
    () => ({
      ...state,
      setActiveSpace: (space) => setState((s) => ({ ...s, activeSpace: space })),
      updateJournal: (space, patch) =>
        setState((s) => ({
          ...s,
          journal: s.journal.map((entry) =>
            entry.space === space
              ? { ...entry, ...patch, updatedAt: new Date().toISOString() }
              : entry
          ),
        })),
      toggleChecklistItem: (id) =>
        setState((s) => ({
          ...s,
          checklist: s.checklist.map((item) =>
            item.id === id ? { ...item, checked: !item.checked } : item
          ),
        })),
    }),
    [state]
  );

  return <SwitchContext.Provider value={value}>{children}</SwitchContext.Provider>;
}

export function useSwitchStore() {
  const ctx = useContext(SwitchContext);
  if (!ctx) throw new Error("useSwitchStore must be used within SwitchProvider");
  return ctx;
}
