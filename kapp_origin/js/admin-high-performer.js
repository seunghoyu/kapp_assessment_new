// ========================================
// ADMIN HIGH-PERFORMER DNA CLONING & SKILL RISK MANAGEMENT
// ========================================
// 5. High-Performer DNA Cloning
// 6. Skill Risk Management
// ========================================

// Sample high-performer data (상위 10% 성과자)
const highPerformerData = {
    all: {
        count: 18,
        avgScore: 92,
        kappProfile: {
            knowledge: 94,
            application: 91,
            performance: 93,
            productivity: 90
        },
        commonTraits: ['빠른 학습', '문제 해결', '주도성', '협업'],
        industries: {
            'IT': 6,
            '금융': 4,
            '마케팅': 3,
            '영업': 2,
            '인사': 1,
            '재무': 1,
            '고객지원': 1
        }
    },
    dev: {
        count: 6,
        avgScore: 94,
        kappProfile: {
            knowledge: 96,
            application: 93,
            performance: 92,
            productivity: 95
        },
        commonTraits: ['코드 품질', '시스템 설계', '기술 리더십', '멘토링']
    },
    marketing: {
        count: 3,
        avgScore: 91,
        kappProfile: {
            knowledge: 92,
            application: 90,
            performance: 94,
            productivity: 88
        },
        commonTraits: ['창의성', '데이터 분석', '트렌드 파악', '커뮤니케이션']
    },
    sales: {
        count: 2,
        avgScore: 93,
        kappProfile: {
            knowledge: 90,
            application: 95,
            performance: 94,
            productivity: 93
        },
        commonTraits: ['고객 이해', '설득력', '관계 구축', '목표 지향']
    },
    hr: {
        count: 1,
        avgScore: 90,
        kappProfile: {
            knowledge: 91,
            application: 89,
            performance: 92,
            productivity: 88
        },
        commonTraits: ['공감 능력', '조직 이해', '소통', '정책 이해']
    },
    finance: {
        count: 1,
        avgScore: 92,
        kappProfile: {
            knowledge: 95,
            application: 90,
            performance: 91,
            productivity: 92
        },
        commonTraits: ['정확성', '분석력', '리스크 관리', '재무 지식']
    },
    cs: {
        count: 1,
        avgScore: 89,
        kappProfile: {
            knowledge: 88,
            application: 90,
            performance: 92,
            productivity: 86
        },
        commonTraits: ['고객 중심', '문제 해결', '인내심', '소통']
    }
};

// Current team average data (현재 팀 평균)
const teamAverageData = {
    all: {
        avgScore: 76,
        kappProfile: {
            knowledge: 75,
            application: 74,
            performance: 78,
            productivity: 77
        }
    },
    dev: {
        avgScore: 75,
        kappProfile: {
            knowledge: 72,
            application: 70,
            performance: 78,
            productivity: 80
        }
    },
    marketing: {
        avgScore: 79,
        kappProfile: {
            knowledge: 82,
            application: 78,
            performance: 85,
            productivity: 72
        }
    },
    sales: {
        avgScore: 78,
        kappProfile: {
            knowledge: 78,
            application: 82,
            performance: 85,
            productivity: 68
        }
    },
    hr: {
        avgScore: 77,
        kappProfile: {
            knowledge: 85,
            application: 72,
            performance: 88,
            productivity: 63
        }
    },
    finance: {
        avgScore: 80,
        kappProfile: {
            knowledge: 85,
            application: 76,
            performance: 79,
            productivity: 80
        }
    },
    cs: {
        avgScore: 72,
        kappProfile: {
            knowledge: 68,
            application: 72,
            performance: 74,
            productivity: 74
        }
    }
};

