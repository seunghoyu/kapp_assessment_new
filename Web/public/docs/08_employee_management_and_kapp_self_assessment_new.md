# kapp_assessment_new – 직원 관리와 KAPP 자가진단: origin vs new 데이터 비교

> **목적**: origin의 **KAPP 자가진단**에서 추출·직원 관리로 이어지는 데이터를 **상세 전부** 정리하고, **new 프로젝트 직원 관리**에 현재 있는 데이터와 비교해 **new에 없는 데이터**를 명시한다.  
> **전제**: origin은 assessment-kapp 흐름(정보 입력 → 문항 응답 → 제출 → 결과 저장)을 갖고, 그 결과가 관리자 쪽 **임직원 테이블(직원 관리)** 로 이어진다. new에는 직원 관리 페이지와 **data/employeesData.ts**만 있고, 진단·결과 연동은 아직 없다.

---

## 1. 데이터 흐름 요약 (origin 기준)

```
[KAPP 자가진단]  정보 입력 → 문항 응답 → 제출 → 결과 저장
        │
        └──► 진단 결과(4역량 점수, 문항별 답변, 메타) 저장
                    │
                    └──► [관리자 · 직원 관리] 임직원 테이블에서 직원별 진단 요약 노출
                                          + 상세보기 시 문항별 답변 조회
```

- **origin**: assessment-kapp.html / kapp-assessment.js 등에서 진단 진행 → 제출 시 결과 저장 → admin 임직원 테이블에서 해당 결과를 직원 단위로 조회·표시.
- **new**: `/dashboard/employees`는 **data/employeesData.ts**만 사용. 진단 결과·문항별 답변·진단 메타는 **없음**.

---

## 2. origin KAPP 자가진단에서 추출 가능한 데이터 (상세 전부)

아래는 origin의 KAPP 자가역량 진단 문항·제출·결과에서 **추출 가능한 모든 데이터**를 항목별로 나열한 것이다. 직원 관리 화면으로 “이어지는” 것은 2.1(메타)·2.2(정보 입력)·2.3(역량 점수)·2.4(문항별 답변)·2.5(파생) 전부이며, 목록 행에는 2.1·2.2·2.3 요약이, **상세보기**에는 2.4 전부가 필요하다.

### 2.1 진단 세션·제출 메타

| 필드(예시) | 설명 | 직원 관리 연동 |
|------------|------|-------------------------------|
| **assessmentId** | 진단 회차/세션 식별자 (예: kapp-2026-01) | 직원별 “최근 진단” 표시, 상세보기 링크 |
| **userId / employeeId** | 응시자(직원) 식별자 | 직원 목록 행과 조인 |
| **startedAt** | 진단 시작 시각 (ISO 8601) | 진단 소요 시간 계산, 이력 정렬 |
| **completedAt** | 진단 제출(완료) 시각 | 직원 목록 “진단 완료일”, 이력 |
| **duration** | 소요 시간(초 또는 분) | (선택) 상세보기에서 표시 |
| **status** | 제출 상태 (in_progress / completed / abandoned) | 직원 목록 “진단 참여 여부”, 미완료 필터 |
| **device / source** | 응시 환경 (선택) | (선택) 이슈 추적용 |

→ **new에 없음**: assessmentId, completedAt, status, duration 등 진단 메타 전부. 직원 관리에 “진단 완료일”, “진단 참여 여부” 컬럼 없음.

### 2.2 정보 입력 단계(진단 전 수집) 데이터

진단 시작 전 origin에서 수집하는 **정보 입력** 값. 직원 마스터와 일부 중복될 수 있으나, “진단 당시” 스냅샷으로 보관될 수 있음.

| 필드(예시) | 설명 | 직원 관리 연동 |
|------------|------|-------------------------------|
| **industry** | 산업/업종 (코드 또는 명칭) | 필터·벤치마크 대비 표시 |
| **jobFamily / jobRole** | 직무 계열·직무 (코드 또는 명칭) | 직원 목록 “직무”와 매칭 또는 보강 |
| **jobGrade / position** | 직급·포지션 | 목록 필터·정렬 |
| **careerYears** | 경력 연수 | (선택) 상세보기·분석 |
| **department** | 부서 (코드 또는 명칭) | 직원 목록 “부서”와 동일 또는 조인 |
| **name / email** | 이름·이메일 | 직원 목록과 동일 |

