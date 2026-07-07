function hexToRgb(hex: string): [number, number, number] {
  const clean = hex.replace("#", "");
  const full = clean.length === 3 ? clean.split("").map((c) => c + c).join("") : clean;
  const bigint = parseInt(full, 16);
  return [(bigint >> 16) & 255, (bigint >> 8) & 255, bigint & 255];
}

function rgbToHex([r, g, b]: [number, number, number]): string {
  return (
    "#" +
    [r, g, b]
      .map((v) => Math.round(Math.max(0, Math.min(255, v))).toString(16).padStart(2, "0"))
      .join("")
  );
}

function mix(hexA: string, hexB: string, t: number): string {
  const a = hexToRgb(hexA);
  const b = hexToRgb(hexB);
  return rgbToHex([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t]);
}

export interface DerivedTheme {
  gradientFrom: string;
  gradientTo: string;
  chip: string;
  accentSoft: string;
  softIsDark: boolean;
}

export function deriveThemeFromAccent(accent: string): DerivedTheme {
  return {
    gradientFrom: mix(accent, "#000000", 0.82),
    gradientTo: mix(accent, "#000000", 0.6),
    chip: mix(accent, "#000000", 0.35),
    accentSoft: mix(accent, "#ffffff", 0.88),
    softIsDark: false,
  };
}
