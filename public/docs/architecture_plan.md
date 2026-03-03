# architecture_plan.md

---

# 1. Scope

- **문서 목적:** 가상 프론트(Frontend only) 범위의 아키텍처를 정리하여, 이후 "혼합형 + 줌(레벨 전환) 아키텍처" HTML 모식도 생성의 기준 문서로 사용한다.
- **포함:** 라우트(경로), 레이아웃(사이드바·헤더·우측 패널), 메뉴, 탭, 버튼, 모달, 폼·입력 요소, 테이블·카드 등 화면에 보이는 모든 UI 구성요소. 라우트/화면/UI요소/상태/로직/데이터소스(파일경로+샘플) 모두 포함.
- **미포함:** API 서버, 인증 서비스, DB, 외부 연동 등 백엔드/DB/실제 서버(추후 문서로 분리 예정).

---

# 2. Source Input (Original Tree)

아래는 **원문 그대로** 삽입한 입력 트리입니다. 수정 금지.

**트리 1: Root ~ 학습자 LMS (/app)**

```
Root (진입점)
 │
 ├─ / (홈, Landing)
 │    ├─ [버튼] KAPP 진단 시작하기 → /login  # 솔루션 상세페이지
 │    ├─ [버튼] 서비스 둘러보기
 │    ├─ [링크] KAPP 진단 시작하기 (Hero)
 │    ├─ [링크] 체험하기 → /login
 │    ├─ [링크] 무료로 진단 시작하기 → /login
 │    ├─ [링크] 도입 문의 (1:1 상담) → /admin
 │    └─ Footer: KAPP 진단, 대시보드 → /login, /app
 │
 ├─ /login (학습자 로그인/회원가입, Consumer Login)
 │    ├─ [입력] 이메일 (아이디), 비밀번호
 │    ├─ [체크박스] 전체 동의 / 필수 개인정보 수집·이용 / 이메일 마케팅 / 전화번호 마케팅
 │    ├─ [버튼] 내용 보기 → 모달 (필수·이메일·전화 약관 전문)
 │    ├─ [버튼] 로그인 | 회원가입 (submit → localStorage 계정 저장 후 /app 이동)
 │    └─ [링크] 관리자 페이지로 이동 → /admin
 │    <!-- JS: getStoredAccounts/setStoredAccounts, 동의 내역 CONSENTS_KEY 저장 -->
 │
 ├─ /admin (관리자 로그인, Admin Login)
 │    ├─ [입력] 이메일, 비밀번호
 │    ├─ [버튼] 로그인 (submit → /dashboard 이동)
 │    └─ [링크] 홈으로 돌아가기 → /
 │
 └─ /app (학습자 LMS 레이아웃: ConsumerSidebar + 본문)
      │
      ├─ [사이드바] ConsumerSidebar
      │    ├─ [로고] 클릭 → /app
      │    ├─ [버튼] 접기/펼치기 (chevronLeft / chevronRight) ← isCollapsed 토글
      │    ├─ [메뉴] KAPP 진단 → /app/diagnosis
      │    ├─ [메뉴] 마이 대시보드 → /app/dashboard
      │    └─ [메뉴] 나의 성장 → /app/growth
      │
      ├─ /app (앱 홈)
      │    └─ [버튼] KAPP 진단 시작하기 → /app/diagnosis
      │
      ├─ /app/diagnosis (KAPP 지능형 역량 진단)
      │    ├─ [데이터] 요약 (전체 경로 + 샘플)
      │    │    ├─ step 1: data/kappDiagnosis/userInfoOptions.json
      │    │    │    [샘플] positionLevels[0]: { "value": "인턴", "label": "인턴" }
      │    │    ├─ step 2: data/kappDiagnosis/knowledgeQuestions.json
      │    │    │    [샘플] questions[0] (5-13라인) ↓
      │    │    │      "id": "mc_1", "category": "knowledge", "difficulty": "medium",
      │    │    │      "industry": "금융", "job": "카드사업부 마케터",
      │    │    │      "question": "카드사의 주요 수익 구조(NIM)에서 가장 큰 비중을 차지하는 것은?",
      │    │    │      "options": ["연회비 수익", "가맹점 수수료(MDR)", "카드론 이자 수익", "포인트 제휴 수수료"],
      │    │    │      "answer": 1, "explanation": "MDR은 카드사의 가장 큰 수익원입니다."
      │    │    ├─ step 3: data/kappDiagnosis/applicationQuestions.json
      │    │    │    [샘플] questions[0] (4-19라인) ↓
      │    │    │      "id": "sc_it_1", "industry": "IT", "job": "개발자(Backend)", "position": "대리",
      │    │    │      "title": "프로덕션 장애 대응", "scenario": "현재 시간: 오후 9시 30분. 프로덕션 서버에서 500 에러…",
      │    │    │      "question": "이 상황에서 어떤 순서로 대응하시겠습니까?",
      │    │    │      "options": [{ "label": "즉시 서버 재시작 → 로그 확인", "score": 40 }, { "label": "DB 커넥션 강제 종료 → Slow Query 최적화", "score": 95 }, …], "answer": 1
      │    │    ├─ step 4: data/kappDiagnosis/performanceQuestions.json
      │    │    │    [샘플] questions[0] (4-17라인) ↓
      │    │    │      "id": "perf_fin_1", "industry": "금융", "job": "카드사업부 마케터",
      │    │    │      "title": "카드 마케팅 성과 지표",
      │    │    │      "question": "CAC를 낮추면서 발급 건수를 늘리기 위한 방법으로 가장 효과적인 것은?",
      │    │    │      "options": [{ "label": "광고 단가만 낮추기", "score": 40 }, { "label": "타겟 세그먼트 정교화 + 바이럴/제휴 활용", "score": 92 }, …], "answer": 1
      │    │    ├─ step 5: lib/inbasketData.ts → data/kappDiagnosis/inbasket/inbasketQuestions.json
      │    │    │    [샘플] questions[0] (4라인) ↓
      │    │    │      "id": "inbasket_email_1", "title": "[긴급] 프로덕션 서버 CPU 사용률 95% 초과",
      │    │    │      "category": "이메일 관리", "jobCategory": "커뮤니케이션", "sender": "이CTO", "date": "5분 전", "priority": "긴급",
      │    │    │      "content": "프로덕션 서버 3대 중 2대의 CPU 사용률이 95%를 초과했습니다. …", "attachments": []
      │    │    └─ step 6: data/kappDiagnosis/aiWorkflowByIndustry.json
      │    │    │    [샘플] byIndustry["IT"] (4-17라인) ↓
      │    │    │      "id": "it_ai_workflow", "industry": "IT", "title": "AI 워크플로우: 코드 리뷰 자동화",
      │    │    │      "task": "당신은 Backend 개발팀의 리드 개발자입니다. 팀원 5명이 매일 평균 3개의 PR…",
      │    │    │      "options": [{ "id": "it_ai_a", "choice": "A. GitHub Copilot 단독 사용", "timeReduction": "20%", "qualityScore": 70 }, …],
      │    │    │      "answer": 1, "explanation": "SonarQube + AI 봇 조합은 반복적 검토를 자동화…"
      │    ├─ [상단] 제목 "KAPP 지능형 역량 진단", 부제 Knowledge·Application·Performance·Productivity
      │    ├─ [단계 버튼] 시작·정보·지식·적용·성과·인바스켓·AI·결과 (STEPS) ← step 상태, 클릭 시 해당 단계로 이동
      │    ├─ step 0 (시작)
      │    │    └─ [버튼] 진단 시작하기 → step 1
      │    ├─ step 1 (정보 입력)
      │    │    ├─ [데이터] data/kappDiagnosis/userInfoOptions.json
      │    │    │    ├─ industryJobData: 산업별 직무 { icon, jobs[] } (키: IT, 금융, 교육, 의료, 제조, …)
      │    │    │    ├─ positionLevels[]: { value, label } (직급)
      │    │    │    ├─ experienceYears[]: { value, label } (연차)
      │    │    │    ├─ companySizes[]: { value, label, icon } (기업 규모)
      │    │    │    └─ diagnosticGoals[]: { value, label } (진단 목표)
      │    │    │    ├─ [샘플] industryJobData 첫 항목
      │    │    │    │      "IT": { "icon": "💻", "jobs": ["개발자(Backend)", "개발자(Frontend)", "데이터 엔지니어", …] }
      │    │    │    ├─ [샘플] positionLevels[0]
      │    │    │    │      { "value": "인턴", "label": "인턴" }
      │    │    │    ├─ [샘플] experienceYears[0]
      │    │    │    │      { "value": "1년 미만", "label": "1년 미만 (신입)" }
      │    │    │    ├─ [샘플] companySizes[0]
      │    │    │    │      { "value": "대기업", "label": "대기업 (1000명 이상)", "icon": "🏢" }
      │    │    │    └─ [샘플] diagnosticGoals[0]
      │    │    │          { "value": "승진", "label": "승진 준비" }
      │    │    ├─ [입력] 이름*, 이메일, 산업군*, 세부 직무*, 직급*, 연차*, 회사명, 기업 규모*
      │    │    ├─ [버튼] 진단 목표 (복수 선택) ← toggleGoal
      │    │    └─ (다음 단계는 하단 이전/다음에서)
      │    ├─ step 2 (지식 문항)
      │    │    ├─ [데이터] data/kappDiagnosis/knowledgeQuestions.json
      │    │    │    ├─ questions[]: id, category, difficulty, industry, job, question, options[], answer, explanation
      │    │    │    └─ [샘플] questions[0] (knowledgeQuestions.json 5-13라인)
      │    │    │         "id": "mc_1",
      │    │    │         "category": "knowledge",
      │    │    │         "difficulty": "medium",
      │    │    │         "industry": "금융",
      │    │    │         "job": "카드사업부 마케터",
      │    │    │         "question": "카드사의 주요 수익 구조(NIM)에서 가장 큰 비중을 차지하는 것은?",
      │    │    │         "options": ["연회비 수익", "가맹점 수수료(MDR)", "카드론 이자 수익", "포인트 제휴 수수료"],
      │    │    │         "answer": 1,
      │    │    │         "explanation": "MDR(Merchant Discount Rate)은 카드사의 가장 큰 수익원입니다."
      │    │    └─ [라디오] 문항별 선택지 (answers.knowledge)
      │    ├─ step 3 (적용 문항)
      │    │    ├─ [데이터] data/kappDiagnosis/applicationQuestions.json
      │    │    │    ├─ questions[]: id, industry, job, position, title, scenario, question, options[{ label, score }], answer
      │    │    │    └─ [샘플] questions[0] (applicationQuestions.json 4-19라인)
      │    │    │         "id": "sc_it_1",
      │    │    │         "category": "application",
      │    │    │         "industry": "IT",
      │    │    │         "job": "개발자(Backend)",
      │    │    │         "position": "대리",
      │    │    │         "title": "프로덕션 장애 대응",
      │    │    │         "scenario": "현재 시간: 오후 9시 30분. 프로덕션 서버에서 500 에러가 발생하고 있습니다. CPU 95%, 메모리 88%…",
      │    │    │         "question": "이 상황에서 어떤 순서로 대응하시겠습니까?",
      │    │    │         "options": [{ "label": "즉시 서버 재시작 → 로그 확인 → 원인 분석", "score": 40 }, { "label": "DB 커넥션 강제 종료 → Slow Query 최적화", "score": 95 }, …],
      │    │    │         "answer": 1
      │    │    └─ [라디오] 시나리오별 선택지 (answers.application)
      │    ├─ step 4 (성과 문항)
      │    │    ├─ [데이터] data/kappDiagnosis/performanceQuestions.json
      │    │    │    ├─ questions[]: id, category, industry, job, title, question, options[{ label, score }], answer
      │    │    │    └─ [샘플] questions[0] (performanceQuestions.json 4-17라인)
      │    │    │         "id": "perf_fin_1",
      │    │    │         "category": "performance",
      │    │    │         "industry": "금융",
      │    │    │         "job": "카드사업부 마케터",
      │    │    │         "title": "카드 마케팅 성과 지표",
      │    │    │         "question": "카드사 마케팅에서 'CAC(고객 획득 비용)'를 낮추면서 발급 건수를 늘리기 위한 방법으로 가장 효과적인 것은?",
      │    │    │         "options": [{ "label": "광고 단가만 낮추기", "score": 40 }, { "label": "타겟 세그먼트 정교화 + 바이럴/제휴 활용", "score": 92 }, …],
      │    │    │         "answer": 1
      │    │    └─ [라디오] 문항별 선택지 (answers.performance)
      │    ├─ step 5 (디지털 인바스켓)
      │    │    ├─ [데이터] lib/inbasketData.ts → data/kappDiagnosis/inbasket/inbasketQuestions.json
      │    │    │    ├─ questions[]: id, title, category, jobCategory, sender, date, priority, content, attachments[]
      │    │    │    └─ [샘플] questions[0] (inbasketQuestions.json 4라인)
      │    │    │         "id": "inbasket_email_1",
      │    │    │         "title": "[긴급] 프로덕션 서버 CPU 사용률 95% 초과",
      │    │    │         "category": "이메일 관리",
      │    │    │         "jobCategory": "커뮤니케이션",
      │    │    │         "sender": "이CTO (최고기술책임자)",
      │    │    │         "date": "5분 전",
      │    │    │         "priority": "긴급",
      │    │    │         "content": "프로덕션 서버 3대 중 2대의 CPU 사용률이 95%를 초과했습니다. 서버 A: CPU 97%, 서버 B: CPU 96%…",
      │    │    │         "attachments": []
      │    │    ├─ [툴팁 버튼] HelpCircle ← 이용 안내 팝오버, 닫기 시 sessionStorage에 저장
      │    │    ├─ [뷰] 목록(InbasketList) | 시뮬레이션(InbasketSimulation)
      │    │    │
      │    │    │  ■ InbasketList (목록 뷰)
      │    │    │    ├─ [필터 버튼] 직무 선택: 전체, 경영/기획, … (JOB_PILLS) ← jobFilter, 문항 수 배지
      │    │    │    ├─ [테이블] 우선순위·제목·발신자·카테고리·내용·액션
      │    │    │    ├─ [버튼] 제목 클릭 → 상세 모달
      │    │    │    ├─ [버튼] 상세보기 → 동일 모달
      │    │    │    └─ [버튼] 진행하기 → inbasketView=simulation, 해당 문항 시뮬레이션 진입
      │    │    │
      │    │    │  ■ 상세 모달 (modalQuestion)
      │    │    │    ├─ [버튼] X 닫기
      │    │    │    ├─ [버튼] 시뮬레이션 시작 → 시뮬레이션 뷰 진입 후 모달 닫기
      │    │    │    └─ [버튼] 기본 응답 작성 → alert (개발 중)
      │    │    │
      │    │    │  ■ InbasketSimulation (시뮬레이션 뷰)
      │    │    │    ├─ [버튼] 목록으로 ← onBack, inbasketView=list로 복귀
      │    │    │    ├─ [영역] SimulationContent (문항 타입별 컴포넌트: 이메일·메신저·보고서 등)
      │    │    │    └─ [버튼] 완료하고 다음 단계로 ← onComplete → step 6
      │    │    │
      │    │    └─ (단계 버튼에서 인바스켓 단계 클릭 시 목록으로 복귀)
      │    ├─ step 6 (AI 워크플로우)
      │    │    ├─ [데이터] data/kappDiagnosis/aiWorkflowByIndustry.json
      │    │    │    ├─ byIndustry{ 산업명: id, industry, title, task, options[], answer, explanation }
      │    │    │    └─ [샘플] byIndustry["IT"] (aiWorkflowByIndustry.json 4-17라인)
      │    │    │         "id": "it_ai_workflow",
      │    │    │         "industry": "IT",
      │    │    │         "title": "AI 워크플로우: 코드 리뷰 자동화",
      │    │    │         "task": "당신은 Backend 개발팀의 리드 개발자입니다. 팀원 5명이 매일 평균 3개의 Pull Request를 올리며…",
      │    │    │         "options": [{ "id": "it_ai_a", "choice": "A. GitHub Copilot 단독 사용", "timeReduction": "20%", "qualityScore": 70 }, …],
      │    │    │         "answer": 1,
      │    │    │         "explanation": "SonarQube + AI 봇 조합은 반복적 검토를 자동화하고, 사람은 고차원적 판단에 집중하게 하여 시간 60% 절감과 품질 향상을 동시에 달성합니다."
      │    │    └─ [라디오] 산업별 시나리오 선택지 (answers.ai)
      │    ├─ step 7 (결과)
      │    │    └─ (문구만, 추후 연동 예정)
      │    ├─ [하단] 이전 | 다음 (step 5 시뮬레이션 뷰일 때만 "목록으로" 표시)
      │    └─ <!-- JS: sessionStorage DIAGNOSIS_STORAGE_KEY로 진단 상태 저장/복원 -->
      │
      ├─ /app/dashboard (마이 대시보드, 학습자)
      │    ├─ [데이터] data/consumer/dashboard.json
      │    │    ├─ kappLabels[], scores{}, insights[], marketPosition{}, marketBenchmark{}, industryBenchmark{}, marketActions[], recommendedActions[], roadmap{}
      │    │    └─ [샘플] insights[0] (dashboard.json 24-28라인)
      │    │         "id": "1",
      │    │         "title": "전반적 성과",
      │    │         "desc": "동일 직급 평균과 비교했을 때 전반적으로 우수한 역량 프로필을 보이고 있습니다. 특히 지식·성과·생산성 영역에서 평균을 상회하며…",
      │    │         "type": "positive"
      │    ├─ [데이터] data/consumer/careerPathByIndustry.json
      │    │    ├─ industries[], data{ 산업: paths[], learningPath[] }
      │    │    └─ [샘플] data["IT"].paths[0] (careerPathByIndustry.json 6-10라인)
      │    │         "current": { "role": "주니어 개발자", "skills": ["JavaScript", "React", "Git"] },
      │    │         "milestone1": { "year": "1.5년 후", "role": "시니어 개발자", "skills": ["TypeScript", "Node.js", "시스템 설계"], "probability": 82 },
      │    │         "milestone2": { "year": "3년 후", "role": "테크 리드 / 솔루션 아키텍트", "skills": ["마이크로서비스", "클라우드 인프라", "팀 리더십"], "probability": 68 }
      │    ├─ [탭] 내 역량 | 시장·경쟁력 | 성장 로드맵 ← tab 상태
      │    ├─ tab=내 역량
      │    │    ├─ [데이터] dashboard.json → insights, scores, kappLabels
      │    │    ├─ [섹션] AI 분석 인사이트 (카드 그리드)
      │    │    └─ [섹션] KAPP 4차원 역량 점수 (레이더 차트 + 점수 테이블)
      │    ├─ tab=시장·경쟁력
      │    │    ├─ [데이터] dashboard.json → marketPosition, industryBenchmark, marketActions, scores, marketBenchmark
      │    │    ├─ [섹션] 시장 포지션 분석
      │    │    └─ [섹션] 시장 벤치마킹 (BarChart + 점수 테이블)
      │    ├─ tab=성장 로드맵
      │    │    ├─ [데이터] careerPathByIndustry paths·learningPath | dashboard roadmap
      │    │    ├─ [섹션] 커리어 경로 시뮬레이터
      │    │    │    ├─ [select] 산업군, 경로 (careerIndustry, careerPathIndex)
      │    │    │    ├─ [영역] 현재·마일스톤1·마일스톤2 역할/스킬
      │    │    │    ├─ [목록] 추천 학습 경로
      │    │    │    └─ [버튼] 추천 강의 둘러보기 → 모달
      │    │    ├─ [섹션] AI 생성 개인 개발 계획 (IDP)
      │    │    └─ [모달] 추천 강의 둘러보기: 취소 | 강의 둘러보기 → /app/education
      │
      ├─ /app/education (교육 큐레이션)
      │    └─ 제목 + "진단 결과 기반 맞춤형 교육 추천 (추후 구현 예정)" 문구만
      │
      └─ /app/growth (나의 성장)
           ├─ [데이터] data/consumer/growth.json
           │    ├─ dailyTip{}, defaultStats{}, certificate{}, careerGoals[]
           │    └─ [샘플] dailyTip (growth.json 3-7라인)
           │         "category": "생산성",
           │         "duration": "1분",
           │         "title": "오늘 할 일을 3개만 적고, 하나씩 완료해 보세요",
           │         "content": "할 일 목록이 길수록 부담만 커집니다. 아침에 '오늘 꼭 할 3가지'만 정해 두고, 하나 완료할 때마다 체크하면 동기 부여에 도움이 됩니다."
           ├─ [탭] 성장 활동 | 인증서 ← activeTab
           ├─ tab=성장 활동
           │    ├─ [데이터] growth.json → dailyTip, defaultStats, careerGoals
           │    ├─ [섹션] 오늘의 1% 효율 챌린지
           │    │    ├─ [버튼] 적용 완료, 나중에 보기
           │    │    └─ [통계] 연속 학습 N일, 완료한 팁 N개, 이번 주 목표
           │    └─ [섹션] AI 커리어 멘토링
           │         └─ [버튼] 커리어 목표 선택 (careerGoals) → (추후 대화 시작)
           └─ tab=인증서
                ├─ [데이터] growth.json → certificate
                ├─ [영역] 인증서 미리보기 카드 (certificate)
                ├─ [버튼] PDF 다운로드
                └─ [버튼] 링크 복사
```

