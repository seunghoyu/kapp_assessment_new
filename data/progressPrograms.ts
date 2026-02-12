// 역량 개발 진행 현황 (origin admin.html + ADMIN_PROGRESS_FILTER_V5.4.5)
export type ProgressStatus = "ongoing" | "completed";

export interface ProgressProgram {
  id: string;
  name: string;
  status: ProgressStatus;
  participantLabel: string; // "42명 참여 중" | "25명 완료"
  progressPercent: number;
  averageScore: number;
  goalLabel: string; // "목표: 80점" | "목표 달성! 🎉"
}

export const progressPrograms: ProgressProgram[] = [
  { id: "1", name: "문제 해결 역량", status: "ongoing", participantLabel: "42명 참여 중", progressPercent: 65, averageScore: 65, goalLabel: "목표: 80점" },
  { id: "2", name: "의사소통 역량", status: "ongoing", participantLabel: "38명 참여 중", progressPercent: 72, averageScore: 72, goalLabel: "목표: 85점" },
  { id: "3", name: "리더십 역량", status: "completed", participantLabel: "25명 완료", progressPercent: 100, averageScore: 88, goalLabel: "목표 달성! 🎉" },
  { id: "4", name: "기술 역량", status: "ongoing", participantLabel: "35명 참여 중", progressPercent: 58, averageScore: 58, goalLabel: "목표: 75점" },
  { id: "5", name: "협업 역량", status: "completed", participantLabel: "48명 완료", progressPercent: 100, averageScore: 85, goalLabel: "목표 달성! 🎉" },
  { id: "6", name: "학습 역량", status: "ongoing", participantLabel: "31명 참여 중", progressPercent: 68, averageScore: 68, goalLabel: "목표: 80점" },
];
