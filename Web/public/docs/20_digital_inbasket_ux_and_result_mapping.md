# 20 디지털 인바스켓 UX 개선 및 결과 매핑 제안

> 문항 타입별 **프론트 구성 상세**, **직관성·톤앤매너 개선 제안**, **결과 매핑 통일 방안**을 정리한 문서입니다.  
> 추후 UI 개선·채점·분석 연동 시 참고용입니다.

---

## 1. 문항 타입별 프론트 구성 상세

아래는 16가지 시뮬레이션 타입별로 **화면 레이아웃·섹션·입력 요소·현재 상태(결과) 구조**를 상세히 적은 것입니다.

---

### 1. 이메일 관리 (EmailSimulation)

| 구분 | 내용 |
|------|------|
| **레이아웃** | 좌 1/3: 폴더(받은편지함·중요·보낸편지함) + 이메일 목록 5통. 우 2/3: 선택 메일 뷰어(제목·발신·본문) + 액션·우선순위 영역. |
| **헤더** | 없음. 좌측 상단 "받은 편지함" + 미읽음 개수 뱃지. |
| **단계/섹션** | ① 메일 선택 → ② 처리 액션(답장/전달/보관/삭제) 버튼 4개 → ③ 우선순위(긴급·중요·보통) 버튼 3개 → 선택 시 "처리 완료: {액션} / {우선순위}" 문구 표시. |
| **입력 요소** | 메일별: 버튼(액션 4종), 버튼(우선순위 3종). 미선택 시 빈 화면에 "이메일을 선택하세요" 안내. |
| **현재 결과 구조** | `Record<emailId, { action?: string; priority?: string }>` (문자열 키는 숫자 id). 5통 각각 독립. |

---

### 1.2 메신저 대응 (MessengerSimulation)

| 구분 | 내용 |
|------|------|
| **레이아웃** | 좌 고정폭(w-52): 다크 사이드바 "WorkChat", 채널 2개(긴급-요청·일반). 우: 채널 제목 "# 긴급-요청" + 메시지 목록(4건), 메시지별 드롭다운 2개. |
| **헤더** | 없음. 상단 "# 긴급-요청", "4개의 메시지". |
| **단계/섹션** | 메시지 카드별: 본문 + "처리 방법" 셀렉트(즉시처리/위임/대기/정보수집) + "우선순위" 셀렉트(1~4순위). 선택 시 "선택 완료" 뱃지. |
| **입력 요소** | 메시지당 select 2개. 긴급 메시지는 카드 배경 빨간톤·좌측 빨간 띠. |
| **현재 결과 구조** | `Record<msgId, { action?: string; priority?: string }>`. 4개 메시지 독립. |

---

### 1.3 보고서 작성 (ReportSimulation)

| 구분 | 내용 |
|------|------|
| **레이아웃** | 상단: 툴바(보고서 작성 제목·임시저장) + 리본(폰트·B/I/U·차트/표/이미지). 하단 3열: 좌 w-80 부서별 수집·진행률, 중앙 A4 보고서 편집, 우 w-56 디자인 패널(테마·표/차트 추가). |
| **헤더** | 상단 바: FileText 아이콘 + "보고서 작성" + 문항 제목(truncate). |
| **단계/섹션** | 좌: 6부서 카드(영업·마케팅·개발·인사·재무·고객지원). 미제출/부분제출 부서에만 "긴급도 평가" select + "대응 방안" select + "상황 메모" textarea + "결정 완료" 버튼. 진행률 바. 중앙: ① 개요 textarea ② 부서별 데이터 현황(6부서 그리드) + textarea ③ 데이터 시각화(플레이스홀더) ④ 결론 및 제언 textarea. |
| **입력 요소** | 부서별: priority(1/2/3), action(즉시독촉/기존자료/이번제외/간략요약), note. 보고서: overview, deptAnalysis, conclusion. 리본·디자인 패널은 현재 동작 없음. |
| **현재 결과 구조** | `decisions: Record<deptId, { priority, action, note, complete }>`, `overview`, `deptAnalysis`, `conclusion` (문자열). |

