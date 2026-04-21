import jobIndex from "@/real_data/JF/index.json";
import salMerged from "@/real_data/JF/JF_SAL_01_K.json";
import type { SkillTreeIndex, SkillTreeJobMeta, SkillTreeSetRow } from "./types";

const index = jobIndex as SkillTreeIndex;

type MergedSkillTreePayload = {
  setGroups?: SkillTreeSetRow[];
};

/**
 * `index.json` jobs[].sourceFile 과 동일한 키로 통합 진단 JSON을 등록한다.
 * 세트·능력단위(문항 슬롯)는 해당 파일의 `setGroups` → `questionSlots[].abilityUnit` 에서 온다.
 */
const MERGED_BY_SOURCE_FILE: Record<string, MergedSkillTreePayload> = {
  "JF_SAL_01_K.json": salMerged as MergedSkillTreePayload,
};

export function listSkillTreeJobs(): SkillTreeJobMeta[] {
  return index.jobs ?? [];
}

export function loadSkillTreeSets(jobId: string): SkillTreeSetRow[] {
  const job = (index.jobs ?? []).find((j) => j.jobId === jobId);
  if (!job?.sourceFile) return [];
  const merged = MERGED_BY_SOURCE_FILE[job.sourceFile];
  if (!merged) return [];
  const groups = merged.setGroups ?? [];
  return groups
    .slice()
    .sort((a, b) => (a.setNo ?? 0) - (b.setNo ?? 0));
}