**트리 2: 관리자 LMS (/dashboard)**

```
/dashboard (관리자 LMS 레이아웃: Sidebar + 본문 + RightPanel)
 │
 ├─ [데이터] 요약 (전체 경로 + 샘플)
 │    ├─ 개요: data/dashboard/strategyMapper.json
 │    │    [샘플] results ↓
 │    │      "recommendedPeople": ["데이터 리드", "AI 엔지니어", "체인지 매니저"],
 │    │      "recommendedTraining": ["AI 기초", "프로세스 자동화", "크로스팀 리더십"],
 │    │      "executionRoadmap": ["1개월: 전략 정렬 및 핵심 역량 정의", "2~3개월: 집중 교육 및 파일럿 프로젝트", "4개월: 성과 평가 및 확산"]
 │    ├─ 역량 분석(공통): data/competency/competencyRawData.ts
 │    │    [샘플] competencyRawData[0] ↓
 │    │      "department": "개발팀",
 │    │      "date": "2025-01-01",
 │    │      "competency": "지식",
 │    │      "score": 85,
 │    │      "employeeName": "김민준",
 │    │      "positionLevel": "대리"
 │    ├─ 역량 분석(전략): data/competency/highPerformerData.ts
 │    │    [샘플] highPerformerData.all ↓
 │    │      "count": 18,
 │    │      "avgScore": 92,
 │    │      "kappProfile": { "knowledge": 94, "application": 91, "performance": 93, "productivity": 90 },
 │    │      "commonTraits": ["빠른 학습", "문제 해결", "주도성", "협업"]
 │    ├─ 역량 분석(벤치마크): data/benchmark/organizationData.json, industryBenchmarks.json
 │    │    [샘플] organizationData.departments.dev ↓
 │    │      "name": "개발팀",
 │    │      "members": 45,
 │    │      "skills": { "파이썬": 72, "자바스크립트": 78, "인공지능/머신러닝": 38, "클라우드": 52, … }
 │    │    [샘플] industryBenchmarks.it ↓
 │    │      "name": "IT/소프트웨어",
 │    │      "skills": { "파이썬": 85, "자바스크립트": 88, "인공지능/머신러닝": 82, … }
 │    ├─ 역량 분석(리스크): data/competency/originSkillRiskData.ts
 │    │    [샘플] skillRiskData[0] ↓
 │    │      "id": 1,
 │    │      "department": "마케팅팀",
 │    │      "skill": "데이터 시각화",
 │    │      "riskLevel": "critical",
 │    │      "expertCount": 1,
 │    │      "requiredCount": 3,
 │    │      "impactDescription": "현재 전문가가 1명뿐이며…",
 │    │      "recommendation": "Power BI/Tableau 교육 과정 즉시 배정 (최소 2명)"
 │    ├─ 직원 관리: data/employees/employeesData.ts → employeesData.json
 │    │    [샘플] rows[0] ↓
 │    │      "id": "emp-001",
 │    │      "name": "김민준",
 │    │      "email": "kim.mj@company.com",
 │    │      "industry": "IT",
 │    │      "job": "개발자(Backend)",
 │    │      "positionLevel": "대리",
 │    │      "experienceYears": "5-7년",
 │    │      "companySize": "중소기업",
 │    │      "goals": ["스킬업", "승진"]
 │    └─ RightPanel: 상수 AI_INSIGHTS (components/layout/RightPanel.tsx)
 │         [샘플] AI_INSIGHTS[0] ↓
 │           "title": "스킬 갭 감지",
 │           "desc": "개발팀에서 React 스킬이 부족합니다",
 │           "variant": "yellow",
 │           "label": "경고"
 │
 ├─ [사이드바] Sidebar
 │    ├─ [로고] 클릭 → /dashboard
 │    ├─ [버튼] 접기/펼치기 (isCollapsed) ← 폭 w-16 / w-56
 │    ├─ [드롭다운] 대시보드 (dashboardOpen)
 │    │    ├─ [하위] 개요 → /dashboard
 │    │    └─ [하위] 역량 분석 → /dashboard/competency
 │    ├─ [메뉴] 직원 관리 → /dashboard/employees
 │    ├─ [메뉴] 분석/리포트 → /dashboard/analytics
 │    ├─ [메뉴] 교육 프로그램 → /dashboard/programs
 │    └─ [메뉴] 설정 → /dashboard/settings
 │
 ├─ /dashboard (개요)
 │    ├─ [데이터] data/dashboard/strategyMapper.json
 │    │    ├─ inputPlaceholder, results{ recommendedPeople[], recommendedTraining[], executionRoadmap[] }
 │    │    └─ [샘플] results (strategyMapper.json)
 │    │         "recommendedPeople": ["데이터 리드", "AI 엔지니어", "체인지 매니저"],
 │    │         "recommendedTraining": ["AI 기초", "프로세스 자동화", "크로스팀 리더십"],
 │    │         "executionRoadmap": ["1개월: 전략 정렬 및 핵심 역량 정의", "2~3개월: 집중 교육 및 파일럿 프로젝트", "4개월: 성과 평가 및 확산"]
 │    ├─ [데이터] (상수) MOCK_CANDIDATES, MOCK_TRAINING, ROADMAP_PHASES
 │    └─ (대시보드 개요 페이지 콘텐츠: 전략 매퍼, 추천 인력 후보, 필수/권장 교육, 실행 로드맵)
 │
 ├─ /dashboard/competency (역량 분석)
 │    ├─ [데이터] data/competency/competencyRawData.ts (공통)
 │    │    ├─ competencyRawData: CompetencyRecord[] (department, date, competency, score, employeeName, positionLevel)
 │    │    ├─ competencyTypes: ["지식", "적용", "성과", "생산성"]
 │    │    └─ [샘플] competencyRawData[0]
 │    │         "department": "개발팀",
 │    │         "date": "2025-01-01",
 │    │         "competency": "지식",
 │    │         "score": 85,
 │    │         "employeeName": "김민준",
 │    │         "positionLevel": "대리"
 │    ├─ [헤더] 제목 "역량 분석", 부제 "부서·기간·역량 기준 통합 분석"
 │    ├─ [탭 버튼] 현황 & 비교 | 전략 & 성과 | 리스크 관리 ← activeTab (overview | strategy | risk)
 │    ├─ tab=현황 & 비교 (overview)
 │    │    ├─ [데이터] useCompetencyFilter() → competencyRawData → filteredData, barData, trendData
 │    │    ├─ [FilterBar] 부서 필터, 기간 등
 │    │    ├─ [SummaryKpiRow] KPI 요약
 │    │    ├─ [DepartmentCompetency] 부서별 역량 (차트/테이블)
 │    │    ├─ [TrendLineChart] 추이 차트
 │    │    └─ [RawDataButton] → RawDataPanel
 │    ├─ tab=전략 & 성과 (strategy)
 │    │    ├─ [데이터] data/competency/highPerformerData.ts (고성과자)
 │    │    │    ├─ highPerformerData{ 팀키: count, avgScore, kappProfile, commonTraits[] }
 │    │    │    ├─ teamAverageData{ 팀키: avgScore, kappProfile }
 │    │    │    ├─ teamSelectOptions, kappLabels
 │    │    │    ├─ rawRecords: competencyRawData 기반
 │    │    │    ├─ [샘플] highPerformerData.all
 │    │    │    │      "count": 18,
 │    │    │    │      "avgScore": 92,
 │    │    │    │      "kappProfile": { "knowledge": 94, "application": 91, "performance": 93, "productivity": 90 },
 │    │    │    │      "commonTraits": ["빠른 학습", "문제 해결", "주도성", "협업"]
 │    │    │    └─ [샘플] teamAverageData.all
 │    │    │          "avgScore": 76,
 │    │    │          "kappProfile": { "knowledge": 75, "application": 74, "performance": 78, "productivity": 77 }
 │    │    ├─ [데이터] ROI: 파일 없음 (로컬 state: employees, costPerPerson, skillImprovement + 상수)
 │    │    ├─ [데이터] data/benchmark/loadBenchmarkData.ts → organizationData.json, industryBenchmarks.json
 │    │    │    ├─ organizationData.departments: { 부서키: name, members, skills{ 스킬명: 점수 } }
 │    │    │    ├─ industryBenchmarks: { 산업키: name, skills{} }
 │    │    │    ├─ [샘플] organizationData.departments.dev
 │    │    │    │      "name": "개발팀",
 │    │    │    │      "members": 45,
 │    │    │    │      "skills": { "파이썬": 72, "자바스크립트": 78, "인공지능/머신러닝": 38, "클라우드": 52, … }
 │    │    │    └─ [샘플] industryBenchmarks.it
 │    │    │          "name": "IT/소프트웨어",
 │    │    │          "skills": { "파이썬": 85, "자바스크립트": 88, "인공지능/머신러닝": 82, … }
 │    │    ├─ [HighPerformerSection] 고성과자
 │    │    ├─ [ROICalculatorSection] ROI 계산
 │    │    └─ [BenchmarkSection] 벤치마크
 │    ├─ tab=리스크 관리 (risk)
 │    │    ├─ [데이터] data/competency/originHeatmapData.ts
 │    │    │    ├─ organizationData.departments: name, members, skills{}
 │    │    │    ├─ HEATMAP_SCORE_RANGES_10, getSkillsByScoreRange10
 │    │    │    └─ [샘플] organizationData.departments.dev
 │    │    │         "name": "개발팀",
 │    │    │         "members": 45,
 │    │    │         "skills": { "Python": 72, "JavaScript": 78, "AI/ML": 38, "Cloud": 52, "DevOps": 62, … }
 │    │    ├─ [데이터] data/competency/originSkillRiskData.ts
 │    │    │    ├─ skillRiskData[]: id, department, skill, riskLevel, expertCount, requiredCount, impactDescription, recommendation, estimatedImpact, probability
 │    │    │    └─ [샘플] skillRiskData[0]
 │    │    │         "id": 1,
 │    │    │         "department": "마케팅팀",
 │    │    │         "skill": "데이터 시각화",
 │    │    │         "riskLevel": "critical",
 │    │    │         "expertCount": 1,
 │    │    │         "requiredCount": 3,
 │    │    │         "impactDescription": "현재 전문가가 1명뿐이며, 이 역량이 결핍될 경우 전체 프로젝트 생산성이 30% 하락할 위험",
 │    │    │         "recommendation": "Power BI/Tableau 교육 과정 즉시 배정 (최소 2명)",
 │    │    │         "estimatedImpact": 30,
 │    │    │         "probability": "high"
 │    │    └─ [RiskManagementSection]
 │
 ├─ /dashboard/employees (직원 관리)
 │    ├─ [데이터] data/employees/employeesData.ts → employeesData.json
 │    │    ├─ tableMeta.columns[], rows: EmployeeBasicInfoRow[]
 │    │    └─ [샘플] rows[0]
 │    │         "id": "emp-001",
 │    │         "name": "김민준",
 │    │         "email": "kim.mj@company.com",
 │    │         "industry": "IT",
 │    │         "job": "개발자(Backend)",
 │    │         "positionLevel": "대리",
 │    │         "experienceYears": "5-7년",
 │    │         "companyName": "(주)테크솔루션",
 │    │         "companySize": "중소기업",
 │    │         "goals": ["스킬업", "승진"]
 │    └─ (직원 관리 페이지 콘텐츠)
 │
 ├─ /dashboard/analytics (분석/리포트)
 │    └─ (분석/리포트 페이지 콘텐츠)
 │
 ├─ /dashboard/programs (교육 프로그램)
 │    └─ (교육 프로그램 페이지 콘텐츠)
 │
 ├─ /dashboard/settings (설정)
 │    └─ (설정 페이지 콘텐츠)
 │
 └─ [우측 패널] RightPanel
      ├─ [버튼] 접기/펼치기 (isPanelOpen) ← 고정 버튼 chevronLeft
      ├─ [블록] 빠른 메뉴 (Quick menu)
      ├─ [카드] 빠른 액션
      │    ├─ [버튼] 직원 추가
      │    └─ [버튼] 리포트 다운로드
      └─ [카드] AI 인사이트 (클릭 시 모달)
           ├─ [데이터] 상수 AI_INSIGHTS[] (components/layout/RightPanel.tsx): title, desc, variant, label
           ├─ [샘플] AI_INSIGHTS[0]
           │    "title": "스킬 갭 감지",
           │    "desc": "개발팀에서 React 스킬이 부족합니다",
           │    "variant": "yellow",
           │    "label": "경고"
           └─ [모달] 인사이트 상세 + 닫기
```

