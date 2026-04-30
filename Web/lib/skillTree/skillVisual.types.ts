export type SkillCategory =
  | "analysis"
  | "strategy"
  | "relationship"
  | "execution"
  | "performance"
  | "risk"
  | "finance"
  | "learning";

export type SkillTheme = "blue" | "purple" | "green" | "orange" | "gold" | "red" | "cyan";

export type BgStyle = "orb" | "plate" | "rune";

export type GlowLevel = "soft" | "medium" | "strong";

export type FrameRarity = "common" | "rare" | "epic";

export type SkillState = "locked" | "available" | "active" | "mastered";

export type SkillVisual = {
  icon: string;
  category: SkillCategory;
  theme: SkillTheme;
  bgStyle: BgStyle;
  glow: GlowLevel;
  frame: FrameRarity;
  filled: boolean;
};

export type SkillRule = SkillVisual & {
  keywords: string[];
  priority: number;
};
