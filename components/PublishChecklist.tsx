"use client";

import { useSwitchStore } from "@/lib/store";
import { SPACES } from "@/lib/spaces";

export function PublishChecklist() {
  const { activeSpace, checklist, toggleChecklistItem } = useSwitchStore();
  const space = SPACES[activeSpace];
  const items = checklist.filter((item) => item.space === activeSpace);
  const doneCount = items.filter((item) => item.checked).length;

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
          <label
            key={item.id}
            className="flex items-center gap-3 rounded-xl border border-black/5 px-4 py-2.5 cursor-pointer hover:bg-neutral-50"
          >
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
        ))}
        {items.length === 0 && (
          <p className="text-sm text-neutral-400 text-center py-6">Aucune verification pour cet espace.</p>
        )}
      </div>
    </div>
  );
}
