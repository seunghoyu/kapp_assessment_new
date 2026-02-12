// KAPP Dashboard Logic

// DNA Types Database
const dnaTypes = {
    ANALYST_PRECISION: {
        icon: '🎯',
        name: '정교한 데이터 조련사',
        description: '데이터를 정밀하게 분석하고 논리적으로 접근하는 스타일입니다. 복잡한 문제를 체계적으로 해결하며, 객관적인 근거를 바탕으로 의사결정을 합니다.',
        traits: ['분석적', '논리적', '체계적', '정밀함']
    },
    CREATIVE_INNOVATOR: {
        icon: '💡',
        name: '혁신적 아이디어 크리에이터',
        description: '창의적인 아이디어로 문제를 해결하는 스타일입니다. 기존 틀에서 벗어나 새로운 관점으로 접근하며, 혁신적인 솔루션을 제시합니다.',
        traits: ['창의적', '혁신적', '유연함', '도전적']
    },
    STRATEGIC_PLANNER: {
        icon: '🧭',
        name: '전략적 로드맵 설계자',
        description: '장기적 관점에서 전략을 수립하는 스타일입니다. 큰 그림을 보며 목표를 설정하고, 체계적인 실행 계획을 만듭니다.',
        traits: ['전략적', '통찰력', '계획적', '목표지향']
    },
    COLLABORATIVE_LEADER: {
        icon: '🤝',
        name: '협업 중심 팀 빌더',
        description: '팀워크를 중시하며 구성원들의 강점을 이끌어내는 스타일입니다. 원활한 소통으로 시너지를 창출하고, 조직의 목표 달성을 이끕니다.',
        traits: ['협업적', '소통', '리더십', '공감']
    },
    EXECUTION_MASTER: {
        icon: '⚡',
        name: '실행력 극대화 실행가',
        description: '빠르고 정확한 실행력을 갖춘 스타일입니다. 계획을 즉시 행동으로 옮기며, 효율적으로 결과를 만들어냅니다.',
        traits: ['실행력', '빠름', '효율적', '결과중심']
    },
    PERFECTIONIST_OPTIMIZER: {
        icon: '✨',
        name: '완벽주의 최적화 전문가',
        description: '디테일에 강하며 완벽을 추구하는 스타일입니다. 프로세스를 지속적으로 개선하고, 최고의 품질을 만들어냅니다.',
        traits: ['완벽주의', '세밀함', '개선지향', '품질중시']
    }
};

// Initialize Dashboard
document.addEventListener('DOMContentLoaded', function() {
    loadKAPPResults();
    renderCharts();
    initializeSkillSelector();
    generateAIIDP();
    initializeGamification();
    renderSalaryGrowthChart();
});

// Load KAPP Assessment Results
function loadKAPPResults() {
    console.log('📊 KAPP 결과 로딩 중...');
    
    // localStorage에서 결과 가져오기
    const kappResult = localStorage.getItem('kapp_assessment_result');
    const assessmentResult = localStorage.getItem('assessment_result');
    
    console.log('🔍 localStorage 확인:');
    console.log('  - kapp_assessment_result:', kappResult ? '존재' : '없음');
    console.log('  - assessment_result:', assessmentResult ? '존재' : '없음');
    
    const resultsJSON = kappResult || assessmentResult;
    
    if (!resultsJSON) {
        console.warn('⚠️ 저장된 진단 결과가 없습니다. 샘플 데이터를 사용합니다.');
        console.warn('💡 진단을 완료하려면 assessment-kapp.html로 이동하세요.');
        loadSampleData();
        return;
    }
    
    try {
        const results = JSON.parse(resultsJSON);
        console.log('✅ KAPP 결과 로딩 완료:', results);
        
        // 데이터 구조 검증
        if (!results.userData || !results.scores) {
            console.error('❌ 데이터 구조가 올바르지 않습니다:', results);
            console.warn('💡 진단을 다시 완료해주세요.');
            loadSampleData();
            return;
        }
        
        // Display results
        displayUserInfo(results.userData);
        displayScores(results.scores);
        displayWorkDNA(results.scores, results.userData);
        displayMarketPosition(results.scores, results.userData);
        displayCareerPath(results.scores, results.userData);
        displayAIInsights(results.scores, results.userData);
        
    } catch (error) {
        console.error('❌ 결과 파싱 실패:', error);
        console.error('📄 저장된 데이터:', resultsJSON?.substring(0, 200));
        loadSampleData();
    }
}

// Load Sample Data (for testing)
function loadSampleData() {
    const sampleResults = {
        userData: {
            name: '김해커',
            industry: 'IT',
            job: '개발자(Backend)',
            position: '대리',
            experience: '3-5년'
        },
        scores: {
            knowledge: 85,
            application: 78,
            performance: 82,
            productivity: 90
        },
        overallScore: 84
    };
    
    displayUserInfo(sampleResults.userData);
    displayScores(sampleResults.scores);
    displayWorkDNA(sampleResults.scores, sampleResults.userData);
    displayMarketPosition(sampleResults.scores, sampleResults.userData);
    displayCareerPath(sampleResults.scores, sampleResults.userData);
    displayAIInsights(sampleResults.scores, sampleResults.userData);
}

// Display User Info
function displayUserInfo(userData) {
    const userName = document.getElementById('userName');
    if (userName && userData && userData.name) {
        userName.textContent = userData.name;
    }
}

// Display Scores
function displayScores(scores) {
    if (!scores) return;
    
    // Update score values
    updateScore('knowledgeScore', scores.knowledge);
    updateScore('applicationScore', scores.application);
    updateScore('performanceScore', scores.performance);
    updateScore('productivityScore', scores.productivity);
    
    // Update progress bars
    animateProgressBars();
}

function updateScore(elementId, value) {
    const element = document.getElementById(elementId);
    if (element) {
        element.textContent = Math.round(value);
    }
}

function animateProgressBars() {
    setTimeout(() => {
        const progressBars = document.querySelectorAll('.progress-fill');
        progressBars.forEach(bar => {
            const width = bar.style.width;
            bar.style.width = '0%';
            setTimeout(() => {
                bar.style.width = width;
            }, 100);
        });
    }, 300);
}

// Display Work DNA
function displayWorkDNA(scores, userData) {
    // Determine DNA type based on scores
    const dnaType = determineDNAType(scores, userData);
    const dna = dnaTypes[dnaType];
    
    // Update UI
    document.getElementById('dnaIcon').textContent = dna.icon;
    document.getElementById('dnaType').textContent = dna.name;
    document.getElementById('dnaCode').textContent = dnaType;
    document.getElementById('dnaDescription').textContent = dna.description;
    
    // Update traits
    const traitsContainer = document.querySelector('.dna-traits');
    if (traitsContainer) {
        traitsContainer.innerHTML = dna.traits.map(trait => 
            `<span class="trait-tag">${trait}</span>`
        ).join('');
    }
}

