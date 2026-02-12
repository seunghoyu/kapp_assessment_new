/**
 * 산업군별 커리어 경로 데이터
 * v5.2.0 - 학습자 관점의 커리어 성장 시뮬레이터
 */

window.careerPathByIndustry = {
    'IT': {
        paths: [
            {
                current: {
                    role: '주니어 개발자',
                    skills: ['JavaScript', 'React', 'Git']
                },
                milestone1: {
                    year: '1.5년 후',
                    role: '시니어 개발자',
                    skills: ['TypeScript', 'Node.js', '시스템 설계'],
                    probability: 82
                },
                milestone2: {
                    year: '3년 후',
                    role: '테크 리드 / 솔루션 아키텍트',
                    skills: ['마이크로서비스', '클라우드 인프라', '팀 리더십'],
                    probability: 68
                }
            },
            {
                current: {
                    role: '데이터 엔지니어',
                    skills: ['Python', 'SQL', 'ETL']
                },
                milestone1: {
                    year: '1.5년 후',
                    role: '시니어 데이터 엔지니어',
                    skills: ['Spark', 'Kafka', '데이터 파이프라인'],
                    probability: 78
                },
                milestone2: {
                    year: '3년 후',
                    role: '데이터 아키텍트 / ML 엔지니어',
                    skills: ['MLOps', '실시간 처리', '데이터 거버넌스'],
                    probability: 65
                }
            }
        ],
        learningPath: [
            { title: '고급 시스템 설계 패턴', duration: '3개월', priority: '높음' },
            { title: 'AWS/Azure 클라우드 마스터리', duration: '2개월', priority: '높음' },
            { title: '테크 리더십 & 코드 리뷰', duration: '1개월', priority: '중간' }
        ]
    },
    
    '금융': {
        paths: [
            {
                current: {
                    role: '금융 데이터 애널리스트',
                    skills: ['Excel', 'SQL', '재무분석']
                },
                milestone1: {
                    year: '1.5년 후',
                    role: '리스크 애널리스트',
                    skills: ['통계 모델링', 'VaR', '리스크 관리'],
                    probability: 75
                },
                milestone2: {
                    year: '3년 후',
                    role: '퀀트 애널리스트 / 전략 매니저',
                    skills: ['파생상품 모델링', '알고리즘 트레이딩', '전략 기획'],
                    probability: 62
                }
            },
            {
                current: {
                    role: '은행 PB (Private Banker)',
                    skills: ['자산관리', '고객 상담', '금융상품']
                },
                milestone1: {
                    year: '1.5년 후',
                    role: '시니어 PB / 팀 리더',
                    skills: ['포트폴리오 구성', '세무 전략', '상속 설계'],
                    probability: 80
                },
                milestone2: {
                    year: '3년 후',
                    role: 'Wealth Manager / VP',
                    skills: ['대형 자산가 관리', '글로벌 자산배분', '팀 관리'],
                    probability: 70
                }
            }
        ],
        learningPath: [
            { title: '금융 리스크 관리 실무', duration: '3개월', priority: '높음' },
            { title: '파이썬 금융 데이터 분석', duration: '2개월', priority: '높음' },
            { title: '퀀트 전략 & 알고리즘 트레이딩', duration: '4개월', priority: '중간' }
        ]
    },
    
    '의료': {
        paths: [
            {
                current: {
                    role: '의료 데이터 애널리스트',
                    skills: ['의료 통계', 'EMR 분석', 'SQL']
                },
                milestone1: {
                    year: '1.5년 후',
                    role: '헬스케어 데이터 사이언티스트',
                    skills: ['임상 데이터 분석', '바이오통계', 'R/Python'],
                    probability: 77
                },
                milestone2: {
                    year: '3년 후',
                    role: '의료 AI 연구원 / 헬스테크 PM',
                    skills: ['의료 AI 모델', '임상시험 설계', '의료 서비스 기획'],
                    probability: 64
                }
            },
            {
                current: {
                    role: '병원 행정 관리자',
                    skills: ['병원 운영', '의료 법규', '인사 관리']
                },
                milestone1: {
                    year: '1.5년 후',
                    role: '의료 서비스 기획 매니저',
                    skills: ['의료 품질 관리', '환자 경험 설계', '프로세스 개선'],
                    probability: 73
                },
                milestone2: {
                    year: '3년 후',
                    role: '헬스케어 전략 디렉터',
                    skills: ['의료 사업 기획', '디지털 헬스', '병원 혁신'],
                    probability: 60
                }
            }
        ],
        learningPath: [
            { title: '의료 데이터 분석 & AI 활용', duration: '4개월', priority: '높음' },
            { title: '임상시험 통계 및 바이오통계', duration: '3개월', priority: '높음' },
            { title: '헬스케어 서비스 디자인', duration: '2개월', priority: '중간' }
        ]
    },
    
    '마케팅/광고': {
        paths: [
            {
                current: {
                    role: '디지털 마케터',
                    skills: ['SNS 광고', 'Google Ads', '콘텐츠 제작']
                },
                milestone1: {
                    year: '1.5년 후',
                    role: '퍼포먼스 마케팅 매니저',
                    skills: ['데이터 분석', 'A/B 테스트', 'CRM 마케팅'],
                    probability: 81
                },
                milestone2: {
                    year: '3년 후',
                    role: '그로스 해킹 리드 / CMO',
                    skills: ['전략 마케팅', '제품 성장 전략', '팀 리더십'],
                    probability: 69
                }
            },
            {
                current: {
                    role: '브랜드 매니저',
                    skills: ['브랜드 전략', '캠페인 기획', '트렌드 분석']
                },
                milestone1: {
                    year: '1.5년 후',
                    role: '시니어 브랜드 매니저',
                    skills: ['통합 마케팅', '글로벌 브랜딩', '예산 관리'],
                    probability: 76
                },
                milestone2: {
                    year: '3년 후',
                    role: '마케팅 디렉터 / 사업 기획',
                    skills: ['브랜드 포트폴리오', '사업 전략', '조직 관리'],
                    probability: 63
                }
            }
        ],
        learningPath: [
            { title: '데이터 기반 마케팅 전략', duration: '2개월', priority: '높음' },
            { title: '그로스 해킹 & A/B 테스트', duration: '3개월', priority: '높음' },
            { title: 'AI 마케팅 자동화 실무', duration: '2개월', priority: '중간' }
        ]
    },
    
    // 기타 산업군 (기본 패스)
    '교육': {
        paths: [
            {
                current: {
                    role: '교육 기획자',
                    skills: ['커리큘럼 설계', '교육 운영', '강의 평가']
                },
                milestone1: {
                    year: '1.5년 후',
                    role: '시니어 교육 기획자',
                    skills: ['교육 전략', '디지털 콘텐츠', '성과 분석'],
                    probability: 79
                },
                milestone2: {
                    year: '3년 후',
                    role: '교육 컨설턴트 / HRD 매니저',
                    skills: ['조직 진단', 'HRD 전략', '변화 관리'],
                    probability: 66
                }
            }
        ],
        learningPath: [
            { title: 'AI 기반 맞춤형 교육 설계', duration: '3개월', priority: '높음' },
            { title: '데이터 기반 교육 성과 분석', duration: '2개월', priority: '중간' }
        ]
    },
    
    '제조': {
        paths: [
            {
                current: {
                    role: '생산 관리자',
                    skills: ['공정 관리', '품질 관리', '생산 계획']
                },
                milestone1: {
                    year: '1.5년 후',
                    role: '스마트 팩토리 매니저',
                    skills: ['IoT 센서', '데이터 분석', 'MES 시스템'],
                    probability: 74
                },
                milestone2: {
                    year: '3년 후',
                    role: '생산 혁신 디렉터',
                    skills: ['AI 예지보전', '공장 자동화', '공급망 최적화'],
                    probability: 61
                }
            }
        ],
        learningPath: [
            { title: '스마트 팩토리 구축 실무', duration: '4개월', priority: '높음' },
            { title: 'AI 예지보전 & 품질관리', duration: '3개월', priority: '중간' }
        ]
    },
    
    '유통/리테일': {
        paths: [
            {
                current: {
                    role: 'MD (상품 기획자)',
                    skills: ['상품 선정', '재고 관리', '트렌드 분석']
                },
                milestone1: {
                    year: '1.5년 후',
                    role: '시니어 MD / 바이어',
                    skills: ['데이터 기반 MD', '가격 전략', '브랜드 협업'],
                    probability: 77
                },
                milestone2: {
                    year: '3년 후',
                    role: 'Omni-channel 전략가',
                    skills: ['온오프 통합', '고객 경험', 'AI 추천 시스템'],
                    probability: 65
                }
            }
        ],
        learningPath: [
            { title: '데이터 기반 상품 기획', duration: '2개월', priority: '높음' },
            { title: 'AI 고객 분석 & 추천 시스템', duration: '3개월', priority: '중간' }
        ]
    },
    
    '호텔/관광': {
        paths: [
            {
                current: {
                    role: '호텔 매니저',
                    skills: ['객실 운영', '고객 서비스', '수익 관리']
                },
                milestone1: {
                    year: '1.5년 후',
                    role: 'Revenue Manager',
                    skills: ['가격 최적화', '데이터 분석', '예약 전략'],
                    probability: 76
                },
                milestone2: {
                    year: '3년 후',
                    role: 'Hospitality 전략 디렉터',
                    skills: ['사업 기획', '고객 경험 설계', '글로벌 확장'],
                    probability: 63
                }
            }
        ],
        learningPath: [
            { title: 'AI 가격 최적화 & Revenue Management', duration: '3개월', priority: '높음' },
            { title: '고객 경험 데이터 분석', duration: '2개월', priority: '중간' }
        ]
    },
    
    '법률/회계': {
        paths: [
            {
                current: {
                    role: '회계사 / 세무사',
                    skills: ['재무제표', '세무 신고', '감사 업무']
                },
                milestone1: {
                    year: '1.5년 후',
                    role: '시니어 회계사 / 컨설턴트',
                    skills: ['M&A 실사', '재무 전략', '세무 기획'],
                    probability: 75
                },
                milestone2: {
                    year: '3년 후',
                    role: 'CFO / 재무 전략 책임자',
                    skills: ['기업 재무 전략', 'IR 관리', 'ESG 경영'],
                    probability: 60
                }
            }
        ],
        learningPath: [
            { title: 'AI 회계 자동화 & 데이터 분석', duration: '3개월', priority: '높음' },
            { title: '재무 전략 & M&A 실무', duration: '4개월', priority: '중간' }
        ]
    },
    
    '기타': {
        paths: [
            {
                current: {
                    role: '주니어 직원',
                    skills: ['업무 기초', '협업', '문서 작성']
                },
                milestone1: {
                    year: '1.5년 후',
                    role: '시니어 직원 / 전문가',
                    skills: ['프로젝트 관리', '데이터 분석', '문제 해결'],
                    probability: 78
                },
                milestone2: {
                    year: '3년 후',
                    role: '팀 리더 / 매니저',
                    skills: ['전략 수립', '팀 리더십', '비즈니스 분석'],
                    probability: 64
                }
            }
        ],
        learningPath: [
            { title: '데이터 기반 의사결정', duration: '2개월', priority: '높음' },
            { title: 'AI 워크플로우 자동화', duration: '3개월', priority: '중간' }
        ]
    }
};

/**
 * 산업군에 맞는 커리어 경로 가져오기
 * @param {string} industry - 산업군 (예: 'IT', '금융', '의료')
 * @param {number} pathIndex - 경로 인덱스 (0 또는 1, 기본값: 0)
 * @returns {Object} 커리어 경로 데이터
 */
window.getCareerPath = function(industry, pathIndex = 0) {
    const normalizedIndustry = industry || '기타';
    const industryData = window.careerPathByIndustry[normalizedIndustry] || window.careerPathByIndustry['기타'];
    const pathData = industryData.paths[pathIndex] || industryData.paths[0];
    
    return {
        path: pathData,
        learningPath: industryData.learningPath
    };
};

console.log('✅ Career Path by Industry data loaded:', Object.keys(window.careerPathByIndustry).length, '산업군');
