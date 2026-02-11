# kapp_assessment_new – 데이터 분석가 관점 프로젝트 개요

> **역할**: data/ JSON 스키마·역할, 데이터 흐름, 정합성·확장, origin 대응  
> **초점**: “어떤 필드가 있고, 어떤 용도인지” 역할·의미 위주

---

## 1. data/ JSON·TS 스키마 요약 (파일별)

| 파일 | 역할·의미 | 주요 필드/구조 |
|------|-----------|-----------------|
| **summaryStats.json** | 요약 통계(전체 임직원·진단 완료·교육 수강·평균 역량). 현재 미사용 | id, label, value, unit, delta, trend |
| **departmentPerformance.ts** | 부서별 성과(기간 선택용). 부서별 역량 차트 | periodOptions, selectedPeriod, series[] { department, value } |
| **departmentSkillPerformance.ts** | 년/월별 부서별 스킬 값. 부서 스킬 차트·필터 | 배열: { year, month, data[] { department, value } } |
| **competencyRawData.ts** | 역량 원시(부서·날짜·역량 타입·점수). TS에서 날짜 범위·부서·competency 조합으로 생성 | department, date(YYYY-MM-DD), competency(지식/적용/성과/생산성), score |
| **organizationData.json** | 조직 부서 정보. 벤치마크 부서 선택·레이더 | departments: { [key]: { name, members, skills: { [스킬명]: 점수 } } } |
| **industryBenchmarks.json** | 업계별 벤치마크 스킬 점수. 벤치마크 비교 | { [업계key]: { name, skills: { [스킬명]: 점수 } } } |
| **employees.json** | 임직원 목록(예정). 미사용 | (구조는 origin/추후 정의에 따름) |
| **progressPrograms.json** | 진행 프로그램. 미사용 | (구조는 origin/추후 정의에 따름) |
| **insights.json** | AI 인사이트. 미사용 | (우선순위·타입·제목·설명 등) |
| **heatmap.json** | 스킬 갭 히트맵. 미사용 | (부서·스킬·등급/점수) |
| **riskManagement.json** | 스킬 리스크. 미사용 | (등급·목록 등) |
| **roi.json** | ROI 계산. 미사용 | (입력·결과) |
| **strategyMapper.json** | 전략–스킬 매핑. 미사용 | (키워드·스킬·역할·교육 등) |
| **highPerformer.json** | 고성과자. 미사용 | (팀·프로필·갭 등) |
| **transformBenchmark.ts** | 부서·업계 스킬 비교 → 강점/개선 인사이트 | 입력: 부서·업계 객체 / 출력: positives[], negatives[] { key, title, teamScore, industryScore, diff } |

---

## 2. 데이터 흐름 (어떤 JSON → 어떤 화면/컴포넌트)

| 데이터 소스 | 사용 화면/컴포넌트 |
|-------------|---------------------|
| departmentPerformance | 대시보드 개요 – DepartmentPerformanceChart |
| departmentSkillPerformance | 대시보드 개요 – DepartmentSkillFilter, DepartmentSkillChartWithFilter |
| organizationData + industryBenchmarks (loadBenchmarkData) | 대시보드 개요 – BenchmarkSection (BenchmarkFilters, RadarChart, InsightList) |
| competencyRawData | 역량 분석 – useCompetencyFilter, SummaryKpiRow, DepartmentCompetency, TrendLineChart |
| transformBenchmark(organizationData, industryBenchmarks) | BenchmarkSection – InsightList(강점/개선) |
| (하드코딩) | 대시보드 개요 – KPI 카드 숫자, 요약·다음 액션 블록 |

---

## 3. 정합성·확장

### 3.1 현재 JSON만으로 동작하는지
- **관리자 대시보드 개요·역량 분석**: 위 데이터만으로 동작.  
- **KPI 카드**: summaryStats 미연동이므로 숫자는 하드코딩. summaryStats 구조에 맞춰 연동하면 동일 UI로 교체 가능.

### 3.2 부족한 필드·확장 제안
- **요약 통계**: summaryStats를 대시보드에서 사용하도록 연동 시, delta·trend 등으로 전월 대비·트렌드 표시 가능.  
- **벤치마크·조정 계수**: 업계·기업 규모별 조정 계수·벤치마크용 JSON을 data/에 두려면, 예: `adjustmentCoefficients.json`, `benchmarkWeights.json` 등 파일명·용도만 정해 두고, 역할별 문서(07_data_reference_integration_new.md)에 “new에서 어떻게 접근할지” 한 줄씩 정리하면 됨.  
- **역량 raw**: competencyRawData는 TS 생성. 추후 API에서 “부서·기간·역량 타입” 필터로 동일 스키마를 내려주면 그대로 교체 가능.

---

## 4. origin과의 대응 (더미 데이터 매핑)

| origin에서 쓰이던 더미/개념 | new의 대응 데이터 |
|----------------------------|-------------------|
| 부서별 점수·기간별 | departmentPerformance, departmentSkillPerformance |
| 부서별 스킬·역량 | organizationData.departments[].skills, competencyRawData |
| 업계 벤치마크 | industryBenchmarks |
| 요약 통계(임직원·진단·교육·평균) | summaryStats.json (미연동) |
| 임직원 테이블 | employees.json (미사용) |
| 진행 프로그램 | progressPrograms.json (미사용) |
| AI 인사이트 | insights.json (미사용) |
| 스킬 갭 히트맵 | heatmap.json (미사용) |
| 스킬 리스크 | riskManagement.json (미사용) |
| ROI 계산 | roi.json (미사용) |
| 전략–스킬 매핑 | strategyMapper.json (미사용) |
| 고성과자 | highPerformer.json (미사용) |

---

## 5. 정리

- **스키마 요약**은 1절, **데이터 흐름**은 2절 표 참고.  
- **정합성·확장**은 summaryStats 연동·벤치마크/조정 계수 JSON 추가로 관리자 대시보드를 확장할 수 있음.  
- **origin 대응**은 4절 표로, origin 데이터가 new의 어떤 JSON/TS에 대응하는지 매핑해 두었음.