→ **new에 있음**: name, department, role(직무) — **employeesData.ts**에 존재.  
→ **new에 없음**: industry, jobGrade, careerYears 등 진단 시점 수집 항목. 직원 마스터에 없으면 “정보 입력”에서만 추출 가능.

### 2.3 KAPP 4역량 점수 (진단 결과 핵심)

KAPP 자가진단은 **지식(Knowledge)·적용(Application)·성과(Performance)·생산성(Productivity)** 4차원 점수를 산출한다. origin의 고성과자·마이 대시보드 등에서 동일한 4역량 체계 사용 (예: highPerformerData.ts의 KappProfile).

| 필드 | 설명 | 단위/형식 | 직원 관리 연동 |
|------|------|-----------|-------------------------------|
| **knowledge** | 지식(Knowledge) 영역 점수 | 0~100 또는 1~5 등 | 목록·상세 “지식” 컬럼/블록, 레이더·바 차트 |
| **application** | 적용(Application) 영역 점수 | 동일 | 목록·상세 “적용” 컬럼/블록 |
| **performance** | 성과(Performance) 영역 점수 | 동일 | 목록·상세 “성과” 컬럼/블록 |
| **productivity** | 생산성(Productivity) 영역 점수 | 동일 | 목록·상세 “생산성” 컬럼/블록 |
| **overallScore** | 종합/가중 점수 | 0~100 등 | 목록 “종합 점수” 컬럼 (new에는 숫자만 있고 진단 연동 없음) |

→ **new에 있음**: **overallScore** — employeesData.ts에 필드만 존재. **진단 결과와 연동되지 않은** 더미 값.  
→ **new에 없음**: **knowledge, application, performance, productivity** 4역량 개별 점수. 직원 관리 목록·상세에 “역량별 점수” 없음.

### 2.4 문항 마스터(진단 문항 정의)

진단에 사용된 **문항 정의** 목록. 상세보기에서 “어떤 문항”인지 텍스트·유형을 보여 주려면 필요하다.

| 필드(예시) | 설명 | 직원 관리 연동 |
|------------|------|-------------------------------|
| **questionId** | 문항 고유 ID | 문항별 답변과 매칭 |
| **questionText** | 문항 지문(텍스트) | 상세보기 “문항” 열 표시 |
| **dimension** | 소속 역량 (knowledge / application / performance / productivity) | 상세보기에서 역량별 그룹핑·필터 |
| **type** | 문항 유형 (scale / singleChoice / multipleChoice / text 등) | 상세보기 “유형” 표시, 답변 포맷 해석 |
| **options** | 선택지 배열 (선택형인 경우) | 답변 값 → 라벨 변환 |
| **order** | 문항 순서 | 상세보기 정렬 |
| **required** | 필수 여부 | (선택) 검증·결측 표시 |

→ **new에 없음**: 문항 마스터 전부. data/에 assessmentQuestions.json 등 없음.

### 2.5 문항별 답변(응답 내역) — 상세보기 핵심

**상세보기**에서 “어떤 문항에서 어떤 답을 했는지” 보여 주는 데 쓰는 데이터.

| 필드(예시) | 설명 | 직원 관리 연동 |
|------------|------|-------------------------------|
| **questionId** | 문항 ID | 문항 마스터와 조인 → questionText, dimension 표시 |
| **questionText** | 문항 지문 (또는 마스터에서 조인) | 상세보기 “문항” 열 |
| **dimension** | 역량 영역 | 역량별 그룹·필터 |
| **type** | 문항 유형 | 답변 표시 방식(숫자/선택지 라벨/텍스트) 결정 |
| **answer** | 응답 값 (척도 점수, 선택지 키, 서술형 텍스트 등) | 상세보기 “답변” 열 |
| **answerLabel** | 선택지인 경우 표시용 라벨 (또는 옵션에서 변환) | 상세보기에서 “5점” → “매우 그렇다” 등 |
| **answeredAt** | 해당 문항 응답 시각 (선택) | (선택) 이력·품질 검증 |