function determineDNAType(scores, userData) {
    const { knowledge, application, performance, productivity } = scores;
    
    // 점수 기반 DNA 타입 결정
    if (knowledge >= 85 && productivity >= 85) {
        return 'ANALYST_PRECISION';
    } else if (application >= 85 && knowledge >= 80) {
        return 'CREATIVE_INNOVATOR';
    } else if (performance >= 85 && knowledge >= 80) {
        return 'STRATEGIC_PLANNER';
    } else if (application >= 80 && performance >= 80) {
        return 'COLLABORATIVE_LEADER';
    } else if (productivity >= 90) {
        return 'EXECUTION_MASTER';
    } else {
        return 'PERFECTIONIST_OPTIMIZER';
    }
}

// Display Salary Impact
function displaySalaryImpact(scores, userData) {
    // Calculate current and potential salary
    const baseSalary = calculateBaseSalary(userData);
    const salaryIncrease = calculateSalaryIncrease(scores);
    const potentialSalary = baseSalary + salaryIncrease;
    
    // Update UI
    document.getElementById('currentSalary').textContent = formatSalary(baseSalary);
    document.getElementById('potentialSalary').textContent = formatSalary(potentialSalary);
    
    // Calculate percentage increase
    const percentIncrease = Math.round((salaryIncrease / baseSalary) * 100);
    const increaseText = `+${formatSalary(salaryIncrease)} (+${percentIncrease}%)`;
    
    const increaseElement = document.querySelector('.salary-desc .increase');
    if (increaseElement) {
        increaseElement.textContent = increaseText;
    }
}

function calculateBaseSalary(userData) {
    // 직급별 기본 연봉 (만원 단위)
    const baseSalaries = {
        '인턴': 2800,
        '사원': 3500,
        '주임': 4000,
        '대리': 5200,
        '과장': 6500,
        '차장': 8000,
        '부장': 10000,
        '임원': 15000
    };
    
    return baseSalaries[userData.position] || 5000;
}

function calculateSalaryIncrease(scores) {
    // 스킬 향상 시 예상 연봉 증가
    const avgScore = (scores.knowledge + scores.application + scores.performance + scores.productivity) / 4;
    
    if (avgScore >= 85) {
        return 940; // +18%
    } else if (avgScore >= 75) {
        return 620; // +12%
    } else if (avgScore >= 65) {
        return 400; // +8%
    } else {
        return 200; // +4%
    }
}

function formatSalary(amount) {
    return `${amount.toLocaleString()}만원`;
}

// Display Market Position Analysis (시장 포지션 분석)
function displayMarketPosition(scores, userData) {
    console.log('📊 시장 포지션 분석:', userData.industry);
    
    // Calculate overall score
    const overallScore = Math.round((scores.knowledge + scores.application + scores.performance + scores.productivity) / 4);
    
    // Calculate percentile (상위 몇 %)
    let percentile = 50; // 기본값
    if (overallScore >= 90) percentile = 10;
    else if (overallScore >= 85) percentile = 15;
    else if (overallScore >= 80) percentile = 25;
    else if (overallScore >= 75) percentile = 35;
    else if (overallScore >= 70) percentile = 45;
    else if (overallScore >= 65) percentile = 55;
    
    // Determine position level
    let positionLevel = '중급 (Mid-Level)';
    if (overallScore >= 90) positionLevel = '최상급 (Expert)';
    else if (overallScore >= 85) positionLevel = '고급 (Senior)';
    else if (overallScore >= 75) positionLevel = '중상급 (Mid-Senior)';
    else if (overallScore >= 65) positionLevel = '중급 (Mid-Level)';
    else positionLevel = '초급 (Junior)';
    
    // Update UI - Current Position
    const currentPositionLevel = document.getElementById('currentPositionLevel');
    if (currentPositionLevel) currentPositionLevel.textContent = positionLevel;
    
    const currentPercentile = document.getElementById('currentPercentile');
    if (currentPercentile) currentPercentile.textContent = `${percentile}%`;
    
    const currentMarketScore = document.getElementById('currentMarketScore');
    if (currentMarketScore) currentMarketScore.textContent = `${overallScore}점`;
    
    const currentScoreFill = document.getElementById('currentScoreFill');
    if (currentScoreFill) currentScoreFill.style.width = `${overallScore}%`;
    
    // Calculate competitiveness metrics
    const strengths = [];
    const improvements = [];
    const averages = [];
    
    if (scores.knowledge >= 80) strengths.push('지식');
    else if (scores.knowledge < 70) improvements.push('지식');
    else averages.push('지식');
    
    if (scores.application >= 80) strengths.push('적용');
    else if (scores.application < 70) improvements.push('적용');
    else averages.push('적용');
    
    if (scores.performance >= 80) strengths.push('성과');
    else if (scores.performance < 70) improvements.push('성과');
    else averages.push('성과');
    
    if (scores.productivity >= 80) strengths.push('생산성');
    else if (scores.productivity < 70) improvements.push('생산성');
    else averages.push('생산성');
    
    // Update competitiveness metrics
    const strengthCount = document.getElementById('strengthCount');
    if (strengthCount) strengthCount.textContent = `${strengths.length}개`;
    
    const improvementCount = document.getElementById('improvementCount');
    if (improvementCount) improvementCount.textContent = `${improvements.length}개`;
    
    const averageCount = document.getElementById('averageCount');
    if (averageCount) averageCount.textContent = `${averages.length}개`;
    
    // Market demand (산업별 시장 수요도)
    const demandData = {
        'IT': { level: 'high', text: '높음', jobs: 1247 },
        '금융': { level: 'high', text: '높음', jobs: 892 },
        '의료': { level: 'high', text: '높음', jobs: 634 },
        '마케팅/광고': { level: 'medium', text: '중간', jobs: 521 },
        '교육': { level: 'medium', text: '중간', jobs: 387 },
        '제조': { level: 'medium', text: '중간', jobs: 445 },
        '유통/리테일': { level: 'medium', text: '중간', jobs: 298 },
        '호텔/관광': { level: 'low', text: '보통', jobs: 156 },
        '법률/회계': { level: 'medium', text: '중간', jobs: 234 },
        '기타': { level: 'medium', text: '중간', jobs: 400 }
    };
    
    const industry = userData.industry || 'IT';
    const demand = demandData[industry] || demandData['기타'];
    
    const demandLevel = document.getElementById('demandLevel');
    if (demandLevel) {
        demandLevel.className = `demand-level ${demand.level}`;
        demandLevel.innerHTML = `
            <span class="demand-text">${demand.text}</span>
            <span class="demand-badge">채용 공고 ${demand.jobs.toLocaleString()}건</span>
        `;
    }
    
    // Render Market Radar Chart (업계 벤치마크) with delay
    setTimeout(() => {
        renderMarketRadarChart(scores, userData);
        console.log('✅ 시장 레이더 차트 렌더링 시도');
    }, 200);
    
    // Generate action list
    generateMarketActionList(scores, improvements);
}

