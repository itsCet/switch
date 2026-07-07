"use client";

import { useSwitchStore } from "@/lib/store";

export function AccountBar() {
  const { session, signOut } = useSwitchStore();

  return (
    <div className="flex items-center justify-end gap-3 text-xs text-neutral-500">
      <span>{session.user.email}</span>
      <button onClick={signOut} className="font-semibold text-neutral-700 hover:text-neutral-900 underline">
        Se deconnecter
      </button>
    </div>
  );
}
