"use client";

import { useEffect, useMemo, useState } from "react";
import type { SkillTreeSetRow } from "@/lib/skillTree/types";
import CardDeckPanel from "./CardDeckPanel";
import SkillTreePanel, { getDefaultSelectedSetNo } from "./SkillTreePanel";

type Props = {
  sets: SkillTreeSetRow[];
  jobFamilyCode: string | null;
  unlockedCount: number;
};

export default function SkillTreeTabSplit({ sets, jobFamilyCode, unlockedCount }: Props) {
  const [selectedSetNo, setSelectedSetNo] = useState<number>(() => getDefaultSelectedSetNo(sets, unlockedCount));

  useEffect(() => {
    if (sets.length === 0) return;
    const exists = sets.some((s) => Number(s.setNo ?? 0) === selectedSetNo);
    if (!exists) setSelectedSetNo(getDefaultSelectedSetNo(sets, unlockedCount));
  }, [sets, unlockedCount, selectedSetNo]);

  const selectedSet = useMemo(
    () => sets.find((s) => Number(s.setNo ?? 0) === selectedSetNo) ?? null,
    [sets, selectedSetNo]
  );

  return (
    <div className="grid grid-cols-1 items-stretch gap-4 lg:grid-cols-2">
      <SkillTreePanel
        sets={sets}
        unlockedCount={unlockedCount}
        selectedSetNo={selectedSetNo}
        onSelectSet={setSelectedSetNo}
      />
      <CardDeckPanel jobFamilyCode={jobFamilyCode} selectedSet={selectedSet} />
    </div>
  );
}