→ **new에 없음**: 문항별 답변(responses[]) 전부. 상세보기 UI·API·데이터 없음.

### 2.6 파생·결과 해석 데이터 (마이 대시보드 등에서 사용)

origin의 **마이 대시보드**(dashboard-kapp) 등에서 진단 결과로부터 산출하는 값. 직원 관리에서 “요약”으로 쓸 수 있음.

| 필드(예시) | 설명 | 직원 관리 연동 |
|------------|------|-------------------------------|
| **dnaType** | DNA 유형/프로필 라벨 | (선택) 목록·상세 “유형” |
| **marketPosition** | 시장 포지션 라벨 | (선택) 목록·상세 |
| **strength** | 강점 역량 요약(텍스트 또는 코드) | 목록 “강점 역량” (new에는 필드만 있고 진단 연동 없음) |
| **weakness** | 개선 필요 역량 요약 | 목록 “개선 필요” (동일) |
| **radarCoordinates** | 레이더 차트용 좌표 (4역량 등) | 상세보기 레이더 |
| **recommendedPrograms** | 추천 교육 ID/이름 (선택) | (선택) 상세보기 “추천 교육” |

→ **new에 있음**: **strength**, **weakness** — employeesData.ts에 필드 존재. **진단 결과와 연동되지 않은** 더미 값.  
→ **new에 없음**: dnaType, marketPosition, radarCoordinates, recommendedPrograms 등. 직원 관리에 진단 기반 파생 데이터 없음.

---

## 3. new 직원 관리에 현재 있는 데이터

**데이터 소스**: **data/employeesData.ts** (및 삭제된 data/employees.json과 동일 구조).

### 3.1 테이블 메타

| 항목 | 내용 |
|------|------|
| **tableMeta.columns** | ["이름", "부서", "직무", "종합 점수", "강점 역량", "개선 필요", "교육 현황", "액션"] |

### 3.2 행(row) 단위 필드 — EmployeeRow

| 필드 | 타입 | 설명 |
|------|------|------|
| **id** | string | 직원 식별자 (예: e-001) |
| **name** | string | 이름 |
| **department** | string | 부서 |
| **role** | string | 직무 |
| **overallScore** | number | 종합 점수 (현재 진단 연동 없음, 더미) |
| **strength** | string | 강점 역량 (현재 진단 연동 없음, 더미) |
| **weakness** | string | 개선 필요 (현재 진단 연동 없음, 더미) |
| **trainingStatus** | enum | 교육 현황: in_progress / not_started / completed |

### 3.3 UI에서 제공하는 기능

- 직원 목록 **테이블** (위 컬럼 기준).
- **Raw 데이터 보기** 토글: employeesData 객체를 JSON 문자열로 표시.
- **액션**: “보기” 버튼만 있고, 상세보기·모달·라우트 미구현.

---

## 4. 비교: new에 없는 데이터 (origin KAPP → 직원 관리 기준)

아래는 **origin의 KAPP 자가진단에서 추출 가능한 데이터** 중 **new 직원 관리에는 없는** 항목을 정리한 것이다.

### 4.1 진단 연동·메타

| 데이터 | 설명 | new 상태 |
|--------|------|----------|
| assessmentId | 진단 회차/세션 ID | ❌ 없음 |
| completedAt | 진단 완료 시각 | ❌ 없음 |
| startedAt | 진단 시작 시각 | ❌ 없음 |
| duration | 진단 소요 시간 | ❌ 없음 |
| status | 제출 상태 (진행중/완료/포기) | ❌ 없음 |
| 진단 참여 여부 | 해당 직원이 진단을 완료했는지 | ❌ 없음 (컬럼·필터 없음) |

### 4.2 정보 입력(진단 시점 수집)

| 데이터 | 설명 | new 상태 |
|--------|------|----------|
| industry | 산업/업종 | ❌ 없음 |
| jobGrade / position | 직급·포지션 | ❌ 없음 (role만 있음) |
| careerYears | 경력 연수 | ❌ 없음 |

