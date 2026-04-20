"use client";

import type { SkillTreeSetRow } from "@/lib/skillTree/types";
import SkillTreeNode from "./SkillTreeNode";
import { getAbilityVisual, getSkillVisual } from "@/lib/skillTree/skillVisual.resolve";
import type { SkillState } from "@/lib/skillTree/skillVisual.types";
import { Icon } from "@iconify/react";

type Props = {
  sets: SkillTreeSetRow[];
  unlockedCount: number;
};

function skillStateForSet(setNo: number, unlockedCount: number, totalSets: number): SkillState {
  // 요구사항: 잠금은 5개만 남기고 나머지는 오픈
  const lockedCount = 5;
  const lockedFrom = Math.max(1, totalSets - lockedCount + 1); // e.g. total=20 -> 16~20 locked
  if (setNo >= lockedFrom) return "locked";

  // 남은 구간은 기존 진행도를 최대한 살려 상태를 나눔
  if (unlockedCount > 0 && setNo < unlockedCount) return "mastered";
  if (unlockedCount > 0 && setNo === unlockedCount) return "active";
  return "available";
}

export default function SkillTree({ sets, unlockedCount }: Props) {
  const totalSets = sets.length;
  const lockedCount = 5;
  const effectiveUnlocked = Math.max(0, totalSets - lockedCount);
  return (
    <section className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      <div className="flex items-center gap-2 border-b border-gray-100 bg-gray-50/50 px-4 py-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-sm font-semibold text-blue-700">
          <Icon icon="mdi:sitemap-outline" width={18} height={18} />
        </div>
        <div className="min-w-0">
          <h2 className="text-sm font-semibold text-gray-800">나의 스킬트리</h2>
          <p className="mt-0.5 text-xs text-gray-500">세트 순서대로 스킬을 확장해 나가세요.</p>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <span className="rounded-full border border-gray-200 bg-gray-100 px-2 py-1 text-xs text-gray-600">
            진행: {Math.min(Math.max(unlockedCount, effectiveUnlocked), totalSets)}/{totalSets}
          </span>
        </div>
      </div>

      <div className="p-4">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
          {sets.map((s) => {
            const setNo = Number(s.세트번호 ?? 0);
            const skillState = skillStateForSet(setNo, unlockedCount, totalSets);
            const sanitize = (text: string) =>
              text
                .replace(/O\*NET/g, "")
                .replace(/\s+/g, " ")
                .replace(/[·•\-–—]+/g, " ")
                .trim();

            const setTitleRaw = typeof s.세트명 === "string" ? s.세트명 : `세트 ${setNo}`;
            const setTitle = sanitize(setTitleRaw) || setTitleRaw;
            const abilityLabels = [
              s["문항1 능력단위"],
              s["문항2 능력단위"],
              s["문항3 능력단위"],
              s["문항4 능력단위"],
            ]
              .map((v) => (typeof v === "string" ? v.trim() : ""))
              .filter((v) => v && v !== "-" && !/O\*NET/i.test(v))
              .map(sanitize)
              .filter((v) => v);

            const abilityUnits = abilityLabels.map((label) => ({
              label,
              visual: getAbilityVisual(label),
            }));

            const unlocked = skillState !== "locked";

            return (
              <div
                key={setNo}
                className={[
                  "min-h-[90px] rounded-xl border px-4 py-3",
                  unlocked ? "border-gray-200 bg-white" : "border-gray-200 bg-gray-50/40",
                ].join(" ")}
              >
                <SkillTreeNode
                  title={setTitle}
                  skillState={skillState}
                  visual={getSkillVisual(setTitle)}
                  abilityUnits={abilityUnits}
                />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
