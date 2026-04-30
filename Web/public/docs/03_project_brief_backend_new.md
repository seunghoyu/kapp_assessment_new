# kapp_assessment_new – 백엔드 관점 프로젝트 개요

> **역할**: 데이터 모델, API 요구사항, 저장소, 연동 시 고려사항  
> **현재**: **API 서버 없음**. 정적 JSON(data/)을 프론트에서 직접 읽는 구조.  
> **초점**: 연동 시 필요한 엔티티·API·데이터 구조 (new의 data/ 기준)

---

## 1. 현재 데이터 사용 방식 (new)

- **관리자 대시보드·역량 분석**: 모든 데이터가 **data/ 폴더 내 JSON·TS**에서 import.  
- **인증·권한**: 없음. 로그인 페이지는 자리표시이며, `/dashboard` 진입은 클라이언트 라우팅만으로 처리.  
- **저장·수정**: 없음. 읽기 전용 더미.

---

## 2. 데이터 엔티티 (data/ 파일별)

| 파일(또는 모듈) | 엔티티/역할 |
|------------------|-------------|
| **summaryStats.json** | 요약 통계(전체 임직원·진단 완료·교육 수강·평균 역량 점수 등). 현재 new UI에서 미사용. |
| **departmentPerformance.ts** | 부서별 성과(기간 옵션·부서별 값). 부서별 역량 차트용. |
| **departmentSkillPerformance.ts** | 년/월별 부서별 스킬(역량) 값. 부서별 스킬 차트·필터용. |
| **competencyRawData.ts** | 역량 원시 데이터(부서·날짜·역량 타입·점수). TS에서 생성. 역량 분석 필터·막대·추이용. |
| **organizationData.json** | 조직 부서 정보(부서별 name·members·skills 객체). 벤치마크 부서 선택·레이더용. |
| **industryBenchmarks.json** | 업계별 벤치마크(업계별 name·skills). 벤치마크 업계 선택·비교용. |
| **loadBenchmarkData.ts** | organizationData + industryBenchmarks를 묶어 반환. |
| **transformBenchmark.ts** | 부서·업계 스킬 비교 → 강점/개선 인사이트 리스트. |
| **employees.json** | 임직원 목록(예정). new에서 미사용. |
| **progressPrograms.json** | 진행 프로그램. new에서 미사용. |
| **insights.json** | AI 인사이트. new에서 미사용. |
| **heatmap.json** | 스킬 갭 히트맵. new에서 미사용. |
| **riskManagement.json** | 스킬 리스크. new에서 미사용. |
| **roi.json** | ROI 계산. new에서 미사용. |
| **strategyMapper.json** | 전략–스킬 매핑. new에서 미사용. |
| **highPerformer.json** | 고성과자. new에서 미사용. |
| **benchmark.json** | 벤치마크 보조. (사용처는 프로젝트에 따라 상이.) |
| **pageMeta.json** | 페이지 메타. (선택) |
| **skillDistribution.json** | 스킬 분포. new에서 미사용. |

---

## 3. 구현된 것 vs 미구현 (new 기준)

### 3.1 현재 new에서 사용 중인 데이터
- **departmentPerformance** (TS)  
- **departmentSkillPerformance** (TS)  
- **competencyRawData** (TS)  
- **organizationData.json**  
- **industryBenchmarks.json**  
- **loadBenchmarkData**, **transformBenchmark**

### 3.2 origin에는 있으나 new에 JSON/로직이 아직 없는 데이터
- 진단 결과·문항 뱅크·산업·직무·직급 등 마스터  
- 과정·학습 경로·추천  
- 요약 통계(실제 연동 시 summaryStats 대체)  
- 임직원 테이블(employees)  
- 진행 프로그램(progressPrograms)  
- AI 인사이트(insights)  
- 스킬 갭 히트맵(heatmap)  
- 스킬 리스크(riskManagement)  
- ROI 계산 입력/결과(roi)  
- 전략 매핑(strategyMapper)  
- 고성과자(highPerformer)

---

## 4. 연동 시 API 설계 방향

### 4.1 인증·사용자
- 로그인 → 토큰·사용자 식별자·역할(관리자/일반).  
- 관리자 페이지는 역할이 관리자(또는 교육담당)인 경우만 허용.

### 4.2 관리자·역량 (new에서 이미 쓰는 엔티티 기준)
- **요약 통계**: 조직(또는 부서) 기준 임직원 수·진단 완료·교육 이수·평균 역량. 기간 필터(선택). → summaryStats 대체.  
- **부서별 역량/성과**: 기간(년/월 또는 스냅샷) → 부서별 평균 점수. 조회·필터.  
- **역량 원시(부서·날짜·역량·점수)**: 필터(부서·기간)·페이지네이션(선택). → competencyRawData 대체.  
- **조직 부서·스킬**: 부서 목록·부서별 스킬 점수. → organizationData 대체.  
- **업계 벤치마크**: 업계 코드 → 업계명·스킬별 점수. → industryBenchmarks 대체.

### 4.3 추후 확장(미구현 기능 대응)
- **임직원 목록**: 부서·직급·검색·정렬·페이지네이션.  
- **진행 프로그램**: 목록·필터(전체/진행중/완료).  
- **인사이트**: 목록·우선순위·타입.  
- **히트맵**: 부서·스킬 카테고리 → 셀별 등급/점수.  
- **리스크**: 부서·리스크 등급 필터 → 리스트·카운트.  
- **ROI**: 입력값 수신 → 계산 또는 저장 후 결과 반환.  
- **전략 매핑**: 키워드/전략 ID → 필요 스킬·추천 인력·교육·로드맵.  
- **고성과자**: 팀/부서 → 상위 N% 프로필·갭 분석용 데이터.

### 4.4 진단·교육(미구현)
- origin의 03_project_brief_backend.md와 동일한 방향: 진단 세션·문항·제출·결과 저장/조회, 과정 목록·상세·추천 등.

---

## 5. 정리

- new는 **아직 API가 없고**, **data/ 정적 JSON·TS**만으로 관리자 대시보드(개요·역량 분석·벤치마킹)가 동작한다.  
- **데이터 엔티티**는 위 2절, **현재 사용 vs 미사용**은 3절, **연동 시 API 제안**은 4절을 기준으로 추후 백엔드 설계 시 반영하면 된다.
