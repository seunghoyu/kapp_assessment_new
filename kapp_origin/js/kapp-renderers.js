// Enhanced Question Renderers - 다양한 문항 유형 렌더링

// 1. 기본 객관식 렌더링
function renderMultipleChoice(question, container) {
    container.innerHTML = `
        <div class="question-header">
            <h3>${question.question}</h3>
            ${question.description ? `<p class="question-desc">${question.description}</p>` : ''}
        </div>
        <div class="options-container">
            ${question.options.map((option, index) => `
                <div class="option-card" data-index="${index}">
                    <div class="option-radio"></div>
                    <div class="option-text">${option}</div>
                </div>
            `).join('')}
        </div>
    `;
    
    // Add click handlers
    container.querySelectorAll('.option-card').forEach(card => {
        card.addEventListener('click', () => selectOption(card, question.id));
    });
}

// 2. 실무 시나리오 렌더링
function renderScenario(question, container) {
    container.innerHTML = `
        <div class="scenario-container">
            <div class="scenario-header">
                <h2>${question.title}</h2>
                ${question.timer ? `
                    <div class="scenario-timer">
                        <i class="fas fa-clock"></i>
                        <span id="scenarioTimer">${formatTime(question.timer)}</span>
                    </div>
                ` : ''}
            </div>
            
            <div class="scenario-content">
                ${question.scenario}
            </div>
            
            ${question.realTimeData ? `
                <div class="scenario-charts">
                    <div class="mini-chart">
                        <canvas id="errorRateChart"></canvas>
                    </div>
                    <div class="mini-chart">
                        <canvas id="complaintsChart"></canvas>
                    </div>
                </div>
            ` : ''}
            
            <div class="scenario-question">
                <h3>${question.question}</h3>
            </div>
            
            <div class="scenario-options">
                ${question.options.map((option, index) => `
                    <div class="scenario-option" data-index="${index}">
                        <div class="option-header">
                            <span class="option-number">${index + 1}</span>
                            <span class="option-label">${option.label}</span>
                        </div>
                        <div class="option-consequence">
                            <strong>예상 결과:</strong> ${option.consequence}
                        </div>
                        ${option.kpi ? `
                            <div class="option-kpi">
                                ${Object.entries(option.kpi).map(([key, value]) => `
                                    <span class="kpi-badge">${key}: ${value.toLocaleString()}</span>
                                `).join('')}
                            </div>
                        ` : ''}
                    </div>
                `).join('')}
            </div>
        </div>
    `;
    
    // Start timer if exists
    if (question.timer) {
        startScenarioTimer(question.timer);
    }
    
    // Render real-time charts
    if (question.realTimeData) {
        renderRealTimeCharts(question.realTimeData);
    }
    
    // Add click handlers
    container.querySelectorAll('.scenario-option').forEach(option => {
        option.addEventListener('click', () => selectScenarioOption(option, question.id));
    });
}

