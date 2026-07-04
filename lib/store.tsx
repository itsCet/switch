"use client";

import { createContext, useContext, useEffect, useMemo, useState, ReactNode } from "react";
import {
  CalendarEvent,
  DraftPost,
  Deadline,
  JournalEntry,
  Partner,
  SpaceId,
  Template,
} from "./types";
import {
  SEED_CALENDAR,
  SEED_DEADLINES,
  SEED_DRAFTS,
  SEED_JOURNAL,
  SEED_PARTNERS,
  SEED_TEMPLATES,
} from "./seed";

interface SwitchState {
  activeSpace: SpaceId;
  drafts: DraftPost[];
  deadlines: Deadline[];
  partners: Partner[];
  calendar: CalendarEvent[];
  templates: Template[];
  journal: JournalEntry[];
}

interface SwitchStore extends SwitchState {
  setActiveSpace: (space: SpaceId) => void;
  updateJournal: (space: SpaceId, patch: Partial<Omit<JournalEntry, "space">>) => void;
  useTemplate: (id: string) => void;
}

const STORAGE_KEY = "switch-app-state-v1";

const DEFAULT_STATE: SwitchState = {
  activeSpace: "gtp",
  drafts: SEED_DRAFTS,
  deadlines: SEED_DEADLINES,
  partners: SEED_PARTNERS,
  calendar: SEED_CALENDAR,
  templates: SEED_TEMPLATES,
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
      useTemplate: (id) =>
        setState((s) => ({
          ...s,
          templates: s.templates.map((t) =>
            t.id === id
              ? {
                  ...t,
                  usageCount: t.usageCount + 1,
                  lastUsed: new Date().toISOString().slice(0, 10),
                }
              : t
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