---

# 3. Zoom Levels Definition

| 레벨 | 이름 | 설명 | 원문 대응 |
|------|------|------|-----------|
| **L1** | Overview (Routes only) | 라우트만 표시. Root → /, /login, /admin, /app 및 /app 하위(/app, /app/diagnosis, /app/dashboard, /app/education, /app/growth), /dashboard 및 /dashboard 하위(/dashboard, /dashboard/competency, /dashboard/employees, /dashboard/analytics, /dashboard/programs, /dashboard/settings), RightPanel. | 트리의 첫 번째 depth(경로 노드)만 |
| **L2** | Route Detail (UI elements + navigation) | 각 라우트별 [버튼], [링크], [입력], [탭], [모달], [테이블] 등 UI 구성요소와 → 이동 대상(네비게이션). 단계 버튼(STEPS), 탭 이름, 드롭다운 하위 포함. | 원문 트리의 [버튼]/[링크]/[입력]/[탭] 등 전체 |
| **L3** | Data/State Detail (data files + sample snippets + localStorage/state) | 각 화면/단계별 [데이터] 경로, [샘플] 필드·라인 범위, sessionStorage/localStorage 키(DIAGNOSIS_STORAGE_KEY, CONSENTS_KEY), 상태(step, tab, isCollapsed, dashboardOpen, activeTab, jobFilter, inbasketView, modalQuestion, careerIndustry, careerPathIndex, isPanelOpen). | 원문의 [데이터], [샘플], <!-- JS: ... -->, ← 상태명 |
| **L4** | Flows (optional) | 로그인 플로우: /login → submit → localStorage 저장 → /app. 진단 플로우: step 0 → 1 → 2 → 3 → 4 → 5(목록↔시뮬레이션) → 6 → 7; sessionStorage 저장/복원. UML-like 미니 플로우로 표현. | 원문의 "→ 이동", "← 상태" 조합 |

