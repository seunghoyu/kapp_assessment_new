# 🧪 KAPP 진단 테스트 가이드

## 🎯 목적
다양한 문항 유형(8가지)이 실제로 작동하는지 확인하고 몰입 경험을 테스트합니다.

---

## 📋 테스트 절차

### 1단계: 진단 시작
1. `assessment-kapp.html` 파일을 브라우저에서 엽니다
2. 브라우저 개발자 도구(F12)를 열어 Console 탭을 확인합니다

### 2단계: 프로파일 입력
다음 정보를 입력합니다:

- **이름**: 테스트용 (아무 이름)
- **산업군**: IT / 금융 / 교육 등 선택
- **세부 직무**: 산업군에 따라 자동으로 표시됨
- **직급**: 인턴 ~ 임원
- **연차**: 신입 ~ 20년 이상
- **기업 규모**: 스타트업 ~ 대기업

**추천 테스트 프로파일:**
```
이름: 홍길동
산업군: IT
직무: 개발자(Backend)
직급: 대리
연차: 3-5년
기업 규모: 중견기업
진단 목표: 모두 체크
```

### 3단계: Knowledge 진단 확인
진단을 시작하면 Console에 다음과 같은 로그가 표시됩니다:

```
🔍 Checking enhanced questions...
✅ Enhanced questions loaded!
  - Knowledge: X questions
  - Application: X questions
  - Performance: X questions
  - Productivity: X questions

📋 Loading question for category: knowledge
✅ Using ENHANCED question types!
  - Selected question: [question_type] ([question_id])
```

**확인 사항:**
- ✅ "Enhanced questions loaded!" 메시지가 나타나는가?
- ✅ 문항 개수가 0보다 큰가?
- ✅ 다양한 `question_type`이 나타나는가? (multiple_choice, code_review 등)

### 4단계: 다양한 문항 유형 체험
각 카테고리에서 다음 문항 유형들을 경험할 수 있습니다:

#### Knowledge (📚)
- **객관식**: 기본 지식 측정
- **코드 리뷰**: IT 직군 한정, 보안 취약점 찾기

#### Application (⚙️)
- **실무 시나리오**: 프로덕션 장애 대응, 타이머 포함
- **시뮬레이션**: 대시보드 분석, 실시간 데이터
- **드래그앤드롭**: 업무 우선순위 매트릭스

#### Performance (📊)
- **롤플레이**: VIP 고객 대응, 만족도 바
- **대시보드 분석**: 로그 분석, 핵심 문제 파악

#### Productivity (⚡)
- **E-tray**: 이메일 우선순위 처리 (10분)
- **게이미피케이션**: ROI 시뮬레이터, 스피드 게임

---

## 🐛 문제 해결

### 문제 1: "Enhanced questions NOT loaded!"
**원인**: JavaScript 로딩 순서 문제

**해결 방법:**
1. HTML 파일에서 스크립트 로딩 순서 확인:
```html
<script src="js/main.js"></script>
<script src="js/kapp-data.js"></script>
<script src="js/kapp-questions-enhanced.js"></script>  ← 이게 먼저!
<script src="js/kapp-renderers.js"></script>
<script src="js/kapp-assessment.js"></script>
```

2. 브라우저 캐시 삭제 후 새로고침 (Ctrl + Shift + R)

### 문제 2: 기존 선택형 문항만 나옴
**원인**: `window.enhancedQuestions`가 카테고리별로 정리되지 않음

**확인 방법:**
Console에서 확인:
```javascript
console.log(window.enhancedQuestions);
// 출력 예: { knowledge: [...], application: [...], ... }
```

### 문제 3: 문항 렌더링 오류
**원인**: 렌더러 함수 미구현

**확인 방법:**
Console에서 확인:
```javascript
console.log(window.renderQuestion);  // function이어야 함
```

---

## ✅ 성공 기준

다음 조건을 모두 만족하면 성공입니다:

1. ✅ Knowledge 카테고리에서 **객관식** 또는 **코드 리뷰** 문항이 나옴
2. ✅ Application 카테고리에서 **시나리오**, **시뮬레이션**, **드래그앤드롭** 중 하나가 나옴
3. ✅ Performance 카테고리에서 **롤플레이** 또는 **대시보드 분석**이 나옴
4. ✅ Productivity에서 **E-tray** 또는 **게임**이 나옴
5. ✅ 각 문항이 시각적으로 다르고 인터랙티브함
6. ✅ Console에 "Using ENHANCED question types!" 메시지가 표시됨

---

## 📊 기대 결과

### 진단 흐름
```
User Info (1분)
    ↓
Knowledge (3-4분)
  - 객관식 2-3개
  - 코드 리뷰 1개 (IT 직군)
    ↓
Application (10-15분)
  - 실무 시나리오 1개
  - 시뮬레이션 1개
  - 드래그앤드롭 1개
    ↓
Performance (5-10분)
  - 롤플레이 1개
  - 대시보드 분석 1개
    ↓
Productivity (10분)
  - E-tray 시뮬레이션
  - 게임 1개
    ↓
AI Analysis (자동)
    ↓
Dashboard
```

### 총 소요 시간
- **최소**: 30분
- **최대**: 45분
- **평균**: 35-40분

### 참여율/만족도
- 참여율: 95% 목표 (기존 60%)
- 만족도: 4.8/5.0 목표 (기존 3.2/5.0)

---

## 📝 피드백 수집

테스트 후 다음 사항을 확인하세요:

1. **몰입감**: 재미있었나요? (1-5점)
2. **난이도**: 적절했나요? (너무 쉬움 / 적절 / 너무 어려움)
3. **다양성**: 문항이 다양했나요? (예 / 아니오)
4. **시간**: 진단 시간이 적절했나요? (예 / 아니오)
5. **버그**: 오류가 발생했나요? (있다면 Console 로그 캡처)

---

## 🚀 다음 단계

테스트가 성공적이면:
1. ✅ 추가 문항 작성 (산업별 100+ 문항)
2. ✅ 벤치마킹 대시보드 구현
3. ✅ ROI 예측 엔진 고도화
4. ✅ AI 생성 IDP 자동화
5. ✅ 게이미피케이션 확장 (배지, 리더보드)

---

**문의**: 테스트 중 문제가 발생하면 Console 로그를 캡처해서 공유해주세요! 🙏
