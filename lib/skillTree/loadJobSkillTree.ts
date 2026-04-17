import jobIndex from "@/real_data/JF/index.json";
import salB2bSets from "@/real_data/JF/JF_SAL_01_K.json";
import type { SkillTreeIndex, SkillTreeJobMeta, SkillTreeSetRow } from "./types";

const index = jobIndex as SkillTreeIndex;

export function listSkillTreeJobs(): SkillTreeJobMeta[] {
  return index.jobs ?? [];
}

export function loadSkillTreeSets(jobId: string): SkillTreeSetRow[] {
  switch (jobId) {
    case "sal_b2b":
      return (salB2bSets as SkillTreeSetRow[])
        .slice()
        .sort((a, b) => (a.세트번호 ?? 0) - (b.세트번호 ?? 0));
    default:
      return [];
  }
}

