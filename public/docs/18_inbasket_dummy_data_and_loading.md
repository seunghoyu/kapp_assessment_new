# 18 디지털 인바스켓 더미데이터 및 로딩 로직

> 디지털 인바스켓 문항 **더미데이터가 어디에 있는지**, **어떤 구조인지**, **앱에서 어떻게 가져와서 쓰는지**를 상세히 설명한 문서입니다.

---

## 1. 요약

| 구분 | 내용 |
|------|------|
| **더미데이터 위치** | `data/kappDiagnosis/inbasket/inbasketQuestions.json` (프로젝트 루트 기준) |
| **로딩 담당** | `lib/inbasketData.ts` — JSON을 정적 import 후 타입을 붙여 반환 |
| **사용처** | 진단 페이지(`app/app/diagnosis/page.tsx`) → 인바스켓 목록·시뮬레이션에 문항 배열 전달 |

- **TSX 안에 문항 배열을 하드코딩하지 않습니다.** 모든 문항 데이터는 위 JSON 파일 한 곳에서만 관리합니다.
- 빌드 시 JSON이 번들에 포함되며, **런타임 API 호출 없이** 사용합니다.

---

## 2. 더미데이터 파일 구조

### 2.1 파일 경로

```
프로젝트 루트
└── data/
    └── kappDiagnosis/
        └── inbasket/
            └── inbasketQuestions.json   ← 디지털 인바스켓 문항 더미데이터
```

- Next.js에서 `@/data` 는 `tsconfig.json` 의 `paths` 설정에 따라 **프로젝트 루트의 `data/`** 를 가리킵니다.

### 2.2 JSON 스키마

**루트 객체**

| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| `description` | string | 선택 | 파일 설명 (예: "디지털 인바스켓 16가지 시뮬레이션 타입별 문항…") |
| `questions` | array | **필수** | 문항 객체의 배열. 목록·시뮬레이션에 사용 |

**문항 객체 한 건 (`questions[]` 요소)**

| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| `id` | string | **필수** | 문항 고유 ID (예: `inbasket_email_1`) |
| `title` | string | **필수** | 목록·상세에 표시되는 제목 |
| `category` | string | **필수** | 시뮬레이션 타입 (이메일 관리, 메신저 대응, 보고서 작성 등 16가지) |
| `jobCategory` | string | **필수** | 직무 필터용 (경영/기획, 커뮤니케이션, 인사/조직 등) |
| `sender` | string | **필수** | 발신자 표시용 |
| `date` | string | **필수** | 날짜/시간 표시 (예: "5분 전", "오늘") |
| `priority` | string | **필수** | 우선순위: "긴급" | "보통" | "낮음" |
| `content` | string | **필수** | 본문 미리보기·상세 내용 |
| `attachments` | string[] | 선택 | 첨부 파일명 배열 (없으면 `[]` 또는 생략) |

**예시 (한 문항)**

```json
{
  "id": "inbasket_email_1",
  "title": "[긴급] 프로덕션 서버 CPU 사용률 95% 초과",
  "category": "이메일 관리",
  "jobCategory": "커뮤니케이션",
  "sender": "이CTO (최고기술책임자)",
  "date": "5분 전",
  "priority": "긴급",
  "content": "프로덕션 서버 3대 중 2대의 CPU 사용률이 95%를 초과했습니다…",
  "attachments": []
}
```

- **16가지 `category`** 에 맞춰 타입당 3개씩 넣으면 **총 48개** 문항이 됩니다. (15·16번 문서 참고)

---

## 3. 데이터를 가져오는 로직

### 3.1 담당 모듈: `lib/inbasketData.ts`

**역할**

1. **정적 import**  
   `inbasketQuestions.json` 을 빌드 시점에 한 번 불러옵니다.

2. **타입 정의**  
   JSON과 동일한 형태의 `InbasketQuestion` 타입을 export 해서, TSX 전반에서 동일한 스키마를 사용합니다.

3. **접근 함수**  
   `getInbasketQuestions()` 를 export 하여, JSON 루트의 `questions` 배열을 **타입이 붙은 배열**로 반환합니다.

**코드 구조 요약**

```ts
// lib/inbasketData.ts (요지만 요약)

import inbasketQuestionsJson from "@/data/kappDiagnosis/inbasket/inbasketQuestions.json";

export type InbasketQuestion = { id, title, category, jobCategory, sender, date, priority, content, attachments? };

export function getInbasketQuestions(): InbasketQuestion[] {
  const data = inbasketQuestionsJson as InbasketQuestionsJson;
  if (!data?.questions || !Array.isArray(data.questions)) return [];
  return data.questions;
}
```