// Render Market Radar Chart
function renderMarketRadarChart(scores, userData) {
    const canvas = document.getElementById('marketRadarChart');
    if (!canvas) {
        console.warn('⚠️ marketRadarChart 캔버스를 찾을 수 없습니다.');
        return;
    }
    
    console.log('📊 Market Radar Chart 렌더링 시작...');
    
    const ctx = canvas.getContext('2d');
    
    // Industry top 10% benchmark (상위 10% 기준)
    const industryBenchmark = {
        knowledge: 92,
        application: 90,
        performance: 91,
        productivity: 93
    };
    
    try {
        new Chart(ctx, {
        type: 'radar',
        data: {
            labels: ['지식 (Knowledge)', '적용 (Application)', '성과 (Performance)', '생산성 (Productivity)'],
            datasets: [
                {
                    label: '업계 상위 10%',
                    data: [
                        industryBenchmark.knowledge,
                        industryBenchmark.application,
                        industryBenchmark.performance,
                        industryBenchmark.productivity
                    ],
                    fill: true,
                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                    borderColor: 'rgb(239, 68, 68)',
                    borderWidth: 2,
                    borderDash: [5, 5],
                    pointBackgroundColor: 'rgb(239, 68, 68)',
                    pointBorderColor: '#fff',
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: 'rgb(239, 68, 68)'
                },
                {
                    label: '나의 점수',
                    data: [
                        scores.knowledge,
                        scores.application,
                        scores.performance,
                        scores.productivity
                    ],
                    fill: true,
                    backgroundColor: 'rgba(59, 130, 246, 0.2)',
                    borderColor: 'rgb(59, 130, 246)',
                    borderWidth: 3,
                    pointBackgroundColor: 'rgb(59, 130, 246)',
                    pointBorderColor: '#fff',
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: 'rgb(59, 130, 246)'
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            elements: {
                line: {
                    borderWidth: 2
                }
            },
            scales: {
                r: {
                    angleLines: {
                        display: true,
                        color: 'rgba(0, 0, 0, 0.1)'
                    },
                    grid: {
                        color: 'rgba(0, 0, 0, 0.1)'
                    },
                    pointLabels: {
                        font: {
                            size: 14,
                            weight: '600',
                            family: "'Noto Sans KR', sans-serif"
                        },
                        color: '#1f2937',
                        padding: 10
                    },
                    suggestedMin: 0,
                    suggestedMax: 100,
                    ticks: {
                        stepSize: 20,
                        backdropColor: 'transparent',
                        color: '#6b7280',
                        font: {
                            size: 11
                        }
                    }
                }
            },
            plugins: {
                legend: {
                    display: true,
                    position: 'top',
                    labels: {
                        font: {
                            size: 13
                        },
                        padding: 15,
                        usePointStyle: true
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    padding: 12,
                    bodyFont: {
                        size: 13
                    },
                    callbacks: {
                        label: function(context) {
                            return `${context.dataset.label}: ${context.parsed.r}점`;
                        }
                    }
                }
            }
        }
    });
    console.log('✅ Market Radar Chart 렌더링 완료');
    } catch (error) {
        console.error('❌ Market Radar Chart 렌더링 실패:', error);
    }
}

// Generate Market Action List
function generateMarketActionList(scores, improvements) {
    const actionList = document.getElementById('marketActionList');
    if (!actionList) {
        console.warn('⚠️ marketActionList 요소를 찾을 수 없습니다.');
        return;
    }
    
    console.log('🎯 추천 액션 리스트 생성 중...', improvements);
    
    const actions = [];
    
    // Improvement-based actions
    if (improvements.includes('지식')) {
        actions.push({
            icon: '📚',
            title: '지식 역량 강화',
            description: '산업 트렌드와 최신 기술 습득을 위한 학습 추천',
            priority: 'high'
        });
    }
    
    if (improvements.includes('적용')) {
        actions.push({
            icon: '🔨',
            title: '실무 프로젝트 참여',
            description: '실전 경험을 통한 적용 능력 향상 필요',
            priority: 'high'
        });
    }
    
    if (improvements.includes('성과')) {
        actions.push({
            icon: '📊',
            title: '성과 지표 개선',
            description: '목표 설정 및 성과 측정 체계 구축',
            priority: 'medium'
        });
    }
    
    if (improvements.includes('생산성')) {
        actions.push({
            icon: '⚡',
            title: 'AI 워크플로우 도입',
            description: '업무 자동화 및 효율성 극대화 전략',
            priority: 'high'
        });
    }
    
    // Add general recommendations
    if (actions.length < 3) {
        actions.push({
            icon: '🎯',
            title: '리더십 역량 개발',
            description: '팀 리드 및 관리자 역할로의 성장 준비',
            priority: 'medium'
        });
    }
    
    if (actions.length < 4) {
        actions.push({
            icon: '🌐',
            title: '네트워크 확장',
            description: '업계 전문가와의 교류 및 커뮤니티 참여',
            priority: 'low'
        });
    }
    
    actionList.innerHTML = actions.map(action => `
        <div class="action-item priority-${action.priority}">
            <div class="action-icon">${action.icon}</div>
            <div class="action-content">
                <h5>${action.title}</h5>
                <p>${action.description}</p>
            </div>
            <div class="action-priority">
                <span class="priority-badge ${action.priority}">${action.priority === 'high' ? '높음' : action.priority === 'medium' ? '중간' : '낮음'}</span>
            </div>
        </div>
    `).join('');
    
    console.log('✅ 추천 액션 리스트 생성 완료:', actions.length, '개');
}

// Start Market Growth Plan
function startMarketGrowthPlan() {
    alert('🎯 맞춤 성장 플랜이 곧 시작됩니다!\n\n교육 큐레이션 페이지로 이동합니다.');
    window.location.href = 'education.html';
}


// Display AI-Generated Insights
function displayAIInsights(scores, userData) {
    const insightsContainer = document.getElementById('aiInsights');
    if (!insightsContainer) {
        console.warn('⚠️ aiInsights 컨테이너를 찾을 수 없습니다.');
        return;
    }
    
    console.log('🧠 AI 인사이트 생성 중...');
    
    const insights = generateAIInsights(scores, userData);
    
    insightsContainer.innerHTML = insights.map(insight => `
        <div class="insight-card">
            <div class="insight-icon">${insight.icon}</div>
            <div class="insight-content">
                <h4>${insight.title}</h4>
                <p>${insight.text}</p>
            </div>
        </div>
    `).join('');
    
    console.log('✅ AI 인사이트 생성 완료:', insights.length, '개');
}

// Display Career Path
function displayCareerPath(scores, userData) {
    console.log('📈 커리어 경로 표시:', userData.industry, userData.job);
    
    // Get industry-based career path
    const industry = userData.industry || 'IT';
    const careerData = window.getCareerPath(industry, 0);
    
    if (!careerData) {
        console.warn('⚠️ 산업군별 커리어 경로 데이터가 로드되지 않았습니다.');
        return;
    }
    
    const { path, learningPath } = careerData;
    
    // Render Career Timeline
    const timelineContainer = document.getElementById('careerTimeline');
    if (timelineContainer) {
        timelineContainer.innerHTML = `
            <div class="career-node current">
                <div class="node-year">현재</div>
                <div class="node-role">${path.current.role}</div>
                <div class="node-skills">
                    ${path.current.skills.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
                </div>
            </div>
            
            <div class="career-arrow">
                <div class="arrow-line"></div>
                <div class="arrow-probability">${path.milestone1.probability}% 확률</div>
            </div>
            
            <div class="career-node milestone">
                <div class="node-year">${path.milestone1.year}</div>
                <div class="node-role">${path.milestone1.role}</div>
                <div class="node-skills">
                    ${path.milestone1.skills.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
                </div>
            </div>
            
            <div class="career-arrow">
                <div class="arrow-line"></div>
                <div class="arrow-probability">${path.milestone2.probability}% 확률</div>
            </div>
            
            <div class="career-node future">
                <div class="node-year">${path.milestone2.year}</div>
                <div class="node-role">${path.milestone2.role}</div>
                <div class="node-skills">
                    ${path.milestone2.skills.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
                </div>
            </div>
        `;
    }
    
    // Render Learning Path
    const learningPathContainer = document.getElementById('learningPathEnhanced');
    if (learningPathContainer && learningPath) {
        learningPathContainer.innerHTML = learningPath.map((course, index) => `
            <div class="learning-path-item">
                <div class="path-number">${index + 1}</div>
                <div class="path-content">
                    <h5>${course.title}</h5>
                    <div class="path-meta">
                        <span class="duration"><i class="fas fa-clock"></i> ${course.duration}</span>
                        <span class="priority ${course.priority === '높음' ? 'high' : course.priority === '중간' ? 'medium' : 'low'}">
                            우선순위: ${course.priority}
                        </span>
                    </div>
                </div>
            </div>
        `).join('');
    }
}

// Render Charts
function renderCharts() {
    console.log('📊 차트 렌더링 시작...');
    
    // 약간의 딜레이를 주어 DOM이 완전히 로드되도록 함
    setTimeout(() => {
        renderRadarChart();
        renderBenchmarkChart();
        renderGrowthTrendChart();
        updateBenchmarkStats();
        console.log('✅ 기본 차트 렌더링 완료');
    }, 100);
}

// Render KAPP Radar Chart
function renderRadarChart() {
    const canvas = document.getElementById('kappRadarChart');
    if (!canvas) {
        console.warn('⚠️ kappRadarChart 캔버스를 찾을 수 없습니다.');
        return;
    }
    
    console.log('📊 KAPP 레이더 차트 렌더링 시작...');
    
    const ctx = canvas.getContext('2d');
    
    // Get scores from UI
    const knowledge = parseInt(document.getElementById('knowledgeScore')?.textContent || 85);
    const application = parseInt(document.getElementById('applicationScore')?.textContent || 78);
    const performance = parseInt(document.getElementById('performanceScore')?.textContent || 82);
    const productivity = parseInt(document.getElementById('productivityScore')?.textContent || 90);
    
    // Get position-based averages
    const userData = getUserData();
    const positionAverage = getPositionAverage(userData.position);
    
    new Chart(ctx, {
        type: 'radar',
        data: {
            labels: ['지식 (Knowledge)', '적용 (Application)', '성과 (Performance)', '생산성 (Productivity)'],
            datasets: [
                {
                    label: '직급 평균',
                    data: [positionAverage.knowledge, positionAverage.application, positionAverage.performance, positionAverage.productivity],
                    fill: true,
                    backgroundColor: 'rgba(156, 163, 175, 0.1)',
                    borderColor: 'rgba(156, 163, 175, 0.6)',
                    borderDash: [5, 5],
                    pointBackgroundColor: 'rgba(156, 163, 175, 0.6)',
                    pointBorderColor: '#fff',
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: 'rgba(156, 163, 175, 0.8)'
                },
                {
                    label: '나의 점수',
                    data: [knowledge, application, performance, productivity],
                    fill: true,
                    backgroundColor: 'rgba(102, 126, 234, 0.2)',
                    borderColor: 'rgb(102, 126, 234)',
                    pointBackgroundColor: 'rgb(102, 126, 234)',
                    pointBorderColor: '#fff',
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: 'rgb(102, 126, 234)'
                }
            ]
        },
        options: {
            elements: {
                line: {
                    borderWidth: 3
                }
            },
            scales: {
                r: {
                    angleLines: {
                        display: true
                    },
                    suggestedMin: 0,
                    suggestedMax: 100
                }
            },
            plugins: {
                legend: {
                    display: true,
                    position: 'top'
                }
            }
        }
    });
    
    console.log('✅ KAPP 레이더 차트 렌더링 완료');
}

// Render Benchmark Chart
function renderBenchmarkChart() {
    const canvas = document.getElementById('benchmarkChart');
    if (!canvas) {
        console.warn('⚠️ benchmarkChart 캔버스를 찾을 수 없습니다.');
        return;
    }
    
    console.log('📊 벤치마크 차트 렌더링 시작...');
    
    const ctx = canvas.getContext('2d');
    
    // Get actual scores from UI
    const knowledge = parseInt(document.getElementById('knowledgeScore')?.textContent || 85);
    const application = parseInt(document.getElementById('applicationScore')?.textContent || 78);
    const performance = parseInt(document.getElementById('performanceScore')?.textContent || 82);
    const productivity = parseInt(document.getElementById('productivityScore')?.textContent || 90);
    
    // Get position-based averages
    const userData = getUserData();
    const positionAverage = getPositionAverage(userData.position);
    
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['지식', '적용', '성과', '생산성'],
            datasets: [
                {
                    label: '직급 평균',
                    data: [positionAverage.knowledge, positionAverage.application, positionAverage.performance, positionAverage.productivity],
                    backgroundColor: 'rgba(156, 163, 175, 0.8)'
                },
                {
                    label: '나의 점수',
                    data: [knowledge, application, performance, productivity],
                    backgroundColor: 'rgba(102, 126, 234, 0.8)'
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100
                }
            },
            plugins: {
                legend: {
                    display: true
                }
            }
        }
    });
    
    console.log('✅ 벤치마크 차트 렌더링 완료');
}

