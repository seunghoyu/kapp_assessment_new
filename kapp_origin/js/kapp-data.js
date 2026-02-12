// KAPP Assessment Data - 10개 산업별 완전 문항 구성
// Knowledge (적응형), Application (시나리오), Performance (KPI), Productivity (E-tray + AI 워크플로우)

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

// ========================================
// KAPP Question Bank - 10개 산업별 완전 구성
// ========================================

const kappQuestionBank = {
    
    // ========================================
    // 1. IT 산업 (💻)
    // ========================================
    knowledge: {
        easy: [
            // IT - Easy
            {
                id: 'it_k_e_1',
                category: 'knowledge',
                difficulty: 'easy',
                industry: 'IT',
                question: 'RESTful API의 HTTP 메서드 중 리소스를 생성할 때 사용하는 것은?',
                options: ['GET', 'POST', 'PUT', 'DELETE'],
                answer: 1,
                explanation: 'POST는 새로운 리소스를 생성할 때 사용하는 HTTP 메서드입니다.'
            },
            {
                id: 'it_k_e_2',
                category: 'knowledge',
                difficulty: 'easy',
                industry: 'IT',
                question: 'Git에서 원격 저장소의 변경사항을 로컬로 가져오는 명령어는?',
                options: ['git push', 'git pull', 'git commit', 'git branch'],
                answer: 1,
                explanation: 'git pull은 원격 저장소의 변경사항을 로컬로 가져와 병합합니다.'
            },
            // 금융 - Easy
            {
                id: 'finance_k_e_1',
                category: 'knowledge',
                difficulty: 'easy',
                industry: '금융',
                question: '신용카드의 필수 구성 요소가 아닌 것은?',
                options: ['카드번호', '유효기간', '보안코드(CVV)', '소지자 얼굴사진'],
                answer: 3,
                explanation: '신용카드의 필수 구성 요소는 카드번호, 유효기간, 보안코드이며, 얼굴사진은 선택사항입니다.'
            },
            {
                id: 'finance_k_e_2',
                category: 'knowledge',
                difficulty: 'easy',
                industry: '금융',
                question: 'ROE(자기자본이익률)를 계산하는 공식은?',
                options: ['당기순이익 ÷ 자기자본', '매출 ÷ 자산', '영업이익 ÷ 매출', '부채 ÷ 자기자본'],
                answer: 0,
                explanation: 'ROE = 당기순이익 ÷ 자기자본으로, 자본의 효율성을 측정합니다.'
            },
            // 교육 - Easy
            {
                id: 'edu_k_e_1',
                category: 'knowledge',
                difficulty: 'easy',
                industry: '교육',
                question: "Bloom's Taxonomy에서 가장 낮은 인지 단계는?",
                options: ['이해(Understanding)', '기억(Remembering)', '적용(Applying)', '분석(Analyzing)'],
                answer: 1,
                explanation: "Bloom's Taxonomy는 기억 → 이해 → 적용 → 분석 → 평가 → 창조 순서입니다."
            },
            {
                id: 'edu_k_e_2',
                category: 'knowledge',
                difficulty: 'easy',
                industry: '교육',
                question: 'LMS(Learning Management System)의 주요 기능이 아닌 것은?',
                options: ['강의 콘텐츠 관리', '학습 진도 추적', '성적 관리', '재무 회계 처리'],
                answer: 3,
                explanation: 'LMS는 학습 관리 시스템으로, 재무 회계는 ERP 영역입니다.'
            },
            // 의료 - Easy
            {
                id: 'med_k_e_1',
                category: 'knowledge',
                difficulty: 'easy',
                industry: '의료',
                question: 'EMR(Electronic Medical Record)의 주요 목적은?',
                options: ['환자 진료 기록 전산화', '병원 재무 관리', '의약품 재고 관리', '인사 관리'],
                answer: 0,
                explanation: 'EMR은 환자의 진료 기록을 전자적으로 관리하는 시스템입니다.'
            },
            {
                id: 'med_k_e_2',
                category: 'knowledge',
                difficulty: 'easy',
                industry: '의료',
                question: '임상시험 3상(Phase 3)의 주요 목적은?',
                options: ['안전성 확인', '대규모 효능 검증', '초기 용량 설정', '시판 후 조사'],
                answer: 1,
                explanation: '3상은 대규모 환자군에서 효능과 안전성을 최종 검증하는 단계입니다.'
            },
            // 제조 - Easy
            {
                id: 'mfg_k_e_1',
                category: 'knowledge',
                difficulty: 'easy',
                industry: '제조',
                question: '6시그마(Six Sigma)의 목표 불량률은?',
                options: ['1%', '0.1%', '0.00034%', '0.0001%'],
                answer: 2,
                explanation: '6시그마는 백만 개당 3.4개 불량을 목표로 하는 품질 관리 기법입니다.'
            },
            {
                id: 'mfg_k_e_2',
                category: 'knowledge',
                difficulty: 'easy',
                industry: '제조',
                question: 'JIT(Just-In-Time) 생산 방식의 핵심 목적은?',
                options: ['대량 생산', '재고 최소화', '인력 증원', '설비 확장'],
                answer: 1,
                explanation: 'JIT는 필요한 시점에 필요한 만큼만 생산하여 재고를 최소화합니다.'
            },
            // 유통/리테일 - Easy
            {
                id: 'retail_k_e_1',
                category: 'knowledge',
                difficulty: 'easy',
                industry: '유통/리테일',
                question: '재고회전율(Inventory Turnover)을 계산하는 공식은?',
                options: ['매출원가 ÷ 평균재고', '매출액 ÷ 총자산', '순이익 ÷ 매출', '재고 ÷ 매출'],
                answer: 0,
                explanation: '재고회전율 = 매출원가 ÷ 평균재고로, 재고의 효율성을 측정합니다.'
            },
            {
                id: 'retail_k_e_2',
                category: 'knowledge',
                difficulty: 'easy',
                industry: '유통/리테일',
                question: 'SKU(Stock Keeping Unit)는 무엇을 의미하는가?',
                options: ['재고 관리 단위', '매장 수', '직원 수', '판매 금액'],
                answer: 0,
                explanation: 'SKU는 재고 관리의 최소 단위로, 각 상품을 구분하는 고유 코드입니다.'
            },
            // 마케팅/광고 - Easy
            {
                id: 'mkt_k_e_1',
                category: 'knowledge',
                difficulty: 'easy',
                industry: '마케팅/광고',
                question: 'CTR(Click-Through Rate)을 계산하는 공식은?',
                options: ['클릭 수 ÷ 노출 수 × 100', '전환 수 ÷ 클릭 수', '매출 ÷ 광고비', '방문자 수 ÷ 노출 수'],
                answer: 0,
                explanation: 'CTR = (클릭 수 ÷ 노출 수) × 100으로 광고 효율을 측정합니다.'
            },
            {
                id: 'mkt_k_e_2',
                category: 'knowledge',
                difficulty: 'easy',
                industry: '마케팅/광고',
                question: 'ROAS(Return On Ad Spend)가 200%라는 의미는?',
                options: ['광고비 대비 2배 매출', '광고비 대비 2배 이익', '광고비 2배 지출', '클릭률 200%'],
                answer: 0,
                explanation: 'ROAS 200%는 광고비 1원 투자 시 2원의 매출이 발생함을 의미합니다.'
            },
            // 호텔/관광 - Easy
            {
                id: 'hotel_k_e_1',
                category: 'knowledge',
                difficulty: 'easy',
                industry: '호텔/관광',
                question: '호텔의 객실 점유율(Occupancy Rate)을 계산하는 공식은?',
                options: ['판매 객실 수 ÷ 전체 객실 수', '매출 ÷ 객실 수', '투숙객 수 ÷ 직원 수', '예약 수 ÷ 문의 수'],
                answer: 0,
                explanation: '객실 점유율 = (판매 객실 수 ÷ 전체 객실 수) × 100입니다.'
            },
            {
                id: 'hotel_k_e_2',
                category: 'knowledge',
                difficulty: 'easy',
                industry: '호텔/관광',
                question: 'ADR(Average Daily Rate)은 무엇을 나타내는가?',
                options: ['평균 객실 단가', '총 매출액', '고객 만족도', '직원 급여'],
                answer: 0,
                explanation: 'ADR은 판매된 객실의 평균 단가를 나타냅니다.'
            },
            // 법률/회계 - Easy
            {
                id: 'legal_k_e_1',
                category: 'knowledge',
                difficulty: 'easy',
                industry: '법률/회계',
                question: '재무제표 3대 보고서가 아닌 것은?',
                options: ['재무상태표', '손익계산서', '현금흐름표', '주주총회 의사록'],
                answer: 3,
                explanation: '재무제표 3대 보고서는 재무상태표, 손익계산서, 현금흐름표입니다.'
            },
            {
                id: 'legal_k_e_2',
                category: 'knowledge',
                difficulty: 'easy',
                industry: '법률/회계',
                question: '계약의 성립 요건 3가지는?',
                options: ['청약, 승낙, 대가', '청약, 승낙, 합의', '제안, 협상, 서명', '의사, 표시, 실행'],
                answer: 1,
                explanation: '계약은 청약(offer), 승낙(acceptance), 합의(agreement)로 성립됩니다.'
            },
            // 기타 - Easy
            {
                id: 'other_k_e_1',
                category: 'knowledge',
                difficulty: 'easy',
                industry: '기타',
                question: 'HR의 4대 핵심 기능이 아닌 것은?',
                options: ['채용', '교육', '평가', '제품 개발'],
                answer: 3,
                explanation: 'HR 4대 기능은 채용, 교육, 평가, 보상입니다.'
            },
            {
                id: 'other_k_e_2',
                category: 'knowledge',
                difficulty: 'easy',
                industry: '기타',
                question: 'KPI(Key Performance Indicator)의 올바른 해석은?',
                options: ['핵심 성과 지표', '업무 프로세스 개선', '고객 만족도', '재무 비율'],
                answer: 0,
                explanation: 'KPI는 조직의 목표 달성도를 측정하는 핵심 성과 지표입니다.'
            }
        ],
        
        medium: [
            // IT - Medium
            {
                id: 'it_k_m_1',
                category: 'knowledge',
                difficulty: 'medium',
                industry: 'IT',
                question: '마이크로서비스 아키텍처에서 서비스 간 통신을 위한 메시지 브로커가 아닌 것은?',
                options: ['Kafka', 'RabbitMQ', 'Redis', 'MongoDB'],
                answer: 3,
                explanation: 'MongoDB는 NoSQL 데이터베이스이며, 메시지 브로커가 아닙니다.'
            },
            {
                id: 'it_k_m_2',
                category: 'knowledge',
                difficulty: 'medium',
                industry: 'IT',
                question: 'OAuth 2.0의 4가지 주요 역할(Role)이 아닌 것은?',
                options: ['Resource Owner', 'Client', 'Authorization Server', 'Database Server'],
                answer: 3,
                explanation: 'OAuth 2.0의 4가지 역할은 Resource Owner, Client, Authorization Server, Resource Server입니다.'
            },
            // 금융 - Medium
            {
                id: 'finance_k_m_1',
                category: 'knowledge',
                difficulty: 'medium',
                industry: '금융',
                question: '카드사의 주요 수익 구조(NIM)에서 가장 큰 비중을 차지하는 것은?',
                options: ['연회비 수익', '가맹점 수수료(MDR)', '카드론 이자', '포인트 제휴 수수료'],
                answer: 1,
                explanation: 'MDR(Merchant Discount Rate)은 카드사의 가장 큰 수익원입니다.'
            },
            {
                id: 'finance_k_m_2',
                category: 'knowledge',
                difficulty: 'medium',
                industry: '금융',
                question: 'Basel III 자기자본비율 규제에서 CET1(보통주자본) 최소 비율은?',
                options: ['2%', '4.5%', '6%', '8%'],
                answer: 1,
                explanation: 'Basel III에서 CET1 최소 비율은 4.5%입니다.'
            },
            // 교육 - Medium
            {
                id: 'edu_k_m_1',
                category: 'knowledge',
                difficulty: 'medium',
                industry: '교육',
                question: '플립러닝(Flipped Learning)의 핵심 원리는?',
                options: ['강의는 온라인, 과제는 오프라인', '강의는 오프라인, 과제는 온라인', '모든 학습을 온라인으로', '모든 학습을 오프라인으로'],
                answer: 0,
                explanation: '플립러닝은 강의를 온라인으로 제공하고, 오프라인에서 토론/활동을 진행합니다.'
            },
            {
                id: 'edu_k_m_2',
                category: 'knowledge',
                difficulty: 'medium',
                industry: '교육',
                question: "Kirkpatrick's 4-Level Training Evaluation Model에서 2단계는?",
                options: ['Reaction', 'Learning', 'Behavior', 'Results'],
                answer: 1,
                explanation: 'Kirkpatrick 모델의 2단계는 Learning(학습 효과 측정)입니다.'
            },
            // 의료 - Medium
            {
                id: 'med_k_m_1',
                category: 'knowledge',
                difficulty: 'medium',
                industry: '의료',
                question: 'HL7(Health Level 7)의 주요 목적은?',
                options: ['의료 정보 교환 표준', '의료 장비 규격', '병원 건축 기준', '의료 보험 코드'],
                answer: 0,
                explanation: 'HL7은 의료 정보 시스템 간 데이터 교환을 위한 국제 표준입니다.'
            },
            {
                id: 'med_k_m_2',
                category: 'knowledge',
                difficulty: 'medium',
                industry: '의료',
                question: 'GCP(Good Clinical Practice)는 무엇을 규정하는가?',
                options: ['임상시험 윤리 및 품질 기준', '병원 경영 지침', '의료 기기 제조 기준', '환자 진료 프로토콜'],
                answer: 0,
                explanation: 'GCP는 임상시험의 계획, 실시, 모니터링, 기록 및 보고에 관한 국제 윤리·품질 기준입니다.'
            },
            // 제조 - Medium
            {
                id: 'mfg_k_m_1',
                category: 'knowledge',
                difficulty: 'medium',
                industry: '제조',
                question: 'MES(Manufacturing Execution System)의 주요 기능이 아닌 것은?',
                options: ['생산 일정 관리', '품질 관리', '설비 모니터링', '재무 회계 관리'],
                answer: 3,
                explanation: 'MES는 제조 현장의 생산, 품질, 설비를 관리하며, 재무 회계는 ERP 영역입니다.'
            },
            {
                id: 'mfg_k_m_2',
                category: 'knowledge',
                difficulty: 'medium',
                industry: '제조',
                question: 'TPM(Total Productive Maintenance)의 8대 기둥이 아닌 것은?',
                options: ['자주보전', '계획보전', '품질보전', '재무보전'],
                answer: 3,
                explanation: 'TPM 8대 기둥에는 재무보전이 포함되지 않습니다.'
            },
            // 유통/리테일 - Medium
            {
                id: 'retail_k_m_1',
                category: 'knowledge',
                difficulty: 'medium',
                industry: '유통/리테일',
                question: '옴니채널(Omni-Channel) 전략의 핵심 목표는?',
                options: ['채널별 독립 운영', '온·오프라인 통합 경험', '온라인 전용 판매', '오프라인 매장 축소'],
                answer: 1,
                explanation: '옴니채널은 모든 채널을 통합하여 일관된 고객 경험을 제공하는 전략입니다.'
            },
            {
                id: 'retail_k_m_2',
                category: 'knowledge',
                difficulty: 'medium',
                industry: '유통/리테일',
                question: 'VMI(Vendor Managed Inventory)의 주요 장점은?',
                options: ['재고 부담을 공급사로 이전', '재고를 소매점이 직접 관리', '재고를 보유하지 않음', '재고를 대량 구매'],
                answer: 0,
                explanation: 'VMI는 공급사가 소매점의 재고를 관리하여 재고 최적화와 비용 절감을 실현합니다.'
            },
            // 마케팅/광고 - Medium
            {
                id: 'mkt_k_m_1',
                category: 'knowledge',
                difficulty: 'medium',
                industry: '마케팅/광고',
                question: 'Attribution Model에서 Last-Click Attribution의 문제점은?',
                options: ['첫 접점 과대평가', '중간 접점 무시', '모든 접점 동등 평가', '전환 이전 무시'],
                answer: 1,
                explanation: 'Last-Click은 마지막 접점만 인정하여 중간 과정의 기여도를 무시합니다.'
            },
            {
                id: 'mkt_k_m_2',
                category: 'knowledge',
                difficulty: 'medium',
                industry: '마케팅/광고',
                question: 'CAC(Customer Acquisition Cost)를 낮추는 방법이 아닌 것은?',
                options: ['전환율 개선', '유기적 트래픽 증가', '광고비 무조건 증액', '리타게팅 활용'],
                answer: 2,
                explanation: '광고비를 무조건 증액하면 CAC가 오히려 상승할 수 있습니다.'
            },
            // 호텔/관광 - Medium
            {
                id: 'hotel_k_m_1',
                category: 'knowledge',
                difficulty: 'medium',
                industry: '호텔/관광',
                question: 'RevPAR(Revenue Per Available Room)을 계산하는 공식은?',
                options: ['객실 매출 ÷ 전체 객실 수', '객실 매출 ÷ 판매 객실 수', 'ADR × 점유율', 'A와 C 모두 정답'],
                answer: 3,
                explanation: 'RevPAR = 객실 매출 ÷ 전체 객실 수 = ADR × 점유율입니다.'
            },
            {
                id: 'hotel_k_m_2',
                category: 'knowledge',
                difficulty: 'medium',
                industry: '호텔/관광',
                question: 'Yield Management의 핵심 원리는?',
                options: ['고정 가격 유지', '수요에 따른 동적 가격', '최저가 경쟁', '할인 극대화'],
                answer: 1,
                explanation: 'Yield Management는 수요 예측에 따라 가격을 동적으로 조정하여 수익을 극대화합니다.'
            },
            // 법률/회계 - Medium
            {
                id: 'legal_k_m_1',
                category: 'knowledge',
                difficulty: 'medium',
                industry: '법률/회계',
                question: 'K-IFRS에서 리스 회계처리 시 사용권자산을 인식하는 기준은?',
                options: ['모든 리스', '운용리스만', '금융리스만', '장기리스만'],
                answer: 0,
                explanation: 'K-IFRS 16호에 따라 모든 리스에 대해 사용권자산을 인식합니다.'
            },
            {
                id: 'legal_k_m_2',
                category: 'knowledge',
                difficulty: 'medium',
                industry: '법률/회계',
                question: '근로기준법상 연장근로 한도(주 단위)는?',
                options: ['주 8시간', '주 12시간', '주 16시간', '제한 없음'],
                answer: 1,
                explanation: '근로기준법 제53조에 따라 연장근로는 주 12시간을 초과할 수 없습니다.'
            },
            // 기타 - Medium
            {
                id: 'other_k_m_1',
                category: 'knowledge',
                difficulty: 'medium',
                industry: '기타',
                question: 'OKR(Objectives and Key Results)에서 Key Results의 특징은?',
                options: ['정성적 목표', '측정 가능한 지표', '장기 비전', '추상적 방향'],
                answer: 1,
                explanation: 'Key Results는 목표 달성을 측정할 수 있는 구체적이고 정량적인 지표입니다.'
            },
            {
                id: 'other_k_m_2',
                category: 'knowledge',
                difficulty: 'medium',
                industry: '기타',
                question: 'SWOT 분석에서 SO 전략의 의미는?',
                options: ['강점으로 기회 활용', '강점으로 위협 대응', '약점 보완', '위협 회피'],
                answer: 0,
                explanation: 'SO 전략은 내부 강점(Strength)을 활용하여 외부 기회(Opportunity)를 극대화하는 전략입니다.'
            }
        ],
        
        hard: [
            // IT - Hard
            {
                id: 'it_k_h_1',
                category: 'knowledge',
                difficulty: 'hard',
                industry: 'IT',
                question: 'CAP 정리(Theorem)에서 분산 시스템이 동시에 보장할 수 있는 속성은?',
                options: ['C, A, P 모두', 'C와 A만', '3개 중 2개', '상황에 따라 다름'],
                answer: 2,
                explanation: 'CAP 정리는 분산 시스템이 일관성(C), 가용성(A), 분할 내성(P) 중 2개만 동시에 보장할 수 있음을 설명합니다.'
            },
            {
                id: 'it_k_h_2',
                category: 'knowledge',
                difficulty: 'hard',
                industry: 'IT',
                question: 'Saga 패턴에서 보상 트랜잭션(Compensating Transaction)의 목적은?',
                options: ['성능 향상', '분산 트랜잭션 롤백', '데이터 암호화', '캐시 무효화'],
                answer: 1,
                explanation: 'Saga 패턴의 보상 트랜잭션은 분산 환경에서 실패 시 이전 단계를 롤백하는 역할을 합니다.'
            },
            // 금융 - Hard
            {
                id: 'finance_k_h_1',
                category: 'knowledge',
                difficulty: 'hard',
                industry: '금융',
                question: '카드 고객의 생애가치(CLV) 산정 시 핵심 변수가 아닌 것은?',
                options: ['평균 거래 빈도', '고객 유지율', '평균 거래 금액', '고객 나이'],
                answer: 3,
                explanation: 'CLV는 거래 빈도, 유지율, 거래 금액, 마진 등으로 계산하며, 나이는 직접 변수가 아닙니다.'
            },
            {
                id: 'finance_k_h_2',
                category: 'knowledge',
                difficulty: 'hard',
                industry: '금융',
                question: 'VaR(Value at Risk) 95% 신뢰구간의 의미는?',
                options: ['95% 확률로 손실 발생', '5% 확률로 특정 금액 이상 손실', '95% 수익 보장', '5% 손실 제한'],
                answer: 1,
                explanation: 'VaR 95%는 5% 확률로 해당 금액 이상의 손실이 발생할 수 있음을 의미합니다.'
            },
            // 교육 - Hard
            {
                id: 'edu_k_h_1',
                category: 'knowledge',
                difficulty: 'hard',
                industry: '교육',
                question: '적응적 학습(Adaptive Learning)에서 IRT(Item Response Theory)의 역할은?',
                options: ['학습자 선호도 파악', '문항 난이도 추정', '학습 시간 측정', '출석 관리'],
                answer: 1,
                explanation: 'IRT는 각 문항의 난이도와 학습자의 능력을 수학적으로 추정하여 적응형 테스트를 구현합니다.'
            },
            {
                id: 'edu_k_h_2',
                category: 'knowledge',
                difficulty: 'hard',
                industry: '교육',
                question: '교육 ROI 계산에서 Phillips ROI Model의 5단계는?',
                options: ['반응', '학습', '행동', 'ROI', '모두 포함'],
                answer: 4,
                explanation: 'Phillips 모델은 Kirkpatrick 4단계에 ROI(투자수익률)를 추가한 5단계 모델입니다.'
            },
            // 의료 - Hard
            {
                id: 'med_k_h_1',
                category: 'knowledge',
                difficulty: 'hard',
                industry: '의료',
                question: 'RWD(Real-World Data)와 RWE(Real-World Evidence)의 차이는?',
                options: ['같은 개념', 'RWD는 데이터, RWE는 분석된 증거', 'RWE는 데이터, RWD는 증거', '모두 임상시험 데이터'],
                answer: 1,
                explanation: 'RWD는 실제 진료 환경에서 수집된 원시 데이터이고, RWE는 RWD를 분석하여 도출한 임상적 증거입니다.'
            },
            {
                id: 'med_k_h_2',
                category: 'knowledge',
                difficulty: 'hard',
                industry: '의료',
                question: 'DRG(Diagnosis-Related Group) 지불제도의 핵심 원리는?',
                options: ['행위별 수가', '포괄 수가', '일당 정액', '성과 연동'],
                answer: 1,
                explanation: 'DRG는 진단명에 따라 포괄 수가를 지불하는 제도로, 의료비 절감을 유도합니다.'
            },
            // 제조 - Hard
            {
                id: 'mfg_k_h_1',
                category: 'knowledge',
                difficulty: 'hard',
                industry: '제조',
                question: 'Industry 4.0에서 Digital Twin의 핵심 가치는?',
                options: ['비용 절감', '가상 시뮬레이션 및 예측', '인력 감축', '단순 데이터 수집'],
                answer: 1,
                explanation: 'Digital Twin은 물리적 자산의 디지털 복제본으로, 시뮬레이션과 예측을 통해 최적화를 실현합니다.'
            },
            {
                id: 'mfg_k_h_2',
                category: 'knowledge',
                difficulty: 'hard',
                industry: '제조',
                question: 'TOC(Theory of Constraints)에서 병목(Bottleneck) 관리의 우선순위는?',
                options: ['모든 공정 동시 개선', '병목 공정 집중 개선', '비병목 공정 먼저', '순차적 개선'],
                answer: 1,
                explanation: 'TOC는 전체 시스템의 처리량은 병목 공정에 의해 결정되므로, 병목 개선에 집중합니다.'
            },
            // 유통/리테일 - Hard
            {
                id: 'retail_k_h_1',
                category: 'knowledge',
                difficulty: 'hard',
                industry: '유통/리테일',
                question: '수요 예측에서 CPFR(Collaborative Planning, Forecasting, and Replenishment)의 핵심은?',
                options: ['자동화 예측', '공급사-소매업체 협업', 'AI 알고리즘', '과거 데이터 분석'],
                answer: 1,
                explanation: 'CPFR은 공급사와 소매업체가 협력하여 수요를 예측하고 재고를 최적화하는 프로세스입니다.'
            },
            {
                id: 'retail_k_h_2',
                category: 'knowledge',
                difficulty: 'hard',
                industry: '유통/리테일',
                question: 'Dynamic Pricing 알고리즘에서 Price Elasticity의 의미는?',
                options: ['가격 변동률', '수요의 가격 민감도', '재고 수준', '경쟁사 가격'],
                answer: 1,
                explanation: 'Price Elasticity는 가격 변화에 대한 수요의 반응 정도를 나타냅니다.'
            },
            // 마케팅/광고 - Hard
            {
                id: 'mkt_k_h_1',
                category: 'knowledge',
                difficulty: 'hard',
                industry: '마케팅/광고',
                question: 'Marketing Mix Modeling(MMM)의 주요 목적은?',
                options: ['실시간 광고 최적화', '마케팅 채널별 기여도 측정', 'A/B 테스트', '키워드 분석'],
                answer: 1,
                explanation: 'MMM은 과거 데이터를 분석하여 각 마케팅 채널의 매출 기여도를 측정합니다.'
            },
            {
                id: 'mkt_k_h_2',
                category: 'knowledge',
                difficulty: 'hard',
                industry: '마케팅/광고',
                question: 'Cohort Analysis에서 Retention Rate를 측정하는 이유는?',
                options: ['신규 고객 확보', '고객 유지 패턴 파악', '광고 효율 측정', '전환율 향상'],
                answer: 1,
                explanation: 'Cohort Analysis는 동일 시기 유입 고객군의 유지율 변화를 추적하여 제품/서비스 개선점을 파악합니다.'
            },
            // 호텔/관광 - Hard
            {
                id: 'hotel_k_h_1',
                category: 'knowledge',
                difficulty: 'hard',
                industry: '호텔/관광',
                question: 'GOPPAR(Gross Operating Profit Per Available Room)가 RevPAR보다 우수한 지표인 이유는?',
                options: ['계산이 간단함', '매출뿐 아니라 비용까지 고려', '객실만 측정', '고객 만족도 반영'],
                answer: 1,
                explanation: 'GOPPAR은 매출과 운영 비용을 모두 고려하여 실제 수익성을 측정합니다.'
            },
            {
                id: 'hotel_k_h_2',
                category: 'knowledge',
                difficulty: 'hard',
                industry: '호텔/관광',
                question: 'OTA(Online Travel Agency)와의 협상에서 Rate Parity의 의미는?',
                options: ['가격 차별화', '동일 가격 유지', '할인 금지', 'OTA 수수료'],
                answer: 1,
                explanation: 'Rate Parity는 모든 판매 채널에서 동일한 가격을 유지하는 정책입니다.'
            },
            // 법률/회계 - Hard
            {
                id: 'legal_k_h_1',
                category: 'knowledge',
                difficulty: 'hard',
                industry: '법률/회계',
                question: '이연법인세자산(Deferred Tax Asset)이 발생하는 경우는?',
                options: ['회계이익 > 과세소득', '회계이익 < 과세소득', '회계이익 = 과세소득', '법인세 없음'],
                answer: 1,
                explanation: '일시적 차이로 회계이익이 과세소득보다 적으면 미래에 세금 절감 효과가 발생하여 이연법인세자산을 인식합니다.'
            },
            {
                id: 'legal_k_h_2',
                category: 'knowledge',
                difficulty: 'hard',
                industry: '법률/회계',
                question: '공정거래법상 시장지배적 지위 남용 행위가 아닌 것은?',
                options: ['부당한 가격 인상', '거래 거절', '경쟁사업자 배제', '정상적인 가격 경쟁'],
                answer: 3,
                explanation: '정상적인 가격 경쟁은 시장지배적 지위 남용에 해당하지 않습니다.'
            },
            // 기타 - Hard
            {
                id: 'other_k_h_1',
                category: 'knowledge',
                difficulty: 'hard',
                industry: '기타',
                question: 'Agile HR에서 Sprint Review의 목적은?',
                options: ['성과 평가', '프로젝트 성과 검토 및 피드백', '급여 협상', '채용 면접'],
                answer: 1,
                explanation: 'Sprint Review는 짧은 주기로 프로젝트 성과를 검토하고 개선점을 도출합니다.'
            },
            {
                id: 'other_k_h_2',
                category: 'knowledge',
                difficulty: 'hard',
                industry: '기타',
                question: 'Balanced Scorecard의 4가지 관점이 아닌 것은?',
                options: ['재무', '고객', '내부 프로세스', '경쟁사'],
                answer: 3,
                explanation: 'BSC 4대 관점은 재무, 고객, 내부 프로세스, 학습 및 성장입니다.'
            }
        ]
    }
};

