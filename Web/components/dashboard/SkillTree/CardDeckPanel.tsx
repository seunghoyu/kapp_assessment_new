"use client";

import { useEffect, useMemo, useState } from "react";
import { Icon } from "@iconify/react";
import jobFamilyPayload from "@/data/Industry/job_family_payload_v10.json";
import { iconifyForMajorCategoryNum } from "@/lib/jobFamily/iconifyForMajorCategory";
import type { SkillTreeSetRow } from "@/lib/skillTree/types";
import { resolveMajorCategoryFromPayload } from "@/lib/skillTree/resolveMajorCategoryFromPayload";
import CardItem from "./CardItem";

type JobFamilyRow = {
  job_family_id: string;
  major_category_num: number;
  major_category_label: string;
  major_category_icon: string;
  job_family_name_ko: string;
  typical_roles: string[];
};

const PAYLOAD = jobFamilyPayload as JobFamilyRow[];

/** Tailwind purge 대비: 고정 15색 그라데이션 (카드 하단 아이콘 영역 배경) */
const DECK_BOTTOM_GRADIENTS = [
  "bg-gradient-to-br from-rose-500 to-pink-500",
  "bg-gradient-to-br from-orange-500 to-amber-500",
  "bg-gradient-to-br from-amber-500 to-yellow-500",
  "bg-gradient-to-br from-lime-500 to-green-500",
  "bg-gradient-to-br from-emerald-500 to-teal-500",
  "bg-gradient-to-br from-cyan-500 to-sky-500",
  "bg-gradient-to-br from-sky-500 to-blue-500",
  "bg-gradient-to-br from-blue-500 to-indigo-500",
  "bg-gradient-to-br from-indigo-500 to-violet-500",
  "bg-gradient-to-br from-violet-500 to-purple-500",
  "bg-gradient-to-br from-purple-500 to-fuchsia-500",
  "bg-gradient-to-br from-fuchsia-500 to-pink-500",
  "bg-gradient-to-br from-slate-700 to-slate-900",
  "bg-gradient-to-br from-teal-500 to-emerald-500",
  "bg-gradient-to-br from-red-500 to-rose-500",
] as const;

type Props = {
  jobFamilyCode: string | null;
  selectedSet: SkillTreeSetRow | null;
};

export default function CardDeckPanel({ jobFamilyCode, selectedSet }: Props) {
  const majorCategoryLabel = useMemo(
    () => resolveMajorCategoryFromPayload(PAYLOAD, jobFamilyCode, selectedSet),
    [jobFamilyCode, selectedSet]
  );

  const deckRows = useMemo(() => {
    if (!majorCategoryLabel) return [];
    return PAYLOAD.filter((j) => j.major_category_label === majorCategoryLabel)
      .slice()
      .sort((a, b) => a.job_family_name_ko.localeCompare(b.job_family_name_ko, "ko"))
      .slice(0, 15);
  }, [majorCategoryLabel]);

  const [selectedJobFamilyId, setSelectedJobFamilyId] = useState<string | null>(null);
  const [page, setPage] = useState(0);

  useEffect(() => {
    setSelectedJobFamilyId(null);
    setPage(0);
  }, [majorCategoryLabel]);

  const n = deckRows.length;
  const pageSize = 4;
  const totalPages = Math.max(1, Math.ceil(n / pageSize));
  const safePage = Math.min(page, totalPages - 1);
  const pages = useMemo(() => {
    const out: JobFamilyRow[][] = [];
    for (let i = 0; i < deckRows.length; i += pageSize) {
      out.push(deckRows.slice(i, i + pageSize));
    }
    return out.length > 0 ? out : [[]];
  }, [deckRows, pageSize]);

  return (
    <section className="flex min-h-[280px] flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      <div className="flex shrink-0 items-center gap-2 border-b border-gray-100 bg-gray-50/50 px-3 py-2.5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-100 text-sm font-semibold text-violet-700">
          <Icon icon="mdi:view-grid-outline" width={18} height={18} />
        </div>
        <div className="min-w-0">
          <h2 className="text-sm font-semibold text-gray-800">비슷한 분야도 함께 탐색해보세요</h2>
        </div>
      </div>

      <div className="flex min-h-0 flex-1 flex-col px-2 pb-2 pt-2">
        {!majorCategoryLabel && (
          <p className="py-6 text-center text-sm text-gray-500">표시할 대분류를 결정할 수 없습니다.</p>
        )}
        {majorCategoryLabel && n === 0 && (
          <p className="py-6 text-center text-sm text-gray-500">해당 대분류에 직무군 데이터가 없습니다.</p>
        )}

        {n > 0 && (
          <>
            {/* 스크롤 없이 2×2(총 4장)만 노출 */}
            <div className="relative h-[650px] overflow-hidden">
              <div
                className="flex h-full transition-transform duration-300 ease-out"
                style={{ transform: `translateX(-${safePage * 100}%)` }}
              >
                {pages.map((pageItems, pageIndex) => (
                  <div key={`deck-page-${pageIndex}`} className="min-w-full shrink-0">
                    <div className="grid h-full grid-cols-2 grid-rows-2 gap-5">
                      {pageItems.map((row, i) => (
                        <CardItem
                          key={row.job_family_id}
                          title={row.job_family_name_ko}
                          roles={row.typical_roles ?? []}
                          iconifyIcon={iconifyForMajorCategoryNum(row.major_category_num)}
                          bottomColorClass={DECK_BOTTOM_GRADIENTS[i % DECK_BOTTOM_GRADIENTS.length]}
                          onClick={() =>
                            setSelectedJobFamilyId((prev) => (prev === row.job_family_id ? null : row.job_family_id))
                          }
                        />
                      ))}
                      {Array.from({ length: Math.max(0, pageSize - pageItems.length) }).map((_, i) => (
                        <div key={`empty-${pageIndex}-${i}`} className="rounded-xl border border-transparent" />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 페이지네이션 */}
            {n > pageSize && (
              <div className="mt-2 flex items-center justify-between px-1">
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.max(0, p - 1))}
                  disabled={safePage <= 0}
                  className={[
                    "inline-flex items-center gap-1 rounded-lg border px-2 py-1 text-xs font-medium transition",
                    safePage <= 0
                      ? "border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50",
                  ].join(" ")}
                >
                  <Icon icon="mdi:chevron-left" width={16} height={16} />
                  이전
                </button>

                <span className="text-xs text-gray-500">
                  {safePage + 1} / {totalPages}
                </span>

                <button
                  type="button"
                  onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                  disabled={safePage >= totalPages - 1}
                  className={[
                    "inline-flex items-center gap-1 rounded-lg border px-2 py-1 text-xs font-medium transition",
                    safePage >= totalPages - 1
                      ? "border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50",
                  ].join(" ")}
                >
                  다음
                  <Icon icon="mdi:chevron-right" width={16} height={16} />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