---

# 4. Canonical Route Map (Normalized)

원문 트리 기반으로 모든 라우트를 정규화한 목록. 각 라우트별 목적/설명, UI 구성요소, 네비게이션, 상태·로직, 데이터 의존성을 기재.

---

## 4.1 / (홈, Landing)

| 항목 | 내용 (원문 기반) |
|------|------------------|
| **목적/설명** | 진입점. 솔루션 상세 페이지. |
| **UI 구성요소** | [버튼] KAPP 진단 시작하기; [버튼] 서비스 둘러보기; [링크] KAPP 진단 시작하기 (Hero); [링크] 체험하기; [링크] 무료로 진단 시작하기; [링크] 도입 문의 (1:1 상담); Footer: KAPP 진단, 대시보드 |
| **네비게이션** | KAPP 진단 시작하기(버튼·Hero) → /login; 체험하기, 무료로 진단 시작하기 → /login; 도입 문의 → /admin; Footer 대시보드 → /app |
| **상태/로직** | (없음) |
| **데이터 의존성** | 없음 |

---

## 4.2 /login (학습자 로그인/회원가입, Consumer Login)

| 항목 | 내용 (원문 기반) |
|------|------------------|
| **목적/설명** | 학습자 로그인·회원가입. |
| **UI 구성요소** | [입력] 이메일 (아이디), 비밀번호; [체크박스] 전체 동의 / 필수 개인정보 수집·이용 / 이메일 마케팅 / 전화번호 마케팅; [버튼] 내용 보기; [버튼] 로그인 \| 회원가입; [링크] 관리자 페이지로 이동 |
| **네비게이션** | 내용 보기 → 모달(필수·이메일·전화 약관 전문); submit(로그인/회원가입) → localStorage 계정 저장 후 /app; 관리자 페이지로 이동 → /admin |
| **상태/로직** | getStoredAccounts/setStoredAccounts; 동의 내역 CONSENTS_KEY 저장 |
| **데이터 의존성** | 없음(로컬 계정 저장) |

