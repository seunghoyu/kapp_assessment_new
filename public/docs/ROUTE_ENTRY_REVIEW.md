# 진입 경로 추가 시 검토 (origin 메인 홈 + 로그인 개인/관리자 구분)

> origin 메인 홈을 넣고, 로그인을 개인/관리자로 나눈 뒤 개인은 다른 페이지·관리자는 현재 대시보드로 보낼 때 **경로 변경 영향도**와 **필요 작업** 정리.

---

## 1. 결론: 전체 리팩토링 아님

- **관리자 영역 경로(`/dashboard`, `/dashboard/competency`, `/dashboard/employees`)는 그대로 두면 됨.**  
  경로를 바꿀 필요 없고, 리팩토링 범위도 제한적입니다.
- **추가·이동만 하면 됨:**  
  - **메인 홈** 추가 (`/`)  
  - **로그인 페이지** 분리 (`/login`) + 로그인 시 **개인 / 관리자** 구분 후 각각 다른 페이지로 이동  

---

## 2. 현재 구조 요약

| 경로 | 역할 | 비고 |
|------|------|------|
| `/` | 로그인 페이지 | 제출 시 `router.push("/dashboard")` |
| `/dashboard` | 관리자 대시보드 개요 | Sidebar + RightPanel |
| `/dashboard/competency` | 역량 분석 | 동일 레이아웃 |
| `/dashboard/employees` | 직원 관리 | 동일 레이아웃 |
| `/admin` | 관리자 대시보드 (별도 페이지) | 단순 플레이스홀더 |

- **Sidebar** 링크: `/dashboard`, `/dashboard/competency`, `/dashboard/employees` 등 → **변경 불필요**
- **Header** Docs: `/docs/index.html` → **변경 불필요**
- **Navbar**: 루트 layout에서 import만 하고 **실제로는 미사용** (body에 안 넣음)

---

## 3. 변경 후 목표 구조

| 경로 | 역할 |
|------|------|
| `/` | **메인 홈** (origin `index.html` 내용 이식) |
| `/login` | **로그인** + **개인 / 관리자** 선택 후 이동 |
| `/login` → 개인 선택 후 로그인 | → **개인용 페이지** (예: `/my`, `/dashboard-kapp` 등, 추후 정의) |
| `/login` → 관리자 선택 후 로그인 | → **`/dashboard`** (현재와 동일) |
| `/dashboard`, `/dashboard/competency`, `/dashboard/employees` | **그대로** (관리자 전용) |

---

## 4. 경로 변경이 필요한 부분 (제한적)

- **`/`**  
  - 현재: 로그인 페이지  
  - 변경: **메인 홈** (origin 메인 이식).  
  - 기존 로그인 UI는 **`/login`** 으로 옮김.

- **`/login`**  
  - **신규 페이지.**  
  - 구성:  
    - 로그인 폼 (이메일/비밀번호)  
    - **개인 / 관리자** 선택 (탭·라디오·버튼 등)  
    - 제출 시:  
      - 개인 → `router.push("/my")` 등 (개인용 경로 1개로 통일)  
      - 관리자 → `router.push("/dashboard")` (기존과 동일)

- **관리자 영역**  
  - `/dashboard`, `/dashboard/competency`, `/dashboard/employees`  
  - **경로·라우트·Sidebar 링크 모두 변경 없음.**

---

## 5. 수정이 필요한 파일 (요약)

| 구분 | 파일 | 작업 |
|------|------|------|
| **추가** | `app/page.tsx` | 메인 홈으로 **교체** (origin `index.html` 기반으로 Next 컴포넌트화) |
| **추가** | `app/login/page.tsx` | **신규** 로그인 페이지 (기존 `app/page.tsx` 로그인 UI 이동 + 개인/관리자 선택 및 분기) |
| **수정** | (없음) | `/dashboard` 쪽 라우트·Sidebar·데이터 경로는 **수정 불필요** |

- 메인 홈에서 “로그인” 버튼/링크는 **`/login`** 으로 연결하면 됨.
- 북마크·외부 링크:  
  - 기존에 `/` 로 “로그인” 접근하던 경우 → **`/login`** 으로만 바뀜.  
  - `/dashboard` 등 관리자 경로는 그대로 사용 가능.

---

## 6. 리팩토링이 필요 없는 부분

- **`/dashboard` 하위 전체**  
  - 경로, `layout.tsx`, Sidebar, RightPanel, 페이지 컴포넌트, 데이터 import 경로(`@/data/...`) **그대로 유지.**
- **`/docs/index.html`**, Header의 Docs 링크  
  - **변경 없음.**
- **API·데이터 경로**  
  - 상대 경로·동일 경로 사용 중이면 **추가 수정 없음.**

---

## 7. origin 메인 홈 반영 시 참고

- origin: `kapp_origin/index.html`  
  - 상단 nav: 홈, KAPP 진단, 마이 대시보드, 교육 큐레이션, 나의 성장, **관리자**  
  - Hero, 통계, CTA 버튼 등
- Next로 옮길 때:
  - “홈” → `/`  
  - “관리자” / 로그인 진입 → **`/login`** (관리자는 로그인 후 `/dashboard`)  
  - KAPP 진단, 마이 대시보드, 교육 큐레이션, 나의 성장 →  
    개인용 경로(`/my`, `/dashboard-kapp` 등)로 링크만 맞추면 됨.  
  - 기존 HTML/CSS는 React 컴포넌트 + Tailwind(또는 기존 스타일 유지)로 이식하면 됨.

---

## 8. 요약

- **전체 경로/전체 리팩토링은 필요 없음.**  
- **추가할 것:**  
  - `/` → 메인 홈 (origin 메인 이식)  
  - `/login` → 로그인 + 개인/관리자 구분 → 개인용 페이지 vs `/dashboard`  
- **그대로 둘 것:**  
  - `/dashboard`, `/dashboard/competency`, `/dashboard/employees` 및 관련 레이아웃·Sidebar·데이터.

이 순서로 적용하면, 진입 전에 origin 메인 홈이 나오고, 로그인에서 개인/관리자를 나눈 뒤 관리자는 지금처럼 `/dashboard`로 이동하는 구조를 만들 수 있습니다.
