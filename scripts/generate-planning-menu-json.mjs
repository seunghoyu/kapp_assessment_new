import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

function node(name, route, depth, children = []) {
  return { 메뉴명: name, 경로: route, depth, children };
}

const STEPS = [
  "시작",
  "정보 입력",
  "지식 문항",
  "적용 문항",
  "성과 문항",
  "디지털 인바스켓",
  "AI 활용 탐색",
  "결과",
];

const JOB_PILLS = [
  "전체",
  "경영/기획",
  "커뮤니케이션",
  "고객서비스",
  "인사/조직",
  "재무/회계",
  "IT/디지털",
  "법무/컴플",
  "프로젝트관리",
  "위기대응",
  "마케팅/영업",
  "생산/운영",
];

const AI_PHASES = ["① 도구 탐색", "② AI 트렌드 이해도", "③ AI 활용도 설문"];

const VIEW_TOGGLES = ["막대 그래프", "테이블 뷰", "레이더 차트"];

function diagnosisChildren() {
  return STEPS.map((title) => {
    if (title === "디지털 인바스켓") {
      return node(
        title,
        "",
        2,
        JOB_PILLS.map((p) => node(p, "", 3, []))
      );
    }
    if (title === "AI 활용 탐색") {
      return node(
        title,
        "",
        2,
        AI_PHASES.map((p) => node(p, "", 3, []))
      );
    }
    return node(title, "", 2, []);
  });
}

const docTop = [
  ["📐 앱 구조 모식도", ""],
  ["⭐ 개발·배포 업데이트 히스토리", ""],
  ["12 AI 역량진단 5레이어 데이터 구조 (요약)", ""],
  ["방향성 대안", ""],
  ["서비스 구조도", "/docs/diagram"],
];

const docLearner = [
  "13 소비자 진입점 재구성 초안",
  "14 마이 대시보드·나의 성장 탭 기획",
  "15 디지털 인바스켓 Next.js 통합 기획·분석",
  "16 디지털 인바스켓 문항 48개 vs 컴포넌트 16개",
  "17 디지털 인바스켓 원본 vs 현재 대조·검수 및 추가 변환 목록",
  "18 디지털 인바스켓 더미데이터 및 로딩 로직",
  "19 디지털 인바스켓 시뮬레이션 가이드",
  "20 디지털 인바스켓 UX 개선 및 결과 매핑 제안",
  "21 디지털 인바스켓 UI·UX 개선방안",
];

const docAdmin = [
  "01 프로젝트 브리프 (제품·기획)",
  "02 프로젝트 브리프 (프론트엔드)",
  "03 프로젝트 브리프 (백엔드)",
  "04 프로젝트 브리프 (마케터)",
  "05 프로젝트 브리프 (데이터 분석가)",
  "06 구현 현황 및 가이드",
  "07 데이터 참조 및 연동",
  "08 임직원 관리 및 KAPP 자가진단",
  "09 역량·리스크 통합 진행방향",
  "KAPP 진단 데이터 안내",
  "KAPP 진단 문항 구성 로직",
  "마이그레이션 계획 (Origin → New)",
  "ROUTE ENTRY REVIEW",
];

const menu = [
  node("마케팅 홈 (랜딩)", "/", 1, [
    node("KAPP 진단 시작하기", "/app/diagnosis", 2, []),
    node("서비스 둘러보기", "/#features", 2, []),
    node("체험하기", "/app/diagnosis", 2, []),
    node("무료로 진단 시작하기", "/app/diagnosis", 2, []),
    node("도입 문의 (1:1 상담)", "/admin", 2, []),
    node("서비스", "", 2, [
      node("KAPP 진단", "/app/diagnosis", 3, []),
      node("대시보드", "/app/dashboard", 3, []),
    ]),
  ]),
  node("회원 로그인·가입", "/login", 1, [
    node("관리자 페이지로 이동 →", "/admin", 2, []),
  ]),
  node("관리자 로그인", "/admin", 1, [
    node("홈으로 돌아가기", "/", 2, []),
  ]),
  node("KAPP 진단", "/app/diagnosis", 1, diagnosisChildren()),
  node("마이 대시보드", "/app/dashboard", 1, [
    node("내 역량", "", 2, [
      node("AI 분석 인사이트", "", 3, []),
      node("KAPP 4차원 역량 점수", "", 3, VIEW_TOGGLES.map((t) => node(t, "", 4, []))),
      node("시장 포지션 분석", "", 3, [
        node("산업군 벤치마크 (상위 10% vs 나)", "", 4, VIEW_TOGGLES.map((t) => node(t, "", 5, []))),
        node("현재 포지션", "", 4, []),
        node("상위권 진입을 위한 추천 액션", "", 4, []),
      ]),
    ]),
    node("성장 로드맵", "", 2, [
      node("커리어 경로 시뮬레이터", "", 3, [
        node("추천 강의 둘러보기", "", 4, []),
        node(
          "추천 강의를 둘러보시겠습니까? 교육 페이지로 이동합니다.",
          "",
          4,
          [
            node("취소", "", 5, []),
            node("강의 둘러보기", "/app/education", 5, []),
          ]
        ),
      ]),
      node("AI 생성 개인 개발 계획 (IDP)", "", 3, []),
    ]),
    node("나의 스킬트리", "", 2, [
      node("나의 스킬트리", "", 3, []),
    ]),
  ]),
  node("교육 큐레이션", "/app/education", 1, []),
  node("조직 관리자", "/dashboard", 1, [
    node("대시보드", "", 2, [
      node("개요", "/dashboard", 3, []),
      node("역량 분석", "/dashboard/competency", 3, [
        node("현황 & 비교", "", 4, [
          node("기간별 추이", "", 5, [
            node("일별", "", 6, []),
            node("월별", "", 6, []),
            node("RawData", "", 6, []),
          ]),
        ]),
        node("전략 & 성과", "", 4, []),
        node("리스크 관리", "", 4, []),
      ]),
    ]),
    node("직원 관리", "/dashboard/employees", 2, []),
    node("분석/리포트", "/dashboard/analytics", 2, []),
    node("교육 프로그램", "/dashboard/programs", 2, []),
    node("헤더 사용자 메뉴", "", 2, [node("Docs", "/docs/index.html", 3, [])]),
    node("우측 패널", "", 2, [
      node("빠른 메뉴", "", 3, []),
      node("빠른 액션", "", 3, [
        node("직원 추가", "", 4, []),
        node("리포트 다운로드", "", 4, []),
      ]),
      node("AI 인사이트", "", 3, [
        node("스킬 갭 감지", "", 4, []),
        node("교육 추천", "", 4, []),
        node("신규 인사이트", "", 4, []),
      ]),
      node("최근 활동", "", 3, []),
      node("패널 접기", "", 3, []),
    ]),
  ]),
  node("진단 리포트 미리보기", "/report/preview", 1, []),
  node("프로젝트 문서", "/docs/index.html", 1, [
    node("문서 목록", "", 2, [
      ...docTop.map(([n, r]) => node(n, r, 3, [])),
      node(
        "학습자 LMS ▾",
        "",
        3,
        docLearner.map((n) => node(n, "", 4, []))
      ),
      node(
        "관리자 LMS ▾",
        "",
        3,
        docAdmin.map((n) => node(n, "", 4, []))
      ),
    ]),
  ]),
];

const outPath = path.join(root, "menu-structure.planning.json");
fs.writeFileSync(outPath, JSON.stringify(menu, null, 2), "utf8");
console.log("Wrote", outPath);
