import jobIndex from "@/real_data/JF/index.json";
import salMerged from "@/real_data/JF/JF_SAL_01_K.json";
import type { SkillTreeIndex, SkillTreeJobMeta, SkillTreeSetRow } from "./types";

const index = jobIndex as SkillTreeIndex;

type MergedSkillTreePayload = {
  jobFamilyCode?: string;
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

function loadMergedForJob(jobId: string): { merged: MergedSkillTreePayload; sets: SkillTreeSetRow[] } | null {
  const job = (index.jobs ?? []).find((j) => j.jobId === jobId);
  if (!job?.sourceFile) return null;
  const merged = MERGED_BY_SOURCE_FILE[job.sourceFile];
  if (!merged) return null;
  const groups = merged.setGroups ?? [];
  const sets = groups.slice().sort((a, b) => (a.setNo ?? 0) - (b.setNo ?? 0));
  return { merged, sets };
}

export function loadSkillTreeSets(jobId: string): SkillTreeSetRow[] {
  return loadMergedForJob(jobId)?.sets ?? [];
}

/** 세트와 루트 jobFamilyCode(예: JF_SAL_01_K)를 함께 반환 — 카드덱 필터 등에 사용 */
export function loadSkillTreeWithMeta(jobId: string): {
  sets: SkillTreeSetRow[];
  jobFamilyCode: string | null;
} {
  const row = loadMergedForJob(jobId);
  if (!row) return { sets: [], jobFamilyCode: null };
  const code = row.merged.jobFamilyCode;
  return {
    sets: row.sets,
    jobFamilyCode: typeof code === "string" && code.trim() ? code.trim() : null,
  };
}