// Export to window for browser access
if (typeof window !== 'undefined') {
    window.industryJobData = industryJobData;
    window.positionLevels = positionLevels;
    window.experienceYears = experienceYears;
    window.companySizes = companySizes;
    window.kappQuestionBank = kappQuestionBank;
    
    // Application, Performance, Productivity 문항은 별도 파일에서 로드 후 통합
    // 로드 완료를 확인하는 함수
    window.mergeKappQuestions = function() {
        console.log('🔗 문항 통합 시작...');
        
        // Application 문항 통합
        if (window.applicationQuestions) {
            window.kappQuestionBank.application = window.applicationQuestions;
            console.log('✅ Application 문항 통합:', window.applicationQuestions.length);
        } else {
            console.warn('⚠️ applicationQuestions가 로드되지 않았습니다.');
            window.kappQuestionBank.application = [];
        }
        
        // Performance 문항 통합
        if (window.performanceQuestions) {
            window.kappQuestionBank.performance = window.performanceQuestions;
            console.log('✅ Performance 문항 통합:', window.performanceQuestions.length);
        } else {
            console.warn('⚠️ performanceQuestions가 로드되지 않았습니다.');
            window.kappQuestionBank.performance = [];
        }
        
        // Productivity 문항 통합
        if (window.productivityQuestions) {
            window.kappQuestionBank.productivity = window.productivityQuestions;
            console.log('✅ Productivity 문항 통합:', 
                (window.productivityQuestions.etraySimulations?.length || 0) + 
                (window.productivityQuestions.aiWorkflowSimulations?.length || 0));
        } else {
            console.warn('⚠️ productivityQuestions가 로드되지 않았습니다.');
            window.kappQuestionBank.productivity = { etraySimulations: [], aiWorkflowSimulations: [] };
        }
        
        console.log('✅ 전체 문항 통합 완료!');
        console.log('📊 최종 kappQuestionBank:', {
            knowledge: Object.keys(window.kappQuestionBank.knowledge).map(k => 
                `${k}: ${window.kappQuestionBank.knowledge[k].length}`
            ),
            application: window.kappQuestionBank.application?.length || 0,
            performance: window.kappQuestionBank.performance?.length || 0,
            productivity: {
                etray: window.kappQuestionBank.productivity?.etraySimulations?.length || 0,
                aiWorkflow: window.kappQuestionBank.productivity?.aiWorkflowSimulations?.length || 0
            }
        });
    };
}
