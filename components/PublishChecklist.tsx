"use client";

import { FormEvent, useState } from "react";
import { useSwitchStore } from "@/lib/store";

export function PublishChecklist() {
  const { activeSpace, checklist, toggleChecklistItem, addChecklistItem, deleteChecklistItem, space } =
    useSwitchStore();
  const items = checklist.filter((item) => item.space === activeSpace);
  const doneCount = items.filter((item) => item.checked).length;
  const [newLabel, setNewLabel] = useState("");

  function handleAdd(e: FormEvent) {
    e.preventDefault();
    if (!newLabel.trim()) return;
    addChecklistItem(activeSpace, newLabel.trim());
    setNewLabel("");
  }

  return (
    <div className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-neutral-800">Checklist de publication</h2>
        <span className="text-xs text-neutral-400">
          {doneCount}/{items.length} - {space.name}
        </span>
      </div>

      <div className="mt-4 space-y-2">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-center gap-3 rounded-xl border border-black/5 px-4 py-2.5 hover:bg-neutral-50"
          >
            <label className="flex items-center gap-3 flex-1 cursor-pointer">
              <input
                type="checkbox"
                checked={item.checked}
                onChange={() => toggleChecklistItem(item.id)}
                className="h-4 w-4 rounded accent-current"
                style={{ color: space.chip }}
              />
              <span
                className={`text-sm ${item.checked ? "text-neutral-400 line-through" : "text-neutral-700"}`}
              >
                {item.label}
              </span>
            </label>
            <button
              onClick={() => deleteChecklistItem(item.id)}
              aria-label="Supprimer"
              title="Supprimer"
              className="text-neutral-300 hover:text-red-500 text-sm leading-none px-1"
            >
              ✕
            </button>
          </div>
        ))}
        {items.length === 0 && (
          <p className="text-sm text-neutral-400 text-center py-6">Aucune verification pour cet espace.</p>
        )}
      </div>

      <form onSubmit={handleAdd} className="mt-3 flex gap-2">
        <input
          value={newLabel}
          onChange={(e) => setNewLabel(e.target.value)}
          placeholder="Ajouter une verification"
          className="flex-1 rounded-lg border border-black/10 p-2 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-800"
        />
        <button
          type="submit"
          className="text-sm font-semibold px-3 py-1.5 rounded-full text-white bg-neutral-900 hover:bg-neutral-800"
        >
          + Ajouter
        </button>
      </form>
    </div>
  );
}
