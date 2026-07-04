"use client";

import { FormEvent, useMemo, useState } from "react";
import { useSwitchStore } from "@/lib/store";
import { SPACES } from "@/lib/spaces";
import { formatDateFr, getMonthMatrix, MONTH_LABEL_FR, toISODate, WEEKDAY_LABEL_FR } from "@/lib/utils";
import { CalendarEvent, SpaceId } from "@/lib/types";

type Mode = "fusion" | "filtre";

const KIND_LABEL: Record<CalendarEvent["kind"], string> = {
  match: "Match",
  shooting: "Shooting",
  partenaire: "Partenaire",
  publication: "Publication",
  reunion: "Reunion",
};

const KIND_OPTIONS = Object.keys(KIND_LABEL) as CalendarEvent["kind"][];

interface FormState {
  id: string | null;
  title: string;
  date: string;
  time: string;
  kind: CalendarEvent["kind"];
  space: SpaceId;
}

export function CalendarView() {
  const { activeSpace, calendar, addEvent, updateEvent, deleteEvent } = useSwitchStore();
  const [mode, setMode] = useState<Mode>("fusion");
  const [viewDate, setViewDate] = useState(() => new Date());
  const [form, setForm] = useState<FormState | null>(null);

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const weeks = useMemo(() => getMonthMatrix(year, month), [year, month]);
  const todayISO = toISODate(new Date());

  const visibleEvents = mode === "filtre" ? calendar.filter((e) => e.space === activeSpace) : calendar;

  const eventsByDate = useMemo(() => {
    const map = new Map<string, CalendarEvent[]>();
    for (const ev of visibleEvents) {
      const list = map.get(ev.date) ?? [];
      list.push(ev);
      map.set(ev.date, list);
    }
    for (const list of map.values()) list.sort((a, b) => (a.time ?? "").localeCompare(b.time ?? ""));
    return map;
  }, [visibleEvents]);

  const grouped = useMemo(
    () => [...eventsByDate.entries()].sort((a, b) => a[0].localeCompare(b[0])),
    [eventsByDate]
  );

  function openCreateForm(date: string) {
    setForm({ id: null, title: "", date, time: "", kind: "publication", space: activeSpace });
  }

  function openEditForm(ev: CalendarEvent) {
    setForm({ id: ev.id, title: ev.title, date: ev.date, time: ev.time ?? "", kind: ev.kind, space: ev.space });
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!form || !form.title.trim()) return;
    const payload = {
      title: form.title.trim(),
      date: form.date,
      time: form.time || undefined,
      kind: form.kind,
      space: form.space,
    };
    if (form.id) {
      updateEvent(form.id, payload);
    } else {
      addEvent(payload);
    }
    setForm(null);
  }

  return (
    <div className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h2 className="font-semibold text-neutral-800">Calendrier</h2>
        <div className="flex items-center gap-2 flex-wrap">
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
          <button
            onClick={() => openCreateForm(todayISO)}
            className="text-sm font-semibold rounded-full px-3 py-1.5 text-white bg-neutral-900 hover:bg-neutral-800"
          >
            + Evenement
          </button>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <button
          onClick={() => setViewDate(new Date(year, month - 1, 1))}
          className="h-8 w-8 rounded-full border border-black/10 text-neutral-500 hover:bg-neutral-50"
          aria-label="Mois precedent"
        >
          ‹
        </button>
        <p className="font-semibold text-sm text-neutral-800">
          {MONTH_LABEL_FR[month]} {year}
        </p>
        <button
          onClick={() => setViewDate(new Date(year, month + 1, 1))}
          className="h-8 w-8 rounded-full border border-black/10 text-neutral-500 hover:bg-neutral-50"
          aria-label="Mois suivant"
        >
          ›
        </button>
      </div>

      <div className="mt-3 grid grid-cols-7 gap-1 text-center text-[11px] text-neutral-400 font-medium">
        {WEEKDAY_LABEL_FR.map((d) => (
          <div key={d}>{d}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1 mt-1">
        {weeks.flat().map((day) => {
          const iso = toISODate(day);
          const inMonth = day.getMonth() === month;
          const dayEvents = eventsByDate.get(iso) ?? [];
          const spacesPresent = new Set(dayEvents.map((e) => e.space));
          const isConflict = mode === "fusion" && spacesPresent.size > 1;
          const isToday = iso === todayISO;
          return (
            <button
              key={iso}
              onClick={() => openCreateForm(iso)}
              title={dayEvents.length ? `${dayEvents.length} evenement(s)` : "Ajouter un evenement"}
              className={`relative aspect-square rounded-lg border text-left p-1 flex flex-col transition ${
                inMonth ? "bg-white hover:bg-neutral-50" : "bg-neutral-50 text-neutral-300"
              } ${isConflict ? "border-amber-300" : "border-black/5"} ${
                isToday ? "ring-2 ring-neutral-800" : ""
              }`}
            >
              <span className="text-[11px]">{day.getDate()}</span>
              <div className="mt-auto flex flex-wrap gap-0.5 pb-0.5">
                {dayEvents.slice(0, 4).map((ev) => (
                  <span
                    key={ev.id}
                    className="h-1.5 w-1.5 rounded-full"
                    style={{ backgroundColor: SPACES[ev.space].accent }}
                  />
                ))}
              </div>
            </button>
          );
        })}
      </div>

      {form && (
        <form
          onSubmit={handleSubmit}
          className="mt-4 rounded-xl border border-black/10 bg-neutral-50 p-4 grid gap-3 sm:grid-cols-2"
        >
          <div className="sm:col-span-2">
            <label className="block text-xs font-medium text-neutral-600">Titre</label>
            <input
              autoFocus
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="mt-1 w-full rounded-lg border border-black/10 bg-white p-2 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-800"
              placeholder="Titre de l'evenement"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-neutral-600">Date</label>
            <input
              type="date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              className="mt-1 w-full rounded-lg border border-black/10 bg-white p-2 text-sm text-neutral-900"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-neutral-600">Heure</label>
            <input
              type="time"
              value={form.time}
              onChange={(e) => setForm({ ...form, time: e.target.value })}
              className="mt-1 w-full rounded-lg border border-black/10 bg-white p-2 text-sm text-neutral-900"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-neutral-600">Type</label>
            <select
              value={form.kind}
              onChange={(e) => setForm({ ...form, kind: e.target.value as CalendarEvent["kind"] })}
              className="mt-1 w-full rounded-lg border border-black/10 bg-white p-2 text-sm text-neutral-900"
            >
              {KIND_OPTIONS.map((k) => (
                <option key={k} value={k}>
                  {KIND_LABEL[k]}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-neutral-600">Espace</label>
            <select
              value={form.space}
              onChange={(e) => setForm({ ...form, space: e.target.value as SpaceId })}
              className="mt-1 w-full rounded-lg border border-black/10 bg-white p-2 text-sm text-neutral-900"
            >
              {Object.values(SPACES).map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-2 flex items-center justify-between">
            {form.id ? (
              <button
                type="button"
                onClick={() => {
                  deleteEvent(form.id as string);
                  setForm(null);
                }}
                className="text-xs font-semibold text-red-600 hover:text-red-700"
              >
                Supprimer
              </button>
            ) : (
              <span />
            )}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setForm(null)}
                className="text-xs font-semibold px-3 py-1.5 rounded-full border border-black/10 text-neutral-600"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="text-xs font-semibold px-3 py-1.5 rounded-full text-white bg-neutral-900"
              >
                {form.id ? "Enregistrer" : "Ajouter"}
              </button>
            </div>
          </div>
        </form>
      )}

      <div className="mt-5 space-y-3">
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
                  <button
                    key={ev.id}
                    onClick={() => openEditForm(ev)}
                    className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-white text-left hover:opacity-90"
                    style={{ backgroundColor: SPACES[ev.space].chip }}
                  >
                    <span className="font-mono text-xs opacity-70">{ev.time ?? "--:--"}</span>
                    <span className="flex-1">{ev.title}</span>
                    <span
                      className="text-[10px] uppercase tracking-wide rounded-full px-2 py-0.5"
                      style={{ backgroundColor: SPACES[ev.space].accent, color: "#111" }}
                    >
                      {KIND_LABEL[ev.kind]}
                    </span>
                  </button>
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
