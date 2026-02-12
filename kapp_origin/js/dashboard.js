// Dashboard Page Logic

let radarChart = null;
let barChart = null;

document.addEventListener('DOMContentLoaded', function() {
    loadDashboard();
    setupChartTypeSelector();
});

// Load Dashboard Data
function loadDashboard() {
    const assessmentResult = localStorage.getItem('assessment_result');
    
    if (!assessmentResult) {
        // Show no data state
        document.getElementById('noDataState').style.display = 'flex';
        document.getElementById('dashboardGrid').style.display = 'none';
        return;
    }
    
    const data = JSON.parse(assessmentResult);
    
    // Hide no data state, show dashboard
    document.getElementById('noDataState').style.display = 'none';
    document.getElementById('dashboardGrid').style.display = 'block';
    
    // Update header
    updateHeader(data);
    
    // Update overview cards
    updateOverviewCards(data);
    
    // Create charts
    createRadarChart(data);
    createBarChart(data);
    
    // Update skills list
    updateSkillsList(data);
    
    // Update recommendations
    updateRecommendations(data);
    
    // Update history
    updateHistory(data);
}

// Update Header
function updateHeader(data) {
    document.getElementById('userName').textContent = `${data.user.name}님, 환영합니다!`;
    document.getElementById('userInfo').textContent = 
        `${data.user.job} | ${data.user.experience} | 최근 진단: ${formatDate(data.timestamp)}`;
}

// Update Overview Cards
function updateOverviewCards(data) {
    document.getElementById('overallScore').textContent = `${data.totalScore}점`;
    document.getElementById('topSkill').textContent = data.strength;
    document.getElementById('weakSkill').textContent = data.weakness;
    
    // Calculate recommended courses based on weakness
    const recommendedCount = 3;
    document.getElementById('recommendedCourses').textContent = `${recommendedCount}개`;
}

// Create Radar Chart
function createRadarChart(data) {
    const ctx = document.getElementById('radarChart');
    
    if (radarChart) {
        radarChart.destroy();
    }
    
    const categories = Object.keys(data.scores);
    const scores = Object.values(data.scores);
    
    radarChart = new Chart(ctx, {
        type: 'radar',
        data: {
            labels: categories,
            datasets: [{
                label: '현재 역량',
                data: scores,
                fill: true,
                backgroundColor: 'rgba(0, 102, 255, 0.2)',
                borderColor: 'rgb(0, 102, 255)',
                pointBackgroundColor: 'rgb(0, 102, 255)',
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: 'rgb(0, 102, 255)',
                pointRadius: 5,
                pointHoverRadius: 7
            }, {
                label: '목표 역량',
                data: categories.map(() => 100),
                fill: true,
                backgroundColor: 'rgba(0, 201, 167, 0.1)',
                borderColor: 'rgb(0, 201, 167)',
                pointBackgroundColor: 'rgb(0, 201, 167)',
                pointBorderColor: '#fff',
                pointRadius: 4,
                borderDash: [5, 5]
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                r: {
                    beginAtZero: true,
                    max: 100,
                    ticks: {
                        stepSize: 20,
                        font: {
                            size: 12
                        }
                    },
                    pointLabels: {
                        font: {
                            size: 14,
                            weight: 'bold'
                        }
                    }
                }
            },
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        padding: 20,
                        font: {
                            size: 13,
                            weight: '600'
                        }
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    padding: 12,
                    titleFont: {
                        size: 14
                    },
                    bodyFont: {
                        size: 13
                    },
                    callbacks: {
                        label: function(context) {
                            return context.dataset.label + ': ' + context.parsed.r + '점';
                        }
                    }
                }
            }
        }
    });
}

// Create Bar Chart
function createBarChart(data, type = 'bar') {
    const ctx = document.getElementById('barChart');
    
    if (barChart) {
        barChart.destroy();
    }
    
    const categories = Object.keys(data.scores);
    const scores = Object.values(data.scores);
    
    barChart = new Chart(ctx, {
        type: type,
        data: {
            labels: categories,
            datasets: [{
                label: '역량 점수',
                data: scores,
                backgroundColor: [
                    'rgba(0, 102, 255, 0.8)',
                    'rgba(0, 201, 167, 0.8)',
                    'rgba(246, 173, 85, 0.8)',
                    'rgba(72, 187, 120, 0.8)',
                    'rgba(159, 122, 234, 0.8)',
                    'rgba(255, 107, 107, 0.8)'
                ],
                borderColor: [
                    'rgb(0, 102, 255)',
                    'rgb(0, 201, 167)',
                    'rgb(246, 173, 85)',
                    'rgb(72, 187, 120)',
                    'rgb(159, 122, 234)',
                    'rgb(255, 107, 107)'
                ],
                borderWidth: 2,
                borderRadius: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    ticks: {
                        stepSize: 20,
                        callback: function(value) {
                            return value + '점';
                        },
                        font: {
                            size: 12
                        }
                    },
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    }
                },
                x: {
                    ticks: {
                        font: {
                            size: 13,
                            weight: 'bold'
                        }
                    },
                    grid: {
                        display: false
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    padding: 12,
                    titleFont: {
                        size: 14
                    },
                    bodyFont: {
                        size: 13
                    },
                    callbacks: {
                        label: function(context) {
                            return '점수: ' + context.parsed.y + '점';
                        }
                    }
                }
            }
        }
    });
}

// Setup Chart Type Selector
function setupChartTypeSelector() {
    const selector = document.getElementById('chartTypeSelect');
    if (selector) {
        selector.addEventListener('change', function() {
            const assessmentResult = localStorage.getItem('assessment_result');
            if (assessmentResult) {
                const data = JSON.parse(assessmentResult);
                createBarChart(data, this.value);
            }
        });
    }
}

