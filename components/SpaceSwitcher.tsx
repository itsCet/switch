"use client";

import { useSwitchStore } from "@/lib/store";
import { SPACES } from "@/lib/spaces";
import { SpaceId } from "@/lib/types";

export function SpaceSwitcher() {
  const { activeSpace, setActiveSpace } = useSwitchStore();

  return (
    <div className="inline-flex rounded-full border border-white/15 bg-black/20 p-1 backdrop-blur-sm">
      {(Object.keys(SPACES) as SpaceId[]).map((id) => {
        const space = SPACES[id];
        const isActive = activeSpace === id;
        return (
          <button
            key={id}
            onClick={() => setActiveSpace(id)}
            className={`relative rounded-full px-4 py-2 text-sm transition-all duration-200 ${
              isActive ? "text-white shadow-lg" : "text-white/60 hover:text-white/90"
            }`}
            style={isActive ? { backgroundColor: space.accent, color: "#111" } : undefined}
          >
            <span className={isActive ? "font-semibold" : "font-medium"}>{space.name}</span>
          </button>
        );
      })}
    </div>
  );
}