- **왜 함수로 제공하나?**  
  - “데이터를 **가져오는 로직**”을 한 곳에 두기 위함.  
  - 나중에 JSON 대신 API를 쓰더라도, 호출부는 `getInbasketQuestions()` 만 바꾸면 됩니다.

### 3.2 사용 흐름

```
inbasketQuestions.json
        │
        ▼ (정적 import)
lib/inbasketData.ts  ── getInbasketQuestions() ──► page.tsx
        │                                              │
        │ export type InbasketQuestion                 │ inbasketQuestions = getInbasketQuestions()
        ▼                                              ▼
InbasketList.tsx (타입만 import)              InbasketList에 questions prop 전달
InbasketSimulation 등 (문항 1건 사용)          선택 문항으로 시뮬레이션 표시
```

1. **진단 페이지 (`app/app/diagnosis/page.tsx`)**  
   - `getInbasketQuestions()` 를 호출해 `inbasketQuestions` 배열을 얻습니다.  
   - 이 배열을 `<InbasketList questions={inbasketQuestions} … />` 에 넘깁니다.  
   - 목록에서 문항을 선택하면 해당 문항 1건을 시뮬레이션 컴포넌트에 넘깁니다.

2. **인바스켓 목록 (`InbasketList.tsx`)**  
   - `InbasketQuestion` 타입은 `@/lib/inbasketData` 에서 import 하고, 동일 타입을 다시 export 합니다.  
   - 문항 데이터는 **항상 부모(page)에서 받은 `questions` prop**으로만 사용합니다. TSX 내부에 문항 배열을 두지 않습니다.

3. **시뮬레이션 컴포넌트들**  
   - 선택된 문항 1건(`InbasketQuestion`)을 prop으로 받아, `title`, `content`, `category` 등만 참조합니다.  
   - 문항 목록을 직접 로드하지 않습니다.

---

## 4. 더미데이터를 추가·수정하는 방법

### 4.1 문항 추가

1. `data/kappDiagnosis/inbasket/inbasketQuestions.json` 을 엽니다.
2. `questions` 배열에 위 **문항 스키마**에 맞는 객체를 추가합니다.
   - `id` 는 고유값 (예: `inbasket_report_4`).
   - `category` 는 16가지 중 하나여야 해당 타입 시뮬레이션 UI와 연결됩니다.
3. 저장 후 앱을 새로고침하면 목록·필터·시뮬레이션에 반영됩니다. (빌드 시 JSON이 다시 번들에 포함됩니다.)

### 4.2 문항 수정

- 같은 JSON 파일에서 해당 문항 객체의 `title`, `content`, `priority` 등 원하는 필드만 수정하면 됩니다.

### 4.3 로딩 로직을 바꾸는 경우 (예: API 연동)

- **로직 변경 위치**: `lib/inbasketData.ts` 만 수정하면 됩니다.
  - 예: `getInbasketQuestions()` 내부에서 `fetch(...)` 또는 React Query 등으로 API를 호출하도록 바꿀 수 있습니다.
  - 이때 반환 타입은 그대로 `InbasketQuestion[]` 로 유지하면, `page.tsx`·`InbasketList` 등 호출부는 수정하지 않아도 됩니다.

---

## 5. 관련 파일 정리

| 파일 | 역할 |
|------|------|
| `data/kappDiagnosis/inbasket/inbasketQuestions.json` | 디지털 인바스켓 문항 **더미데이터** (단일 소스) |
| `lib/inbasketData.ts` | JSON **로딩 + 타입 정의 + getInbasketQuestions()** |
| `app/app/diagnosis/page.tsx` | `getInbasketQuestions()` 호출 후 목록·시뮬레이션에 전달 |
| `app/app/diagnosis/InbasketList.tsx` | `questions` prop 수신, 타입은 `@/lib/inbasketData` 에서 import |
| `app/app/diagnosis/InbasketSimulation.tsx` | 선택 문항 1건을 시뮬레이션에 전달 |
| `app/app/diagnosis/inbasket-simulations/*.tsx` | 문항 1건의 필드만 참조 (목록 로딩 없음) |

---

## 6. 참고 문서

- **15_digital_inbasket_integration_plan.md** — 디지털 인바스켓 Next.js 통합 기획
- **16_digital_inbasket_48_questions_and_components.md** — 문항 48개 vs 컴포넌트 16개, JSON에 48개 넣는 방법
- **17_digital_inbasket_original_vs_current_audit.md** — 원본 vs 현재 대조·검수
