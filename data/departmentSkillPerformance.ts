export type DepartmentSkillValue = {
  department: string;
  value: number;
};

export type DepartmentSkillRecord = {
  year: number;
  month: number; // 1 ~ 12
  data: DepartmentSkillValue[];
};

export const departmentSkillPerformanceData: DepartmentSkillRecord[] = [
  {
    year: 2024,
    month: 1,
    data: [
      { department: "개발팀", value: 72 },
      { department: "마케팅팀", value: 65 },
      { department: "영업팀", value: 80 },
      { department: "인사팀", value: 70 },
      { department: "재무팀", value: 68 },
    ],
  },
  {
    year: 2024,
    month: 2,
    data: [
      { department: "개발팀", value: 75 },
      { department: "마케팅팀", value: 68 },
      { department: "영업팀", value: 82 },
      { department: "인사팀", value: 71 },
      { department: "재무팀", value: 70 },
    ],
  },
  {
    year: 2024,
    month: 3,
    data: [
      { department: "개발팀", value: 76 },
      { department: "마케팅팀", value: 69 },
      { department: "영업팀", value: 83 },
      { department: "인사팀", value: 72 },
      { department: "재무팀", value: 71 },
    ],
  },
  {
    year: 2025,
    month: 1,
    data: [
      { department: "개발팀", value: 78 },
      { department: "마케팅팀", value: 70 },
      { department: "영업팀", value: 85 },
      { department: "인사팀", value: 73 },
      { department: "재무팀", value: 72 },
    ],
  },
  {
    year: 2025,
    month: 2,
    data: [
      { department: "개발팀", value: 79 },
      { department: "마케팅팀", value: 71 },
      { department: "영업팀", value: 86 },
      { department: "인사팀", value: 74 },
      { department: "재무팀", value: 73 },
    ],
  },
  {
    year: 2025,
    month: 3,
    data: [
      { department: "개발팀", value: 80 },
      { department: "마케팅팀", value: 72 },
      { department: "영업팀", value: 87 },
      { department: "인사팀", value: 75 },
      { department: "재무팀", value: 74 },
    ],
  },
  {
    year: 2026,
    month: 1,
    data: [
      { department: "개발팀", value: 82 },
      { department: "마케팅팀", value: 74 },
      { department: "영업팀", value: 89 },
      { department: "인사팀", value: 77 },
      { department: "재무팀", value: 76 },
    ],
  },
];
