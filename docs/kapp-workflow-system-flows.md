# KAPP 사용자 흐름 및 시스템 워크플로우 문서

## 문서 목적 / 분석 범위
이 문서는 `Next.js (App Router) + TypeScript + React` 코드베이스에서 “전체 사용자 흐름 + 시스템 워크플로우”를 개발/기획 관점에서 구조적으로 이해할 수 있도록 정리합니다.

### 분석 범위
- `app/**` : 페이지/레이아웃
- `components/**` : 주요 레이아웃/컴포넌트
- `lib/**` : 비즈니스 로직/유틸
- `data/**` : 정적 데이터(모크 데이터)
- `app/**/api` : API 라우트

### 주의(추정 표기 규칙)
- 코드로 확인되지 않는 연결(예: 진단 answers가 점수/리포트 계산에 실제 반영되는지)은 반드시 “추정”으로 표기합니다.
- 이 문서는 “확인된 사실”과 “추정”을 구분해 작성합니다.

---

## 전체 서비스 흐름 (Top-Level Workflow)

### 소비자(Consumer) 흐름
1. 사용자 `GET /` 진입
   - 화면: `ConsumerHomePage` (마케팅/CTA)
   - 액션: `KAPP 진단 시작하기` 클릭
   - 라우팅: `ROUTES.LOGIN` (`/login`)
2. 사용자 `GET /login` 진입
   - 화면: `ConsumerLoginPage`
   - 입력: `email`, `password`
   - 처리: `localStorage` 기반 모의 계정 생성/검증
   - 동의/약관: 필수/선택 동의 체크 및 모달 표시(로컬 저장)
   - 라우팅: submit 성공 후 `router.push(ROUTES.APP)` (`/app`)
3. 사용자 `GET /app` 진입
   - 화면: `ConsumerAppHomePage` (비디오/CTA)
   - 액션: `KAPP 진단 시작하기` 클릭
   - 라우팅: `/app/diagnosis`
4. 사용자 `GET /app/diagnosis` 진입
   - 화면: `DiagnosisPage`
   - step 0~6 다단계 진단 위저드 진행
   - 저장/복원: `sessionStorage("kapp_diagnosis_state")`
5. 사용자 step 6(결과) 도달 후 종료 또는 다음 단계 선택
   - 종료/다음: `결과 확인하기` 클릭 -> `/app/dashboard`
   - 리포트: `종합분석 리포트 다운로드` 클릭 -> 새 창에서 `/report/preview?payload=...` 오픈
6. 사용자 `GET /app/dashboard` 진입
   - 화면: `ConsumerDashboardPage`
   - 탭 전환: `내 역량` / `성장 로드맵`
   - 성장 로드맵(옵션/선택): `sessionStorage("kapp_diagnosis_state").form.industry` 기반으로 반영
   - 액션: `추천 강의 둘러보기` -> `/app/education`
7. 사용자 `GET /app/education` 진입
   - 화면: `EducationPage`
   - 현재: “교육 큐레이션(추후 구현 예정)” 안내만 표시
8. (선택) `GET /app/growth` 진입
   - 화면: `GrowthPage` (인증서 A4 뷰/스케일링)
   - 버튼: PDF 다운로드 UI 존재(버튼의 실제 동작 방식은 코드상 명확히 확인되지 않음 -> 추정)

### 관리자(Admin) 흐름
1. 관리자 `GET /admin` 진입
   - 화면: `AdminLoginPage`
   - 입력: `email`, `password`
   - 처리: 로딩 표시 후 일정 시간 대기 후 무조건 `router.push(ROUTES.DASHBOARD)` (`/dashboard`)
   - 인증 로직(서버/토큰)은 코드상 확인되지 않음 -> 추정
2. 관리자 `GET /dashboard` 진입
   - 화면: `DashboardPage` + 레이아웃(`app/dashboard/layout.tsx`)
   - 레이아웃: `Sidebar` + `RightPanel`
3. 사이드바 메뉴로 이동
   - `/dashboard/competency` : 역량 분석
   - `/dashboard/employees` : 직원 목록/관리(데이터 기반)
   - (사이드바에 링크가 더 존재할 수 있으나, 현재 이 문서 범위에서 해당 `page.tsx` 구현 확인은 제한적 -> 추정)
4. 역량 분석/리포트 탐색
   - `/dashboard/competency`에서 필터/뷰 토글/Raw 데이터 보기 수행
   - `/dashboard/employees`에서 테이블 페이지네이션 확인

---

## 페이지/화면 단위 워크플로우

