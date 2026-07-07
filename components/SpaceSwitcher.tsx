"use client";

import { useSwitchStore } from "@/lib/store";

export function SpaceSwitcher() {
  const { activeSpace, spaces, setActiveSpace } = useSwitchStore();

  return (
    <div className="inline-flex flex-wrap rounded-full border border-white/15 bg-black/20 p-1 backdrop-blur-sm">
      {spaces.map((space) => {
        const isActive = activeSpace === space.id;
        return (
          <button
            key={space.id}
            onClick={() => setActiveSpace(space.id)}
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
