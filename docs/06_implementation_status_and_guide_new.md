# kapp_assessment_new – 구현 현황 및 미구현 구현 가이드

> **목적**: origin → new 구현 여부 정리, 구현된 부분 상세, 미구현 구현 방향, origin 참고 목록

---

## 6.1 구현 현황 요약 (origin → new)

| 기능/화면 | origin 존재 | new 구현 | 비고(라우트·데이터 소스 등) |
|-----------|-------------|----------|-----------------------------|
| **홈** | ✅ | ❌ | new에는 랜딩 없음. `/`는 로그인 자리표시 |
| **KAPP 진단** | ✅ | ❌ | assessment-kapp 흐름. data/·라우트 없음 |
| **마이 대시보드(학습자)** | ✅ | ❌ | dashboard-kapp 대응. 라우트 없음 |
| **교육 큐레이션** | ✅ | ❌ | education. 라우트·courses JSON 없음 |
| **나의 성장** | ✅ | ❌ | my-growth. 라우트 없음 |
| **알림·설정** | ✅ | ❌ | notifications. 라우트 없음 |
| **관리자 대시보드 – 요약 KPI** | ✅ | ⚠️ | `/dashboard`에 KPI 카드 있음. 숫자 하드코딩(summaryStats 미연동) |
| **관리자 – 부서별 차트** | ✅ | ✅ | departmentPerformance, departmentSkillPerformance. `/dashboard` |
| **관리자 – 역량/벤치마크** | ✅ | ✅ | competencyRawData, organizationData, industryBenchmarks. `/dashboard`, `/dashboard/competency`, BenchmarkSection |
| **관리자 – 진행 현황** | ✅ | ❌ | progressPrograms 미사용. UI 없음 |
| **관리자 – 임직원 테이블** | ✅ | ❌ | employees 미사용. 라우트는 Sidebar에 `/dashboard/employees` 있으나 페이지 미구현 |
| **관리자 – AI 인사이트** | ✅ | ❌ | insights 미사용. `/dashboard/insights` 라우트만 |
| **관리자 – 스킬 갭 히트맵** | ✅ | ❌ | heatmap 미사용 |
| **관리자 – 업계 벤치마킹 레이더** | ✅ | ✅ | BenchmarkSection. organizationData + industryBenchmarks |
| **관리자 – 전략–스킬 매핑** | ✅ | ❌ | strategyMapper 미사용 |
| **관리자 – ROI 계산기** | ✅ | ❌ | roi 미사용 |
| **관리자 – 고성과자** | ✅ | ❌ | highPerformer 미사용 |
| **관리자 – 스킬 리스크** | ✅ | ❌ | riskManagement 미사용 |

**요약**: 현재 new에는 **관리자 대시보드** 관련 라우트·컴포넌트·data/ JSON 일부만 있고, **진단·학습자 대시보드·교육·나의 성장·알림** 및 관리자 내 **진행 현황·임직원·인사이트·히트맵·전략·ROI·고성과자·리스크**는 미구현이다.

---

## 6.2 new에서 이미 구현된 부분 상세

### 6.2.1 라우팅
- **app/page.tsx**: `/` — 로그인. 제출 시 `router.push('/dashboard')`.
- **app/admin/page.tsx**: `/admin` — “관리자 대시보드 (로그인 후 접근)” 문구만.
- **app/dashboard/layout.tsx**: Sidebar + children + RightPanel.
- **app/dashboard/page.tsx**: `/dashboard` — 대시보드 개요.
- **app/dashboard/competency/page.tsx**: `/dashboard/competency` — 역량 분석.

### 6.2.2 레이아웃
- **Sidebar**: components/layout/Sidebar. 로고·접기·대시보드(개요/역량 분석)·직원 관리·분석/리포트·교육 프로그램·AI 인사이트·설정. 활성은 blue-50/blue-700.
- **Header**: components/layout/Header. 제목·서브타이틀·actions(역량 분석에서 탭).
- **RightPanel**: components/layout/RightPanel.
- **메인**: 각 페이지에서 `<main>` + 스크롤 영역.