// 3. 시뮬레이션 렌더링
function renderSimulation(question, container) {
    if (question.simulationType === 'dashboard_analysis') {
        container.innerHTML = `
            <div class="simulation-container">
                <div class="simulation-header">
                    <h2>${question.title}</h2>
                    <p>${question.description}</p>
                    <div class="simulation-timer">
                        <i class="fas fa-stopwatch"></i>
                        <span id="simTimer">${formatTime(question.timeLimit)}</span>
                    </div>
                </div>
                
                <div class="dashboard-simulation">
                    <div class="metrics-grid">
                        ${question.dashboard.metrics.map(metric => `
                            <div class="metric-card ${metric.status}" data-metric="${metric.name}">
                                <div class="metric-header">
                                    <span class="metric-name">${metric.name}</span>
                                    <span class="metric-trend ${metric.trend > 0 ? 'up' : 'down'}">
                                        <i class="fas fa-arrow-${metric.trend > 0 ? 'up' : 'down'}"></i>
                                        ${Math.abs(metric.trend)}%
                                    </span>
                                </div>
                                <div class="metric-value">${metric.value.toLocaleString()}</div>
                                <button class="select-metric-btn">선택</button>
                            </div>
                        `).join('')}
                    </div>
                    
                    <div class="logs-panel">
                        <h3>📋 시스템 로그</h3>
                        <div class="log-entries">
                            ${question.dashboard.logs.map(log => `
                                <div class="log-entry">${log}</div>
                            `).join('')}
                        </div>
                    </div>
                </div>
                
                <div class="simulation-tasks">
                    <h3>🎯 과제</h3>
                    ${question.tasks.map(task => `
                        <div class="task-item" data-task-id="${task.id}">
                            <div class="task-checkbox">
                                <i class="fas fa-circle"></i>
                            </div>
                            <div class="task-content">
                                <span class="task-text">${task.task}</span>
                                <span class="task-points">+${task.points}점</span>
                            </div>
                        </div>
                    `).join('')}
                </div>
                
                <div class="simulation-actions">
                    <button id="submitSimulation" class="btn btn-primary btn-lg">
                        <i class="fas fa-check"></i> 분석 완료
                    </button>
                </div>
            </div>
        `;
        
        setupDashboardSimulation(question);
    } else if (question.simulationType === 'role_play') {
        renderRolePlaySimulation(question, container);
    }
}