### [Page] `/` : 소비자 홈
- 입력: 없음
- 버튼 클릭
  - `KAPP 진단 시작하기` -> `/login`
  - `서비스 둘러보기` -> 페이지 앵커 이동(`#features`) (페이지 라우팅 아님)
- 종료 조건: 사용자가 `/login` 또는 앵커로 이동

### [Page] `/login` : 소비자 로그인/회원가입(모의)
- 입력: `email`, `password`
- 필수/선택 동의(회원가입 시에만 표시)
  - 체크박스 변경
  - `내용 보기` 버튼 클릭 -> 약관 모달 오픈
- 버튼 클릭(폼 submit)
  - 처리: `localStorage`에 계정/동의 기록
  - 라우팅: `/app`
- 종료 조건: `/app`으로 이동

### [Page] `/app` : 소비자 앱 진입(CTA)
- 입력: 없음
- 버튼 클릭
  - `KAPP 진단 시작하기` -> `/app/diagnosis`

### [Page] `/app/diagnosis` : KAPP 지능형 역량 진단(핵심)
- 입력/상태: step별 폼 입력 및 문항 선택
- 상태 저장/복원
  - `sessionStorage("kapp_diagnosis_state")`로 저장
  - 새로고침/복귀 시 복원
- step 0: 시작
  - 입력: 없음
  - 버튼 클릭: `진단 시작하기` -> step 1
- step 1: 정보 입력
  - 입력: name/email(선택), industry/직무 선택, 회사유형/직급/연차/회사명/규모, 진단목표(복수 선택)
  - 버튼 클릭
    - 우측 하단 `다음` -> step 2
- step 2: 지식 문항
  - 입력: 객관식 선택
  - 버튼 클릭
    - `다음` -> step 내 다음 문항 또는 step 3으로 이동
- step 3: 적용 문항(시나리오)
  - 입력: 객관식 선택
  - 버튼 클릭: `다음`
- step 4: 성과 문항(KPI/성과)
  - 입력: 객관식 선택
  - 버튼 클릭: `다음`
- step 5: 디지털 인바스켓(E-tray)
  - 입력: 인바스켓 목록에서 문항 선택/상세 후 시뮬레이션 진행
  - 목록 화면
    - `상세보기` -> 상세 모달 오픈
    - `진행하기` -> 시뮬레이션 화면으로 전환
    - AI 워크플로우(자동화) 행도 유사 패턴(상세/진행)
  - 시뮬레이션 화면
    - `완료하고 다음 단계로` 클릭
      - 부모 상태에 답변 반영: `answers.etray[qId] = "completed"`
      - 목록으로 복귀(현재 step=5 유지)
  - AI 워크플로우는 라디오 형태로 `answers.ai` 갱신
- step 6: 결과
  - 버튼 클릭
    - `결과 확인하기` -> `/app/dashboard`
    - `종합분석 리포트 다운로드` -> `/report/preview?payload=...` 새 창 오픈

### [Page] `/app/dashboard` : 소비자 마이 대시보드
- 입력: 탭 전환(내 역량/성장 로드맵), 뷰 전환(차트/표/레이더), 산업군/직무 옵션 변경(로드맵)
- 버튼 클릭
  - `추천 강의 둘러보기` -> `/app/education`
- 연관 데이터
  - 진단 상태 복원에서 `form.industry`를 읽어 로드맵 기본값에 반영

### [Page] `/app/education` : 교육 큐레이션(현재 안내만)
- 입력: 없음
- 버튼/동작: 현재 코드 기준 명시적 동작 로직 확인 제한 -> 추정

### [Page] `/app/growth` : 성장 인증서(뷰 중심)
- 입력: 없음
- UI: 인증서 A4 영역 렌더링 및 PDF 다운로드 버튼 존재
- 버튼 동작 방식은 코드상 확인 제한 -> 추정

### [Page] `/admin` : 관리자 로그인(모의)
- 입력: `email`, `password`
- 버튼 클릭
  - 처리: 1500ms 대기 후 무조건 `/dashboard`로 이동

### [Page] `/dashboard` : 관리자 메인 대시보드
- 입력: `draft`(조직 전략 키워드) 텍스트 입력
- 버튼 클릭
  - `AI 분석 시작` -> 현재 구현은 모의 결과 렌더링(실 API 호출은 코드상 확인되지 않음 -> 추정)

