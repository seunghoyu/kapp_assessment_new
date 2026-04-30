# kapp_assessment_new – 프론트엔드 관점 프로젝트 개요

> **역할**: 화면 구성, 데이터 소스, 상호작용, 상태·이벤트, **디자인·퍼블리싱**  
> **초점**: 어떤 데이터를 어디서 쓰고, 사용자 액션 시 무엇이 일어나는지, 퍼블리셔가 지킬 디자인·마크업 규칙 (new 전용)

---

## 1. 페이지·라우팅 구조 (app/ 기준)

| 경로 | 파일 | 역할 |
|------|------|------|
| `/` | app/page.tsx | 로그인(자리표시). 제출 시 `/dashboard`로 이동 |
| `/admin` | app/admin/page.tsx | 관리자 안내 문구만 표시 |
| `/dashboard` | app/dashboard/page.tsx | 대시보드 개요(KPI·차트·벤치마킹) |
| `/dashboard/competency` | app/dashboard/competency/page.tsx | 역량 분석(필터·KPI·막대·추이·탭) |

- **app/layout.tsx**: 루트 레이아웃(폰트·메타·globals.css). Navbar 미포함.  
- **app/dashboard/layout.tsx**: **Sidebar + 메인 영역 + RightPanel**. 대시보드 하위 라우트 공통.

---

## 2. 공통 레이아웃

### 2.1 구성
- **Sidebar**(좌측): 로고·접기 버튼, 대시보드(개요/역량 분석) 하위 메뉴, 직원 관리·분석/리포트·교육 프로그램·AI 인사이트·설정 링크. 활성 경로는 `bg-blue-50 text-blue-700` 등 포인트 컬러.
- **Header**: 페이지별로 메인 영역 상단에 배치. 제목·서브타이틀·(선택) 액션. 역량 분석에서는 탭 버튼이 헤더 액션으로 들어감.
- **RightPanel**: 대시보드 레이아웃에서 우측 패널.
- **메인 영역**: 스크롤 가능한 콘텐츠. 배경 `bg-[#fdfdfd]` 등.

### 2.2 조합 방식
- `/`, `/admin`에는 사이드바 없음.  
- `/dashboard`, `/dashboard/competency`는 **dashboard layout**으로 Sidebar + children + RightPanel 안에서 각 page가 Header + main을 렌더.

---

## 3. 데이터 소스 매핑 (화면 ↔ data/)

| 화면/기능 | 참조 데이터 (data/) |
|-----------|----------------------|
| 대시보드 개요 – KPI 카드 | **없음**(하드코딩). 추후 summaryStats 등 연동 가능 |
| 대시보드 개요 – 부서별 역량 현황(년/월 필터) | **departmentSkillPerformance.ts** |
| 대시보드 개요 – 부서별 성과 차트 | **departmentPerformance.ts** (periodOptions, series) |
| 대시보드 개요 – 역량 벤치마킹 | **organizationData.json**, **industryBenchmarks.json** (loadBenchmarkData) |
| 역량 분석 – 필터·KPI·막대·추이 | **competencyRawData.ts** (competencyTypes 포함) |
| 역량 분석 – 벤치마크·인사이트 | **transformBenchmark.ts** (organizationData·industryBenchmarks 기반) |

**미사용(추후 사용 예정)**: summaryStats.json, employees.json, progressPrograms.json, insights.json, heatmap.json, riskManagement.json, roi.json, strategyMapper.json, highPerformer.json 등 — 현재 new UI에서 import되지 않음.

---

## 4. 구현된 UI·로직

### 4.1 대시보드 개요 (app/dashboard/page.tsx)
- **KPI 카드 4개**: 총 직원 수, 진행 중 프로그램, 완료율, 평균 스킬 레벨. Badge·Icon·숫자 하드코딩.
- **부서별 역량 현황**: Card + DepartmentSkillFilter(년/월) + DepartmentSkillChartWithFilter. 필터 변경 시 `useDepartmentSkillFilter` 상태 갱신 → filteredData로 차트 갱신.
- **스킬 분포**: 플레이스홀더 영역만.
- **요약 블록 3개**: 이번 달 요약·주요 성과·다음 액션. 정적/하드코딩.
- **BenchmarkSection**: 부서·업계 선택 → RadarChart(부서 vs 업계 상위 10%) + InsightList(강점/개선). `useBenchmarkFilters` + `transformBenchmark`.