---

## 4.3 /admin (관리자 로그인, Admin Login)

| 항목 | 내용 (원문 기반) |
|------|------------------|
| **목적/설명** | 관리자 로그인. |
| **UI 구성요소** | [입력] 이메일, 비밀번호; [버튼] 로그인; [링크] 홈으로 돌아가기 |
| **네비게이션** | 로그인 submit → /dashboard; 홈으로 돌아가기 → / |
| **상태/로직** | (없음) |
| **데이터 의존성** | 없음 |

---

## 4.4 /app (학습자 LMS 레이아웃)

| 항목 | 내용 (원문 기반) |
|------|------------------|
| **목적/설명** | 학습자 LMS: ConsumerSidebar + 본문. |
| **UI 구성요소** | [사이드바] ConsumerSidebar(로고, 접기/펼치기, 메뉴 KAPP 진단·마이 대시보드·나의 성장) |
| **네비게이션** | 로고 → /app; KAPP 진단 → /app/diagnosis; 마이 대시보드 → /app/dashboard; 나의 성장 → /app/growth |
| **상태/로직** | isCollapsed 토글(chevronLeft/chevronRight) |
| **데이터 의존성** | 없음 |

---

## 4.5 /app (앱 홈)

| 항목 | 내용 (원문 기반) |
|------|------------------|
| **목적/설명** | 앱 홈. |
| **UI 구성요소** | [버튼] KAPP 진단 시작하기 |
| **네비게이션** | KAPP 진단 시작하기 → /app/diagnosis |
| **상태/로직** | (없음) |
| **데이터 의존성** | 없음 |

---

## 4.6 /app/diagnosis (KAPP 지능형 역량 진단)

| 항목 | 내용 (원문 기반) |
|------|------------------|
| **목적/설명** | KAPP 지능형 역량 진단. 부제: Knowledge·Application·Performance·Productivity. |
| **UI 구성요소** | [상단] 제목 "KAPP 지능형 역량 진단", 부제; [단계 버튼] 시작·정보·지식·적용·성과·인바스켓·AI·결과 (STEPS); step 0: [버튼] 진단 시작하기; step 1: [입력] 이름*, 이메일, 산업군*, 세부 직무*, 직급*, 연차*, 회사명, 기업 규모*; [버튼] 진단 목표 (복수 선택); step 2~4, 6: [라디오] 문항별/시나리오별 선택지; step 5: [툴팁 버튼] HelpCircle; [뷰] 목록(InbasketList) \| 시뮬레이션(InbasketSimulation); InbasketList: [필터 버튼] 직무 선택(JOB_PILLS), [테이블] 우선순위·제목·발신자·카테고리·내용·액션, [버튼] 제목 클릭/상세보기/진행하기; 상세 모달: [버튼] X 닫기, 시뮬레이션 시작, 기본 응답 작성; InbasketSimulation: [버튼] 목록으로, [영역] SimulationContent, [버튼] 완료하고 다음 단계로; [하단] 이전 \| 다음(step 5 시뮬레이션 시 "목록으로") |
| **네비게이션** | 단계 버튼 클릭 → 해당 step; 진단 시작하기 → step 1; 진행하기 → inbasketView=simulation; 시뮬레이션 시작 → 시뮬레이션 뷰 진입 후 모달 닫기; 완료하고 다음 단계로 → step 6; 인바스켓 단계 클릭 시 목록으로 복귀 |
| **상태/로직** | step 상태(0~7); toggleGoal(진단 목표); jobFilter(JOB_PILLS); inbasketView(list \| simulation); modalQuestion; sessionStorage DIAGNOSIS_STORAGE_KEY로 진단 상태 저장/복원; HelpCircle 닫기 시 sessionStorage 저장 |
| **데이터 의존성** | step 1: data/kappDiagnosis/userInfoOptions.json (industryJobData, positionLevels, experienceYears, companySizes, diagnosticGoals). step 2: data/kappDiagnosis/knowledgeQuestions.json (questions). step 3: data/kappDiagnosis/applicationQuestions.json (questions). step 4: data/kappDiagnosis/performanceQuestions.json (questions). step 5: lib/inbasketData.ts → data/kappDiagnosis/inbasket/inbasketQuestions.json (questions). step 6: data/kappDiagnosis/aiWorkflowByIndustry.json (byIndustry). 원문 [샘플] 모두 §6 참고. |