### [Page] `/dashboard/competency` : 역량 분석
- 입력/상호작용
  - Header 탭: `overview` / `strategy` / `risk`
  - overview
    - `FilterBar`: 부서 선택, 기간 선택, 일별/월별 추이
    - `초기화`: useCompetencyFilter 초기값으로 복귀
    - `RawDataButton`: Raw 데이터 패널 토글
  - strategy
    - ROI 계산(입력 기반 계산)
    - 고성과자/벤치마킹/인사이트(정적 데이터 기반)
  - risk
    - 히트맵에서 부서 선택 시 상세 섹션 표시
    - 교육 배정/상세 분석 버튼은 `window.alert` 기반으로 동작(실 데이터 반영 없음)

### [Page] `/dashboard/employees` : 직원 목록
- 입력: 검색어, 페이지 이동
- 버튼 클릭: row 액션 버튼들(보기/교육 배정/리포트)
  - 현재 구현은 onNotify 호출 형태이며 실제 외부 연동은 코드상 제한 -> 추정

### [Page] `/report/preview` : 리포트 미리보기
- 입력: `searchParams.payload` (query string)
- 처리
  - 서버에서 `buildReportModel(parseReportRequest(payload))`
  - client에서 `ReportPreviewClient` 렌더링
  - PDF 다운로드 링크: `/api/report/pdf?payload=...`

---

## 컴포넌트 구조 트리 (DOM + 기능 기준)

### 소비자 진단/리포트
- ConsumerAppHomePage
  - HeroCtaLink (onClick -> `/app/diagnosis`)
- DiagnosisPage
  - StepNavigation (STEPS 버튼)
  - StepContent
    - DiagnosisStartStep (onStart -> step1)
    - (step1) 정보 입력 UI
      - IndustrySelectModal
        - IndustryClassificationModal (포털 렌더링)
      - 진단목표 MultiSelect(버튼 토글)
    - (step2) 지식 문항 렌더링
    - (step3) 적용 문항 렌더링
    - (step4) 성과 문항 렌더링
    - (step5) InbasketList
      - DetailModal
      - AIWorkflowModal
      - QuestionTable rows
    - (step5) InbasketSimulation
      - SimulationContent
        - question.category별 Simulation 컴포넌트(매핑)
    - (step6) ResultActions
      - DashboardButton -> `/app/dashboard`
      - ReportPreviewButton -> `/report/preview?payload=...`
- ReportPreviewPage
  - ReportPreviewClient
    - ReportDocument

### 관리자 대시보드
- Dashboard layout
  - Sidebar
  - RightPanel
- DashboardPage
  - Header
  - mock 카드/표/리스트들
- CompetencyAnalysisPage
  - Header (actions: overview/strategy/risk)
  - overview
    - FilterBar
      - DepartmentFilterPanel
    - SummaryKpiRow
    - DepartmentCompetency
      - ChartView / TableView
      - RawDataPanel toggle
    - TrendLineChart
    - RawDataPanel toggle
  - strategy
    - ROICalculatorSection
    - HighPerformerSection
    - BenchmarkSection
  - risk
    - RiskManagementSection
- EmployeesPage
  - Header
  - 직원 테이블 + Pagination

---

## 상태 및 데이터 흐름

### 소비자: 진단 상태
- state 생성 위치: `DiagnosisPage`
- 저장/복원 방식
  - 저장: `useEffect`에서 step/form/answers 변화 시 `sessionStorage("kapp_diagnosis_state")`
  - 복원: 마운트 시 `loadPersistedState()`
- props 전달 방식
  - InbasketList -> InbasketSimulation 전환 시
    - `DiagnosisPage`가 `selectedInbasketQuestion`을 계산 후 `InbasketSimulation`에 `question` props로 전달
    - 완료 시 `onComplete()` 콜백으로 `answers`를 갱신

### 소비자: 대시보드 반영
- `ConsumerDashboardPage`는 `sessionStorage("kapp_diagnosis_state")`에서 `form.industry`를 읽어 로드맵 시뮬레이터 기본값을 설정
- 차트 점수 등 핵심 값은 `dashboard.json` 정적 데이터에서 가져옴(answers 반영 연결은 코드상 확인되지 않음 -> 추정)

### 관리자: 역량 분석 데이터
- `useCompetencyFilter`가 state를 소유
  - `selectedDepartments`, `dateRange`, `trendMode`
  - 파생: `filteredData`, `barData`, `trendData`, `summary`
- `CompetencyAnalysisPage`에서 이를 props로 하위 컴포넌트에 전달

---

## API 및 비즈니스 로직 흐름

### `/api/report/pdf` : 리포트 PDF 생성
트리거 이벤트
- `ReportPreviewClient`의 `PDF 다운로드` 링크 클릭
  - href: `/api/report/pdf?payload={...}`