### 4.2 역량 분석 (app/dashboard/competency)
- **FilterBar**: 부서 다중 선택·기간(date range). `useCompetencyFilter`의 selectedDepartments, dateRange 반영. 초기화 버튼으로 reset.
- **탭**: 현황&비교 / 격차&리스크 / 전략&성과. **현황&비교**만 구현; 나머지는 “준비중” 플레이스홀더.
- **현황&비교 탭**:  
  - SummaryKpiRow: 평균·최고/최저 부서.  
  - DepartmentCompetency: 부서별 역량 막대(competencyTypes 기준).  
  - 기간별 추이: 일별/월별 전환 버튼 + TrendLineChart.  
- **벤치마크**: BenchmarkSection에서 부서·업계 선택 시 레이더·인사이트(transformBenchmark).

### 4.3 차트·테이블
- **DepartmentPerformanceChart**: departmentPerformance 시리즈 막대 차트.  
- **DepartmentSkillChartWithFilter**: departmentSkillPerformance 기반, 년/월 필터.  
- **RadarChart**: 벤치마킹 부서 vs 업계 스킬.  
- **TrendLineChart**: competencyRawData 기반 일/월 집계 추이.  
- **TableView** 등: 역량 분석용 테이블/뷰 전환 컴포넌트 존재. (페이지에서 사용 여부는 구현에 따라 다름.)

---

## 5. 미구현 부분 (origin 참고용)

- **진단**: assessment-kapp 흐름(정보 입력 → 문항 → 제출 → 결과 저장). new에는 라우트·컴포넌트 없음.  
- **학습자 마이 대시보드**: dashboard-kapp 대응. DNA·KAPP·레이더·시장 포지션 등.  
- **교육 큐레이션**: 과정 목록·필터·상세 모달.  
- **나의 성장**: 1% 팁·AI 멘토·인증서.  
- **알림·설정**: 설정 토글·알림 권한.  
- **관리자 추가 블록**: 임직원 테이블·AI 인사이트 그리드·스킬 갭 히트맵·전략 매핑·ROI 계산기·고성과자·스킬 리스크.  
origin의 해당 HTML/JS가 어떤 데이터·동작을 했는지 요약만 두고, “나중에 구현 시 참고” 수준으로 정리해 두면 됨.

---

## 6. 상태·이벤트 (구현된 페이지)

- **대시보드 개요**:  
  - `useDepartmentSkillFilter`: selectedYear, selectedMonth → filteredData. 년/월 변경 시 차트만 갱신(페이지 전환 없음).  
- **역량 분석**:  
  - `useCompetencyFilter`: selectedDepartments, dateRange, trendMode → filteredData, barData, trendData, summary. 부서/기간/일·월 전환 시 테이블·차트·KPI 재계산.  
  - 탭: activeTab → “현황&비교” / “격차&리스크” / “전략&성과” 전환.  
- **벤치마크**:  
  - `useBenchmarkFilters`: selectedDepartment, selectedIndustry → currentDepartmentData, currentIndustryData. 선택 변경 시 레이더·인사이트 재계산.

---

## 7. 디자인·퍼블리셔 관점

### 7.1 참조 문서·파일
- **DASHBOARD_LAYOUT_DESIGN.md**: 레이아웃 구조, 컴포넌트별 디자인 시스템(클래스·색·간격) 정리. 퍼블 시 최우선 참고.
- **app/globals.css**: CSS 변수(`--background`, `--foreground`), `@theme`, 폰트(Noto Sans KR). 전역 톤 결정.
- **Tailwind**: 유틸리티 기반. 새 스타일 추가 시 기존 유틸 조합 우선, 불가 시만 커스텀 클래스.

### 7.2 퍼블리셔 관점 – 마크업·스타일 규칙
- **구조**: 시맨틱 유지. 제목은 `h1`/`h2` 순서, 섹션은 `section`+`h2`(또는 `sr-only`), 리스트는 `ul`/`ol`/`li`, 버튼·링크 역할 구분.
- **클래스**: Tailwind만 사용. `className`에 디자인 토큰(색·간격·타이포)을 직접 나열. 컴포넌트 재사용 시 동일 규격 유지(Card, Badge, Button 등).
- **일관성**: Sidebar/Header/Card/Table/Badge/Button 스펙은 DASHBOARD_LAYOUT_DESIGN.md와 동일하게. 수치 변경 시 해당 문서도 함께 수정.

