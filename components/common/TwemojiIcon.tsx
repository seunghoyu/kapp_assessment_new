"use client";

import { useState, useEffect } from "react";

type Props = {
  /** 이모지 문자(예: 📊) */
  icon: string;
  /** 루트에 부여할 className */
  className?: string;
  /** 크기 (img에 적용되는 width/height 스타일, 예: "1.5rem") */
  size?: string;
};

/**
 * SSR/하이드레이션 미스매치 방지를 위해 클라이언트에서만 twemoji로 파싱해 렌더링합니다.
 * 서버에서는 빈 span을 렌더하고, 마운트 후 useEffect에서 twemoji.parse 결과를 넣습니다.
 */
export default function TwemojiIcon({ icon, className = "", size = "1.5rem" }: Props) {
  const [parsed, setParsed] = useState<string | null>(null);

  useEffect(() => {
    if (!icon || typeof window === "undefined") return;
    try {
      const twemoji = require("twemoji").default;
      const html = twemoji.parse(icon, {
        folder: "svg",
        ext: ".svg",
        className: "twemoji-icon-inline",
        attributes: () => ({ style: `width:${size};height:${size};vertical-align:middle` }),
      });
      setParsed(html);
    } catch {
      setParsed(null);
    }
  }, [icon, size]);

  if (parsed) {
    return (
      <span
        className={className}
        style={{ display: "inline-flex", alignItems: "center", justifyContent: "center" }}
        dangerouslySetInnerHTML={{ __html: parsed }}
      />
    );
  }

  return <span className={className} style={{ width: size, height: size }} aria-hidden />;
}
