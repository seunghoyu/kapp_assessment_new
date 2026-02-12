// ========================================
// AI GENERATED IDP (Individual Development Plan)
// ========================================

function generateAIIDP() {
    const container = document.getElementById('idpContainer');
    if (!container) return;
    
    // Get user data and scores
    const resultsJSON = localStorage.getItem('kapp_assessment_result');
    if (!resultsJSON) {
        container.innerHTML = '<p class="empty-state">진단을 완료하면 AI가 맞춤형 개발 계획을 생성합니다</p>';
        return;
    }
    
    const results = JSON.parse(resultsJSON);
    const { scores, userData } = results;
    
    // Analyze skill gaps
    const skillGaps = analyzeSkillGaps(scores);
    
    // Generate IDP content
    let html = `
        <div class="idp-header">
            <div class="idp-title">
                <h3>🎯 ${userData.name}님을 위한 맞춤 성장 로드맵</h3>
                <p>AI가 분석한 스킬 갭을 메우는 최적의 학습 경로입니다</p>
            </div>
            <div class="idp-stats">
                <div class="idp-stat">
                    <span class="stat-label">총 학습 기간</span>
                    <span class="stat-value">${calculateTotalDuration(skillGaps)}개월</span>
                </div>
                <div class="idp-stat">
                    <span class="stat-label">예상 연봉 상승</span>
                    <span class="stat-value">+${calculateSalaryImpact(skillGaps)}만원</span>
                </div>
                <div class="idp-stat">
                    <span class="stat-label">업무 시간 절감</span>
                    <span class="stat-value">${calculateTimeReduction(skillGaps)}%</span>
                </div>
            </div>
        </div>
        
        <div class="idp-gaps">
            <h4>📉 발견된 스킬 갭 (Gap)</h4>
            <div class="gap-list">
    `;
    
    skillGaps.forEach(gap => {
        html += `
            <div class="gap-item ${gap.priority}">
                <div class="gap-header">
                    <span class="gap-icon">${gap.icon}</span>
                    <span class="gap-name">${gap.name}</span>
                    <span class="gap-badge priority-${gap.priority}">${gap.priority === 'high' ? '긴급' : gap.priority === 'medium' ? '중요' : '선택'}</span>
                </div>
                <div class="gap-details">
                    <div class="gap-current">현재: <strong>${gap.currentLevel}</strong></div>
                    <div class="gap-target">목표: <strong>${gap.targetLevel}</strong></div>
                    <div class="gap-impact">💰 연봉 영향: <strong>+${gap.salaryImpact}만원</strong></div>
                    <div class="gap-time">⏱️ 업무 절감: <strong>${gap.timeReduction}시간/주</strong></div>
                </div>
            </div>
        `;
    });
    
    html += `
            </div>
        </div>
        
        <div class="idp-courses">
            <h4>📚 핀포인트 강의 추천 (해커스 캠퍼스)</h4>
            <p class="idp-desc">각 스킬 갭을 메우기 위한 구체적인 챕터까지 추천합니다</p>
            <div class="course-recommendations">
    `;
    
    skillGaps.forEach((gap, index) => {
        const courses = recommendCourses(gap);
        courses.forEach(course => {
            html += `
                <div class="course-card">
                    <div class="course-header">
                        <span class="course-number">${index + 1}</span>
                        <div class="course-info">
                            <h5>${course.title}</h5>
                            <p class="course-meta">${course.instructor} · ${course.duration} · ${course.level}</p>
                        </div>
                    </div>
                    <div class="course-chapters">
                        <strong>🎯 추천 챕터:</strong>
                        <ul>
                            ${course.chapters.map(ch => `<li>${ch}</li>`).join('')}
                        </ul>
                    </div>
                    <div class="course-value">
                        <div class="value-item">
                            <span class="value-icon">💰</span>
                            <span class="value-text">이 코스 완료 시 <strong>+${course.salaryImpact}만원</strong> 연봉 상승 예상</span>
                        </div>
                        <div class="value-item">
                            <span class="value-icon">⏱️</span>
                            <span class="value-text">주당 <strong>${course.timeSaving}시간</strong> 업무 시간 절감</span>
                        </div>
                    </div>
                    <button class="btn btn-primary course-enroll-btn" onclick="enrollCourse('${course.id}')">
                        <i class="fas fa-play-circle"></i> 지금 시작하기
                    </button>
                </div>
            `;
        });
    });
    
    html += `
            </div>
        </div>
        
        <div class="idp-timeline">
            <h4>📅 추천 학습 타임라인</h4>
            <div class="timeline">
                ${generateTimeline(skillGaps)}
            </div>
        </div>
    `;
    
    container.innerHTML = html;
}