### 7.3 컴포넌트별 디자인 스펙 (퍼블 시 체크)
| 컴포넌트 | 배경·보더 | 타이포·색 | 비고 |
|----------|-----------|-----------|------|
| **Sidebar** | `bg-white`, `border-r border-gray-200` | 비활성 `text-gray-700`, 활성 `bg-blue-50 text-blue-700`, 아이콘 `text-gray-500`/`text-blue-600` | 접기 시 `w-16`, 펼침 `w-56` |
| **Header** | `bg-white`, `border-b border-gray-200`, `h-16` | 제목 `text-gray-900 text-xl font-semibold`, 서브 `text-gray-500 text-sm` | |
| **Card** | `bg-white border border-gray-200 shadow-sm rounded-lg p-6` | 제목 `text-gray-900 text-base font-semibold`, 본문 `text-gray-700 text-sm`, 보조 `text-gray-500 text-xs` | |
| **Badge** | `px-2 py-1 text-xs font-medium rounded` | blue `bg-blue-100 text-blue-700`, yellow `bg-yellow-100 text-yellow-700`, purple `bg-purple-100 text-purple-700`, gray `bg-gray-100 text-gray-700` | |
| **Table** | `bg-white border border-gray-200 rounded-lg overflow-hidden` | 헤더 `bg-gray-50 text-gray-900 text-sm font-semibold px-6 py-3`, 행 `px-6 py-4`, 호버 `hover:bg-gray-50` | |
| **Button Primary** | `bg-blue-500 text-white hover:bg-blue-600 px-4 py-2 rounded-md` | | |
| **Button Secondary** | `bg-white border border-gray-300 text-gray-700 hover:bg-gray-50` | | |
| **StatCard(KPI)** | Card 동일 | 라벨 `text-gray-500 text-xs font-medium`, 값 `text-gray-900 text-2xl font-semibold`, 델타는 blue-50/yellow-50 등 | |

### 7.4 키 컬러·톤
- **전체 톤**: “차분한 대시보드 + 포인트 컬러로만 의미 강조”. 화이트·라이트 그레이 기반, 포인트는 소량만.
- **키 컬러**:  
  - **Blue**: 활성 메뉴·강조·증가·기본 배지 (`blue-50`/`blue-100`/`blue-500`/`blue-600`/`blue-700`).  
  - **Yellow**: 진행중·경고·주의 (`yellow-50`/`yellow-100`/`yellow-700`).  
  - **Purple**: 향상·특별 강조 (`purple-100`/`purple-700`).  
  - **Gray**: 비활성·보조 텍스트·테이블 헤더 (`gray-50`~`gray-700`).
- **메인 영역 배경**: `bg-[#fdfdfd]` 또는 `bg-gray-50` 수준.

### 7.5 반응형·접근성 (퍼블리셔)
- **반응형**: 그리드 `grid-cols-1 md:grid-cols-2 lg:grid-cols-4` 등 브레이크포인트로 카드·차트 배치. 좁은 화면에서 Sidebar 접기(`w-16`), 메인만 넓게.
- **접근성**: 버튼·링크에 의미 있는 텍스트 또는 `aria-label`. 아이콘만 있으면 `aria-label`/`title` 보완. 포커스 링(`focus:ring-2 focus:ring-blue-500` 등) 유지. 제목 계층·landmark 일관되게.

### 7.6 스타일 요약
- **Tailwind** 사용. **키 컬러**: blue(활성·강조), yellow(진행중), purple(향상) 등. DASHBOARD_LAYOUT_DESIGN.md·globals.css 기준.  
- 카드·테이블·배지: border-gray-200, bg-white, rounded-lg, Badge variant(blue/yellow/purple 등).

---

## 8. 정리

- new의 **실제 라우팅**은 `/`, `/admin`, `/dashboard`, `/dashboard/competency`이며, **공통 레이아웃**은 대시보드 하위에서 Sidebar + Header + 메인 + RightPanel.  
- **데이터**는 data/ TS·JSON에서 직접 로드하며, **구현된 UI**는 4절 기준. **미구현** 영역은 5절처럼 origin 요약만 명시.  
- **디자인·퍼블리셔**는 7절(참조 문서, 마크업·스타일 규칙, 컴포넌트 스펙, 키 컬러, 반응형·접근성)과 DASHBOARD_LAYOUT_DESIGN.md를 기준으로 일관된 퍼블을 유지하면 됨.