// Action Functions
function shareDNA() {
    const dnaType = document.getElementById('dnaType').textContent;
    const dnaCode = document.getElementById('dnaCode').textContent;
    
    const shareText = `나의 업무 DNA는 "${dnaType}" (#${dnaCode})입니다! 해커스 NEXT GEN Solution으로 진단받았어요.`;
    const shareUrl = 'https://www.linkedin.com/sharing/share-offsite/?url=' + encodeURIComponent(window.location.href) + '&summary=' + encodeURIComponent(shareText);
    
    window.open(shareUrl, '_blank', 'width=600,height=400');
}

function downloadDNABadge() {
    alert('배지 다운로드 기능은 곧 제공될 예정입니다!');
}

function startLearningPath() {
    window.location.href = 'education.html';
}

function exploreCourses() {
    window.location.href = 'education.html';
}

// ========================================
// INTERACTIVE SALARY SIMULATOR
// ========================================

// Skill Database with salary impact data
const skillDatabase = {
    'IT': {
        'Python': { 
            icon: '🐍', 
            currentLevel: 3, 
            impact: { 1: 150, 2: 250, 3: 350, 4: 480, 5: 650 },
            courses: [
                { title: 'Python 중급 문법 마스터', duration: '2개월', description: '고급 문법과 라이브러리 활용' },
                { title: 'Python 데이터 처리 실무', duration: '2개월', description: 'Pandas, NumPy 실전 프로젝트' }
            ]
        },
        '데이터 분석': { 
            icon: '📊', 
            currentLevel: 3, 
            impact: { 1: 120, 2: 220, 3: 320, 4: 450, 5: 600 },
            courses: [
                { title: '고급 데이터 분석 기법', duration: '3개월', description: '통계 분석 및 시각화' },
                { title: '비즈니스 인텔리전스 실무', duration: '2개월', description: 'BI 도구 활용 및 대시보드 구축' }
            ]
        },
        '머신러닝': { 
            icon: '🤖', 
            currentLevel: 2, 
            impact: { 1: 100, 2: 200, 3: 380, 4: 580, 5: 800 },
            courses: [
                { title: '머신러닝 기초부터 심화까지', duration: '4개월', description: '알고리즘 이론 및 실습' },
                { title: '딥러닝 프로젝트 실전', duration: '3개월', description: 'TensorFlow/PyTorch 활용' }
            ]
        },
        '클라우드': { 
            icon: '☁️', 
            currentLevel: 2, 
            impact: { 1: 130, 2: 240, 3: 380, 4: 550, 5: 750 },
            courses: [
                { title: 'AWS 아키텍처 설계', duration: '3개월', description: '클라우드 인프라 구축' },
                { title: 'DevOps 엔지니어링', duration: '3개월', description: 'CI/CD 파이프라인 구축' }
            ]
        },
        '프로젝트 관리': { 
            icon: '📋', 
            currentLevel: 2, 
            impact: { 1: 80, 2: 150, 3: 250, 4: 370, 5: 520 },
            courses: [
                { title: '애자일 프로젝트 관리', duration: '2개월', description: 'Scrum 마스터 양성' },
                { title: '팀 리더십 스킬', duration: '2개월', description: '효과적인 팀 운영 전략' }
            ]
        }
    },
    '금융': {
        '금융상품 지식': { icon: '💳', currentLevel: 3, impact: { 1: 140, 2: 240, 3: 350, 4: 490, 5: 670 } },
        '데이터 분석': { icon: '📊', currentLevel: 2, impact: { 1: 120, 2: 220, 3: 340, 4: 480, 5: 650 } },
        'Risk Management': { icon: '⚠️', currentLevel: 2, impact: { 1: 110, 2: 210, 3: 330, 4: 470, 5: 640 } },
        '규제 준수': { icon: '📜', currentLevel: 3, impact: { 1: 100, 2: 180, 3: 280, 4: 400, 5: 550 } }
    },
    '마케팅': {
        '디지털 마케팅': { icon: '📱', currentLevel: 3, impact: { 1: 130, 2: 230, 3: 340, 4: 480, 5: 650 } },
        'SNS 마케팅': { icon: '📷', currentLevel: 2, impact: { 1: 110, 2: 200, 3: 310, 4: 440, 5: 600 } },
        '브랜딩': { icon: '🎨', currentLevel: 2, impact: { 1: 100, 2: 190, 3: 300, 4: 430, 5: 590 } },
        '데이터 분석': { icon: '📊', currentLevel: 2, impact: { 1: 120, 2: 220, 3: 340, 4: 480, 5: 650 } }
    }
};