// 4. 롤플레이 시뮬레이션 렌더링
function renderRolePlaySimulation(question, container) {
    const currentStep = question.conversations[0];
    
    container.innerHTML = `
        <div class="roleplay-container">
            <div class="roleplay-header">
                <h2>${question.title}</h2>
                <p>${question.description}</p>
            </div>
            
            <div class="customer-info">
                <div class="customer-avatar">
                    <i class="fas fa-user-tie"></i>
                </div>
                <div class="customer-details">
                    <h3>${question.scenario.customer.name}</h3>
                    <span class="customer-tier">${question.scenario.customer.tier} 회원</span>
                    <p class="customer-history">${question.scenario.customer.history}</p>
                </div>
            </div>
            
            <div class="satisfaction-meter">
                <div class="meter-label">고객 만족도</div>
                <div class="meter-bar">
                    <div class="meter-fill" id="satisfactionFill" style="width: ${question.initialState.customerSatisfaction}%"></div>
                </div>
                <div class="meter-value">${question.initialState.customerSatisfaction}%</div>
            </div>
            
            <div class="conversation-area">
                <div class="customer-message">
                    <div class="message-bubble customer">
                        <div class="customer-mood ${question.scenario.customer.mood}">
                            ${getMoodIcon(question.scenario.customer.mood)}
                        </div>
                        <p>${currentStep.customerLine}</p>
                    </div>
                </div>
                
                <div class="response-options">
                    <h3>당신의 응답을 선택하세요:</h3>
                    ${currentStep.options.map((option, index) => `
                        <div class="response-option" data-index="${index}">
                            <div class="response-number">${index + 1}</div>
                            <div class="response-text">${option.text}</div>
                            <div class="response-effect-hint">
                                <i class="fas fa-info-circle"></i>
                                효과: ${option.effect.satisfaction > 0 ? '+' : ''}${option.effect.satisfaction} 만족도
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    `;
    
    setupRolePlayHandlers(question);
}

// 5. 드래그 앤 드롭 렌더링
function renderDragDrop(question, container) {
    container.innerHTML = `
        <div class="dragdrop-container">
            <div class="dragdrop-header">
                <h2>${question.title}</h2>
                <p>${question.description}</p>
                <div class="dragdrop-timer">
                    <i class="fas fa-hourglass-half"></i>
                    <span id="dragdropTimer">${formatTime(question.timeLimit)}</span>
                </div>
            </div>
            
            <div class="eisenhower-matrix">
                <div class="matrix-quadrant q1" data-quadrant="q1">
                    <div class="quadrant-header">
                        <h3>${question.quadrants.q1.name}</h3>
                        <p>${question.quadrants.q1.description}</p>
                    </div>
                    <div class="quadrant-drop-zone"></div>
                </div>
                
                <div class="matrix-quadrant q2" data-quadrant="q2">
                    <div class="quadrant-header">
                        <h3>${question.quadrants.q2.name}</h3>
                        <p>${question.quadrants.q2.description}</p>
                    </div>
                    <div class="quadrant-drop-zone"></div>
                </div>
                
                <div class="matrix-quadrant q3" data-quadrant="q3">
                    <div class="quadrant-header">
                        <h3>${question.quadrants.q3.name}</h3>
                        <p>${question.quadrants.q3.description}</p>
                    </div>
                    <div class="quadrant-drop-zone"></div>
                </div>
                
                <div class="matrix-quadrant q4" data-quadrant="q4">
                    <div class="quadrant-header">
                        <h3>${question.quadrants.q4.name}</h3>
                        <p>${question.quadrants.q4.description}</p>
                    </div>
                    <div class="quadrant-drop-zone"></div>
                </div>
            </div>
            
            <div class="tasks-pool">
                <h3>📋 업무 목록 (드래그하여 사분면에 배치하세요)</h3>
                <div class="draggable-tasks">
                    ${question.tasks.map(task => `
                        <div class="task-card" draggable="true" data-task-id="${task.id}">
                            <div class="task-title">${task.title}</div>
                            <div class="task-meta">
                                <span class="task-time">
                                    <i class="fas fa-clock"></i> ${task.estimatedTime}분
                                </span>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
            
            <button id="submitDragDrop" class="btn btn-primary btn-lg">
                <i class="fas fa-check"></i> 배치 완료
            </button>
        </div>
    `;
    
    setupDragDropHandlers(question);
}

// 6. 코드 리뷰 렌더링
function renderCodeReview(question, container) {
    container.innerHTML = `
        <div class="codereview-container">
            <div class="codereview-header">
                <h2>${question.title}</h2>
                <p>${question.description}</p>
                <div class="codereview-timer">
                    <i class="fas fa-code"></i>
                    <span>${formatTime(question.timeLimit)}</span>
                </div>
            </div>
            
            <div class="code-editor">
                <div class="editor-toolbar">
                    <span class="file-name">login.js</span>
                    <span class="language">JavaScript</span>
                </div>
                <pre class="code-content"><code id="codeBlock">${escapeHtml(question.code)}</code></pre>
            </div>
            
            <div class="issue-checklist">
                <h3>🔍 발견한 문제점 체크</h3>
                <div class="issue-categories">
                    <div class="issue-category">
                        <h4>🛡️ 보안 (Security)</h4>
                        <div id="securityIssues" class="issue-list"></div>
                    </div>
                    <div class="issue-category">
                        <h4>⚡ 성능 (Performance)</h4>
                        <div id="performanceIssues" class="issue-list"></div>
                    </div>
                    <div class="issue-category">
                        <h4>📖 가독성 (Readability)</h4>
                        <div id="readabilityIssues" class="issue-list"></div>
                    </div>
                </div>
            </div>
            
            <div class="codereview-score">
                <div class="score-display">
                    <span class="score-label">발견한 이슈:</span>
                    <span class="score-value" id="foundIssues">0</span>
                    <span class="score-total">/ ${question.issues.length}</span>
                </div>
            </div>
            
            <button id="submitCodeReview" class="btn btn-primary btn-lg">
                <i class="fas fa-check"></i> 리뷰 완료
            </button>
        </div>
    `;
    
    setupCodeReviewHandlers(question);
}

// 7. 게이미피케이션 렌더링
function renderGamified(question, container, onAnswerCallback) {
    if (question.gameType === 'roi_simulator') {
        container.innerHTML = `
            <div class="game-container roi-simulator">
                <div class="game-header">
                    <h2>${question.title}</h2>
                    <p>${question.description}</p>
                </div>
                
                <div class="game-dashboard">
                    <div class="game-stat-card">
                        <div class="stat-label">💰 예산</div>
                        <div class="stat-value" id="currentBudget">${question.initialBudget.toLocaleString()}원</div>
                    </div>
                    <div class="game-stat-card">
                        <div class="stat-label">📅 진행 일</div>
                        <div class="stat-value" id="currentDay">1/${question.simulationDays}일</div>
                    </div>
                    <div class="game-stat-card">
                        <div class="stat-label">📊 총 매출</div>
                        <div class="stat-value" id="totalRevenue">0원</div>
                    </div>
                    <div class="game-stat-card">
                        <div class="stat-label">🎯 ROI</div>
                        <div class="stat-value" id="currentROI">0%</div>
                    </div>
                </div>
                
                <div class="game-actions">
                    <h3>📋 실행 가능한 액션</h3>
                    <div class="actions-grid">
                        ${question.actions.map(action => `
                            <div class="action-card">
                                <div class="action-icon">${action.icon}</div>
                                <h4>${action.name}</h4>
                                <p>${action.description}</p>
                                <div class="action-stats">
                                    <div class="action-stat">
                                        <span>💵 비용</span>
                                        <strong>${action.cost.toLocaleString()}원</strong>
                                    </div>
                                    <div class="action-stat">
                                        <span>👥 예상 고객</span>
                                        <strong>${action.expectedCustomers}명</strong>
                                    </div>
                                    <div class="action-stat">
                                        <span>💵 예상 매출</span>
                                        <strong>${action.expectedRevenue.toLocaleString()}원</strong>
                                    </div>
                                    <div class="action-stat">
                                        <span>⏱️ 기간</span>
                                        <strong>${action.duration}일</strong>
                                    </div>
                                </div>
                                <button class="btn btn-primary action-btn">실행</button>
                            </div>
                        `).join('')}
                    </div>
                </div>
                
                <div class="game-timeline">
                    <h3>📊 캠페인 타임라인</h3>
                    <div id="campaignTimeline" class="timeline-content"></div>
                </div>
            </div>
        `;
        
        setupGameHandlers(question, onAnswerCallback);
    } else if (question.gameType === 'speed_decision') {
        renderSpeedDecisionGame(question, container, onAnswerCallback);
    }
}

// 8. 대시보드 분석 렌더링
function renderDashboardAnalysis(question, container, onAnswerCallback) {
    container.innerHTML = `
        <div class="dashboard-analysis-container">
            <div class="analysis-header">
                <h2>${question.title}</h2>
                <p>${question.description}</p>
                <div class="analysis-timer">
                    <i class="fas fa-clock"></i>
                    <span id="analysisTimer">${formatTime(question.timeLimit)}</span>
                </div>
            </div>
            
            <div class="dashboard-metrics">
                ${question.metrics.map(metric => `
                    <div class="metric-card ${metric.status}">
                        <div class="metric-icon">${metric.icon}</div>
                        <div class="metric-info">
                            <div class="metric-label">${metric.name}</div>
                            <div class="metric-value">${metric.value}</div>
                            <div class="metric-change ${metric.trend}">
                                ${metric.trend === 'up' ? '▲' : '▼'} ${metric.change}
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
            
            <div class="system-logs">
                <h3>📋 시스템 로그</h3>
                <div class="log-container">
                    ${question.logs.map(log => `
                        <div class="log-entry ${log.level}">
                            <span class="log-time">${log.time}</span>
                            <span class="log-level">[${log.level.toUpperCase()}]</span>
                            <span class="log-message">${log.message}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
            
            <div class="problem-selection">
                <h3>🎯 핵심 문제를 3가지 선택하세요:</h3>
                <div class="problems-grid">
                    ${question.problems.map((problem, index) => `
                        <div class="problem-option" data-index="${index}">
                            <input type="checkbox" id="problem_${index}" />
                            <label for="problem_${index}">
                                <strong>${problem.title}</strong>
                                <p>${problem.description}</p>
                            </label>
                        </div>
                    `).join('')}
                </div>
                <button id="submitAnalysis" class="btn btn-primary btn-lg">분석 제출</button>
            </div>
        </div>
    `;
    
    setupDashboardAnalysisHandlers(question, onAnswerCallback);
}

// 9. 롤플레이 렌더링
function renderRolePlay(question, container, onAnswerCallback) {
    const initialState = {
        currentStep: 0,
        satisfaction: question.scenario.customer.satisfaction,
        responses: []
    };
    
    container.innerHTML = `
        <div class="roleplay-container">
            <div class="roleplay-header">
                <h2>${question.title}</h2>
                <p>${question.description}</p>
            </div>
            
            <div class="roleplay-situation">
                <h3>🎭 상황 설정</h3>
                <div class="situation-card">
                    ${question.scenario.situation}
                </div>
            </div>
            
            <div class="roleplay-stage">
                <div class="customer-panel">
                    <div class="customer-avatar">
                        <div class="avatar-icon">${question.scenario.customer.avatar}</div>
                        <div class="customer-name">${question.scenario.customer.name}</div>
                    </div>
                    <div class="satisfaction-meter">
                        <label>현재 만족도</label>
                        <div class="satisfaction-bar">
                            <div class="satisfaction-fill" id="satisfactionFill" style="width: ${initialState.satisfaction}%"></div>
                        </div>
                        <span id="satisfactionValue">${initialState.satisfaction}%</span>
                    </div>
                </div>
                
                <div class="conversation" id="conversationArea">
                    <div class="message-bubble customer">
                        <div class="customer-mood ${question.scenario.customer.mood}">
                            ${getMoodIcon(question.scenario.customer.mood)}
                        </div>
                        <p>${question.scenario.steps[0].customerLine}</p>
                    </div>
                </div>
                
                <div class="response-options" id="responseOptions">
                    <h3>당신의 응답을 선택하세요:</h3>
                    ${question.scenario.steps[0].options.map((option, index) => `
                        <div class="response-option" data-index="${index}">
                            <div class="response-number">${index + 1}</div>
                            <div class="response-text">${option.text}</div>
                            <div class="response-effect-hint">
                                <i class="fas fa-info-circle"></i>
                                효과: ${option.effect.satisfaction > 0 ? '+' : ''}${option.effect.satisfaction} 만족도
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    `;
    
    setupRolePlayHandlers(question, initialState, onAnswerCallback);
}

// 10. 핫스팟 렌더링
function renderHotspot(question, container, onAnswerCallback) {
    const foundHotspots = [];
    
    container.innerHTML = `
        <div class="hotspot-container">
            <div class="hotspot-header">
                <h2>${question.title}</h2>
                <p>${question.description}</p>
                <div class="hotspot-stats">
                    <div class="stat">
                        <i class="fas fa-clock"></i>
                        <span id="hotspotTimer">${formatTime(question.timeLimit)}</span>
                    </div>
                    <div class="stat">
                        <i class="fas fa-bullseye"></i>
                        <span id="foundCount">0/${question.hotspots.length}</span>
                    </div>
                </div>
            </div>
            
            <div class="hotspot-image-container">
                <div class="image-placeholder">
                    <i class="fas fa-image"></i>
                    <p>UI 목업 이미지</p>
                    <small>실제 이미지가 필요합니다</small>
                </div>
                <canvas id="hotspotCanvas" width="800" height="600"></canvas>
            </div>
            
            <div class="hotspot-feedback">
                <h3>발견한 문제점:</h3>
                <div id="foundIssues" class="issues-list">
                    <p class="empty-message">이미지에서 문제점을 클릭하세요</p>
                </div>
            </div>
            
            <button id="submitHotspot" class="btn btn-primary btn-lg">완료</button>
        </div>
    `;
    
    setupHotspotHandlers(question, foundHotspots, onAnswerCallback);
}

// Handler setup functions (placeholders - implement based on your needs)
function setupGameHandlers(question, onAnswerCallback) {
    // TODO: Implement game interaction logic
    console.log('Setting up game handlers...');
}

function setupDashboardAnalysisHandlers(question, onAnswerCallback) {
    const submitBtn = document.getElementById('submitAnalysis');
    submitBtn?.addEventListener('click', () => {
        const selected = Array.from(document.querySelectorAll('.problem-option input:checked'))
            .map(cb => parseInt(cb.id.replace('problem_', '')));
        
        if (selected.length !== 3) {
            alert('정확히 3가지 문제를 선택해주세요.');
            return;
        }
        
        onAnswerCallback({ selected, score: calculateAnalysisScore(selected, question) });
    });
}

function calculateAnalysisScore(selected, question) {
    // TODO: Implement scoring logic
    return 50;
}

function setupRolePlayHandlers(question, state, onAnswerCallback) {
    const options = document.querySelectorAll('.response-option');
    options.forEach(option => {
        option.addEventListener('click', function() {
            const index = parseInt(this.dataset.index);
            handleRolePlayResponse(question, state, index, onAnswerCallback);
        });
    });
}

function handleRolePlayResponse(question, state, responseIndex, onAnswerCallback) {
    const currentStep = question.scenario.steps[state.currentStep];
    const response = currentStep.options[responseIndex];
    
    // Update satisfaction
    state.satisfaction += response.effect.satisfaction;
    state.responses.push(responseIndex);
    
    // Update UI
    document.getElementById('satisfactionFill').style.width = state.satisfaction + '%';
    document.getElementById('satisfactionValue').textContent = state.satisfaction + '%';
    
    // Check if role play is complete
    if (state.currentStep >= question.scenario.steps.length - 1) {
        onAnswerCallback({ responses: state.responses, finalSatisfaction: state.satisfaction });
    } else {
        state.currentStep++;
        // Load next step (TODO: implement step progression)
    }
}

function setupHotspotHandlers(question, foundHotspots, onAnswerCallback) {
    const canvas = document.getElementById('hotspotCanvas');
    canvas?.addEventListener('click', (e) => {
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        // Check if click is on a hotspot
        question.hotspots.forEach((hotspot, index) => {
            const distance = Math.sqrt(Math.pow(x - hotspot.x, 2) + Math.pow(y - hotspot.y, 2));
            if (distance <= hotspot.radius && !foundHotspots.includes(index)) {
                foundHotspots.push(index);
                showHotspotFeedback(hotspot);
                updateHotspotCount(foundHotspots.length, question.hotspots.length);
            }
        });
    });
    
    document.getElementById('submitHotspot')?.addEventListener('click', () => {
        onAnswerCallback({ found: foundHotspots, score: calculateHotspotScore(foundHotspots, question) });
    });
}

function showHotspotFeedback(hotspot) {
    const issuesList = document.getElementById('foundIssues');
    const emptyMsg = issuesList.querySelector('.empty-message');
    if (emptyMsg) emptyMsg.remove();
    
    const issueDiv = document.createElement('div');
    issueDiv.className = 'issue-item';
    issueDiv.innerHTML = `
        <i class="fas fa-check-circle"></i>
        <span>${hotspot.issue}</span>
        <strong>+${hotspot.points}점</strong>
    `;
    issuesList.appendChild(issueDiv);
}

function updateHotspotCount(found, total) {
    document.getElementById('foundCount').textContent = `${found}/${total}`;
}

function calculateHotspotScore(foundHotspots, question) {
    return foundHotspots.reduce((score, index) => score + question.hotspots[index].points, 0);
}

// 7. 게이미피케이션 렌더링
function renderGamified(question, container) {
    if (question.gameType === 'resource_management') {
        container.innerHTML = `
            <div class="game-container">
                <div class="game-header">
                    <h2>${question.title}</h2>
                    <p>${question.description}</p>
                </div>
                
                <div class="game-stats">
                    <div class="stat-card">
                        <span class="stat-label">💰 예산</span>
                        <span class="stat-value" id="gameBudget">${question.initialState.budget.toLocaleString()}원</span>
                    </div>
                    <div class="stat-card">
                        <span class="stat-label">📅 Day</span>
                        <span class="stat-value" id="gameDay">${question.initialState.day} / ${question.initialState.totalDays}</span>
                    </div>
                    <div class="stat-card">
                        <span class="stat-label">👥 고객</span>
                        <span class="stat-value" id="gameCustomers">${question.initialState.customers}</span>
                    </div>
                    <div class="stat-card">
                        <span class="stat-label">📈 ROI</span>
                        <span class="stat-value" id="gameROI">${question.initialState.roi}%</span>
                    </div>
                </div>
                
                <div class="game-actions">
                    <h3>🎯 마케팅 액션 선택</h3>
                    <div class="action-cards">
                        ${question.actions.map((action, index) => `
                            <div class="action-card" data-action-index="${index}">
                                <div class="action-header">
                                    <h4>${action.name}</h4>
                                    ${action.uncertainty ? `<span class="uncertainty-badge">불확실성: ${action.uncertainty}</span>` : ''}
                                </div>
                                <div class="action-stats">
                                    <div class="action-stat">
                                        <span>💰 비용</span>
                                        <strong>${action.cost.toLocaleString()}원</strong>
                                    </div>
                                    <div class="action-stat">
                                        <span>👥 예상 고객</span>
                                        <strong>${action.expectedCustomers}명</strong>
                                    </div>
                                    <div class="action-stat">
                                        <span>💵 예상 매출</span>
                                        <strong>${action.expectedRevenue.toLocaleString()}원</strong>
                                    </div>
                                    <div class="action-stat">
                                        <span>⏱️ 기간</span>
                                        <strong>${action.duration}일</strong>
                                    </div>
                                </div>
                                <button class="btn btn-primary action-btn">실행</button>
                            </div>
                        `).join('')}
                    </div>
                </div>
                
                <div class="game-timeline">
                    <h3>📊 캠페인 타임라인</h3>
                    <div id="campaignTimeline" class="timeline-content"></div>
                </div>
            </div>
        `;
        
        setupGameHandlers(question);
    } else if (question.gameType === 'speed_decision') {
        renderSpeedDecisionGame(question, container);
    }
}

// Helper functions
function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

function getMoodIcon(mood) {
    const icons = {
        angry: '😠',
        upset: '😟',
        neutral: '😐',
        happy: '😊',
        delighted: '😄'
    };
    return icons[mood] || '😐';
}

function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}

// Timer functions
function startScenarioTimer(seconds) {
    let remaining = seconds;
    const timerElement = document.getElementById('scenarioTimer');
    
    const interval = setInterval(() => {
        remaining--;
        timerElement.textContent = formatTime(remaining);
        
        if (remaining <= 10) {
            timerElement.style.color = '#FF6B6B';
        }
        
        if (remaining <= 0) {
            clearInterval(interval);
            handleTimeOut();
        }
    }, 1000);
}

// Export
window.renderMultipleChoice = renderMultipleChoice;
window.renderScenario = renderScenario;
window.renderSimulation = renderSimulation;
window.renderDragDrop = renderDragDrop;
window.renderCodeReview = renderCodeReview;
window.renderGamified = renderGamified;

// Main render function - dispatches to appropriate renderer based on question type
window.renderQuestion = function(question, container, onAnswerCallback) {
    console.log('🎯 Rendering question:', question.type, question.id);
    
    // Map question types to renderer functions
    const rendererMap = {
        'multiple_choice': renderMultipleChoice,
        'scenario': renderScenario,
        'simulation': renderSimulation,
        'drag_drop': renderDragDrop,
        'dashboard_analysis': renderDashboardAnalysis,
        'role_play': renderRolePlay,
        'code_review': renderCodeReview,
        'gamified': renderGamified,
        'hotspot': renderHotspot,
        'roi_simulator': renderGamified  // ROI simulator uses gamified renderer
    };
    
    const renderer = rendererMap[question.type];
    
    if (renderer) {
        try {
            renderer(question, container, onAnswerCallback);
        } catch (error) {
            console.error('Error rendering question:', error);
            // Fallback to basic rendering
            container.innerHTML = `
                <div class="error-message">
                    <p>⚠️ 문항 렌더링 중 오류가 발생했습니다.</p>
                    <p class="error-detail">${error.message}</p>
                </div>
            `;
        }
    } else {
        console.warn('No renderer found for type:', question.type);
        // Fallback to multiple choice
        renderMultipleChoice(question, container, onAnswerCallback);
    }
};