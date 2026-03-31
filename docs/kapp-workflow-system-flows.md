# KAPP 사용자 흐름 및 시스템 워크플로우 문서

> **보강(2026-03):** `docs/service-structure-diagram.txt`의 트리·부록 A와 **동일한 사실관계**로 디지털 인바스켓(48문항·AI·상태키)을 본 문서에 상세 반영했습니다. 단일 소스 JSON은 `data/kappDiagnosis/inbasket/inbasketQuestions.json` 입니다.

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
   - 라우팅: `ROUTES.APP_DIAGNOSIS` (`/app/diagnosis`)  ← (변경) 게이트에서 진단으로 직행
2. (선택) 사용자 `GET /login` 진입 (직접 URL 접근 등)
   - 화면: `ConsumerLoginPage` (모의 로그인/회원가입)
   - 입력: `email`, `password`
   - 처리: `localStorage` 기반 모의 계정 생성/검증 + 동의 저장
   - 라우팅: submit 성공 후 `router.push(ROUTES.APP_DIAGNOSIS)` (`/app/diagnosis`)  ← (변경) /app 제거, 진단으로 연결
3. 사용자 `GET /app/diagnosis` 진입
   - 화면: `DiagnosisPage`
   - step 0~6 다단계 진단 위저드 진행
   - 저장/복원: `sessionStorage("kapp_diagnosis_state")`
4. 사용자 step 6(결과) 도달 후 종료 또는 다음 단계 선택
   - 대시보드: `결과 확인하기` 클릭 → `/app/dashboard`
   - 리포트: `종합분석 리포트 다운로드` 클릭 → 새 창 `/report/preview?payload=...` (코드: `serializeReportRequest` + `window.open`)
   - step 5 → 6: 하단 `다음` / `완료하고 결과 보기` 클릭 시 **로딩 오버레이**(스피너·순환 메시지) 후 step 6
5. 사용자 `GET /app/dashboard` 진입
   - 화면: `ConsumerDashboardPage`
   - 탭 전환: `내 역량` / `성장 로드맵`
   - 성장 로드맵(옵션/선택): `sessionStorage("kapp_diagnosis_state").form.industry` 기반으로 반영
   - 액션: `추천 강의 둘러보기` -> `/app/education`
6. 사용자 `GET /app/education` 진입
   - 화면: `EducationPage`
   - 현재: “교육 큐레이션(추후 구현 예정)” 안내만 표시
7. (선택) `GET /app/growth` 진입
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
  - `KAPP 진단 시작하기` -> `/app/diagnosis` (변경)
  - `무료로 진단 시작하기` -> `/app/diagnosis` (변경)
  - 푸터 `KAPP 진단` 링크 -> `/app/diagnosis` (변경)
  - `서비스 둘러보기` -> 페이지 앵커 이동(`#features`) (페이지 라우팅 아님)
- 종료 조건: 사용자가 `/app/diagnosis` 또는 앵커로 이동

### [Page] `/login` : 소비자 로그인/회원가입(모의)
- 입력: `email`, `password`
- 필수/선택 동의(회원가입 시에만 표시)
  - 체크박스 변경
  - `내용 보기` 버튼 클릭 -> 약관 모달 오픈
- 버튼 클릭(폼 submit)
  - 처리: `localStorage`에 계정/동의 기록
  - 라우팅: `/app/diagnosis` (변경)
- 종료 조건: `/app/diagnosis`로 이동

### [Page] `/app/diagnosis` : KAPP 지능형 역량 진단(핵심)
- 입력/상태: step별 폼 입력 및 문항 선택
- 상태 저장/복원
  - `sessionStorage("kapp_diagnosis_state")`로 저장
  - 새로고침/복귀 시 복원
- step 0: 시작
  - 입력: 없음
  - 버튼 클릭: `진단 시작하기` -> step 1
