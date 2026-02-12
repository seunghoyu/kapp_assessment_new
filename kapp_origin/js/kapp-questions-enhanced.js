// KAPP Enhanced Question Types - 다양한 문항 유형

// 문항 유형 정의
const questionTypes = {
    MULTIPLE_CHOICE: 'multiple_choice',      // 객관식
    SCENARIO: 'scenario',                    // 실무 시나리오
    SIMULATION: 'simulation',                // 인터랙티브 시뮬레이션
    DRAG_DROP: 'drag_drop',                  // 드래그 앤 드롭
    SLIDER: 'slider',                        // 슬라이더 평가
    RANKING: 'ranking',                      // 순위 매기기
    HOTSPOT: 'hotspot',                      // 핫스팟 클릭
    CODE_REVIEW: 'code_review',              // 코드 리뷰
    DASHBOARD_ANALYSIS: 'dashboard_analysis', // 대시보드 분석
    ROLE_PLAY: 'role_play',                  // 롤플레이
    GAMIFIED: 'gamified'                     // 게이미피케이션
};

// Enhanced KAPP Question Bank with diverse types
const enhancedKappQuestions = {
    // 1. 객관식 (기본)
    multiple_choice: [
        // 금융 - 카드사업부
        {
            id: 'mc_1',
            type: questionTypes.MULTIPLE_CHOICE,
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
            explanation: 'MDR(Merchant Discount Rate)은 카드사의 가장 큰 수익원입니다.',
            points: 10
        },
        
        // IT - 개발자 Backend
        {
            id: 'mc_it_1',
            type: questionTypes.MULTIPLE_CHOICE,
            category: 'knowledge',
            difficulty: 'medium',
            industry: 'IT',
            job: '개발자(Backend)',
            question: 'RESTful API 설계 시 리소스 생성을 나타내는 HTTP 메서드와 성공 시 반환하는 상태 코드로 가장 적절한 조합은?',
            options: [
                'POST - 200 OK',
                'POST - 201 Created',
                'PUT - 201 Created',
                'PUT - 200 OK'
            ],
            answer: 1,
            explanation: 'POST 메서드로 리소스를 생성하고, 성공 시 201 Created 상태 코드를 반환하는 것이 RESTful 표준입니다.',
            points: 10
        },
        {
            id: 'mc_it_2',
            type: questionTypes.MULTIPLE_CHOICE,
            category: 'knowledge',
            difficulty: 'hard',
            industry: 'IT',
            job: '개발자(Backend)',
            question: '대용량 트래픽 처리를 위한 데이터베이스 최적화 기법 중, 쓰기 작업은 마스터 DB에서 처리하고 읽기 작업은 복제된 슬레이브 DB에서 분산 처리하는 방식은?',
            options: [
                'Sharding',
                'Replication (Read Replica)',
                'Partitioning',
                'Clustering'
            ],
            answer: 1,
            explanation: 'Replication (Read Replica)은 마스터-슬레이브 구조로 읽기 부하를 분산시키는 기법입니다.',
            points: 15
        },
        {
            id: 'mc_it_3',
            type: questionTypes.MULTIPLE_CHOICE,
            category: 'knowledge',
            difficulty: 'easy',
            industry: 'IT',
            job: '개발자(Backend)',
            question: 'Git에서 현재 작업 중인 변경사항을 임시로 저장하고 나중에 다시 적용할 수 있는 명령어는?',
            options: [
                'git commit',
                'git stash',
                'git reset',
                'git revert'
            ],
            answer: 1,
            explanation: 'git stash는 작업 중인 변경사항을 임시 저장하여 나중에 다시 적용할 수 있습니다.',
            points: 8
        },
        
        // IT - Frontend
        {
            id: 'mc_it_4',
            type: questionTypes.MULTIPLE_CHOICE,
            category: 'knowledge',
            difficulty: 'medium',
            industry: 'IT',
            job: '개발자(Frontend)',
            question: 'React에서 컴포넌트의 상태(state)가 변경될 때 어떤 일이 발생하는가?',
            options: [
                '페이지 전체가 새로고침된다',
                '컴포넌트가 리렌더링된다',
                'DOM이 직접 수정된다',
                '아무 일도 일어나지 않는다'
            ],
            answer: 1,
            explanation: 'React는 state 변경 시 Virtual DOM을 사용하여 해당 컴포넌트를 효율적으로 리렌더링합니다.',
            points: 10
        }
    ],

    // 2. 실무 시나리오 (상황 판단)
    scenario: [
        {
            id: 'sc_1',
            type: questionTypes.SCENARIO,
            category: 'application',
            industry: 'IT',
            job: '개발자(Backend)',
            position: '대리',
            title: '🚨 프로덕션 장애 대응',
            scenario: `
<div class="scenario-time">현재 시간: 오후 9시 30분</div>

<strong>상황:</strong>
프로덕션 서버에서 갑자기 500 에러가 발생하고 있습니다.
모니터링 대시보드를 확인한 결과:

📊 <strong>서버 상태:</strong>
- CPU 사용률: 95% (정상: 40%)
- 메모리 사용률: 88% (정상: 60%)
- DB 커넥션: 195/200 (거의 포화)
- 에러율: 35% (급증)

📧 <strong>알림:</strong>
- 5분 전: "DB slow query 경고"
- 3분 전: "API response time 증가"
- 방금: "고객 문의 급증"

👥 <strong>팀 상황:</strong>
- 팀장: 휴가 중 (연락 불가)
- 시니어 개발자: 개인 사정으로 조퇴
- 당직: 당신 혼자

⏰ <strong>제약 조건:</strong>
- 서비스 중단 시 분당 500만원 손실
- 고객 컴플레인 실시간 증가 중
- 야간이라 즉시 지원 불가
            `,
            question: '이 상황에서 어떤 순서로 대응하시겠습니까?',
            options: [
                {
                    label: '즉시 서버 재시작 → 로그 확인 → 원인 분석',
                    consequence: '⚠️ 일시적으로 해결되나 근본 원인 미해결. 30분 후 재발 가능성 90%',
                    score: 40
                },
                {
                    label: 'DB 커넥션 강제 종료 → Slow Query 최적화 → 서버 스케일 아웃',
                    consequence: '✅ 근본 원인 해결. 서비스 안정화. 2시간 소요되나 재발 방지',
                    score: 95
                },
                {
                    label: '원인 파악 대기 → 팀장 연락 → 지시 대기',
                    consequence: '❌ 대응 지연으로 손실 확대. 고객 이탈 발생',
                    score: 20
                },
                {
                    label: '트래픽 일부 차단 → 핵심 기능만 우선 복구 → 순차적 원인 제거',
                    consequence: '🔶 현실적 타협안. 서비스 부분 유지하며 문제 해결',
                    score: 75
                }
            ],
            timer: 180,  // 3분 제한
            points: 25,
            realTimeData: {
                errorRate: [5, 8, 15, 25, 35],
                customerComplaints: [2, 5, 12, 28, 45]
            }
        },
        {
            id: 'sc_2',
            type: questionTypes.SCENARIO,
            category: 'performance',
            industry: '금융',
            job: '카드사업부 마케터',
            title: '💳 신규 카드 출시 위기 대응',
            scenario: `
<div class="scenario-deadline">D-7일: 신규 카드 출시일</div>

<strong>배경:</strong>
분기 핵심 프로젝트인 '밀레니얼 타겟 카드' 출시를 일주일 앞두고 있습니다.

📊 <strong>현재 상황:</strong>
- 사전 신청: 목표 5만명 → 실제 1.2만명 (24%)
- SNS 반응: 예상보다 저조 (참여율 0.8%)
- 경쟁사: 동일 타겟 카드 2일 전 출시 발표
- 마케팅 예산: 80% 이미 집행

💰 <strong>성과 지표:</strong>
- 출시 1개월 내 10만 발급 필수 (CEO 공약)
- CAC(고객 획득 비용): 3만원 이하 유지
- 현재 CAC: 4.5만원 (예산 초과)

⚡ <strong>긴급 이슈:</strong>
인플루언서 협업이 갑자기 무산되었습니다.
(계약금 500만원 손실 확정)

🎯 <strong>남은 카드:</strong>
- 긴급 예산 추가 신청 가능 (최대 3천만원)
- 제휴사 긴급 협의 가능
- 혜택 구조 일부 수정 가능 (승인 필요)
- 출시일 연기 불가 (이미 공지)
            `,
            question: '위기 상황에서 목표 달성을 위한 최선의 전략은?',
            options: [
                {
                    label: '긴급 예산 전액 투입 → 광고 물량 공세 → 단기 성과 집중',
                    consequence: '📈 1개월 발급 9만건 예상 (목표 미달). CAC 5.2만원으로 상승',
                    score: 55,
                    kpi: { 발급건수: 90000, CAC: 52000, 예산소진: 100 }
                },
                {
                    label: '혜택 구조 긴급 개선 → 바이럴 마케팅 집중 → 커뮤니티 공략',
                    consequence: '✅ 1개월 발급 12만건 예상. CAC 2.8만원으로 개선. 입소문 효과',
                    score: 95,
                    kpi: { 발급건수: 120000, CAC: 28000, 예산소진: 85 }
                },
                {
                    label: '경쟁사 전략 카피 → 동일 혜택 제공 → 차별화 포기',
                    consequence: '⚠️ 1개월 발급 7만건. 브랜드 이미지 손상. 장기적 마이너스',
                    score: 40,
                    kpi: { 발급건수: 70000, CAC: 48000, 예산소진: 100 }
                },
                {
                    label: '제휴사 긴급 협의 → Win-Win 구조 → 장기 파트너십',
                    consequence: '🎯 1개월 발급 10.5만건. CAC 3.1만원. 지속 가능한 성장',
                    score: 88,
                    kpi: { 발급건수: 105000, CAC: 31000, 예산소진: 88 }
                }
            ],
            timer: 300,  // 5분 제한
            points: 30,
            impactSimulation: true
        }
    ],

    // 3. 인터랙티브 시뮬레이션
    simulation: [
        {
            id: 'sim_1',
            type: questionTypes.SIMULATION,
            category: 'productivity',
            title: '📊 데이터 대시보드 분석 챌린지',
            description: '실시간 대시보드에서 이상 징후를 찾고 원인을 파악하세요',
            industry: 'IT',
            job: '데이터 엔지니어',
            simulationType: 'dashboard_analysis',
            timeLimit: 180,
            dashboard: {
                metrics: [
                    { name: 'DAU', value: 45000, trend: -15, status: 'warning' },
                    { name: '매출', value: 12500000, trend: -8, status: 'danger' },
                    { name: '전환율', value: 2.3, trend: -20, status: 'danger' },
                    { name: '이탈률', value: 68, trend: +25, status: 'danger' },
                    { name: 'API 응답', value: 850, trend: +180, status: 'warning' },
                    { name: '에러율', value: 4.2, trend: +300, status: 'critical' }
                ],
                logs: [
                    '11:23 - DB 커넥션 풀 90% 사용',
                    '11:45 - 특정 API 응답시간 3초 초과',
                    '12:10 - 신규 배포 완료',
                    '12:15 - 에러 급증 시작',
                    '12:30 - 고객 문의 폭증'
                ]
            },
            tasks: [
                { id: 1, task: '핵심 문제 지표 3개 선택', points: 10 },
                { id: 2, task: '근본 원인 파악', points: 15 },
                { id: 3, task: '해결 방안 제시', points: 15 },
                { id: 4, task: '예방 전략 수립', points: 10 }
            ],
            correctAnswers: {
                keyMetrics: ['에러율', '전환율', 'API 응답'],
                rootCause: '신규 배포 후 DB 쿼리 성능 저하',
                solution: 'Slow Query 최적화 및 롤백',
                prevention: '배포 전 성능 테스트 강화'
            },
            points: 50
        },
        {
            id: 'sim_2',
            type: questionTypes.SIMULATION,
            category: 'application',
            title: '🎮 고객 응대 시뮬레이터',
            description: 'VIP 고객의 불만을 해결하세요. 선택에 따라 고객 만족도가 실시간으로 변합니다.',
            industry: '호텔/관광',
            job: '호텔리어',
            simulationType: 'role_play',
            timeLimit: 240,
            initialState: {
                customerSatisfaction: 20,  // 매우 불만
                hotelReputation: 80,
                resolutionTime: 0
            },
            scenario: {
                customer: {
                    name: '김VIP',
                    tier: 'Diamond',
                    issue: '객실 소음 + 룸서비스 지연 + 체크인 문제',
                    mood: 'angry',
                    history: '연간 20회 이용, 총 2천만원 매출 기여'
                },
                context: '주말 만실 상황, 대체 객실 없음, 다른 고객 대기 중'
            },
            conversations: [
                {
                    step: 1,
                    customerLine: '"도대체 다이아몬드 회원이 무슨 의미인가요? 이렇게 대접받으려고 매년 수천만원을 쓴 게 아니에요!"',
                    options: [
                        {
                            text: '죄송합니다. 즉시 매니저를 불러드리겠습니다.',
                            effect: { satisfaction: +5, reputation: 0, time: +15 },
                            nextStep: 2
                        },
                        {
                            text: '정말 죄송합니다. 불편하신 사항을 하나씩 해결해드리겠습니다. 먼저 가장 불편하신 점이 무엇인가요?',
                            effect: { satisfaction: +15, reputation: +5, time: +5 },
                            nextStep: 3
                        },
                        {
                            text: '현재 만실이라 객실 이동은 어렵습니다만, 다른 보상을 제공해드릴 수 있습니다.',
                            effect: { satisfaction: -10, reputation: 0, time: +10 },
                            nextStep: 2
                        },
                        {
                            text: '고객님, 진정하시고 말씀해주세요. 다른 고객분들도 대기 중이십니다.',
                            effect: { satisfaction: -30, reputation: -15, time: +20 },
                            nextStep: 'fail'
                        }
                    ]
                },
                {
                    step: 2,
                    customerLine: '"매니저요? 매니저도 똑같을 거 아니에요! 당장 해결책을 제시하세요!"',
                    options: [
                        {
                            text: '스위트룸으로 무료 업그레이드 + 스파 이용권 + 조식 2회 제공해드리겠습니다.',
                            effect: { satisfaction: +30, reputation: +10, time: +10 },
                            nextStep: 'success'
                        },
                        {
                            text: '규정상 어려운 부분이 있습니다. 상부에 보고하겠습니다.',
                            effect: { satisfaction: -20, reputation: -10, time: +30 },
                            nextStep: 'fail'
                        }
                    ]
                },
                {
                    step: 3,
                    customerLine: '"소음이 가장 심각해요. 옆방에서 새벽까지 시끄러워서 한숨도 못 잤어요."',
                    options: [
                        {
                            text: '즉시 해당 객실에 조용히 해달라고 요청드리고, 고객님께는 수면 방해에 대한 보상으로 1박 무료 숙박권을 드리겠습니다.',
                            effect: { satisfaction: +40, reputation: +15, time: +15 },
                            nextStep: 'excellent'
                        },
                        {
                            text: '귀마개를 제공해드리겠습니다. 그리고 할인 쿠폰을 드리겠습니다.',
                            effect: { satisfaction: -15, reputation: -10, time: +10 },
                            nextStep: 'fail'
                        }
                    ]
                }
            ],
            scoringRules: {
                excellent: { satisfaction: 80, points: 50 },
                success: { satisfaction: 60, points: 35 },
                fail: { satisfaction: 30, points: 10 }
            },
            points: 50
        }
    ],

    // 4. 드래그 앤 드롭 (우선순위)
    drag_drop: [
        {
            id: 'dd_1',
            type: questionTypes.DRAG_DROP,
            category: 'productivity',
            title: '📋 업무 우선순위 매트릭스',
            description: '긴급도와 중요도를 고려하여 업무를 4개 사분면에 배치하세요',
            industry: '전체',
            job: '전체',
            tasks: [
                { id: 1, title: '임원 보고서 작성', urgency: 'high', importance: 'high', estimatedTime: 120 },
                { id: 2, title: '일상 이메일 답장', urgency: 'low', importance: 'low', estimatedTime: 30 },
                { id: 3, title: '프로젝트 전략 수립', urgency: 'low', importance: 'high', estimatedTime: 180 },
                { id: 4, title: '갑작스런 전화 미팅', urgency: 'high', importance: 'low', estimatedTime: 20 },
                { id: 5, title: '팀원 멘토링', urgency: 'low', importance: 'high', estimatedTime: 60 },
                { id: 6, title: '시스템 긴급 장애 대응', urgency: 'high', importance: 'high', estimatedTime: 90 },
                { id: 7, title: '부서 회식 장소 예약', urgency: 'high', importance: 'low', estimatedTime: 15 },
                { id: 8, title: '산업 트렌드 리서치', urgency: 'low', importance: 'high', estimatedTime: 240 }
            ],
            quadrants: {
                q1: { name: '긴급+중요', description: '즉시 실행', color: '#FF6B6B' },
                q2: { name: '중요', description: '계획하여 실행', color: '#4ECDC4' },
                q3: { name: '긴급', description: '위임 가능', color: '#FFE66D' },
                q4: { name: '낮음', description: '제거/최소화', color: '#95E1D3' }
            },
            correctMapping: {
                q1: [1, 6],  // 임원 보고서, 시스템 장애
                q2: [3, 5, 8],  // 전략 수립, 멘토링, 리서치
                q3: [4, 7],  // 전화 미팅, 회식 예약
                q4: [2]  // 일상 이메일
            },
            points: 40,
            timeLimit: 180
        }
    ],

    // 5. 슬라이더 평가 (자기 평가 + 현실 갭)
    slider: [
        {
            id: 'sl_1',
            type: questionTypes.SLIDER,
            category: 'knowledge',
            title: '🎚️ 스킬 자가 진단',
            description: '각 스킬에 대한 자신의 수준을 평가하세요. 이후 실제 테스트 결과와 비교합니다.',
            skills: [
                { id: 1, name: 'SQL 쿼리 작성', min: 0, max: 100, userEstimate: null, actualScore: null },
                { id: 2, name: '데이터 시각화', min: 0, max: 100, userEstimate: null, actualScore: null },
                { id: 3, name: '통계 분석', min: 0, max: 100, userEstimate: null, actualScore: null },
                { id: 4, name: 'Python 프로그래밍', min: 0, max: 100, userEstimate: null, actualScore: null },
                { id: 5, name: '비즈니스 통찰력', min: 0, max: 100, userEstimate: null, actualScore: null }
            ],
            followUpTest: true,  // 자가 평가 후 실제 테스트 진행
            gapAnalysis: true,   // Dunning-Kruger 효과 측정
            points: 20
        }
    ],

    // 6. 코드 리뷰 (IT 직군 특화)
    code_review: [
        {
            id: 'cr_1',
            type: questionTypes.CODE_REVIEW,
            category: 'knowledge',
            title: '💻 코드 리뷰 챌린지',
            description: '다음 코드의 문제점을 모두 찾으세요 (보안, 성능, 가독성)',
            industry: 'IT',
            job: '개발자(Backend)',
            code: `
// 사용자 로그인 API
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    
    // 1. DB 쿼리
    const query = "SELECT * FROM users WHERE username='" + username + "'";
    const user = await db.query(query);
    
    // 2. 비밀번호 체크
    if (user && user.password == password) {
        // 3. 세션 생성
        req.session.user = user;
        res.send({ success: true, user: user });
    } else {
        res.send({ success: false });
    }
});
            `,
            issues: [
                {
                    id: 1,
                    type: 'security',
                    issue: 'SQL Injection 취약점',
                    line: 6,
                    severity: 'critical',
                    solution: 'Prepared Statement 사용',
                    points: 15
                },
                {
                    id: 2,
                    type: 'security',
                    issue: '비밀번호 평문 비교',
                    line: 10,
                    severity: 'critical',
                    solution: 'bcrypt 등 해시 비교 사용',
                    points: 15
                },
                {
                    id: 3,
                    type: 'security',
                    issue: '민감 정보 노출',
                    line: 13,
                    severity: 'high',
                    solution: '비밀번호 등 민감 정보 제거 후 응답',
                    points: 10
                },
                {
                    id: 4,
                    type: 'performance',
                    issue: 'DB 인덱스 미사용 가능성',
                    line: 6,
                    severity: 'medium',
                    solution: 'username 컬럼에 인덱스 추가',
                    points: 5
                }
            ],
            timeLimit: 300,
            totalPoints: 45
        }
    ],

    // 7. 게이미피케이션 문항
    gamified: [
        {
            id: 'gm_1',
            type: questionTypes.GAMIFIED,
            category: 'performance',
            title: '🎯 마케팅 캠페인 시뮬레이터',
            description: '100만원 예산으로 최대 ROI를 만들어보세요!',
            gameType: 'resource_management',
            initialState: {
                budget: 1000000,
                day: 1,
                totalDays: 30,
                customers: 0,
                revenue: 0,
                cac: 0,
                roi: 0
            },
            actions: [
                {
                    name: 'SNS 광고',
                    cost: 200000,
                    expectedCustomers: 100,
                    expectedRevenue: 300000,
                    duration: 7
                },
                {
                    name: '인플루언서 협업',
                    cost: 500000,
                    expectedCustomers: 300,
                    expectedRevenue: 1200000,
                    duration: 14
                },
                {
                    name: '검색 광고',
                    cost: 150000,
                    expectedCustomers: 50,
                    expectedRevenue: 200000,
                    duration: 7
                },
                {
                    name: '바이럴 콘텐츠',
                    cost: 100000,
                    expectedCustomers: 200,
                    expectedRevenue: 800000,
                    duration: 30,
                    uncertainty: 'high'
                }
            ],
            scoringMetrics: {
                roi: 0.4,
                customerCount: 0.3,
                budgetEfficiency: 0.3
            },
            leaderboard: true,
            points: 50,
            timeLimit: 600  // 10분 전략 수립
        },
        {
            id: 'gm_2',
            type: questionTypes.GAMIFIED,
            category: 'productivity',
            title: '⚡ 스피드 의사결정 게임',
            description: '30초 안에 최선의 선택을 하세요! 연속 정답 시 콤보 보너스!',
            gameType: 'speed_decision',
            rounds: 10,
            timePerRound: 30,
            comboSystem: {
                enabled: true,
                multiplier: [1.0, 1.2, 1.5, 2.0, 3.0]  // 연속 정답 시 배수
            },
            questions: [
                {
                    situation: '고객이 환불을 요구하지만 정책상 불가능',
                    options: ['정책 설명', '부분 환불', '대체 혜택', '상급자 연결'],
                    bestChoice: 2,
                    timeBonus: true
                }
                // ... 10개 라운드
            ],
            points: 60
        }
    ],

    // 8. 핫스팟 (이미지 기반)
    hotspot: [
        {
            id: 'hs_1',
            type: questionTypes.HOTSPOT,
            category: 'application',
            title: '🖼️ UI/UX 문제 찾기',
            description: '이 화면에서 사용성 문제가 있는 곳을 모두 클릭하세요',
            industry: 'IT',
            job: 'UI/UX 디자이너',
            imageUrl: '/assets/ui-mockup.png',  // 실제 이미지 필요
            hotspots: [
                { x: 120, y: 50, radius: 30, issue: '로고가 너무 작음', points: 10 },
                { x: 300, y: 200, radius: 40, issue: 'CTA 버튼 색상 대비 부족', points: 15 },
                { x: 450, y: 350, radius: 35, issue: '텍스트 가독성 낮음', points: 10 },
                { x: 200, y: 400, radius: 50, issue: '모바일 터치 영역 부족', points: 15 }
            ],
            timeLimit: 120,
            totalPoints: 50
        }
    ],
    
    // 9. AI 롤플레잉 (대화형)
    ai_roleplay: [
        {
            id: 'rp_1',
            type: questionTypes.ROLE_PLAY,
            category: 'application',
            title: '🤖 AI 팀장과의 1:1 면담',
            description: 'AI 아바타 팀장과 대화하며 커뮤니케이션 및 문제 해결 역량을 평가받습니다',
            industry: 'IT',
            job: '개발자(Backend)',
            scenario: `
                <div class="roleplay-scenario">
                    <h4>상황 설정</h4>
                    <p>당신은 백엔드 개발자로 신규 프로젝트에 투입되었습니다. 
                    AI 팀장이 프로젝트 진행 상황과 기술 스택 선정에 대해 질문합니다.</p>
                    <div class="ai-avatar">
                        <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ccircle cx='50' cy='50' r='40' fill='%234A5568'/%3E%3Ccircle cx='38' cy='42' r='5' fill='white'/%3E%3Ccircle cx='62' cy='42' r='5' fill='white'/%3E%3Cpath d='M35 65 Q50 75 65 65' stroke='white' stroke-width='3' fill='none'/%3E%3C/svg%3E" alt="AI 팀장" class="avatar-image">
                        <div class="avatar-status">🟢 대화 준비 완료</div>
                    </div>
                </div>
            `,
            conversation: [
                {
                    speaker: 'ai',
                    message: '안녕하세요. 신규 프로젝트에 대한 기술 스택 선정을 논의하고 싶습니다. 현재 고려 중인 기술 스택이 있나요?',
                    options: [
                        {
                            label: 'Node.js + MongoDB를 추천합니다. 빠른 개발이 가능하고 확장성이 좋습니다.',
                            score: 8,
                            feedback: '👍 좋은 선택입니다. 구체적인 장점을 잘 설명했습니다.',
                            nextTopic: 'architecture'
                        },
                        {
                            label: 'Spring Boot + PostgreSQL이 좋을 것 같습니다. 엔터프라이즈급 안정성이 필요하기 때문입니다.',
                            score: 10,
                            feedback: '✅ 훌륭합니다! 프로젝트 요구사항을 고려한 선택입니다.',
                            nextTopic: 'architecture'
                        },
                        {
                            label: '아직 정하지 못했습니다. 더 고민이 필요합니다.',
                            score: 4,
                            feedback: '⚠️ 적극적인 의견 제시가 필요합니다.',
                            nextTopic: 'guidance'
                        },
                        {
                            label: '팀장님이 정해주시면 따르겠습니다.',
                            score: 2,
                            feedback: '❌ 주도적인 자세가 부족합니다. 자신의 의견을 제시해보세요.',
                            nextTopic: 'guidance'
                        }
                    ]
                },
                {
                    speaker: 'ai',
                    topic: 'architecture',
                    message: '좋습니다. 그렇다면 마이크로서비스 아키텍처와 모놀리식 아키텍처 중 어떤 것이 적합하다고 생각하시나요?',
                    options: [
                        {
                            label: '초기에는 모놀리식으로 시작하고, 트래픽 증가 시 마이크로서비스로 전환하는 것이 효율적입니다.',
                            score: 10,
                            feedback: '🌟 완벽합니다! 단계적 접근을 이해하고 있습니다.',
                            nextTopic: 'end'
                        },
                        {
                            label: '무조건 마이크로서비스로 가야 합니다. 최신 트렌드이기 때문입니다.',
                            score: 5,
                            feedback: '⚠️ 트렌드보다는 프로젝트 상황에 맞는 선택이 중요합니다.',
                            nextTopic: 'end'
                        },
                        {
                            label: '모놀리식이 더 간단해서 좋습니다.',
                            score: 6,
                            feedback: '👌 나쁘지 않지만, 확장성도 고려해야 합니다.',
                            nextTopic: 'end'
                        }
                    ]
                },
                {
                    speaker: 'ai',
                    topic: 'guidance',
                    message: '기술 스택 선정 시 고려해야 할 요소는 프로젝트 규모, 팀 숙련도, 성능 요구사항, 유지보수성입니다. 다시 한번 생각해보시겠어요?',
                    options: [
                        {
                            label: '네, 다시 생각해보니 Spring Boot가 팀 숙련도가 높아서 좋을 것 같습니다.',
                            score: 7,
                            feedback: '👍 팀 상황을 고려한 좋은 판단입니다!',
                            nextTopic: 'end'
                        },
                        {
                            label: '그냥 대중적인 것을 선택하겠습니다.',
                            score: 4,
                            feedback: '⚠️ 근거 있는 선택이 필요합니다.',
                            nextTopic: 'end'
                        }
                    ]
                }
            ],
            totalPoints: 20,
            evaluationCriteria: {
                communication: '명확하고 논리적인 의사소통',
                technical: '기술적 이해도와 적용 능력',
                proactive: '주도적이고 적극적인 태도'
            }
        },
        {
            id: 'rp_2',
            type: questionTypes.ROLE_PLAY,
            category: 'application',
            title: '🤖 AI 고객과의 상담',
            description: '고객 AI 아바타와 대화하며 고객 응대 및 문제 해결 역량을 평가받습니다',
            industry: '금융',
            job: '고객 상담',
            scenario: `
                <div class="roleplay-scenario">
                    <h4>상황 설정</h4>
                    <p>불만을 가진 고객이 전화를 걸어왔습니다. 
                    카드 결제가 거부되었다며 화가 난 상태입니다.</p>
                    <div class="ai-avatar angry">
                        <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ccircle cx='50' cy='50' r='40' fill='%23EF4444'/%3E%3Ccircle cx='38' cy='45' r='5' fill='white'/%3E%3Ccircle cx='62' cy='45' r='5' fill='white'/%3E%3Cpath d='M35 65 Q50 55 65 65' stroke='white' stroke-width='3' fill='none'/%3E%3C/svg%3E" alt="화난 고객" class="avatar-image">
                        <div class="avatar-status">🔴 불만 고객</div>
                    </div>
                </div>
            `,
            conversation: [
                {
                    speaker: 'ai',
                    message: '아니, 방금 식당에서 카드 결제가 안 됐어요! 너무 창피했다고요. 이게 무슨 일이에요?',
                    mood: 'angry',
                    options: [
                        {
                            label: '고객님, 불편을 드려 정말 죄송합니다. 우선 상황을 확인해보겠습니다. 카드 번호 끝 4자리를 말씀해주시겠어요?',
                            score: 10,
                            feedback: '✅ 완벽한 공감 + 즉시 해결 의지! 고객이 안심합니다.',
                            nextTopic: 'resolution'
                        },
                        {
                            label: '카드가 정지되었거나 한도 초과일 수 있습니다. 확인해보셨나요?',
                            score: 4,
                            feedback: '❌ 고객 탓으로 들릴 수 있습니다. 공감이 부족합니다.',
                            nextTopic: 'escalation'
                        },
                        {
                            label: '시스템 오류일 수 있습니다. 잠시만 기다려주세요.',
                            score: 6,
                            feedback: '⚠️ 공감은 부족하지만 해결 의지는 있습니다.',
                            nextTopic: 'resolution'
                        }
                    ]
                },
                {
                    speaker: 'ai',
                    topic: 'resolution',
                    message: '네... 확인 좀 빨리 해주세요. (조금 진정)',
                    mood: 'calm',
                    options: [
                        {
                            label: '확인 결과, 일시적인 시스템 점검이었습니다. 현재는 정상화되었고, 불편에 대한 보상으로 포인트 1만점을 지급해드리겠습니다.',
                            score: 10,
                            feedback: '🌟 신속한 해결 + 보상 제시! 고객 만족도 극대화!',
                            nextTopic: 'end'
                        },
                        {
                            label: '시스템이 복구되었습니다. 다시 이용해보세요.',
                            score: 6,
                            feedback: '👌 해결했지만 감동은 없습니다.',
                            nextTopic: 'end'
                        }
                    ]
                }
            ],
            totalPoints: 20,
            evaluationCriteria: {
                empathy: '공감 능력 및 감정 조절',
                problem_solving: '문제 해결 능력',
                customer_satisfaction: '고객 만족도 향상'
            }
        }
    ]
};

