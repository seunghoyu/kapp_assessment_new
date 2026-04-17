"use client";

import type { SkillTreeSetRow } from "@/lib/skillTree/types";
import SkillTreeNode from "./SkillTreeNode";
import { getAbilityUnitIconId, getSkillTreeIconId } from "@/lib/skillTree/iconMap";
import { Icon } from "@iconify/react";

type Props = {
  sets: SkillTreeSetRow[];
  unlockedCount: number;
};

export default function SkillTree({ sets, unlockedCount }: Props) {
  return (
    <section className="rounded-xl bg-white border border-gray-200 shadow-sm overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-100 bg-gray-50/50 flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center text-sm font-semibold">
          <Icon icon="mdi:sitemap-outline" width={18} height={18} />
        </div>
        <div className="min-w-0">
          <h2 className="text-sm font-semibold text-gray-800">나의 스킬트리</h2>
          <p className="text-xs text-gray-500 mt-0.5">세트 순서대로 스킬을 확장해 나가세요.</p>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600 border border-gray-200">
            진행: {Math.min(unlockedCount, sets.length)}/{sets.length}
          </span>
        </div>
      </div>

      <div className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
          {sets.map((s) => {
            const setNo = Number(s.세트번호 ?? 0);
            const active = setNo <= unlockedCount;
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
              iconId: getAbilityUnitIconId(label),
            }));

            return (
              <div
                key={setNo}
                className={[
                  "rounded-xl border bg-white px-4 py-3 min-h-[90px]",
                  active ? "border-gray-200" : "border-gray-200 bg-gray-50/40",
                ].join(" ")}
              >
                <SkillTreeNode
                  title={setTitle}
                  active={active}
                  iconId={getSkillTreeIconId(setTitle)}
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

