import type { SkillVisual } from "./skillVisual.types";

/**
 * 키워드 룰을 제거하고, 모든 스킬트리 아이콘을 동일한 톤(“계약/이행/사후관리” 계열)로 통일한다.
 * - theme: blue
 * - bgStyle: plate
 * - frame: epic
 */
const UNIFIED_SKILL_VISUAL: SkillVisual = {
  icon: "mdi:briefcase-outline",
  category: "execution",
  theme: "blue",
  bgStyle: "plate",
  glow: "strong",
  frame: "epic",
  filled: true,
};

export const DEFAULT_SET_VISUAL: SkillVisual = UNIFIED_SKILL_VISUAL;
export const DEFAULT_ABILITY_VISUAL: SkillVisual = UNIFIED_SKILL_VISUAL;

export function getSkillVisual(title: string): SkillVisual {
  return { ...UNIFIED_SKILL_VISUAL, icon: pickIconFromPool(title) };
}

export function getAbilityVisual(abilityUnit: string): SkillVisual {
  if (!abilityUnit || abilityUnit === "-") return UNIFIED_SKILL_VISUAL;
  return { ...UNIFIED_SKILL_VISUAL, icon: pickIconFromPool(abilityUnit) };
}

// “업무 느낌 + (가볍게) 게임 감성”을 동시에 만족하는 아이콘 풀에서 결정적 랜덤 선택
const ICON_POOL = [
  // 업무/프로젝트/성과
  "mdi:briefcase-outline",
  "mdi:clipboard-check-outline",
  "mdi:clipboard-text-outline",
  "mdi:checkbox-marked-circle-outline",
  "mdi:flag-checkered",
  "mdi:target-variant",
  "mdi:trophy-outline",
  "mdi:medal-outline",
  "mdi:star-circle-outline",
  "mdi:badge-account-outline",

  // 문서/계약/승인
  "mdi:file-document-outline",
  "mdi:file-check-outline",
  "mdi:file-sign",
  "mdi:pen-plus",
  "mdi:stamp-outline",
  "mdi:shield-check-outline",

  // 분석/전략/탐색
  "mdi:chart-line",
  "mdi:chart-areaspline",
  "mdi:chart-box-outline",
  "mdi:map-outline",
  "mdi:compass-outline",
  "mdi:binoculars",
  "mdi:lightbulb-outline",
  "mdi:brain",

  // 협업/커뮤니케이션/운영
  "mdi:handshake-outline",
  "mdi:account-group-outline",
  "mdi:account-tie-outline",
  "mdi:forum-outline",
  "mdi:calendar-check-outline",
  "mdi:timeline-outline",
] as const;

function hashString(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function pickIconFromPool(seed: string): string {
  const t = (seed ?? "").toString().trim();
  const idx = hashString(t || "default") % ICON_POOL.length;
  return ICON_POOL[idx] ?? "mdi:briefcase-outline";
}