요청/처리/응답 흐름
1. API 라우트 진입: `app/api/report/pdf/route.ts`
2. payload 추출: `readRequestPayload`
   - GET: query string `payload` 우선
   - POST: request.json에서 `payload` 필드 또는 payload 문자열 시도
3. 리포트 모델 생성: `buildReportModel(reportRequest)`
   - `lib/report/report-data.ts`에서 `dashboard.json` 기반 점수/벤치마크/해석 계산
   - payload의 `{name, industry, job}`은 리포트 표기/선택 로드맵 기준에 사용
4. HTML 생성: `renderReportHtml(report)`
   - 템플릿 로드: `app/report/_templates/report-template.html` (fs readFile)
   - `{{BODY}}`, `{{REPORT_CSS}}` 치환
5. Puppeteer로 PDF 렌더링
   - `page.setContent(html, { waitUntil: "networkidle0" })`
   - `page.pdf({ format:"A4", printBackground:true, preferCSSPageSize:true, margin:0 })`
6. 응답
   - `Content-Type: application/pdf`
   - `Content-Disposition: attachment; filename="..."`

---

## 라우팅 구조 (Next.js App Router)

### 라우팅 매핑 규칙(프로젝트 특이점)
- 이 프로젝트는 `app/app/**`처럼 `app` 폴더가 한 번 더 중첩되어 있어 URL prefix가 `app/**`가 아니라 `app/**`(외부 folder 기준) 구조로 노출됩니다.
- 실제로는 아래 매핑을 따릅니다.

### 주요 라우트
- 소비자
  - `/` : `app/page.tsx`
  - `/login` : `app/login/page.tsx`
  - `/app` : `app/app/page.tsx`
  - `/app/diagnosis` : `app/app/diagnosis/page.tsx`
  - `/app/dashboard` : `app/app/dashboard/page.tsx`
  - `/app/education` : `app/app/education/page.tsx`
  - `/app/growth` : `app/app/growth/page.tsx`
- 관리자
  - `/admin` : `app/admin/page.tsx`
  - `/dashboard` : `app/dashboard/page.tsx`
  - `/dashboard/competency` : `app/dashboard/competency/page.tsx`
  - `/dashboard/employees` : `app/dashboard/employees/page.tsx`
- 리포트/다이어그램
  - `/report/preview` : `app/report/preview/page.tsx`
  - `/api/report/pdf` : `app/api/report/pdf/route.ts`
  - `/docs/diagram` : `app/docs/diagram/page.tsx`

---

## 핵심 기능별 시퀀스 다이어그램 (텍스트 기반)

### 1) 소비자: 진단(전체) -> 대시보드
User -> `GET /` -> Click `KAPP 진단 시작하기` -> `GET /login`
User -> Submit 로그인 -> `router.push(/app)`
User -> `GET /app` -> Click 진단 시작 -> `router.push(/app/diagnosis)`
User -> `GET /app/diagnosis` (step 0~6 진행)
User -> step6 Click `결과 확인하기` -> `router.push(/app/dashboard)`
UI -> Dashboard 탭/차트/로드맵 렌더링

### 2) 소비자: step5 디지털 인바스켓 진행
User -> `GET /app/diagnosis` (step5) -> InbasketList에서 row Click `진행하기`
DiagnosisPage -> 상태 변경 (`selectedInbasketSelectedId`, `inbasketView="simulation"`)
UI -> `InbasketSimulation(question=selected)` 렌더링
User -> 시뮬레이션 상호작용
User -> `완료하고 다음 단계로` 클릭
DiagnosisPage -> `answers.etray[qId]="completed"`
DiagnosisPage -> 목록으로 복귀(`inbasketView="list"`)

### 3) 소비자: 리포트 PDF 다운로드
User -> step6 Click `종합분석 리포트 다운로드`
UI -> `window.open(/report/preview?payload=...)`
ReportPreviewPage -> server buildReportModel
ReportPreviewClient -> ReportDocument 렌더링 + PDF 링크 노출
User -> PDF 링크 클릭
Browser -> `GET /api/report/pdf?payload=...`
API -> payload parse -> buildReportModel -> renderReportHtml -> Puppeteer PDF 생성
API -> PDF 파일 다운로드

### 4) 관리자: 역량 분석 필터 -> 차트/표 갱신
Admin -> `POST /admin`(submit) -> `/dashboard`
Admin -> Sidebar Click `/dashboard/competency`
CompetencyAnalysisPage -> useCompetencyFilter 초기화
Admin -> FilterBar 변경(부서/기간/일별-월별)
useCompetencyFilter -> filteredData/barData/trendData recompute
UI -> 차트/요약/Raw 데이터 패널 반영

