"use client";

import { useMemo, useState } from "react";
import { useSwitchStore } from "@/lib/store";
import { SPACES } from "@/lib/spaces";
import { formatDateFr } from "@/lib/utils";
import { SpaceId } from "@/lib/types";

type Mode = "fusion" | "filtre";

const KIND_LABEL: Record<string, string> = {
  match: "Match",
  shooting: "Shooting",
  partenaire: "Partenaire",
  publication: "Publication",
  reunion: "Reunion",
};

export function CalendarView() {
  const { activeSpace, calendar } = useSwitchStore();
  const [mode, setMode] = useState<Mode>("fusion");

  const grouped = useMemo(() => {
    const source = mode === "filtre" ? calendar.filter((e) => e.space === activeSpace) : calendar;
    const byDate = new Map<string, typeof calendar>();
    for (const ev of source) {
      const list = byDate.get(ev.date) ?? [];
      list.push(ev);
      byDate.set(ev.date, list);
    }
    return [...byDate.entries()].sort((a, b) => a[0].localeCompare(b[0]));
  }, [calendar, mode, activeSpace]);

  return (
    <div className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h2 className="font-semibold text-neutral-800">Calendrier</h2>
        <div className="inline-flex rounded-full bg-neutral-100 p-1 text-sm">
          <button
            onClick={() => setMode("fusion")}
            className={`px-3 py-1.5 rounded-full transition ${
              mode === "fusion" ? "bg-neutral-900 text-white" : "text-neutral-600"
            }`}
          >
            Vue fusionnee
          </button>
          <button
            onClick={() => setMode("filtre")}
            className={`px-3 py-1.5 rounded-full transition ${
              mode === "filtre" ? "bg-neutral-900 text-white" : "text-neutral-600"
            }`}
          >
            {SPACES[activeSpace].name} uniquement
          </button>
        </div>
      </div>

      <div className="mt-4 space-y-3">
        {grouped.map(([date, events]) => {
          const spacesPresent = new Set(events.map((e) => e.space));
          const isConflict = mode === "fusion" && spacesPresent.size > 1;
          return (
            <div
              key={date}
              className={`rounded-xl border p-3 ${
                isConflict ? "border-amber-300 bg-amber-50" : "border-black/5 bg-neutral-50"
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                <p className="text-xs font-semibold text-neutral-500 uppercase">{formatDateFr(date)}</p>
                {isConflict && (
                  <span className="text-[11px] font-semibold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
                    ⚠ conflit potentiel entre les deux espaces
                  </span>
                )}
              </div>
              <div className="grid gap-2 sm:grid-cols-2">
                {events.map((ev) => (
                  <div
                    key={ev.id}
                    className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-white"
                    style={{ backgroundColor: SPACES[ev.space as SpaceId].chip }}
                  >
                    <span className="font-mono text-xs opacity-70">{ev.time ?? "--:--"}</span>
                    <span className="flex-1">{ev.title}</span>
                    <span
                      className="text-[10px] uppercase tracking-wide rounded-full px-2 py-0.5"
                      style={{ backgroundColor: SPACES[ev.space as SpaceId].accent, color: "#111" }}
                    >
                      {KIND_LABEL[ev.kind]}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
        {grouped.length === 0 && (
          <p className="text-sm text-neutral-400 text-center py-6">Aucun evenement pour le moment.</p>
        )}
      </div>
    </div>
  );
}