// Skill risk data (스킬 리스크 데이터)
const skillRiskData = [
    {
        id: 1,
        department: '마케팅팀',
        skill: '데이터 시각화',
        riskLevel: 'critical',
        expertCount: 1,
        requiredCount: 3,
        impactDescription: '현재 전문가가 1명뿐이며, 이 역량이 결핍될 경우 전체 프로젝트 생산성이 30% 하락할 위험',
        recommendation: 'Power BI/Tableau 교육 과정 즉시 배정 (최소 2명)',
        estimatedImpact: 30,
        probability: 'high'
    },
    {
        id: 2,
        department: '개발팀',
        skill: 'AI/ML',
        riskLevel: 'critical',
        expertCount: 2,
        requiredCount: 5,
        impactDescription: 'AI 프로젝트가 증가하고 있으나 전문가가 부족하여 프로젝트 지연 발생',
        recommendation: 'AI/ML 기초 및 심화 과정 배정 (3명)',
        estimatedImpact: 40,
        probability: 'high'
    },
    {
        id: 3,
        department: '영업팀',
        skill: '데이터 분석',
        riskLevel: 'high',
        expertCount: 1,
        requiredCount: 4,
        impactDescription: '데이터 기반 영업 전략 수립이 어려워 매출 기회 손실',
        recommendation: '데이터 기반 의사결정 교육 (3명)',
        estimatedImpact: 25,
        probability: 'medium'
    },
    {
        id: 4,
        department: '인사팀',
        skill: 'HRIS 시스템',
        riskLevel: 'high',
        expertCount: 1,
        requiredCount: 2,
        impactDescription: 'HR 시스템 관리자가 1명뿐이며, 퇴사 시 운영 중단 위험',
        recommendation: 'HRIS 시스템 활용 교육 (1명)',
        estimatedImpact: 35,
        probability: 'low'
    },
    {
        id: 5,
        department: '재무팀',
        skill: 'ERP 시스템',
        riskLevel: 'critical',
        expertCount: 1,
        requiredCount: 3,
        impactDescription: 'ERP 전문가 부족으로 업무 효율성 저하 및 오류 발생',
        recommendation: 'ERP 시스템 집중 교육 (2명)',
        estimatedImpact: 45,
        probability: 'medium'
    },
    {
        id: 6,
        department: '고객지원팀',
        skill: '기술 지원',
        riskLevel: 'critical',
        expertCount: 0,
        requiredCount: 3,
        impactDescription: '기술적 문제 해결 능력 부족으로 고객 만족도 하락',
        recommendation: '기술 지원 기초 교육 즉시 시행 (3명)',
        estimatedImpact: 50,
        probability: 'high'
    },
    {
        id: 7,
        department: '개발팀',
        skill: 'Cloud 인프라',
        riskLevel: 'high',
        expertCount: 2,
        requiredCount: 4,
        impactDescription: '클라우드 전환이 진행 중이나 전문가 부족',
        recommendation: 'AWS/Azure 교육 (2명)',
        estimatedImpact: 20,
        probability: 'medium'
    },
    {
        id: 8,
        department: '마케팅팀',
        skill: 'SEO/SEM',
        riskLevel: 'medium',
        expertCount: 2,
        requiredCount: 3,
        impactDescription: '검색 엔진 최적화 전문가 부족',
        recommendation: 'SEO/SEM 심화 과정 (1명)',
        estimatedImpact: 15,
        probability: 'low'
    },
    {
        id: 9,
        department: '영업팀',
        skill: 'CRM 시스템',
        riskLevel: 'medium',
        expertCount: 3,
        requiredCount: 5,
        impactDescription: 'CRM 활용도가 낮아 영업 효율성 저하',
        recommendation: 'CRM 활용 실무 교육 (2명)',
        estimatedImpact: 18,
        probability: 'low'
    },
    {
        id: 10,
        department: '재무팀',
        skill: '데이터 시각화',
        riskLevel: 'medium',
        expertCount: 1,
        requiredCount: 2,
        impactDescription: '재무 보고서 시각화 능력 부족',
        recommendation: 'Excel 고급 및 시각화 도구 교육 (1명)',
        estimatedImpact: 12,
        probability: 'low'
    }
];

let goldenStandardChart = null;

// ========================================
// 5. HIGH-PERFORMER DNA CLONING
// ========================================

function analyzeHighPerformers() {
    const team = document.getElementById('cloneTeamSelect').value;
    
    console.log('🧬 고성과자 DNA 분석:', team);
    
    renderGoldenStandard(team);
    renderGapAnalysis(team);
}

