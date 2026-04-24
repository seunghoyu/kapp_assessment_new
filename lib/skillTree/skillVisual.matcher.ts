export type ScorableIconRule = {
  keywords: string[];
  priority: number;
  icon: string;
};

export function normalizeText(s: string): string {
  return (s ?? "")
    .toString()
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
}

export function pickBestIconRule(text: string, rules: readonly ScorableIconRule[]): ScorableIconRule | null {
  if (!text) return null;
  let best: ScorableIconRule | null = null;
  let bestScore = -Infinity;

  for (const r of rules) {
    const hits = r.keywords.filter((k) => k && text.includes(k.toLowerCase())).length;
    if (hits <= 0) continue;
    const score = hits * 100 + (r.priority ?? 0);
    if (score > bestScore) {
      bestScore = score;
      best = r;
    }
  }

  return best;
}

