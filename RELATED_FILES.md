# 부서별 역량 점수 비교 기능 관련 파일

이 문서는 "부서별 역량 점수 비교" 섹션의 차트/테이블 뷰 전환 기능을 구현하는 데 관련된 파일 목록과 각 파일의 역할을 설명합니다.

## 1. 데이터 파이프라인 (Data Pipeline)

| 파일 경로 | 역할 | 설명 |
| :--- | :--- | :--- |
| `data/competencyRawData.ts` | **데이터 소스** | 모든 역량 점수의 원본 데이터를 생성합니다. 현재는 결정론적(deterministic) 방식으로 점수를 생성하여 서버와 클라이언트 간 데이터 일관성을 보장합니다. |
| `app/dashboard/competency/hooks/useCompetencyFilter.ts` | **메인 데이터 훅** | 원본 데이터를 기반으로, 사용자가 선택한 기간과 부서에 맞게 데이터를 필터링합니다. `filteredData`(필터링된 원본), `barData`(부서별 평균 데이터), `trendData`(추이 데이터) 등 다양한 형태의 데이터를 계산하여 제공하는 핵심적인 훅입니다. |
| `app/dashboard/competency/hooks/useDepartmentCompetency.ts` | **부서별 데이터 가공 훅** | `filteredData`를 입력받아 부서별/종합 평균을 계산하는 훅입니다. `useCompetencyFilter`의 `barData` 로직과 중복되는 부분이 있어 현재 문제의 원인으로 의심되는 부분입니다. |

## 2. UI 컴포넌트 (UI Components)

| 파일 경로 | 역할 | 설명 |
| :--- | :--- | :--- |
| `app/dashboard/competency/page.tsx` | **메인 페이지** | 역량 분석 대시보드의 최상위 페이지입니다. `useCompetencyFilter` 훅을 호출하고, 그 결과를 각 주요 컴포넌트(`DepartmentCompetency`, `TrendLineChart` 등)에 전달하는 오케스트레이터 역할을 합니다. |
| `app/dashboard/competency/components/DepartmentCompetency.tsx` | **메인 컨테이너** | "부서별 역량 점수 비교" 섹션 전체를 감싸는 컨테이너입니다. `ViewToggle`을 통해 '그래프'와 '표' 뷰 상태를 관리하고, 상태에 따라 `ChartView` 또는 `TableView`를 렌더링합니다. |
| `app/dashboard/competency/components/ViewToggle.tsx` | **뷰 전환 토글** | '그래프형'/'표형' 뷰를 전환하는 UI 버튼입니다. |

### 2.1. 그래프 뷰 (Chart View)

| 파일 경로 | 역할 | 설명 |
| :--- | :--- | :--- |
| `app/dashboard/competency/components/ChartView.tsx` | **차트 뷰 래퍼** | `DepartmentBarChart`를 감싸고, 데이터가 없을 경우 "데이터 없음" 메시지를 표시하는 등의 역할을 하는 컨테이너입니다. |
| `app/dashboard/competency/components/DepartmentBarChart.tsx` | **막대 차트** | `recharts` 라이브러리를 사용하여 실제 부서별 비교 막대 차트를 그리는 컴포넌트입니다. |
| `app/dashboard/competency/components/CustomTooltip.tsx` | **차트 툴팁** | 차트에 마우스를 올렸을 때 표시되는 커스텀 툴팁 UI입니다. |

### 2.2. 표 뷰 (Table View)

| 파일 경로 | 역할 | 설명 |
| :--- | :--- | :--- |
| `app/dashboard/competency/components/TableView.tsx` | **테이블 뷰** | 데이터를 표 형태로 보여주는 메인 컴포넌트입니다. 정렬, 페이지네이션, 하이라이팅 등의 기능이 포함됩니다. |
| `app/dashboard/competency/components/ScoreBarCell.tsx` | **점수 셀** | 테이블 내에서 점수를 막대그래프와 함께 시각적으로 표시하는 셀 컴포넌트입니다. |
| `app/dashboard/competency/components/Pagination.tsx` | **페이지네이션** | 테이블 하단의 페이지 이동 UI를 담당하는 컴포넌트입니다. |

