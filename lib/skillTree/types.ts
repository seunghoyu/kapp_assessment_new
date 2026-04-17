export type SkillTreeJobMeta = {
  jobId: string;
  jobName: string;
  sourceFile: string;
};

export type SkillTreeIndex = {
  version: number;
  jobs: SkillTreeJobMeta[];
};

export type SkillTreeSetRow = {
  세트번호: number;
  산업분류: string;
  세트명: string;
  "문항1 능력단위"?: string | null;
  문항1세분류?: string | null;
  문항1수준?: string | null;
  "문항2 능력단위"?: string | null;
  문항2세분류?: string | null;
  문항2수준?: string | null;
  "문항3 능력단위"?: string | null;
  문항3세분류?: string | null;
  문항3수준?: string | null;
  "문항4 능력단위"?: string | null;
  문항4세분류?: string | null;
  문항4수준?: string | null;
};

