// 임직원 역량 현황 (origin admin.js employeesData + ADMIN_EMPLOYEE_EXPANSION 10명)
export interface Employee {
  id: string;
  name: string;
  department: string;
  position: string;
  score: number;
  strength: string;
  weakness: string;
  education: string;
}

export const employeesData: Employee[] = [
  { id: "1", name: "김철수", department: "개발팀", position: "팀장", score: 82, strength: "기술", weakness: "의사소통", education: "2/3 완료" },
  { id: "2", name: "이영희", department: "마케팅팀", position: "대리", score: 75, strength: "협업", weakness: "문제 해결", education: "1/2 완료" },
  { id: "3", name: "한수진", department: "고객지원팀", position: "주임", score: 57, strength: "의사소통", weakness: "기술", education: "0/4 진행중" },
  { id: "4", name: "박민수", department: "영업팀", position: "과장", score: 88, strength: "의사소통", weakness: "기술", education: "3/3 완료" },
  { id: "5", name: "정지현", department: "개발팀", position: "주임", score: 68, strength: "학습", weakness: "리더십", education: "0/2 진행중" },
  { id: "6", name: "최서연", department: "인사팀", position: "팀장", score: 85, strength: "리더십", weakness: "기술", education: "2/2 완료" },
  { id: "7", name: "강동훈", department: "기획팀", position: "차장", score: 79, strength: "문제 해결", weakness: "협업", education: "1/3 진행중" },
  { id: "8", name: "조민준", department: "재무팀", position: "사원", score: 63, strength: "문제 해결", weakness: "협업", education: "0/3 진행중" },
  { id: "9", name: "윤미래", department: "디자인팀", position: "사원", score: 72, strength: "학습", weakness: "의사소통", education: "2/3 완료" },
  { id: "10", name: "임태양", department: "영업팀", position: "대리", score: 91, strength: "협업", weakness: "학습", education: "4/4 완료" },
];
