"use client";

import { useSwitchStore } from "@/lib/store";
import { DAY_LABEL_FR, DAY_ORDER, SPACES, SPLIT_SCHEDULE } from "@/lib/spaces";
import { SpaceId } from "@/lib/types";

function getDayIndex(date: Date) {
  const jsDay = date.getDay(); // 0 = sunday
  return jsDay === 0 ? 6 : jsDay - 1;
}

export function SplitScheduleBanner() {
  const { activeSpace } = useSwitchStore();
  const now = new Date();
  const todayIdx = getDayIndex(now);
  const tomorrowIdx = (todayIdx + 1) % 7;

  const today = SPLIT_SCHEDULE[todayIdx];
  const tomorrow = SPLIT_SCHEDULE[tomorrowIdx];

  const switchesTomorrow =
    tomorrow.spaces.length > 0 &&
    !tomorrow.spaces.includes(activeSpace) &&
    tomorrow.spaces.some((s) => s !== activeSpace);

  const newSpaceTomorrow = tomorrow.spaces.find((s) => s !== activeSpace) as SpaceId | undefined;

  return (
    <div className="rounded-2xl border border-black/5 bg-white p-4 sm:p-5 shadow-sm">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <p className="text-xs uppercase tracking-wide text-neutral-400 font-medium">Planning de split</p>
          <p className="text-sm text-neutral-700 mt-0.5">
            Aujourd&apos;hui ({DAY_LABEL_FR[today.day]}) : <strong>{today.label}</strong>
          </p>
        </div>
        <div className="flex gap-1.5">
          {DAY_ORDER.map((day, idx) => {
            const entry = SPLIT_SCHEDULE[idx];
            const isToday = idx === todayIdx;
            return (
              <div
                key={day}
                title={`${DAY_LABEL_FR[day]}: ${entry.label}`}
                className={`h-7 w-7 rounded-full flex items-center justify-center text-[10px] font-semibold border ${
                  isToday ? "ring-2 ring-offset-1 ring-neutral-800" : "border-black/10"
                }`}
                style={{
                  background:
                    entry.spaces.length === 2
                      ? "linear-gradient(90deg, #0b2545 50%, #ff2e63 50%)"
                      : entry.spaces[0]
                        ? SPACES[entry.spaces[0]].accent
                        : "#e5e5e5",
                  color: entry.spaces.length ? "white" : "#999",
                }}
              >
                {DAY_LABEL_FR[day].slice(0, 2)}
              </div>
            );
          })}
        </div>
      </div>

      {switchesTomorrow && newSpaceTomorrow && (
        <div
          className="mt-3 rounded-xl px-4 py-3 text-sm text-white flex items-center gap-2"
          style={{ backgroundColor: SPACES[newSpaceTomorrow].chip }}
        >
          <span>🔔</span>
          <span>
            Tu passes chez <strong>{SPACES[newSpaceTomorrow].name}</strong> demain ({DAY_LABEL_FR[tomorrow.day]}) -
            pense a consulter le journal de contexte pour reprendre le fil.
          </span>
        </div>
      )}
    </div>
  );
}
