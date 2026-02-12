/**
 * KAPP E-tray Simulation - Industry-Specific Email Scenarios
 * Version: 5.1.0
 * 
 * 산업별 맞춤형 디지털 인바스켓 시뮬레이션
 * - IT: 서버 장애, 배포, 보안 이슈
 * - 금융: 리스크 관리, 규제 대응, 고객 클레임
 * - 의료: 환자 안전, 의료 사고, 응급 상황
 * - 마케팅: 캠페인 위기, 브랜드 이슈, 미디어 대응
 */

const etrayByIndustry = {
    // ========================================
    // IT 산업 - E-tray
    // ========================================
    'IT': [
        {
            id: 'it_e1',
            sender: '이CTO (최고기술책임자)',
            subject: '[🚨긴급] 프로덕션 서버 CPU 사용률 95% 초과',
            time: '5분 전',
            priority: 'critical',
            body: `프로덕션 서버 3대 중 2대의 CPU 사용률이 95%를 초과했습니다.
            
현재 상황:
- 서버 A: CPU 97%, Memory 82%
- 서버 B: CPU 96%, Memory 78%
- 서버 C: CPU 45%, Memory 60% (정상)
- 사용자 응답 시간: 평균 3.2초 (목표: 0.5초 이하)

모니터링팀에서 트래픽 급증은 아니라고 보고했습니다.
즉시 원인 파악 및 대응 부탁드립니다.

고객사에서 이미 불만 전화가 들어오기 시작했습니다.`,
            unread: true,
            expectedActions: ['reply', 'forward'],
            urgency: 10,
            businessImpact: 'critical'
        },
        {
            id: 'it_e2',
            sender: '박팀장 (DevOps)',
            subject: '금일 배포 계획 승인 요청',
            time: '30분 전',
            priority: 'high',
            body: `오늘 오후 6시 배포 예정인 v2.3.1 릴리즈에 대한 최종 승인을 요청드립니다.

배포 내용:
✅ 사용자 프로필 편집 기능 개선
✅ 결제 모듈 버그 수정 (긴급)
✅ 대시보드 성능 최적화
⚠️ 데이터베이스 스키마 변경 포함

예상 다운타임: 약 15분
배포 담당자: 김대리, 최주임
롤백 계획: 준비 완료

승인 부탁드립니다.`,
            unread: true,
            expectedActions: ['reply'],
            urgency: 8,
            businessImpact: 'high'
        },
        {
            id: 'it_e3',
            sender: '정보보안팀 김과장',
            subject: '[보안] 의심 계정 로그인 시도 탐지',
            time: '1시간 전',
            priority: 'high',
            body: `보안 모니터링 중 의심스러운 로그인 시도가 탐지되었습니다.

탐지 내용:
- 계정: admin@company.com
- 시도 횟수: 127회 (지난 10분간)
- IP 주소: 203.142.xxx.xxx (중국)
- 시도 패턴: Brute Force 공격으로 추정

현재 조치:
✅ 해당 IP 차단 완료
✅ 계정 임시 잠금 처리

추가 대응이 필요한지 검토 부탁드립니다.`,
            unread: true,
            expectedActions: ['reply', 'defer'],
            urgency: 7,
            businessImpact: 'high'
        },
        {
            id: 'it_e4',
            sender: '신입 개발자 이주임',
            subject: 'Git 브랜치 전략 문의',
            time: '2시간 전',
            priority: 'low',
            body: `안녕하세요 선배님,

Git 브랜치 전략에 대해 궁금한 점이 있어 문의드립니다.

- feature 브랜치는 develop에서 따야 하나요?
- hotfix는 어떻게 처리하나요?
- PR 리뷰는 누구에게 요청해야 하나요?

시간 되실 때 답변 부탁드립니다!`,
            unread: true,
            expectedActions: ['defer', 'delegate'],
            urgency: 3,
            businessImpact: 'low'
        },
        {
            id: 'it_e5',
            sender: '인사팀',
            subject: '[공지] 개발팀 워크샵 일정 안내',
            time: '4시간 전',
            priority: 'low',
            body: `다음 달 개발팀 워크샵 일정을 안내드립니다.

일시: 3월 15일 (금) 14:00 ~ 18:00
장소: 제주 테크파크
주제: 클라우드 네이티브 아키텍처

참석 여부는 다음 주까지 회신 부탁드립니다.`,
            unread: true,
            expectedActions: ['read', 'delete'],
            urgency: 1,
            businessImpact: 'none'
        }
    ],

    // ========================================
    // 금융 산업 - E-tray
    // ========================================
    '금융': [
        {
            id: 'fin_e1',
            sender: '리스크관리본부장',
            subject: '[긴급] 대출 연체율 급증 - 즉시 대응 필요',
            time: '10분 전',
            priority: 'critical',
            body: `이번 주 개인신용대출 연체율이 전주 대비 2.3%p 급증했습니다.

주요 지표:
- 현재 연체율: 5.8% (전주: 3.5%)
- 연체 건수: 1,247건 (전주: 782건)
- 연체 금액: 약 380억원 (전주: 210억원)
- 주요 연체 업종: 자영업자, 프리랜서

원인 분석:
⚠️ 경기 침체 영향
⚠️ 특정 업종 집중 여신
⚠️ 심사 기준 완화 후유증 가능

금융감독원 보고 및 대응 방안 마련이 시급합니다.
오늘 오후 3시 긴급 회의 소집하겠습니다.`,
            unread: true,
            expectedActions: ['reply', 'forward'],
            urgency: 10,
            businessImpact: 'critical'
        },
        {
            id: 'fin_e2',
            sender: '준법감시팀 최차장',
            subject: '[규제] 금융당국 현장 검사 통보',
            time: '1시간 전',
            priority: 'high',
            body: `금융감독원으로부터 다음 주 현장 검사 통보를 받았습니다.

검사 내용:
📋 개인정보 보호 실태
📋 여신 심사 적정성
📋 내부통제 시스템
📋 자금세탁방지(AML) 준수 여부

검사 일정: 3월 10일 (월) ~ 3월 14일 (금)
검사 인원: 5명

관련 부서별 자료 준비가 필요합니다.
내일 오전 준비 회의 소집 예정입니다.`,
            unread: true,
            expectedActions: ['reply', 'forward'],
            urgency: 8,
            businessImpact: 'high'
        },
        {
            id: 'fin_e3',
            sender: '고객센터 팀장',
            subject: '[고객 클레임] VIP 고객 금리 인상 항의',
            time: '2시간 전',
            priority: 'high',
            body: `VIP 고객 김○○ 님으로부터 강력한 항의를 받았습니다.

클레임 내용:
- 10년 이상 거래 고객 (예금 잔액 5억)
- 대출 금리 3.5% → 4.2%로 인상 통보
- 사전 안내 없이 일방적 통보 불만
- "다른 은행으로 옮기겠다" 경고

고객 요구사항:
✅ 금리 인상 철회 또는 완화
✅ 담당 임원 사과
✅ VIP 서비스 개선

고객 이탈 가능성이 높습니다. 대응 방안 협의 필요합니다.`,
            unread: true,
            expectedActions: ['reply', 'forward'],
            urgency: 7,
            businessImpact: 'high'
        },
        {
            id: 'fin_e4',
            sender: '신입 행원 박주임',
            subject: '여신 심사 프로세스 질문',
            time: '3시간 전',
            priority: 'low',
            body: `선배님, 여신 심사 시 DTI 계산 방법에 대해 궁금한 점이 있습니다.

- 소득 증빙 서류는 어디까지 인정되나요?
- 프리랜서는 어떻게 평가하나요?
- 신용등급 기준은 어떻게 되나요?

시간 되실 때 조언 부탁드립니다!`,
            unread: true,
            expectedActions: ['defer', 'delegate'],
            urgency: 3,
            businessImpact: 'low'
        },
        {
            id: 'fin_e5',
            sender: '총무팀',
            subject: '[안내] 금융권 공동 세미나 초청',
            time: '5시간 전',
            priority: 'low',
            body: `금융권 리스크 관리 세미나에 초청되었습니다.

일시: 3월 20일 (목) 14:00
장소: 여의도 금융연수원
주제: 디지털 금융 시대의 리스크 관리

참석 희망 시 이번 주 내로 회신 부탁드립니다.`,
            unread: true,
            expectedActions: ['read', 'delete'],
            urgency: 1,
            businessImpact: 'none'
        }
    ],

    // ========================================
    // 의료 산업 - E-tray
    // ========================================
    '의료': [
        {
            id: 'med_e1',
            sender: '응급실 수간호사',
            subject: '[🚨응급] 중환자실 만상 - 응급 환자 입원 불가',
            time: '3분 전',
            priority: 'critical',
            body: `응급실에 심정지 환자가 이송되었으나 중환자실 만상으로 입원이 불가능합니다.

현재 상황:
🏥 중환자실: 20병상 전체 만상
🏥 일반 병상: 입원 대기 30명
🏥 응급실: 심정지 환자 외 중증 2명 대기

환자 정보:
- 남성, 72세, 심근경색 의심
- 심폐소생술 시행 중
- 가족: 즉시 입원 강력 요구
- 상태: 불안정, 집중 치료 필수

타병원 전원 또는 임시 병상 마련이 필요합니다.
즉시 결정이 필요합니다!`,
            unread: true,
            expectedActions: ['reply', 'forward'],
            urgency: 10,
            businessImpact: 'critical'
        },
        {
            id: 'med_e2',
            sender: '의료안전팀 김과장',
            subject: '[긴급] 수술실 의료기기 오작동 보고',
            time: '20분 전',
            priority: 'high',
            body: `3번 수술실 마취기에서 오작동이 발생했습니다.

발생 경위:
- 시간: 오전 9시 30분
- 장비: 마취기 Model X-300
- 증상: 산소 농도 측정 오류
- 조치: 수술 중단, 백업 장비로 교체

다행히 환자에게는 영향 없었으나, 동일 모델 3대가 더 있습니다.

대응 필요사항:
⚠️ 전체 마취기 긴급 점검
⚠️ 제조사 기술자 긴급 출동
⚠️ 의료기기 안전성 평가
⚠️ 오늘 예정된 수술 3건 일정 조율

보건복지부 보고 여부도 검토가 필요합니다.`,
            unread: true,
            expectedActions: ['reply', 'forward'],
            urgency: 9,
            businessImpact: 'high'
        },
        {
            id: 'med_e3',
            sender: '외래진료 코디네이터',
            subject: '[환자 클레임] 진료 대기 시간 과다 불만',
            time: '1시간 전',
            priority: 'medium',
            body: `외래 환자로부터 진료 대기 시간에 대한 강력한 불만이 제기되었습니다.

환자 불만 내용:
- 예약 시간: 오전 10시
- 실제 진료 시간: 오후 12시 30분
- 대기 시간: 2시간 30분
- 환자 상태: 당뇨 합병증 정기 검진

환자 주장:
"예약 시스템이 무슨 의미가 있나요?"
"노인이 2시간 넘게 기다리게 하는 게 말이 됩니까?"

개선 방안 검토가 필요합니다.`,
            unread: true,
            expectedActions: ['reply', 'defer'],
            urgency: 6,
            businessImpact: 'medium'
        },
        {
            id: 'med_e4',
            sender: '신입 간호사 이주임',
            subject: '전자의무기록 시스템 사용법 질문',
            time: '3시간 전',
            priority: 'low',
            body: `선배님, EMR 시스템 사용 중 궁금한 점이 있습니다.

- 간호 기록 수정은 어떻게 하나요?
- 투약 기록 입력 순서가 헷갈려요
- 환자 알레르기 정보는 어디서 확인하나요?

시간 되실 때 알려주세요!`,
            unread: true,
            expectedActions: ['defer', 'delegate'],
            urgency: 3,
            businessImpact: 'low'
        },
        {
            id: 'med_e5',
            sender: '병원 홍보팀',
            subject: '[안내] 건강검진 캠페인 안내',
            time: '5시간 전',
            priority: 'low',
            body: `3월 건강검진 캠페인을 시작합니다.

기간: 3월 1일 ~ 3월 31일
대상: 40세 이상 성인
할인: 종합검진 20% 할인

홍보 협조 부탁드립니다.`,
            unread: true,
            expectedActions: ['read', 'delete'],
            urgency: 1,
            businessImpact: 'none'
        }
    ],

    // ========================================
    // 마케팅/광고 산업 - E-tray
    // ========================================
    '마케팅/광고': [
        {
            id: 'mkt_e1',
            sender: 'SNS 모니터링팀 팀장',
            subject: '[🚨위기] 브랜드 이미지 훼손 게시물 확산',
            time: '5분 전',
            priority: 'critical',
            body: `소셜미디어에서 우리 브랜드를 비방하는 게시물이 급속도로 확산되고 있습니다.

현재 상황:
📈 조회수: 1,200만 (지난 2시간)
📈 공유: 32,000회
📈 댓글: 8,500개 (대부분 부정적)
📈 관련 해시태그: #불매운동 트렌딩

게시물 내용:
"○○브랜드가 환경 파괴에 앞장서고 있다"
"과대광고로 소비자를 기만했다"
+ 조작된 이미지 첨부

언론사 2곳에서 이미 취재 요청이 들어왔습니다.
즉각적인 위기 대응이 필요합니다!

PR팀, 법무팀과 긴급 회의가 필요합니다.`,
            unread: true,
            expectedActions: ['reply', 'forward'],
            urgency: 10,
            businessImpact: 'critical'
        },
        {
            id: 'mkt_e2',
            sender: '퍼포먼스 마케팅팀 박차장',
            subject: '[긴급] 광고 캠페인 성과 급락 - 예산 재조정 필요',
            time: '30분 전',
            priority: 'high',
            body: `진행 중인 디지털 광고 캠페인 성과가 목표 대비 크게 미달하고 있습니다.

성과 지표 (지난 1주일):
📉 CTR: 0.8% (목표: 2.5%)
📉 전환율: 1.2% (목표: 3.0%)
📉 CPA: 58,000원 (목표: 25,000원)
📉 ROAS: 120% (목표: 300%)

소진 예산: 1.2억 / 총 예산 3억

원인 분석:
⚠️ 타겟팅 오류 가능성
⚠️ 크리에이티브 반응 저조
⚠️ 경쟁사 공격적 마케팅

예산 재배치 또는 캠페인 중단 검토가 필요합니다.
오늘 중 결정이 필요합니다.`,
            unread: true,
            expectedActions: ['reply', 'forward'],
            urgency: 8,
            businessImpact: 'high'
        },
        {
            id: 'mkt_e3',
            sender: '콘텐츠 마케팅팀 최대리',
            subject: '신규 캠페인 콘셉트 승인 요청',
            time: '2시간 전',
            priority: 'medium',
            body: `3월 론칭 예정인 신규 캠페인 콘셉트를 공유드립니다.

캠페인 개요:
🎯 타겟: MZ세대 (20~35세)
🎯 메시지: "진짜 나를 찾아서"
🎯 채널: 인스타그램, 유튜브, 틱톡
🎯 예산: 5,000만원
🎯 기간: 3월 ~ 4월 (8주)

크리에이티브:
- 인플루언서 협업 (팔로워 50만 이상 3명)
- 숏폼 콘텐츠 30편
- 인터랙티브 이벤트

다음 주 월요일까지 승인 부탁드립니다.`,
            unread: true,
            expectedActions: ['reply', 'defer'],
            urgency: 6,
            businessImpact: 'medium'
        },
        {
            id: 'mkt_e4',
            sender: '인턴 김주임',
            subject: '마케팅 리포트 작성 가이드 요청',
            time: '3시간 전',
            priority: 'low',
            body: `선배님, 주간 마케팅 리포트 작성 시 궁금한 점이 있습니다.

- 어떤 지표를 중점적으로 봐야 하나요?
- 데이터는 어디서 추출하나요?
- 보고서 양식이 따로 있나요?

시간 되실 때 알려주세요!`,
            unread: true,
            expectedActions: ['defer', 'delegate'],
            urgency: 3,
            businessImpact: 'low'
        },
        {
            id: 'mkt_e5',
            sender: '인사팀',
            subject: '[공지] 마케팅 트렌드 세미나 안내',
            time: '5시간 전',
            priority: 'low',
            body: `2025 마케팅 트렌드 세미나에 초청되었습니다.

일시: 3월 18일 (화) 14:00
장소: 코엑스 3층
주제: AI 시대의 마케팅 전략

참석 희망 시 회신 부탁드립니다.`,
            unread: true,
            expectedActions: ['read', 'delete'],
            urgency: 1,
            businessImpact: 'none'
        }
    ]
};

// Export to window object for browser access
if (typeof window !== 'undefined') {
    window.etrayByIndustry = etrayByIndustry;
    console.log('✅ E-tray Industry Data Loaded:', Object.keys(etrayByIndustry));
}
