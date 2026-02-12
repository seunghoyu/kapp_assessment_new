/**
 * KAPP AI Workflow Simulations - Industry-Specific
 * Version: 5.2.0
 * 
 * AI 워크플로우 시뮬레이션 (4개 산업: IT, 금융, 의료, 마케팅/광고)
 */

const aiWorkflowSimulations = [
    // 1. IT - AI 코드 리뷰 자동화
    {
        id: 'it_ai_workflow',
        category: 'productivity',
        industry: 'IT',
        title: '🤖 AI 워크플로우: 코드 리뷰 자동화',
        task: `당신은 Backend 개발팀의 리드 개발자입니다. 팀원 5명이 매일 평균 3개의 Pull Request를 올리며, 각 PR 리뷰에 평균 30분이 소요됩니다.

**현재 상황:**
- 일일 PR: 15개
- 코드 리뷰 시간: 하루 7.5시간 (15 × 30분)
- 주요 리뷰 항목: 코딩 컨벤션, 보안 취약점, 성능 이슈, 테스트 커버리지

**AI 도구 선택지:**
A. GitHub Copilot (코드 자동 완성)
B. SonarQube (정적 분석) + AI 리뷰 봇
C. ChatGPT로 수동 질의
D. AI 도구 없이 수동 리뷰 유지

**과제:** 어떤 AI 워크플로우를 설계하여 리뷰 시간을 50% 단축하고 품질을 유지하겠습니까?`,
        timeLimit: 300,
        options: [
            {
                id: 'it_ai_a',
                choice: 'A. GitHub Copilot 단독 사용',
                workflow: [
                    '1. 코드 작성 시 Copilot으로 자동 완성',
                    '2. 리뷰는 여전히 수동 진행'
                ],
                timeReduction: '20%',
                qualityScore: 70,
                automationLevel: 'low'
            },
            {
                id: 'it_ai_b',
                choice: 'B. SonarQube + AI 리뷰 봇 (통합 워크플로우) ✅',
                workflow: [
                    '1. PR 생성 시 SonarQube가 자동으로 정적 분석 실행',
                    '2. AI 봇이 코딩 컨벤션, 보안, 성능 이슈를 자동 검출',
                    '3. 사람은 비즈니스 로직과 아키텍처만 집중 리뷰',
                    '4. AI가 작성한 리뷰 요약을 검토 후 승인'
                ],
                timeReduction: '60%',
                qualityScore: 95,
                automationLevel: 'high'
            },
            {
                id: 'it_ai_c',
                choice: 'C. ChatGPT 수동 질의',
                workflow: [
                    '1. 코드를 복사해서 ChatGPT에 붙여넣기',
                    '2. 개별적으로 리뷰 질의'
                ],
                timeReduction: '10%',
                qualityScore: 60,
                automationLevel: 'very low'
            },
            {
                id: 'it_ai_d',
                choice: 'D. AI 없이 수동 유지',
                workflow: [
                    '1. 모든 코드를 사람이 직접 검토'
                ],
                timeReduction: '0%',
                qualityScore: 85,
                automationLevel: 'none'
            }
        ],
        answer: 1, // B가 정답
        metrics: {
            '업무 가속도': 'AI 도입 전후 시간 절감 비율',
            '품질 점수': '코드 품질 유지 수준',
            '자동화 레벨': 'AI 워크플로우 통합 정도'
        },
        explanation: 'SonarQube + AI 봇 조합은 반복적 검토를 자동화하고, 사람은 고차원적 판단에 집중하게 하여 시간 60% 절감과 품질 향상을 동시에 달성합니다.'
    },

    // 2. 금융 - AI 고객 세그먼트 분석
    {
        id: 'finance_ai_workflow',
        category: 'productivity',
        industry: '금융',
        title: '🤖 AI 워크플로우: 고객 세그먼트 자동 분석',
        task: `카드사 마케터인 당신은 매달 50만 고객 데이터를 분석하여 타겟 세그먼트를 선정해야 합니다.

**현재 상황:**
- 수동 분석 시간: 주 20시간
- 주요 작업: 엑셀 피벗, SQL 쿼리, 세그먼트 정의, 리포트 작성
- 결과물: 타겟 세그먼트 5개, 각 세그먼트별 마케팅 전략

**AI 도구 선택지:**
A. Excel + ChatGPT (수식 질의)
B. Python + AutoML 플랫폼 (H2O.ai)
C. Tableau + AI 인사이트
D. 수동 분석 유지

**과제:** 어떤 AI 워크플로우로 분석 시간을 70% 단축하고 정확도를 높이겠습니까?`,
        timeLimit: 300,
        options: [
            {
                id: 'finance_ai_a',
                choice: 'A. Excel + ChatGPT',
                workflow: [
                    '1. 엑셀에서 피벗 테이블 작성',
                    '2. ChatGPT에 수식 질의',
                    '3. 수동으로 세그먼트 정의'
                ],
                timeReduction: '30%',
                qualityScore: 70,
                automationLevel: 'low'
            },
            {
                id: 'finance_ai_b',
                choice: 'B. Python + AutoML 플랫폼 ✅',
                workflow: [
                    '1. 고객 데이터를 자동으로 로드 (SQL → Python)',
                    '2. AutoML이 최적 세그먼트를 자동 클러스터링',
                    '3. AI가 각 세그먼트 특성을 자동 분석',
                    '4. 마케팅 전략 초안을 AI가 작성',
                    '5. 사람은 전략 검토 및 최종 승인'
                ],
                timeReduction: '75%',
                qualityScore: 92,
                automationLevel: 'high'
            },
            {
                id: 'finance_ai_c',
                choice: 'C. Tableau + AI 인사이트',
                workflow: [
                    '1. Tableau로 시각화',
                    '2. AI 인사이트 기능으로 패턴 발견',
                    '3. 수동으로 전략 작성'
                ],
                timeReduction: '45%',
                qualityScore: 80,
                automationLevel: 'medium'
            },
            {
                id: 'finance_ai_d',
                choice: 'D. 수동 분석 유지',
                workflow: [
                    '1. Excel + SQL로 수동 분석'
                ],
                timeReduction: '0%',
                qualityScore: 75,
                automationLevel: 'none'
            }
        ],
        answer: 1, // B가 정답
        metrics: {
            '업무 가속도': '분석 시간 75% 단축',
            '정확도': '세그먼트 예측 정확도 92%',
            '자동화 레벨': '데이터 로드부터 전략 초안까지 자동화'
        },
        explanation: 'AutoML은 대규모 고객 데이터를 빠르게 클러스터링하고, 패턴을 발견하여 마케터가 전략 수립에 집중할 수 있게 합니다.'
    },

    // 3. 의료 - AI EMR 데이터 분석
    {
        id: 'med_ai_workflow',
        category: 'productivity',
        industry: '의료',
        title: '🤖 AI 워크플로우: EMR 데이터 자동 분석',
        task: `병원 IT 담당자인 당신은 매월 EMR 데이터를 분석하여 진료 패턴 리포트를 작성해야 합니다.

**현재 상황:**
- 수동 분석 시간: 주 15시간
- 주요 작업: SQL 쿼리, 데이터 정제, 통계 분석, 리포트 작성
- 결과물: 진료 패턴, 자원 활용도, 개선 제안

**AI 도구 선택지:**
A. Excel 피벗 테이블
B. AI 의료 데이터 분석 플랫폼
C. ChatGPT 데이터 해석
D. 수동 분석 유지

**과제:** 어떤 AI 워크플로우로 분석 시간을 65% 단축하고 인사이트 품질을 높이겠습니까?`,
        timeLimit: 300,
        options: [
            {
                id: 'med_ai_a',
                choice: 'A. Excel 피벗',
                workflow: [
                    '1. EMR에서 데이터 export',
                    '2. Excel 피벗 테이블로 요약'
                ],
                timeReduction: '15%',
                qualityScore: 65,
                automationLevel: 'very low'
            },
            {
                id: 'med_ai_b',
                choice: 'B. AI 의료 데이터 분석 플랫폼 ✅',
                workflow: [
                    '1. EMR과 자동 연동',
                    '2. AI가 진료 패턴을 자동 탐지',
                    '3. 이상 징후 및 개선 포인트를 AI가 제안',
                    '4. 대시보드로 실시간 시각화',
                    '5. 사람은 전략적 의사결정에 집중'
                ],
                timeReduction: '70%',
                qualityScore: 93,
                automationLevel: 'high'
            },
            {
                id: 'med_ai_c',
                choice: 'C. ChatGPT 해석',
                workflow: [
                    '1. 데이터를 ChatGPT에 입력',
                    '2. 해석 질의'
                ],
                timeReduction: '25%',
                qualityScore: 70,
                automationLevel: 'low'
            },
            {
                id: 'med_ai_d',
                choice: 'D. 수동 분석',
                workflow: [
                    '1. SQL + Excel로 수동 분석'
                ],
                timeReduction: '0%',
                qualityScore: 80,
                automationLevel: 'none'
            }
        ],
        answer: 1, // B가 정답
        metrics: {
            '업무 가속도': '분석 시간 70% 단축',
            '인사이트 품질': '패턴 탐지 정확도 93%',
            '자동화 레벨': 'EMR 연동부터 리포트까지'
        },
        explanation: 'AI 플랫폼은 의료 데이터의 복잡한 패턴을 자동으로 발견하고, 담당자는 병원 운영 개선에 집중할 수 있습니다.'
    },

    // 4. 마케팅/광고 - AI 캠페인 최적화
    {
        id: 'mkt_ai_workflow',
        category: 'productivity',
        industry: '마케팅/광고',
        title: '🤖 AI 워크플로우: 광고 캠페인 자동 최적화',
        task: `퍼포먼스 마케터인 당신은 10개 채널에서 매일 50개 광고를 운영합니다. 수동 최적화에 하루 5시간이 소요됩니다.

**현재 상황:**
- 일일 최적화 시간: 5시간
- 광고 성과: ROAS 280%, CPA 45,000원
- 주요 작업: 입찰가 조정, 타겟 변경, 소재 교체, 예산 재배분

**AI 도구 선택지:**
A. 광고 플랫폼 자동 입찰만 사용
B. AI 마케팅 자동화 플랫폼 (전체 통합)
C. ChatGPT로 소재 아이디어만
D. 수동 최적화 유지

**과제:** 어떤 AI 워크플로우로 최적화 시간을 단축하고 ROAS를 높이겠습니까?`,
        timeLimit: 300,
        options: [
            {
                id: 'mkt_ai_a',
                choice: 'A. 자동 입찰만',
                workflow: ['1. 플랫폼 자동 입찰 설정', '2. 나머지는 수동'],
                timeReduction: '40%',
                qualityScore: 75,
                automationLevel: 'medium'
            },
            {
                id: 'mkt_ai_b',
                choice: 'B. AI 마케팅 자동화 플랫폼 ✅',
                workflow: [
                    '1. AI가 실시간으로 10개 채널 성과 모니터링',
                    '2. 저성과 광고를 자동 중단',
                    '3. 고성과 광고로 예산 자동 이동',
                    '4. A/B 테스트를 자동 실행',
                    '5. 최적 타겟과 입찰가를 AI가 추천',
                    '6. 사람은 전략 방향만 설정'
                ],
                timeReduction: '85%',
                qualityScore: 95,
                automationLevel: 'high'
            },
            {
                id: 'mkt_ai_c',
                choice: 'C. ChatGPT 소재 생성',
                workflow: ['1. ChatGPT로 소재 아이디어', '2. 수동 최적화'],
                timeReduction: '15%',
                qualityScore: 70,
                automationLevel: 'low'
            },
            {
                id: 'mkt_ai_d',
                choice: 'D. 수동 최적화',
                workflow: ['1. 사람이 직접 모든 조정'],
                timeReduction: '0%',
                qualityScore: 80,
                automationLevel: 'none'
            }
        ],
        answer: 1,
        metrics: {
            '업무 가속도': '최적화 시간 85% 단축 (5시간 → 45분)',
            'ROAS 개선': '280% → 420%',
            'CPA 개선': '45,000원 → 28,000원'
        },
        explanation: 'AI 플랫폼은 수십 개 변수를 실시간으로 최적화하고, 마케터는 크리에이티브 전략과 브랜드 메시지에 집중할 수 있습니다.'
    }
];

// Export to window
if (typeof window !== 'undefined') {
    window.aiWorkflowSimulations = aiWorkflowSimulations;
    console.log('✅ AI Workflow Simulations Loaded:', aiWorkflowSimulations.length);
}
