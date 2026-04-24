import type { SkillTreeSetRow } from "./types";

export type JobFamilyMajorLookupRow = {
  job_family_id: string;
  major_category_label: string;
};

/**
 * 세트에 명시된 major_category_label이 있으면 사용하고,
 * 없으면 jobFamilyCode로 job_family_payload_v10 행을 찾아 major_category_label을 반환한다.
 * (예: JF_SAL_01_K → JF_SAL_01 매칭)
 */
export function resolveMajorCategoryFromPayload(
  payload: readonly JobFamilyMajorLookupRow[],
  jobFamilyCode: string | null | undefined,
  set?: Pick<SkillTreeSetRow, "major_category_label"> | null
): string | null {
  const fromSet = typeof set?.major_category_label === "string" ? set.major_category_label.trim() : "";
  if (fromSet) return fromSet;

  const code = typeof jobFamilyCode === "string" ? jobFamilyCode.trim() : "";
  if (!code) return null;

  const byExact = payload.find((j) => j.job_family_id === code);
  if (byExact) return byExact.major_category_label;

  const stripped = code.replace(/_K$/u, "");
  if (stripped !== code) {
    const byStripped = payload.find((j) => j.job_family_id === stripped);
    if (byStripped) return byStripped.major_category_label;
  }

  return null;
}