- step 1: 정보 입력
  - step 1 내부에 서브 스텝 `infoInputStep` 1~3이 있으며, 우측 하단 `다음`은 서브 스텝을 진행한다.
  - 서브 step 1 (산업/직무)
    - `IndustrySelectModal`: ① 산업군 그리드(`industry_tree.json`, 20개 표시) ② 같은 모달 슬라이드로 **분야·직무**(`job_taxonomy_payload.json`)
    - `IndustryClassificationModal`: 1단계에서 **[상세보기]** 시 중·소·세·세세 분류 참고용(포털)
    - 세부 직무는 **읽기 전용 input** — 모달에서만 `form.job` 반영
  - 서브 step 2 (기본정보)
    - 입력: 이름, 이메일(아이디), 비밀번호, 전화번호 (`form.name`, `form.email`, `form.password`, `form.phone`)
  - 서브 step 3 (회사·경력·목표)
    - 입력: 기업유형, 직급, 회사명(`company`), 연차, 기업 규모, 진단 목표 복수 선택 등 (`page.tsx` 폼 필드와 동일)
  - 버튼 클릭
    - 우측 하단 `다음`:
      - 서브 step 1→2→3 진행
      - 서브 step 3 완료 시 메인 step 2로 이동
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
- step 5: 디지털 인바스켓
  - **데이터:** `getInbasketQuestions()` → JSON **48문항** (`lib/inbasketData.ts` ← `inbasketQuestions.json`). **AI 1건** → `aiWorkflowByIndustry.json`의 `byIndustry`, 키는 `form.industry`가 `["IT","금융","의료","마케팅/광고"]`에 없으면 `"기타"` (`AI_INDUSTRY_KEYS`/`ETRAY_INDUSTRY_KEYS` 동일 패턴).
  - **보조 데이터(미연동):** `etrayByIndustry.json`은 `page.tsx`에서 `etrayEmails`·`selectedEtrayId` 동기화만 수행 — **시뮬 UI는 현재 문항 기반**(확장 여지).
  - **뷰 상태:** `inbasketView`: `"list"` | `"simulation"`, `inbasketSelectedId`: 문항 `id` 또는 상수 `"ai-workflow"`. 둘 다 `sessionStorage("kapp_diagnosis_state")`에 저장.
  - **목록 (`InbasketList`)**
    - 헤더: **전체 문항**, 진행률 바 `completed/total`, **[테스트 환경]** (펼치면 직무 필터 + 우측 **`다음 →`** = `onNextToResult` → 미완료여도 step 6)
    - 직무 필터 옵션: `JOB_PILLS`(전체, 경영/기획, 커뮤니케이션, 고객서비스, …) — `question.jobCategory`로 표 데이터 필터
    - 테이블 컬럼: 우선순위 뱃지·제목·발신자·카테고리(`category`=시뮬 타입)·내용 미리보기·`상세보기`/`진행하기`
    - **AI 행:** 우선순위 컬럼은 **자동화**(보라), `onStart("ai-workflow")`
    - 문항 상세 모달: 본문·첨부·**시뮬레이션 시작**·**기본 응답 작성**(`window.alert` 스텁)
  - **일반 시뮬 (`InbasketSimulation` + `SimulationContent`)**
    - `question.category` → `inbasket-simulations/index.tsx`의 `CATEGORY_COMPONENTS`(16종 + `PlaceholderSimulation`)
    - **완료:** `answers.etray[qId] = "completed"` 후 `inbasketView=list`, `inbasketSelectedId=null`
  - **AI 시뮬:** `page.tsx` 인라인 — 시나리오 `task`, 라디오 4지선다, `answers.ai = 옵션 인덱스`, 선택 후 `explanation` 표시
  - **진행률:** `total = questions.length + (aiWorkflow ? 1 : 0)` (테스트 기준 최대 **49**). `completed` = `etray`에 비어 있지 않은 문항 수 + (`answers.ai != null` ? 1 : 0).
  - **네이밍 주의:** `answers.etray` 키는 **인바스켓 문항 id**이며, 값은 완료 문자열(현행 `"completed"`). E-tray JSON 파일명과 혼동되기 쉬움(레거시).
- step 6: 결과
  - **`결과 확인하기`** → `/app/dashboard`
  - **`종합분석 리포트 다운로드`** → 새 창 `/report/preview?payload=...` (step 6에 **두 버튼 모두 존재**, 코드 확인)

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
- DiagnosisPage
  - ProgressHeader (step>=1일 때만 표시, 진행률 바 + 동적 설명)
  - StepContent
    - DiagnosisStartStep (onStart -> step1)
    - (step1) 정보 입력 UI
      - DiagnosisInfoInputLeftPanel (STEP X/3 + 동적 설명 + 기대결과)
      - IndustrySelectModal
        - IndustryClassificationModal (포털 렌더링)
      - 진단목표 MultiSelect(버튼 토글)
    - (step2) 지식 문항 렌더링
    - (step3) 적용 문항 렌더링
    - (step4) 성과 문항 렌더링
    - (step5) InbasketList (`aiWorkflow` 생략 시 목록에서 AI 행 미표시; AI는 step6에서 진행)
      - 헤더: 전체 문항 / 진행률 / 테스트 환경(툴팁)
      - 펼침 시: 직무 필터 `<select>` + `다음 →` (`onNextToResult` → step6 AI 단계)
      - 테이블 행: `filtered.map(question)`만(선택적 `aiWorkflow` 행은 별도 단계와 중복 시 생략)
      - 모달: 문항 상세(`modalQuestion`); AI 상세 모달은 `aiWorkflow` 전달 시에만
    - (step5) 시뮬레이션 분기 (`inbasketView==="simulation"`)
      - `InbasketSimulation` (인바스켓 문항 id)
        - SimulationContent
          - `CATEGORY_COMPONENTS[question.category]` → Email/Messenger/Report/…/Production
    - (step6) **page.tsx 인라인** AI 워크플로우 라디오 UI (`answers.ai`), 완료 후 분석 로딩 → step7
    - (step7) ResultActions
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
- state 생성 위치: `DiagnosisPage` (`app/app/diagnosis/page.tsx`)
- 저장/복원 방식
  - 저장: `useEffect`에서 `flowVersion`, `step`, `infoInputStep`, `form`, `selectedEtrayId`, `inbasketView`, `inbasketSelectedId`, `answers` 등 변화 시 `sessionStorage("kapp_diagnosis_state")`
  - 복원: 마운트 시 `loadPersistedState()` (구버전 `flowVersion` 없음·`step===6`이면 결과 단계로 간주해 step7로 마이그레이션)
