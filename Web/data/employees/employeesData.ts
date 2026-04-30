/**
 * 직원 관리 — KAPP 진단 전 입력하는 기본정보만 (KAPP_DIAGNOSIS_DATA_REFERENCE.md 기준)
 * data/employees/employeesData.json 기반
 */

import raw from "./employeesData.json";

export interface EmployeeBasicInfoRow {
  id: string;
  name: string;
  email?: string;
  industry: string;
  job: string;
  positionLevel: string;
  experienceYears: string;
  companyName?: string;
  companySize: string;
  goals?: string[];
}

const rows = (raw as { rows: EmployeeBasicInfoRow[] }).rows;

export const employeesData = {
  tableMeta: {
    columns: [
      "이름",
      "이메일",
      "산업군",
      "세부 직무",
      "직급",
      "연차",
      "회사명",
      "기업 규모",
      "진단 목표",
      "액션",
    ],
  },
  rows,
};

export type { EmployeeBasicInfoRow as EmployeeRow };