---

### 1.4 일정 관리 (CalendarSimulation)

| 구분 | 내용 |
|------|------|
| **레이아웃** | 상단 경고 띠 "⚠️ 14시 3개 회의 시간 충돌". 하단: 회의 카드 3개(신제품 런칭·투자자 미팅·전사 간담회), 카드당 시간·장소·참석자 + 라디오 4개. |
| **헤더** | Calendar 아이콘 + "⚠️ 14시 3개 회의 시간 충돌". |
| **단계/섹션** | 문항 content 1줄 + 회의별 블록. 회의당: 직접 참석/대리 참석/시간 변경/불참 라디오. |
| **입력 요소** | 회의당 radio 1개. high priority 회의는 빨간 테두리·배경. |
| **현재 결과 구조** | `Record<meetingId, string>` (선택지 문자열 1개). |

---

### 1.5 통합 업무 (IntegratedWorkSimulation)

| 구분 | 내용 |
|------|------|
| **레이아웃** | 상단: 문항 content. 탭 4개(이메일·전화·SNS·메신저). 탭 아래 "문의 목록" 리스트, 문의당 버튼 4개. |
| **헤더** | 없음. 문항 content만. |
| **단계/섹션** | 채널 탭 선택 → 해당 채널 문의만 표시(이메일/메신저에만 문의 있음). 문의당: 즉시처리/부서이관/보류/에스컬레이션 버튼. |
| **입력 요소** | 문의당 버튼 4개. 긴급 뱃지 있는 문의 표시. |
| **현재 결과 구조** | `Record<inquiryId, string>` (액션 문자열). |

---

### 1.6 위기 관리 (EmergencySimulation)

| 구분 | 내용 |
|------|------|
| **레이아웃** | 상단: 빨간 헤더(제목·발신·날짜) + "대응 마감까지 06:00:00". 본문 content(다크 배경). 하단 2열: 좌 w-72 다크 상황판(위기등급·현황요약·진행률), 우 의사결정 4섹션. |
| **헤더** | AlertTriangle + 문항 제목, "대응 마감까지 06:00:00". |
| **단계/섹션** | ① 즉각 대응 전략 radio 4개 ② 위기대응팀 구성 checkbox 6명 ③ 고객 커뮤니케이션 radio 4개 ④ 긴급 예산 승인 checkbox 4항목(금액 표시) + 총 예산·초과 시 경고. 좌측 진행률 "n/4 완료". |
| **입력 요소** | strategy(radio), team(복수), comm(radio), budgetChecked(복수). |
| **현재 결과 구조** | `strategy: string | null`, `team: string[]`, `comm: string | null`, `budgetChecked: Record<string, boolean>`. |

---

### 1.7 글로벌 협업 (GlobalSimulation)

| 구분 | 내용 |
|------|------|
| **레이아웃** | 상단 content. 이어서 3섹션: 회의 시간 조율(radio 5개), 문서 버전 관리(안내 문구만), 커뮤니케이션 프로토콜(radio 4개). |
| **헤더** | 없음. content만. |
| **단계/섹션** | ① 회의 시간 조율 ② 문서 버전 관리(읽기 전용) ③ 커뮤니케이션 프로토콜. |
| **입력 요소** | meeting(radio), comm(radio). |
| **현재 결과 구조** | `meeting: string | null`, `comm: string | null`. |

---

### 1.8 법무 검토 (LegalSimulation)

| 구분 | 내용 |
|------|------|
| **레이아웃** | 상단: Scale 아이콘 + "50억원 규모 계약서 검토". content. 이어서 조항 카드 6개(제1조·3·5·7·9·11), 카드당 위험도 뱃지 + 버튼 4개(수정요청/협상/수용/거절). |
| **헤더** | "50억원 규모 계약서 검토". |
| **단계/섹션** | 조항별 1행: 제목·위험도(저/중/고) + 의견 버튼 4개. |
| **입력 요소** | 조항당 버튼 4개. |
| **현재 결과 구조** | `Record<clauseId, string>` (의견 문자열). |

