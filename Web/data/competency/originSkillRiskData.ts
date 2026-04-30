/**
 * origin admin-high-performer.js skillRiskData 기반
 * 조직 건강도 및 스킬 리스크 관리용
 */

export type RiskLevel = "critical" | "high" | "medium" | "low";

export interface SkillRiskItem {
  id: number;
  department: string;
  skill: string;
  riskLevel: RiskLevel;
  expertCount: number;
  requiredCount: number;
  impactDescription: string;
  recommendation: string;
  estimatedImpact: number;
  probability: string;
}

export const skillRiskData: SkillRiskItem[] = [
  {
    id: 1,
    department: "마케팅팀",
    skill: "데이터 시각화",
    riskLevel: "critical",
    expertCount: 1,
    requiredCount: 3,
    impactDescription:
      "현재 전문가가 1명뿐이며, 이 역량이 결핍될 경우 전체 프로젝트 생산성이 30% 하락할 위험",
    recommendation: "Power BI/Tableau 교육 과정 즉시 배정 (최소 2명)",
    estimatedImpact: 30,
    probability: "high",
  },
  {
    id: 2,
    department: "개발팀",
    skill: "AI/ML",
    riskLevel: "critical",
    expertCount: 2,
    requiredCount: 5,
    impactDescription: "AI 프로젝트가 증가하고 있으나 전문가가 부족하여 프로젝트 지연 발생",
    recommendation: "AI/ML 기초 및 심화 과정 배정 (3명)",
    estimatedImpact: 40,
    probability: "high",
  },
  {
    id: 3,
    department: "영업팀",
    skill: "데이터 분석",
    riskLevel: "high",
    expertCount: 1,
    requiredCount: 4,
    impactDescription: "데이터 기반 영업 전략 수립이 어려워 매출 기회 손실",
    recommendation: "데이터 기반 의사결정 교육 (3명)",
    estimatedImpact: 25,
    probability: "medium",
  },
  {
    id: 4,
    department: "인사팀",
    skill: "HRIS 시스템",
    riskLevel: "high",
    expertCount: 1,
    requiredCount: 2,
    impactDescription: "HR 시스템 관리자가 1명뿐이며, 퇴사 시 운영 중단 위험",
    recommendation: "HRIS 시스템 활용 교육 (1명)",
    estimatedImpact: 35,
    probability: "low",
  },
  {
    id: 5,
    department: "재무팀",
    skill: "ERP 시스템",
    riskLevel: "critical",
    expertCount: 1,
    requiredCount: 3,
    impactDescription: "ERP 전문가 부족으로 업무 효율성 저하 및 오류 발생",
    recommendation: "ERP 시스템 집중 교육 (2명)",
    estimatedImpact: 45,
    probability: "medium",
  },
  {
    id: 6,
    department: "고객지원팀",
    skill: "기술 지원",
    riskLevel: "critical",
    expertCount: 0,
    requiredCount: 3,
    impactDescription: "기술적 문제 해결 능력 부족으로 고객 만족도 하락",
    recommendation: "기술 지원 기초 교육 즉시 시행 (3명)",
    estimatedImpact: 50,
    probability: "high",
  },
  {
    id: 7,
    department: "개발팀",
    skill: "Cloud 인프라",
    riskLevel: "high",
    expertCount: 2,
    requiredCount: 4,
    impactDescription: "클라우드 전환이 진행 중이나 전문가 부족",
    recommendation: "AWS/Azure 교육 (2명)",
    estimatedImpact: 20,
    probability: "medium",
  },
  {
    id: 8,
    department: "마케팅팀",
    skill: "SEO/SEM",
    riskLevel: "medium",
    expertCount: 2,
    requiredCount: 3,
    impactDescription: "검색 엔진 최적화 전문가 부족",
    recommendation: "SEO/SEM 심화 과정 (1명)",
    estimatedImpact: 15,
    probability: "low",
  },
  {
    id: 9,
    department: "영업팀",
    skill: "CRM 시스템",
    riskLevel: "medium",
    expertCount: 3,
    requiredCount: 5,
    impactDescription: "CRM 활용도가 낮아 영업 효율성 저하",
    recommendation: "CRM 활용 실무 교육 (2명)",
    estimatedImpact: 18,
    probability: "low",
  },
  {
    id: 10,
    department: "재무팀",
    skill: "데이터 시각화",
    riskLevel: "medium",
    expertCount: 1,
    requiredCount: 2,
    impactDescription: "재무 보고서 시각화 능력 부족",
    recommendation: "Excel 고급 및 시각화 도구 교육 (1명)",
    estimatedImpact: 12,
    probability: "low",
  },
];

export const riskLevelLabels: Record<RiskLevel, string> = {
  critical: "긴급",
  high: "높음",
  medium: "보통",
  low: "낮음",
};