// Question renderer helper
function getQuestionRenderer(questionType) {
    const renderers = {
        [questionTypes.MULTIPLE_CHOICE]: renderMultipleChoice,
        [questionTypes.SCENARIO]: renderScenario,
        [questionTypes.SIMULATION]: renderSimulation,
        [questionTypes.DRAG_DROP]: renderDragDrop,
        [questionTypes.SLIDER]: renderSlider,
        [questionTypes.CODE_REVIEW]: renderCodeReview,
        [questionTypes.GAMIFIED]: renderGamified,
        [questionTypes.HOTSPOT]: renderHotspot
    };
    
    return renderers[questionType] || renderMultipleChoice;
}

// Organize questions by category for easier access
window.enhancedQuestions = {
    knowledge: [
        ...enhancedKappQuestions.multiple_choice.filter(q => q.category === 'knowledge'),
        ...enhancedKappQuestions.code_review.filter(q => q.category === 'knowledge')
    ],
    application: [
        ...enhancedKappQuestions.scenario.filter(q => q.category === 'application'),
        ...enhancedKappQuestions.simulation.filter(q => q.category === 'application'),
        ...enhancedKappQuestions.drag_drop.filter(q => q.category === 'application'),
        ...enhancedKappQuestions.hotspot.filter(q => q.category === 'application'),
        ...(enhancedKappQuestions.ai_roleplay || []).filter(q => q.category === 'application')  // ← AI 롤플레잉 추가
    ],
    performance: [
        ...enhancedKappQuestions.dashboard_analysis.filter(q => q.category === 'performance'),
        ...enhancedKappQuestions.role_play.filter(q => q.category === 'performance')
    ],
    productivity: [
        ...enhancedKappQuestions.gamified.filter(q => q.category === 'productivity'),
        ...enhancedKappQuestions.roi_simulator.filter(q => q.category === 'productivity')
    ]
};

// Export to global scope
window.questionTypes = questionTypes;
window.enhancedKappQuestions = enhancedKappQuestions;
window.getQuestionRenderer = getQuestionRenderer;