"use client";

type Props = {
  text: string;
  keyword: string;
  className?: string;
  highlightClassName?: string;
};

export default function HighlightedText({
  text,
  keyword,
  className = "",
  highlightClassName = "text-blue-600 font-semibold",
}: Props) {
  const q = keyword.trim();
  if (!q) return <span className={className}>{text}</span>;

  const lower = text.toLowerCase();
  const qLower = q.toLowerCase();

  const parts: Array<{ t: string; h: boolean }> = [];
  let i = 0;
  while (true) {
    const idx = lower.indexOf(qLower, i);
    if (idx === -1) break;
    if (idx > i) parts.push({ t: text.slice(i, idx), h: false });
    parts.push({ t: text.slice(idx, idx + q.length), h: true });
    i = idx + q.length;
  }
  if (i < text.length) parts.push({ t: text.slice(i), h: false });

  return (
    <span className={className}>
      {parts.map((p, idx) =>
        p.h ? (
          <span key={idx} className={highlightClassName}>
            {p.t}
          </span>
        ) : (
          <span key={idx}>{p.t}</span>
        )
      )}
    </span>
  );
}

