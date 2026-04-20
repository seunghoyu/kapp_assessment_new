import { pickBestRule, normalizeText } from "./skillVisual.matcher";
import { ABILITY_SKILL_RULES, SET_SKILL_RULES } from "./skillVisual.rules";
import type { SkillRule, SkillVisual } from "./skillVisual.types";

function ruleToVisual(rule: SkillRule): SkillVisual {
  const { keywords: _k, priority: _p, ...visual } = rule;
  return visual;
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
  if (!t) return DEFAULT_SET_VISUAL;
  const rule = pickBestRule(t, SET_SKILL_RULES);
  return rule ? ruleToVisual(rule) : DEFAULT_SET_VISUAL;
}

export function getAbilityVisual(abilityUnit: string): SkillVisual {
  const t = normalizeText(abilityUnit);
  if (!t || t === "-") return DEFAULT_ABILITY_VISUAL;
  const rule = pickBestRule(t, ABILITY_SKILL_RULES);
  return rule ? ruleToVisual(rule) : DEFAULT_ABILITY_VISUAL;
}