- 디지털 인바스켓 전용 필드
  - `inbasketView`, `inbasketSelectedId`, `answers.etray`, `answers.ai`(step6에서 확정)
  - `selectedEtrayId`: `etrayByIndustry`와 동기화용(현재 시뮬에 미사용)
- props 전달 방식
  - `InbasketList`: `questions`, `aiWorkflow?`, `onStart(id)`, `completedCount`, `totalCount`, `onNextToResult`
  - `inbasketSelectedId`가 일반 문항 id면 `selectedInbasketQuestion = questions.find(...)` 후 `InbasketSimulation`에 `question` 전달
  - 완료 콜백: 인바스켓 문항은 `answers.etray[qId]="completed"`; AI 선택은 step6에서 `answers.ai` 저장

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
User -> `GET /` -> Click `KAPP 진단 시작하기` -> `GET /app/diagnosis` (변경: 게이트에서 직행)
User -> (선택) `GET /login` 직접 접근 -> Submit 로그인 -> `router.push(/app/diagnosis)` (변경)
User -> `GET /app/diagnosis` (step 0~6 진행)
User -> step6 Click `결과 확인하기` -> `router.push(/app/dashboard)`
UI -> Dashboard 탭/차트/로드맵 렌더링

### 2) 소비자: step5 디지털 인바스켓 진행

**일반 문항**
User -> InbasketList `진행하기` (또는 상세 모달에서 시뮬 시작)
DiagnosisPage -> `setInbasketSelectedId(qId)`, `setInbasketView("simulation")`
UI -> `InbasketSimulation` + `SimulationContent(category별 컴포넌트)`
User -> 시뮬 UI 조작
User -> `완료하고 다음 단계로`
DiagnosisPage -> `answers.etray[qId]="completed"`, `inbasketView="list"`, `inbasketSelectedId=null`

**AI 워크플로우 (`ai-workflow`)**
User -> AI 행 `진행하기` 또는 AI 상세 모달에서 진행
DiagnosisPage -> 동일하게 `simulation` 뷰, **인라인** 라디오 UI (`answers.ai`)
User -> 옵션 선택(및 필요 시 하단 완료 흐름) -> 목록 복귀

**step 5 탈출(정식/테스트)**
User -> 하단 네비 `다음` / `완료하고 결과 보기` -> 로딩 -> step 6

(테스트 편의)
User -> 테스트 환경 펼침 후 `다음 →` -> `onNextToResult`/`goNext` -> step 6 (미완료 허용)

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

---

## 디지털 인바스켓 기능 명세 (상세)

> 본 섹션은 `data/kappDiagnosis/inbasket/inbasketQuestions.json` 및 `app/app/diagnosis/**` 연동 코드 기준 **현행 구현**을 기술한다. 구조도 문서 `docs/service-structure-diagram.txt` 부록 A와 동일 계열이다.

### 1) 목적·측정 관점

- 받은편지함·메신저·보고·일정 등 업무 알림이 **동시 유입**된다는 설정에서 **우선순위·채널 대응·의사결정** 연습(step 5).
- **16 시뮬레이션 타입(`category`)** × **타입당 3문항** = **총 48문항**.
- 각 문항은 `jobCategory`로 테스트 환경 **직무 필터**에 사용된다.
- **AI 워크플로우**는 목록 **별도 1행**(id `ai-workflow`), 산업(`form.industry`)에 따라 시나리오·선지가 바뀐다.

### 2) 데이터·상태·파일

| 구분 | 경로 / 식별자 | 비고 |
|------|----------------|------|
| 문항 JSON | `data/kappDiagnosis/inbasket/inbasketQuestions.json` | `questions[]` 48건 |
| 로더·타입 | `lib/inbasketData.ts` | `getInbasketQuestions()`, `InbasketQuestion` |
| AI 산업별 | `data/kappDiagnosis/aiWorkflowByIndustry.json` | `byIndustry.IT` 등 5키 |
| E-tray 원천 | `data/kappDiagnosis/etrayByIndustry.json` | 로드만, 시뮬 UI 미소비 |
| 목록 | `app/app/diagnosis/InbasketList.tsx` | 테이블·필터·모달·진행률 |
| 래퍼 | `app/app/diagnosis/InbasketSimulation.tsx` | 목록↔시뮬 |
| 타입별 시뮬 | `app/app/diagnosis/inbasket-simulations/*.tsx` | `index.tsx` 매핑 테이블 |
| 오케스트 | `app/app/diagnosis/page.tsx` | `aiWorkflow`, `inbasketProgress`, 저장 |

**answers (인바스켓)**