// Selected skills state
let selectedSkills = {};

// Initialize Skill Selector
function initializeSkillSelector() {
    const userData = getUserData();
    const industry = userData.industry || 'IT';
    const skills = skillDatabase[industry] || skillDatabase['IT'];
    
    const grid = document.getElementById('skillSelectorGrid');
    if (!grid) return;
    
    grid.innerHTML = '';
    
    Object.keys(skills).forEach(skillName => {
        const skill = skills[skillName];
        const skillCard = document.createElement('div');
        skillCard.className = 'skill-selector-card';
        skillCard.innerHTML = `
            <div class="skill-header">
                <span class="skill-icon">${skill.icon}</span>
                <span class="skill-name">${skillName}</span>
            </div>
            <div class="skill-level">
                <label>현재 Lv.${skill.currentLevel}</label>
                <div class="level-selector">
                    ${[1, 2, 3, 4, 5].map(level => `
                        <button class="level-btn ${level === skill.currentLevel ? 'current' : ''} ${level < skill.currentLevel ? 'disabled' : ''}" 
                                data-skill="${skillName}" 
                                data-level="${level}"
                                ${level <= skill.currentLevel ? 'disabled' : ''}>
                            ${level}
                        </button>
                    `).join('')}
                </div>
            </div>
        `;
        
        grid.appendChild(skillCard);
    });
    
    // Add event listeners
    document.querySelectorAll('.level-btn:not(.disabled)').forEach(btn => {
        btn.addEventListener('click', function() {
            const skillName = this.dataset.skill;
            const targetLevel = parseInt(this.dataset.level);
            toggleSkillSelection(skillName, targetLevel, industry);
        });
    });
}

// Toggle skill selection
function toggleSkillSelection(skillName, targetLevel, industry) {
    const skills = skillDatabase[industry];
    const skill = skills[skillName];
    
    // Toggle selection
    if (selectedSkills[skillName] && selectedSkills[skillName].targetLevel === targetLevel) {
        delete selectedSkills[skillName];
    } else {
        selectedSkills[skillName] = {
            currentLevel: skill.currentLevel,
            targetLevel: targetLevel,
            icon: skill.icon,
            impact: skill.impact,
            courses: skill.courses || []
        };
    }
    
    // Update UI
    updateLevelButtons();
    updateSalarySimulation();
    updateLearningPath();
}

// Update level button states
function updateLevelButtons() {
    document.querySelectorAll('.level-btn:not(.disabled)').forEach(btn => {
        const skillName = btn.dataset.skill;
        const level = parseInt(btn.dataset.level);
        
        if (selectedSkills[skillName] && selectedSkills[skillName].targetLevel === level) {
            btn.classList.add('selected');
        } else {
            btn.classList.remove('selected');
        }
    });
}

