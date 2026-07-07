"use client";

import { useEffect, useState } from "react";
import { useSwitchStore } from "@/lib/store";
import { formatRelative } from "@/lib/utils";

export function ContextJournal() {
  const { activeSpace, journal, updateJournal, space } = useSwitchStore();
  const entry = journal.find((j) => j.space === activeSpace);

  const [whereImAt, setWhereImAt] = useState(entry?.whereImAt ?? "");
  const [waitingOn, setWaitingOn] = useState(entry?.waitingOn ?? "");
  const [saved, setSaved] = useState(true);

  useEffect(() => {
    setWhereImAt(entry?.whereImAt ?? "");
    setWaitingOn(entry?.waitingOn ?? "");
    setSaved(true);
  }, [activeSpace, entry?.whereImAt, entry?.waitingOn]);

  function handleSave() {
    updateJournal(activeSpace, { whereImAt, waitingOn });
    setSaved(true);
  }

  const labelClass = space.softIsDark ? "text-white/70" : "text-neutral-600";
  const metaClass = space.softIsDark ? "text-white/50" : "text-neutral-500";

  return (
    <div
      className="rounded-2xl p-5 shadow-sm border"
      style={{ backgroundColor: space.accentSoft, borderColor: space.accent + "40" }}
    >
      <div className="flex items-center justify-between">
        <p
          className="text-xs uppercase tracking-wide font-semibold"
          style={{ color: space.softIsDark ? "#ffffff" : space.chip }}
        >
          Journal de contexte - {space.name}
        </p>
        {entry && (
          <span className={`text-[11px] ${metaClass}`}>MAJ {formatRelative(entry.updatedAt)}</span>
        )}
      </div>

      <label className={`block mt-3 text-xs font-medium ${labelClass}`}>Ou j&apos;en suis</label>
      <textarea
        value={whereImAt}
        onChange={(e) => {
          setWhereImAt(e.target.value);
          setSaved(false);
        }}
        rows={2}
        className="mt-1 w-full rounded-lg border border-black/10 bg-white/70 p-2 text-sm text-neutral-900 placeholder:text-neutral-400 resize-none focus:outline-none focus:ring-2"
        style={{ ["--tw-ring-color" as string]: space.accent }}
      />

      <label className={`block mt-3 text-xs font-medium ${labelClass}`}>En attente de retour de</label>
      <input
        value={waitingOn}
        onChange={(e) => {
          setWaitingOn(e.target.value);
          setSaved(false);
        }}
        className="mt-1 w-full rounded-lg border border-black/10 bg-white/70 p-2 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2"
        style={{ ["--tw-ring-color" as string]: space.accent }}
      />

      <div className="mt-3 flex justify-end">
        <button
          onClick={handleSave}
          disabled={saved}
          className="text-xs font-semibold px-3 py-1.5 rounded-full text-white disabled:opacity-40"
          style={{ backgroundColor: space.chip }}
        >
          {saved ? "A jour" : "Enregistrer"}
        </button>
      </div>
    </div>
  );
}
