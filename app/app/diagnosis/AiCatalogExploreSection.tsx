import type { ReactNode } from "react";

type Props = {
  title: string;
  description: string;
  children: ReactNode;
  /** 섹션 제목 id (접근성용, 선택) */
  titleId?: string;
};

/**
 * AI 탐색 화면 하단 — 메인 카드 그리드보다 낮은 우선순위의 추가 탐색 영역.
 * 얇은 구분선·옅은 배경·보조 톤 텍스트로 미니멀하게 구분합니다.
 */
export default function AiCatalogExploreSection({ title, description, children, titleId }: Props) {
  const headingId = titleId ?? "ai-catalog-explore-more-heading";
  return (
    <section
      className="mt-8 border-t border-[#E5E7EB] bg-[#FAFAFA] px-4 py-6 sm:px-5 sm:py-8"
      aria-labelledby={headingId}
    >
      <div className="space-y-5">
        <header className="space-y-1.5">
          <h3 id={headingId} className="text-base font-semibold text-gray-600 tracking-tight">
            {title}
          </h3>
          <p className="text-sm text-gray-500 leading-relaxed whitespace-pre-line">{description}</p>
        </header>
        {children}
      </div>
    </section>
  );
}
