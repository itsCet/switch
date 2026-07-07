"use client";

import { createContext, useContext, useEffect, useMemo, useRef, useState, ReactNode } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "./supabaseClient";
import { deriveThemeFromAccent } from "./color";
import {
  CalendarEvent,
  ChecklistItem,
  JournalEntry,
  SpaceId,
  SpaceTheme,
  SplitDay,
  SplitScheduleEntry,
} from "./types";
import { SEED_CALENDAR, SEED_CHECKLIST, SEED_JOURNAL, SEED_SPACES, SEED_SPLIT_SCHEDULE } from "./seed";
import { AuthScreen } from "@/components/AuthScreen";

interface SwitchState {
  activeSpace: SpaceId;
  spaces: SpaceTheme[];
  splitSchedule: SplitScheduleEntry[];
  calendar: CalendarEvent[];
  checklist: ChecklistItem[];
  journal: JournalEntry[];
}

interface SpaceInput {
  name: string;
  tagline: string;
  tone: string;
  accent: string;
}

interface SwitchStore extends SwitchState {
  session: Session;
  space: SpaceTheme;
  signOut: () => void;
  setActiveSpace: (space: SpaceId) => void;
  updateJournal: (space: SpaceId, patch: Partial<Omit<JournalEntry, "space">>) => void;
  toggleChecklistItem: (id: string) => void;
  addChecklistItem: (space: SpaceId, label: string) => void;
  deleteChecklistItem: (id: string) => void;
  addEvent: (event: Omit<CalendarEvent, "id">) => void;
  updateEvent: (id: string, patch: Omit<CalendarEvent, "id">) => void;
  deleteEvent: (id: string) => void;
  addSpace: (input: SpaceInput) => void;
  updateSpace: (id: string, input: SpaceInput) => void;
  deleteSpace: (id: string) => void;
  toggleSplitDay: (day: SplitDay, spaceId: SpaceId) => void;
}

const DEFAULT_STATE: SwitchState = {
  activeSpace: "gtp",
  spaces: SEED_SPACES,
  splitSchedule: SEED_SPLIT_SCHEDULE,
  calendar: SEED_CALENDAR,
  checklist: SEED_CHECKLIST,
  journal: SEED_JOURNAL,
};

const SwitchContext = createContext<SwitchStore | null>(null);

