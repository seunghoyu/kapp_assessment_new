"use client";

import { useEffect, useState } from "react";
import type { SkillTreeSetRow } from "@/lib/skillTree/types";
import SkillTreePanel, { getDefaultSelectedSetNo } from "./SkillTreePanel";

type Props = {
  sets: SkillTreeSetRow[];
  unlockedCount: number;
};

/** 단일 패널만 필요한 화면용(선택 상태는 내부 관리). 대시보드 스킬트리 탭은 `SkillTreeTabSplit` 사용. */
export default function SkillTree({ sets, unlockedCount }: Props) {
  const [selectedSetNo, setSelectedSetNo] = useState<number>(() => getDefaultSelectedSetNo(sets, unlockedCount));

  useEffect(() => {
    if (sets.length === 0) return;
    const exists = sets.some((s) => Number(s.setNo ?? 0) === selectedSetNo);
    if (!exists) setSelectedSetNo(getDefaultSelectedSetNo(sets, unlockedCount));
  }, [sets, unlockedCount, selectedSetNo]);

  return (
    <SkillTreePanel
      sets={sets}
      unlockedCount={unlockedCount}
      selectedSetNo={selectedSetNo}
      onSelectSet={setSelectedSetNo}
    />
  );
}
