"use client";

import { FormEvent, useState } from "react";
import { useSwitchStore } from "@/lib/store";
import { SpaceTheme } from "@/lib/types";

interface RowState {
  name: string;
  tagline: string;
  tone: string;
  accent: string;
}

function toRowState(space: SpaceTheme): RowState {
  return { name: space.name, tagline: space.tagline, tone: space.tone, accent: space.accent };
}

export function SpaceManager() {
  const { spaces, updateSpace, addSpace, deleteSpace } = useSwitchStore();
  const [open, setOpen] = useState(false);

  return (
    <div className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-neutral-800">Espaces</h2>
        <button
          onClick={() => setOpen((o) => !o)}
          className="text-xs font-semibold px-3 py-1.5 rounded-full border border-black/10 text-neutral-600 hover:bg-neutral-50"
        >
          {open ? "Fermer" : "Gerer les espaces"}
        </button>
      </div>

      {open && (
        <div className="mt-4 space-y-3">
          {spaces.map((sp) => (
            <SpaceRow
              key={sp.id}
              space={sp}
              canDelete={spaces.length > 1}
              onSave={(input) => updateSpace(sp.id, input)}
              onDelete={() => deleteSpace(sp.id)}
            />
          ))}
          <AddSpaceForm onAdd={addSpace} />
        </div>
      )}
    </div>
  );
}

function SpaceRow({
  space,
  canDelete,
  onSave,
  onDelete,
}: {
  space: SpaceTheme;
  canDelete: boolean;
  onSave: (input: RowState) => void;
  onDelete: () => void;
}) {
  const [row, setRow] = useState<RowState>(toRowState(space));

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!row.name.trim()) return;
    onSave({ ...row, name: row.name.trim() });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-xl border border-black/10 p-4 grid gap-3 sm:grid-cols-[auto_1fr_1fr_1fr_auto_auto] sm:items-end"
    >
      <div>
        <label className="block text-xs font-medium text-neutral-600">Couleur</label>
        <input
          type="color"
          value={row.accent}
          onChange={(e) => setRow({ ...row, accent: e.target.value })}
          className="mt-1 h-9 w-12 rounded border border-black/10"
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-neutral-600">Nom</label>
        <input
          value={row.name}
          onChange={(e) => setRow({ ...row, name: e.target.value })}
          className="mt-1 w-full rounded-lg border border-black/10 p-2 text-sm text-neutral-900"
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-neutral-600">Sous-titre</label>
        <input
          value={row.tagline}
          onChange={(e) => setRow({ ...row, tagline: e.target.value })}
          className="mt-1 w-full rounded-lg border border-black/10 p-2 text-sm text-neutral-900"
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-neutral-600">Ton</label>
        <input
          value={row.tone}
          onChange={(e) => setRow({ ...row, tone: e.target.value })}
          className="mt-1 w-full rounded-lg border border-black/10 p-2 text-sm text-neutral-900"
        />
      </div>
      <button
        type="submit"
        className="text-xs font-semibold px-3 py-2 rounded-full text-white bg-neutral-900 hover:bg-neutral-800"
      >
        Enregistrer
      </button>
      <button
        type="button"
        onClick={onDelete}
        disabled={!canDelete}
        title={canDelete ? "Supprimer cet espace" : "Il faut garder au moins un espace"}
        className="text-xs font-semibold px-3 py-2 rounded-full border border-red-200 text-red-600 hover:bg-red-50 disabled:opacity-30 disabled:hover:bg-transparent"
      >
        Supprimer
      </button>
    </form>
  );
}

function AddSpaceForm({ onAdd }: { onAdd: (input: RowState) => void }) {
  const [row, setRow] = useState<RowState>({ name: "", tagline: "", tone: "", accent: "#4f46e5" });

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!row.name.trim()) return;
    onAdd({ ...row, name: row.name.trim() });
    setRow({ name: "", tagline: "", tone: "", accent: "#4f46e5" });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-xl border border-dashed border-black/15 p-4 grid gap-3 sm:grid-cols-[auto_1fr_1fr_1fr_auto] sm:items-end"
    >
      <div>
        <label className="block text-xs font-medium text-neutral-600">Couleur</label>
        <input
          type="color"
          value={row.accent}
          onChange={(e) => setRow({ ...row, accent: e.target.value })}
          className="mt-1 h-9 w-12 rounded border border-black/10"
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-neutral-600">Nom</label>
        <input
          value={row.name}
          onChange={(e) => setRow({ ...row, name: e.target.value })}
          placeholder="Nouvelle entreprise"
          className="mt-1 w-full rounded-lg border border-black/10 p-2 text-sm text-neutral-900 placeholder:text-neutral-400"
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-neutral-600">Sous-titre</label>
        <input
          value={row.tagline}
          onChange={(e) => setRow({ ...row, tagline: e.target.value })}
          placeholder="Nom complet"
          className="mt-1 w-full rounded-lg border border-black/10 p-2 text-sm text-neutral-900 placeholder:text-neutral-400"
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-neutral-600">Ton</label>
        <input
          value={row.tone}
          onChange={(e) => setRow({ ...row, tone: e.target.value })}
          placeholder="Ex: Corporate & sobre"
          className="mt-1 w-full rounded-lg border border-black/10 p-2 text-sm text-neutral-900 placeholder:text-neutral-400"
        />
      </div>
      <button
        type="submit"
        className="text-xs font-semibold px-3 py-2 rounded-full text-white bg-neutral-900 hover:bg-neutral-800"
      >
        + Ajouter
      </button>
    </form>
  );
}