- `answers.etray: Record<string, string>` — 키 = **문항 `id`**. 값이 비어 있지 않으면 완료(현행 `"completed"`).
- `answers.ai: number \| null` — AI 워크플로우에서 고른 **옵션 인덱스**(0~3).

**진행률**

- `total = questions.length + (aiWorkflow ? 1 : 0)` (최대 49).
- `completed` = (etray에 값 있는 문항 수) + (`answers.ai != null` ? 1 : 0).

### 3) `category` → 시뮬레이션 컴포넌트

| category (JSON 문자열과 동일) | 컴포넌트 |
|-------------------------------|----------|
| 이메일 관리 | `EmailSimulation.tsx` |
| 메신저 대응 | `MessengerSimulation.tsx` |
| 보고서 작성 | `ReportSimulation.tsx` |
| 일정 관리 | `CalendarSimulation.tsx` |
| 통합 업무 | `IntegratedWorkSimulation.tsx` |
| 위기 관리 | `EmergencySimulation.tsx` |
| 글로벌 협업 | `GlobalSimulation.tsx` |
| 법무 검토 | `LegalSimulation.tsx` |
| 디지털 활용 | `DigitalToolSimulation.tsx` |
| 인사 관리 | `HRSimulation.tsx` |
| 재무 관리 | `FinanceSimulation.tsx` |
| 고객 관리 | `CustomerSimulation.tsx` |
| 윤리 경영 | `EthicsSimulation.tsx` |
| 전략 기획 | `StrategySimulation.tsx` |
| 마케팅캠페인 | `MarketingCampaignSimulation.tsx` |
| 생산관리 | `ProductionSimulation.tsx` |
| (미매칭) | `PlaceholderSimulation.tsx` |

### 4) 문항 목록 (48건)

#### 4-1. 이메일 관리 — `EmailSimulation`

공통: `buildEmails`로 **문항 1통 + 고정 보조 4통** = 5통.

| id | jobCategory | 우선순위 | 발신 | 시각 | 제목 | 본문 요약 | 첨부 |
|----|-------------|----------|------|------|------|-----------|------|
| inbasket_email_1 | 커뮤니케이션 | 긴급 | 이CTO (최고기술책임자) | 5분 전 | [긴급] 프로덕션 서버 CPU 사용률 95% 초과 | 서버 A/B CPU 97·96%, 응답 지연 3.2s, 즉시 대응 요청 | — |
| inbasket_email_2 | 경영/기획 | 보통 | 이사회 사무국 | 10분 전 | 이사회 안건 승인 요청 | 차주 이사회 안건 사전 검토·승인 필요 | — |
| inbasket_email_3 | 경영/기획 | 낮음 | 마케팅팀 | 1시간 전 | 월간 실적 보고서 제출 | 2월 마케팅 실적 보고·피드백 요청 | — |

#### 4-2. 메신저 대응 — `MessengerSimulation`

| id | jobCategory | 우선순위 | 발신 | 시각 | 제목 | 본문 요약 |
|----|-------------|----------|------|------|------|-----------|
| inbasket_messenger_1 | 커뮤니케이션 | 긴급 | DevOps팀 | 방금 전 | 채널 #긴급-장애에 메시지 도착 | 배포 서버 장애, 팀에 대응 방향 전달 |
| inbasket_messenger_2 | 커뮤니케이션 | 긴급 | 재무팀 | 09:25 | 긴급 결재 요청 | 오늘 15시까지 긴급 결재 |
| inbasket_messenger_3 | 인사/조직 | 보통 | 인사팀 | 09:30 | 면접 일정 조율 | 면접 3건, 가능 시각 회신 |

#### 4-3. 보고서 작성 — `ReportSimulation`

| id | jobCategory | 우선순위 | 발신 | 시각 | 제목 | 본문 요약 |
|----|-------------|----------|------|------|------|-----------|
| inbasket_report_1 | 경영/기획 | 보통 | 경영기획팀 | 1시간 전 | 분기 실적 보고서 작성 요청 | 본부 데이터 수집·초안·우선순위 확인 |
| inbasket_report_2 | 경영/기획 | 보통 | 전략기획팀 | 2일 전 | 연간 사업계획서 초안 검토 | 2026 연간 계획 초안 검토·의견 |
| inbasket_report_3 | 경영/기획 | 긴급 | 경영지원팀 | 오늘 | 정기 경영회의 자료 제출 | 차주 경영회의 자료 금요일까지 |

#### 4-4. 일정 관리 — `CalendarSimulation`

| id | jobCategory | 우선순위 | 발신 | 시각 | 제목 | 본문 요약 |
|----|-------------|----------|------|------|------|-----------|
| inbasket_calendar_1 | 경영/기획 | 보통 | 경영지원팀 | 오늘 | 14시 회의 3건 충돌 - 일정 조율 | 14시 회의 겹침, 참석/대리/변경/불참 결정 |
| inbasket_calendar_2 | 경영/기획 | 보통 | 비서실 | 어제 | 주간 정기회의 일정 확정 | 요일·시간 확정, 부서 가능일 확인 |
| inbasket_calendar_3 | 경영/기획 | 긴급 | IR팀 | 30분 전 | 투자자 미팅 일정 변경 | 미팅 다음 주 연기, 일정 조정 |

