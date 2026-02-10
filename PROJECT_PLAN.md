# 관리자 대시보드 프로토타입 - 상세 기획서

## [1] 진행 단계 (상세 기획서)

### 프로젝트 목표 (가상프론트 범위)

**목표**: 조직 관리자용 분석 및 관리 대시보드의 프로토타입 구축
- **범위**: UI 구조와 레이아웃 중심, 실제 데이터 연동 제외
- **목적**: 사용자 플로우와 화면 구성 검증을 위한 가상프론트
- **제약사항**: 
  - 모든 데이터는 Mock 데이터 사용
  - 비즈니스 로직 구현 금지
  - 스타일은 최소한(레이아웃/구조 우선)

---

### 페이지/라우팅 목록 (스펙 기반)

YAML 스펙에 따르면 단일 페이지(`admin.html`)이지만, Next.js App Router 구조상 다음과 같이 구성:

1. **`/` (루트)**: 허브 페이지 - 대시보드 섹션 링크 목록
2. **`/admin`**: 메인 관리자 대시보드 (모든 섹션 포함)

**참고**: 스펙상 단일 페이지이므로 `/admin`에 모든 섹션을 스크롤 가능한 형태로 배치

---

### 공통 레이아웃 설계

#### 전체 구조
```
┌─────────────────────────────────────┐
│           Navbar (상단)              │
├──────────┬──────────────────────────┤
│          │      Header              │
│ Sidebar  ├──────────────────────────┤
│ (좌측)   │                          │
│          │      Main Content        │
│          │      (스크롤 가능)        │
│          │                          │
│          │                          │
└──────────┴──────────────────────────┘
```

#### 컴포넌트 역할
- **Navbar**: 브랜드 로고, 주요 네비게이션 링크, 활성 링크 표시
- **Sidebar**: 섹션별 빠른 이동 메뉴 (선택적)
- **Header**: 페이지 제목, 검색, 프로필 아이콘 (자리표시자)
- **Main**: 스크롤 가능한 메인 콘텐츠 영역
- **Footer**: (선택적, 스펙에 없음)

---

### 공통 컴포넌트 설계 목록

#### 레이아웃 컴포넌트
1. **Navbar** - 상단 네비게이션 바
2. **Sidebar** - 좌측 사이드바 메뉴
3. **Header** - 페이지 헤더 (타이틀/검색/프로필)
4. **MainLayout** - 전체 레이아웃 래퍼

#### 카드/섹션 컴포넌트
5. **PageHeader** - 섹션 헤더 (타이틀/서브타이틀/액션 버튼)
6. **StatCard** - 통계 카드 (아이콘/라벨/값/델타)
7. **StatCardGrid** - StatCard 그리드 레이아웃
8. **ChartCard** - 차트 카드 (타이틀/컨트롤/차트 영역)
9. **ProgressCard** - 진행 상황 카드
10. **ProgressCardGrid** - ProgressCard 그리드
11. **InsightCard** - 인사이트 카드
12. **InsightCardGrid** - InsightCard 그리드
13. **RiskSummaryCard** - 리스크 요약 카드

#### 테이블/리스트 컴포넌트
14. **DataTable** - 데이터 테이블 (검색/컬럼/행/액션)
15. **InsightList** - 인사이트 리스트
16. **RiskDetailList** - 리스크 상세 리스트
17. **GapAnalysisPanel** - 갭 분석 패널

#### 필터/폼 컴포넌트
18. **FilterTabs** - 필터 탭 (all/ongoing/completed)
19. **FilterPanel** - 필터 패널 (셀렉트/버튼)
20. **InputPanel** - 입력 패널 (텍스트 입력 + 액션 버튼)
21. **Form** - 폼 컴포넌트 (ROI 계산기용)

#### 차트 컴포넌트 (Placeholder)
22. **BarChartPlaceholder** - 막대 차트 자리표시자
23. **LineChartPlaceholder** - 선 차트 자리표시자
24. **PieChartPlaceholder** - 파이 차트 자리표시자
24. **DoughnutChartPlaceholder** - 도넛 차트 자리표시자
25. **RadarChartPlaceholder** - 레이더 차트 자리표시자
26. **HeatmapPlaceholder** - 히트맵 자리표시자
27. **CustomProfileChartPlaceholder** - 커스텀 프로필 차트 자리표시자

#### 결과/패널 컴포넌트
28. **ResultPanels** - 결과 패널 (여러 섹션 포함)
29. **Heatmap** - 히트맵 (그리드/범례)

---

### 페이지별 구현 순서 (우선순위)

#### Phase 1: 레이아웃 기초 (1단계)
- [x] 전체 레이아웃 골격 (Navbar + Sidebar + Header + Main)
- [x] Sidebar 컴포넌트 (메뉴 구조)
- [x] Header 컴포넌트 (타이틀/검색/프로필 자리표시자)
- [x] 루트 페이지 (허브 - 링크 목록)

#### Phase 2: 기본 섹션 (2단계)
- [ ] PageHeader 컴포넌트
- [ ] Overview Stats 섹션 (StatCard + StatCardGrid)
- [ ] Charts Row 섹션 (ChartCard + 차트 플레이스홀더)

#### Phase 3: 진행 상황 및 테이블 (3단계)
- [ ] Progress Tracking 섹션 (FilterTabs + ProgressCardGrid)
- [ ] Employee Table 섹션 (DataTable)