---

## 4.7 /app/dashboard (마이 대시보드, 학습자)

| 항목 | 내용 (원문 기반) |
|------|------------------|
| **목적/설명** | 마이 대시보드. 탭 3개. |
| **UI 구성요소** | [탭] 내 역량 \| 시장·경쟁력 \| 성장 로드맵. tab=내 역량: [섹션] AI 분석 인사이트(카드 그리드), [섹션] KAPP 4차원 역량 점수(레이더 차트+점수 테이블). tab=시장·경쟁력: [섹션] 시장 포지션 분석, [섹션] 시장 벤치마킹(BarChart+점수 테이블). tab=성장 로드맵: [섹션] 커리어 경로 시뮬레이터([select] 산업군·경로, [영역] 현재·마일스톤1·2 역할/스킬, [목록] 추천 학습 경로, [버튼] 추천 강의 둘러보기); [섹션] AI 생성 개인 개발 계획(IDP); [모달] 추천 강의 둘러보기: 취소 \| 강의 둘러보기 |
| **네비게이션** | 강의 둘러보기 → /app/education |
| **상태/로직** | tab 상태(내 역량 \| 시장·경쟁력 \| 성장 로드맵); careerIndustry, careerPathIndex |
| **데이터 의존성** | data/consumer/dashboard.json (kappLabels, scores, insights, marketPosition, marketBenchmark, industryBenchmark, marketActions, recommendedActions, roadmap). data/consumer/careerPathByIndustry.json (industries, data[산업].paths, learningPath). 원문 [샘플] §6 참고. |

---

## 4.8 /app/education (교육 큐레이션)

| 항목 | 내용 (원문 기반) |
|------|------------------|
| **목적/설명** | 교육 큐레이션. 제목 + "진단 결과 기반 맞춤형 교육 추천 (추후 구현 예정)" 문구만. |
| **UI 구성요소** | 제목, 문구 |
| **네비게이션** | (없음) |
| **상태/로직** | (없음) |
| **데이터 의존성** | 없음 |

---

## 4.9 /app/growth (나의 성장)

| 항목 | 내용 (원문 기반) |
|------|------------------|
| **목적/설명** | 나의 성장. 탭: 성장 활동 \| 인증서. |
| **UI 구성요소** | [탭] 성장 활동 \| 인증서. tab=성장 활동: [섹션] 오늘의 1% 효율 챌린지([버튼] 적용 완료, 나중에 보기; [통계] 연속 학습 N일, 완료한 팁 N개, 이번 주 목표); [섹션] AI 커리어 멘토링([버튼] 커리어 목표 선택). tab=인증서: [영역] 인증서 미리보기 카드, [버튼] PDF 다운로드, [버튼] 링크 복사 |
| **네비게이션** | (추후 대화 시작) |
| **상태/로직** | activeTab(성장 활동 \| 인증서); careerGoals |
| **데이터 의존성** | data/consumer/growth.json (dailyTip, defaultStats, certificate, careerGoals). 원문 [샘플] §6 참고. |

---

## 4.10 /dashboard (관리자 LMS 레이아웃·개요)

| 항목 | 내용 (원문 기반) |
|------|------------------|
| **목적/설명** | 관리자 LMS: Sidebar + 본문 + RightPanel. 개요: 전략 매퍼, 추천 인력 후보, 필수/권장 교육, 실행 로드맵. |
| **UI 구성요소** | [사이드바] Sidebar(로고, 접기/펼치기, [드롭다운] 대시보드, [메뉴] 직원 관리·분석/리포트·교육 프로그램·설정). 개요 본문: 전략 매퍼, 추천 인력, 교육, 실행 로드맵 |
| **네비게이션** | 로고 → /dashboard; 드롭다운 하위 개요 → /dashboard, 역량 분석 → /dashboard/competency; 직원 관리 → /dashboard/employees; 분석/리포트 → /dashboard/analytics; 교육 프로그램 → /dashboard/programs; 설정 → /dashboard/settings |
| **상태/로직** | isCollapsed(폭 w-16/w-56); dashboardOpen(드롭다운) |
| **데이터 의존성** | data/dashboard/strategyMapper.json (inputPlaceholder, results). 상수 MOCK_CANDIDATES, MOCK_TRAINING, ROADMAP_PHASES. 원문 [샘플] §6 참고. |

---

## 4.11 /dashboard/competency (역량 분석)

| 항목 | 내용 (원문 기반) |
|------|------------------|
| **목적/설명** | 역량 분석. 부제: 부서·기간·역량 기준 통합 분석. 탭: 현황 & 비교 \| 전략 & 성과 \| 리스크 관리. |
| **UI 구성요소** | [헤더] 제목 "역량 분석", 부제; [탭 버튼] 현황 & 비교 \| 전략 & 성과 \| 리스크 관리. tab=overview: [FilterBar], [SummaryKpiRow], [DepartmentCompetency], [TrendLineChart], [RawDataButton] → RawDataPanel. tab=strategy: [HighPerformerSection], [ROICalculatorSection], [BenchmarkSection]. tab=risk: [RiskManagementSection] |
| **네비게이션** | RawDataButton → RawDataPanel |
| **상태/로직** | activeTab(overview \| strategy \| risk); useCompetencyFilter() → filteredData, barData, trendData |
| **데이터 의존성** | 공통: data/competency/competencyRawData.ts (competencyRawData, competencyTypes). 전략: data/competency/highPerformerData.ts (highPerformerData, teamAverageData, teamSelectOptions, kappLabels); ROI: 로컬 state; data/benchmark/loadBenchmarkData.ts → organizationData.json, industryBenchmarks.json. 리스크: data/competency/originHeatmapData.ts, data/competency/originSkillRiskData.ts. 원문 [샘플] §6 참고. |

---

## 4.12 /dashboard/employees (직원 관리)

| 항목 | 내용 (원문 기반) |
|------|------------------|
| **목적/설명** | 직원 관리 페이지. |
| **UI 구성요소** | (직원 관리 페이지 콘텐츠) |
| **네비게이션** | (없음) |
| **상태/로직** | (없음) |
| **데이터 의존성** | data/employees/employeesData.ts → employeesData.json (tableMeta.columns, rows). 원문 [샘플] §6 참고. |

---

## 4.13 /dashboard/analytics, /dashboard/programs, /dashboard/settings

| 항목 | 내용 (원문 기반) |
|------|------------------|
| **목적/설명** | 분석/리포트, 교육 프로그램, 설정. 각각 페이지 콘텐츠만 표시. |
| **UI 구성요소** | (분석/리포트 페이지 콘텐츠), (교육 프로그램 페이지 콘텐츠), (설정 페이지 콘텐츠) |
| **네비게이션** | (없음) |
| **상태/로직** | (없음) |
| **데이터 의존성** | 없음 |

---

## 4.14 RightPanel (우측 패널)

| 항목 | 내용 (원문 기반) |
|------|------------------|
| **목적/설명** | 관리자 LMS 우측 패널. 빠른 메뉴, 빠른 액션, AI 인사이트. |
| **UI 구성요소** | [버튼] 접기/펼치기(chevronLeft); [블록] 빠른 메뉴; [카드] 빠른 액션([버튼] 직원 추가, [버튼] 리포트 다운로드); [카드] AI 인사이트(클릭 시 모달); [모달] 인사이트 상세 + 닫기 |
| **네비게이션** | (버튼 액션은 본문 내 처리) |
| **상태/로직** | isPanelOpen(접기/펼치기) |
| **데이터 의존성** | 상수 AI_INSIGHTS[] (components/layout/RightPanel.tsx): title, desc, variant, label. 원문 [샘플] §6 참고. |

---

# 5. Component Inventory

원문 트리에서 등장하는 컴포넌트(역할·속성·토글 상태)를 목록화. 모두 원문 노드 근거.