// Update salary simulation
function updateSalarySimulation() {
    const listContainer = document.getElementById('skillImpactList');
    const totalContainer = document.getElementById('salaryTotal');
    const totalAmount = document.getElementById('totalIncrease');
    
    if (!listContainer) return;
    
    if (Object.keys(selectedSkills).length === 0) {
        listContainer.innerHTML = '<p class=\"empty-state\">위에서 강화할 스킬을 선택해주세요</p>';
        if (totalContainer) totalContainer.style.display = 'none';
        
        // Update main salary display
        const userData = getUserData();
        const baseSalary = calculateBaseSalary(userData);
        document.getElementById('currentSalary').textContent = formatSalary(baseSalary);
        document.getElementById('potentialSalary').textContent = formatSalary(baseSalary);
        
        const increaseElement = document.querySelector('.salary-desc .increase');
        if (increaseElement) {
            increaseElement.textContent = '+0만원 (0%)';
        }
        
        return;
    }
    
    // Calculate impacts
    let totalIncrease = 0;
    let html = '';
    
    Object.keys(selectedSkills).forEach(skillName => {
        const skill = selectedSkills[skillName];
        const currentImpact = skill.impact[skill.currentLevel] || 0;
        const targetImpact = skill.impact[skill.targetLevel] || 0;
        const increase = targetImpact - currentImpact;
        
        totalIncrease += increase;
        
        html += `
            <div class=\"skill-impact-item\">
                <div class=\"skill-info\">
                    <span class=\"skill-name\">${skill.icon} ${skillName}</span>
                    <span class=\"skill-current\">Lv.${skill.currentLevel} → Lv.${skill.targetLevel}</span>
                </div>
                <div class=\"impact-value\">+${increase}만원</div>
            </div>
        `;
    });
    
    listContainer.innerHTML = html;
    
    // Update total
    if (totalContainer && totalAmount) {
        totalContainer.style.display = 'flex';
        const userData = getUserData();
        const baseSalary = calculateBaseSalary(userData);
        const percentage = Math.round((totalIncrease / baseSalary) * 100);
        totalAmount.textContent = `+${totalIncrease}만원 (+${percentage}%)`;
    }
    
    // Update main salary display
    const userData = getUserData();
    const baseSalary = calculateBaseSalary(userData);
    const newSalary = baseSalary + totalIncrease;
    
    document.getElementById('currentSalary').textContent = formatSalary(baseSalary);
    document.getElementById('potentialSalary').textContent = formatSalary(newSalary);
    
    const increaseElement = document.querySelector('.salary-desc .increase');
    if (increaseElement) {
        const percentage = Math.round((totalIncrease / baseSalary) * 100);
        increaseElement.textContent = `+${totalIncrease}만원 (+${percentage}%)`;
    }
}

// Update learning path based on selected skills
function updateLearningPath() {
    const container = document.getElementById('learningPathEnhanced');
    if (!container) return;
    
    if (Object.keys(selectedSkills).length === 0) {
        container.innerHTML = '<p class=\"empty-state\">스킬을 선택하면 맞춤 학습 경로가 표시됩니다</p>';
        return;
    }
    
    let html = '';
    let stepNumber = 1;
    
    Object.keys(selectedSkills).forEach(skillName => {
        const skill = selectedSkills[skillName];
        const courses = skill.courses || [
            { 
                title: `${skillName} 실력 향상 과정`, 
                duration: '3개월', 
                description: `Lv.${skill.currentLevel}에서 Lv.${skill.targetLevel}로 성장하기 위한 집중 학습` 
            }
        ];
        
        courses.forEach(course => {
            html += `
                <div class=\"learning-step-card\">
                    <div class=\"step-number-circle\">${stepNumber}</div>
                    <div class=\"step-content-box\">
                        <h5 class=\"step-title\">${course.title}</h5>
                        <p class=\"step-description\">${course.description}</p>
                        <span class=\"step-duration\">${course.duration} 과정</span>
                    </div>
                </div>
            `;
            stepNumber++;
        });
    });
    
    container.innerHTML = html;
    
    // Update salary growth chart
    updateSalaryGrowthChart();
}

// ========================================
// SALARY GROWTH PREDICTOR CHART
// ========================================

let salaryGrowthChartInstance = null;

// Render salary growth chart
function renderSalaryGrowthChart() {
    const canvas = document.getElementById('salaryGrowthChart');
    if (!canvas) {
        console.warn('⚠️ salaryGrowthChart 캔버스를 찾을 수 없습니다.');
        return;
    }
    
    if (typeof Chart === 'undefined') {
        console.error('❌ Chart.js 라이브러리가 로드되지 않았습니다.');
        return;
    }
    
    const ctx = canvas.getContext('2d');
    
    // Get base salary
    const userData = getUserData();
    const baseSalary = calculateBaseSalary(userData);
    
    // Initial data (no skills selected)
    const labels = ['현재', '1년 후', '2년 후', '3년 후'];
    const currentSkillData = [
        baseSalary,
        Math.round(baseSalary + (baseSalary * 0.03)),  // 3% annual increase
        Math.round(baseSalary + (baseSalary * 0.06)),
        Math.round(baseSalary + (baseSalary * 0.09))
    ];
    const upskillingData = currentSkillData.slice();  // Same initially
    
    // Destroy existing chart
    if (salaryGrowthChartInstance) {
        salaryGrowthChartInstance.destroy();
    }
    
    console.log('📊 연봉 성장 차트 생성 중...', {
        baseSalary,
        labels,
        currentSkillData,
        upskillingData
    });
    
    salaryGrowthChartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Upskilling 후 예상 연봉',
                    data: upskillingData,
                    borderColor: 'rgb(102, 126, 234)',
                    backgroundColor: (context) => {
                        const ctx = context.chart.ctx;
                        const gradient = ctx.createLinearGradient(0, 0, 0, 400);
                        gradient.addColorStop(0, 'rgba(102, 126, 234, 0.25)');
                        gradient.addColorStop(0.5, 'rgba(102, 126, 234, 0.12)');
                        gradient.addColorStop(1, 'rgba(102, 126, 234, 0.02)');
                        return gradient;
                    },
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointRadius: 6,
                    pointHoverRadius: 8,
                    pointBackgroundColor: 'rgb(102, 126, 234)',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2
                },
                {
                    label: '현재 스킬 유지 시',
                    data: currentSkillData,
                    borderColor: 'rgba(156, 163, 175, 0.8)',
                    backgroundColor: 'transparent',
                    borderWidth: 2,
                    borderDash: [5, 5],
                    fill: false,
                    tension: 0.4,
                    pointRadius: 4,
                    pointHoverRadius: 6,
                    pointBackgroundColor: 'rgba(156, 163, 175, 0.8)',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
                mode: 'index',
                intersect: false
            },
            plugins: {
                legend: {
                    display: false  // Using custom legend
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            let label = context.dataset.label || '';
                            if (label) {
                                label += ': ';
                            }
                            label += context.parsed.y.toLocaleString() + '만원';
                            return label;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: false,
                    min: Math.floor(baseSalary * 0.9 / 500) * 500,
                    max: Math.ceil(baseSalary * 1.5 / 500) * 500,
                    ticks: {
                        callback: function(value) {
                            return value.toLocaleString();
                        },
                        font: {
                            size: 12,
                            weight: '500'
                        },
                        color: '#4a5568'
                    },
                    grid: {
                        color: 'rgba(203, 213, 225, 0.5)',
                        drawBorder: false
                    },
                    title: {
                        display: true,
                        text: '연봉 (만원)',
                        font: {
                            size: 13,
                            weight: '600'
                        },
                        color: '#2d3748'
                    }
                },
                x: {
                    ticks: {
                        font: {
                            size: 12,
                            weight: '500'
                        },
                        color: '#4a5568'
                    },
                    grid: {
                        display: false
                    },
                    title: {
                        display: true,
                        text: '기간',
                        font: {
                            size: 13,
                            weight: '600'
                        },
                        color: '#2d3748'
                    }
                }
            }
        }
    });
}

