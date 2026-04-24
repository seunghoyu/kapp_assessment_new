export type SkillTreeJobMeta = {
  jobId: string;
  jobName: string;
  sourceFile: string;
};

export type SkillTreeIndex = {
  version: number;
  jobs: SkillTreeJobMeta[];
};

/** 한 세트 내 4문항 슬롯 메타 (구 setgroup의 문항1~4 능력단위/세분류/수준) */
export type SkillTreeQuestionSlotMeta = {
  slot: number;
  abilityUnit: string;
  subCategory: string;
  level: string;
};

export type SkillTreeSetRow = {
  setNo: number;
  industryClass: string;
  setName: string;
  questionSlots: SkillTreeQuestionSlotMeta[];
  /** 있으면 카드덱 필터에 우선 사용 (없으면 jobFamilyCode로 패밀리 JSON에서 유추) */
  major_category_label?: string;
};

