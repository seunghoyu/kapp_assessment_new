// KAPP Assessment Data - Knowledge, Application, Performance, Productivity

// Industry and Job Database
const industryJobData = {
    'IT': {
        icon: '💻',
        jobs: ['개발자(Backend)', '개발자(Frontend)', '데이터 엔지니어', '정보보안', 'DevOps', 'UI/UX 디자이너', 'QA/테스터', '프로젝트 매니저']
    },
    '금융': {
        icon: '🏦',
        jobs: ['카드사업부 마케터', '여신심사역', '리스크 관리', 'IB 애널리스트', '자산관리(PB)', '핀테크 기획자', '준법감시', '금융상품 개발']
    },
    '교육': {
        icon: '📚',
        jobs: ['강사/교수', '교육 콘텐츠 기획자', '교육 컨설턴트', 'LMS 관리자', '커리큘럼 디자이너', '에듀테크 PM']
    },
    '의료': {
        icon: '⚕️',
        jobs: ['의사', '간호사', '의료 행정', '의료 IT', '임상시험 코디네이터', '제약 마케터', '병원 경영']
    },
    '제조': {
        icon: '🏭',
        jobs: ['생산 관리', '품질 관리', 'SCM 담당자', '공정 엔지니어', 'R&D 연구원', '구매/자재']
    },
    '유통/리테일': {
        icon: '🛒',
        jobs: ['MD', '바이어', '매장 관리자', '물류 담당자', 'E-커머스 운영', '유통 기획']
    },
    '마케팅/광고': {
        icon: '📢',
        jobs: ['디지털 마케터', '퍼포먼스 마케터', '브랜드 매니저', '콘텐츠 마케터', '광고 AE', '소셜미디어 매니저']
    },
    '호텔/관광': {
        icon: '🏨',
        jobs: ['호텔리어', '여행 상품 기획자', '관광 컨설턴트', 'F&B 매니저', '이벤트 플래너']
    },
    '법률/회계': {
        icon: '⚖️',
        jobs: ['변호사', '노무사', '세무사', '회계사', '법무팀', '재무 분석가']
    },
    '기타': {
        icon: '💼',
        jobs: ['인사/HR', '총무', '경영 기획', '영업', '고객 서비스', '일반 관리']
    }
};

// Position levels
const positionLevels = [
    { value: '인턴', label: '인턴' },
    { value: '사원', label: '사원' },
    { value: '주임', label: '주임' },
    { value: '대리', label: '대리' },
    { value: '과장', label: '과장' },
    { value: '차장', label: '차장' },
    { value: '부장', label: '부장' },
    { value: '임원', label: '임원' }
];

// Years of experience
const experienceYears = [
    { value: '1년 미만', label: '1년 미만 (신입)' },
    { value: '1-2년', label: '1-2년차' },
    { value: '3-4년', label: '3-4년차' },
    { value: '5-7년', label: '5-7년차' },
    { value: '8-10년', label: '8-10년차' },
    { value: '11-15년', label: '11-15년차' },
    { value: '16년 이상', label: '16년 이상' }
];

// Company size
const companySizes = [
    { value: '대기업', label: '대기업 (1000명 이상)', icon: '🏢' },
    { value: '중견기업', label: '중견기업 (300-999명)', icon: '🏬' },
    { value: '중소기업', label: '중소기업 (50-299명)', icon: '🏪' },
    { value: '스타트업', label: '스타트업 (50명 미만)', icon: '🚀' }
];