### 4.3 역량별 점수 (KAPP 4차원)

| 데이터 | 설명 | new 상태 |
|--------|------|----------|
| knowledge | 지식 점수 | ❌ 없음 |
| application | 적용 점수 | ❌ 없음 |
| performance | 성과 점수 | ❌ 없음 |
| productivity | 생산성 점수 | ❌ 없음 |
| overallScore (진단 연동) | 진단 결과 기반 종합 점수 | ⚠️ overallScore 필드는 있으나 **진단과 무관한 더미** |

### 4.4 문항·답변 (상세보기용)

| 데이터 | 설명 | new 상태 |
|--------|------|----------|
| 문항 마스터 | questionId, questionText, dimension, type, options, order | ❌ 없음 |
| 문항별 답변 | questionId, questionText, type, answer, answerLabel | ❌ 없음 |
| 상세보기 UI | “어떤 문항에서 어떤 답을 했는지” 표시 | ❌ 없음 (보기 버튼만 있고 연동 없음) |

### 4.5 파생·해석

| 데이터 | 설명 | new 상태 |
|--------|------|----------|
| strength / weakness (진단 연동) | 진단 결과 기반 강점/개선 역량 | ⚠️ 필드는 있으나 **진단과 무관한 더미** |
| dnaType, marketPosition | DNA 유형·시장 포지션 | ❌ 없음 |
| radarCoordinates | 레이더 차트용 좌표 | ❌ 없음 |
| recommendedPrograms | 추천 교육 | ❌ 없음 |

---

## 5. 요약 표: origin 추출 데이터 vs new 직원 관리

| 구분 | origin KAPP 자가진단에서 추출 가능 | new 직원 관리(employeesData.ts) 보유 | 비고 |
|------|-----------------------------------|--------------------------------------|------|
| **직원 식별·기본** | employeeId, name, department, role, industry, jobGrade, careerYears | id, name, department, role | new에는 industry, jobGrade, careerYears 없음 |
| **진단 메타** | assessmentId, completedAt, startedAt, duration, status | 없음 | new 전부 없음 |
| **역량 점수** | knowledge, application, performance, productivity, overallScore(연동) | overallScore(더미), strength(더미), weakness(더미) | new는 4역량 없음, overall/strength/weakness는 연동 안 됨 |
| **문항 정의** | questionId, questionText, dimension, type, options, order | 없음 | new 전부 없음 |
| **문항별 답변** | questionId, questionText, type, answer, answerLabel | 없음 | 상세보기 데이터·UI 없음 |
| **파생** | dnaType, marketPosition, radarCoordinates, recommendedPrograms | 없음 | new 전부 없음 |
| **교육 현황** | (origin에서 별도 관리 시) | trainingStatus | new만 있음 (진단과 별개) |

---

## 6. new 직원 관리 확장 시 반영할 사항

1. **직원 목록**  
   - origin에서 오는 **진단 메타**(completedAt, status)와 **4역량 점수**(knowledge, application, performance, productivity)를 컬럼 또는 카드에 추가.  
   - overallScore, strength, weakness는 **진단 결과와 연동**된 값으로 교체.

2. **상세보기**  
   - “보기” 클릭 시 **문항별 답변** 표시: 문항 ID/지문, 유형, 선택/입력한 답.  
   - 데이터: origin 2.4(문항 마스터)·2.5(문항별 답변)에 대응하는 API 또는 data/ 샘플(assessmentQuestions.json, assessmentResponsesSample.json 등).

3. **데이터 소스**  
   - 현재: **data/employeesData.ts** 만.  
   - 확장 시: 진단 결과·문항·답변은 API(예: GET /employees/:id/assessment-detail) 또는 data/ 샘플로 제공하고, 직원 목록 행 데이터는 직원 마스터 + 진단 결과 요약을 조인한 구조로 설계.

이 문서는 **origin의 KAPP 자가진단에서 추출 가능한 데이터를 상세히 나열**하고, **new 직원 관리에 있는 데이터와 비교**해 **new에 없는 데이터**를 명시한 기준 문서이다.
