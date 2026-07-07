"use client";

import { useSwitchStore } from "@/lib/store";
import { SPACES } from "@/lib/spaces";
import { KIND_LABEL } from "@/lib/calendar";
import { formatDateFr, toISODate } from "@/lib/utils";
import { SpaceSwitcher } from "./SpaceSwitcher";

export function SpaceHeader() {
  const { activeSpace, calendar } = useSwitchStore();
  const space = SPACES[activeSpace];
  const todayISO = toISODate(new Date());

  const spaceEvents = calendar
    .filter((ev) => ev.space === activeSpace)
    .sort((a, b) => (a.date + (a.time ?? "")).localeCompare(b.date + (b.time ?? "")));

  const todaysEvents = spaceEvents.filter((ev) => ev.date === todayISO);
  const urgent = todaysEvents[0] ?? spaceEvents.find((ev) => ev.date > todayISO);

  const label = todaysEvents.length ? "A faire aujourd'hui" : "Prochain evenement";

  return (
    <div className={`bg-gradient-to-br ${space.gradient} text-white rounded-3xl p-6 sm:p-8 shadow-xl`}>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-widest text-white/60">Espace actif</p>
          <h1 className={`text-3xl sm:text-4xl ${space.fontClass}`}>{space.name}</h1>
          <p className="text-white/70 text-sm mt-1">{space.tagline} - {space.tone}</p>
        </div>
        <SpaceSwitcher />
      </div>

      <div className="mt-6 rounded-2xl bg-white/10 border border-white/10 p-4 backdrop-blur-sm">
        <p className="text-[11px] uppercase tracking-wide text-white/55">{label}</p>
        {urgent ? (
          <>
            <p className="mt-1.5 font-semibold text-sm leading-snug">{urgent.title}</p>
            <p className="mt-1 text-xs text-white/80">
              {formatDateFr(urgent.date)}
              {urgent.time ? ` - ${urgent.time}` : ""} - {KIND_LABEL[urgent.kind]}
            </p>
          </>
        ) : (
          <p className="mt-1.5 font-semibold text-sm leading-snug">Rien de prevu</p>
        )}
      </div>
    </div>
  );
}
