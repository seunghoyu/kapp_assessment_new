// KAPP Performance Questions - Part 3
// 10개 산업별 KPI 기반 성과 문항 (각 2문제씩)

const performanceQuestions = [
    // ========================================
    // 1. IT 산업 - Performance (KPI)
    // ========================================
    {
        id: 'it_p_1',
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
            'Redis 캐싱 + CDN 도입으로 읽기 부하를 70% 감소시킨다 ✅',
            '데이터베이스 인덱스만 최적화하고 관찰한다',
            '트래픽 목표를 30% 증가로 하향 조정한다'
        ],
        answer: 1,
        kpiImpact: {
            option0: { responseTime: 150, traffic: 150, cost: 1000, efficiency: 'low' },
            option1: { responseTime: 120, traffic: 150, cost: 600, efficiency: 'high' },
            option2: { responseTime: 170, traffic: 120, cost: 500, efficiency: 'medium' },
            option3: { responseTime: 180, traffic: 130, cost: 500, efficiency: 'low' }
        },
        explanation: 'Redis 캐싱과 CDN은 비용 대비 효율이 가장 높으며, 응답 시간과 트래픽 목표를 동시에 달성할 수 있습니다.'
    },
    {
        id: 'it_p_2',
        category: 'performance',
        industry: 'IT',
        job: '개발자(Backend)',
        question: `분기 목표: 배포 빈도를 주 1회 → 일 1회로 증가, 장애율 1% 이하 유지

현재 상황:
- 배포 빈도: 주 1회
- 평균 배포 시간: 2시간
- 장애율: 0.5%
- 테스트 커버리지: 60%

우선순위 전략은?`,
        options: [
            'CI/CD 파이프라인 자동화 + 테스트 커버리지 85%로 확대 ✅',
            '배포만 자동화하고 테스트는 수동 유지',
            '블루-그린 배포만 도입',
            '카나리 배포 + 모니터링 강화'
        ],
        answer: 0,
        kpiImpact: {
            option0: { frequency: 'daily', deployTime: 15, failureRate: 0.3, coverage: 85 },
            option1: { frequency: 'daily', deployTime: 30, failureRate: 1.5, coverage: 60 },
            option2: { frequency: '3x/week', deployTime: 45, failureRate: 0.4, coverage: 60 },
            option3: { frequency: 'daily', deployTime: 30, failureRate: 0.6, coverage: 70 }
        },
        explanation: '자동화와 테스트 커버리지 확대가 안정적인 빈번한 배포의 핵심입니다.'
    },

    // ========================================
    // 2. 금융 산업 - Performance (KPI)
    // ========================================
    {
        id: 'finance_p_1',
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
            '퍼포먼스 마케팅 채널로 전환하고 전환율이 낮은 캠페인을 중단한다 ✅',
            '신규 고객 목표를 8,000명으로 하향 조정한다',
            '현재 방식을 유지하며 마지막 달에 집중 공략한다'
        ],
        answer: 1,
        kpiImpact: {
            option0: { customers: 10000, cac: 30000, totalCost: 300000000, efficiency: 'low' },
            option1: { customers: 10200, cac: 24500, totalCost: 250000000, efficiency: 'high' },
            option2: { customers: 8000, cac: 25000, totalCost: 200000000, efficiency: 'medium' },
            option3: { customers: 9000, cac: 28000, totalCost: 252000000, efficiency: 'low' }
        },
        explanation: '비효율 채널을 제거하고 퍼포먼스 마케팅에 집중하면 CAC를 낮추면서 목표를 달성할 수 있습니다.'
    },
    {
        id: 'finance_p_2',
        category: 'performance',
        industry: '금융',
        job: '여신심사역',
        question: `분기 목표: 대출 승인율 70% 유지, 연체율 2% 이하

현재 상황:
- 승인율: 65%
- 연체율: 1.8%
- 심사 건수: 월 1,000건
- 평균 심사 시간: 30분

개선 전략은?`,
        options: [
            '승인 기준을 완화하여 승인율을 75%로 올린다',
            'AI 스코어링 모델을 도입하여 리스크 예측 정확도를 높인다 ✅',
            '심사 시간을 20분으로 단축한다',
            '고위험 고객은 무조건 거절한다'
        ],
        answer: 1,
        kpiImpact: {
            option0: { approvalRate: 75, delinquency: 3.2, accuracy: 'low' },
            option1: { approvalRate: 72, delinquency: 1.6, accuracy: 'high' },
            option2: { approvalRate: 67, delinquency: 2.0, accuracy: 'medium' },
            option3: { approvalRate: 60, delinquency: 1.2, accuracy: 'low' }
        },
        explanation: 'AI 모델은 리스크를 정확히 예측하여 승인율과 연체율을 동시에 개선할 수 있습니다.'
    },

    // ========================================
    // 3. 교육 산업 - Performance (KPI)
    // ========================================
    {
        id: 'edu_p_1',
        category: 'performance',
        industry: '교육',
        job: '교육 콘텐츠 기획자',
        question: `분기 목표: 신규 강의 완강률 60% 달성, NPS 70점 이상

현재 상황:
- 완강률: 45%
- NPS: 65점
- 주요 피드백: "실습이 부족", "난이도 불균형"

개선 전략은?`,
        options: [
            '강의 시간을 50% 줄여 완강을 유도한다',
            '각 챕터마다 인터랙티브 실습을 추가하고 난이도 단계를 재설계한다 ✅',
            '완강 시 수료증과 포인트를 제공한다',
            '강사를 교체한다'
        ],
        answer: 1,
        kpiImpact: {
            option0: { completionRate: 65, nps: 60, engagement: 'low' },
            option1: { completionRate: 68, nps: 75, engagement: 'high' },
            option2: { completionRate: 55, nps: 68, engagement: 'medium' },
            option3: { completionRate: 50, nps: 70, engagement: 'medium' }
        },
        explanation: '콘텐츠 품질 개선이 완강률과 만족도를 근본적으로 향상시킵니다.'
    },
    {
        id: 'edu_p_2',
        category: 'performance',
        industry: '교육',
        job: '에듀테크 PM',
        question: `분기 목표: DAU 50,000명, 유료 전환율 8%

현재 상황:
- DAU: 35,000명
- 유료 전환율: 5%
- 무료 사용자 평균 체류: 12분
- 유료 기능 체험율: 20%

우선 전략은?`,
        options: [
            '광고를 늘려 신규 유입을 2배로 증가시킨다',
            '무료 사용자에게 유료 기능 7일 체험을 제공하고 온보딩을 강화한다 ✅',
            '유료 요금제 가격을 30% 인하한다',
            '푸시 알림을 3배 증가시킨다'
        ],
        answer: 1,
        kpiImpact: {
            option0: { dau: 60000, conversion: 4.5, ltv: 'low' },
            option1: { dau: 45000, conversion: 9.5, ltv: 'high' },
            option2: { dau: 38000, conversion: 10, ltv: 'low' },
            option3: { dau: 32000, conversion: 5.5, ltv: 'medium' }
        },
        explanation: '유료 기능 체험과 온보딩 개선이 가장 효율적으로 전환율을 높입니다.'
    },

    // ========================================
    // 4. 의료 산업 - Performance (KPI)
    // ========================================
    {
        id: 'med_p_1',
        category: 'performance',
        industry: '의료',
        job: '병원 경영',
        question: `분기 목표: 병상 가동률 85% 달성, 환자 만족도 4.5/5.0 이상

현재 상황:
- 병상 가동률: 78%
- 환자 만족도: 4.2/5.0
- 대기 시간: 평균 45분
- 재방문율: 65%

개선 전략은?`,
        options: [
            '신규 환자 유치 마케팅을 강화한다',
            '예약 시스템을 개선하고 대기시간을 25분으로 단축한다 ✅',
            '병상 수를 20% 감축한다',
            '외래 진료 시간을 연장한다'
        ],
        answer: 1,
        kpiImpact: {
            option0: { occupancy: 82, satisfaction: 4.1, revisit: 63 },
            option1: { occupancy: 88, satisfaction: 4.6, revisit: 78 },
            option2: { occupancy: 95, satisfaction: 4.0, revisit: 60 },
            option3: { occupancy: 80, satisfaction: 4.3, revisit: 68 }
        },
        explanation: '대기시간 단축은 환자 만족도를 높이고, 이는 재방문과 병상 가동률 증가로 이어집니다.'
    },
    {
        id: 'med_p_2',
        category: 'performance',
        industry: '의료',
        job: '임상시험 코디네이터',
        question: `분기 목표: 피험자 등록 200명, 프로토콜 준수율 95% 이상

현재 상황 (2개월차):
- 피험자 등록: 120명
- 프로토콜 준수율: 92%
- 탈락률: 15%
- 평균 등록 기간: 주당 15명

개선 전략은?`,
        options: [
            '등록 기준을 완화하여 주당 30명 등록한다',
            '피험자 교육을 강화하고 리마인더 시스템을 도입한다 ✅',
            '등록 목표를 150명으로 하향 조정한다',
            '다른 병원과 협력하여 피험자를 늘린다'
        ],
        answer: 1,
        kpiImpact: {
            option0: { enrollment: 220, compliance: 85, dropout: 25 },
            option1: { enrollment: 180, compliance: 97, dropout: 8 },
            option2: { enrollment: 150, compliance: 94, dropout: 12 },
            option3: { enrollment: 200, compliance: 90, dropout: 18 }
        },
        explanation: '프로토콜 준수율과 탈락률 개선이 데이터 품질과 장기적 성과를 보장합니다.'
    },

    // ========================================
    // 5. 제조 산업 - Performance (KPI)
    // ========================================
    {
        id: 'mfg_p_1',
        category: 'performance',
        industry: '제조',
        job: '생산 관리',
        question: `분기 목표: 생산량 20% 증가, 불량률 0.5% 이하 유지

현재 상황:
- 생산량: 월 10,000개
- 불량률: 0.8%
- 설비 가동률: 75%
- 평균 설비 고장 시간: 월 8시간

개선 전략은?`,
        options: [
            '작업 속도를 30% 증가시킨다',
            '예방 정비를 강화하고 병목 공정을 자동화한다 ✅',
            '야간 추가 근무를 도입한다',
            '품질 검사를 간소화한다'
        ],
        answer: 1,
        kpiImpact: {
            option0: { production: 11500, defectRate: 1.5, uptime: 70 },
            option1: { production: 12500, defectRate: 0.4, uptime: 92 },
            option2: { production: 11800, defectRate: 0.9, uptime: 75 },
            option3: { production: 12000, defectRate: 1.2, uptime: 78 }
        },
        explanation: '설비 안정성 확보와 병목 해소가 생산량과 품질을 동시에 개선합니다.'
    },
    {
        id: 'mfg_p_2',
        category: 'performance',
        industry: '제조',
        job: '품질 관리',
        question: `분기 목표: 고객 클레임 50% 감소, 품질 비용 20% 절감

현재 상황:
- 월 클레임: 20건
- 품질 비용: 월 5,000만원 (재작업 + 폐기)
- 공정 내 불량 발견율: 60%

개선 전략은?`,
        options: [
            '출하 검사 인력을 2배로 증원한다',
            '공정 중 자동 검사 설비를 도입하여 불량 조기 발견율을 90%로 높인다 ✅',
            '클레임 발생 시 보상 금액을 줄인다',
            '품질 기준을 완화한다'
        ],
        answer: 1,
        kpiImpact: {
            option0: { claims: 18, qualityCost: 5500, detection: 70 },
            option1: { claims: 8, qualityCost: 3500, detection: 90 },
            option2: { claims: 20, qualityCost: 4000, detection: 60 },
            option3: { claims: 25, qualityCost: 4500, detection: 60 }
        },
        explanation: '공정 중 조기 발견이 재작업 비용을 줄이고 최종 클레임을 크게 감소시킵니다.'
    },

    // ========================================
    // 6. 유통/리테일 - Performance (KPI)
    // ========================================
    {
        id: 'retail_p_1',
        category: 'performance',
        industry: '유통/리테일',
        job: 'MD',
        question: `분기 목표: 재고회전율 8회 달성, 마진율 25% 유지

현재 상황:
- 재고회전율: 6회
- 마진율: 23%
- 재고 금액: 10억원
- 품절률: 12%

개선 전략은?`,
        options: [
            '재고를 50% 감축한다',
            'AI 수요 예측을 도입하고 빠른 회전 상품 비중을 40% 늘린다 ✅',
            '전 상품 10% 할인으로 재고를 소진한다',
            '신규 상품 입점을 중단한다'
        ],
        answer: 1,
        kpiImpact: {
            option0: { turnover: 9, margin: 22, stockout: 25 },
            option1: { turnover: 8.5, margin: 26, stockout: 8 },
            option2: { turnover: 10, margin: 18, stockout: 5 },
            option3: { turnover: 7, margin: 24, stockout: 10 }
        },
        explanation: 'AI 예측과 상품 믹스 최적화가 회전율과 마진을 동시에 개선합니다.'
    },
    {
        id: 'retail_p_2',
        category: 'performance',
        industry: '유통/리테일',
        job: 'E-커머스 운영',
        question: `분기 목표: 전환율 3.5% 달성, 장바구니 이탈률 65% 이하

현재 상황:
- 전환율: 2.8%
- 장바구니 이탈률: 72%
- 평균 주문 금액: 85,000원
- 페이지 로딩 속도: 3.5초

개선 전략은?`,
        options: [
            '할인 쿠폰을 대량 발송한다',
            '페이지 속도를 1초로 개선하고 원클릭 결제를 도입한다 ✅',
            '최소 주문 금액을 10만원으로 상향한다',
            '회원가입 절차를 강화한다'
        ],
        answer: 1,
        kpiImpact: {
            option0: { conversion: 3.2, cartAbandonment: 68, aov: 90000 },
            option1: { conversion: 3.8, cartAbandonment: 60, aov: 92000 },
            option2: { conversion: 2.2, cartAbandonment: 75, aov: 105000 },
            option3: { conversion: 2.5, cartAbandonment: 74, aov: 87000 }
        },
        explanation: 'UX 개선이 전환율과 이탈률을 동시에 개선하는 가장 효과적인 방법입니다.'
    },

    // ========================================
    // 7. 마케팅/광고 - Performance (KPI)
    // ========================================
    {
        id: 'mkt_p_1',
        category: 'performance',
        industry: '마케팅/광고',
        job: '퍼포먼스 마케터',
        question: `분기 목표: ROAS 400% 달성, CPA 30,000원 이하

현재 상황:
- ROAS: 320%
- CPA: 38,000원
- 월 광고비: 2,000만원
- 전환율: 2.5%

개선 전략은?`,
        options: [
            '광고비를 3,000만원으로 증액한다',
            '저성과 키워드를 제거하고 고전환 오디언스에 집중한다 ✅',
            '광고비를 1,000만원으로 감축한다',
            '모든 채널에 균등 분배한다'
        ],
        answer: 1,
        kpiImpact: {
            option0: { roas: 280, cpa: 42000, efficiency: 'low' },
            option1: { roas: 450, cpa: 27000, efficiency: 'high' },
            option2: { roas: 380, cpa: 32000, efficiency: 'medium' },
            option3: { roas: 300, cpa: 40000, efficiency: 'low' }
        },
        explanation: '비효율 제거와 고성과 타겟 집중이 ROAS와 CPA를 동시에 개선합니다.'
    },
    {
        id: 'mkt_p_2',
        category: 'performance',
        industry: '마케팅/광고',
        job: '브랜드 매니저',
        question: `분기 목표: 브랜드 인지도 50% 달성, 고려도 35% 이상

현재 상황:
- 브랜드 인지도: 38%
- 고려도: 28%
- 월 콘텐츠 발행: 8건
- 소셜 미디어 팔로워 증가율: 월 5%

개선 전략은?`,
        options: [
            '유명 인플루언서와 협업하여 단기 노출을 극대화한다 ✅',
            '콘텐츠 발행을 20건으로 증가시킨다',
            'TV 광고를 집행한다',
            'SNS 광고비를 2배로 증액한다'
        ],
        answer: 0,
        kpiImpact: {
            option0: { awareness: 52, consideration: 38, efficiency: 'high' },
            option1: { awareness: 42, consideration: 30, efficiency: 'medium' },
            option2: { awareness: 55, consideration: 32, efficiency: 'low' },
            option3: { awareness: 45, consideration: 33, efficiency: 'medium' }
        },
        explanation: '인플루언서 협업이 인지도와 고려도를 빠르게 높이는 가장 효율적인 방법입니다.'
    },

    // ========================================
    // 8. 호텔/관광 - Performance (KPI)
    // ========================================
    {
        id: 'hotel_p_1',
        category: 'performance',
        industry: '호텔/관광',
        job: '호텔리어',
        question: `분기 목표: RevPAR 180,000원 달성, 고객 만족도 4.5/5.0 이상

현재 상황:
- RevPAR: 150,000원
- 객실 점유율: 75%
- ADR: 200,000원
- 고객 만족도: 4.2/5.0

개선 전략은?`,
        options: [
            'ADR을 250,000원으로 인상한다',
            '조식 포함 패키지와 회원 특전을 강화하여 점유율을 85%로 높인다 ✅',
            '객실 수를 20% 증축한다',
            'OTA 수수료 채널을 확대한다'
        ],
        answer: 1,
        kpiImpact: {
            option0: { revpar: 165000, occupancy: 66, satisfaction: 4.0 },
            option1: { revpar: 187000, occupancy: 85, satisfaction: 4.6 },
            option2: { revpar: 140000, occupancy: 70, satisfaction: 4.2 },
            option3: { revpar: 160000, occupancy: 78, satisfaction: 4.1 }
        },
        explanation: '부가가치 제공으로 점유율을 높이는 것이 RevPAR과 만족도를 동시에 개선합니다.'
    },
    {
        id: 'hotel_p_2',
        category: 'performance',
        industry: '호텔/관광',
        job: '여행 상품 기획자',
        question: `분기 목표: 패키지 판매 2,000건, 재구매율 40% 이상

현재 상황:
- 패키지 판매: 1,200건
- 재구매율: 28%
- 평균 고객 평점: 4.0/5.0
- 판매 채널: 자사몰 60%, OTA 40%

개선 전략은?`,
        options: [
            'OTA 수수료를 감수하고 OTA 비중을 70%로 늘린다',
            '기존 고객 대상 시즌별 맞춤 상품을 추천하고 재방문 쿠폰을 제공한다 ✅',
            '신규 상품 개발에만 집중한다',
            '가격을 20% 인하한다'
        ],
        answer: 1,
        kpiImpact: {
            option0: { sales: 2200, repurchase: 25, margin: 'low' },
            option1: { sales: 2100, repurchase: 45, margin: 'high' },
            option2: { sales: 1800, repurchase: 30, margin: 'medium' },
            option3: { sales: 2400, repurchase: 32, margin: 'low' }
        },
        explanation: '기존 고객 관리로 재구매율을 높이는 것이 장기적으로 수익성이 높습니다.'
    },

    // ========================================
    // 9. 법률/회계 - Performance (KPI)
    // ========================================
    {
        id: 'legal_p_1',
        category: 'performance',
        industry: '법률/회계',
        job: '회계사',
        question: `분기 목표: 감사 건수 30건 완료, 평균 감사 기간 30일 이하

현재 상황:
- 감사 건수: 18건 (2개월)
- 평균 감사 기간: 38일
- 주요 지연 원인: 자료 요청 지연 60%, 내부 검토 25%

개선 전략은?`,
        options: [
            '감사 인력을 2배로 증원한다',
            '자동화 도구로 자료 수집을 간소화하고 사전 체크리스트를 강화한다 ✅',
            '감사 범위를 축소한다',
            '외주 용역을 활용한다'
        ],
        answer: 1,
        kpiImpact: {
            option0: { audits: 32, avgDays: 35, cost: 'high' },
            option1: { audits: 31, avgDays: 28, cost: 'medium' },
            option2: { audits: 28, avgDays: 25, cost: 'low' },
            option3: { audits: 30, avgDays: 32, cost: 'high' }
        },
        explanation: '프로세스 개선과 자동화가 품질을 유지하면서 효율을 높입니다.'
    },
    {
        id: 'legal_p_2',
        category: 'performance',
        industry: '법률/회계',
        job: '법무팀',
        question: `분기 목표: 계약 검토 건수 200건, 평균 검토 시간 4시간 이하

현재 상황:
- 계약 검토 건수: 120건 (2개월)
- 평균 검토 시간: 6시간
- 주요 리스크 발견율: 35%

개선 전략은?`,
        options: [
            '검토 시간을 3시간으로 단축한다',
            'AI 계약 분석 도구로 리스크 조항을 자동 검출하고 표준 템플릿을 확대한다 ✅',
            '외부 법무법인에 위탁한다',
            '간단한 계약은 검토를 생략한다'
        ],
        answer: 1,
        kpiImpact: {
            option0: { contracts: 180, avgTime: 3, riskDetection: 28 },
            option1: { contracts: 210, avgTime: 3.5, riskDetection: 42 },
            option2: { contracts: 200, avgTime: 4, riskDetection: 35 },
            option3: { contracts: 220, avgTime: 2.5, riskDetection: 20 }
        },
        explanation: 'AI 도구와 표준화가 속도와 리스크 발견율을 모두 향상시킵니다.'
    },

    // ========================================
    // 10. 기타(HR) - Performance (KPI)
    // ========================================
    {
        id: 'other_p_1',
        category: 'performance',
        industry: '기타',
        job: '인사/HR',
        question: `분기 목표: 채용 완료율 90% 달성, 평균 채용 기간 45일 이하

현재 상황:
- 채용 완료율: 70%
- 평균 채용 기간: 62일
- 주요 병목: 서류 전형 20일, 최종 결정 15일

개선 전략은?`,
        options: [
            '채용 목표를 하향 조정한다',
            'AI 서류 전형 도구와 구조화된 면접 프로세스를 도입한다 ✅',
            '헤드헌터를 활용한다',
            '채용 공고를 3배로 늘린다'
        ],
        answer: 1,
        kpiImpact: {
            option0: { completionRate: 85, avgDays: 60, quality: 'low' },
            option1: { completionRate: 92, avgDays: 42, quality: 'high' },
            option2: { completionRate: 88, avgDays: 50, quality: 'medium' },
            option3: { completionRate: 75, avgDays: 58, quality: 'medium' }
        },
        explanation: '프로세스 자동화와 구조화가 속도와 채용 품질을 모두 개선합니다.'
    },
    {
        id: 'other_p_2',
        category: 'performance',
        industry: '기타',
        job: '인사/HR',
        question: `분기 목표: 직원 만족도 4.2/5.0 달성, 이직률 10% 이하

현재 상황:
- 직원 만족도: 3.8/5.0
- 이직률: 15%
- 주요 불만: 성장 기회 부족 40%, 업무 강도 30%

개선 전략은?`,
        options: [
            '급여를 15% 인상한다',
            '개인별 성장 계획(IDP)을 수립하고 분기별 1:1 코칭을 도입한다 ✅',
            '복리후생을 강화한다',
            '워크샵을 분기 1회 진행한다'
        ],
        answer: 1,
        kpiImpact: {
            option0: { satisfaction: 4.0, turnover: 12, engagement: 'medium' },
            option1: { satisfaction: 4.3, turnover: 9, engagement: 'high' },
            option2: { satisfaction: 3.9, turnover: 13, engagement: 'low' },
            option3: { satisfaction: 4.0, turnover: 14, engagement: 'medium' }
        },
        explanation: '성장 기회 제공이 만족도와 리텐션을 근본적으로 개선합니다.'
    }
];

// Export to window
if (typeof window !== 'undefined') {
    window.performanceQuestions = performanceQuestions;
}