---

### 1.9 디지털 활용 (DigitalToolSimulation)

| 구분 | 내용 |
|------|------|
| **레이아웃** | 상단 content + "예산 현황: 가용/할당/잔액 확인 후…" 안내. 도구 카드 4개(ChatGPT Plus, Notion AI, Midjourney, GitHub Copilot), 카드당 비용·ROI + 버튼 3개 + 우선순위 1~4 버튼. |
| **헤더** | 없음. content·안내만. |
| **단계/섹션** | 도구별: 즉시 도입/추후 검토/불필요 + 우선순위 1~4. |
| **입력 요소** | 도구당 버튼 3개(의사결정), 원형 버튼 4개(우선순위). |
| **현재 결과 구조** | `decisions: Record<toolId, string>`, `priority: Record<toolId, number>`. |

---

### 1.10 인사 관리 (HRSimulation)

| 구분 | 내용 |
|------|------|
| **레이아웃** | 상단 content. 중간: 영업팀 ↔ 생산팀 갈등 다이어그램(아이콘). 하단 3섹션: 프로세스 정립(radio 4), 팀빌딩(radio 4), 개별 면담 전략(radio 4). |
| **헤더** | 없음. content만. |
| **단계/섹션** | ① 프로세스 정립 ② 팀빌딩 활동 ③ 개별 면담 전략. |
| **입력 요소** | process, team, meeting 각 radio 4개. |
| **현재 결과 구조** | `process: string | null`, `team: string | null`, `meeting: string | null`. |

---

### 1.11 재무 관리 (FinanceSimulation)

| 구분 | 내용 |
|------|------|
| **레이아웃** | 상단 "부서별 예산 요청 검토" + content. 부서 카드 4개(마케팅·연구개발·영업·생산), 카드당 요청액·사유 + 배분액 입력 + 버튼 4개(전액 승인/일부 승인/거부/차기 분기). |
| **헤더** | "부서별 예산 요청 검토". |
| **단계/섹션** | 부서별 1블록: 제목·요청·배분액 input·의사결정 버튼 4개. |
| **입력 요소** | 부서당 input(텍스트), 버튼 4개. |
| **현재 결과 구조** | `choices: Record<deptId, string>`, `amounts: Record<deptId, string>`. |

---

### 1.12 고객 관리 (CustomerSimulation)

| 구분 | 내용 |
|------|------|
| **레이아웃** | 상단 "VIP 고객 ABC 그룹 (연 150억원)" + content. 2x2 그리드: ① 즉각 대응 전략(radio 4) ② 가격 협상(radio 4) ③ 품질 보증 방안(radio 4) ④ 관계 강화(radio 4). |
| **헤더** | "VIP 고객 ABC 그룹 (연 150억원)". |
| **단계/섹션** | 4개 블록, 각 1개 radio 선택. |
| **입력 요소** | response, price, warranty, relation 각 radio 4개. |
| **현재 결과 구조** | `response`, `price`, `warranty`, `relation` 각 `string | null`. |

---

### 1.13 윤리 경영 (EthicsSimulation)

| 구분 | 내용 |
|------|------|
| **레이아웃** | 상단 "제보 WB-2026-021 · 구매팀 김과장 (재직 15년)"(amber 배경) + content. 4섹션: 초기 대응(radio 4), 대상자 조치(radio 4), 조사 범위(checkbox 4), 공개·보고(radio 4). |
| **헤더** | "제보 WB-2026-021 · 구매팀 김과장 (재직 15년)". |
| **단계/섹션** | ① 초기 대응 방향 ② 대상자 조치 ③ 조사 범위(복수) ④ 공개 및 보고 전략. |
| **입력 요소** | initial, target(radio), scope(checkbox 복수), disclosure(radio). |
| **현재 결과 구조** | `initial`, `target`, `disclosure`: `string | null`. `scope: string[]`. |

---

### 1.14 전략 기획 (StrategySimulation)