export function SwitchProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [state, setState] = useState<SwitchState | null>(null);
  const skipNextPersist = useRef(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setAuthLoading(false);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      if (!newSession) setState(null);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!session) return;
    let cancelled = false;

    supabase
      .from("app_state")
      .select("data")
      .eq("user_id", session.user.id)
      .maybeSingle()
      .then(async ({ data, error }) => {
        if (cancelled) return;
        if (error) {
          console.error("Failed to load app state", error);
          return;
        }
        if (data) {
          skipNextPersist.current = true;
          setState({ ...DEFAULT_STATE, ...(data.data as Partial<SwitchState>) });
        } else {
          skipNextPersist.current = true;
          setState(DEFAULT_STATE);
          await supabase.from("app_state").insert({ user_id: session.user.id, data: DEFAULT_STATE });
        }
      });

    return () => {
      cancelled = true;
    };
  }, [session]);

  useEffect(() => {
    if (!session || !state) return;
    if (skipNextPersist.current) {
      skipNextPersist.current = false;
      return;
    }
    supabase
      .from("app_state")
      .upsert({ user_id: session.user.id, data: state, updated_at: new Date().toISOString() })
      .then(({ error }) => {
        if (error) console.error("Failed to save app state", error);
      });
  }, [state, session]);

  const value = useMemo<SwitchStore | null>(() => {
    if (!session || !state) return null;
    const activeTheme = state.spaces.find((sp) => sp.id === state.activeSpace) ?? state.spaces[0];
    return {
      ...state,
      space: activeTheme,
      session,
      signOut: () => supabase.auth.signOut(),
      setActiveSpace: (space) => setState((s) => (s ? { ...s, activeSpace: space } : s)),
      updateJournal: (space, patch) =>
        setState((s) => {
          if (!s) return s;
          const exists = s.journal.some((entry) => entry.space === space);
          const updatedAt = new Date().toISOString();
          return {
            ...s,
            journal: exists
              ? s.journal.map((entry) =>
                  entry.space === space ? { ...entry, ...patch, updatedAt } : entry
                )
              : [
                  ...s.journal,
                  { space, whereImAt: "", waitingOn: "", ...patch, updatedAt },
                ],
          };
        }),
      toggleChecklistItem: (id) =>
        setState((s) =>
          s
            ? {
                ...s,
                checklist: s.checklist.map((item) =>
                  item.id === id ? { ...item, checked: !item.checked } : item
                ),
              }
            : s
        ),
      addChecklistItem: (space, label) =>
        setState((s) =>
          s
            ? { ...s, checklist: [...s.checklist, { id: crypto.randomUUID(), space, label, checked: false }] }
            : s
        ),
      deleteChecklistItem: (id) =>
        setState((s) => (s ? { ...s, checklist: s.checklist.filter((item) => item.id !== id) } : s)),
      addEvent: (event) =>
        setState((s) => (s ? { ...s, calendar: [...s.calendar, { ...event, id: crypto.randomUUID() }] } : s)),
      updateEvent: (id, patch) =>
        setState((s) =>
          s
            ? { ...s, calendar: s.calendar.map((ev) => (ev.id === id ? { ...ev, ...patch, id } : ev)) }
            : s
        ),
      deleteEvent: (id) =>
        setState((s) => (s ? { ...s, calendar: s.calendar.filter((ev) => ev.id !== id) } : s)),
      addSpace: (input) =>
        setState((s) => {
          if (!s) return s;
          const derived = deriveThemeFromAccent(input.accent);
          const newSpace: SpaceTheme = { id: crypto.randomUUID(), ...input, ...derived };
          return { ...s, spaces: [...s.spaces, newSpace] };
        }),
      updateSpace: (id, input) =>
        setState((s) => {
          if (!s) return s;
          return {
            ...s,
            spaces: s.spaces.map((sp) => {
              if (sp.id !== id) return sp;
              const accentChanged = input.accent !== sp.accent;
              const derived = accentChanged ? deriveThemeFromAccent(input.accent) : {};
              return { ...sp, ...input, ...derived };
            }),
          };
        }),
      deleteSpace: (id) =>
        setState((s) => {
          if (!s || s.spaces.length <= 1) return s;
          const spaces = s.spaces.filter((sp) => sp.id !== id);
          const activeSpace = s.activeSpace === id ? spaces[0].id : s.activeSpace;
          const splitSchedule = s.splitSchedule.map((entry) => ({
            ...entry,
            spaces: entry.spaces.filter((sid) => sid !== id),
          }));
          return { ...s, spaces, activeSpace, splitSchedule };
        }),
      toggleSplitDay: (day, spaceId) =>
        setState((s) =>
          s
            ? {
                ...s,
                splitSchedule: s.splitSchedule.map((entry) =>
                  entry.day === day
                    ? {
                        ...entry,
                        spaces: entry.spaces.includes(spaceId)
                          ? entry.spaces.filter((id) => id !== spaceId)
                          : [...entry.spaces, spaceId],
                      }
                    : entry
                ),
              }
            : s
        ),
    };
  }, [state, session]);

  if (authLoading) {
    return <div className="min-h-screen flex items-center justify-center text-neutral-400 text-sm">Chargement...</div>;
  }

  if (!session) {
    return <AuthScreen />;
  }

  if (!value) {
    return <div className="min-h-screen flex items-center justify-center text-neutral-400 text-sm">Chargement...</div>;
  }

  return <SwitchContext.Provider value={value}>{children}</SwitchContext.Provider>;
}

export function useSwitchStore() {
  const ctx = useContext(SwitchContext);
  if (!ctx) throw new Error("useSwitchStore must be used within SwitchProvider");
  return ctx;
}