// Analyze skill gaps
function analyzeSkillGaps(scores) {
    const gaps = [];
    const positionAvg = getPositionAverage('대리'); // Default 대리
    
    // Knowledge gap
    if (scores.knowledge < 80) {
        gaps.push({
            name: 'Knowledge (지식)',
            icon: '📚',
            currentLevel: `${scores.knowledge}점`,
            targetLevel: '80점 이상',
            priority: scores.knowledge < 70 ? 'high' : 'medium',
            salaryImpact: 300,
            timeReduction: 5,
            skillType: 'knowledge'
        });
    }
    
    // Application gap
    if (scores.application < 80) {
        gaps.push({
            name: 'Application (적용)',
            icon: '⚙️',
            currentLevel: `${scores.application}점`,
            targetLevel: '80점 이상',
            priority: scores.application < 70 ? 'high' : 'medium',
            salaryImpact: 400,
            timeReduction: 8,
            skillType: 'application'
        });
    }
    
    // Performance gap
    if (scores.performance < 80) {
        gaps.push({
            name: 'Performance (성과)',
            icon: '📊',
            currentLevel: `${scores.performance}점`,
            targetLevel: '80점 이상',
            priority: scores.performance < 70 ? 'high' : 'medium',
            salaryImpact: 450,
            timeReduction: 10,
            skillType: 'performance'
        });
    }
    
    // Productivity gap
    if (scores.productivity < 90) {
        gaps.push({
            name: 'Productivity (생산성)',
            icon: '⚡',
            currentLevel: `${scores.productivity}점`,
            targetLevel: '90점 이상',
            priority: scores.productivity < 80 ? 'high' : 'low',
            salaryImpact: 350,
            timeReduction: 12,
            skillType: 'productivity'
        });
    }
    
    return gaps;
}

// Recommend courses for each gap
function recommendCourses(gap) {
    const courseDatabase = {
        knowledge: [
            {
                id: 'course_k1',
                title: 'IT 개발자를 위한 기술 기초 완성',
                instructor: '김해커 교수',
                duration: '8주',
                level: '중급',
                chapters: [
                    '3장. 데이터 구조와 알고리즘',
                    '5장. 객체지향 프로그래밍',
                    '7장. 디자인 패턴 실전'
                ],
                salaryImpact: 300,
                timeSaving: 5
            }
        ],
        application: [
            {
                id: 'course_a1',
                title: '실무 중심 프로젝트 적용 마스터',
                instructor: '이실무 강사',
                duration: '10주',
                level: '고급',
                chapters: [
                    '2장. 요구사항 분석 및 설계',
                    '4장. API 설계 및 구현',
                    '6장. 테스트 주도 개발 (TDD)'
                ],
                salaryImpact: 400,
                timeSaving: 8
            }
        ],
        performance: [
            {
                id: 'course_p1',
                title: '성과 창출형 개발자 되기',
                instructor: '박성과 멘토',
                duration: '12주',
                level: '고급',
                chapters: [
                    '1장. 비즈니스 이해와 기술 연결',
                    '3장. 성과 지표 설정 및 측정',
                    '5장. 효율적인 코드 리뷰 전략'
                ],
                salaryImpact: 450,
                timeSaving: 10
            }
        ],
        productivity: [
            {
                id: 'course_prod1',
                title: '생산성 극대화 실전 기술',
                instructor: '최효율 전문가',
                duration: '6주',
                level: '중급',
                chapters: [
                    '2장. 자동화 스크립트 작성',
                    '4장. DevOps 파이프라인 구축',
                    '5장. 시간 관리 및 우선순위 설정'
                ],
                salaryImpact: 350,
                timeSaving: 12
            }
        ]
    };
    
    return courseDatabase[gap.skillType] || [];
}

// Calculate total duration
function calculateTotalDuration(gaps) {
    return Math.min(gaps.length * 2 + 1, 12); // Max 12 months
}

// Calculate total salary impact
function calculateSalaryImpact(gaps) {
    return gaps.reduce((sum, gap) => sum + gap.salaryImpact, 0);
}

// Calculate time reduction
function calculateTimeReduction(gaps) {
    const totalReduction = gaps.reduce((sum, gap) => sum + gap.timeReduction, 0);
    return Math.min(Math.round(totalReduction / gaps.length * 10), 40); // Max 40%
}

// Generate timeline
function generateTimeline(gaps) {
    let html = '';
    let cumulativeMonths = 0;
    
    gaps.forEach((gap, index) => {
        const months = 2 + index; // Each gap takes 2-4 months
        cumulativeMonths += months;
        
        html += `
            <div class="timeline-item">
                <div class="timeline-dot"></div>
                <div class="timeline-content">
                    <div class="timeline-date">+ ${months}개월</div>
                    <div class="timeline-title">${gap.name} 마스터</div>
                    <div class="timeline-result">결과: +${gap.salaryImpact}만원 연봉 상승</div>
                </div>
            </div>
        `;
    });
    
    return html;
}

// Enroll course
window.enrollCourse = function(courseId) {
    alert(`🎓 "${courseId}" 강의 등록이 완료되었습니다!\n\n교육 큐레이션 페이지로 이동합니다.`);
    window.location.href = 'education.html';
};