| 구분 | 내용 |
|------|------|
| **레이아웃** | 상단 "XYZ 테크놀로지 M&A · 인수가 1,500억원" + 부가 설명. content. 이어서 재무적 타당성·전략적 적합성·실사 리스크(읽기 전용) + 통합 전략(radio 4 + 통합 예산 input) + 최종 의사결정(radio 4). |
| **헤더** | "XYZ 테크놀로지 M&A · 인수가 1,500억원". |
| **단계/섹션** | 검토 영역(읽기) → 통합(PMI) 전략 + 예산 → 최종 의사결정. |
| **입력 요소** | integration(radio), budget(input), finance(radio). |
| **현재 결과 구조** | `finance: string | null`, `integration: string | null`, `budget: string`. |

---

### 1.15 마케팅캠페인 (MarketingCampaignSimulation)

| 구분 | 내용 |
|------|------|
| **레이아웃** | 상단 예산 현황(총/집행/가용/추가요청) 4칸. 하단 2열: 좌 캠페인 카드 4개(이름·예산·목표·지표) + 조정 예산 input + 버튼 4개(계속/확대/축소/중단), 우 w-64 ROI 평가 패널(안내·가용 예산). |
| **헤더** | "예산 현황" 블록. |
| **단계/섹션** | 캠페인별: 조정 예산 input + 계속/확대/축소/중단 버튼. |
| **입력 요소** | 캠페인당 input, 버튼 4개. |
| **현재 결과 구조** | `choices: Record<campaignId, string>`, `amounts: Record<campaignId, string>`. |

---

### 1.16 생산관리 (ProductionSimulation)

| 구분 | 내용 |
|------|------|
| **레이아웃** | 상단 "생산 라인 실시간 현황" + 뱃지 4개(정상·주의·긴급·시험). 하단 2열: 좌 라인 카드 4개(A·B·C·D), B/C/D에만 조치 버튼(라인별 옵션 다름) + 우 w-64 가이드 패널. |
| **헤더** | "생산 라인 실시간 현황". |
| **단계/섹션** | 라인 2: 원자재 교체/라인 전환/외주 생산/납기 연장. 라인 3: 유지보수/조기 설비 교체/생산 축소. 라인 4: 양산 진행/테스트 연장/개선 후 진행. |
| **입력 요소** | line2, line3, line4 각 버튼 3~4개. |
| **현재 결과 구조** | `line2: string | null`, `line3: string | null`, `line4: string | null`. |

---

## 2. 직관성·톤앤매너 개선 제안

### 2.1 톤앤매너 불일치

| 현상 | 제안 |
|------|------|
| "처리 완료"(이메일) vs "선택 완료"(메신저) vs "결정 완료"(보고서) | **통일:** "선택 완료" 또는 "의사결정 완료" 등 한 가지 표현으로 통일. |
| 이모지 사용량 차이(이메일·보고서는 이모지 많음, 법무·재무는 거의 없음) | **원칙:** 제목·버튼에는 이모지 최소화. 긴급/주의 등 상태만 아이콘·색으로 구분. |
| "1순위"~"4순위" vs "긴급·중요·보통" | **통일:** 우선순위는 "긴급 / 보통 / 낮음" 또는 "1순위~4순위" 중 한 체계로 통일하고, 전체 시뮬레이션에 동일 적용. |
| 버튼 문구: "수정요청" vs "📞 긴급 독촉" | **원칙:** 실무에 가깝게 하되, 한 타입 내에서는 "동사+대상" 형태로 통일(예: "수정 요청", "긴급 독촉"). |

### 2.2 처음 볼 때 이해하기 어려운 부분