function renderGoldenStandard(team) {
    const container = document.getElementById('goldenStandardChart');
    
    if (!container) {
        console.warn('⚠️ goldenStandardChart 컨테이너를 찾을 수 없습니다.');
        return;
    }
    
    // Clear container and create canvas
    container.innerHTML = '<canvas id="goldenStandardChartCanvas"></canvas>';
    const canvas = document.getElementById('goldenStandardChartCanvas');
    const ctx = canvas.getContext('2d');
    
    const highPerformer = highPerformerData[team];
    const teamAverage = teamAverageData[team];
    
    // Destroy existing chart
    if (goldenStandardChart) {
        goldenStandardChart.destroy();
    }
    
    goldenStandardChart = new Chart(ctx, {
        type: 'radar',
        data: {
            labels: ['Knowledge', 'Application', 'Performance', 'Productivity'],
            datasets: [
                {
                    label: '고성과자 (상위 10%)',
                    data: [
                        highPerformer.kappProfile.knowledge,
                        highPerformer.kappProfile.application,
                        highPerformer.kappProfile.performance,
                        highPerformer.kappProfile.productivity
                    ],
                    backgroundColor: 'rgba(255, 215, 0, 0.2)',
                    borderColor: 'rgb(255, 215, 0)',
                    borderWidth: 3,
                    pointBackgroundColor: 'rgb(255, 215, 0)',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2,
                    pointRadius: 6
                },
                {
                    label: '팀 평균',
                    data: [
                        teamAverage.kappProfile.knowledge,
                        teamAverage.kappProfile.application,
                        teamAverage.kappProfile.performance,
                        teamAverage.kappProfile.productivity
                    ],
                    backgroundColor: 'rgba(59, 130, 246, 0.2)',
                    borderColor: 'rgb(59, 130, 246)',
                    borderWidth: 2,
                    pointBackgroundColor: 'rgb(59, 130, 246)',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2,
                    pointRadius: 5
                }
            ]
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
                            weight: '600'
                        }
                    }
                }
            },
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        font: {
                            size: 13,
                            weight: '600'
                        },
                        padding: 15
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
                    }
                }
            }
        }
    });
}