### 6.2.3 컴포넌트·데이터
- **대시보드 개요**: Card, Badge, Icon, KPI 카드 4개(하드코딩), DepartmentPerformanceChart(departmentPerformance), DepartmentSkillFilter + DepartmentSkillChartWithFilter(departmentSkillPerformance), BenchmarkSection(organizationData, industryBenchmarks, loadBenchmarkData, transformBenchmark).
- **역량 분석**: FilterBar, SummaryKpiRow, DepartmentCompetency, TrendLineChart, 탭(현황&비교/격차&리스크/전략&성과). competencyRawData, useCompetencyFilter. ChartView/TableView/ViewToggle 등 컴포넌트 존재.
- **사용 중인 data/**: departmentPerformance.ts, departmentSkillPerformance.ts, competencyRawData.ts, organizationData.json, industryBenchmarks.json, loadBenchmarkData.ts, transformBenchmark.ts.

### 6.2.4 스타일
- **Tailwind**. **키 컬러**: blue(활성·강조), yellow(진행), purple(향상). DASHBOARD_LAYOUT_DESIGN.md, globals.css(Noto Sans KR, CSS 변수) 기준.

---

## 6.3 미구현 부분 구현 방향

### KAPP 진단
- **목표**: origin의 assessment-kapp 흐름(정보 입력 → 문항 → 제출 → 결과 저장)을 Next.js로 이전.
- **구현 방향**:  
  - `app/assessment/` 또는 `app/diagnosis/` 아래에 정보 입력 페이지 → 문항 페이지 → 제출 처리.  
  - 제출 시 결과를 브라우저 저장소 또는 추후 API에 저장 후, 마이 대시보드(`/dashboard/my` 또는 `/my-dashboard`)로 리다이렉트.  
  - 데이터: data/에 `assessmentQuestions.json`, `assessmentResultSample.json` 등 추가하거나, 추후 API Route/백엔드에서 문항·제출·결과 제공.

### 학습자 마이 대시보드
- **목표**: origin의 dashboard-kapp 대응. 진단 결과 기반 DNA·KAPP 점수·레이더·시장 포지션 등.
- **구현 방향**:  
  - `app/dashboard/my` 또는 `app/my-dashboard/page.tsx` 등 라우트 추가.  
  - 데이터: data/에 `myDashboardResultSample.json` 같은 결과 예시를 두고, 해당 페이지에서 읽어 DNA·점수·레이더·시장 포지션 블록 렌더.  
  - 추후 로그인·API 연동 시 “내 진단 결과 조회” API로 교체.

### 교육 큐레이션
- **목표**: 과정 목록·필터·추천·상세.
- **구현 방향**:  
  - data/에 `courses.json`(과정 목록: 제목·카테고리·난이도·기간·산업·추천 등) 추가.  
  - `app/education/` 또는 `app/dashboard/education/` 아래 목록 페이지(필터·그리드/리스트) + 상세 페이지 또는 모달.  
  - 추천은 진단 결과 또는 사용자 속성과 매칭해 필터/하이라이트.

### 나의 성장
- **목표**: 1% 팁·AI 멘토·인증서.
- **구현 방향**:  
  - origin의 my-growth 로직 참고. `app/my-growth/page.tsx` 등.  
  - 팁·진행 상황은 로컬 저장소 또는 API. AI 멘토는 채팅 UI + (추후) API. 인증서는 진단 결과 기반 미리보기·다운로드/공유.

### 알림·설정
- **목표**: 설정 토글·알림 권한.
- **구현 방향**:  
  - `app/dashboard/settings/` 또는 `app/settings/` 페이지 하나.  
  - 항목별 토글(오늘의 팁 알림·연속 학습 알림 등) → 설정을 data/의 `settings.json` 형태로 저장하거나 API PATCH.  
  - 푸시 권한 요청은 브라우저 API + 백엔드 등록.

---

## 6.4 origin에 있던 기능·로직 중 new 문서화 시 참고할 목록

- **스킬 갭 히트맵**: 부서·스킬 선택 → 셀 컬러(등급)·교육 배정 버튼. origin js·heatmap 데이터 구조 참고.
- **벤치마킹 레이더**: 비교 부서·업계 선택 → 레이더 계산·인사이트. new의 BenchmarkSection·transformBenchmark와 동일한 논리 확장.
- **전략 매핑**: 전략 키워드 입력 → AI 분석 → 추천 인력·교육·로드맵. origin 전략–스킬 매핑 로직·strategyMapper 구조 참고.
- **ROI 계산기**: 인원·1인당 비용·스킬 향상 % 입력 → 투자·수익·ROI %. origin ROI 공식·roi 데이터 참고.
- **고성과자 복제**: 팀 선택 → 상위 N% Golden Standard 레이더·갭 분석. origin highPerformer·레이더 로직 참고.
- **스킬 리스크**: 리스크 레벨 필터 → 긴급/높음/보통/낮음 카운트·상세 리스트. origin riskManagement 참고.
- **진단**: 정보 입력 폼·문항 뱅크·진행률·제출·저장·리다이렉트. origin assessment-kapp.html·kapp-assessment.js 등 참고.
- **마이 대시보드**: DNA·KAPP·레이더·시장 포지션·커리어·IDP·게이미피케이션. origin dashboard-kapp.html·dashboard-kapp.js 참고.
- **교육**: 과정 목록·필터·상세 모달·학습 경로. origin education.html·education-data 참고.
- **나의 성장**: 1% 팁·AI 멘토·인증서. origin my-growth.html·my-growth.js 참고.
- **알림·설정**: 토글·푸시 권한. origin notifications.html 참고.

**위 6.3의 미구현 구현 시, origin의 해당 HTML/JS 로직을 참고할 것.**
