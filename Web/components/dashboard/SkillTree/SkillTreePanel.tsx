"use client";

import { useEffect, useMemo, useState } from "react";
import type { SkillTreeSetRow } from "@/lib/skillTree/types";
import SkillTreeNode from "./SkillTreeNode";
import { getAbilityVisual, getSkillVisual } from "@/lib/skillTree/skillVisual.resolve";
import type { SkillState } from "@/lib/skillTree/skillVisual.types";
import { Icon } from "@iconify/react";

type Props = {
  sets: SkillTreeSetRow[];
  unlockedCount: number;
  selectedSetNo: number;
  onSelectSet: (setNo: number) => void;
};

function skillStateForSet(setNo: number, unlockedCount: number, totalSets: number): SkillState {
  const lockedCount = 5;
  const lockedFrom = Math.max(1, totalSets - lockedCount + 1);
  if (setNo >= lockedFrom) return "locked";

  // 상태 단순화: unlocked 영역은 모두 active로 표시
  return "active";
}

export function getDefaultSelectedSetNo(sets: SkillTreeSetRow[], unlockedCount: number): number {
  const totalSets = sets.length;
  if (totalSets === 0) return 0;

  for (const s of sets) {
    const setNo = Number(s.setNo ?? 0);
    if (skillStateForSet(setNo, unlockedCount, totalSets) !== "locked") return setNo;
  }
  return Number(sets[0]?.setNo ?? 1);
}

export default function SkillTreePanel({ sets, unlockedCount, selectedSetNo, onSelectSet }: Props) {
  const totalSets = sets.length;
  const lockedCount = 5;
  const effectiveUnlocked = Math.max(0, totalSets - lockedCount);

  const pageSize = 12; // 2열 기준 6행 = 12개
  const [page, setPage] = useState(0);
  const totalPages = Math.max(1, Math.ceil(sets.length / pageSize));
  const safePage = Math.min(page, totalPages - 1);

  const pages = useMemo(() => {
    const out: SkillTreeSetRow[][] = [];
    for (let i = 0; i < sets.length; i += pageSize) {
      out.push(sets.slice(i, i + pageSize));
    }
    return out.length > 0 ? out : [[]];
  }, [sets, pageSize]);

  /** 세트 목록 내용 식별(의존성 배열에 배열 전개 없이 고정 길이 유지) */
  const setsKey = useMemo(
    () => sets.map((s) => Number(s.setNo ?? 0)).join(","),
    [sets]
  );

  // 선택 변경 또는 세트 데이터 변경 시에만: 선택된 setNo가 있는 페이지로 이동 (페이지 버튼만 누른 경우에는 deps가 안 바뀌어 실행 안 함)
  useEffect(() => {
    if (sets.length === 0 || selectedSetNo <= 0) return;
    const idx = sets.findIndex((s) => Number(s.setNo ?? 0) === selectedSetNo);
    if (idx < 0) return;
    const targetPage = Math.floor(idx / pageSize);
    setPage((p) => (p === targetPage ? p : targetPage));
  }, [setsKey, sets, selectedSetNo, pageSize]);

  return (
    <section className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm h-full min-h-0 flex flex-col">
      <div className="flex items-center gap-2 border-b border-gray-100 bg-gray-50/50 px-3 py-2.5 shrink-0">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-sm font-semibold text-blue-700">
          <Icon icon="mdi:sitemap-outline" width={18} height={18} />
        </div>
        <div className="min-w-0">
          <h2 className="text-sm font-semibold text-gray-800">나의 스킬트리</h2>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <span className="rounded-full border border-gray-200 bg-gray-100 px-2 py-1 text-xs text-gray-600">
            진행: {Math.min(Math.max(unlockedCount, effectiveUnlocked), totalSets)}/{totalSets}
          </span>
        </div>
      </div>

      <div className="p-2 flex-1 min-h-0 flex flex-col">
        {/* 스크롤 없이 2×6(총 12개)만 노출 + 페이지 전환은 슬라이드 */}
        <div className="relative h-[620px] overflow-hidden">
          <div
            className="flex h-full transition-transform duration-300 ease-out"
            style={{ transform: `translateX(-${safePage * 100}%)` }}
          >
            {pages.map((pageItems, pageIndex) => (
              <div key={`skill-page-${pageIndex}`} className="min-w-full shrink-0 px-0">
                <div className="grid h-full grid-cols-2 grid-rows-6 gap-5">
                  {pageItems.map((s) => {
                    const setNo = Number(s.setNo ?? 0);
                    const skillState = skillStateForSet(setNo, unlockedCount, totalSets);
                    const sanitize = (text: string) =>
                      text
                        .replace(/O\*NET/g, "")
                        .replace(/\s+/g, " ")
                        .replace(/[·•\-–—]+/g, " ")
                        .trim();

                    const setTitleRaw = typeof s.setName === "string" ? s.setName : `세트 ${setNo}`;
                    const setTitle = sanitize(setTitleRaw) || setTitleRaw;
                    const abilityLabels = (s.questionSlots ?? [])
                      .map((slot) => (typeof slot.abilityUnit === "string" ? slot.abilityUnit.trim() : ""))
                      .filter((v) => v && v !== "-" && !/O\*NET/i.test(v))
                      .map(sanitize)
                      .filter((v) => v);

                    const abilityUnits = abilityLabels.map((label) => ({
                      label,
                      visual: getAbilityVisual(label),
                    }));

                    const unlocked = skillState !== "locked";
                    return (
                      <button
                        key={setNo}
                        type="button"
                        disabled={!unlocked}
                        onClick={() => {
                          if (!unlocked) return;
                          onSelectSet(setNo);
                        }}
                        className={[
                          "relative min-h-[76px] rounded-xl border px-3 py-2.5 text-left transition w-full",
                          unlocked
                            ? "border-gray-200 bg-white hover:border-blue-200 hover:bg-blue-50/30"
                            : "border-gray-200 bg-gray-50/40 cursor-not-allowed opacity-80",
                        ].join(" ")}
                      >
                        <SkillTreeNode
                          title={setTitle}
                          skillState={skillState}
                          visual={getSkillVisual(setTitle)}
                          abilityUnits={abilityUnits}
                        />
                      </button>
                    );
                  })}
                  {Array.from({ length: Math.max(0, pageSize - pageItems.length) }).map((_, i) => (
                    <div key={`empty-${pageIndex}-${i}`} className="rounded-xl border border-transparent" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 페이지네이션 */}
        {sets.length > pageSize && (
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
      </div>
    </section>
  );
}