function renderGapAnalysis(team) {
    const container = document.getElementById('gapAnalysisContent');
    
    const highPerformer = highPerformerData[team];
    const teamAverage = teamAverageData[team];
    
    // Calculate gaps
    const gaps = {
        knowledge: highPerformer.kappProfile.knowledge - teamAverage.kappProfile.knowledge,
        application: highPerformer.kappProfile.application - teamAverage.kappProfile.application,
        performance: highPerformer.kappProfile.performance - teamAverage.kappProfile.performance,
        productivity: highPerformer.kappProfile.productivity - teamAverage.kappProfile.productivity
    };
    
    // Sort gaps by size (descending)
    const sortedGaps = Object.entries(gaps).sort((a, b) => b[1] - a[1]);
    
    // Calculate average gap
    const avgGap = (gaps.knowledge + gaps.application + gaps.performance + gaps.productivity) / 4;
    
    const teamName = team === 'all' ? '전체 조직' : 
                     team === 'dev' ? '개발팀' :
                     team === 'marketing' ? '마케팅팀' :
                     team === 'sales' ? '영업팀' :
                     team === 'hr' ? '인사팀' :
                     team === 'finance' ? '재무팀' :
                     team === 'cs' ? '고객지원팀' : team;
    
    let html = `
        <div class="gap-summary">
            <div class="gap-stat">
                <h4>평균 격차</h4>
                <p class="gap-value" style="color: #ef4444;">${avgGap.toFixed(1)}점</p>
            </div>
            <div class="gap-stat">
                <h4>고성과자 수</h4>
                <p class="gap-value" style="color: #10b981;">${highPerformer.count}명</p>
            </div>
            <div class="gap-stat">
                <h4>고성과자 평균</h4>
                <p class="gap-value" style="color: #f59e0b;">${highPerformer.avgScore}점</p>
            </div>
            <div class="gap-stat">
                <h4>팀 평균</h4>
                <p class="gap-value" style="color: #3b82f6;">${teamAverage.avgScore}점</p>
            </div>
        </div>
        
        <div class="gap-details">
            <h4>📊 영역별 격차 분석</h4>
            <p style="margin-bottom: 1rem; color: #6b7280;">
                <strong>${teamName}</strong>의 평균 역량이 사내 고성과자 대비 가장 큰 차이를 보이는 영역:
            </p>
    `;
    
    sortedGaps.forEach(([category, gap], index) => {
        const categoryName = category === 'knowledge' ? 'Knowledge (지식)' :
                           category === 'application' ? 'Application (적용)' :
                           category === 'performance' ? 'Performance (수행)' :
                           'Productivity (생산성)';
        
        const gapClass = gap >= 20 ? 'critical' : gap >= 15 ? 'high' : gap >= 10 ? 'medium' : 'low';
        const gapIcon = gap >= 20 ? '🔴' : gap >= 15 ? '🟠' : gap >= 10 ? '🟡' : '🟢';
        
        html += `
            <div class="gap-item ${gapClass}">
                <div class="gap-header">
                    <span class="gap-rank">${index + 1}순위</span>
                    <span class="gap-category">${gapIcon} ${categoryName}</span>
                    <span class="gap-value-badge">${gap.toFixed(1)}점 차이</span>
                </div>
                <div class="gap-bar-container">
                    <div class="gap-bar">
                        <div class="gap-bar-fill ${gapClass}" style="width: ${(gap / 30) * 100}%"></div>
                    </div>
                </div>
                ${index === 0 ? `
                    <div class="gap-recommendation">
                        <strong>💡 우선 개선 영역:</strong> ${categoryName} 역량 강화를 위한 맞춤형 교육 프로그램을 최우선으로 배정하세요.
                    </div>
                ` : ''}
            </div>
        `;
    });
    
    html += `
        </div>
        
        <div class="gap-actions">
            <h4>🎯 추천 액션 플랜</h4>
            <div class="action-cards">
                <div class="action-card">
                    <div class="action-icon">📚</div>
                    <h5>1. 고성과자 멘토링 프로그램</h5>
                    <p>상위 10% 성과자를 멘토로 배정하여 1:1 코칭</p>
                </div>
                <div class="action-card">
                    <div class="action-icon">🎓</div>
                    <h5>2. 맞춤형 교육 과정</h5>
                    <p>격차가 큰 ${sortedGaps[0][0]} 영역 집중 교육</p>
                </div>
                <div class="action-card">
                    <div class="action-icon">🤝</div>
                    <h5>3. 크로스 팀 프로젝트</h5>
                    <p>고성과자와 협업 기회를 통한 실전 학습</p>
                </div>
            </div>
        </div>
        
        <div class="common-traits-box">
            <h4>✨ 고성과자 공통 특성</h4>
            <div class="traits-list">
                ${highPerformer.commonTraits.map(trait => `
                    <span class="trait-badge">${trait}</span>
                `).join('')}
            </div>
        </div>
    `;
    
    container.innerHTML = html;
}

// ========================================
// 6. SKILL RISK MANAGEMENT
// ========================================

function refreshRiskAnalysis() {
    console.log('⚠️ 스킬 리스크 재분석 중...');
    
    updateRiskCounts();
    renderRiskDetails('all');
}

function filterRiskLevel() {
    const level = document.getElementById('riskLevelFilter').value;
    console.log('🔍 리스크 레벨 필터:', level);
    
    renderRiskDetails(level);
}

function updateRiskCounts() {
    const counts = {
        critical: 0,
        high: 0,
        medium: 0,
        low: 0
    };
    
    skillRiskData.forEach(risk => {
        counts[risk.riskLevel]++;
    });
    
    document.getElementById('criticalRiskCount').textContent = counts.critical;
    document.getElementById('highRiskCount').textContent = counts.high;
    document.getElementById('mediumRiskCount').textContent = counts.medium;
    document.getElementById('lowRiskCount').textContent = counts.low;
}