| 컴포넌트 | 역할/속성 | 토글/상태 (원문) |
|----------|-----------|------------------|
| **ConsumerSidebar** | 학습자 LMS 사이드바. 로고, 접기/펼치기 버튼, 메뉴(KAPP 진단, 마이 대시보드, 나의 성장). | isCollapsed 토글; chevronLeft / chevronRight |
| **Sidebar** | 관리자 LMS 사이드바. 로고, 접기/펼치기, 드롭다운 "대시보드", 메뉴(직원 관리, 분석/리포트, 교육 프로그램, 설정). | isCollapsed(폭 w-16 / w-56); dashboardOpen(드롭다운) |
| **RightPanel** | 관리자 우측 패널. 빠른 메뉴, 빠른 액션(직원 추가, 리포트 다운로드), AI 인사이트 카드(클릭 시 모달). | isPanelOpen; 고정 버튼 chevronLeft |
| **InbasketList** | step 5 목록 뷰. 직무 필터(JOB_PILLS), 테이블(우선순위·제목·발신자·카테고리·내용·액션), 제목 클릭/상세보기/진행하기. | jobFilter; 문항 수 배지 |
| **상세 모달 (modalQuestion)** | 인바스켓 문항 상세. X 닫기, 시뮬레이션 시작, 기본 응답 작성. | (모달 열림 시) |
| **InbasketSimulation** | step 5 시뮬레이션 뷰. 목록으로 버튼, SimulationContent(이메일·메신저·보고서 등), 완료하고 다음 단계로. | onBack → inbasketView=list; onComplete → step 6 |
| **FilterBar** | 역량 분석 현황 탭. 부서 필터, 기간 등. | (필터 값) |
| **SummaryKpiRow** | KPI 요약 행. | — |
| **DepartmentCompetency** | 부서별 역량 차트/테이블. | — |
| **TrendLineChart** | 추이 차트. | — |
| **RawDataButton** | Raw 데이터 패널 열기. | → RawDataPanel |
| **RawDataPanel** | Raw 데이터 표시 패널. | — |
| **HighPerformerSection** | 고성과자 섹션. | — |
| **ROICalculatorSection** | ROI 계산 섹션. | — |
| **BenchmarkSection** | 벤치마크 섹션. | — |
| **RiskManagementSection** | 리스크 관리 섹션. | — |

---

# 6. Data Source Inventory