// KAPP Question Bank - Adaptive Test Questions
const kappQuestionBank = {
    // Knowledge Questions (지식) - 난이도별 구분
    knowledge: {
        easy: [
            {
                id: 'k_e_1',
                category: 'knowledge',
                difficulty: 'easy',
                industry: '금융',
                job: '카드사업부 마케터',
                question: '여신전문금융업법에서 정의하는 신용카드의 기본 구성 요소가 아닌 것은?',
                options: [
                    '카드번호',
                    '유효기간',
                    '보안코드(CVV)',
                    '카드소지자 얼굴사진'
                ],
                answer: 3,
                explanation: '신용카드의 필수 구성 요소는 카드번호, 유효기간, 보안코드이며, 얼굴사진은 선택사항입니다.'
            },
            {
                id: 'k_e_2',
                category: 'knowledge',
                difficulty: 'easy',
                industry: 'IT',
                job: '개발자(Backend)',
                question: 'RESTful API의 HTTP 메서드 중 리소스를 생성할 때 사용하는 것은?',
                options: ['GET', 'POST', 'PUT', 'DELETE'],
                answer: 1,
                explanation: 'POST는 새로운 리소스를 생성할 때 사용하는 HTTP 메서드입니다.'
            }
        ],
        medium: [
            {
                id: 'k_m_1',
                category: 'knowledge',
                difficulty: 'medium',
                industry: '금융',
                job: '카드사업부 마케터',
                question: '카드사의 주요 수익 구조(NIM)에서 가장 큰 비중을 차지하는 것은?',
                options: [
                    '연회비 수익',
                    '가맹점 수수료(MDR)',
                    '카드론 이자 수익',
                    '포인트 제휴 수수료'
                ],
                answer: 1,
                explanation: 'MDR(Merchant Discount Rate)은 카드사의 가장 큰 수익원으로, 가맹점에서 결제 시 발생합니다.'
            },
            {
                id: 'k_m_2',
                category: 'knowledge',
                difficulty: 'medium',
                industry: 'IT',
                job: '개발자(Backend)',
                question: '마이크로서비스 아키텍처에서 서비스 간 통신을 위한 메시지 브로커가 아닌 것은?',
                options: ['Kafka', 'RabbitMQ', 'Redis', 'MongoDB'],
                answer: 3,
                explanation: 'MongoDB는 NoSQL 데이터베이스이며, 메시지 브로커가 아닙니다.'
            }
        ],
        hard: [
            {
                id: 'k_h_1',
                category: 'knowledge',
                difficulty: 'hard',
                industry: '금융',
                job: '카드사업부 마케터',
                question: '카드 고객의 생애가치(CLV) 산정 시 고려해야 할 핵심 변수가 아닌 것은?',
                options: [
                    '평균 거래 빈도',
                    '고객 유지율(Retention Rate)',
                    '평균 거래 금액',
                    '고객의 학력 수준'
                ],
                answer: 3,
                explanation: 'CLV 산정에는 거래 행동 패턴이 핵심이며, 학력은 직접적인 변수가 아닙니다.'
            },
            {
                id: 'k_h_2',
                category: 'knowledge',
                difficulty: 'hard',
                industry: 'IT',
                job: '개발자(Backend)',
                question: 'CAP 정리(CAP Theorem)에서 분산 시스템이 동시에 보장할 수 없는 세 가지 속성은?',
                options: [
                    'Consistency, Availability, Performance',
                    'Consistency, Availability, Partition Tolerance',
                    'Concurrency, Availability, Partition Tolerance',
                    'Consistency, Atomicity, Performance'
                ],
                answer: 1,
                explanation: 'CAP 정리는 일관성(C), 가용성(A), 분할 내성(P) 중 최대 2가지만 보장할 수 있다는 이론입니다.'
            }
        ]
    },
    
    // Application Questions (적용) - 상황 판단
    application: [
        {
            id: 'a_1',
            category: 'application',
            industry: '금융',
            job: '카드사업부 마케터',
            position: '대리',
            scenario: `카드 활성화율이 전월 대비 15% 하락했습니다. 
            
데이터를 분석한 결과:
- 신규 발급 고객의 첫 거래까지 평균 소요 기간이 14일에서 28일로 증가
- 특정 가맹점 카테고리(편의점)에서의 거래가 35% 감소
- 20대 고객층의 이탈률이 급증

당신은 3년차 대리로서 어떤 조치를 우선 취하시겠습니까?`,
            options: [
                '즉시 마케팅 예산을 2배로 증액하여 신규 고객 확보에 집중한다',
                '편의점 카테고리 프로모션을 강화하고, 20대 타겟 혜택을 재설계한다',
                '타사 카드사의 전략을 벤치마킹하여 동일한 방식을 적용한다',
                '현상 유지하며 다음 분기 데이터를 추가 관찰한다'
            ],
            answer: 1,
            evaluation: {
                correct: '데이터 기반의 타겟팅된 대응이 우수합니다. 문제의 근본 원인(편의점 거래 감소, 20대 이탈)을 정확히 파악했습니다.',
                wrong: '예외 상황에서 데이터 분석 결과를 바탕으로 구체적인 액션 플랜을 수립하는 능력이 필요합니다.'
            }
        },
        {
            id: 'a_2',
            category: 'application',
            industry: 'IT',
            job: '개발자(Backend)',
            position: '대리',
            scenario: `프로덕션 환경에서 API 응답 시간이 평균 200ms에서 3초로 급증했습니다.

모니터링 결과:
- DB 쿼리 시간: 50ms (정상)
- 외부 API 호출 시간: 2.8초 (급증)
- 서버 CPU 사용률: 30% (정상)

팀장은 회의 중이고, 고객 불만이 증가하고 있습니다. 어떻게 대응하시겠습니까?`,
            options: [
                '팀장이 돌아올 때까지 대기하며 로그를 수집한다',
                '외부 API 호출을 즉시 캐싱 처리하고, 타임아웃을 1초로 설정한다',
                '서버를 재시작하여 일시적으로 문제를 해결한다',
                '외부 API 제공사에 연락하여 문제 해결을 요청하고 대기한다'
            ],
            answer: 1,
            evaluation: {
                correct: '문제의 근본 원인을 파악하고 즉각적인 완화 조치(캐싱, 타임아웃)를 취한 것이 적절합니다.',
                wrong: '3년차 개발자는 예외 상황에서 주도적으로 문제를 완화하고 서비스 안정성을 유지해야 합니다.'
            }
        }
    ],
    
    // Performance Questions (성과) - KPI 중심
    performance: [
        {
            id: 'p_1',
            category: 'performance',
            industry: '금융',
            job: '카드사업부 마케터',
            question: `당신의 팀 목표는 분기 CAC(고객 획득 비용)를 25,000원으로 유지하면서 신규 고객 1만명 확보입니다.

현재 상황 (2개월차):
- 신규 고객: 5,500명
- 총 마케팅 비용: 1억 5천만원
- 현재 CAC: 27,272원

목표 달성을 위해 어떤 전략을 선택하시겠습니까?`,
            options: [
                '마케팅 비용을 추가 증액하여 목표 인원을 달성한다',
                '퍼포먼스 마케팅 채널로 전환하고 전환율이 낮은 캠페인을 중단한다',
                '신규 고객 목표를 8,000명으로 하향 조정한다',
                '현재 방식을 유지하며 마지막 달에 집중 공략한다'
            ],
            answer: 1,
            kpiImpact: {
                option0: { cac: 30000, customers: 10000, efficiency: 'low' },
                option1: { cac: 24500, customers: 10200, efficiency: 'high' },
                option2: { cac: 25000, customers: 8000, efficiency: 'medium' },
                option3: { cac: 28000, customers: 9000, efficiency: 'low' }
            }
        },
        {
            id: 'p_2',
            category: 'performance',
            industry: 'IT',
            job: '개발자(Backend)',
            question: `당신의 분기 목표는 API 응답 시간을 평균 200ms 이하로 유지하면서 트래픽을 50% 증가시키는 것입니다.

현재 상황:
- 평균 응답 시간: 180ms
- 일일 트래픽: 100만 requests
- 서버 비용: 월 500만원

어떤 최적화 전략을 우선 적용하시겠습니까?`,
            options: [
                '서버 스케일 업(Scale-up)으로 성능을 2배 향상시킨다',
                'Redis 캐싱 + CDN 도입으로 읽기 부하를 70% 감소시킨다',
                '데이터베이스 인덱스만 최적화하고 관찰한다',
                '트래픽 목표를 30% 증가로 하향 조정한다'
            ],
            answer: 1,
            kpiImpact: {
                option0: { responseTime: 150, traffic: 150, cost: 1000 },
                option1: { responseTime: 120, traffic: 150, cost: 600 },
                option2: { responseTime: 170, traffic: 120, cost: 500 },
                option3: { responseTime: 180, traffic: 130, cost: 500 }
            }
        }
    ],
    
    // Productivity Questions (생산성) - 업무 효율성
    productivity: [
        {
            id: 'pr_1',
            category: 'productivity',
            industry: '금융',
            job: '카드사업부 마케터',
            scenario: `당신은 다음 5가지 업무를 오늘 중 처리해야 합니다:

A. 임원 보고서 작성 (2시간 소요, 내일 오전 발표)
B. 신규 캠페인 기획안 검토 (1시간, 팀원 대기 중)
C. 월간 실적 데이터 정리 (3시간, 이번 주 금요일 마감)
D. 제휴사 미팅 준비 (30분, 오후 3시 미팅)
E. 일일 업무 보고 (20분, 오후 6시 마감)

현재 시간은 오전 10시이고, 점심시간 1시간을 포함하여 오후 6시까지 업무 가능합니다.

어떤 순서로 업무를 처리하시겠습니까?`,
            options: [
                'A → B → D → E → C',
                'D → B → A → E → C',
                'B → D → A → E → C',
                'C → A → B → D → E'
            ],
            answer: 1,
            evaluation: {
                productivity_score: [65, 92, 75, 45],
                explanation: [
                    '긴급하지만 중요도가 다른 업무의 우선순위를 고려하지 못했습니다.',
                    '우수합니다. 임박한 미팅(D), 팀원 블로킹(B), 중요도 높은 보고서(A) 순으로 처리했습니다.',
                    '팀원 대기는 해소했으나, 미팅 준비가 늦어질 수 있습니다.',
                    '마감이 여유로운 업무에 시간을 먼저 할당하여 비효율적입니다.'
                ]
            }
        }
    ]
};

// Dreyfus Model Skill Levels
const dreyfusLevels = {
    1: { name: '초보자(Novice)', description: '규칙을 엄격히 따르며, 상황 판단 없이 지침대로 수행' },
    2: { name: '고급 초보자(Advanced Beginner)', description: '제한적인 상황 인식, 유사 경험 활용' },
    3: { name: '적임자(Competent)', description: '계획 수립 가능, 의도적 우선순위 설정' },
    4: { name: '숙련자(Proficient)', description: '상황 전체를 직관적으로 파악, 패턴 인식' },
    5: { name: '전문가(Expert)', description: '무의식적 역량 발휘, 혁신적 문제 해결' }
};

// Save to global scope
window.industryJobData = industryJobData;
window.positionLevels = positionLevels;
window.experienceYears = experienceYears;
window.companySizes = companySizes;
window.kappQuestionBank = kappQuestionBank;
window.dreyfusLevels = dreyfusLevels;