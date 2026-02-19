# 소비자 진입점 재구성 초안

> 소비자용 홈·로그인·대시보드 플로우 및 관리자 분리 구조 초안입니다.

---

## 1. 경로 구조 요약

| 경로 | 역할 | 비고 |
|------|------|------|
| **`/`** | **소비자 홈** (최초 진입점) | kapp_origin index.html 콘텐츠, 상단 메뉴 없음 |
| **`/login`** | **소비자 KAPP 로그인** | 이메일(아이디) + 비밀번호 설정/로그인, "KAPP 진단 시작하기" 진입 |
| **`/admin`** | **관리자 로그인** | 기존 로그인 화면, "관리자 페이지로 이동" 링크 대상 |
| **`/dashboard`** | **관리자 대시보드** | 기존 유지 (직원 관리, 역량 분석 등) |
| **`/app`** | **소비자 대시보드** | KAPP 진단, 마이 대시보드, 교육 큐레이션, 나의 성장 |

### 플로우 다이어그램

```
[소비자]
  / (홈) 
    → "KAPP 진단 시작하기" 클릭 
    → /login (소비자 로그인)
       → 최초: 이메일 + 비밀번호 설정 → /app
       → 재방문: 이메일 + 비밀번호 로그인 → /app
       → "관리자 페이지로 이동" 클릭 → /admin

[관리자]
  /admin (관리자 로그인)
    → 로그인 성공 → /dashboard (기존 ERP)
```

---

## 2. 상세 설계

### 2-1. 소비자 홈 (`/`)

- **출처**: `kapp_origin/index.html` 내용 그대로 이식
- **변경 사항**
  - 상단 네비게이션 전체 제거 (홈, KAPP 진단, 마이 대시보드, 교육 큐레이션, 나의 성장, 관리자)
  - 하단 CTA 등 내부 링크 정리:
    - `assessment-kapp.html` → `Link` `/login` (KAPP 진단 진입점)
    - `admin.html` → `Link` `/admin` (관리자 문의/로그인)
- **스타일**: `kapp_origin/css/style.css` 기준 → Tailwind + 기존 `kapp_assessment_new` 퍼블리싱 톤에 맞게 변환
- **버튼**
  - "KAPP 진단 시작하기" → `router.push('/login')` 또는 `<Link href="/login">`

### 2-2. 소비자 로그인 (`/login`)

- **입장 경로**: 홈의 "KAPP 진단 시작하기"
- **역할**
  - **최초 진입**: 이메일(아이디) + 비밀번호 설정 → 회원가입/세션 생성
  - **재방문**: 이메일 + 비밀번호 로그인
- **UI 구성**
  - 이메일 입력
  - 비밀번호 입력 (최초: "비밀번호 설정", 재방문: "비밀번호")
  - 제출 버튼 (최초: "시작하기" / 재방문: "로그인")
  - 링크: "관리자 페이지로 이동" → `/admin`
- **기존 로그인과의 관계**
  - 현재 `app/page.tsx` 로그인 → `app/admin/page.tsx`로 이동
  - `/admin`이 관리자 전용 로그인 페이지 역할

### 2-3. 관리자 로그인 (`/admin`)

- **역할**: 기존 관리자 LMS 로그인
- **입장 경로**
  - 소비자 로그인 페이지의 "관리자 페이지로 이동"
  - 직접 URL `/admin` 접근
- **구성**
  - 현재 `app/page.tsx` 내용을 `app/admin/page.tsx`로 이동
  - 로그인 성공 시 `router.push('/dashboard')`
- **경로 변경 사항**
  - `app/page.tsx`: 로그인 → 홈 페이지 콘텐츠로 교체
  - `app/admin/page.tsx`: 기존 로그인 UI 유지 (또는 별도 `/admin/login` 구성 가능)

### 2-4. 소비자 대시보드 (`/app`)

- **레이아웃**: 관리자 대시보드와 동일한 ERP 스타일 (Sidebar + 메인 영역)
- **사이드바 메뉴**
  1. KAPP 진단
  2. 마이 대시보드
  3. 교육 큐레이션
  4. 나의 성장