| 문제 | 제안 |
|------|------|
| **목표 불명확** | 각 시뮬레이션 상단에 한 줄 안내: "아래 항목을 모두 선택한 뒤, [제출] 버튼을 눌러 주세요." (제출 버튼 도입 시). |
| **단계가 여러 개인데 순서가 불명확** | 위기·보고서·윤리·고객 등 다단계 타입에 "1단계 / 2단계 / 3단계" 표시 + 진행률(선택 완료 개수) 노출. |
| **무엇을 해야 "끝"인지 모름** | 공통: "제출" 또는 "의사결정 제출" 버튼 1개. 제출 전에 미선택 항목 있으면 "n개 항목을 선택해 주세요" 안내. |
| **일부만 선택하고 나가도 되는지 모름** | 안내 문구로 "모든 항목 선택을 권장합니다" 또는 "미선택 시 해당 항목은 '미결정'으로 기록됩니다" 명시. |

### 2.3 실무 반영·간단화 제안

| 항목 | 제안 |
|------|------|
| **한 줄 시나리오** | 문항 content만으로는 맥락이 부족할 수 있음. 각 타입 상단에 "상황: OOO입니다. 아래에서 의사결정을 선택해 주세요." 형태의 1~2문장 고정 안내 추가. |
| **필수/선택 구분** | 실무처럼 "필수 선택"과 "선택(보완)" 구분. 예: 위기 관리에서 "대응 전략·팀 구성·고객 공지"는 필수, "예산"은 선택 등. (채점 시 가중치와도 연동 가능) |
| **제출 전 요약** | 제출 버튼 클릭 전 "선택 요약" 모달: "위기 대응: 선제적 보도자료 배포, 팀: CEO·홍보팀장·…" 등으로 한눈에 확인 후 제출. |
| **플레이스홀더 통일** | 텍스트 입력 칸(보고서 개요·결론, 전략 예산 등) placeholder: "예: …" 형태로 통일하고, 가능하면 예시 1줄 공통 가이드. |

---

## 3. 결과 매핑 통일 방안 (추후 채점·분석 대비)

### 3.1 현재 문제

- 타입마다 **state 구조가 다름**: `Record<id, object>`, `Record<id, string>`, 단일 값, 배열, 중첩 객체 등.
- **키 이름 불일치**: `action` vs `choices` vs `opinions` vs `decisions` 등.
- **단위 불일치**: "메일/메시지/부서/조항/도구/캠페인" 등 타입별로 단위가 달라, 채점·분석 시 **타입별 분기**가 필수라 유지보수 부담이 큼.

### 3.2 제안: 공통 제출 스키마

모든 시뮬레이션에서 **제출 시점에만** 아래 형태로 변환하여 저장·전송하는 방식을 권장합니다.

```ts
// 제출 payload (공통)
type InbasketSubmissionPayload = {
  questionId: string;        // 문항 id
  category: string;           // 이메일 관리, 위기 관리, ...
  submittedAt: string;        // ISO 8601
  steps: InbasketStep[];      // 순서 있는 단계별 선택
};

type InbasketStep = {
  stepId: string;             // 타입 내 고유 식별 (예: "email_1", "strategy", "budget")
  label: string;              // 화면에 보이는 단계명 (예: "즉각 대응 전략")
  type: "single" | "multi" | "text" | "number";
  value: string | string[] | number;  // single: 문자열 1개, multi: 문자열 배열, text: 자유문자, number: 숫자
  options?: string[];         // 선택지 목록 (채점 시 정답 매핑용)
};
```

- **stepId**: 타입별로 정의한 고정 ID. 예: 위기 관리 → `strategy`, `team`, `comm`, `budget`. 이메일 → `email_1`~`email_5` 등.
- **label**: 사용자에게 보이는 단계 이름.
- **type**: 단일 선택(single), 복수 선택(multi), 자유 입력(text), 숫자(number).
- **value**: 실제 선택/입력값. 채점·분석은 `category` + `steps[].stepId` + `steps[].value`만 보면 됨.

### 3.3 타입별 stepId 예시 (매핑 테이블)