// Update salary growth chart based on selected skills
function updateSalaryGrowthChart() {
    if (!salaryGrowthChartInstance) return;
    
    const userData = getUserData();
    const baseSalary = calculateBaseSalary(userData);
    
    // Calculate total salary increase from selected skills
    let totalIncrease = 0;
    Object.keys(selectedSkills).forEach(skillName => {
        const skill = selectedSkills[skillName];
        const currentImpact = skill.impact[skill.currentLevel] || 0;
        const targetImpact = skill.impact[skill.targetLevel] || 0;
        totalIncrease += (targetImpact - currentImpact);
    });
    
    // Calculate growth trajectory
    const labels = ['현재', '1년 후', '2년 후', '3년 후'];
    
    // Current skill maintenance (3% annual)
    const currentSkillData = [
        baseSalary,
        Math.round(baseSalary + (baseSalary * 0.03)),
        Math.round(baseSalary + (baseSalary * 0.06)),
        Math.round(baseSalary + (baseSalary * 0.09))
    ];
    
    // Upskilling trajectory (progressive growth)
    const upskillingData = [
        baseSalary,
        Math.round(baseSalary + (totalIncrease * 0.4) + (baseSalary * 0.03)),  // 40% of skill impact + market growth
        Math.round(baseSalary + (totalIncrease * 0.7) + (baseSalary * 0.06)),  // 70% of skill impact + market growth
        Math.round(baseSalary + totalIncrease + (baseSalary * 0.09))            // Full skill impact + market growth
    ];
    
    // Update chart data
    salaryGrowthChartInstance.data.datasets[0].data = upskillingData;
    salaryGrowthChartInstance.data.datasets[1].data = currentSkillData;
    
    // Update y-axis range
    const maxValue = Math.max(...upskillingData, ...currentSkillData);
    const minValue = Math.min(...upskillingData, ...currentSkillData);
    salaryGrowthChartInstance.options.scales.y.min = Math.floor(minValue * 0.95 / 500) * 500;
    salaryGrowthChartInstance.options.scales.y.max = Math.ceil(maxValue * 1.05 / 500) * 500;
    
    // Update growth rate badge
    const growthBadge = document.getElementById('growthRateBadge');
    const growthRateText = document.getElementById('growthRateText');
    
    if (Object.keys(selectedSkills).length > 0 && totalIncrease > 0) {
        const threeYearGrowth = upskillingData[3] - currentSkillData[3];
        const growthPercentage = Math.round((threeYearGrowth / currentSkillData[3]) * 100);
        growthRateText.textContent = `+${growthPercentage}%`;
        growthBadge.style.display = 'inline-flex';
    } else {
        growthBadge.style.display = 'none';
    }
    
    salaryGrowthChartInstance.update();
}

// Get User Data from localStorage
function getUserData() {
    const resultsJSON = localStorage.getItem('kapp_assessment_result') || localStorage.getItem('assessment_result');
    
    if (resultsJSON) {
        try {
            const results = JSON.parse(resultsJSON);
            return results.userData || { position: '대리', industry: 'IT', job: '개발자' };
        } catch (error) {
            console.error('Failed to parse user data:', error);
        }
    }
    
    return { position: '대리', industry: 'IT', job: '개발자' };
}

// Get Position-based Average Scores
function getPositionAverage(position) {
    const averages = {
        '인턴': { knowledge: 55, application: 52, performance: 50, productivity: 54 },
        '사원': { knowledge: 62, application: 60, performance: 58, productivity: 63 },
        '주임': { knowledge: 68, application: 66, performance: 65, productivity: 69 },
        '대리': { knowledge: 72, application: 70, performance: 71, productivity: 74 },
        '과장': { knowledge: 78, application: 76, performance: 77, productivity: 79 },
        '차장': { knowledge: 83, application: 81, performance: 82, productivity: 84 },
        '부장': { knowledge: 87, application: 85, performance: 86, productivity: 88 },
        '임원': { knowledge: 92, application: 90, performance: 91, productivity: 93 }
    };
    
    return averages[position] || averages['대리'];
}

