import type { CSSProperties } from "react";
import type { BgStyle, FrameRarity, GlowLevel, SkillState, SkillTheme } from "./skillVisual.types";

/**
 * 요구사항:
 * - 색상은 blue / purple / gold 3계열만 사용(최종은 resolve에서 정규화)
 * - 배경은 "흰색 기반"이 아니라 색이 도는 그라데이션
 * - 진하기/강약(불투명도 등)은 계열별로 동일하게 맞춤
 */
export const themeSurface: Record<SkillTheme, string> = {
  blue: "bg-gradient-to-br from-sky-200 via-sky-300 to-sky-400/75",
  purple: "bg-gradient-to-br from-violet-200 via-violet-300 to-violet-400/75",
  gold: "bg-gradient-to-br from-amber-200 via-amber-300 to-amber-400/75",

  // legacy themes (혹시 rules에 남아있는 값 대비) -> 3계열로 유사 매핑
  green: "bg-gradient-to-br from-sky-200 via-sky-300 to-sky-400/75",
  cyan: "bg-gradient-to-br from-sky-200 via-sky-300 to-sky-400/75",
  orange: "bg-gradient-to-br from-amber-200 via-amber-300 to-amber-400/75",
  red: "bg-gradient-to-br from-violet-200 via-violet-300 to-violet-400/75",
};

/** Accent orb / highlight blob (absolute inset, blurred). */
export const themeAccentBlob: Record<SkillTheme, string> = {
  // 계열별 "동일 강도"로 맞춤
  blue: "bg-sky-500/45",
  purple: "bg-violet-500/45",
  gold: "bg-amber-500/45",

  // legacy
  green: "bg-sky-500/45",
  cyan: "bg-sky-500/45",
  orange: "bg-amber-500/45",
  red: "bg-violet-500/45",
};

export const themeIconTint: Record<SkillTheme, string> = {
  // 동일 강도의 진한 텍스트 톤(채도만 다르게)
  blue: "text-sky-950/80",
  purple: "text-violet-950/80",
  gold: "text-amber-950/80",

  // legacy
  green: "text-sky-950/80",
  cyan: "text-sky-950/80",
  orange: "text-amber-950/80",
  red: "text-violet-950/80",
};

const glowRgb: Record<SkillTheme, string> = {
  blue: "14, 165, 233",
  purple: "139, 92, 246",
  gold: "245, 158, 11",

  // legacy
  green: "14, 165, 233",
  cyan: "14, 165, 233",
  orange: "245, 158, 11",
  red: "139, 92, 246",
};

const glowSpread: Record<GlowLevel, [number, number, number]> = {
  // 계열별 차이 없이 고정 (진하기/강약 차이 방지)
  soft: [0.28, 16, 28],
  medium: [0.28, 16, 28],
  strong: [0.28, 16, 28],
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
  const inner = `0 0 ${blur2}px rgba(${rgb}, ${(a * 0.55).toFixed(2)})`;
  return { boxShadow: `${outer}, ${inner}` };
}

export function frameClasses(
  theme: SkillTheme,
  frame: FrameRarity,
  state: SkillState,
  corner: "rounded-lg" | "rounded-xl" = "rounded-xl"
): string {
  const base = corner;
  // 배경/테두리 계열을 동일하게, 투명도도 동일하게 고정
  const themed =
    theme === "gold" || theme === "orange"
      ? "border-amber-500/60 ring-amber-500/25"
      : theme === "purple" || theme === "red"
        ? "border-violet-500/60 ring-violet-500/25"
        : "border-sky-500/60 ring-sky-500/25";

  if (state === "locked") {
    return `${base} border ${themed} ring-0`;
  }
  if (state === "mastered") {
    // 상태가 mastered여도 "다른색 고정" 금지: 테마 계열 그대로 + 동일 강도
    return `${base} border-2 ${themed} ring-1 shadow-[inset_0_0_12px_rgba(255,255,255,0.16)]`;
  }
  if (state === "active") {
    return `${base} border-2 ${themed} ring-2 shadow-[inset_0_0_10px_rgba(255,255,255,0.12)]`;
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
      // 계열별 차이 없이 고정 (색상은 blob/themeSurface가 담당)
      return "pointer-events-none absolute -inset-[35%] rounded-full opacity-90 blur-2xl scale-110";
    case "plate":
      // white 기반 느낌 제거 + 강도 고정
      return "pointer-events-none absolute inset-0 opacity-40 bg-gradient-to-t from-black/35 via-transparent to-transparent";
    case "rune":
      // white 패턴 대신 중립적인 다크 패턴(강도 고정)
      return "pointer-events-none absolute inset-0 opacity-[0.12] bg-[linear-gradient(135deg,rgba(0,0,0,0.18)_0%,transparent_40%,transparent_60%,rgba(0,0,0,0.10)_100%)]";
    default:
      return "";
  }
}