#### 4-5. 통합 업무 — `IntegratedWorkSimulation`

| id | jobCategory | 우선순위 | 발신 | 시각 | 제목 | 본문 요약 |
|----|-------------|----------|------|------|------|-----------|
| inbasket_integrated_1 | 프로젝트관리 | 긴급 | 고객대응센터 | 30분 전 | 멀티채널 고객 문의 대응 | 이메일·전화·SNS·메신저 동시 유입 우선순위 |
| inbasket_integrated_2 | 프로젝트관리 | 보통 | 운영팀 | 오늘 | 채널별 일일 현황 점검 | 미처리·우선 처리 대상 |
| inbasket_integrated_3 | 고객서비스 | 긴급 | 고객센터 | 10분 전 | VIP 문의 에스컬레이션 | 전화·이메일 동시 VIP 문의 |

#### 4-6. 위기 관리 — `EmergencySimulation`

| id | jobCategory | 우선순위 | 발신 | 시각 | 제목 | 본문 요약 |
|----|-------------|----------|------|------|------|-----------|
| inbasket_emergency_1 | 위기대응 | 긴급 | 위기대응팀 | 즉시 | 제품 이상 사례 위기 대응 | 대응 전략·TF·고객 커뮤·예산 단계 결정 |
| inbasket_emergency_2 | 위기대응 | 긴급 | 홍보팀 | 1시간 전 | 언론 보도 예정 - 대응 전략 | 내일 보도, 선제 대응·담당 배치 |
| inbasket_emergency_3 | 위기대응 | 긴급 | IT운영팀 | 방금 전 | 시스템 장애 긴급 대응 | 복구 우선순위·고객 공지 |

#### 4-7. 글로벌 협업 — `GlobalSimulation`

| id | jobCategory | 우선순위 | 발신 | 시각 | 제목 | 본문 요약 |
|----|-------------|----------|------|------|------|-----------|
| inbasket_global_1 | 프로젝트관리 | 보통 | 해외사업부 | 오늘 | 글로벌 4개 지사 회의 시간 조율 | 서울·뉴욕·베를린·싱가포르, 문서 버전·프로토콜 |
| inbasket_global_2 | 프로젝트관리 | 보통 | 해외사업부 | 2일 전 | 해외 지사 문서 공유 규칙 수립 | 타임존별 공유·마감 규칙 |
| inbasket_global_3 | 프로젝트관리 | 보통 | 법무팀 | 1일 전 | 다국어 계약서 버전 통일 | 영·중·일 불일치, 통일 기준 |

#### 4-8. 법무 검토 — `LegalSimulation`

| id | jobCategory | 우선순위 | 발신 | 시각 | 제목 | 본문 요약 | 첨부 |
|----|-------------|----------|------|------|------|-----------|------|
| inbasket_legal_1 | 법무/컴플라이언스 | 긴급 | 법무팀 | 2시간 전 | 50억원 규모 계약서 법무 검토 | 조항별 위험·수정/협상/수용/거절 | 계약서_초안.pdf |
| inbasket_legal_2 | 법무/컴플라이언스 | 보통 | 사업개발팀 | 3시간 전 | 제휴 계약서 검토 요청 | 신규 제휴 계약 초안 검토 | — |
| inbasket_legal_3 | 법무/컴플라이언스 | 보통 | 법무팀 | 1일 전 | 표준 계약 조항 개정안 검토 | 표준계약 개정 최종 검토 | — |

#### 4-9. 디지털 활용 — `DigitalToolSimulation`

| id | jobCategory | 우선순위 | 발신 | 시각 | 제목 | 본문 요약 |
|----|-------------|----------|------|------|------|-----------|
| inbasket_digital_1 | IT/디지털 | 보통 | IT기획팀 | 1일 전 | AI 도구 도입 예산 배분 | ChatGPT Plus, Notion AI, Midjourney, Copilot ROI·예산 |
| inbasket_digital_2 | IT/디지털 | 보통 | IT기획팀 | 오늘 | 사내 협업 도구 확대 검토 | 라이선스 증설 옵션 비교 |
| inbasket_digital_3 | IT/디지털 | 긴급 | 정보보안팀 | 2일 전 | 보안 솔루션 도입 제안 | 규제 대응 보안 솔루션 검토 |

#### 4-10. 인사 관리 — `HRSimulation`

| id | jobCategory | 우선순위 | 발신 | 시각 | 제목 | 본문 요약 |
|----|-------------|----------|------|------|------|-----------|
| inbasket_hr_1 | 인사/조직 | 보통 | 인사팀 | 3시간 전 | 영업-생산 부서 간 갈등 조정 | 갈등·퇴사 예정자 반영 전략 선택 |
| inbasket_hr_2 | 인사/조직 | 보통 | 인사팀 | 1일 전 | 부서 간 인력 이동 제안 | A/B부서 인력 조정안 |
| inbasket_hr_3 | 인사/조직 | 낮음 | 인사개발팀 | 오늘 | 리더십 교육 일정 확정 | 분기 교육·강사·인원 |