// Generate AI Insights based on scores and user data
function generateAIInsights(scores, userData) {
    const insights = [];
    const avgScore = (scores.knowledge + scores.application + scores.performance + scores.productivity) / 4;
    const positionAvg = getPositionAverage(userData.position);
    const positionAvgScore = (positionAvg.knowledge + positionAvg.application + positionAvg.performance + positionAvg.productivity) / 4;
    
    // Overall Performance Insight
    if (avgScore >= positionAvgScore + 10) {
        insights.push({
            icon: '🌟',
            title: '탁월한 성과',
            text: `${userData.position} 평균보다 ${Math.round(avgScore - positionAvgScore)}점 높은 점수를 기록했습니다. 현재 역량은 시니어 레벨에 근접하며, 승진 또는 직무 전환에 유리한 위치입니다.`
        });
    } else if (avgScore >= positionAvgScore) {
        insights.push({
            icon: '👍',
            title: '우수한 역량',
            text: `${userData.position} 평균 이상의 역량을 보유하고 있습니다. 지속적인 학습으로 더 빠른 성장이 가능합니다.`
        });
    } else {
        insights.push({
            icon: '💪',
            title: '성장 기회',
            text: `현재 ${userData.position} 평균 대비 ${Math.round(positionAvgScore - avgScore)}점 낮습니다. 맞춤 학습 프로그램을 통해 빠르게 역량을 향상시킬 수 있습니다.`
        });
    }
    
    // Strengths
    const strengths = [];
    if (scores.knowledge >= 80) strengths.push('지식(Knowledge)');
    if (scores.application >= 80) strengths.push('적용(Application)');
    if (scores.performance >= 80) strengths.push('성과(Performance)');
    if (scores.productivity >= 80) strengths.push('생산성(Productivity)');
    
    if (strengths.length > 0) {
        insights.push({
            icon: '💎',
            title: '핵심 강점',
            text: `${strengths.join(', ')} 영역에서 높은 점수를 기록했습니다. 이 강점을 활용한 프로젝트나 역할로 더 큰 성과를 낼 수 있습니다.`
        });
    }
    
    // Improvement Areas
    const weaknesses = [];
    if (scores.knowledge < 70) weaknesses.push({ name: '지식', priority: 1 });
    if (scores.application < 70) weaknesses.push({ name: '적용', priority: 2 });
    if (scores.performance < 70) weaknesses.push({ name: '성과', priority: 3 });
    if (scores.productivity < 70) weaknesses.push({ name: '생산성', priority: 2 });
    
    if (weaknesses.length > 0) {
        const topWeakness = weaknesses.sort((a, b) => a.priority - b.priority)[0];
        insights.push({
            icon: '🎯',
            title: '우선 개선 영역',
            text: `${topWeakness.name} 영역의 집중 학습을 추천합니다. 이 영역을 10점 향상시키면 전체 평가에서 상위 30%로 도약할 수 있습니다.`
        });
    }
    
    // Industry-specific insights
    if (userData.industry === 'IT') {
        insights.push({
            icon: '🚀',
            title: 'IT 업계 전망',
            text: 'IT 분야는 지속적인 학습이 필수입니다. 현재 역량으로 3년 내 시니어 개발자로 성장 가능하며, 추가로 클라우드/AI 스킬을 습득하면 연봉 20% 이상 상승이 기대됩니다.'
        });
    } else if (userData.industry === '금융') {
        insights.push({
            icon: '💰',
            title: '금융 업계 인사이트',
            text: '금융권에서는 규제 준수와 리스크 관리 역량이 중요합니다. 데이터 분석 능력을 강화하면 핀테크 분야로의 전환도 가능합니다.'
        });
    }
    
    return insights;
}

// Render Growth Trend Chart
function renderGrowthTrendChart() {
    const canvas = document.getElementById('growthTrendChart');
    if (!canvas) {
        console.warn('⚠️ growthTrendChart 캔버스를 찾을 수 없습니다.');
        return;
    }
    
    console.log('📈 스킬 성장 추이 차트 렌더링 시작...');
    
    const ctx = canvas.getContext('2d');
    
    // Get current scores
    const knowledge = parseInt(document.getElementById('knowledgeScore')?.textContent || 85);
    const application = parseInt(document.getElementById('applicationScore')?.textContent || 78);
    const performance = parseInt(document.getElementById('performanceScore')?.textContent || 82);
    const productivity = parseInt(document.getElementById('productivityScore')?.textContent || 90);
    
    // Simulate 6-month growth data
    const months = ['6개월 전', '5개월 전', '4개월 전', '3개월 전', '2개월 전', '1개월 전', '현재'];
    
    // Generate growth trends (simulated)
    const knowledgeTrend = generateGrowthTrend(knowledge, 7);
    const applicationTrend = generateGrowthTrend(application, 7);
    const performanceTrend = generateGrowthTrend(performance, 7);
    const productivityTrend = generateGrowthTrend(productivity, 7);
    
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: months,
            datasets: [
                {
                    label: '지식 (Knowledge)',
                    data: knowledgeTrend,
                    borderColor: 'rgb(139, 92, 246)',
                    backgroundColor: 'rgba(139, 92, 246, 0.1)',
                    tension: 0.4,
                    fill: true
                },
                {
                    label: '적용 (Application)',
                    data: applicationTrend,
                    borderColor: 'rgb(59, 130, 246)',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    tension: 0.4,
                    fill: true
                },
                {
                    label: '성과 (Performance)',
                    data: performanceTrend,
                    borderColor: 'rgb(16, 185, 129)',
                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
                    tension: 0.4,
                    fill: true
                },
                {
                    label: '생산성 (Productivity)',
                    data: productivityTrend,
                    borderColor: 'rgb(245, 158, 11)',
                    backgroundColor: 'rgba(245, 158, 11, 0.1)',
                    tension: 0.4,
                    fill: true
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            interaction: {
                mode: 'index',
                intersect: false
            },
            plugins: {
                legend: {
                    display: true,
                    position: 'top'
                },
                tooltip: {
                    mode: 'index',
                    intersect: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    title: {
                        display: true,
                        text: '점수'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: '기간'
                    }
                }
            }
        }
    });
    
    console.log('✅ 스킬 성장 추이 차트 렌더링 완료');
}

// Generate growth trend data (simulated backward from current score)
function generateGrowthTrend(currentScore, points) {
    const trend = [];
    const avgGrowthPerMonth = 2; // Average 2 points per month
    const variance = 3; // Random variance
    
    for (let i = points - 1; i >= 0; i--) {
        if (i === points - 1) {
            // Current score
            trend.unshift(currentScore);
        } else {
            // Calculate previous scores with some randomness
            const previousScore = currentScore - (avgGrowthPerMonth * (points - 1 - i)) + (Math.random() * variance - variance / 2);
            trend.unshift(Math.max(50, Math.min(95, Math.round(previousScore))));
        }
    }
    
    return trend;
}

// Update Benchmark Stats
function updateBenchmarkStats() {
    // Get actual scores
    const knowledge = parseInt(document.getElementById('knowledgeScore')?.textContent || 85);
    const application = parseInt(document.getElementById('applicationScore')?.textContent || 78);
    const performance = parseInt(document.getElementById('performanceScore')?.textContent || 82);
    const productivity = parseInt(document.getElementById('productivityScore')?.textContent || 90);
    
    const myAvg = Math.round((knowledge + application + performance + productivity) / 4);
    
    // Get position average
    const userData = getUserData();
    const positionAverage = getPositionAverage(userData.position);
    const positionAvg = Math.round((positionAverage.knowledge + positionAverage.application + positionAverage.performance + positionAverage.productivity) / 4);
    
    // Calculate percentile (rough estimate)
    const diff = myAvg - positionAvg;
    let percentile;
    if (diff >= 15) percentile = '상위 10%';
    else if (diff >= 10) percentile = '상위 20%';
    else if (diff >= 5) percentile = '상위 35%';
    else if (diff >= 0) percentile = '상위 50%';
    else if (diff >= -5) percentile = '상위 65%';
    else percentile = '상위 80%';
    
    // Update UI
    document.getElementById('positionAvgScore').textContent = positionAvg + '점';
    document.getElementById('myAvgScore').textContent = myAvg + '점';
    document.getElementById('percentileRank').textContent = percentile;
}
