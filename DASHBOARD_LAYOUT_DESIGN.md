# 대시보드 레이아웃 설계 (디자인 시스템 반영)

## 전체 레이아웃 구조

```
┌─────────────────────────────────────────────────────┐
│         Header (white, border-gray-200)              │
│  [제목] [검색] [알림] [프로필]                       │
├──────────┬──────────────────────────────────────────┤
│          │                                          │
│ Sidebar  │         Main Dashboard Area              │
│ (white)  │         (bg-gray-50)                     │
│          │                                          │
│ [메뉴]   │  ┌──────────────────────────────────┐   │
│          │  │  Card (white, border-gray-200)    │   │
│          │  │  ┌────────────────────────────┐  │   │
│          │  │  │ Badge (blue-100/bg)        │  │   │
│          │  │  │ Tag (yellow-100/bg)        │  │   │
│          │  │  └────────────────────────────┘  │   │
│          │  └──────────────────────────────────┘   │
│          │                                          │
│ [설정]   │  ┌──────────────────────────────────┐   │
│ [도움말] │  │  Table (white, border-gray-200)  │   │
│          │  │  [Header: bg-gray-50]            │   │
│          │  │  [Row: hover:bg-gray-50]        │   │
│          │  │  [Badge: blue-100/bg]           │   │
│          │  └──────────────────────────────────┘   │
│          │                                          │
└──────────┴──────────────────────────────────────────┘
```

---

## 컴포넌트별 디자인 시스템 적용

### 1. Sidebar

#### 구조
- **배경**: `bg-white`
- **보더**: `border-r border-gray-200`
- **브랜드 영역**: `border-b border-gray-200`

#### 메뉴 아이템
- **비활성**: 
  - 배경: 없음
  - 텍스트: `text-gray-700`
  - 호버: `hover:bg-gray-50`
  - 아이콘: `text-gray-500`
  
- **활성** (포인트 컬러 사용):
  - 배경: `bg-blue-50` (연한 배경)
  - 텍스트: `text-blue-700` (포인트 컬러)
  - 아이콘: `text-blue-600`
  - 왼쪽 보더: `border-l-2 border-blue-500` (선택적)

---

### 2. Header

#### 구조
- **배경**: `bg-white`
- **보더**: `border-b border-gray-200`
- **높이**: `h-16`

#### 요소
- **제목**: `text-gray-900 text-xl font-semibold`
- **서브타이틀**: `text-gray-500 text-sm`
- **검색 바**: `bg-white border-gray-300`
- **알림 아이콘**: `text-gray-500`
- **프로필**: `bg-gray-200` (아바타 배경)

---

### 3. Card (기본 카드)

#### 구조
- **배경**: `bg-white`
- **보더**: `border border-gray-200`
- **그림자**: `shadow-sm`
- **패딩**: `p-6`
- **모서리**: `rounded-lg`

#### 내부 요소
- **제목**: `text-gray-900 text-base font-semibold`
- **본문**: `text-gray-700 text-sm`
- **보조 텍스트**: `text-gray-500 text-xs`

#### 포인트 컬러 사용 예시
- **KPI 라벨**: 작은 배지 형태
  - `bg-blue-100 text-blue-700` (기본)
  - `bg-yellow-100 text-yellow-700` (경고)
  - `bg-purple-100 text-purple-700` (강조)

---

### 4. Badge/Tag

#### 기본 구조
- **크기**: `px-2 py-1 text-xs font-medium rounded`
- **배경/텍스트 조합**:
  - Blue: `bg-blue-100 text-blue-700`
  - Yellow: `bg-yellow-100 text-yellow-700`
  - Purple: `bg-purple-100 text-purple-700`
  - Gray: `bg-gray-100 text-gray-700`

#### 사용 위치
- 카드 내부 라벨
- 테이블 상태 컬럼
- 필터 칩
- 상태 표시

---

### 5. Table

#### 구조
- **배경**: `bg-white`
- **보더**: `border border-gray-200`
- **모서리**: `rounded-lg`
- **오버플로우**: `overflow-hidden`

#### 헤더
- **배경**: `bg-gray-50`
- **텍스트**: `text-gray-900 text-sm font-semibold`
- **패딩**: `px-6 py-3`
- **보더**: `border-b border-gray-200`

#### 행
- **기본**: `bg-white`
- **호버**: `hover:bg-gray-50`
- **보더**: `border-b border-gray-200` (마지막 행 제외)
- **패딩**: `px-6 py-4`

#### 셀 내용
- **텍스트**: `text-gray-700 text-sm`
- **태그/배지**: 위 Badge 규칙 적용

---

### 6. Button

#### Primary Button
- **배경**: `bg-blue-500`
- **텍스트**: `text-white`
- **호버**: `hover:bg-blue-600`
- **패딩**: `px-4 py-2`
- **모서리**: `rounded-md`

#### Secondary Button
- **배경**: `bg-white`
- **텍스트**: `text-gray-700`
- **보더**: `border border-gray-300`
- **호버**: `hover:bg-gray-50`

#### Ghost Button
- **배경**: 없음
- **텍스트**: `text-gray-700`
- **호버**: `hover:bg-gray-50`

---

### 7. StatCard (KPI 카드)

#### 구조
- **배경**: `bg-white`
- **보더**: `border border-gray-200`
- **그림자**: `shadow-sm`
- **패딩**: `p-6`

#### 내부 구성
- **아이콘**: `text-gray-400` (작은 아이콘, 배경에)
- **라벨**: `text-gray-500 text-xs font-medium`
- **값**: `text-gray-900 text-2xl font-semibold`
- **델타** (포인트 컬러 사용):
  - 증가: `text-blue-600` + `bg-blue-50`
  - 감소: `text-gray-600` + `bg-gray-50`
  - 경고: `text-yellow-600` + `bg-yellow-50`

---

### 8. ChartCard

#### 구조
- **배경**: `bg-white`
- **보더**: `border border-gray-200`
- **그림자**: `shadow-sm`
- **패딩**: `p-6`

#### 헤더
- **제목**: `text-gray-900 text-base font-semibold`
- **컨트롤**: 작은 버튼들 (Secondary/Ghost 스타일)

#### 차트 영역
- **배경**: `bg-gray-50` (플레이스홀더)
- **범례**: 포인트 컬러 사용 (blue/yellow/purple)

---

## 포인트 컬러 사용 예시 시나리오

### 시나리오 1: Sidebar 활성 메뉴
```
비활성: [아이콘] 텍스트 (gray-700)
활성:   [아이콘] 텍스트 (blue-700, bg-blue-50)
```

### 시나리오 2: 테이블 상태 태그
```
[활성]     → bg-blue-100 text-blue-700
[진행중]   → bg-yellow-100 text-yellow-700
[프리미엄] → bg-purple-100 text-purple-700
[비활성]   → bg-gray-100 text-gray-700
```

### 시나리오 3: KPI 카드 델타
```
+5.2% → text-blue-600 bg-blue-50
-2.1% → text-gray-600 bg-gray-50
⚠️    → text-yellow-600 bg-yellow-50
```

### 시나리오 4: 필터 탭
```
비활성: text-gray-700 hover:bg-gray-50
활성:   text-blue-700 bg-blue-50 border-b-2 border-blue-500
```

---

## 결과적 톤

**"차분한 대시보드 + 포인트 컬러로만 의미 강조"**

- 전체: 화이트/라이트 그레이 기반
- 포인트 컬러: 작은 UI 요소에만 제한적 사용
- 기업용 대시보드의 전문적이고 차분한 느낌
- 가독성과 일관성 우선