모든 data/*.json 및 lib/*.ts → json 매핑을 목록화. 각 항목에 **요약** + **원문 그대로** 샘플(code block) 2단 구성.

---

## 6.1 data/kappDiagnosis/userInfoOptions.json

**요약:** 진단 step 1 정보 입력. industryJobData(산업별 직무), positionLevels, experienceYears, companySizes, diagnosticGoals.

**원문 샘플 (positionLevels[0], experienceYears[0], companySizes[0], diagnosticGoals[0], industryJobData 첫 항목):**

```
{ "value": "인턴", "label": "인턴" }
{ "value": "1년 미만", "label": "1년 미만 (신입)" }
{ "value": "대기업", "label": "대기업 (1000명 이상)", "icon": "🏢" }
{ "value": "승진", "label": "승진 준비" }
"IT": { "icon": "💻", "jobs": ["개발자(Backend)", "개발자(Frontend)", "데이터 엔지니어", …] }
```

---

## 6.2 data/kappDiagnosis/knowledgeQuestions.json

**요약:** step 2 지식 문항. questions[]: id, category, difficulty, industry, job, question, options[], answer, explanation. (5-13라인)

**원문 샘플 (questions[0]):**

```
"id": "mc_1",
"category": "knowledge",
"difficulty": "medium",
"industry": "금융",
"job": "카드사업부 마케터",
"question": "카드사의 주요 수익 구조(NIM)에서 가장 큰 비중을 차지하는 것은?",
"options": ["연회비 수익", "가맹점 수수료(MDR)", "카드론 이자 수익", "포인트 제휴 수수료"],
"answer": 1,
"explanation": "MDR(Merchant Discount Rate)은 카드사의 가장 큰 수익원입니다."
```

---

## 6.3 data/kappDiagnosis/applicationQuestions.json

**요약:** step 3 적용 문항. questions[]: id, industry, job, position, title, scenario, question, options[{ label, score }], answer. (4-19라인)

**원문 샘플 (questions[0]):**

```
"id": "sc_it_1",
"category": "application",
"industry": "IT",
"job": "개발자(Backend)",
"position": "대리",
"title": "프로덕션 장애 대응",
"scenario": "현재 시간: 오후 9시 30분. 프로덕션 서버에서 500 에러가 발생하고 있습니다. CPU 95%, 메모리 88%…",
"question": "이 상황에서 어떤 순서로 대응하시겠습니까?",
"options": [{ "label": "즉시 서버 재시작 → 로그 확인 → 원인 분석", "score": 40 }, { "label": "DB 커넥션 강제 종료 → Slow Query 최적화", "score": 95 }, …],
"answer": 1
```

---

## 6.4 data/kappDiagnosis/performanceQuestions.json

**요약:** step 4 성과 문항. questions[]: id, category, industry, job, title, question, options[{ label, score }], answer. (4-17라인)

**원문 샘플 (questions[0]):**

```
"id": "perf_fin_1",
"category": "performance",
"industry": "금융",
"job": "카드사업부 마케터",
"title": "카드 마케팅 성과 지표",
"question": "카드사 마케팅에서 'CAC(고객 획득 비용)'를 낮추면서 발급 건수를 늘리기 위한 방법으로 가장 효과적인 것은?",
"options": [{ "label": "광고 단가만 낮추기", "score": 40 }, { "label": "타겟 세그먼트 정교화 + 바이럴/제휴 활용", "score": 92 }, …],
"answer": 1
```

---

## 6.5 lib/inbasketData.ts → data/kappDiagnosis/inbasket/inbasketQuestions.json

**요약:** step 5 인바스켓. questions[]: id, title, category, jobCategory, sender, date, priority, content, attachments[]. (4라인)

**원문 샘플 (questions[0]):**

```
"id": "inbasket_email_1",
"title": "[긴급] 프로덕션 서버 CPU 사용률 95% 초과",
"category": "이메일 관리",
"jobCategory": "커뮤니케이션",
"sender": "이CTO (최고기술책임자)",
"date": "5분 전",
"priority": "긴급",
"content": "프로덕션 서버 3대 중 2대의 CPU 사용률이 95%를 초과했습니다. 서버 A: CPU 97%, 서버 B: CPU 96%…",
"attachments": []
```

---

## 6.6 data/kappDiagnosis/aiWorkflowByIndustry.json

**요약:** step 6 AI 워크플로우. byIndustry{ 산업명: id, industry, title, task, options[], answer, explanation }. (4-17라인)

**원문 샘플 (byIndustry["IT"]):**

```
"id": "it_ai_workflow",
"industry": "IT",
"title": "AI 워크플로우: 코드 리뷰 자동화",
"task": "당신은 Backend 개발팀의 리드 개발자입니다. 팀원 5명이 매일 평균 3개의 Pull Request를 올리며…",
"options": [{ "id": "it_ai_a", "choice": "A. GitHub Copilot 단독 사용", "timeReduction": "20%", "qualityScore": 70 }, …],
"answer": 1,
"explanation": "SonarQube + AI 봇 조합은 반복적 검토를 자동화하고, 사람은 고차원적 판단에 집중하게 하여 시간 60% 절감과 품질 향상을 동시에 달성합니다."
```

---

## 6.7 data/consumer/dashboard.json

**요약:** 마이 대시보드. kappLabels[], scores{}, insights[], marketPosition{}, marketBenchmark{}, industryBenchmark{}, marketActions[], recommendedActions[], roadmap{}. (24-28라인 insights[0])

**원문 샘플 (insights[0]):**

```
"id": "1",
"title": "전반적 성과",
"desc": "동일 직급 평균과 비교했을 때 전반적으로 우수한 역량 프로필을 보이고 있습니다. 특히 지식·성과·생산성 영역에서 평균을 상회하며…",
"type": "positive"
```

---

## 6.8 data/consumer/careerPathByIndustry.json

**요약:** industries[], data{ 산업: paths[], learningPath[] }. paths[0]: current, milestone1, milestone2. (6-10라인)

**원문 샘플 (data["IT"].paths[0]):**

```
"current": { "role": "주니어 개발자", "skills": ["JavaScript", "React", "Git"] },
"milestone1": { "year": "1.5년 후", "role": "시니어 개발자", "skills": ["TypeScript", "Node.js", "시스템 설계"], "probability": 82 },
"milestone2": { "year": "3년 후", "role": "테크 리드 / 솔루션 아키텍트", "skills": ["마이크로서비스", "클라우드 인프라", "팀 리더십"], "probability": 68 }
```

---

## 6.9 data/consumer/growth.json

**요약:** dailyTip{}, defaultStats{}, certificate{}, careerGoals[]. (3-7라인 dailyTip)

**원문 샘플 (dailyTip):**

```
"category": "생산성",
"duration": "1분",
"title": "오늘 할 일을 3개만 적고, 하나씩 완료해 보세요",
"content": "할 일 목록이 길수록 부담만 커집니다. 아침에 '오늘 꼭 할 3가지'만 정해 두고, 하나 완료할 때마다 체크하면 동기 부여에 도움이 됩니다."
```

---

## 6.10 data/dashboard/strategyMapper.json

**요약:** inputPlaceholder, results{ recommendedPeople[], recommendedTraining[], executionRoadmap[] }.

**원문 샘플 (results):**

```
"recommendedPeople": ["데이터 리드", "AI 엔지니어", "체인지 매니저"],
"recommendedTraining": ["AI 기초", "프로세스 자동화", "크로스팀 리더십"],
"executionRoadmap": ["1개월: 전략 정렬 및 핵심 역량 정의", "2~3개월: 집중 교육 및 파일럿 프로젝트", "4개월: 성과 평가 및 확산"]
```

---

## 6.11 data/competency/competencyRawData.ts

**요약:** competencyRawData: CompetencyRecord[] (department, date, competency, score, employeeName, positionLevel), competencyTypes.

**원문 샘플 (competencyRawData[0]):**

```
"department": "개발팀",
"date": "2025-01-01",
"competency": "지식",
"score": 85,
"employeeName": "김민준",
"positionLevel": "대리"
```

---

## 6.12 data/competency/highPerformerData.ts

**요약:** highPerformerData{ 팀키: count, avgScore, kappProfile, commonTraits[] }, teamAverageData{ 팀키: avgScore, kappProfile }, teamSelectOptions, kappLabels.

**원문 샘플 (highPerformerData.all):**

```
"count": 18,
"avgScore": 92,
"kappProfile": { "knowledge": 94, "application": 91, "performance": 93, "productivity": 90 },
"commonTraits": ["빠른 학습", "문제 해결", "주도성", "협업"]
```

**원문 샘플 (teamAverageData.all):**

```
"avgScore": 76,
"kappProfile": { "knowledge": 75, "application": 74, "performance": 78, "productivity": 77 }
```

---

## 6.13 data/benchmark/loadBenchmarkData.ts → organizationData.json, industryBenchmarks.json

**요약:** organizationData.departments: { 부서키: name, members, skills{} }; industryBenchmarks: { 산업키: name, skills{} }.

**원문 샘플 (organizationData.departments.dev):**

```
"name": "개발팀",
"members": 45,
"skills": { "파이썬": 72, "자바스크립트": 78, "인공지능/머신러닝": 38, "클라우드": 52, … }
```

**원문 샘플 (industryBenchmarks.it):**

```
"name": "IT/소프트웨어",
"skills": { "파이썬": 85, "자바스크립트": 88, "인공지능/머신러닝": 82, … }
```

---

## 6.14 data/competency/originHeatmapData.ts

**요약:** organizationData.departments: name, members, skills{}; HEATMAP_SCORE_RANGES_10, getSkillsByScoreRange10.

**원문 샘플 (organizationData.departments.dev):**

```
"name": "개발팀",
"members": 45,
"skills": { "Python": 72, "JavaScript": 78, "AI/ML": 38, "Cloud": 52, "DevOps": 62, … }
```

---

## 6.15 data/competency/originSkillRiskData.ts

**요약:** skillRiskData[]: id, department, skill, riskLevel, expertCount, requiredCount, impactDescription, recommendation, estimatedImpact, probability.

**원문 샘플 (skillRiskData[0]):**

```
"id": 1,
"department": "마케팅팀",
"skill": "데이터 시각화",
"riskLevel": "critical",
"expertCount": 1,
"requiredCount": 3,
"impactDescription": "현재 전문가가 1명뿐이며, 이 역량이 결핍될 경우 전체 프로젝트 생산성이 30% 하락할 위험",
"recommendation": "Power BI/Tableau 교육 과정 즉시 배정 (최소 2명)",
"estimatedImpact": 30,
"probability": "high"
```

---

## 6.16 data/employees/employeesData.ts → employeesData.json

**요약:** tableMeta.columns[], rows: EmployeeBasicInfoRow[] (id, name, email, industry, job, positionLevel, experienceYears, companyName, companySize, goals).

**원문 샘플 (rows[0]):**

```
"id": "emp-001",
"name": "김민준",
"email": "kim.mj@company.com",
"industry": "IT",
"job": "개발자(Backend)",
"positionLevel": "대리",
"experienceYears": "5-7년",
"companyName": "(주)테크솔루션",
"companySize": "중소기업",
"goals": ["스킬업", "승진"]
```

---

## 6.17 AI_INSIGHTS (components/layout/RightPanel.tsx, 상수)

**요약:** title, desc, variant, label. 스킬 갭 감지, 교육 추천, 신규 인사이트 등.

**원문 샘플 (AI_INSIGHTS[0]):**

```
"title": "스킬 갭 감지",
"desc": "개발팀에서 React 스킬이 부족합니다",
"variant": "yellow",
"label": "경고"
```

---

# 7. Diagram Generation Rules (for HTML)

이후 "혼합형 + 줌(레벨 전환) 아키텍처" HTML 모식도를 생성할 때 적용할 규칙.

---

## 7.1 혼합형 구조 규칙

- **사이트맵:** §4 Canonical Route Map의 모든 라우트를 노드로 표시. Root → /, /login, /admin, /app, /app/diagnosis, /app/dashboard, /app/education, /app/growth; /dashboard, /dashboard/competency, /dashboard/employees, /dashboard/analytics, /dashboard/programs, /dashboard/settings; RightPanel.
- **컴포넌트:** §5 Component Inventory의 각 컴포넌트를 해당 라우트/영역에 매핑하여 표시(ConsumerSidebar, Sidebar, RightPanel, InbasketList, InbasketSimulation, FilterBar, SummaryKpiRow, DepartmentCompetency, TrendLineChart, RawDataButton, RawDataPanel, HighPerformerSection, ROICalculatorSection, BenchmarkSection, RiskManagementSection 등).
- **데이터:** §6 Data Source Inventory의 각 파일·경로를 해당 라우트/단계에 [데이터] 노드로 표시. 샘플은 요약 + 원문(code block 또는 인용)으로 2단 구성 유지.
- **플로우:** L4 선택 시 로그인 플로우(/login → submit → localStorage → /app), 진단 플로우(step 0→1→…→7, step 5 목록↔시뮬레이션, sessionStorage)를 UML-like 미니 플로우로 표시.

---

## 7.2 줌 레벨 전환 규칙

- **탭/토글:** HTML에서 L1 ↔ L2 ↔ L3 ↔ L4 전환은 탭 또는 토글 버튼으로 구현. 한 번에 하나의 줌 레벨만 노출하거나, 레벨별 패널을 나란히 표시할 수 있음.
- **L1:** 라우트 노드만. 클릭 시 해당 라우트로 이동 또는 L2 확장.
- **L2:** 라우트 + UI 요소(버튼/링크/입력/탭/모달) + 네비게이션 화살표. 단계 버튼(STEPS), 탭 이름(내 역량·시장·경쟁력·성장 로드맵, 현황 & 비교·전략 & 성과·리스크 관리) 모두 표시.
- **L3:** L2 + [데이터] 경로, [샘플] 필드/라인 범위, localStorage/sessionStorage 키(CONSENTS_KEY, DIAGNOSIS_STORAGE_KEY), 상태명(step, tab, isCollapsed, dashboardOpen, activeTab, jobFilter, inbasketView, modalQuestion, careerIndustry, careerPathIndex, isPanelOpen).
- **L4:** (선택) 로그인·진단 단계별 플로우 다이어그램.

---

## 7.3 누락 방지 규칙

- **원문 섹션 유지:** §2 Source Input에 있는 두 트리의 모든 노드(주석, 샘플, 경로, 라인 범위, 키워드)가 문서 또는 HTML 생성 시 누락되지 않도록 체크리스트로 관리.
- **모든 노드/링크/샘플 표시:** 트리 내 "[버튼]", "[링크]", "[입력]", "[데이터]", "[샘플]", "→", "←", "<!-- JS: ... -->" 등은 §4·§5·§6에 반영되어 있으며, HTML 모식도 생성 시 해당 항목을 모두 노드 또는 엣지로 표시.
- **라인/필드 참조:** 원문에 명시된 라인 범위(5-13라인, 4-19라인, 4-17라인, 4라인, 24-28라인, 6-10라인, 3-7라인 등)는 §6 Data Source Inventory 및 HTML 툴팁/상세에 유지.

---

*문서 끝. 파일명: architecture_plan.md*