#### 4-11. 재무 관리 — `FinanceSimulation`

| id | jobCategory | 우선순위 | 발신 | 시각 | 제목 | 본문 요약 |
|----|-------------|----------|------|------|------|-----------|
| inbasket_finance_1 | 재무/회계 | 긴급 | 재무팀 | 오늘 | 부서별 예산 증액 요청 검토 | 마케팅·R&D·영업·생산 4부서 전액/일부/거부/차기 |
| inbasket_finance_2 | 재무/회계 | 보통 | 재무팀 | 2일 전 | 분기 결산 보고 일정 | 2분기 결산 일정·담당 |
| inbasket_finance_3 | 재무/회계 | 긴급 | 재무팀 | 1시간 전 | 투자 검토 회의 자료 | 금요일까지 자료 제출 |

#### 4-12. 고객 관리 — `CustomerSimulation`

| id | jobCategory | 우선순위 | 발신 | 시각 | 제목 | 본문 요약 |
|----|-------------|----------|------|------|------|-----------|
| inbasket_customer_1 | 고객서비스 | 긴급 | 영업본부 | 1시간 전 | VIP 고객 ABC 그룹 이슈 대응 | 할인·품질보증·전담팀 요구 대응 전략 |
| inbasket_customer_2 | 고객서비스 | 긴급 | 영업팀 | 30분 전 | 대기업 B사 불만 대응 | 납기·품질 이슈 |
| inbasket_customer_3 | 고객서비스 | 보통 | 고객성과팀 | 오늘 | 고객 만족도 설문 결과 공유 | 1분기 만족도 개선 도출 |

#### 4-13. 윤리 경영 — `EthicsSimulation`

| id | jobCategory | 우선순위 | 발신 | 시각 | 제목 | 본문 요약 |
|----|-------------|----------|------|------|------|-----------|
| inbasket_ethics_1 | 법무/컴플라이언스 | 긴급 | 윤리경영팀 | 방금 전 | 제보 WB-2026-021 초기 대응 | 구매팀 김과장 제보, 대응·조사·공표 전략 |
| inbasket_ethics_2 | 법무/컴플라이언스 | 보통 | 감사팀 | 1일 전 | 내부 감사 결과 후속 조치 | 시정 계획 수립 |
| inbasket_ethics_3 | 법무/컴플라이언스 | 낮음 | 윤리경영팀 | 3일 전 | 윤리 강령 개정안 검토 | 전 직원 의견 수렴 |

#### 4-14. 전략 기획 — `StrategySimulation`

| id | jobCategory | 우선순위 | 발신 | 시각 | 제목 | 본문 요약 |
|----|-------------|----------|------|------|------|-----------|
| inbasket_strategy_1 | 경영/기획 | 보통 | 전략기획팀 | 2일 전 | XYZ 테크놀로지 M&A 검토 | 인수가 1,500억, 타당성·실사·통합·의사결정 |
| inbasket_strategy_2 | 경영/기획 | 보통 | 전략기획팀 | 오늘 | 신사업 투자 우선순위 | 후보 3개 우선순위 |
| inbasket_strategy_3 | 경영/기획 | 보통 | 경영기획팀 | 1일 전 | 연도 전략 목표 점검 | 2026 상반기 달성률·하반기 조정 |

#### 4-15. 마케팅캠페인 — `MarketingCampaignSimulation`

| id | jobCategory | 우선순위 | 발신 | 시각 | 제목 | 본문 요약 |
|----|-------------|----------|------|------|------|-----------|
| inbasket_marketing_1 | 마케팅/영업 | 보통 | 마케팅팀 | 오늘 | 캠페인별 예산·성과 점검 및 조치 | 인플루언서·온라인·오프라인·이메일 4캠페인 계속/확대/축소/중단 |
| inbasket_marketing_2 | 마케팅/영업 | 보통 | 마케팅팀 | 1일 전 | 신규 런칭 캠페인 승인 | 차월 런칭 기획·예산·일정 승인 |
| inbasket_marketing_3 | 마케팅/영업 | 긴급 | 마케팅팀 | 2시간 전 | 경쟁사 프로모션 대응 | 대규모 프로모션 대응 전략 |

#### 4-16. 생산관리 — `ProductionSimulation`

| id | jobCategory | 우선순위 | 발신 | 시각 | 제목 | 본문 요약 |
|----|-------------|----------|------|------|------|-----------|
| inbasket_production_1 | 생산/운영 | 긴급 | 생산관리팀 | 10분 전 | 라인 2 긴급 중단 - 생산 의사결정 | 불량 15%, 납기·재고, 원자재/라인/외주/연기 |
| inbasket_production_2 | 생산/운영 | 보통 | 생산관리팀 | 오늘 | 설비 정기 점검 일정 | 점검 확정·생산계획 조정 |
| inbasket_production_3 | 생산/운영 | 긴급 | 구매팀 | 1시간 전 | 원자재 재고 부족 대응 | 재고 3일 이하, 긴급 발주·대체처 |