// Update Skills List
function updateSkillsList(data) {
    const skillsList = document.getElementById('skillsList');
    skillsList.innerHTML = '';
    
    const skillDescriptions = {
        '문제 해결': '복잡한 문제를 체계적으로 분석하고 효과적인 해결책을 도출하는 능력',
        '의사소통': '명확하고 효과적으로 의견을 전달하고 타인의 의견을 경청하는 능력',
        '리더십': '팀을 이끌고 동기부여하며 목표를 달성하는 능력',
        '학습': '새로운 지식과 기술을 빠르게 습득하고 적용하는 능력',
        '기술': '업무에 필요한 도구와 기술을 효과적으로 활용하는 능력',
        '협업': '다양한 팀원과 원활하게 협력하여 공동 목표를 달성하는 능력'
    };
    
    Object.entries(data.scores).forEach(([category, score]) => {
        const skillItem = document.createElement('div');
        skillItem.className = 'skill-item';
        
        const description = skillDescriptions[category] || '직무 역량';
        
        skillItem.innerHTML = `
            <div class="skill-header">
                <div class="skill-name">${category}</div>
                <div class="skill-score">${score}점</div>
            </div>
            <div class="skill-bar">
                <div class="skill-bar-fill" style="width: ${score}%"></div>
            </div>
            <div class="skill-description">${description}</div>
        `;
        
        skillsList.appendChild(skillItem);
    });
}

// Update Recommendations
function updateRecommendations(data) {
    // Priority courses based on weakness
    const coursesMap = {
        '문제 해결': ['데이터 기반 의사결정', '비즈니스 문제 해결 전략', '논리적 사고 강화'],
        '의사소통': ['효과적인 프레젠테이션', '설득 커뮤니케이션', '비즈니스 라이팅'],
        '리더십': ['리더십 핵심 역량', '팀 빌딩 전략', '성과 관리'],
        '학습': ['자기주도 학습법', '빠른 학습 전략', '지식 관리 체계'],
        '기술': ['디지털 도구 활용', '업무 자동화', '최신 기술 트렌드'],
        '협업': ['효과적인 팀워크', '갈등 관리', '협업 도구 활용']
    };
    
    const priorityCourses = coursesMap[data.weakness] || ['맞춤형 교육 과정'];
    const priorityList = document.getElementById('priorityCourses');
    priorityList.innerHTML = '';
    
    priorityCourses.forEach(course => {
        const li = document.createElement('li');
        li.textContent = course;
        priorityList.appendChild(li);
    });
    
    // Development tips
    const tipsMap = {
        '문제 해결': [
            '복잡한 문제를 작은 단위로 나누어 접근하세요',
            '데이터 기반으로 의사결정하는 습관을 기르세요',
            '다양한 관점에서 문제를 바라보는 연습을 하세요'
        ],
        '의사소통': [
            '핵심 메시지를 명확하게 정리하는 연습을 하세요',
            '청중의 입장에서 생각하는 습관을 기르세요',
            '피드백을 적극적으로 구하고 반영하세요'
        ],
        '리더십': [
            '팀원들의 강점을 파악하고 활용하세요',
            '명확한 비전과 목표를 제시하세요',
            '솔선수범하는 자세를 보여주세요'
        ],
        '학습': [
            '매일 일정 시간을 학습에 투자하세요',
            '학습한 내용을 실무에 바로 적용해보세요',
            '학습 내용을 정리하고 공유하세요'
        ],
        '기술': [
            '업무 관련 도구의 고급 기능을 학습하세요',
            '새로운 기술 트렌드를 주기적으로 확인하세요',
            '실습을 통해 기술을 체화하세요'
        ],
        '협업': [
            '팀원들과 정기적으로 소통하세요',
            '다른 관점을 존중하고 수용하세요',
            '협업 도구를 효과적으로 활용하세요'
        ]
    };
    
    const tips = tipsMap[data.weakness] || ['지속적인 학습과 개선을 추구하세요'];
    const tipsList = document.getElementById('developmentTips');
    tipsList.innerHTML = '';
    
    tips.forEach(tip => {
        const li = document.createElement('li');
        li.textContent = tip;
        tipsList.appendChild(li);
    });
    
    // Learning goals
    const goalsMap = {
        '문제 해결': [
            '3개월 내 데이터 분석 도구 숙달',
            '주간 문제 해결 사례 1건 이상 작성',
            '분석적 사고 점수 20% 향상'
        ],
        '의사소통': [
            '월 1회 팀 프레젠테이션 진행',
            '주간 피드백 세션 참여',
            '커뮤니케이션 점수 25% 향상'
        ],
        '리더십': [
            '소규모 프로젝트 리드 경험',
            '멘토링 활동 시작',
            '리더십 역량 30% 향상'
        ],
        '학습': [
            '주 5시간 이상 학습 시간 확보',
            '월 2개 이상 온라인 강의 수강',
            '학습 역량 25% 향상'
        ],
        '기술': [
            '핵심 업무 도구 고급 기능 마스터',
            '월 1개 신기술 학습',
            '기술 역량 30% 향상'
        ],
        '협업': [
            '크로스팀 프로젝트 참여',
            '협업 도구 활용도 증대',
            '협업 역량 25% 향상'
        ]
    };
    
    const goals = goalsMap[data.weakness] || ['지속적인 역량 개발'];
    const goalsList = document.getElementById('learningGoals');
    goalsList.innerHTML = '';
    
    goals.forEach(goal => {
        const li = document.createElement('li');
        li.textContent = goal;
        goalsList.appendChild(li);
    });
}

// Update History
function updateHistory(data) {
    document.getElementById('assessmentDate').textContent = formatDate(data.timestamp);
    document.getElementById('historyScore').textContent = `${data.totalScore}점`;
}