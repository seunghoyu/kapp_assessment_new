import type { CSSProperties } from "react";
import type { BgStyle, FrameRarity, GlowLevel, SkillState, SkillTheme } from "./skillVisual.types";

/** Base tile gradient (dark tech-fantasy). */
export const themeSurface: Record<SkillTheme, string> = {
  blue: "bg-gradient-to-br from-slate-950 via-blue-950/95 to-slate-950",
  purple: "bg-gradient-to-br from-slate-950 via-purple-950/95 to-slate-950",
  green: "bg-gradient-to-br from-slate-950 via-emerald-950/95 to-slate-950",
  orange: "bg-gradient-to-br from-slate-950 via-amber-950/90 to-slate-950",
  gold: "bg-gradient-to-br from-slate-900 via-amber-900/80 to-slate-950",
  red: "bg-gradient-to-br from-slate-950 via-rose-950/95 to-slate-950",
  cyan: "bg-gradient-to-br from-slate-950 via-cyan-950/90 to-slate-950",
};

/** Accent orb / highlight blob (absolute inset, blurred). */
export const themeAccentBlob: Record<SkillTheme, string> = {
  blue: "bg-blue-500/35",
  purple: "bg-purple-500/35",
  green: "bg-emerald-500/35",
  orange: "bg-amber-500/30",
  gold: "bg-amber-400/40",
  red: "bg-rose-500/35",
  cyan: "bg-cyan-400/30",
};

export const themeIconTint: Record<SkillTheme, string> = {
  blue: "text-sky-200",
  purple: "text-violet-200",
  green: "text-emerald-200",
  orange: "text-amber-200",
  gold: "text-amber-100",
  red: "text-rose-200",
  cyan: "text-cyan-200",
};

const glowRgb: Record<SkillTheme, string> = {
  blue: "56, 189, 248",
  purple: "167, 139, 250",
  green: "52, 211, 153",
  orange: "251, 191, 36",
  gold: "250, 204, 21",
  red: "251, 113, 133",
  cyan: "34, 211, 238",
};

const glowSpread: Record<GlowLevel, [number, number, number]> = {
  soft: [0.25, 12, 20],
  medium: [0.4, 16, 28],
  strong: [0.55, 20, 36],
};

function stateGlowMultiplier(state: SkillState): number {
  switch (state) {
    case "locked":
      return 0.15;
    case "available":
      return 1;
    case "active":
      return 1.35;
    case "mastered":
      return 1.15;
    default:
      return 1;
  }
}

export function getSkillGlowStyle(
  theme: SkillTheme,
  glow: GlowLevel,
  state: SkillState
): CSSProperties {
  const rgb = glowRgb[theme];
  const [alphaBase, blur1, blur2] = glowSpread[glow];
  const a = alphaBase * stateGlowMultiplier(state);
  const outer = `0 0 ${blur1}px rgba(${rgb}, ${Math.min(a, 0.9).toFixed(2)})`;
  const inner = `0 0 ${blur2}px rgba(${rgb}, ${(a * 0.45).toFixed(2)})`;
  return { boxShadow: `${outer}, ${inner}` };
}

export function frameClasses(
  theme: SkillTheme,
  frame: FrameRarity,
  state: SkillState,
  corner: "rounded-lg" | "rounded-xl" = "rounded-xl"
): string {
  const base = corner;
  const themed =
    theme === "blue"
      ? "border-sky-400/55 ring-sky-400/22"
      : theme === "cyan"
        ? "border-cyan-400/55 ring-cyan-400/22"
        : theme === "purple"
          ? "border-violet-400/55 ring-violet-400/22"
          : theme === "green"
            ? "border-emerald-400/55 ring-emerald-400/22"
            : theme === "orange"
              ? "border-amber-400/55 ring-amber-400/22"
              : theme === "gold"
                ? "border-amber-400/65 ring-amber-400/25"
                : "border-rose-400/55 ring-rose-400/22";

  if (state === "locked") {
    return `${base} border ${themed} ring-0`;
  }
  if (state === "mastered") {
    return `${base} border-2 border-amber-400/70 ring-1 ring-amber-300/25 shadow-[inset_0_0_12px_rgba(250,204,21,0.12)]`;
  }
  if (state === "active") {
    return `${base} border-2 ${themed} ring-2 shadow-[inset_0_0_10px_rgba(255,255,255,0.10)]`;
  }
  switch (frame) {
    case "epic":
      return `${base} border ${themed} ring-1 shadow-[0_0_0_1px_rgba(255,255,255,0.06)]`;
    case "rare":
      return `${base} border ${themed} ring-1`;
    case "common":
    default:
      return `${base} border ${themed} ring-0`;
  }
}

export function bgStyleLayerClasses(bgStyle: BgStyle): string {
  switch (bgStyle) {
    case "orb":
      return "pointer-events-none absolute -inset-[35%] rounded-full opacity-90 blur-2xl scale-110";
    case "plate":
      return "pointer-events-none absolute inset-0 opacity-40 bg-gradient-to-t from-black/60 via-transparent to-white/5";
    case "rune":
      return "pointer-events-none absolute inset-0 opacity-[0.12] bg-[linear-gradient(135deg,rgba(255,255,255,0.15)_0%,transparent_40%,transparent_60%,rgba(255,255,255,0.08)_100%)]";
    default:
      return "";
  }
}