### 5) 산업별 AI 워크플로우 (`id`: 목록에서 `ai-workflow`로 진입)

산업 키: **IT, 금융, 의료, 마케팅/광고**, 그 외 **`기타`**. JSON 내 `answer` 인덱스는 모두 **1** (B안). UI는 선택 후 `explanation` 노출.

| 산업 | JSON id | 제목 | 상황 요지 | 선지 요약(시간%, 품질) |
|------|---------|------|-----------|-------------------------|
| IT | it_ai_workflow | 코드 리뷰 자동화 | PR 15/일·7.5h 리뷰 → 50% 단축 | A 20/70 · B **60/95** · C 10/60 · D 0/85 |
| 금융 | finance_ai_workflow | 고객 세그먼트 자동 분석 | 50만 고객·20h/주 → 70% 단축 | A 30/70 · B **75/92** · C 45/80 · D 0/75 |
| 의료 | med_ai_workflow | EMR 데이터 자동 분석 | 15h/주 → 65% 단축 | A 15/65 · B **70/93** · C 25/70 · D 0/80 |
| 마케팅/광고 | mkt_ai_workflow | 광고 캠페인 자동 최적화 | 10채널·50광고·5h/일 | A 40/75 · B **85/95** · C 15/70 · D 0/80 |
| 기타 | etc_ai_workflow | 업무 보고서 자동화 | 주 5h 보고 반복 → 50%+ 단축 | A 10/70 · B **60/88** · C 25/72 · D 0/80 |

### 6) 테스트 환경 vs 운영(설계) — `InbasketList` 툴팁 기준

- **현재:** 48+AI 전부 목록 노출, 테스트 환경 펼침 시 직무 필터·`다음 →`로 step 6 스킵 가능.
- **설계 메시지:** 운영에선 **인당 4문항**·직무 UI 비표시 등(선정 로직은 정챴별, 미구현 시 동일 JSON 소스).

---

## 산업군·직무 선택 모달 기능 명세 (상세)

> 목적: 진단(step 1 서브 step 1)에서 **산업군(대분류)** 과 **세부 직무(직무·직업명 문자열)** 을 2단계로 선택하여 `DiagnosisPage.form`의 `industry`, `job`에 저장한다.

### 1) 관련 컴포넌트 / 파일
- `app/app/diagnosis/IndustrySelectModal.tsx`
  - 2단계 슬라이드 모달: `industry` → `job`
  - Portal 렌더링: `createPortal(..., document.body)`
- `app/app/diagnosis/IndustryClassificationModal.tsx`
  - 산업 분류 체계(중/소/세/세세) 참고용 모달
  - Portal 렌더링: `createPortal(..., document.body)`
- `app/app/diagnosis/page.tsx`
  - 모달 오픈/닫기 및 최종 선택값을 `form.industry`, `form.job`에 반영

### 2) 입력/출력(Props) 명세

#### 2-1. `IndustrySelectModal` Props
- `open: boolean`
  - `true`: 모달 노출
  - `false`: 렌더링하지 않음(`null`)
- `onClose: () => void`
  - 배경 클릭(overlay) 또는 X 버튼으로 호출
- `majors: IndustryNode[]`
  - 산업군(대분류) 목록
  - 실제 표시 목록은 내부에서 `EXCLUDED_MAJOR_NAME`에 해당하는 1개를 제외한 **20개**만 노출
- `onSelect: (major: IndustryNode, jobName: string) => void`
  - 최종 확정 시 호출
  - `major`: 대분류 IndustryNode
  - `jobName`: 사용자가 선택한 “직무·직업” 문자열

#### 2-2. `IndustryClassificationModal` Props
- `open: boolean`
- `onClose: () => void`
  - “대분류 선택”, X, 하단 “대분류 목록으로 돌아가기”, overlay 클릭으로 호출
- `majorName: string`
  - 헤더 타이틀 표시용
- `middleNodes: IndustryNode[]`
  - 선택된 대분류의 children(중분류 배열)
- `onConfirmMajor?: () => void`
  - 상단 “선택” 버튼 클릭 시 호출(선택 상태가 있어야 활성)
  - 주의: 분류 체계에서 어떤 레벨(중/소/세/세세)을 클릭해도 **결국 대분류(major) 선택을 확정**하는 용도로 쓰임

### 3) 데이터 소스 / 매핑 규칙

#### 3-1. 산업군(대분류)
- 소스: `data/Industry/industry_tree.json` (상위에서 `IndustryNode[]`로 전달)
- 표시 규칙:
  - `EXCLUDED_MAJOR_NAME = "가구 내 고용 활동 및 달리 분류되지 않은 자가 소비 생산 활동"`는 제외
  - 남은 20개를 4x5 그리드로 노출
  - 카드 좌측에 순번 뱃지(1~20) 표시

#### 3-2. 직무 분야 / 직무·직업
- 소스: `data/Industry/job_taxonomy_payload.json`
  - `categories: SaraminCategory[]`
    - `{ saraminCategoryId, saraminCategoryName }`
  - `jobs: SaraminJob[]`
    - `{ saraminCategoryId, saraminCategoryName, saraminJobName }`
