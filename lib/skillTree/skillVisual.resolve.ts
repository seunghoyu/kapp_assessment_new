import { pickBestRule, normalizeText } from "./skillVisual.matcher";
import { ABILITY_SKILL_RULES, SET_SKILL_RULES } from "./skillVisual.rules";
import type { SkillRule, SkillTheme, SkillVisual } from "./skillVisual.types";

function ruleToVisual(rule: SkillRule): SkillVisual {
  const { keywords: _k, priority: _p, ...visual } = rule;
  return visual;
}

/**
 * UI 요구사항: 스킬트리 색상은 3계열만 사용 (노랑/보라/파랑).
 * rules 쪽에서 다른 theme가 반환돼도 최종 출력은 3계열로 정규화한다.
 */
function toTriTheme(theme: SkillTheme): SkillTheme {
  switch (theme) {
    case "gold":
    case "purple":
    case "blue":
      return theme;
    case "orange":
      return "gold";
    case "green":
    case "cyan":
      return "blue";
    case "red":
    default:
      return "purple";
  }
}

function normalizeTriVisual(v: SkillVisual): SkillVisual {
  return { ...v, theme: toTriTheme(v.theme) };
}

export const DEFAULT_SET_VISUAL: SkillVisual = {
  icon: "mdi:star-four-points",
  category: "strategy",
  theme: "blue",
  bgStyle: "orb",
  glow: "soft",
  frame: "rare",
  filled: true,
};

export const DEFAULT_ABILITY_VISUAL: SkillVisual = {
  icon: "mdi:circle-double",
  category: "learning",
  theme: "purple",
  bgStyle: "plate",
  glow: "soft",
  frame: "common",
  filled: true,
};

export function getSkillVisual(title: string): SkillVisual {
  const t = normalizeText(title);
  if (!t) return normalizeTriVisual(DEFAULT_SET_VISUAL);
  const rule = pickBestRule(t, SET_SKILL_RULES);
  return normalizeTriVisual(rule ? ruleToVisual(rule) : DEFAULT_SET_VISUAL);
}

export function getAbilityVisual(abilityUnit: string): SkillVisual {
  const t = normalizeText(abilityUnit);
  if (!t || t === "-") return normalizeTriVisual(DEFAULT_ABILITY_VISUAL);
  const rule = pickBestRule(t, ABILITY_SKILL_RULES);
  return normalizeTriVisual(rule ? ruleToVisual(rule) : DEFAULT_ABILITY_VISUAL);
}
