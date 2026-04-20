export function normalizeText(s: string): string {
  return (s ?? "").replace(/\s+/g, " ").trim();
}

export function keywordScore(text: string, keywords: readonly string[]): number {
  let n = 0;
  for (const k of keywords) {
    if (k && text.includes(k)) n += 1;
  }
  return n;
}

type ScorableRule = { keywords: string[]; priority: number };

/**
 * Highest keyword hit count wins. Tie-break: higher priority, then more keywords in rule, then earlier rule in array.
 */
export function pickBestRule<T extends ScorableRule>(text: string, rules: readonly T[]): T | null {
  let best: T | null = null;
  let bestKey: [number, number, number, number] | null = null;

  for (let i = 0; i < rules.length; i++) {
    const r = rules[i];
    const score = keywordScore(text, r.keywords);
    if (score <= 0) continue;

    const key: [number, number, number, number] = [score, r.priority, r.keywords.length, -i];
    if (
      !bestKey ||
      key[0] > bestKey[0] ||
      (key[0] === bestKey[0] &&
        (key[1] > bestKey[1] ||
          (key[1] === bestKey[1] &&
            (key[2] > bestKey[2] || (key[2] === bestKey[2] && key[3] > bestKey[3])))))
    ) {
      best = r;
      bestKey = key;
    }
  }

  return best;
}
