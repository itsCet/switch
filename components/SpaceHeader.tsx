"use client";

import { useSwitchStore } from "@/lib/store";
import { SPACES } from "@/lib/spaces";
import { formatDateFr, formatRelative } from "@/lib/utils";
import { SpaceSwitcher } from "./SpaceSwitcher";

export function SpaceHeader() {
  const { activeSpace, drafts, deadlines, partners } = useSwitchStore();
  const space = SPACES[activeSpace];

  const lastDraft = drafts
    .filter((d) => d.space === activeSpace)
    .sort((a, b) => +new Date(b.updatedAt) - +new Date(a.updatedAt))[0];

  const nextDeadline = deadlines
    .filter((d) => d.space === activeSpace)
    .sort((a, b) => +new Date(a.date) - +new Date(b.date))[0];

  const lastPartner = partners
    .filter((p) => p.space === activeSpace)
    .sort((a, b) => +new Date(b.lastContact) - +new Date(a.lastContact))[0];

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

      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        <InfoCard
          label="Dernier post en brouillon"
          title={lastDraft ? lastDraft.title : "Aucun brouillon"}
          detail={lastDraft ? `${lastDraft.status} - MAJ ${formatRelative(lastDraft.updatedAt)}` : "-"}
          accent={space.accent}
        />
        <InfoCard
          label="Prochaine echeance"
          title={nextDeadline ? nextDeadline.title : "Aucune echeance"}
          detail={nextDeadline ? formatDateFr(nextDeadline.date) : "-"}
          accent={space.accent}
        />
        <InfoCard
          label="Dernier partenaire contacte"
          title={lastPartner ? lastPartner.name : "Aucun partenaire"}
          detail={lastPartner ? `${lastPartner.status} - ${formatRelative(lastPartner.lastContact)}` : "-"}
          accent={space.accent}
        />
      </div>
    </div>
  );
}

function InfoCard({
  label,
  title,
  detail,
  accent,
}: {
  label: string;
  title: string;
  detail: string;
  accent: string;
}) {
  return (
    <div className="rounded-2xl bg-white/10 border border-white/10 p-4 backdrop-blur-sm">
      <p className="text-[11px] uppercase tracking-wide text-white/55">{label}</p>
      <p className="mt-1.5 font-semibold text-sm leading-snug">{title}</p>
      <p className="mt-1 text-xs" style={{ color: accent }}>
        {detail}
      </p>
    </div>
  );
}
