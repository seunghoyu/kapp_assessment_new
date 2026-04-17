type IconRule = {
  keywords: string[];
  icon: string; // Iconify icon id, e.g. "mdi:handshake"
};

const SET_RULES: IconRule[] = [
  { keywords: ["환경", "분석", "리서치"], icon: "mdi:magnify-scan" },
  { keywords: ["전략", "기획", "계획"], icon: "mdi:map-outline" },
  { keywords: ["고객", "발굴", "접근"], icon: "mdi:account-search-outline" },
  { keywords: ["상담", "커뮤니케이션", "관계"], icon: "mdi:forum-outline" },
  { keywords: ["제안", "솔루션", "설계"], icon: "mdi:lightbulb-outline" },
  { keywords: ["협상", "조율"], icon: "mdi:handshake-outline" },
  { keywords: ["계약", "체결", "약정"], icon: "mdi:file-sign" },
  { keywords: ["이행", "사후", "관리", "유지"], icon: "mdi:clipboard-check-outline" },
  { keywords: ["성과", "KPI", "목표"], icon: "mdi:target-arrow" },
  { keywords: ["리스크", "이슈"], icon: "mdi:alert-outline" },
  { keywords: ["가격", "견적", "수익", "매출"], icon: "mdi:currency-krw" },
];

const FALLBACK_ICON = "mdi:star-four-points-outline";
const FALLBACK_ABILITY_ICON = "mdi:circle-double";

export function getSkillTreeIconId(title: string): string {
  const t = (title ?? "").replace(/\s+/g, " ").trim();
  if (!t) return FALLBACK_ICON;

  for (const rule of SET_RULES) {
    // any keyword match -> rule applies
    if (rule.keywords.some((k) => t.includes(k))) return rule.icon;
  }

  return FALLBACK_ICON;
}

const ABILITY_RULES: IconRule[] = [
  { keywords: ["환경", "시장", "경쟁", "리서치", "분석", "조사"], icon: "mdi:chart-line" },
  { keywords: ["전략", "기획", "계획", "로드맵"], icon: "mdi:map-marker-path" },
  { keywords: ["발굴", "리드", "잠재", "탐색"], icon: "mdi:account-search-outline" },
  { keywords: ["접근", "미팅", "컨택"], icon: "mdi:account-arrow-right-outline" },
  { keywords: ["상담", "커뮤니케이션", "관계", "응대"], icon: "mdi:forum-outline" },
  { keywords: ["니즈", "요구", "진단"], icon: "mdi:clipboard-search-outline" },
  { keywords: ["제안", "솔루션", "설계"], icon: "mdi:lightbulb-outline" },
  { keywords: ["협상", "조율"], icon: "mdi:handshake-outline" },
  { keywords: ["계약", "체결", "약정"], icon: "mdi:file-sign" },
  { keywords: ["이행", "사후", "유지", "관리"], icon: "mdi:clipboard-check-outline" },
  { keywords: ["고객", "서비스"], icon: "mdi:account-heart-outline" },
  { keywords: ["가격", "견적", "정산", "수익", "매출"], icon: "mdi:currency-krw" },
  { keywords: ["지식", "O*NET", "학습"], icon: "mdi:book-open-page-variant-outline" },
];

export function getAbilityUnitIconId(abilityUnit: string): string {
  const t = (abilityUnit ?? "").replace(/\s+/g, " ").trim();
  if (!t || t === "-") return FALLBACK_ABILITY_ICON;

  for (const rule of ABILITY_RULES) {
    if (rule.keywords.some((k) => t.includes(k))) return rule.icon;
  }
  return FALLBACK_ABILITY_ICON;
}