function renderRiskDetails(level) {
    const container = document.getElementById('riskDetailsContainer');
    
    let filteredRisks = skillRiskData;
    if (level !== 'all') {
        filteredRisks = skillRiskData.filter(risk => risk.riskLevel === level);
    }
    
    // Sort by risk level priority
    const riskPriority = { critical: 0, high: 1, medium: 2, low: 3 };
    filteredRisks.sort((a, b) => riskPriority[a.riskLevel] - riskPriority[b.riskLevel]);
    
    let html = '<div class="risk-list">';
    
    if (filteredRisks.length === 0) {
        html += '<p class="no-risks">해당 레벨의 리스크가 없습니다.</p>';
    } else {
        filteredRisks.forEach(risk => {
            const riskIcon = risk.riskLevel === 'critical' ? '🔴' :
                           risk.riskLevel === 'high' ? '🟠' :
                           risk.riskLevel === 'medium' ? '🟡' : '🟢';
            
            const riskLabel = risk.riskLevel === 'critical' ? '긴급' :
                            risk.riskLevel === 'high' ? '높음' :
                            risk.riskLevel === 'medium' ? '보통' : '낮음';
            
            html += `
                <div class="risk-detail-card ${risk.riskLevel}">
                    <div class="risk-detail-header">
                        <div class="risk-title">
                            <span class="risk-icon-large">${riskIcon}</span>
                            <div>
                                <h4>${risk.department} - ${risk.skill}</h4>
                                <span class="risk-level-badge ${risk.riskLevel}">${riskLabel}</span>
                            </div>
                        </div>
                        <div class="risk-metrics">
                            <div class="risk-metric">
                                <label>현재 전문가</label>
                                <span class="metric-value ${risk.expertCount === 0 ? 'danger' : ''}">${risk.expertCount}명</span>
                            </div>
                            <div class="risk-metric">
                                <label>필요 인원</label>
                                <span class="metric-value">${risk.requiredCount}명</span>
                            </div>
                            <div class="risk-metric">
                                <label>예상 영향</label>
                                <span class="metric-value danger">${risk.estimatedImpact}%</span>
                            </div>
                        </div>
                    </div>
                    <div class="risk-detail-body">
                        <div class="risk-description">
                            <h5>⚠️ 리스크 상황</h5>
                            <p>${risk.impactDescription}</p>
                        </div>
                        <div class="risk-recommendation">
                            <h5>💡 권장 조치</h5>
                            <p>${risk.recommendation}</p>
                        </div>
                        <div class="risk-actions">
                            <button class="btn btn-primary btn-sm" onclick="assignTrainingForRisk(${risk.id})">
                                <i class="fas fa-graduation-cap"></i> 교육 즉시 배정
                            </button>
                            <button class="btn btn-secondary btn-sm" onclick="viewRiskDetails(${risk.id})">
                                <i class="fas fa-info-circle"></i> 상세 분석
                            </button>
                        </div>
                    </div>
                </div>
            `;
        });
    }
    
    html += '</div>';
    
    container.innerHTML = html;
}

function assignTrainingForRisk(riskId) {
    const risk = skillRiskData.find(r => r.id === riskId);
    if (risk) {
        alert(`✅ 교육 배정 완료!\n\n부서: ${risk.department}\n스킬: ${risk.skill}\n권장 교육: ${risk.recommendation}\n\n해당 팀원들에게 교육 과정이 배정되었습니다.`);
    }
}

function viewRiskDetails(riskId) {
    const risk = skillRiskData.find(r => r.id === riskId);
    if (risk) {
        alert(`📊 상세 리스크 분석\n\n부서: ${risk.department}\n스킬: ${risk.skill}\n리스크 레벨: ${risk.riskLevel}\n현재 전문가: ${risk.expertCount}명\n필요 인원: ${risk.requiredCount}명\n예상 영향: ${risk.estimatedImpact}%\n발생 확률: ${risk.probability}\n\n${risk.impactDescription}`);
    }
}

// ========================================
// INITIALIZATION
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 High-Performer & Risk Management 초기화');
    
    // Initialize high-performer analysis
    analyzeHighPerformers();
    
    // Initialize risk management
    updateRiskCounts();
    renderRiskDetails('all');
});