#### Phase 4: 인사이트 및 히트맵 (4단계)
- [ ] AI Insights 섹션 (InsightCardGrid)
- [ ] Skill Gap Heatmap 섹션 (FilterPanel + Heatmap)

#### Phase 5: 벤치마크 및 전략 (5단계)
- [ ] Industry Benchmark 섹션 (FilterPanel + RadarChart + InsightList)
- [ ] Strategy Skill Mapper 섹션 (InputPanel + ResultPanels)

#### Phase 6: ROI 및 분석 (6단계)
- [ ] ROI Calculator 섹션 (Form + ResultPanels)
- [ ] High Performer Cloning 섹션 (FilterPanel + RadarChart + GapAnalysisPanel)
- [ ] Skill Risk Management 섹션 (FilterPanel + RiskSummaryCards + RiskDetailList)

---

### 각 단계 산출물 (어떤 파일이 생기는지)

#### Phase 1 (1단계) - 레이아웃 기초
```
app/
  layout.tsx (수정) - 전체 레이아웃 구조
  page.tsx (수정) - 허브 페이지
components/
  layout/
    Sidebar.tsx (신규)
    Header.tsx (신규)
    Navbar.tsx (신규)
```

#### Phase 2 (2단계) - 기본 섹션
```
app/
  admin/
    page.tsx (신규) - 관리자 대시보드 메인 페이지
components/
  common/
    PageHeader.tsx (신규)
    StatCard.tsx (신규)
    StatCardGrid.tsx (신규)
    ChartCard.tsx (신규)
  charts/
    BarChartPlaceholder.tsx (신규)
    LineChartPlaceholder.tsx (신규)
    PieChartPlaceholder.tsx (신규)
    DoughnutChartPlaceholder.tsx (신규)
```

#### Phase 3 (3단계) - 진행 상황 및 테이블
```
components/
  common/
    FilterTabs.tsx (신규)
    ProgressCard.tsx (신규)
    ProgressCardGrid.tsx (신규)
    DataTable.tsx (신규)
```

#### Phase 4 (4단계) - 인사이트 및 히트맵
```
components/
  common/
    InsightCard.tsx (신규)
    InsightCardGrid.tsx (신규)
    FilterPanel.tsx (신규)
  charts/
    HeatmapPlaceholder.tsx (신규)
```

#### Phase 5 (5단계) - 벤치마크 및 전략
```
components/
  charts/
    RadarChartPlaceholder.tsx (신규)
  common/
    InsightList.tsx (신규)
    InputPanel.tsx (신규)
    ResultPanels.tsx (신규)
```

#### Phase 6 (6단계) - ROI 및 분석
```
components/
  common/
    Form.tsx (신규)
    GapAnalysisPanel.tsx (신규)
    RiskSummaryCard.tsx (신규)
    RiskDetailList.tsx (신규)
  charts/
    CustomProfileChartPlaceholder.tsx (신규)
```

---

### 검수 체크리스트 (완료 기준)

#### Phase 1 완료 기준
- [ ] 전체 레이아웃이 Navbar + Sidebar + Header + Main 구조로 표시됨
- [ ] Sidebar에 메뉴 항목이 표시되고 활성 링크가 구분됨
- [ ] Header에 타이틀/검색/프로필 영역이 자리표시자로 표시됨
- [ ] 루트 페이지에서 대시보드 링크로 이동 가능
- [ ] 반응형 레이아웃 기본 구조 작동 (모바일에서 Sidebar 접기 가능)

#### Phase 2 완료 기준
- [ ] PageHeader 컴포넌트가 타이틀/서브타이틀/액션 버튼 영역 표시
- [ ] StatCard가 아이콘/라벨/값/델타 영역 표시
- [ ] StatCardGrid가 여러 StatCard를 그리드로 배치
- [ ] ChartCard가 타이틀/컨트롤/차트 영역 표시
- [ ] 차트 플레이스홀더가 적절한 크기로 표시됨

#### Phase 3 완료 기준
- [ ] FilterTabs가 탭 형태로 표시되고 선택 상태 표시
- [ ] ProgressCard가 프로그램 정보/상태/진행률 표시
- [ ] DataTable이 검색/컬럼/행/액션 영역 표시

#### Phase 4 완료 기준
- [ ] InsightCard가 우선순위/타이틀/설명 표시
- [ ] FilterPanel이 셀렉트/버튼 컨트롤 표시
- [ ] Heatmap 플레이스홀더가 그리드 형태로 표시

#### Phase 5 완료 기준
- [ ] RadarChart 플레이스홀더 표시
- [ ] InsightList가 리스트 형태로 표시
- [ ] InputPanel이 입력/버튼 영역 표시
- [ ] ResultPanels가 여러 섹션으로 구성됨

#### Phase 6 완료 기준
- [ ] Form 컴포넌트가 입력 필드/버튼 표시
- [ ] GapAnalysisPanel이 갭 분석 정보 표시
- [ ] RiskSummaryCard가 심각도별 카운트 표시
- [ ] RiskDetailList가 리스크 항목 리스트 표시

#### 전체 완료 기준
- [ ] 모든 섹션이 `/admin` 페이지에 스크롤 가능한 형태로 배치됨
- [ ] 모든 컴포넌트가 TypeScript 타입 안전성 확보
- [ ] Mock 데이터로 모든 섹션이 채워짐
- [ ] 레이아웃이 깨지지 않고 일관된 구조 유지
- [ ] 컴포넌트가 재사용 가능하게 분리됨

---

## [2] 1단계 구현 (레이아웃부터)

다음 단계로 진행합니다.
