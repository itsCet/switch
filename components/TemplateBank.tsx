"use client";

import { useSwitchStore } from "@/lib/store";
import { SPACES } from "@/lib/spaces";

export function TemplateBank() {
  const { activeSpace, templates, useTemplate } = useSwitchStore();
  const space = SPACES[activeSpace];
  const list = templates
    .filter((t) => t.space === activeSpace)
    .sort((a, b) => b.usageCount - a.usageCount);

  return (
    <div className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-neutral-800">Banque de contenu recurrent</h2>
        <span className="text-xs text-neutral-400">{list.length} templates - {space.name}</span>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {list.map((t) => (
          <div key={t.id} className="rounded-xl border border-black/5 p-4 flex flex-col">
            <div className="flex items-start justify-between gap-2">
              <p className="font-semibold text-sm text-neutral-800">{t.name}</p>
              <span
                className="text-[10px] uppercase tracking-wide rounded-full px-2 py-0.5 whitespace-nowrap"
                style={{ backgroundColor: space.accentSoft, color: space.chip }}
              >
                {t.format}
              </span>
            </div>
            <p className="text-xs text-neutral-500 mt-1.5 flex-1">{t.description}</p>
            <div className="mt-3 flex items-center justify-between text-xs text-neutral-400">
              <span>Utilise {t.usageCount}x - dernier {t.lastUsed}</span>
              <button
                onClick={() => useTemplate(t.id)}
                className="font-semibold px-3 py-1 rounded-full text-white"
                style={{ backgroundColor: space.chip }}
              >
                Utiliser
              </button>
            </div>
          </div>
        ))}
        {list.length === 0 && (
          <p className="text-sm text-neutral-400 text-center py-6 sm:col-span-2">Aucun template pour cet espace.</p>
        )}
      </div>
    </div>
  );
}
