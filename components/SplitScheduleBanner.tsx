"use client";

import { useMemo, useState } from "react";
import { useSwitchStore } from "@/lib/store";
import { DAY_LABEL_FR, DAY_ORDER } from "@/lib/spaces";
import { SpaceId } from "@/lib/types";

function getDayIndex(date: Date) {
  const jsDay = date.getDay(); // 0 = sunday
  return jsDay === 0 ? 6 : jsDay - 1;
}

export function SplitScheduleBanner() {
  const { activeSpace, spaces, splitSchedule, toggleSplitDay } = useSwitchStore();
  const [editing, setEditing] = useState(false);
  const spaceById = useMemo(() => new Map(spaces.map((sp) => [sp.id, sp])), [spaces]);

  function labelFor(spaceIds: SpaceId[]) {
    if (spaceIds.length === 0) return "Repos";
    return spaceIds.map((id) => spaceById.get(id)?.name ?? "?").join(" + ");
  }

  const now = new Date();
  const todayIdx = getDayIndex(now);
  const tomorrowIdx = (todayIdx + 1) % 7;

  const today = splitSchedule[todayIdx];
  const tomorrow = splitSchedule[tomorrowIdx];

  const switchesTomorrow =
    tomorrow.spaces.length > 0 &&
    !tomorrow.spaces.includes(activeSpace) &&
    tomorrow.spaces.some((s) => s !== activeSpace);

  const newSpaceTomorrow = tomorrow.spaces.find((s) => s !== activeSpace) as SpaceId | undefined;
  const newSpaceTheme = newSpaceTomorrow ? spaceById.get(newSpaceTomorrow) : undefined;

  return (
    <div className="rounded-2xl border border-black/5 bg-white p-4 sm:p-5 shadow-sm">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <p className="text-xs uppercase tracking-wide text-neutral-400 font-medium">Planning de split</p>
          <p className="text-sm text-neutral-700 mt-0.5">
            Aujourd&apos;hui ({DAY_LABEL_FR[today.day]}) : <strong>{labelFor(today.spaces)}</strong>
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            {DAY_ORDER.map((day, idx) => {
              const entry = splitSchedule[idx];
              const isToday = idx === todayIdx;
              const colors = entry.spaces.map((id) => spaceById.get(id)?.accent).filter(Boolean);
              return (
                <div
                  key={day}
                  title={`${DAY_LABEL_FR[day]}: ${labelFor(entry.spaces)}`}
                  className={`h-7 w-7 rounded-full flex items-center justify-center text-[10px] font-semibold border ${
                    isToday ? "ring-2 ring-offset-1 ring-neutral-800" : "border-black/10"
                  }`}
                  style={{
                    background:
                      colors.length === 2
                        ? `linear-gradient(90deg, ${colors[0]} 50%, ${colors[1]} 50%)`
                        : (colors[0] ?? "#e5e5e5"),
                    color: colors.length ? "white" : "#999",
                  }}
                >
                  {DAY_LABEL_FR[day].slice(0, 2)}
                </div>
              );
            })}
          </div>
          <button
            onClick={() => setEditing((e) => !e)}
            className="text-xs font-semibold px-3 py-1.5 rounded-full border border-black/10 text-neutral-600 hover:bg-neutral-50"
          >
            {editing ? "Fermer" : "Modifier"}
          </button>
        </div>
      </div>

      {editing && (
        <div className="mt-4 space-y-1.5">
          {DAY_ORDER.map((day, idx) => {
            const entry = splitSchedule[idx];
            return (
              <div key={day} className="flex items-center gap-2 flex-wrap">
                <span className="w-20 shrink-0 text-xs font-medium text-neutral-600">{DAY_LABEL_FR[day]}</span>
                {spaces.map((sp) => {
                  const active = entry.spaces.includes(sp.id);
                  return (
                    <button
                      key={sp.id}
                      onClick={() => toggleSplitDay(day, sp.id)}
                      className="px-2.5 py-1 rounded-full text-xs font-semibold border transition"
                      style={
                        active
                          ? { backgroundColor: sp.accent, color: "#111", borderColor: sp.accent }
                          : { borderColor: "#e5e5e5", color: "#999" }
                      }
                    >
                      {sp.name}
                    </button>
                  );
                })}
              </div>
            );
          })}
        </div>
      )}

      {switchesTomorrow && newSpaceTheme && (
        <div
          className="mt-3 rounded-xl px-4 py-3 text-sm text-white flex items-center gap-2"
          style={{ backgroundColor: newSpaceTheme.chip }}
        >
          <span>🔔</span>
          <span>
            Tu passes chez <strong>{newSpaceTheme.name}</strong> demain ({DAY_LABEL_FR[tomorrow.day]}) -
            pense a consulter le journal de contexte pour reprendre le fil.
          </span>
        </div>
      )}
    </div>
  );
}