- 매핑:
  - 분야 선택 시 `selectedCategoryId = saraminCategoryId`
  - 우측 직무 목록 = `jobs.filter(job => job.saraminCategoryId === selectedCategoryId)`
  - 직무 선택 값 = `selectedJobName = saraminJobName` (문자열)

### 4) 화면/상태(State) 및 전환 규칙

#### 4-1. `IndustrySelectModal` 내부 상태
- `step: "industry" | "job"` (초기값 `"industry"`)
- `selectedMajorInModal: IndustryNode | null`
- `classificationMajor: IndustryNode | null`
  - 분류 체계 모달에 전달되는 대분류
- `selectedCategoryId: number | null`
- `selectedJobName: string`

#### 4-2. open/close 시 초기화 규칙
- `open`이 `false`가 되면(`useEffect`):
  - `selectedMajorInModal = null`
  - `classificationMajor = null`
  - `step = "industry"`
  - `selectedCategoryId = null`
  - `selectedJobName = ""`

#### 4-3. 단계별 UI 구성

##### (A) 1단계: 산업군 선택 (`step === "industry"`)
- 본문: 20개 산업군 카드 그리드
- 카드 클릭: `selectedMajorInModal = major`
- 상단 버튼:
  - “상세보기”
    - 활성 조건: `selectedMajorInModal != null`
    - 클릭 시: `classificationMajor = selectedMajorInModal` → `IndustryClassificationModal` open
  - “선택”
    - 활성 조건: `selectedMajorInModal != null`
    - 클릭 시: `goToJobStep()` 실행 → `step = "job"`, `selectedCategoryId=null`, `selectedJobName=""`

##### (B) 2단계: 세부 직무 선택 (`step === "job"`)
- 본문: 좌우 2컬럼
  - 좌측: 분야 리스트(`JOB_CATEGORIES`)
    - 클릭 시 `selectedCategoryId` 설정 + `selectedJobName` 초기화
  - 우측: 직무·직업 리스트(`jobsForSelectedCategory`)
    - 클릭 시 `selectedJobName` 설정
- 상단 버튼:
  - “선택”
    - 활성 조건: `selectedJobName`이 비어있지 않음
    - 클릭 시: `onSelect(selectedMajorInModal, selectedJobName)` 호출 후 `onClose()`

### 5) `IndustryClassificationModal` 상세 동작

#### 5-1. 목적
- 사용자가 “어떤 산업군을 선택해야 할지 애매할 때” 분류 체계를 참고하도록 제공
- 실제로는 중/소/세/세세 레벨 탐색이 가능하지만, 최종 확정은 “대분류 선택 확정”으로 귀결된다.

#### 5-2. 내부 상태/탐색
- 내부 선택 상태(모달 open 시 모두 초기화):
  - `selectedMiddle`, `selectedSmall`, `selectedDetail`, `selectedSubDetail`
- 중분류 클릭 → 소/세/세세 선택 초기화
- 소분류 클릭 → 세/세세 초기화
- 세분류 클릭 → 세세 초기화
- 세세 클릭 → 해당 값만 설정

#### 5-3. 선택 버튼 활성 조건
- `hasSelection = selectedMiddle || selectedSmall || selectedDetail || selectedSubDetail`
- 상단 “선택” 버튼:
  - `hasSelection === true` 그리고 `onConfirmMajor`가 존재할 때만 활성
  - 클릭 시 `onConfirmMajor()` 호출

#### 5-4. 확정 시 상위 모달과의 연결
- `IndustrySelectModal.handleConfirmFromClassification()` 흐름:
  - `selectedMajorInModal = classificationMajor`
  - 분류 모달 닫기: `classificationMajor = null`
  - `goToJobStep()` 호출로 2단계(세부 직무 선택)로 이동

### 6) 부모(`DiagnosisPage`) 연동 규칙
- step 1 서브 step 1의 산업군 버튼 클릭 → `industrySelectModalOpen = true`
- `IndustrySelectModal.onSelect(major, jobName)` 호출 시:
  - `selectedMajor = major`
  - `form.industry = major.name`
  - `form.job = jobName`
  - 모달 닫기
- 우측 “세부 직무” 입력은 별도 드롭다운이 아니라 **읽기 전용 input**이며, 모달에서 선택된 값이 반영된다.
  - `disabled = !form.industry`

### 7) 예외/제약 사항
- 1단계에서 대분류를 선택하지 않으면:
  - “선택” 버튼 비활성
  - “상세보기” 버튼 비활성
- 2단계에서 분야를 선택하지 않으면:
  - 우측 안내문 표시(“왼쪽에서 분야를 먼저 선택하세요”)
- 2단계에서 직무를 선택하지 않으면:
  - “선택” 버튼 비활성

### 8) 접근성(코드 기준)
- 두 모달 모두:
  - `role="dialog"`, `aria-modal="true"`, `aria-labelledby` 지정
  - overlay 클릭으로 닫기 지원