| category | stepId | label | type | 비고 |
|----------|--------|-------|------|------|
| 이메일 관리 | email_1 ~ email_5 | 메일 1~5 처리 | single | value: "답장,긴급" 등 조합 또는 action/priority 각각 step |
| 메신저 대응 | msg_1 ~ msg_4 | 메시지 1~4 | single | action + priority를 "action:priority" 등 1개 문자열로 |
| 보고서 작성 | dept_1 ~ dept_6 | 부서 1~6 결정 | single | priority+action+note 요약 또는 JSON 문자열 |
| 보고서 작성 | overview, dept_analysis, conclusion | 개요·분석·결론 | text | |
| 일정 관리 | meeting_1 ~ meeting_3 | 회의 1~3 | single | |
| 통합 업무 | inquiry_1 ~ 3 | 문의 1~3 | single | |
| 위기 관리 | strategy, team, comm, budget | 4단계 | single / multi / multi / multi | |
| 글로벌 협업 | meeting_time, comm_protocol | 회의·커뮤니케이션 | single | |
| 법무 검토 | clause_1 ~ clause_6 | 조항 1~6 | single | |
| 디지털 활용 | tool_chatgpt ~ tool_copilot, priority_* | 도구별 결정·우선순위 | single, number | |
| 인사 관리 | process, team_building, meeting | 3단계 | single | |
| 재무 관리 | dept_mkt ~ dept_prod, amount_* | 부서별 결정·배분액 | single, text | |
| 고객 관리 | response, price, warranty, relation | 4단계 | single | |
| 윤리 경영 | initial, target, scope, disclosure | 4단계 | single, multi | |
| 전략 기획 | integration, budget, finance | 3단계 | single, text | |
| 마케팅캠페인 | campaign_1 ~ 4, amount_* | 캠페인별 조치·예산 | single, text | |
| 생산관리 | line_2, line_3, line_4 | 라인 2~4 | single | |

### 3.4 구현 방향

1. **공통 타입 정의**  
   `lib/inbasketData.ts` 또는 `types/inbasket.ts`에 `InbasketSubmissionPayload`, `InbasketStep` 정의.

2. **타입별 adapter 함수**  
   각 시뮬레이션 컴포넌트의 state를 받아 `InbasketStep[]`로 변환하는 `toSubmissionSteps(category, state): InbasketStep[]` 함수를 타입별로 1개씩 작성. (예: `adapters/emailSubmission.ts`, `adapters/emergencySubmission.ts` 등.)

3. **제출 버튼·저장**  
   시뮬레이션에 "제출" 버튼 추가 시, 해당 타입 adapter를 호출해 `InbasketSubmissionPayload`를 만들고, 동일한 API 또는 저장소에 전송. 채점/분석 쪽에서는 **payload.steps**만 순회하면 되므로 타입 분기 최소화.

4. **채점 시**  
   `category` + `stepId`별로 "권장/정답" 매핑 테이블(JSON 또는 DB)을 두고, `step.value`와 비교해 점수·피드백 생성. 16가지 타입이 있어도 **steps 배열** 구조가 같아서 처리 로직을 공통화하기 쉬움.

---

## 4. 요약

| 구분 | 내용 |
|------|------|
| **프론트 구성** | 16가지 타입별 레이아웃·헤더·단계·입력 요소·현재 결과 구조를 위 표와 같이 상세 정리해 두었음. |
| **직관성** | 톤앤매너 통일(완료 문구·우선순위 체계·버튼 문체), 한 줄 안내·단계 표시·제출 버튼·필수/선택 구분·제출 전 요약으로 "뭘 해야 하는지·언제 끝인지" 명확히. |
| **결과 매핑** | 공통 제출 스키마(`questionId`, `category`, `submittedAt`, `steps[]`)와 `InbasketStep`(stepId, label, type, value) 도입 + 타입별 adapter로 state → steps 변환 시, 채점·분석을 steps 기준으로 통일할 수 있음. |

---

## 5. 관련 문서

- **19_digital_inbasket_simulation_guide.md** — 문항 구성·푸는 방법·평가 관점
- **18_inbasket_dummy_data_and_loading.md** — 더미데이터 및 로딩 로직
- **16_digital_inbasket_48_questions_and_components.md** — 48문항 vs 16컴포넌트
