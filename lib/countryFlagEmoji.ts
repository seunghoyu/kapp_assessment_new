/**
 * ISO 3166-1 alpha-2 → 리전 인디케이터 이모지(🇺🇸 등). Twemoji와 함께 사용.
 * 잘못된 코드는 글로벌 기호로 폴백.
 */
export function countryCodeToFlagEmoji(code: string): string {
  const c = code.trim().toUpperCase();
  if (c.length !== 2 || !/^[A-Z]{2}$/.test(c)) return "🌐";
  const base = 0x1f1e6;
  const cp = (ch: string) => base + (ch.charCodeAt(0) - 65);
  return String.fromCodePoint(cp(c[0]), cp(c[1]));
}