- **라우팅 예시**
  - `/app` → KAPP 진단 또는 대시보드 랜딩
  - `/app/diagnosis` → KAPP 진단
  - `/app/dashboard` → 마이 대시보드
  - `/app/education` → 교육 큐레이션
  - `/app/growth` → 나의 성장
- **참고**: `kapp_origin`의 `assessment-kapp.html`, `dashboard-kapp.html`, `education.html`, `my-growth.html` 구조·기능 참고

---

## 3. 구현 체크리스트 (초안)

### Phase 1: 경로·페이지 분리 ✅

- [x] `app/page.tsx`를 소비자 홈으로 변경 (kapp_origin index 이식)
- [x] `app/login/page.tsx` 신규 생성 (소비자 로그인)
- [x] `app/admin/page.tsx`에 기존 로그인 UI 이동
- [x] 경로 상수 파일 생성 (`lib/routes.ts`)

### Phase 2: 소비자 홈 ✅

- [x] kapp_origin index.html 섹션별 Tailwind 컴포넌트로 이식
- [x] 상단 네비게이션 제거
- [x] "KAPP 진단 시작하기" → `/login` 링크
- [x] Tailwind 기반 퍼블리싱

### Phase 3: 로그인 페이지 ✅

- [x] `/login`: 이메일 + 비밀번호, "관리자 페이지로 이동" → `/admin`
- [x] `/admin`: 기존 로그인 UI, 성공 시 → `/dashboard`
- [x] 최초/재방문 분기 (localStorage mock, 추후 API 연동)

### Phase 4: 소비자 대시보드 ✅

- [x] `app/app/layout.tsx` 생성
- [x] ConsumerSidebar (KAPP 진단, 마이 대시보드, 교육 큐레이션, 나의 성장)
- [x] 각 메뉴별 placeholder 페이지 생성

### Phase 5: 경로 참조 정리 ✅

- [x] Navbar, Sidebar, ROUTES 상수 일원화
- [ ] `generate-docs-index.js` 등 문서 내 경로가 있다면 업데이트

---

## 4. 확인이 필요한 사항

### Q1. 소비자 대시보드 진입 전 로그인 필수 여부

- KAPP 진단만 하고 바로 진단 화면으로 가는 흐름인지,
- 아니면 반드시 `/login`에서 이메일·비밀번호 입력 후 `/app`으로 가는지 확인 필요

### Q2. 관리자 로그인 경로

- `/admin` 한 경로로 로그인 폼 + 관리자 전용 대시보드 진입까지 처리할지,
- `/admin/login`(로그인) → `/dashboard`(관리자 대시보드)로 분리할지 결정 필요

### Q3. 소비자·관리자 대시보드 구조

- 소비자: KAPP 진단, 마이 대시보드, 교육 큐레이션, 나의 성장
- 관리자: 직원 관리, 역량 분석, 교육 프로그램 등
- 두 대시보드의 `layout`을 공통으로 쓸지, Sidebar만 다른지 확인 필요

### Q4. 인증·저장 방식

- 비밀번호는 어디에 저장할지 (로컬스토리지, 서버 API 등)
- 세션/쿠키 사용 여부

### Q5. kapp_origin 리소스 의존

- `kapp_origin`의 `css/`, `images/` 등을 `public/`으로 복사해 사용할지,
- Next.js Image, Tailwind로 전부 변환할지 결정 필요

---

## 5. 경로 상수 제안 (`lib/routes.ts`)

```ts
export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  ADMIN: "/admin",
  DASHBOARD: "/dashboard",       // 관리자 대시보드
  APP: "/app",                   // 소비자 대시보드
  APP_DIAGNOSIS: "/app/diagnosis",
  APP_MY_DASHBOARD: "/app/dashboard",
  APP_EDUCATION: "/app/education",
  APP_GROWTH: "/app/growth",
} as const;
```

---

## 6. 다음 단계 제안

1. 위 Q1~Q5에 대한 결정 정리
2. Phase 1~2 우선 구현 (홈 + 로그인 플로우)
3. 이후 Phase 3~5 순차 진행

추가로 필요한 요구사항이나 변경점이 있으면 알려주시면 반영하겠습니다.
