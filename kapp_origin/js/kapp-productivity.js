// KAPP Productivity Questions - Part 4
// E-tray 시뮬레이션 + AI 워크플로우 시뮬레이션 (산업별 마지막 문항)

const productivityQuestions = {
    // ========================================
    // E-tray 시뮬레이션 데이터 (10개 산업별)
    // ========================================
    etraySimulations: [
        // 1. IT 산업
        {
            id: 'it_etray',
            industry: 'IT',
            title: 'Backend 개발자의 하루 - 우선순위 관리',
            timeLimit: 600, // 10분
            emails: [
                {
                    id: 'it_e1',
                    from: 'CTO',
                    subject: '[긴급] 프로덕션 API 장애 발생',
                    priority: 'urgent',
                    content: '결제 API에서 500 에러 발생 중입니다. 고객 불만 급증. 즉시 확인 부탁드립니다.',
                    timestamp: '09:00',
                    correctAction: 'reply', // reply, forward, delete, later
                    points: 30
                },
                {
                    id: 'it_e2',
                    from: '팀장',
                    subject: '코드 리뷰 요청 (PR #342)',
                    priority: 'normal',
                    content: '어제 올린 PR에 대한 코드 리뷰 부탁드립니다. 내일 배포 예정입니다.',
                    timestamp: '09:05',
                    correctAction: 'later',
                    points: 15
                },
                {
                    id: 'it_e3',
                    from: '신입 개발자',
                    subject: 'Docker 설정 질문입니다',
                    priority: 'low',
                    content: '로컬 환경에서 Docker 컨테이너가 실행되지 않는데, 어떻게 해결하나요?',
                    timestamp: '09:10',
                    correctAction: 'forward', // 멘토에게 전달
                    points: 10
                },
                {
                    id: 'it_e4',
                    from: 'HR팀',
                    subject: '건강검진 일정 안내',
                    priority: 'low',
                    content: '2월 건강검진 예약이 오픈되었습니다. 원하시는 날짜를 선택해주세요.',
                    timestamp: '09:15',
                    correctAction: 'later',
                    points: 5
                },
                {
                    id: 'it_e5',
                    from: '고객사 담당자',
                    subject: 'API 문서 요청',
                    priority: 'normal',
                    content: '새로운 엔드포인트에 대한 API 문서를 공유해주실 수 있나요?',
                    timestamp: '09:20',
                    correctAction: 'reply',
                    points: 20
                }
            ]
        },

        // 2. 금융 산업
        {
            id: 'finance_etray',
            industry: '금융',
            title: '카드사 마케터의 하루 - 캠페인 관리',
            timeLimit: 600,
            emails: [
                {
                    id: 'fin_e1',
                    from: '본부장',
                    subject: '[긴급] 경쟁사 이벤트 대응 전략',
                    priority: 'urgent',
                    content: '경쟁사가 20대 타겟 대형 프로모션을 시작했습니다. 오늘 오후 회의 전 대응안 준비 부탁드립니다.',
                    timestamp: '10:00',
                    correctAction: 'reply',
                    points: 30
                },
                {
                    id: 'fin_e2',
                    from: '데이터 분석팀',
                    subject: '지난주 캠페인 성과 리포트',
                    priority: 'normal',
                    content: '첨부한 리포트 확인 후 피드백 부탁드립니다. (마감: 이번 주 금요일)',
                    timestamp: '10:05',
                    correctAction: 'later',
                    points: 15
                },
                {
                    id: 'fin_e3',
                    from: '제휴사 담당자',
                    subject: '프로모션 제안서',
                    priority: 'normal',
                    content: '편의점 업계 1위 기업과의 제휴 프로모션을 제안드립니다.',
                    timestamp: '10:10',
                    correctAction: 'reply',
                    points: 20
                },
                {
                    id: 'fin_e4',
                    from: '광고 대행사',
                    subject: '소재 승인 요청',
                    priority: 'high',
                    content: '내일 집행 예정인 SNS 광고 소재 최종 승인 부탁드립니다.',
                    timestamp: '10:15',
                    correctAction: 'reply',
                    points: 25
                },
                {
                    id: 'fin_e5',
                    from: '총무팀',
                    subject: '명함 재작성 신청 안내',
                    priority: 'low',
                    content: '명함이 부족하신 분은 신청서를 작성해주세요.',
                    timestamp: '10:20',
                    correctAction: 'delete',
                    points: 5
                }
            ]
        },

        // 3. 교육 산업
        {
            id: 'edu_etray',
            industry: '교육',
            title: '교육 콘텐츠 기획자의 하루',
            timeLimit: 600,
            emails: [
                {
                    id: 'edu_e1',
                    from: '학습자',
                    subject: '[불만] 강의 오류 신고',
                    priority: 'urgent',
                    content: '3강 동영상이 재생되지 않습니다. 수강 기한이 내일까지인데 빠른 조치 부탁드립니다.',
                    timestamp: '14:00',
                    correctAction: 'reply',
                    points: 30
                },
                {
                    id: 'edu_e2',
                    from: '강사',
                    subject: '강의 자료 업데이트 요청',
                    priority: 'normal',
                    content: '5강 내용 중 최신 트렌드로 업데이트가 필요한 부분이 있습니다.',
                    timestamp: '14:05',
                    correctAction: 'later',
                    points: 15
                },
                {
                    id: 'edu_e3',
                    from: '팀장',
                    subject: '신규 강의 기획안 검토',
                    priority: 'normal',
                    content: 'Python 고급 과정 기획안을 첨부합니다. 검토 후 의견 주세요.',
                    timestamp: '14:10',
                    correctAction: 'later',
                    points: 20
                },
                {
                    id: 'edu_e4',
                    from: 'IT팀',
                    subject: 'LMS 시스템 점검 안내',
                    priority: 'high',
                    content: '이번 주 토요일 새벽 2시~6시 LMS 시스템 점검이 있습니다. 학습자 공지 부탁드립니다.',
                    timestamp: '14:15',
                    correctAction: 'reply',
                    points: 25
                },
                {
                    id: 'edu_e5',
                    from: '마케팅팀',
                    subject: '강의 홍보 문구 협조 요청',
                    priority: 'low',
                    content: '신규 강의 홍보를 위한 매력적인 문구를 작성해주실 수 있나요?',
                    timestamp: '14:20',
                    correctAction: 'later',
                    points: 10
                }
            ]
        },

        // 4. 의료 산업
        {
            id: 'med_etray',
            industry: '의료',
            title: '의료 IT 담당자의 하루',
            timeLimit: 600,
            emails: [
                {
                    id: 'med_e1',
                    from: '응급실 수간호사',
                    subject: '[긴급] EMR 시스템 접속 불가',
                    priority: 'urgent',
                    content: '응급실에서 EMR에 접속이 안 됩니다. 환자 정보 확인이 급합니다!',
                    timestamp: '11:00',
                    correctAction: 'reply',
                    points: 35
                },
                {
                    id: 'med_e2',
                    from: '원무과',
                    subject: '보험 청구 시스템 오류',
                    priority: 'high',
                    content: '오늘 청구 마감인데 시스템에서 계속 오류가 발생합니다.',
                    timestamp: '11:05',
                    correctAction: 'reply',
                    points: 25
                },
                {
                    id: 'med_e3',
                    from: '의료정보팀장',
                    subject: '차세대 EMR 도입 회의 일정',
                    priority: 'normal',
                    content: '다음 주 화요일 오후 3시 회의 참석 가능하신가요?',
                    timestamp: '11:10',
                    correctAction: 'reply',
                    points: 15
                },
                {
                    id: 'med_e4',
                    from: '보안팀',
                    subject: '개인정보보호 교육 안내',
                    priority: 'normal',
                    content: '전 직원 대상 개인정보보호 온라인 교육이 오픈되었습니다.',
                    timestamp: '11:15',
                    correctAction: 'later',
                    points: 10
                },
                {
                    id: 'med_e5',
                    from: '제약회사 영업',
                    subject: '의료 IT 솔루션 제안',
                    priority: 'low',
                    content: '최신 의료 IT 솔루션을 소개하고 싶습니다. 미팅 가능하신가요?',
                    timestamp: '11:20',
                    correctAction: 'delete',
                    points: 5
                }
            ]
        },

        // 5. 제조 산업
        {
            id: 'mfg_etray',
            industry: '제조',
            title: '생산 관리자의 하루',
            timeLimit: 600,
            emails: [
                {
                    id: 'mfg_e1',
                    from: '현장 반장',
                    subject: '[긴급] 설비 고장 - 라인 중단',
                    priority: 'urgent',
                    content: 'A라인 프레스 설비가 고장났습니다. 긴급 수리 필요합니다.',
                    timestamp: '08:00',
                    correctAction: 'reply',
                    points: 35
                },
                {
                    id: 'mfg_e2',
                    from: '품질관리팀',
                    subject: '불량률 급증 보고',
                    priority: 'high',
                    content: 'B라인 제품 불량률이 3%로 급증했습니다. 원인 파악이 필요합니다.',
                    timestamp: '08:05',
                    correctAction: 'reply',
                    points: 30
                },
                {
                    id: 'mfg_e3',
                    from: '구매팀',
                    subject: '원자재 납기 지연 안내',
                    priority: 'normal',
                    content: '중국발 원자재가 1주일 지연될 예정입니다. 생산 일정 조정이 필요합니다.',
                    timestamp: '08:10',
                    correctAction: 'reply',
                    points: 20
                },
                {
                    id: 'mfg_e4',
                    from: '공장장',
                    subject: '월간 생산 실적 보고 요청',
                    priority: 'normal',
                    content: '이번 달 생산 실적 보고서를 금요일까지 제출해주세요.',
                    timestamp: '08:15',
                    correctAction: 'later',
                    points: 10
                },
                {
                    id: 'mfg_e5',
                    from: '안전관리팀',
                    subject: '안전교육 이수 현황',
                    priority: 'low',
                    content: '귀하의 팀원 중 2명이 안전교육을 미이수했습니다.',
                    timestamp: '08:20',
                    correctAction: 'later',
                    points: 5
                }
            ]
        },

        // 6. 유통/리테일
        {
            id: 'retail_etray',
            industry: '유통/리테일',
            title: 'E-커머스 운영자의 하루',
            timeLimit: 600,
            emails: [
                {
                    id: 'retail_e1',
                    from: '고객',
                    subject: '[긴급] 주문 취소 요청',
                    priority: 'urgent',
                    content: '30분 전 주문했는데 잘못 주문했습니다. 배송 전 취소 부탁드립니다! (주문번호: 123456)',
                    timestamp: '13:00',
                    correctAction: 'reply',
                    points: 30
                },
                {
                    id: 'retail_e2',
                    from: 'CS팀',
                    subject: '고객 불만 에스컬레이션',
                    priority: 'high',
                    content: '배송 지연으로 인한 고객 불만이 급증하고 있습니다. 물류팀과 협의 필요합니다.',
                    timestamp: '13:05',
                    correctAction: 'reply',
                    points: 25
                },
                {
                    id: 'retail_e3',
                    from: '마케팅팀',
                    subject: '주말 프로모션 기획',
                    priority: 'normal',
                    content: '이번 주말 프로모션 상품 추천 부탁드립니다.',
                    timestamp: '13:10',
                    correctAction: 'later',
                    points: 15
                },
                {
                    id: 'retail_e4',
                    from: 'IT팀',
                    subject: '사이트 속도 개선 완료',
                    priority: 'normal',
                    content: '페이지 로딩 속도를 3초 → 1초로 개선했습니다. 테스트 부탁드립니다.',
                    timestamp: '13:15',
                    correctAction: 'reply',
                    points: 20
                },
                {
                    id: 'retail_e5',
                    from: '제휴 브랜드',
                    subject: '신제품 입점 제안',
                    priority: 'low',
                    content: '저희 브랜드의 신제품을 귀사 몰에 입점하고 싶습니다.',
                    timestamp: '13:20',
                    correctAction: 'forward',
                    points: 10
                }
            ]
        },

        // 7. 마케팅/광고
        {
            id: 'mkt_etray',
            industry: '마케팅/광고',
            title: '퍼포먼스 마케터의 하루',
            timeLimit: 600,
            emails: [
                {
                    id: 'mkt_e1',
                    from: '대표이사',
                    subject: '[긴급] 광고비 급증 문의',
                    priority: 'urgent',
                    content: '이번 달 광고비가 예산 대비 50% 초과했습니다. 원인과 대응 방안을 오늘 중 보고해주세요.',
                    timestamp: '10:30',
                    correctAction: 'reply',
                    points: 35
                },
                {
                    id: 'mkt_e2',
                    from: '광고 플랫폼',
                    subject: '계정 정지 경고',
                    priority: 'urgent',
                    content: '귀하의 광고 계정이 정책 위반으로 정지 위험에 있습니다. 48시간 내 조치 필요.',
                    timestamp: '10:35',
                    correctAction: 'reply',
                    points: 30
                },
                {
                    id: 'mkt_e3',
                    from: '디자인팀',
                    subject: '광고 소재 시안',
                    priority: 'normal',
                    content: '이번 주 캠페인 소재 시안 3종을 첨부합니다. 피드백 부탁드립니다.',
                    timestamp: '10:40',
                    correctAction: 'later',
                    points: 15
                },
                {
                    id: 'mkt_e4',
                    from: '데이터 분석가',
                    subject: '실시간 캠페인 성과',
                    priority: 'high',
                    content: 'A 캠페인 ROAS가 150%로 하락 중입니다. 즉시 확인 부탁드립니다.',
                    timestamp: '10:45',
                    correctAction: 'reply',
                    points: 25
                },
                {
                    id: 'mkt_e5',
                    from: '인플루언서',
                    subject: '협업 제안',
                    priority: 'low',
                    content: '팔로워 10만 인플루언서입니다. 협업 관심 있으시면 연락주세요.',
                    timestamp: '10:50',
                    correctAction: 'later',
                    points: 10
                }
            ]
        },

        // 8. 호텔/관광
        {
            id: 'hotel_etray',
            industry: '호텔/관광',
            title: '호텔 프론트 매니저의 하루',
            timeLimit: 600,
            emails: [
                {
                    id: 'hotel_e1',
                    from: 'VIP 고객',
                    subject: '[긴급] 체크인 2시간 전 도착',
                    priority: 'urgent',
                    content: '예약 시간보다 2시간 일찍 도착합니다. 얼리 체크인 가능한가요? (Suite Room 예약)',
                    timestamp: '12:00',
                    correctAction: 'reply',
                    points: 30
                },
                {
                    id: 'hotel_e2',
                    from: '객실 팀장',
                    subject: '[긴급] 객실 청소 인력 부족',
                    priority: 'urgent',
                    content: '청소 직원 2명이 결근하여 체크인 준비가 지연되고 있습니다.',
                    timestamp: '12:05',
                    correctAction: 'reply',
                    points: 30
                },
                {
                    id: 'hotel_e3',
                    from: '고객',
                    subject: '객실 불편 사항',
                    priority: 'high',
                    content: '302호 에어컨이 작동하지 않습니다. 빠른 조치 부탁드립니다.',
                    timestamp: '12:10',
                    correctAction: 'forward', // 시설팀에 전달
                    points: 25
                },
                {
                    id: 'hotel_e4',
                    from: 'OTA 플랫폼',
                    subject: '주말 프로모션 참여 제안',
                    priority: 'normal',
                    content: '이번 주말 특가 프로모션에 참여하시겠습니까? (수수료 5% 할인)',
                    timestamp: '12:15',
                    correctAction: 'later',
                    points: 15
                },
                {
                    id: 'hotel_e5',
                    from: 'HR팀',
                    subject: '직원 교육 일정 안내',
                    priority: 'low',
                    content: '다음 달 서비스 교육 일정을 공유드립니다.',
                    timestamp: '12:20',
                    correctAction: 'later',
                    points: 5
                }
            ]
        },

        // 9. 법률/회계
        {
            id: 'legal_etray',
            industry: '법률/회계',
            title: '회계사의 하루',
            timeLimit: 600,
            emails: [
                {
                    id: 'legal_e1',
                    from: '고객사 CFO',
                    subject: '[긴급] 감사 보고서 수정 요청',
                    priority: 'urgent',
                    content: '감사 보고서에 중요한 수정 사항이 발견되었습니다. 오늘 중 재검토 부탁드립니다.',
                    timestamp: '15:00',
                    correctAction: 'reply',
                    points: 35
                },
                {
                    id: 'legal_e2',
                    from: '파트너',
                    subject: '신규 고객사 검토 회의',
                    priority: 'high',
                    content: '대형 상장사 감사 계약 건입니다. 내일 오전 회의 참석 부탁드립니다.',
                    timestamp: '15:05',
                    correctAction: 'reply',
                    points: 25
                },
                {
                    id: 'legal_e3',
                    from: '주니어 회계사',
                    subject: '재무제표 검토 질문',
                    priority: 'normal',
                    content: '이연법인세 회계처리에 대해 질문이 있습니다.',
                    timestamp: '15:10',
                    correctAction: 'later',
                    points: 15
                },
                {
                    id: 'legal_e4',
                    from: '협회',
                    subject: 'K-IFRS 개정안 세미나 안내',
                    priority: 'normal',
                    content: '다음 달 K-IFRS 개정안 세미나가 열립니다. 참석 신청하세요.',
                    timestamp: '15:15',
                    correctAction: 'later',
                    points: 10
                },
                {
                    id: 'legal_e5',
                    from: '소프트웨어 업체',
                    subject: '회계 자동화 솔루션 제안',
                    priority: 'low',
                    content: 'AI 기반 회계 자동화 솔루션을 소개하고 싶습니다.',
                    timestamp: '15:20',
                    correctAction: 'delete',
                    points: 5
                }
            ]
        },

        // 10. 기타 (HR)
        {
            id: 'other_etray',
            industry: '기타',
            title: 'HR 담당자의 하루',
            timeLimit: 600,
            emails: [
                {
                    id: 'other_e1',
                    from: '직원',
                    subject: '[긴급] 부당한 대우 신고',
                    priority: 'urgent',
                    content: '상사로부터 부당한 대우를 받고 있습니다. 긴급 상담을 요청합니다.',
                    timestamp: '16:00',
                    correctAction: 'reply',
                    points: 35
                },
                {
                    id: 'other_e2',
                    from: '팀장',
                    subject: '핵심 인재 퇴사 의향',
                    priority: 'urgent',
                    content: 'A팀 핵심 개발자가 퇴사 의향을 밝혔습니다. 면담이 필요합니다.',
                    timestamp: '16:05',
                    correctAction: 'reply',
                    points: 30
                },
                {
                    id: 'other_e3',
                    from: '대표이사',
                    subject: '2분기 채용 계획',
                    priority: 'high',
                    content: '2분기 채용 계획을 다음 주 월요일까지 보고해주세요.',
                    timestamp: '16:10',
                    correctAction: 'later',
                    points: 20
                },
                {
                    id: 'other_e4',
                    from: '헤드헌터',
                    subject: '우수 인재 추천',
                    priority: 'normal',
                    content: '귀사 포지션에 적합한 인재를 추천하고 싶습니다.',
                    timestamp: '16:15',
                    correctAction: 'later',
                    points: 10
                },
                {
                    id: 'other_e5',
                    from: '복리후생 업체',
                    subject: '헬스장 제휴 제안',
                    priority: 'low',
                    content: '직원 복리후생을 위한 헬스장 제휴를 제안드립니다.',
                    timestamp: '16:20',
                    correctAction: 'delete',
                    points: 5
                }
            ]
        }
    ],

    // ========================================
    // AI 워크플로우 시뮬레이션 (산업별 마지막 문항)
    // ========================================
    aiWorkflowSimulations: [
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
            timeLimit: 300, // 5분
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

        // 3. 교육 - AI 강의 콘텐츠 생성
        {
            id: 'edu_ai_workflow',
            category: 'productivity',
            industry: '교육',
            title: '🤖 AI 워크플로우: 강의 콘텐츠 자동 생성',
            task: `교육 콘텐츠 기획자인 당신은 매달 신규 강의 5개를 기획해야 합니다.

**현재 상황:**
- 강의 1개 기획 시간: 40시간 (커리큘럼 설계 + 스크립트 작성 + 실습 문제)
- 월 총 시간: 200시간
- 주요 작업: 트렌드 조사, 학습 목표 정의, 20강 스크립트, 실습 문제 100개

**AI 도구 선택지:**
A. ChatGPT (스크립트 초안 작성)
B. AI 강의 생성 플랫폼 (전체 워크플로우)
C. YouTube 영상 요약 AI
D. 수동 기획 유지

**과제:** 어떤 AI 워크플로우로 기획 시간을 60% 단축하고 학습 효과를 유지하겠습니까?`,
            timeLimit: 300,
            options: [
                {
                    id: 'edu_ai_a',
                    choice: 'A. ChatGPT 단독',
                    workflow: [
                        '1. ChatGPT에 스크립트 초안 요청',
                        '2. 수동으로 편집 및 실습 문제 작성'
                    ],
                    timeReduction: '35%',
                    qualityScore: 75,
                    automationLevel: 'low'
                },
                {
                    id: 'edu_ai_b',
                    choice: 'B. AI 강의 생성 플랫폼 (통합) ✅',
                    workflow: [
                        '1. AI가 산업 트렌드를 자동 분석 (웹 크롤링)',
                        '2. 학습 목표를 AI가 자동 생성',
                        '3. 20강 커리큘럼을 AI가 구조화',
                        '4. 각 강의 스크립트 초안을 AI가 작성',
                        '5. 실습 문제 100개를 난이도별로 자동 생성',
                        '6. 사람은 검토 및 브랜드 톤 조정'
                    ],
                    timeReduction: '70%',
                    qualityScore: 90,
                    automationLevel: 'high'
                },
                {
                    id: 'edu_ai_c',
                    choice: 'C. YouTube 요약 AI',
                    workflow: [
                        '1. YouTube 영상을 AI로 요약',
                        '2. 수동으로 커리큘럼 및 스크립트 작성'
                    ],
                    timeReduction: '20%',
                    qualityScore: 70,
                    automationLevel: 'very low'
                },
                {
                    id: 'edu_ai_d',
                    choice: 'D. 수동 기획',
                    workflow: [
                        '1. 모든 과정을 사람이 직접 기획'
                    ],
                    timeReduction: '0%',
                    qualityScore: 85,
                    automationLevel: 'none'
                }
            ],
            answer: 1, // B가 정답
            metrics: {
                '업무 가속도': '기획 시간 70% 단축',
                '품질 점수': '학습 효과 90점',
                '자동화 레벨': '트렌드 분석부터 문제 생성까지'
            },
            explanation: 'AI 플랫폼은 반복적인 콘텐츠 생성을 자동화하고, 사람은 브랜드 정체성과 학습 경험 설계에 집중할 수 있게 합니다.'
        },

        // 4. 의료 - AI 진단 보조 시스템
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

        // 5. 제조 - AI 설비 예지 보전
        {
            id: 'mfg_ai_workflow',
            category: 'productivity',
            industry: '제조',
            title: '🤖 AI 워크플로우: 설비 고장 예측',
            task: `생산 관리자인 당신은 설비 고장으로 인한 라인 중단을 최소화해야 합니다.

**현재 상황:**
- 월 평균 설비 고장: 8회
- 라인 중단 시간: 회당 4시간
- 총 손실: 월 32시간 (약 5,000만원 손실)
- 현재 방식: 주기적 점검 (사후 대응)

**AI 도구 선택지:**
A. Excel로 고장 기록 관리
B. AI 예지 보전 시스템 (IoT 센서 + AI)
C. CCTV 모니터링
D. 점검 주기 단축

**과제:** 어떤 AI 워크플로우로 고장을 70% 예방하고 비용을 절감하겠습니까?`,
            timeLimit: 300,
            options: [
                {
                    id: 'mfg_ai_a',
                    choice: 'A. Excel 기록',
                    workflow: [
                        '1. 고장 발생 후 Excel에 기록',
                        '2. 수동으로 패턴 분석'
                    ],
                    timeReduction: '10%',
                    qualityScore: 60,
                    automationLevel: 'very low'
                },
                {
                    id: 'mfg_ai_b',
                    choice: 'B. AI 예지 보전 시스템 ✅',
                    workflow: [
                        '1. 설비에 IoT 센서 설치 (온도, 진동, 전류)',
                        '2. AI가 실시간으로 센서 데이터 모니터링',
                        '3. 이상 징후 발견 시 자동 알림',
                        '4. 고장 예측 정확도 90%로 사전 정비',
                        '5. 정비 스케줄을 최적화'
                    ],
                    timeReduction: '75%',
                    qualityScore: 95,
                    automationLevel: 'high'
                },
                {
                    id: 'mfg_ai_c',
                    choice: 'C. CCTV 모니터링',
                    workflow: [
                        '1. 사람이 CCTV로 설비 관찰'
                    ],
                    timeReduction: '20%',
                    qualityScore: 65,
                    automationLevel: 'low'
                },
                {
                    id: 'mfg_ai_d',
                    choice: 'D. 점검 주기 단축',
                    workflow: [
                        '1. 월 1회 → 주 1회로 점검 증가'
                    ],
                    timeReduction: '30%',
                    qualityScore: 70,
                    automationLevel: 'none'
                }
            ],
            answer: 1, // B가 정답
            metrics: {
                '업무 가속도': '고장률 75% 감소',
                '비용 절감': '월 3,750만원 절감',
                '자동화 레벨': '실시간 모니터링 + 예측'
            },
            explanation: 'AI 예지 보전은 고장 전조를 미리 감지하여 계획된 정비를 가능하게 하고, 돌발 중단을 크게 줄입니다.'
        }

        // 6. 유통/리테일 - AI 재고 최적화
        {
            id: 'retail_ai_workflow',
            category: 'productivity',
            industry: '유통/리테일',
            title: '🤖 AI 워크플로우: 재고 수요 예측',
            task: `E-커머스 MD인 당신은 1,000개 SKU의 재고를 관리합니다. 과잉/부족 재고로 월 3,000만원 손실이 발생합니다.

**현재 상황:**
- 수동 발주 시간: 주 10시간
- 품절률: 12%
- 과잉 재고율: 18%
- 발주 근거: 과거 판매 데이터 + 직감

**AI 도구 선택지:**
A. Excel 재고 대장
B. AI 수요 예측 + 자동 발주 시스템
C. 재고 알림 앱
D. 수동 발주 유지`,
            timeLimit: 300,
            options: [
                {
                    id: 'retail_ai_a',
                    choice: 'A. Excel 재고 대장',
                    workflow: ['1. Excel로 수동 재고 관리', '2. 주간 발주 계획 작성'],
                    timeReduction: '10%',
                    qualityScore: 65,
                    automationLevel: 'very low'
                },
                {
                    id: 'retail_ai_b',
                    choice: 'B. AI 수요 예측 + 자동 발주 ✅',
                    workflow: [
                        '1. AI가 판매 데이터, 계절성, 트렌드를 분석',
                        '2. SKU별 수요를 정확히 예측 (정확도 92%)',
                        '3. 재고 수준에 따라 자동 발주 제안',
                        '4. 사람은 최종 승인만 클릭',
                        '5. 품절률 3%, 과잉 재고 5%로 감소'
                    ],
                    timeReduction: '80%',
                    qualityScore: 94,
                    automationLevel: 'high'
                },
                {
                    id: 'retail_ai_c',
                    choice: 'C. 재고 알림 앱',
                    workflow: ['1. 재고 부족 시 알림', '2. 수동 발주'],
                    timeReduction: '25%',
                    qualityScore: 70,
                    automationLevel: 'low'
                },
                {
                    id: 'retail_ai_d',
                    choice: 'D. 수동 발주',
                    workflow: ['1. 사람이 직접 판단 및 발주'],
                    timeReduction: '0%',
                    qualityScore: 75,
                    automationLevel: 'none'
                }
            ],
            answer: 1,
            metrics: {
                '업무 가속도': '발주 시간 80% 단축',
                '손실 감소': '월 2,400만원 절감 (80%)',
                '자동화 레벨': '수요 예측부터 발주까지'
            },
            explanation: 'AI 수요 예측은 복잡한 패턴을 분석하여 정확한 재고 수준을 유지하고, MD는 전략적 상품 기획에 집중할 수 있습니다.'
        },

        // 7. 마케팅/광고 - AI 캠페인 최적화
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
D. 수동 최적화 유지`,
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
        },

        // 8. 호텔/관광 - AI 수익 관리
        {
            id: 'hotel_ai_workflow',
            category: 'productivity',
            industry: '호텔/관광',
            title: '🤖 AI 워크플로우: 동적 가격 최적화',
            task: `호텔 수익 관리자인 당신은 매일 150개 객실의 가격을 조정해야 합니다.

**현재 상황:**
- 일일 가격 조정 시간: 2시간
- 현재 RevPAR: 150,000원
- 수동 방식: 경쟁사 가격 + 예약률 확인 후 조정

**AI 도구 선택지:**
A. Excel 가격표 관리
B. AI 수익 관리 시스템 (RMS)
C. 경쟁사 가격 크롤러
D. 수동 조정 유지`,
            timeLimit: 300,
            options: [
                {
                    id: 'hotel_ai_a',
                    choice: 'A. Excel 관리',
                    workflow: ['1. 경쟁사 가격 수동 입력', '2. Excel로 가격 계산'],
                    timeReduction: '10%',
                    qualityScore: 65,
                    automationLevel: 'very low'
                },
                {
                    id: 'hotel_ai_b',
                    choice: 'B. AI 수익 관리 시스템 ✅',
                    workflow: [
                        '1. AI가 경쟁사 가격을 실시간 크롤링',
                        '2. 수요 예측 (날씨, 이벤트, 계절 고려)',
                        '3. 객실 타입별 최적 가격 자동 산출',
                        '4. OTA/자사몰 채널별 차별화 가격 설정',
                        '5. 사람은 특별 이벤트만 수동 조정'
                    ],
                    timeReduction: '90%',
                    qualityScore: 96,
                    automationLevel: 'high'
                },
                {
                    id: 'hotel_ai_c',
                    choice: 'C. 가격 크롤러',
                    workflow: ['1. 크롤러로 경쟁사 가격 수집', '2. 수동 판단'],
                    timeReduction: '30%',
                    qualityScore: 72,
                    automationLevel: 'low'
                },
                {
                    id: 'hotel_ai_d',
                    choice: 'D. 수동 조정',
                    workflow: ['1. 사람이 직접 가격 결정'],
                    timeReduction: '0%',
                    qualityScore: 75,
                    automationLevel: 'none'
                }
            ],
            answer: 1,
            metrics: {
                '업무 가속도': '가격 조정 시간 90% 단축 (2시간 → 12분)',
                'RevPAR 증가': '150,000원 → 185,000원 (+23%)',
                '자동화 레벨': '실시간 모니터링 + 자동 가격 결정'
            },
            explanation: 'AI RMS는 수백 개 변수를 분석하여 최적 가격을 실시간으로 결정하고, 수익을 극대화합니다.'
        },

        // 9. 법률/회계 - AI 계약서 검토
        {
            id: 'legal_ai_workflow',
            category: 'productivity',
            industry: '법률/회계',
            title: '🤖 AI 워크플로우: 계약서 자동 검토',
            task: `법무팀 담당자인 당신은 월 200건의 계약서를 검토합니다. 건당 평균 2시간 소요됩니다.

**현재 상황:**
- 월 검토 시간: 400시간
- 주요 작업: 조항 검토, 리스크 분석, 수정 제안
- 리스크 발견율: 40%

**AI 도구 선택지:**
A. Word 검색 기능만 사용
B. AI 계약 검토 플랫폼 (LegalTech)
C. ChatGPT 조항 질의
D. 수동 검토 유지`,
            timeLimit: 300,
            options: [
                {
                    id: 'legal_ai_a',
                    choice: 'A. Word 검색',
                    workflow: ['1. Word 검색으로 키워드 확인', '2. 수동 검토'],
                    timeReduction: '10%',
                    qualityScore: 70,
                    automationLevel: 'very low'
                },
                {
                    id: 'legal_ai_b',
                    choice: 'B. AI 계약 검토 플랫폼 ✅',
                    workflow: [
                        '1. 계약서를 AI 플랫폼에 업로드',
                        '2. AI가 조항을 자동 분석 (누락, 모호성, 리스크)',
                        '3. 유사 판례 및 표준 조항 자동 검색',
                        '4. 리스크 조항을 하이라이트 + 수정 제안',
                        '5. 사람은 비즈니스 판단 및 협상 전략 수립'
                    ],
                    timeReduction: '75%',
                    qualityScore: 93,
                    automationLevel: 'high'
                },
                {
                    id: 'legal_ai_c',
                    choice: 'C. ChatGPT 질의',
                    workflow: ['1. 조항을 ChatGPT에 질의', '2. 수동 검토'],
                    timeReduction: '20%',
                    qualityScore: 72,
                    automationLevel: 'low'
                },
                {
                    id: 'legal_ai_d',
                    choice: 'D. 수동 검토',
                    workflow: ['1. 사람이 직접 전체 검토'],
                    timeReduction: '0%',
                    qualityScore: 85,
                    automationLevel: 'none'
                }
            ],
            answer: 1,
            metrics: {
                '업무 가속도': '검토 시간 75% 단축 (2시간 → 30분)',
                '리스크 발견율': '40% → 68% (AI 보조)',
                '자동화 레벨': '조항 분석부터 수정 제안까지'
            },
            explanation: 'AI LegalTech는 방대한 계약서를 빠르게 분석하고 리스크를 놓치지 않으며, 변호사는 전략적 판단에 집중할 수 있습니다.'
        },

        // 10. 기타(HR) - AI 채용 스크리닝
        {
            id: 'other_ai_workflow',
            category: 'productivity',
            industry: '기타',
            title: '🤖 AI 워크플로우: 채용 서류 자동 스크리닝',
            task: `HR 담당자인 당신은 월 500명의 지원서를 검토합니다. 건당 평균 15분 소요됩니다.

**현재 상황:**
- 월 서류 검토 시간: 125시간
- 주요 작업: 이력서 검토, 적합도 판단, 면접 대상 선정
- 면접 후 채용률: 20% (낮은 정확도)

**AI 도구 선택지:**
A. Excel 점수표
B. AI 채용 플랫폼 (ATS + AI)
C. 이력서 키워드 검색
D. 수동 검토 유지`,
            timeLimit: 300,
            options: [
                {
                    id: 'other_ai_a',
                    choice: 'A. Excel 점수표',
                    workflow: ['1. Excel에 점수 수동 입력', '2. 정렬 후 선발'],
                    timeReduction: '15%',
                    qualityScore: 65,
                    automationLevel: 'very low'
                },
                {
                    id: 'other_ai_b',
                    choice: 'B. AI 채용 플랫폼 ✅',
                    workflow: [
                        '1. 지원서가 자동으로 AI 시스템에 입력',
                        '2. AI가 이력서를 분석 (경력, 스킬, 프로젝트)',
                        '3. JD(직무 기술서)와 적합도를 자동 스코어링',
                        '4. 상위 20% 후보를 자동 추천',
                        '5. 사람은 최종 면접 대상만 선정'
                    ],
                    timeReduction: '80%',
                    qualityScore: 92,
                    automationLevel: 'high'
                },
                {
                    id: 'other_ai_c',
                    choice: 'C. 키워드 검색',
                    workflow: ['1. 이력서에서 키워드 검색', '2. 수동 판단'],
                    timeReduction: '25%',
                    qualityScore: 68,
                    automationLevel: 'low'
                },
                {
                    id: 'other_ai_d',
                    choice: 'D. 수동 검토',
                    workflow: ['1. 사람이 직접 전체 검토'],
                    timeReduction: '0%',
                    qualityScore: 75,
                    automationLevel: 'none'
                }
            ],
            answer: 1,
            metrics: {
                '업무 가속도': '검토 시간 80% 단축 (125시간 → 25시간)',
                '채용 정확도': '면접 후 채용률 20% → 45%',
                '자동화 레벨': '지원서 입수부터 추천까지'
            },
            explanation: 'AI ATS는 대량의 지원서를 객관적으로 평가하고, HR은 후보자와의 인터뷰와 문화 적합성 판단에 집중할 수 있습니다.'
        }
    ]
};

// Export to window
if (typeof window !== 'undefined') {
    window.productivityQuestions = productivityQuestions;
    console.log('✅ Productivity Questions Loaded:', 
        `E-tray: ${productivityQuestions.etraySimulations.length}, ` +
        `AI Workflow: ${productivityQuestions.aiWorkflowSimulations.length}`
    );
}
