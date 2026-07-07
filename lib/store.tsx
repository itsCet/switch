"use client";

import { createContext, useContext, useEffect, useMemo, useRef, useState, ReactNode } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "./supabaseClient";
import { CalendarEvent, ChecklistItem, JournalEntry, SpaceId } from "./types";
import { SEED_CALENDAR, SEED_CHECKLIST, SEED_JOURNAL } from "./seed";
import { AuthScreen } from "@/components/AuthScreen";

interface SwitchState {
  activeSpace: SpaceId;
  calendar: CalendarEvent[];
  checklist: ChecklistItem[];
  journal: JournalEntry[];
}

interface SwitchStore extends SwitchState {
  session: Session;
  signOut: () => void;
  setActiveSpace: (space: SpaceId) => void;
  updateJournal: (space: SpaceId, patch: Partial<Omit<JournalEntry, "space">>) => void;
  toggleChecklistItem: (id: string) => void;
  addChecklistItem: (space: SpaceId, label: string) => void;
  deleteChecklistItem: (id: string) => void;
  addEvent: (event: Omit<CalendarEvent, "id">) => void;
  updateEvent: (id: string, patch: Omit<CalendarEvent, "id">) => void;
  deleteEvent: (id: string) => void;
}

const DEFAULT_STATE: SwitchState = {
  activeSpace: "gtp",
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
          setState(data.data as SwitchState);
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
    return {
      ...state,
      session,
      signOut: () => supabase.auth.signOut(),
      setActiveSpace: (space) => setState((s) => (s ? { ...s, activeSpace: space } : s)),
      updateJournal: (space, patch) =>
        setState((s) =>
          s
            ? {
                ...s,
                journal: s.journal.map((entry) =>
                  entry.space === space
                    ? { ...entry, ...patch, updatedAt: new Date().toISOString() }
                    : entry
                ),
              }
            : s
        ),
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
