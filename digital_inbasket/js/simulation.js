// Global variables
let currentQuestionId = null;
let currentQuestion = null;
let timerInterval = null;
let timeRemaining = 600; // 10 minutes in seconds
let userResponses = {};
let completedTasks = 0;
let totalTasks = 0;

// Initialize simulation
document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    currentQuestionId = urlParams.get('id');
    
    if (currentQuestionId) {
        loadQuestion(currentQuestionId);
        startTimer();
    } else {
        showError('문항 ID가 없습니다.');
    }
});

// Load question data
async function loadQuestion(questionId) {
    try {
        const response = await fetch(`tables/questions/${questionId}`);
        currentQuestion = await response.json();
        
        renderSimulation(currentQuestion);
    } catch (error) {
        console.error('문항 로드 실패:', error);
        showError('문항을 불러오는데 실패했습니다.');
    }
}

// Render simulation based on question category
function renderSimulation(question) {
    switch(question.category) {
        case '이메일 관리':
            renderEmailManagement(question);
            break;
        case '메신저 대응':
            renderMessengerApp(question);
            break;
        case '보고서 작성':
            renderDocumentEditor(question);
            break;
        case '일정 관리':
            renderCalendarApp(question);
            break;
        case '통합 업무':
            renderProjectDashboard(question);
            break;
        case '위기 관리':
            renderEmergencyCenter(question);
            break;
        case '글로벌 협업':
            renderCollaborationPlatform(question);
            break;
        case '법무 검토':
            renderContractReview(question);
            break;
        case '디지털 활용':
            renderToolSelection(question);
            break;
        case '인사 관리':
            renderHRSystem(question);
            break;
        case '재무 관리':
            renderFinanceSystem(question);
            break;
        case '고객 관리':
            renderCRMSystem(question);
            break;
        case '윤리 경영':
            renderComplianceSystem(question);
            break;
        case '전략 기획':
            renderStrategyBoard(question);
            break;
        case '마케팅캠페인':
            renderCampaignDashboard(question);
            break;
        case '생산관리':
            renderProductionControl(question);
            break;
        default:
            renderDefaultView(question);
    }
}

// 1. Email Management - Outlook 스타일
function renderEmailManagement(question) {
    const emails = [
        { id: 1, from: '이사회 사무국', subject: '이사회 안건 승인 요청', time: '10분 전', priority: 'high', unread: true, content: '다음 주 이사회에서 논의할 안건에 대한 사전 검토와 승인이 필요합니다.' },
        { id: 2, from: '고객사 담당자', subject: '계약서 검토 요청', time: '15분 전', priority: 'high', unread: true, content: '신규 고객사와의 계약서 초안이 완성되었습니다. 법무팀 검토가 완료되었으니 최종 승인 부탁드립니다.' },
        { id: 3, from: '재무팀', subject: '예산 추가 승인 건', time: '20분 전', priority: 'high', unread: true, content: '1분기 실적 부진으로 마케팅 예산 추가가 시급합니다.' },
        { id: 4, from: '마케팅팀', subject: '월간 실적 보고서', time: '1시간 전', priority: 'normal', unread: false, content: '2월 마케팅 실적을 정리하여 보고드립니다.' },
        { id: 5, from: '영업팀', subject: '분기 목표 수정안', time: '2시간 전', priority: 'low', unread: false, content: '시장 상황 변화를 반영한 분기 목표 수정안입니다.' }
    ];
    
    totalTasks = emails.length;
    
    const content = document.getElementById('simulation-content');
    content.innerHTML = `
        <!-- Outlook 스타일 이메일 클라이언트 -->
        <div class="bg-white rounded-lg shadow-xl overflow-hidden" style="height: 70vh;">
            <div class="flex h-full">
                <!-- 왼쪽: 폴더 및 이메일 리스트 -->
                <div class="w-1/3 border-r flex flex-col">
                    <!-- 폴더 -->
                    <div class="bg-gray-50 p-4 border-b">
                        <div class="flex items-center text-blue-600 font-semibold mb-2">
                            <i class="fas fa-inbox mr-2"></i>
                            받은 편지함
                            <span class="ml-auto bg-red-500 text-white text-xs px-2 py-1 rounded-full">${emails.filter(e => e.unread).length}</span>
                        </div>
                        <div class="text-sm text-gray-600 mt-2">
                            <div class="flex items-center py-1"><i class="fas fa-star mr-2"></i>중요</div>
                            <div class="flex items-center py-1"><i class="fas fa-paper-plane mr-2"></i>보낸 편지함</div>
                        </div>
                    </div>
                    
                    <!-- 이메일 목록 -->
                    <div class="flex-1 overflow-y-auto">
                        ${emails.map(email => `
                            <div class="email-item border-b p-3 cursor-pointer hover:bg-blue-50 ${email.unread ? 'bg-blue-50' : ''}" 
                                 onclick="selectEmail(${email.id})" 
                                 id="email-item-${email.id}">
                                <div class="flex items-start justify-between mb-1">
                                    <div class="flex items-center">
                                        ${email.unread ? '<div class="w-2 h-2 bg-blue-600 rounded-full mr-2"></div>' : '<div class="w-2 h-2 mr-2"></div>'}
                                        <span class="${email.unread ? 'font-bold' : ''} text-sm">${email.from}</span>
                                    </div>
                                    <span class="text-xs text-gray-500">${email.time}</span>
                                </div>
                                <div class="${email.unread ? 'font-semibold' : ''} text-sm text-gray-700 truncate">${email.subject}</div>
                                ${email.priority === 'high' ? '<span class="text-xs text-red-500"><i class="fas fa-exclamation-circle"></i> 긴급</span>' : ''}
                            </div>
                        `).join('')}
                    </div>
                </div>
                
                <!-- 오른쪽: 이메일 내용 -->
                <div class="flex-1 flex flex-col">
                    <div id="email-viewer" class="flex-1 p-6 overflow-y-auto">
                        <div class="flex items-center justify-center h-full text-gray-400">
                            <div class="text-center">
                                <i class="fas fa-envelope-open text-6xl mb-4"></i>
                                <p>이메일을 선택하세요</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    window.emailsData = emails;
    window.emailResponses = {};
}

function selectEmail(emailId) {
    const email = window.emailsData.find(e => e.id === emailId);
    if (!email) return;
    
    // 선택 상태 표시
    document.querySelectorAll('.email-item').forEach(item => {
        item.classList.remove('bg-blue-100');
    });
    document.getElementById(`email-item-${emailId}`).classList.add('bg-blue-100');
    
    // 이메일 내용 표시
    const viewer = document.getElementById('email-viewer');
    const response = window.emailResponses[emailId] || {};
    
    viewer.innerHTML = `
        <div class="max-w-4xl">
            <!-- 이메일 헤더 -->
            <div class="border-b pb-4 mb-4">
                <h2 class="text-2xl font-bold mb-3">${email.subject}</h2>
                <div class="flex items-center text-sm text-gray-600 mb-2">
                    <div class="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold mr-3">
                        ${email.from[0]}
                    </div>
                    <div>
                        <div class="font-semibold">${email.from}</div>
                        <div class="text-xs">${email.time}</div>
                    </div>
                </div>
            </div>
            
            <!-- 이메일 본문 -->
            <div class="bg-gray-50 p-4 rounded-lg mb-6">
                <p class="text-gray-700">${email.content}</p>
            </div>
            
            <!-- 액션 버튼 -->
            <div class="flex space-x-2 mb-6">
                <button onclick="emailAction(${emailId}, '답장')" 
                        class="action-btn ${response.action === '답장' ? 'bg-blue-600 text-white' : 'bg-white border-2 border-blue-600 text-blue-600'} px-6 py-2 rounded-lg font-semibold hover:shadow-lg transition">
                    <i class="fas fa-reply mr-2"></i>답장
                </button>
                <button onclick="emailAction(${emailId}, '전달')" 
                        class="action-btn ${response.action === '전달' ? 'bg-green-600 text-white' : 'bg-white border-2 border-green-600 text-green-600'} px-6 py-2 rounded-lg font-semibold hover:shadow-lg transition">
                    <i class="fas fa-share mr-2"></i>전달
                </button>
                <button onclick="emailAction(${emailId}, '보관')" 
                        class="action-btn ${response.action === '보관' ? 'bg-gray-600 text-white' : 'bg-white border-2 border-gray-600 text-gray-600'} px-6 py-2 rounded-lg font-semibold hover:shadow-lg transition">
                    <i class="fas fa-archive mr-2"></i>보관
                </button>
                <button onclick="emailAction(${emailId}, '삭제')" 
                        class="action-btn ${response.action === '삭제' ? 'bg-red-600 text-white' : 'bg-white border-2 border-red-600 text-red-600'} px-6 py-2 rounded-lg font-semibold hover:shadow-lg transition">
                    <i class="fas fa-trash mr-2"></i>삭제
                </button>
            </div>
            
            <!-- 우선순위 설정 -->
            <div class="mb-4">
                <label class="block font-semibold mb-2">우선순위 설정</label>
                <div class="flex space-x-2">
                    <button onclick="setEmailPriority(${emailId}, '긴급')" 
                            class="${response.priority === '긴급' ? 'bg-red-500 text-white' : 'bg-white border-2 border-red-500 text-red-500'} px-4 py-2 rounded-lg">
                        🔴 긴급
                    </button>
                    <button onclick="setEmailPriority(${emailId}, '중요')" 
                            class="${response.priority === '중요' ? 'bg-orange-500 text-white' : 'bg-white border-2 border-orange-500 text-orange-500'} px-4 py-2 rounded-lg">
                        🟠 중요
                    </button>
                    <button onclick="setEmailPriority(${emailId}, '보통')" 
                            class="${response.priority === '보통' ? 'bg-blue-500 text-white' : 'bg-white border-2 border-blue-500 text-blue-500'} px-4 py-2 rounded-lg">
                        🔵 보통
                    </button>
                </div>
            </div>
            
            ${response.action && response.priority ? `
                <div class="bg-green-50 border-2 border-green-500 rounded-lg p-3 flex items-center">
                    <i class="fas fa-check-circle text-green-500 text-2xl mr-3"></i>
                    <span class="text-green-700 font-semibold">처리 완료: ${response.action} / ${response.priority}</span>
                </div>
            ` : ''}
        </div>
    `;
    
    updateProgress();
}

function emailAction(emailId, action) {
    if (!window.emailResponses[emailId]) {
        window.emailResponses[emailId] = {};
    }
    window.emailResponses[emailId].action = action;
    selectEmail(emailId);
}

function setEmailPriority(emailId, priority) {
    if (!window.emailResponses[emailId]) {
        window.emailResponses[emailId] = {};
    }
    window.emailResponses[emailId].priority = priority;
    selectEmail(emailId);
}

// 2. Messenger App - Slack/Teams 스타일
function renderMessengerApp(question) {
    const messages = [
        { id: 1, team: '영업팀', sender: '김영업', avatar: '👔', message: '고객 프레젠테이션 파일 접근이 안 됩니다! 오전 11시 미팅인데 급합니다.', time: '09:15', urgent: true },
        { id: 2, team: '회계팀', sender: '박회계', avatar: '💼', message: '결재 시스템 오류로 급여 처리가 지연되고 있습니다. 직원들이 문의하고 있어요.', time: '09:20', urgent: true },
        { id: 3, team: '마케팅팀', sender: '최마케팅', avatar: '📊', message: '오후 광고 송출 전에 승인 필요합니다. 12시까지 가능할까요?', time: '09:25', urgent: true },
        { id: 4, team: '인사팀', sender: '이인사', avatar: '👥', message: '면접 일정 3건 조율 부탁드립니다.', time: '09:30', urgent: false }
    ];
    
    totalTasks = messages.length;
    
    const content = document.getElementById('simulation-content');
    content.innerHTML = `
        <!-- Slack/Teams 스타일 메신저 -->
        <div class="bg-white rounded-lg shadow-xl overflow-hidden" style="height: 70vh;">
            <div class="flex h-full">
                <!-- 왼쪽: 채널 리스트 -->
                <div class="w-64 bg-purple-900 text-white p-4">
                    <div class="font-bold text-xl mb-6">💬 WorkChat</div>
                    <div class="space-y-2">
                        <div class="text-sm font-semibold text-purple-300 mb-2">채널</div>
                        <div class="flex items-center p-2 rounded hover:bg-purple-800 cursor-pointer bg-purple-800">
                            <span class="mr-2">📢</span>
                            <span class="font-semibold">긴급-요청</span>
                            <span class="ml-auto bg-red-500 text-xs px-2 py-1 rounded-full">${messages.filter(m => m.urgent).length}</span>
                        </div>
                        <div class="flex items-center p-2 rounded hover:bg-purple-800 cursor-pointer">
                            <span class="mr-2">💼</span>
                            <span>일반</span>
                        </div>
                    </div>
                </div>
                
                <!-- 오른쪽: 메시지 영역 -->
                <div class="flex-1 flex flex-col">
                    <!-- 헤더 -->
                    <div class="bg-white border-b p-4">
                        <div class="font-bold text-lg"># 긴급-요청</div>
                        <div class="text-sm text-gray-500">${messages.length}개의 메시지</div>
                    </div>
                    
                    <!-- 메시지 리스트 -->
                    <div class="flex-1 overflow-y-auto p-4 space-y-4">
                        ${messages.map(msg => `
                            <div class="message-item ${msg.urgent ? 'bg-red-50 border-l-4 border-red-500' : 'bg-gray-50'} p-4 rounded-lg">
                                <div class="flex items-start">
                                    <div class="text-3xl mr-3">${msg.avatar}</div>
                                    <div class="flex-1">
                                        <div class="flex items-center mb-1">
                                            <span class="font-bold mr-2">${msg.sender}</span>
                                            <span class="text-xs text-gray-500">${msg.team}</span>
                                            <span class="text-xs text-gray-400 ml-auto">${msg.time}</span>
                                            ${msg.urgent ? '<span class="ml-2 bg-red-500 text-white text-xs px-2 py-1 rounded">긴급</span>' : ''}
                                        </div>
                                        <p class="text-gray-700 mb-3">${msg.message}</p>
                                        
                                        <!-- 응답 옵션 -->
                                        <div class="flex space-x-2">
                                            <select onchange="setMessengerResponse(${msg.id}, this.value)" 
                                                    class="text-sm border rounded px-2 py-1 bg-white">
                                                <option value="">처리 방법 선택</option>
                                                <option value="즉시처리">⚡ 즉시 처리</option>
                                                <option value="위임">👤 위임</option>
                                                <option value="대기">⏰ 대기</option>
                                                <option value="정보수집">🔍 정보 수집</option>
                                            </select>
                                            <select onchange="setMessengerPriority(${msg.id}, this.value)" 
                                                    class="text-sm border rounded px-2 py-1 bg-white">
                                                <option value="">우선순위</option>
                                                <option value="1">1순위</option>
                                                <option value="2">2순위</option>
                                                <option value="3">3순위</option>
                                                <option value="4">4순위</option>
                                            </select>
                                        </div>
                                        
                                        <div id="msg-status-${msg.id}" class="mt-2"></div>
                                    </div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        </div>
    `;
    
    window.messengerResponses = {};
}

function setMessengerResponse(msgId, response) {
    if (!window.messengerResponses[msgId]) window.messengerResponses[msgId] = {};
    window.messengerResponses[msgId].action = response;
    updateMessengerStatus(msgId);
}

function setMessengerPriority(msgId, priority) {
    if (!window.messengerResponses[msgId]) window.messengerResponses[msgId] = {};
    window.messengerResponses[msgId].priority = priority;
    updateMessengerStatus(msgId);
}

function updateMessengerStatus(msgId) {
    const response = window.messengerResponses[msgId];
    const statusDiv = document.getElementById(`msg-status-${msgId}`);
    
    if (response && response.action && response.priority) {
        statusDiv.innerHTML = `
            <div class="text-sm bg-green-100 text-green-700 px-3 py-1 rounded inline-flex items-center">
                <i class="fas fa-check-circle mr-2"></i>
                ${response.action} / ${response.priority}순위
            </div>
        `;
    }
    
    updateProgress();
}

// Progress update
function updateProgress() {
    let completed = 0;
    
    if (window.emailResponses) {
        completed = Object.values(window.emailResponses).filter(r => r.action && r.priority).length;
    } else if (window.messengerResponses) {
        completed = Object.values(window.messengerResponses).filter(r => r.action && r.priority).length;
    }
    
    const progress = totalTasks > 0 ? Math.round((completed / totalTasks) * 100) : 0;
    document.getElementById('progress-bar').style.width = progress + '%';
    document.getElementById('progress-text').textContent = progress;
}

// Timer
function startTimer() {
    timerInterval = setInterval(() => {
        timeRemaining--;
        
        const minutes = Math.floor(timeRemaining / 60);
        const seconds = timeRemaining % 60;
        document.getElementById('timer').textContent = 
            `${minutes}:${seconds.toString().padStart(2, '0')}`;
        
        if (timeRemaining <= 0) {
            clearInterval(timerInterval);
            alert('시간이 종료되었습니다!');
            completeSimulation();
        }
    }, 1000);
}

// Complete simulation
async function completeSimulation() {
    clearInterval(timerInterval);
    
    const responseData = {
        question_id: currentQuestionId,
        action_taken: JSON.stringify(window.emailResponses || window.messengerResponses || {}),
        completed: true,
        response_time: new Date().toISOString(),
        time_spent: 600 - timeRemaining
    };
    
    try {
        await fetch('tables/responses', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(responseData)
        });
        
        alert('시뮬레이션이 완료되었습니다!');
        window.location.href = 'index.html';
    } catch (error) {
        console.error('응답 저장 실패:', error);
        alert('응답 저장에 실패했습니다.');
    }
}

// Default view
function renderDefaultView(question) {
    const content = document.getElementById('simulation-content');
    content.innerHTML = `
        <div class="bg-white rounded-lg shadow-md p-6">
            <h2 class="text-2xl font-bold mb-4">${question.title}</h2>
            <div class="bg-gray-50 p-4 rounded-lg mb-6">
                <p class="text-gray-700 whitespace-pre-wrap">${question.content}</p>
            </div>
            <div>
                <label class="block font-bold text-gray-700 mb-2">의사결정 작성</label>
                <textarea id="decision-response" 
                          class="w-full px-3 py-2 border border-gray-300 rounded-lg" 
                          rows="6"
                          placeholder="이 상황에 대한 의사결정과 근거를 작성하세요..."></textarea>
            </div>
        </div>
    `;
}

// 6. Emergency Center - 위기관리센터 스타일
function renderEmergencyCenter(question) {
    const content = document.getElementById('simulation-content');
    
    totalTasks = 4; // 4가지 결정 필요
    
    content.innerHTML = `
        <!-- 위기관리센터 대시보드 -->
        <div class="bg-gray-900 rounded-lg shadow-xl overflow-hidden" style="height: 70vh;">
            <!-- 긴급 헤더 -->
            <div class="bg-red-600 text-white p-4 flex items-center justify-between animate-pulse">
                <div class="flex items-center">
                    <i class="fas fa-exclamation-triangle text-3xl mr-3"></i>
                    <div>
                        <div class="text-2xl font-bold">🚨 ${question.title || '긴급 위기 상황'}</div>
                        <div class="text-sm">${question.sender || '위기대응팀'} | ${question.date || '2026-02-23'}</div>
                    </div>
                </div>
                <div class="text-right">
                    <div class="text-3xl font-bold" id="crisis-countdown">06:00:00</div>
                    <div class="text-xs">대응 마감까지</div>
                </div>
            </div>
            
            <!-- 문항 내용 표시 영역 추가 -->
            <div class="bg-gray-800 text-white p-4 border-b border-gray-700">
                <div class="flex items-start">
                    <i class="fas fa-info-circle text-yellow-400 mr-3 mt-1"></i>
                    <div class="flex-1">
                        <div class="font-semibold mb-2">상황 설명</div>
                        <div class="text-sm text-gray-300 leading-relaxed">${question.content || '긴급 상황이 발생했습니다.'}</div>
                    </div>
                </div>
            </div>
            
            <div class="flex h-full">
                <!-- 왼쪽: 상황판 -->
                <div class="w-1/3 bg-gray-800 text-white p-4 overflow-y-auto">
                    <div class="mb-6">
                        <div class="text-sm text-gray-400 mb-2">위기 등급</div>
                        <div class="bg-red-500 text-white px-4 py-2 rounded-lg font-bold text-center">
                            🔴 LEVEL 3 (심각)
                        </div>
                    </div>
                    
                    <div class="mb-6">
                        <div class="text-sm text-gray-400 mb-2">현황 요약</div>
                        <div class="space-y-2 text-sm">
                            <div class="bg-gray-700 p-3 rounded">
                                <div class="text-green-400">✅ 자체 검사</div>
                                <div class="text-xs text-gray-300">이상 없음</div>
                            </div>
                            <div class="bg-gray-700 p-3 rounded">
                                <div class="text-yellow-400">⏳ 외부 시험소</div>
                                <div class="text-xs text-gray-300">재검사 중 (3일 소요)</div>
                            </div>
                            <div class="bg-gray-700 p-3 rounded">
                                <div class="text-blue-400">📋 법무팀</div>
                                <div class="text-xs text-gray-300">대응 준비 중</div>
                            </div>
                            <div class="bg-gray-700 p-3 rounded">
                                <div class="text-purple-400">📞 고객센터</div>
                                <div class="text-xs text-gray-300">문의 폭주 예상</div>
                            </div>
                        </div>
                    </div>
                    
                    <div>
                        <div class="text-sm text-gray-400 mb-2">진행률</div>
                        <div class="bg-gray-700 rounded-full h-4 overflow-hidden">
                            <div id="crisis-progress" class="bg-green-500 h-full transition-all" style="width: 0%"></div>
                        </div>
                        <div class="text-xs text-center mt-1" id="crisis-progress-text">0/4 완료</div>
                    </div>
                </div>
                
                <!-- 오른쪽: 의사결정 패널 -->
                <div class="flex-1 bg-white p-6 overflow-y-auto">
                    <h2 class="text-2xl font-bold mb-6 flex items-center">
                        <i class="fas fa-clipboard-check text-blue-600 mr-2"></i>
                        긴급 의사결정 체크리스트
                    </h2>
                    
                    <!-- 1. 대응 전략 선택 -->
                    <div class="mb-6 border-2 border-gray-200 rounded-lg p-4 hover:border-blue-500 transition" id="decision-1">
                        <div class="flex items-center justify-between mb-3">
                            <h3 class="font-bold text-lg">1️⃣ 즉각 대응 전략</h3>
                            <span class="incomplete-badge bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-semibold">대기 중</span>
                        </div>
                        <p class="text-sm text-gray-600 mb-4">언론 보도 전 우리의 입장을 어떻게 전달할까요?</p>
                        <div class="space-y-2">
                            <label class="strategy-option block p-3 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition">
                                <input type="radio" name="strategy" value="선제보도" onchange="selectStrategy(1, '선제보도', this)">
                                <span class="ml-2 font-semibold">📢 선제적 보도자료 배포</span>
                                <p class="ml-6 text-xs text-gray-600 mt-1">우리의 입장을 먼저 발표하여 주도권 확보</p>
                            </label>
                            <label class="strategy-option block p-3 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition">
                                <input type="radio" name="strategy" value="언론협상" onchange="selectStrategy(1, '언론협상', this)">
                                <span class="ml-2 font-semibold">🤝 언론사와 협상</span>
                                <p class="ml-6 text-xs text-gray-600 mt-1">보도 연기 요청 및 추가 검증 시간 확보</p>
                            </label>
                            <label class="strategy-option block p-3 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition">
                                <input type="radio" name="strategy" value="침묵" onchange="selectStrategy(1, '침묵', this)">
                                <span class="ml-2 font-semibold">🤐 침묵 유지</span>
                                <p class="ml-6 text-xs text-gray-600 mt-1">외부 검사 결과가 나올 때까지 대응 보류</p>
                            </label>
                            <label class="strategy-option block p-3 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition">
                                <input type="radio" name="strategy" value="자진리콜" onchange="selectStrategy(1, '자진리콜', this)">
                                <span class="ml-2 font-semibold">🔄 자진 리콜 발표</span>
                                <p class="ml-6 text-xs text-gray-600 mt-1">선제적 리콜로 책임감 있는 기업 이미지 구축</p>
                            </label>
                        </div>
                    </div>
                    
                    <!-- 2. 내부 대응팀 구성 -->
                    <div class="mb-6 border-2 border-gray-200 rounded-lg p-4 hover:border-blue-500 transition" id="decision-2">
                        <div class="flex items-center justify-between mb-3">
                            <h3 class="font-bold text-lg">2️⃣ 위기대응팀 구성</h3>
                            <span class="incomplete-badge bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-semibold">대기 중</span>
                        </div>
                        <p class="text-sm text-gray-600 mb-4">누구를 위기대응팀에 포함시킬까요? (복수 선택)</p>
                        <div class="grid grid-cols-2 gap-2">
                            <label class="team-member flex items-center p-3 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-green-500 hover:bg-green-50 transition">
                                <input type="checkbox" value="CEO" onchange="selectTeamMember(2, this)">
                                <span class="ml-2">👔 CEO</span>
                            </label>
                            <label class="team-member flex items-center p-3 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-green-500 hover:bg-green-50 transition">
                                <input type="checkbox" value="홍보팀장" onchange="selectTeamMember(2, this)">
                                <span class="ml-2">📣 홍보팀장</span>
                            </label>
                            <label class="team-member flex items-center p-3 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-green-500 hover:bg-green-50 transition">
                                <input type="checkbox" value="법무팀장" onchange="selectTeamMember(2, this)">
                                <span class="ml-2">⚖️ 법무팀장</span>
                            </label>
                            <label class="team-member flex items-center p-3 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-green-500 hover:bg-green-50 transition">
                                <input type="checkbox" value="품질팀장" onchange="selectTeamMember(2, this)">
                                <span class="ml-2">🔬 품질팀장</span>
                            </label>
                            <label class="team-member flex items-center p-3 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-green-500 hover:bg-green-50 transition">
                                <input type="checkbox" value="고객서비스팀장" onchange="selectTeamMember(2, this)">
                                <span class="ml-2">💬 고객서비스팀장</span>
                            </label>
                            <label class="team-member flex items-center p-3 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-green-500 hover:bg-green-50 transition">
                                <input type="checkbox" value="외부전문가" onchange="selectTeamMember(2, this)">
                                <span class="ml-2">🎓 외부 전문가</span>
                            </label>
                        </div>
                    </div>
                    
                    <!-- 3. 고객 커뮤니케이션 -->
                    <div class="mb-6 border-2 border-gray-200 rounded-lg p-4 hover:border-blue-500 transition" id="decision-3">
                        <div class="flex items-center justify-between mb-3">
                            <h3 class="font-bold text-lg">3️⃣ 고객 커뮤니케이션</h3>
                            <span class="incomplete-badge bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-semibold">대기 중</span>
                        </div>
                        <p class="text-sm text-gray-600 mb-4">고객에게 어떻게 알릴까요?</p>
                        <div class="space-y-2">
                            <label class="comm-option block p-3 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-purple-500 hover:bg-purple-50 transition">
                                <input type="radio" name="communication" value="즉시공지" onchange="selectCommunication(3, '즉시공지', this)">
                                <span class="ml-2 font-semibold">📧 즉시 이메일/SMS 발송</span>
                            </label>
                            <label class="comm-option block p-3 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-purple-500 hover:bg-purple-50 transition">
                                <input type="radio" name="communication" value="홈페이지공지" onchange="selectCommunication(3, '홈페이지공지', this)">
                                <span class="ml-2 font-semibold">🌐 홈페이지 공지사항</span>
                            </label>
                            <label class="comm-option block p-3 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-purple-500 hover:bg-purple-50 transition">
                                <input type="radio" name="communication" value="개별연락" onchange="selectCommunication(3, '개별연락', this)">
                                <span class="ml-2 font-semibold">☎️ 구매 고객 개별 연락</span>
                            </label>
                            <label class="comm-option block p-3 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-purple-500 hover:bg-purple-50 transition">
                                <input type="radio" name="communication" value="보도후통지" onchange="selectCommunication(3, '보도후통지', this)">
                                <span class="ml-2 font-semibold">⏰ 보도 후 상황 보고</span>
                            </label>
                        </div>
                    </div>
                    
                    <!-- 4. 예산 승인 -->
                    <div class="mb-6 border-2 border-gray-200 rounded-lg p-4 hover:border-blue-500 transition" id="decision-4">
                        <div class="flex items-center justify-between mb-3">
                            <h3 class="font-bold text-lg">4️⃣ 긴급 예산 승인</h3>
                            <span class="incomplete-badge bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-semibold">대기 중</span>
                        </div>
                        <p class="text-sm text-gray-600 mb-4">위기 대응을 위한 긴급 예산을 승인하세요</p>
                        <div class="space-y-3">
                            <div class="flex items-center justify-between p-3 bg-gray-50 rounded">
                                <span>외부 전문가 컨설팅</span>
                                <label class="flex items-center">
                                    <input type="checkbox" value="외부전문가" onchange="selectBudget(4, this)">
                                    <span class="ml-2 font-semibold text-blue-600">5,000만원</span>
                                </label>
                            </div>
                            <div class="flex items-center justify-between p-3 bg-gray-50 rounded">
                                <span>긴급 품질 재검사</span>
                                <label class="flex items-center">
                                    <input type="checkbox" value="품질검사" onchange="selectBudget(4, this)">
                                    <span class="ml-2 font-semibold text-blue-600">3,000만원</span>
                                </label>
                            </div>
                            <div class="flex items-center justify-between p-3 bg-gray-50 rounded">
                                <span>홍보/PR 대행</span>
                                <label class="flex items-center">
                                    <input type="checkbox" value="PR대행" onchange="selectBudget(4, this)">
                                    <span class="ml-2 font-semibold text-blue-600">8,000만원</span>
                                </label>
                            </div>
                            <div class="flex items-center justify-between p-3 bg-gray-50 rounded">
                                <span>고객 보상 준비금</span>
                                <label class="flex items-center">
                                    <input type="checkbox" value="보상준비금" onchange="selectBudget(4, this)">
                                    <span class="ml-2 font-semibold text-blue-600">2억원</span>
                                </label>
                            </div>
                            <div class="p-3 bg-blue-50 border-2 border-blue-500 rounded font-bold text-right">
                                총 예산: <span id="total-budget">0</span>원
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    window.crisisResponses = {
        strategy: null,
        team: [],
        communication: null,
        budget: []
    };
    
    startCrisisCountdown();
}

function startCrisisCountdown() {
    let seconds = 21600; // 6 hours
    setInterval(() => {
        seconds--;
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        document.getElementById('crisis-countdown').textContent = 
            `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }, 1000);
}

function selectStrategy(decisionId, value, element) {
    window.crisisResponses.strategy = value;
    updateDecisionStatus(decisionId);
    
    // 선택된 옵션 하이라이트
    document.querySelectorAll('.strategy-option').forEach(opt => {
        opt.classList.remove('border-blue-500', 'bg-blue-50');
    });
    element.closest('.strategy-option').classList.add('border-blue-500', 'bg-blue-50');
}

function selectTeamMember(decisionId, element) {
    const value = element.value;
    if (element.checked) {
        window.crisisResponses.team.push(value);
        element.closest('.team-member').classList.add('border-green-500', 'bg-green-50');
    } else {
        window.crisisResponses.team = window.crisisResponses.team.filter(t => t !== value);
        element.closest('.team-member').classList.remove('border-green-500', 'bg-green-50');
    }
    
    if (window.crisisResponses.team.length > 0) {
        updateDecisionStatus(decisionId);
    }
}

function selectCommunication(decisionId, value, element) {
    window.crisisResponses.communication = value;
    updateDecisionStatus(decisionId);
    
    document.querySelectorAll('.comm-option').forEach(opt => {
        opt.classList.remove('border-purple-500', 'bg-purple-50');
    });
    element.closest('.comm-option').classList.add('border-purple-500', 'bg-purple-50');
}

function selectBudget(decisionId, element) {
    const value = element.value;
    if (element.checked) {
        window.crisisResponses.budget.push(value);
    } else {
        window.crisisResponses.budget = window.crisisResponses.budget.filter(b => b !== value);
    }
    
    // 총 예산 계산
    const budgetMap = {
        '외부전문가': 50000000,
        '품질검사': 30000000,
        'PR대행': 80000000,
        '보상준비금': 200000000
    };
    
    const total = window.crisisResponses.budget.reduce((sum, item) => {
        return sum + budgetMap[item];
    }, 0);
    
    document.getElementById('total-budget').textContent = total.toLocaleString();
    
    if (window.crisisResponses.budget.length > 0) {
        updateDecisionStatus(decisionId);
    }
}

function updateDecisionStatus(decisionId) {
    const statusMap = {
        1: () => window.crisisResponses.strategy !== null,
        2: () => window.crisisResponses.team.length > 0,
        3: () => window.crisisResponses.communication !== null,
        4: () => window.crisisResponses.budget.length > 0
    };
    
    const decisionDiv = document.getElementById(`decision-${decisionId}`);
    const badge = decisionDiv.querySelector('.incomplete-badge');
    
    if (statusMap[decisionId]()) {
        badge.className = 'bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold';
        badge.innerHTML = '<i class="fas fa-check-circle mr-1"></i>완료';
        decisionDiv.classList.add('border-green-500', 'bg-green-50');
    }
    
    updateCrisisProgress();
}

function updateCrisisProgress() {
    const completed = [
        window.crisisResponses.strategy !== null,
        window.crisisResponses.team.length > 0,
        window.crisisResponses.communication !== null,
        window.crisisResponses.budget.length > 0
    ].filter(Boolean).length;
    
    const progress = (completed / 4) * 100;
    document.getElementById('crisis-progress').style.width = progress + '%';
    document.getElementById('crisis-progress-text').textContent = `${completed}/4 완료`;
    
    // Update main progress
    document.getElementById('progress-bar').style.width = progress + '%';
    document.getElementById('progress-text').textContent = Math.round(progress);
}

// 3. 보고서 작성 시뮬레이션 - MS Office 스타일
function renderDocumentEditor(question) {
    const content = document.getElementById('simulation-content');
    
    const departments = [
        { id: 1, name: '영업부', status: '제출', data: '매출 120억원, 전년대비 15% 증가', icon: '💼' },
        { id: 2, name: '마케팅부', status: '부분제출', data: '캠페인 3건 진행 중, 데이터 보완 필요', icon: '📊' },
        { id: 3, name: '개발부', status: '미제출', data: null, icon: '💻' },
        { id: 4, name: '인사부', status: '제출', data: '신규 채용 8명, 이직률 5%', icon: '👥' },
        { id: 5, name: '재무부', status: '미제출', data: null, icon: '💰' },
        { id: 6, name: '고객지원부', status: '부분제출', data: '고객 만족도 조사 진행 중', icon: '🎧' }
    ];
    
    totalTasks = departments.filter(d => d.status !== '제출').length;
    
    content.innerHTML = `
        <div class="h-screen bg-gray-100 flex flex-col">
            <!-- Office 스타일 상단 툴바 -->
            <div class="bg-white border-b shadow-sm">
                <div class="flex items-center justify-between px-6 py-3">
                    <div class="flex items-center space-x-4">
                        <div class="text-2xl font-bold text-blue-600"><i class="fas fa-file-word mr-2"></i>보고서 작성</div>
                        <div class="text-sm text-gray-600">${question.title}</div>
                    </div>
                    <div class="flex items-center space-x-3">
                        <button class="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded flex items-center">
                            <i class="fas fa-save mr-2"></i>임시저장
                        </button>
                        <button class="px-4 py-2 text-sm bg-blue-600 text-white hover:bg-blue-700 rounded flex items-center" onclick="completeSimulation()">
                            <i class="fas fa-check mr-2"></i>완료하고 다음 단계로
                        </button>
                    </div>
                </div>
                
                <!-- 리본 메뉴 -->
                <div class="flex items-center space-x-6 px-6 py-2 bg-gray-50 border-t text-sm">
                    <div class="flex items-center space-x-2">
                        <i class="fas fa-font text-gray-600"></i>
                        <select class="border rounded px-2 py-1 text-sm">
                            <option>맑은 고딕</option>
                            <option>나눔고딕</option>
                            <option>Arial</option>
                        </select>
                        <select class="border rounded px-2 py-1 text-sm w-16">
                            <option>11</option>
                            <option>12</option>
                            <option>14</option>
                        </select>
                    </div>
                    <div class="flex items-center space-x-1">
                        <button class="p-2 hover:bg-gray-200 rounded"><i class="fas fa-bold"></i></button>
                        <button class="p-2 hover:bg-gray-200 rounded"><i class="fas fa-italic"></i></button>
                        <button class="p-2 hover:bg-gray-200 rounded"><i class="fas fa-underline"></i></button>
                    </div>
                    <div class="w-px h-6 bg-gray-300"></div>
                    <div class="flex items-center space-x-1">
                        <button class="p-2 hover:bg-gray-200 rounded" title="차트 삽입"><i class="fas fa-chart-bar"></i></button>
                        <button class="p-2 hover:bg-gray-200 rounded" title="표 삽입"><i class="fas fa-table"></i></button>
                        <button class="p-2 hover:bg-gray-200 rounded" title="이미지 삽입"><i class="fas fa-image"></i></button>
                    </div>
                </div>
            </div>
            
            <div class="flex-1 flex overflow-hidden">
                <!-- 왼쪽: 부서별 데이터 수집 패널 -->
                <div class="w-80 bg-white border-r overflow-y-auto">
                    <div class="p-5">
                        <h3 class="font-bold text-lg mb-4 flex items-center text-blue-700">
                            <i class="fas fa-database mr-2"></i>
                            부서별 데이터 수집
                        </h3>
                        
                        <!-- 진행률 -->
                        <div class="mb-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
                            <div class="flex justify-between text-sm font-semibold mb-2">
                                <span>수집 진행률</span>
                                <span id="data-progress-text" class="text-blue-600">0%</span>
                            </div>
                            <div class="w-full bg-gray-200 rounded-full h-3">
                                <div id="data-progress-bar" class="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-300" style="width: 0%"></div>
                            </div>
                            <div class="text-xs text-gray-600 mt-2">
                                <span id="data-count">0</span> / ${totalTasks} 부서 결정 완료
                            </div>
                        </div>
                        
                        <!-- 부서 리스트 -->
                        ${departments.map((dept, idx) => `
                            <div class="mb-4 p-4 border-2 rounded-lg transition-all" id="dept-card-${dept.id}">
                                <div class="flex items-center justify-between mb-3">
                                    <div class="flex items-center">
                                        <span class="text-2xl mr-2">${dept.icon}</span>
                                        <span class="font-semibold text-gray-800">${dept.name}</span>
                                    </div>
                                    <span class="text-xs px-3 py-1 rounded-full font-medium ${
                                        dept.status === '제출' ? 'bg-green-100 text-green-700' : 
                                        dept.status === '부분제출' ? 'bg-yellow-100 text-yellow-700' : 
                                        'bg-red-100 text-red-700'
                                    }">
                                        ${dept.status}
                                    </span>
                                </div>
                                
                                ${dept.data ? `
                                    <div class="text-xs text-gray-600 mb-3 p-2 bg-gray-50 rounded">
                                        ${dept.data}
                                    </div>
                                ` : ''}
                                
                                ${dept.status !== '제출' ? `
                                    <div class="space-y-3 mt-3">
                                        <div>
                                            <label class="text-xs font-semibold text-gray-700 mb-1 block">긴급도 평가</label>
                                            <select class="w-full border-2 rounded-lg px-3 py-2 text-sm focus:border-blue-500 focus:outline-none" 
                                                    id="priority-${dept.id}" onchange="updateDeptDecision(${dept.id})">
                                                <option value="">선택하세요</option>
                                                <option value="1">🔴 높음 (보고서 필수 항목)</option>
                                                <option value="2">🟡 보통 (있으면 좋음)</option>
                                                <option value="3">🟢 낮음 (생략 가능)</option>
                                            </select>
                                        </div>
                                        
                                        <div>
                                            <label class="text-xs font-semibold text-gray-700 mb-1 block">대응 방안</label>
                                            <select class="w-full border-2 rounded-lg px-3 py-2 text-sm focus:border-blue-500 focus:outline-none" 
                                                    id="action-${dept.id}" onchange="updateDeptDecision(${dept.id})">
                                                <option value="">선택하세요</option>
                                                <option value="즉시독촉">📞 긴급 독촉 (전화/방문)</option>
                                                <option value="기존자료">📄 기존 자료로 대체</option>
                                                <option value="이번제외">❌ 이번 보고서에서 제외</option>
                                                <option value="간략요약">✏️ 간략 요약으로 처리</option>
                                            </select>
                                        </div>
                                        
                                        <div>
                                            <label class="text-xs font-semibold text-gray-700 mb-1 block">상황 메모</label>
                                            <textarea class="w-full border-2 rounded-lg px-3 py-2 text-sm focus:border-blue-500 focus:outline-none" 
                                                      rows="2" placeholder="예: 담당자 출장중, 시스템 장애 등..." 
                                                      id="note-${dept.id}" onchange="updateDeptDecision(${dept.id})"></textarea>
                                        </div>
                                        
                                        <button class="w-full py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all" 
                                                id="complete-btn-${dept.id}" onclick="completeDeptDecision(${dept.id})" disabled>
                                            <i class="fas fa-check mr-2"></i>결정 완료
                                        </button>
                                    </div>
                                ` : `
                                    <div class="text-sm text-green-600 font-medium mt-3 flex items-center">
                                        <i class="fas fa-check-circle mr-2"></i>데이터 수집 완료
                                    </div>
                                `}
                            </div>
                        `).join('')}
                    </div>
                </div>
                
                <!-- 중앙: A4 보고서 편집 영역 -->
                <div class="flex-1 bg-gray-200 p-8 overflow-y-auto">
                    <div class="max-w-4xl mx-auto bg-white shadow-2xl" style="min-height: 1123px; padding: 40mm 20mm;">
                        <!-- A4 용지 사이즈 -->
                        <div class="border-b-4 border-blue-600 pb-4 mb-8">
                            <h1 class="text-4xl font-bold text-gray-800 mb-3">2026년 1분기 통합 실적 보고서</h1>
                            <div class="flex justify-between text-sm text-gray-600">
                                <span>작성일: 2026년 2월 23일</span>
                                <span>작성자: ${question.sender || '경영기획팀'}</span>
                            </div>
                        </div>
                        
                        <div id="report-content" class="space-y-8">
                            <section>
                                <h2 class="text-2xl font-bold mb-4 text-blue-700 flex items-center">
                                    <span class="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center mr-3 text-lg">1</span>
                                    개요
                                </h2>
                                <textarea class="w-full border-2 rounded-lg p-4 text-sm focus:border-blue-500 focus:outline-none" 
                                          rows="4" placeholder="보고서 작성 목적과 개요를 입력하세요..."></textarea>
                            </section>
                            
                            <section>
                                <h2 class="text-2xl font-bold mb-4 text-blue-700 flex items-center">
                                    <span class="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center mr-3 text-lg">2</span>
                                    부서별 데이터 현황
                                </h2>
                                <div class="grid grid-cols-3 gap-4 mb-6">
                                    ${departments.map(dept => `
                                        <div class="border-2 rounded-lg p-4 ${dept.status === '제출' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}">
                                            <div class="text-2xl mb-2">${dept.icon}</div>
                                            <div class="font-semibold text-sm mb-1">${dept.name}</div>
                                            <div class="text-3xl font-bold ${dept.status === '제출' ? 'text-green-600' : 'text-red-600'}">
                                                ${dept.status === '제출' ? '✓' : '?'}
                                            </div>
                                            <div class="text-xs text-gray-600 mt-1">${dept.status}</div>
                                        </div>
                                    `).join('')}
                                </div>
                                <textarea class="w-full border-2 rounded-lg p-4 text-sm focus:border-blue-500 focus:outline-none" 
                                          rows="5" placeholder="부서별 데이터 분석 및 인사이트를 작성하세요..."></textarea>
                            </section>
                            
                            <section>
                                <h2 class="text-2xl font-bold mb-4 text-blue-700 flex items-center">
                                    <span class="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center mr-3 text-lg">3</span>
                                    데이터 시각화
                                </h2>
                                <div class="border-2 border-dashed rounded-lg p-8 bg-gray-50 text-center">
                                    <i class="fas fa-chart-bar text-6xl text-gray-400"></i>
                                    <p class="text-gray-600 mt-4 mb-4">차트 및 그래프 삽입 영역</p>
                                    <div class="flex justify-center space-x-3">
                                        <button class="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700">
                                            <i class="fas fa-chart-line mr-2"></i>차트 추가
                                        </button>
                                        <button class="px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700">
                                            <i class="fas fa-table mr-2"></i>표 추가
                                        </button>
                                    </div>
                                </div>
                            </section>
                            
                            <section>
                                <h2 class="text-2xl font-bold mb-4 text-blue-700 flex items-center">
                                    <span class="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center mr-3 text-lg">4</span>
                                    결론 및 제언
                                </h2>
                                <textarea class="w-full border-2 rounded-lg p-4 text-sm focus:border-blue-500 focus:outline-none" 
                                          rows="5" placeholder="분석 결과를 바탕으로 한 결론과 향후 계획을 작성하세요..."></textarea>
                            </section>
                        </div>
                    </div>
                </div>
                
                <!-- 오른쪽: 디자인 및 레이아웃 패널 -->
                <div class="w-64 bg-white border-l overflow-y-auto">
                    <div class="p-5">
                        <h3 class="font-bold text-lg mb-4 flex items-center">
                            <i class="fas fa-palette text-purple-600 mr-2"></i>
                            디자인
                        </h3>
                        
                        <div class="mb-6">
                            <label class="text-sm font-semibold mb-3 block text-gray-700">테마 색상</label>
                            <div class="grid grid-cols-4 gap-2">
                                <div class="w-full h-10 bg-blue-600 rounded-lg cursor-pointer hover:ring-2 ring-blue-300" title="파랑"></div>
                                <div class="w-full h-10 bg-green-600 rounded-lg cursor-pointer hover:ring-2 ring-green-300" title="초록"></div>
                                <div class="w-full h-10 bg-purple-600 rounded-lg cursor-pointer hover:ring-2 ring-purple-300" title="보라"></div>
                                <div class="w-full h-10 bg-orange-600 rounded-lg cursor-pointer hover:ring-2 ring-orange-300" title="주황"></div>
                            </div>
                        </div>
                        
                        <div class="mb-6">
                            <label class="text-sm font-semibold mb-3 block text-gray-700">레이아웃</label>
                            <div class="space-y-3">
                                <div class="border-2 rounded-lg p-3 cursor-pointer hover:border-blue-500 hover:bg-blue-50">
                                    <div class="h-4 bg-gray-300 rounded mb-2"></div>
                                    <div class="h-12 bg-gray-200 rounded"></div>
                                    <div class="text-xs text-center mt-2 text-gray-600">1단 레이아웃</div>
                                </div>
                                <div class="border-2 rounded-lg p-3 cursor-pointer hover:border-blue-500 hover:bg-blue-50">
                                    <div class="h-4 bg-gray-300 rounded mb-2"></div>
                                    <div class="flex space-x-2">
                                        <div class="flex-1 h-12 bg-gray-200 rounded"></div>
                                        <div class="flex-1 h-12 bg-gray-200 rounded"></div>
                                    </div>
                                    <div class="text-xs text-center mt-2 text-gray-600">2단 레이아웃</div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="mb-6">
                            <label class="text-sm font-semibold mb-3 block text-gray-700">요소 추가</label>
                            <div class="space-y-2">
                                <button class="w-full py-2 border-2 rounded-lg hover:border-blue-500 hover:bg-blue-50 text-sm flex items-center justify-center">
                                    <i class="fas fa-heading mr-2"></i>제목 추가
                                </button>
                                <button class="w-full py-2 border-2 rounded-lg hover:border-blue-500 hover:bg-blue-50 text-sm flex items-center justify-center">
                                    <i class="fas fa-align-left mr-2"></i>텍스트 추가
                                </button>
                                <button class="w-full py-2 border-2 rounded-lg hover:border-blue-500 hover:bg-blue-50 text-sm flex items-center justify-center">
                                    <i class="fas fa-table mr-2"></i>표 추가
                                </button>
                                <button class="w-full py-2 border-2 rounded-lg hover:border-blue-500 hover:bg-blue-50 text-sm flex items-center justify-center">
                                    <i class="fas fa-chart-pie mr-2"></i>차트 추가
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    window.deptDecisions = {};
    departments.filter(d => d.status !== '제출').forEach(dept => {
        window.deptDecisions[dept.id] = { complete: false };
    });
}

function updateDeptDecision(deptId) {
    const priority = document.getElementById(`priority-${deptId}`)?.value;
    const action = document.getElementById(`action-${deptId}`)?.value;
    const note = document.getElementById(`note-${deptId}`)?.value;
    
    if (!window.deptDecisions[deptId]) {
        window.deptDecisions[deptId] = {};
    }
    
    window.deptDecisions[deptId].priority = priority;
    window.deptDecisions[deptId].action = action;
    window.deptDecisions[deptId].note = note;
    
    // 완료 버튼 활성화 여부
    const completeBtn = document.getElementById(`complete-btn-${deptId}`);
    if (priority && action) {
        completeBtn.disabled = false;
        completeBtn.classList.remove('opacity-50', 'cursor-not-allowed');
    } else {
        completeBtn.disabled = true;
        completeBtn.classList.add('opacity-50', 'cursor-not-allowed');
    }
}

function completeDeptDecision(deptId) {
    const decision = window.deptDecisions[deptId];
    if (!decision || !decision.priority || !decision.action) {
        alert('우선순위와 조치 방안을 모두 선택해주세요.');
        return;
    }
    
    decision.complete = true;
    
    // UI 업데이트
    const deptCard = document.getElementById(`dept-card-${deptId}`);
    if (deptCard) {
        deptCard.classList.add('border-green-500', 'bg-green-50');
        deptCard.innerHTML = `
            <div class="flex items-center justify-between">
                <span class="font-semibold text-green-700">
                    <i class="fas fa-check-circle text-2xl mr-2"></i>
                    결정 완료
                </span>
            </div>
            <div class="mt-3 text-sm space-y-1 text-gray-700">
                <div><strong>우선순위:</strong> ${decision.priority}순위</div>
                <div><strong>조치:</strong> ${decision.action}</div>
                ${decision.note ? `<div><strong>메모:</strong> ${decision.note}</div>` : ''}
            </div>
        `;
    }
    
    // 진행률 업데이트
    updateReportProgress();
}

function updateReportProgress() {
    const completed = Object.values(window.deptDecisions).filter(d => d.complete).length;
    const total = Object.keys(window.deptDecisions).length;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
    
    const progressBar = document.getElementById('data-progress-bar');
    const progressText = document.getElementById('data-progress-text');
    const dataCount = document.getElementById('data-count');
    
    if (progressBar) progressBar.style.width = `${percentage}%`;
    if (progressText) progressText.textContent = `${percentage}%`;
    if (dataCount) dataCount.textContent = completed;
    
    // 전체 진행률도 업데이트
    const mainProgressBar = document.getElementById('progress-bar');
    const mainProgressText = document.getElementById('progress-text');
    if (mainProgressBar) mainProgressBar.style.width = `${percentage}%`;
    if (mainProgressText) mainProgressText.textContent = `${percentage}%`;
}

// 4. 일정 관리 시뮬레이션 - Google Calendar/Outlook 스타일
function renderCalendarApp(question) {
    const content = document.getElementById('simulation-content');
    
    // question.title에 따라 다른 UI 렌더링
    const title = question.title || '';
    
    // 연간 마케팅 전략 회의 일정 조율
    if (title.includes('마케팅 전략') || title.includes('회의 일정')) {
        renderMarketingStrategyMeeting(question);
        return;
    }
    
    // 기본: 일정 충돌 해결
    const meetings = [
        {
            id: 1,
            title: '신제품 런칭 전략 회의',
            time: '14:00 - 15:30',
            type: '필수 참석',
            priority: 'high',
            attendees: ['CEO 김대표', '마케팅이사', '개발팀장', '디자인팀장'],
            location: '본사 2층 대회의실',
            description: '2026년 상반기 신제품 마케팅 전략 수립 및 예산 논의',
            materials: ['마케팅_전략안.pdf', '경쟁사_분석.xlsx']
        },
        {
            id: 2,
            title: '주요 투자자 미팅',
            time: '14:00 - 16:00',
            type: '필수 참석',
            priority: 'high',
            attendees: ['CFO 박상무', '투자자 A', '투자자 B', '투자자 C'],
            location: '강남 투자사 본사',
            description: '시리즈 B 투자 유치 마무리 및 향후 재무 계획 논의',
            materials: ['재무제표_Q1.pdf', '투자제안서.pdf']
        },
        {
            id: 3,
            title: '전사 직원 간담회',
            time: '14:00 - 15:00',
            type: '선택 참석',
            priority: 'low',
            attendees: ['전 직원 (약 50명)'],
            location: '온라인 (Zoom)',
            description: '월간 업무 공유 및 팀 빌딩',
            materials: ['2월_업무현황.pdf']
        }
    ];
    
    totalTasks = meetings.length;
    
    content.innerHTML = `
        <div class="h-screen bg-gray-50 flex flex-col">
            <!-- 캘린더 헤더 -->
            <div class="bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg">
                <div class="px-6 py-4">
                    <div class="flex items-center justify-between">
                        <div class="flex items-center space-x-4">
                            <i class="fas fa-calendar-alt text-3xl"></i>
                            <div>
                                <div class="text-2xl font-bold">${question.title || '2026년 2월 24일 (월)'}</div>
                                <div class="text-sm opacity-90 mt-1">${question.sender || '경영기획팀'} • ${question.date || '2026-02-23'}</div>
                            </div>
                        </div>
                        <div class="text-right">
                            <div class="text-sm opacity-75">결정 진행률</div>
                            <div class="text-3xl font-bold" id="calendar-progress-text">0%</div>
                        </div>
                    </div>
                </div>
                <div class="px-6 pb-2">
                    <div class="w-full bg-white bg-opacity-30 rounded-full h-2">
                        <div id="calendar-progress-bar" class="bg-white h-2 rounded-full transition-all duration-300" style="width: 0%"></div>
                    </div>
                </div>
            </div>
            
            <div class="flex-1 flex overflow-hidden">
                <!-- 왼쪽: 캘린더 뷰 -->
                <div class="flex-1 bg-white p-6 overflow-y-auto">
                    <div class="max-w-5xl mx-auto">
                        <!-- 시간대별 타임라인 -->
                        <div class="mb-6">
                            <h3 class="font-bold text-lg mb-4 flex items-center">
                                <i class="fas fa-clock text-blue-600 mr-2"></i>
                                오늘의 일정
                            </h3>
                            
                            <!-- 타임라인 -->
                            <div class="relative">
                                <!-- 시간 레이블 -->
                                <div class="flex text-xs text-gray-500 mb-2">
                                    <div class="w-16">시간</div>
                                    <div class="flex-1 grid grid-cols-12">
                                        ${[...Array(12)].map((_, i) => `
                                            <div class="text-center">${i + 9}시</div>
                                        `).join('')}
                                    </div>
                                </div>
                                
                                <!-- 시간 그리드 -->
                                <div class="flex">
                                    <div class="w-16"></div>
                                    <div class="flex-1 grid grid-cols-12 border-t border-l">
                                        ${[...Array(12)].map(() => `
                                            <div class="border-r border-b h-12"></div>
                                        `).join('')}
                                    </div>
                                </div>
                                
                                <!-- 14시(오후 2시) 충돌 표시 -->
                                <div class="absolute top-10" style="left: 80px; width: calc(100% - 80px);">
                                    <div class="relative" style="left: 41.66%; width: 16.66%;">
                                        <div class="h-16 bg-red-100 border-2 border-red-500 rounded-lg p-2 animate-pulse">
                                            <div class="text-xs font-bold text-red-700">⚠️ 3개 회의 충돌!</div>
                                            <div class="text-xs text-red-600">14:00 - 16:00</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <!-- 충돌 회의 리스트 -->
                        <div class="mt-12">
                            <h3 class="font-bold text-lg mb-4 flex items-center">
                                <i class="fas fa-exclamation-triangle text-red-600 mr-2"></i>
                                충돌 회의 목록
                            </h3>
                            
                            <div class="space-y-4">
                                ${meetings.map((meeting, idx) => `
                                    <div class="border-2 rounded-xl p-5 transition-all ${meeting.priority === 'high' ? 'border-red-200 bg-red-50' : 'border-gray-200'}" 
                                         id="meeting-card-${meeting.id}">
                                        <div class="flex items-start justify-between mb-4">
                                            <div class="flex-1">
                                                <div class="flex items-center mb-2">
                                                    <span class="text-2xl mr-2">${meeting.priority === 'high' ? '🔴' : '🔵'}</span>
                                                    <h4 class="text-xl font-bold text-gray-800">${meeting.title}</h4>
                                                </div>
                                                <div class="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                                                    <span class="flex items-center">
                                                        <i class="fas fa-clock mr-1"></i>${meeting.time}
                                                    </span>
                                                    <span class="flex items-center">
                                                        <i class="fas fa-map-marker-alt mr-1"></i>${meeting.location}
                                                    </span>
                                                    <span class="px-3 py-1 rounded-full text-xs font-semibold ${
                                                        meeting.priority === 'high' 
                                                        ? 'bg-red-100 text-red-700' 
                                                        : 'bg-blue-100 text-blue-700'
                                                    }">
                                                        ${meeting.type}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div class="grid grid-cols-2 gap-4 mb-4">
                                            <div class="bg-gray-50 rounded-lg p-3">
                                                <div class="text-xs font-semibold text-gray-600 mb-2">참석자</div>
                                                <div class="space-y-1">
                                                    ${meeting.attendees.map(attendee => `
                                                        <div class="text-sm flex items-center">
                                                            <i class="fas fa-user-circle text-gray-400 mr-2"></i>
                                                            ${attendee}
                                                        </div>
                                                    `).join('')}
                                                </div>
                                            </div>
                                            <div class="bg-gray-50 rounded-lg p-3">
                                                <div class="text-xs font-semibold text-gray-600 mb-2">회의 자료</div>
                                                <div class="space-y-1">
                                                    ${meeting.materials.map(material => `
                                                        <div class="text-sm flex items-center">
                                                            <i class="fas fa-file-pdf text-red-500 mr-2"></i>
                                                            ${material}
                                                        </div>
                                                    `).join('')}
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div class="bg-blue-50 rounded-lg p-3 mb-4">
                                            <div class="text-xs font-semibold text-gray-700 mb-1">회의 내용</div>
                                            <div class="text-sm text-gray-600">${meeting.description}</div>
                                        </div>
                                        
                                        <div id="meeting-decision-${meeting.id}">
                                            <div class="text-sm font-semibold mb-3 text-gray-700">이 회의를 어떻게 처리하시겠습니까?</div>
                                            <div class="grid grid-cols-2 gap-3">
                                                <button onclick="decideMeeting(${meeting.id}, '직접참석', '${meeting.title}')" 
                                                        class="py-3 border-2 border-blue-300 rounded-lg hover:bg-blue-50 hover:border-blue-500 transition-all font-semibold text-blue-700">
                                                    <i class="fas fa-user-check mr-2"></i>직접 참석
                                                </button>
                                                <button onclick="decideMeeting(${meeting.id}, '대리참석', '${meeting.title}')" 
                                                        class="py-3 border-2 border-green-300 rounded-lg hover:bg-green-50 hover:border-green-500 transition-all font-semibold text-green-700">
                                                    <i class="fas fa-user-friends mr-2"></i>대리 참석
                                                </button>
                                                <button onclick="decideMeeting(${meeting.id}, '시간변경요청', '${meeting.title}')" 
                                                        class="py-3 border-2 border-yellow-300 rounded-lg hover:bg-yellow-50 hover:border-yellow-500 transition-all font-semibold text-yellow-700">
                                                    <i class="fas fa-clock mr-2"></i>시간 변경 요청
                                                </button>
                                                <button onclick="decideMeeting(${meeting.id}, '불참통보', '${meeting.title}')" 
                                                        class="py-3 border-2 border-red-300 rounded-lg hover:bg-red-50 hover:border-red-500 transition-all font-semibold text-red-700">
                                                    <i class="fas fa-times-circle mr-2"></i>불참 통보
                                                </button>
                                            </div>
                                            
                                            <div class="mt-3">
                                                <textarea id="meeting-note-${meeting.id}" 
                                                          class="w-full border-2 rounded-lg px-3 py-2 text-sm focus:border-blue-500 focus:outline-none" 
                                                          rows="2" 
                                                          placeholder="결정 사유 및 메모를 입력하세요..."></textarea>
                                            </div>
                                        </div>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- 오른쪽: 결정 요약 패널 -->
                <div class="w-80 bg-white border-l overflow-y-auto">
                    <div class="p-5">
                        <h3 class="font-bold text-lg mb-4 flex items-center">
                            <i class="fas fa-clipboard-check text-green-600 mr-2"></i>
                            결정 요약
                        </h3>
                        
                        <div id="decision-summary" class="space-y-3">
                            <div class="p-4 bg-gray-50 rounded-lg text-center text-gray-500 text-sm">
                                아직 결정된 회의가 없습니다
                            </div>
                        </div>
                        
                        <div class="mt-6 p-4 bg-blue-50 rounded-lg">
                            <div class="text-sm font-semibold text-blue-900 mb-2">💡 조정 팁</div>
                            <ul class="text-xs text-blue-800 space-y-1">
                                <li>• 필수 참석 회의를 우선 고려하세요</li>
                                <li>• 대리 참석 가능 여부를 확인하세요</li>
                                <li>• 회의 중요도와 영향력을 평가하세요</li>
                                <li>• 시간 변경 가능성을 타진하세요</li>
                            </ul>
                        </div>
                        
                        <button class="w-full mt-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all" 
                                onclick="completeSimulation()">
                            <i class="fas fa-check mr-2"></i>완료하고 다음 단계로
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    window.meetingDecisions = {};
}

function decideMeeting(id, decision, title) {
    const note = document.getElementById(`meeting-note-${id}`)?.value || '';
    
    window.meetingDecisions[id] = {
        decision,
        note,
        title,
        timestamp: new Date().toLocaleTimeString()
    };
    
    // 회의 카드 업데이트
    const meetingCard = document.getElementById(`meeting-card-${id}`);
    const decisionArea = document.getElementById(`meeting-decision-${id}`);
    
    if (meetingCard && decisionArea) {
        meetingCard.classList.add('border-green-500', 'bg-green-50');
        
        const iconMap = {
            '직접참석': { icon: 'fa-user-check', color: 'blue' },
            '대리참석': { icon: 'fa-user-friends', color: 'green' },
            '시간변경요청': { icon: 'fa-clock', color: 'yellow' },
            '불참통보': { icon: 'fa-times-circle', color: 'red' }
        };
        
        const style = iconMap[decision] || { icon: 'fa-check', color: 'green' };
        
        decisionArea.innerHTML = `
            <div class="bg-green-100 border-2 border-green-500 rounded-lg p-4">
                <div class="flex items-center mb-2">
                    <i class="fas ${style.icon} text-${style.color}-600 text-xl mr-2"></i>
                    <span class="font-bold text-green-800">결정 완료: ${decision}</span>
                </div>
                ${note ? `<div class="text-sm text-gray-700 mt-2"><strong>메모:</strong> ${note}</div>` : ''}
            </div>
        `;
    }
    
    // 진행률 업데이트
    updateCalendarProgress();
    
    // 결정 요약 업데이트
    updateDecisionSummary();
}

function updateCalendarProgress() {
    const completed = Object.keys(window.meetingDecisions).length;
    const total = totalTasks;
    const percentage = Math.round((completed / total) * 100);
    
    const progressBar = document.getElementById('calendar-progress-bar');
    const progressText = document.getElementById('calendar-progress-text');
    
    if (progressBar) progressBar.style.width = `${percentage}%`;
    if (progressText) progressText.textContent = `${percentage}%`;
    
    // 전체 진행률도 업데이트
    const mainProgressBar = document.getElementById('progress-bar');
    const mainProgressText = document.getElementById('progress-text');
    if (mainProgressBar) mainProgressBar.style.width = `${percentage}%`;
    if (mainProgressText) mainProgressText.textContent = `${percentage}%`;
}

function updateDecisionSummary() {
    const summaryEl = document.getElementById('decision-summary');
    if (!summaryEl) return;
    
    const decisions = Object.values(window.meetingDecisions);
    
    if (decisions.length === 0) {
        summaryEl.innerHTML = `
            <div class="p-4 bg-gray-50 rounded-lg text-center text-gray-500 text-sm">
                아직 결정된 회의가 없습니다
            </div>
        `;
        return;
    }
    
    summaryEl.innerHTML = decisions.map(d => {
        const iconMap = {
            '직접참석': { icon: 'fa-user-check', color: 'blue', bg: 'blue-50' },
            '대리참석': { icon: 'fa-user-friends', color: 'green', bg: 'green-50' },
            '시간변경요청': { icon: 'fa-clock', color: 'yellow', bg: 'yellow-50' },
            '불참통보': { icon: 'fa-times-circle', color: 'red', bg: 'red-50' }
        };
        
        const style = iconMap[d.decision] || { icon: 'fa-check', color: 'green', bg: 'green-50' };
        
        return `
            <div class="p-3 bg-${style.bg} border border-${style.color}-200 rounded-lg">
                <div class="flex items-start">
                    <i class="fas ${style.icon} text-${style.color}-600 mt-1 mr-2"></i>
                    <div class="flex-1">
                        <div class="font-semibold text-sm text-gray-800">${d.title}</div>
                        <div class="text-xs text-${style.color}-700 mt-1">${d.decision}</div>
                        ${d.note ? `<div class="text-xs text-gray-600 mt-1">${d.note}</div>` : ''}
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

// 5. 통합 업무 시뮬레이션 - 멀티채널 대시보드
function renderProjectDashboard(question) {
    const content = document.getElementById('simulation-content');
    
    // question.title에 따라 다른 UI 렌더링
    const title = question.title || '';
    
    // 사무실 냉난방기 고장 - 수리 업체 선정
    if (title.includes('냉난방기') || title.includes('HVAC') || title.includes('수리')) {
        if (window.renderHVACRepair) {
            window.renderHVACRepair(question);
        } else {
            renderDefaultView(question);
        }
        return;
    }
    
    // 기본: 멀티채널 통합 관리
    const channels = {
        email: [
            { id: 'e1', time: '09:15', from: 'customer@example.com', subject: '제품 불량 - 교환 요청', priority: 'high', content: '어제 구매한 제품에 결함이 있습니다. 즉시 교환해주세요.' },
            { id: 'e2', time: '10:30', from: 'partner@company.com', subject: '납품 일정 문의', priority: 'normal', content: '3월 납품 일정 확인 부탁드립니다.' }
        ],
        phone: [
            { id: 'p1', time: '09:45', caller: '김영희 고객', issue: 'VIP 고객 불만', priority: 'high', content: '배송 지연으로 인한 불만. 즉시 대응 필요.' },
            { id: 'p2', time: '11:00', caller: '이철수 대리', issue: '내부 문의', priority: 'normal', content: '프로젝트 진행 상황 공유 요청' }
        ],
        sns: [
            { id: 's1', time: '08:30', platform: 'Twitter', user: '@angry_user', content: '제품 품질 최악! 환불 안 해주면 고발하겠습니다. #소비자피해', priority: 'high', engagement: '리트윗 15, 댓글 8' },
            { id: 's2', time: '10:15', platform: 'Instagram', user: '@happy_customer', content: '정말 좋은 제품이네요! 추천합니다 👍', priority: 'low', engagement: '좋아요 42' }
        ],
        messenger: [
            { id: 'm1', time: '09:00', user: '박팀장 (내부)', content: '긴급! 오늘 오후 2시 미팅 준비 상황 공유 부탁합니다.', priority: 'high' },
            { id: 'm2', time: '11:30', user: '최고객', content: '주문한 상품 배송 조회 부탁드려요', priority: 'normal' }
        ]
    };
    
    const totalIssues = Object.values(channels).flat().length;
    totalTasks = totalIssues;
    
    content.innerHTML = `
        <div class="h-screen bg-gray-50 flex flex-col">
            <!-- 대시보드 헤더 -->
            <div class="bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg">
                <div class="px-6 py-4">
                    <div class="flex items-center justify-between">
                        <div class="flex items-center space-x-4">
                            <i class="fas fa-layer-group text-3xl"></i>
                            <div>
                                <div class="text-2xl font-bold">${question.title || '멀티채널 통합 관리 대시보드'}</div>
                                <div class="text-sm opacity-90 mt-1">${question.sender || '고객지원팀'} • ${question.date || '2026-02-23'}</div>
                            </div>
                        </div>
                        <div class="text-right">
                            <div class="text-sm opacity-75">처리율</div>
                            <div class="text-3xl font-bold" id="multichannel-progress-text">0%</div>
                        </div>
                    </div>
                </div>
                <div class="px-6 pb-2">
                    <div class="w-full bg-white bg-opacity-30 rounded-full h-2">
                        <div id="multichannel-progress-bar" class="bg-white h-2 rounded-full transition-all duration-300" style="width: 0%"></div>
                    </div>
                </div>
            </div>
            
            <!-- 채널 탭 -->
            <div class="bg-white border-b">
                <div class="flex px-6">
                    <button onclick="switchChannel('email')" id="tab-email" class="channel-tab px-6 py-4 font-semibold border-b-4 border-blue-600 text-blue-600">
                        <i class="fas fa-envelope mr-2"></i>이메일 (${channels.email.length})
                    </button>
                    <button onclick="switchChannel('phone')" id="tab-phone" class="channel-tab px-6 py-4 font-semibold border-b-4 border-transparent text-gray-600 hover:text-gray-800">
                        <i class="fas fa-phone mr-2"></i>전화 (${channels.phone.length})
                    </button>
                    <button onclick="switchChannel('sns')" id="tab-sns" class="channel-tab px-6 py-4 font-semibold border-b-4 border-transparent text-gray-600 hover:text-gray-800">
                        <i class="fas fa-hashtag mr-2"></i>SNS (${channels.sns.length})
                    </button>
                    <button onclick="switchChannel('messenger')" id="tab-messenger" class="channel-tab px-6 py-4 font-semibold border-b-4 border-transparent text-gray-600 hover:text-gray-800">
                        <i class="fas fa-comment-dots mr-2"></i>메신저 (${channels.messenger.length})
                    </button>
                </div>
            </div>
            
            <div class="flex-1 flex overflow-hidden">
                <!-- 메인 컨텐츠 영역 -->
                <div class="flex-1 p-6 overflow-y-auto">
                    <!-- 이메일 채널 -->
                    <div id="channel-email" class="channel-content">
                        <div class="max-w-5xl mx-auto">
                            <h3 class="text-xl font-bold mb-4 flex items-center">
                                <i class="fas fa-inbox text-blue-600 mr-2"></i>
                                이메일 문의
                            </h3>
                            <div class="space-y-4">
                                ${channels.email.map(email => `
                                    <div class="bg-white border-2 rounded-lg p-5 transition-all hover:shadow-lg" id="issue-${email.id}">
                                        <div class="flex items-start justify-between mb-3">
                                            <div class="flex-1">
                                                <div class="flex items-center mb-2">
                                                    ${email.priority === 'high' ? '<span class="px-3 py-1 bg-red-100 text-red-700 text-xs font-bold rounded-full mr-2">긴급</span>' : ''}
                                                    <span class="text-lg font-bold">${email.subject}</span>
                                                </div>
                                                <div class="text-sm text-gray-600">
                                                    <i class="fas fa-user mr-1"></i>${email.from}
                                                    <span class="mx-2">•</span>
                                                    <i class="fas fa-clock mr-1"></i>${email.time}
                                                </div>
                                            </div>
                                        </div>
                                        <div class="bg-gray-50 rounded-lg p-4 mb-4">
                                            <p class="text-gray-700">${email.content}</p>
                                        </div>
                                        
                                        <div id="decision-area-${email.id}">
                                            <div class="grid grid-cols-4 gap-3">
                                                <button onclick="handleIssue('${email.id}', '즉시처리', '${email.subject}')" 
                                                        class="py-2 px-4 border-2 border-blue-300 rounded-lg hover:bg-blue-50 text-blue-700 font-semibold">
                                                    <i class="fas fa-bolt mr-1"></i>즉시 처리
                                                </button>
                                                <button onclick="handleIssue('${email.id}', '부서이관', '${email.subject}')" 
                                                        class="py-2 px-4 border-2 border-green-300 rounded-lg hover:bg-green-50 text-green-700 font-semibold">
                                                    <i class="fas fa-share mr-1"></i>부서 이관
                                                </button>
                                                <button onclick="handleIssue('${email.id}', '보류', '${email.subject}')" 
                                                        class="py-2 px-4 border-2 border-yellow-300 rounded-lg hover:bg-yellow-50 text-yellow-700 font-semibold">
                                                    <i class="fas fa-pause mr-1"></i>보류
                                                </button>
                                                <button onclick="handleIssue('${email.id}', '에스컬레이션', '${email.subject}')" 
                                                        class="py-2 px-4 border-2 border-red-300 rounded-lg hover:bg-red-50 text-red-700 font-semibold">
                                                    <i class="fas fa-exclamation-triangle mr-1"></i>에스컬레이션
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    </div>
                    
                    <!-- 전화 채널 -->
                    <div id="channel-phone" class="channel-content hidden">
                        <div class="max-w-5xl mx-auto">
                            <h3 class="text-xl font-bold mb-4 flex items-center">
                                <i class="fas fa-phone-alt text-green-600 mr-2"></i>
                                전화 문의
                            </h3>
                            <div class="space-y-4">
                                ${channels.phone.map(phone => `
                                    <div class="bg-white border-2 rounded-lg p-5 transition-all hover:shadow-lg" id="issue-${phone.id}">
                                        <div class="flex items-start justify-between mb-3">
                                            <div class="flex-1">
                                                <div class="flex items-center mb-2">
                                                    ${phone.priority === 'high' ? '<span class="px-3 py-1 bg-red-100 text-red-700 text-xs font-bold rounded-full mr-2">긴급</span>' : ''}
                                                    <span class="text-lg font-bold">${phone.issue}</span>
                                                </div>
                                                <div class="text-sm text-gray-600">
                                                    <i class="fas fa-phone mr-1"></i>${phone.caller}
                                                    <span class="mx-2">•</span>
                                                    <i class="fas fa-clock mr-1"></i>${phone.time}
                                                </div>
                                            </div>
                                        </div>
                                        <div class="bg-gray-50 rounded-lg p-4 mb-4">
                                            <p class="text-gray-700">${phone.content}</p>
                                        </div>
                                        
                                        <div id="decision-area-${phone.id}">
                                            <div class="grid grid-cols-4 gap-3">
                                                <button onclick="handleIssue('${phone.id}', '즉시처리', '${phone.issue}')" 
                                                        class="py-2 px-4 border-2 border-blue-300 rounded-lg hover:bg-blue-50 text-blue-700 font-semibold">
                                                    <i class="fas fa-bolt mr-1"></i>즉시 처리
                                                </button>
                                                <button onclick="handleIssue('${phone.id}', '부서이관', '${phone.issue}')" 
                                                        class="py-2 px-4 border-2 border-green-300 rounded-lg hover:bg-green-50 text-green-700 font-semibold">
                                                    <i class="fas fa-share mr-1"></i>부서 이관
                                                </button>
                                                <button onclick="handleIssue('${phone.id}', '보류', '${phone.issue}')" 
                                                        class="py-2 px-4 border-2 border-yellow-300 rounded-lg hover:bg-yellow-50 text-yellow-700 font-semibold">
                                                    <i class="fas fa-pause mr-1"></i>보류
                                                </button>
                                                <button onclick="handleIssue('${phone.id}', '에스컬레이션', '${phone.issue}')" 
                                                        class="py-2 px-4 border-2 border-red-300 rounded-lg hover:bg-red-50 text-red-700 font-semibold">
                                                    <i class="fas fa-exclamation-triangle mr-1"></i>에스컬레이션
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    </div>
                    
                    <!-- SNS 채널 -->
                    <div id="channel-sns" class="channel-content hidden">
                        <div class="max-w-5xl mx-auto">
                            <h3 class="text-xl font-bold mb-4 flex items-center">
                                <i class="fas fa-thumbs-up text-purple-600 mr-2"></i>
                                SNS 모니터링
                            </h3>
                            <div class="space-y-4">
                                ${channels.sns.map(sns => `
                                    <div class="bg-white border-2 rounded-lg p-5 transition-all hover:shadow-lg" id="issue-${sns.id}">
                                        <div class="flex items-start justify-between mb-3">
                                            <div class="flex-1">
                                                <div class="flex items-center mb-2">
                                                    ${sns.priority === 'high' ? '<span class="px-3 py-1 bg-red-100 text-red-700 text-xs font-bold rounded-full mr-2">긴급</span>' : ''}
                                                    <span class="text-lg font-bold">${sns.platform}</span>
                                                    <span class="ml-2 text-gray-600">${sns.user}</span>
                                                </div>
                                                <div class="text-sm text-gray-500">
                                                    <i class="fas fa-clock mr-1"></i>${sns.time}
                                                    <span class="mx-2">•</span>
                                                    <i class="fas fa-chart-line mr-1"></i>${sns.engagement}
                                                </div>
                                            </div>
                                        </div>
                                        <div class="bg-gray-50 rounded-lg p-4 mb-4">
                                            <p class="text-gray-700">${sns.content}</p>
                                        </div>
                                        
                                        <div id="decision-area-${sns.id}">
                                            <div class="grid grid-cols-4 gap-3">
                                                <button onclick="handleIssue('${sns.id}', '즉시처리', '${sns.platform}')" 
                                                        class="py-2 px-4 border-2 border-blue-300 rounded-lg hover:bg-blue-50 text-blue-700 font-semibold">
                                                    <i class="fas fa-bolt mr-1"></i>즉시 처리
                                                </button>
                                                <button onclick="handleIssue('${sns.id}', '부서이관', '${sns.platform}')" 
                                                        class="py-2 px-4 border-2 border-green-300 rounded-lg hover:bg-green-50 text-green-700 font-semibold">
                                                    <i class="fas fa-share mr-1"></i>부서 이관
                                                </button>
                                                <button onclick="handleIssue('${sns.id}', '보류', '${sns.platform}')" 
                                                        class="py-2 px-4 border-2 border-yellow-300 rounded-lg hover:bg-yellow-50 text-yellow-700 font-semibold">
                                                    <i class="fas fa-pause mr-1"></i>보류
                                                </button>
                                                <button onclick="handleIssue('${sns.id}', '에스컬레이션', '${sns.platform}')" 
                                                        class="py-2 px-4 border-2 border-red-300 rounded-lg hover:bg-red-50 text-red-700 font-semibold">
                                                    <i class="fas fa-exclamation-triangle mr-1"></i>에스컬레이션
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    </div>
                    
                    <!-- 메신저 채널 -->
                    <div id="channel-messenger" class="channel-content hidden">
                        <div class="max-w-5xl mx-auto">
                            <h3 class="text-xl font-bold mb-4 flex items-center">
                                <i class="fas fa-comments text-indigo-600 mr-2"></i>
                                메신저
                            </h3>
                            <div class="space-y-4">
                                ${channels.messenger.map(msg => `
                                    <div class="bg-white border-2 rounded-lg p-5 transition-all hover:shadow-lg" id="issue-${msg.id}">
                                        <div class="flex items-start justify-between mb-3">
                                            <div class="flex-1">
                                                <div class="flex items-center mb-2">
                                                    ${msg.priority === 'high' ? '<span class="px-3 py-1 bg-red-100 text-red-700 text-xs font-bold rounded-full mr-2">긴급</span>' : ''}
                                                    <span class="text-lg font-bold">${msg.user}</span>
                                                </div>
                                                <div class="text-sm text-gray-600">
                                                    <i class="fas fa-clock mr-1"></i>${msg.time}
                                                </div>
                                            </div>
                                        </div>
                                        <div class="bg-gray-50 rounded-lg p-4 mb-4">
                                            <p class="text-gray-700">${msg.content}</p>
                                        </div>
                                        
                                        <div id="decision-area-${msg.id}">
                                            <div class="grid grid-cols-4 gap-3">
                                                <button onclick="handleIssue('${msg.id}', '즉시처리', '${msg.user}')" 
                                                        class="py-2 px-4 border-2 border-blue-300 rounded-lg hover:bg-blue-50 text-blue-700 font-semibold">
                                                    <i class="fas fa-bolt mr-1"></i>즉시 처리
                                                </button>
                                                <button onclick="handleIssue('${msg.id}', '부서이관', '${msg.user}')" 
                                                        class="py-2 px-4 border-2 border-green-300 rounded-lg hover:bg-green-50 text-green-700 font-semibold">
                                                    <i class="fas fa-share mr-1"></i>부서 이관
                                                </button>
                                                <button onclick="handleIssue('${msg.id}', '보류', '${msg.user}')" 
                                                        class="py-2 px-4 border-2 border-yellow-300 rounded-lg hover:bg-yellow-50 text-yellow-700 font-semibold">
                                                    <i class="fas fa-pause mr-1"></i>보류
                                                </button>
                                                <button onclick="handleIssue('${msg.id}', '에스컬레이션', '${msg.user}')" 
                                                        class="py-2 px-4 border-2 border-red-300 rounded-lg hover:bg-red-50 text-red-700 font-semibold">
                                                    <i class="fas fa-exclamation-triangle mr-1"></i>에스컬레이션
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- 오른쪽: 처리 현황 패널 -->
                <div class="w-80 bg-white border-l overflow-y-auto">
                    <div class="p-5">
                        <h3 class="font-bold text-lg mb-4 flex items-center">
                            <i class="fas fa-chart-pie text-purple-600 mr-2"></i>
                            처리 현황
                        </h3>
                        
                        <div id="channel-stats" class="space-y-3 mb-6">
                            <div class="p-3 bg-blue-50 rounded-lg flex items-center justify-between">
                                <div class="flex items-center">
                                    <i class="fas fa-envelope text-blue-600 mr-2"></i>
                                    <span class="text-sm font-semibold">이메일</span>
                                </div>
                                <span class="text-sm font-bold">0/${channels.email.length}</span>
                            </div>
                            <div class="p-3 bg-green-50 rounded-lg flex items-center justify-between">
                                <div class="flex items-center">
                                    <i class="fas fa-phone text-green-600 mr-2"></i>
                                    <span class="text-sm font-semibold">전화</span>
                                </div>
                                <span class="text-sm font-bold">0/${channels.phone.length}</span>
                            </div>
                            <div class="p-3 bg-purple-50 rounded-lg flex items-center justify-between">
                                <div class="flex items-center">
                                    <i class="fas fa-hashtag text-purple-600 mr-2"></i>
                                    <span class="text-sm font-semibold">SNS</span>
                                </div>
                                <span class="text-sm font-bold">0/${channels.sns.length}</span>
                            </div>
                            <div class="p-3 bg-indigo-50 rounded-lg flex items-center justify-between">
                                <div class="flex items-center">
                                    <i class="fas fa-comment-dots text-indigo-600 mr-2"></i>
                                    <span class="text-sm font-semibold">메신저</span>
                                </div>
                                <span class="text-sm font-bold">0/${channels.messenger.length}</span>
                            </div>
                        </div>
                        
                        <div class="mb-6 p-4 bg-purple-50 rounded-lg">
                            <div class="text-sm font-semibold text-purple-900 mb-2">💡 처리 가이드</div>
                            <ul class="text-xs text-purple-800 space-y-1">
                                <li>• 긴급 사항은 즉시 처리하세요</li>
                                <li>• 전문 지식 필요 시 부서 이관하세요</li>
                                <li>• 정보 부족 시 보류하세요</li>
                                <li>• 중대 사안은 에스컬레이션하세요</li>
                            </ul>
                        </div>
                        
                        <button class="w-full py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all" 
                                onclick="completeSimulation()">
                            <i class="fas fa-check mr-2"></i>완료하고 다음 단계로
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    window.issueDecisions = {};
    window.currentChannel = 'email';
}

function switchChannel(channel) {
    window.currentChannel = channel;
    
    // 모든 채널 컨텐츠 숨기기
    document.querySelectorAll('.channel-content').forEach(el => el.classList.add('hidden'));
    // 선택한 채널 표시
    document.getElementById(`channel-${channel}`).classList.remove('hidden');
    
    // 탭 스타일 업데이트
    document.querySelectorAll('.channel-tab').forEach(tab => {
        tab.classList.remove('border-blue-600', 'text-blue-600');
        tab.classList.add('border-transparent', 'text-gray-600');
    });
    document.getElementById(`tab-${channel}`).classList.remove('border-transparent', 'text-gray-600');
    document.getElementById(`tab-${channel}`).classList.add('border-blue-600', 'text-blue-600');
}

function handleIssue(issueId, action, title) {
    window.issueDecisions[issueId] = {
        action,
        title,
        timestamp: new Date().toLocaleTimeString()
    };
    
    // UI 업데이트
    const issueCard = document.getElementById(`issue-${issueId}`);
    const decisionArea = document.getElementById(`decision-area-${issueId}`);
    
    if (issueCard && decisionArea) {
        issueCard.classList.add('border-green-500', 'bg-green-50');
        
        const iconMap = {
            '즉시처리': { icon: 'fa-bolt', color: 'blue' },
            '부서이관': { icon: 'fa-share', color: 'green' },
            '보류': { icon: 'fa-pause', color: 'yellow' },
            '에스컬레이션': { icon: 'fa-exclamation-triangle', color: 'red' }
        };
        
        const style = iconMap[action] || { icon: 'fa-check', color: 'green' };
        
        decisionArea.innerHTML = `
            <div class="bg-green-100 border-2 border-green-500 rounded-lg p-3 flex items-center">
                <i class="fas ${style.icon} text-${style.color}-600 text-xl mr-3"></i>
                <div>
                    <div class="font-bold text-green-800">✓ 처리 완료</div>
                    <div class="text-sm text-gray-700">${action}</div>
                </div>
            </div>
        `;
    }
    
    // 진행률 업데이트
    updateMultichannelProgress();
}

function updateMultichannelProgress() {
    const completed = Object.keys(window.issueDecisions).length;
    const total = totalTasks;
    const percentage = Math.round((completed / total) * 100);
    
    const progressBar = document.getElementById('multichannel-progress-bar');
    const progressText = document.getElementById('multichannel-progress-text');
    
    if (progressBar) progressBar.style.width = `${percentage}%`;
    if (progressText) progressText.textContent = `${percentage}%`;
    
    // 전체 진행률도 업데이트
    const mainProgressBar = document.getElementById('progress-bar');
    const mainProgressText = document.getElementById('progress-text');
    if (mainProgressBar) mainProgressBar.style.width = `${percentage}%`;
    if (mainProgressText) mainProgressText.textContent = `${percentage}%`;
}

// 글로벌 협업 시뮬레이션 - 세계 지도 기반 타임존 관리
function renderCollaborationPlatform(question) {
    const content = document.getElementById('simulation-content');
    
    const offices = [
        {
            id: 1,
            name: '서울 본사',
            country: '대한민국',
            timezone: 'UTC+9',
            currentTime: '14:00',
            team: ['김팀장', '이과장', '박대리'],
            available: true,
            workHours: '09:00-18:00',
            flag: '🇰🇷',
            position: { left: '75%', top: '35%' }
        },
        {
            id: 2,
            name: '뉴욕 지사',
            country: '미국',
            timezone: 'UTC-5',
            currentTime: '00:00',
            team: ['John (PM)', 'Sarah', 'Mike'],
            available: false,
            workHours: '09:00-18:00',
            flag: '🇺🇸',
            position: { left: '20%', top: '35%' }
        },
        {
            id: 3,
            name: '베를린 지사',
            country: '독일',
            timezone: 'UTC+1',
            currentTime: '06:00',
            team: ['Hans', 'Anna', 'Klaus'],
            available: false,
            workHours: '09:00-18:00',
            flag: '🇩🇪',
            position: { left: '50%', top: '30%' }
        },
        {
            id: 4,
            name: '싱가포르 지사',
            country: '싱가포르',
            timezone: 'UTC+8',
            currentTime: '13:00',
            team: ['Wei', 'Raj', 'Mei'],
            available: true,
            workHours: '09:00-18:00',
            flag: '🇸🇬',
            position: { left: '70%', top: '55%' }
        }
    ];
    
    const documents = [
        { id: 1, name: '프로젝트 제안서_v1.docx', author: '서울', date: '2월 20일', status: 'old' },
        { id: 2, name: '프로젝트 제안서_v2_NY.docx', author: '뉴욕', date: '2월 21일', status: 'old' },
        { id: 3, name: '프로젝트 제안서_v3_Berlin.docx', author: '베를린', date: '2월 21일', status: 'old' },
        { id: 4, name: '프로젝트 제안서_최종_v4.docx', author: '서울', date: '2월 22일', status: 'conflict' },
        { id: 5, name: '프로젝트 제안서_FINAL.docx', author: '싱가포르', date: '2월 22일', status: 'conflict' }
    ];
    
    totalTasks = 3; // 회의 시간 조율, 문서 통합, 커뮤니케이션 프로토콜
    
    content.innerHTML = `
        <div class="h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col">
            <!-- 헤더 -->
            <div class="bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg">
                <div class="px-6 py-4">
                    <div class="flex items-center justify-between">
                        <div class="flex items-center space-x-4">
                            <i class="fas fa-globe-americas text-3xl"></i>
                            <div>
                                <div class="text-2xl font-bold">글로벌 협업 관리 시스템</div>
                                <div class="text-sm opacity-90 mt-1">🌍 4개 지사 타임존 조율 및 문서 버전 관리</div>
                            </div>
                        </div>
                        <div class="text-right">
                            <div class="text-sm opacity-75">해결 완료율</div>
                            <div class="text-3xl font-bold" id="global-progress-text">0%</div>
                        </div>
                    </div>
                </div>
                <div class="px-6 pb-2">
                    <div class="w-full bg-white bg-opacity-30 rounded-full h-2">
                        <div id="global-progress-bar" class="bg-white h-2 rounded-full transition-all duration-300" style="width: 0%"></div>
                    </div>
                </div>
            </div>
            
            <div class="flex-1 flex overflow-hidden">
                <!-- 메인 영역 -->
                <div class="flex-1 p-6 overflow-y-auto">
                    <div class="max-w-7xl mx-auto space-y-6">
                        <!-- 세계 지도 및 타임존 -->
                        <div class="bg-white rounded-xl shadow-lg p-6">
                            <h3 class="text-xl font-bold mb-4 flex items-center">
                                <i class="fas fa-map text-blue-600 mr-2"></i>
                                글로벌 지사 현황 (현재 시간 기준)
                            </h3>
                            
                            <!-- 간단한 세계 지도 -->
                            <div class="relative bg-gradient-to-br from-blue-100 to-green-50 rounded-lg h-80 mb-6 overflow-hidden border-2 border-blue-200">
                                <!-- 대륙 표시 (단순화) -->
                                <div class="absolute inset-0 flex items-center justify-center opacity-10">
                                    <i class="fas fa-globe text-blue-400" style="font-size: 200px;"></i>
                                </div>
                                
                                <!-- 지사 위치 마커 -->
                                ${offices.map(office => `
                                    <div class="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group" 
                                         style="left: ${office.position.left}; top: ${office.position.top};"
                                         onclick="showOfficeDetail(${office.id})">
                                        <div class="relative">
                                            <!-- 마커 -->
                                            <div class="w-8 h-8 rounded-full ${office.available ? 'bg-green-500 animate-pulse' : 'bg-gray-400'} border-4 border-white shadow-lg flex items-center justify-center text-white font-bold">
                                                <i class="fas fa-building text-sm"></i>
                                            </div>
                                            <!-- 호버 정보 -->
                                            <div class="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block z-10">
                                                <div class="bg-gray-900 text-white text-xs rounded-lg py-2 px-3 whitespace-nowrap shadow-xl">
                                                    <div class="font-bold">${office.flag} ${office.name}</div>
                                                    <div class="mt-1">현재: ${office.currentTime}</div>
                                                    <div>${office.available ? '🟢 업무 시간' : '🔴 업무 외'}</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                `).join('')}
                            </div>
                            
                            <!-- 지사별 타임존 카드 -->
                            <div class="grid grid-cols-4 gap-4">
                                ${offices.map(office => `
                                    <div class="border-2 ${office.available ? 'border-green-300 bg-green-50' : 'border-gray-300 bg-gray-50'} rounded-lg p-4">
                                        <div class="text-2xl mb-2">${office.flag}</div>
                                        <div class="font-bold text-sm mb-1">${office.name}</div>
                                        <div class="text-xs text-gray-600 mb-2">${office.timezone}</div>
                                        <div class="text-2xl font-bold ${office.available ? 'text-green-600' : 'text-gray-500'} mb-1">
                                            ${office.currentTime}
                                        </div>
                                        <div class="text-xs ${office.available ? 'text-green-700' : 'text-gray-500'} font-semibold">
                                            ${office.available ? '🟢 업무 가능' : '🔴 업무 외 시간'}
                                        </div>
                                        <div class="mt-2 pt-2 border-t text-xs text-gray-600">
                                            근무: ${office.workHours}
                                        </div>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                        
                        <!-- 문제 1: 회의 시간 조율 -->
                        <div class="bg-white rounded-xl shadow-lg p-6" id="task-meeting">
                            <div class="flex items-start justify-between mb-4">
                                <h3 class="text-xl font-bold flex items-center">
                                    <i class="fas fa-video text-purple-600 mr-2"></i>
                                    문제 1: 전체 회의 시간 조율
                                </h3>
                                <span class="text-xs px-3 py-1 bg-red-100 text-red-700 rounded-full font-semibold">긴급</span>
                            </div>
                            
                            <div class="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
                                <p class="text-sm text-yellow-800">
                                    <strong>문제:</strong> 4개 지사가 모두 참여해야 하는 긴급 회의가 필요하지만, 
                                    시차로 인해 3번의 일정 조율이 실패했습니다.
                                </p>
                            </div>
                            
                            <!-- 타임 슬롯 시각화 -->
                            <div class="mb-4">
                                <div class="font-semibold mb-2 text-sm">각 지사별 근무 시간 (현지 시간 기준)</div>
                                <div class="space-y-2">
                                    ${offices.map(office => `
                                        <div class="flex items-center">
                                            <div class="w-32 text-sm">${office.flag} ${office.name}</div>
                                            <div class="flex-1 flex">
                                                ${Array.from({length: 24}, (_, i) => {
                                                    const hour = i;
                                                    const isWorkTime = hour >= 9 && hour < 18;
                                                    return `<div class="flex-1 h-8 border ${isWorkTime ? 'bg-green-200' : 'bg-gray-100'}" title="${hour}:00"></div>`;
                                                }).join('')}
                                            </div>
                                        </div>
                                    `).join('')}
                                </div>
                                <div class="flex mt-1 text-xs text-gray-600">
                                    <div class="w-32"></div>
                                    <div class="flex-1 flex justify-between">
                                        <span>0시</span><span>6시</span><span>12시</span><span>18시</span><span>24시</span>
                                    </div>
                                </div>
                            </div>
                            
                            <div id="decision-area-meeting">
                                <div class="text-sm font-semibold mb-3">회의 시간 제안</div>
                                <div class="space-y-3">
                                    <select id="meeting-time" class="w-full border-2 rounded-lg px-3 py-2 text-sm focus:border-purple-500" onchange="updateGlobalDecision('meeting')">
                                        <option value="">선택하세요</option>
                                        <option value="서울14시">서울 14시 (뉴욕 0시, 베를린 6시, 싱가포르 13시) - 뉴욕 야근 필요</option>
                                        <option value="서울10시">서울 10시 (뉴욕 20시 전날, 베를린 2시, 싱가포르 9시) - 베를린 새벽</option>
                                        <option value="서울18시">서울 18시 (뉴욕 4시, 베를린 10시, 싱가포르 17시) - 뉴욕 새벽</option>
                                        <option value="녹화회의">녹화 회의 + 비동기 피드백 (시차 극복)</option>
                                        <option value="2회분할">2회 분할 회의 (아시아/유럽, 미국/아시아)</option>
                                    </select>
                                    
                                    <textarea id="meeting-note" class="w-full border-2 rounded-lg px-3 py-2 text-sm" rows="2" placeholder="선택 근거 및 보완 방안..."></textarea>
                                    
                                    <button class="w-full py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-indigo-700 disabled:opacity-50" 
                                            id="complete-btn-meeting" onclick="completeGlobalTask('meeting')" disabled>
                                        <i class="fas fa-check mr-2"></i>결정 완료
                                    </button>
                                </div>
                            </div>
                        </div>
                        
                        <!-- 문제 2: 문서 버전 관리 -->
                        <div class="bg-white rounded-xl shadow-lg p-6" id="task-document">
                            <div class="flex items-start justify-between mb-4">
                                <h3 class="text-xl font-bold flex items-center">
                                    <i class="fas fa-file-alt text-orange-600 mr-2"></i>
                                    문제 2: 문서 버전 혼란 해결
                                </h3>
                                <span class="text-xs px-3 py-1 bg-orange-100 text-orange-700 rounded-full font-semibold">중요</span>
                            </div>
                            
                            <div class="bg-orange-50 border-l-4 border-orange-400 p-4 mb-4">
                                <p class="text-sm text-orange-800">
                                    <strong>문제:</strong> 프로젝트 제안서가 5개 버전으로 분산되어 있습니다. 
                                    각 지사가 서로 다른 버전을 수정하여 통합이 어려운 상황입니다.
                                </p>
                            </div>
                            
                            <!-- 문서 버전 목록 -->
                            <div class="mb-4">
                                <div class="font-semibold mb-2 text-sm">문서 버전 목록</div>
                                <div class="space-y-2">
                                    ${documents.map(doc => `
                                        <div class="flex items-center justify-between p-3 border rounded-lg ${
                                            doc.status === 'conflict' ? 'bg-red-50 border-red-200' : 'bg-gray-50'
                                        }">
                                            <div class="flex items-center">
                                                <i class="fas fa-file-word text-blue-600 mr-3 text-xl"></i>
                                                <div>
                                                    <div class="font-semibold text-sm">${doc.name}</div>
                                                    <div class="text-xs text-gray-600">작성: ${doc.author} | ${doc.date}</div>
                                                </div>
                                            </div>
                                            ${doc.status === 'conflict' ? 
                                                '<span class="text-xs px-2 py-1 bg-red-100 text-red-700 rounded font-semibold">충돌</span>' : 
                                                '<span class="text-xs px-2 py-1 bg-gray-200 text-gray-600 rounded">이전 버전</span>'
                                            }
                                        </div>
                                    `).join('')}
                                </div>
                            </div>
                            
                            <div id="decision-area-document">
                                <div class="text-sm font-semibold mb-3">문서 관리 전략</div>
                                <div class="space-y-3">
                                    <select id="document-strategy" class="w-full border-2 rounded-lg px-3 py-2 text-sm focus:border-orange-500" onchange="updateGlobalDecision('document')">
                                        <option value="">선택하세요</option>
                                        <option value="통합버전">모든 버전 수동 통합 → 최종 v6 생성</option>
                                        <option value="최신채택">최신 버전(v5) 채택 → 나머지 폐기</option>
                                        <option value="협업도구">Google Docs/Notion 실시간 협업 도구 도입</option>
                                        <option value="버전관리">Git/SVN 버전 관리 시스템 도입</option>
                                        <option value="담당자지정">지사별 담당 섹션 지정 → 병합</option>
                                    </select>
                                    
                                    <textarea id="document-note" class="w-full border-2 rounded-lg px-3 py-2 text-sm" rows="2" placeholder="실행 계획 및 재발 방지책..."></textarea>
                                    
                                    <button class="w-full py-2 bg-gradient-to-r from-orange-600 to-red-600 text-white font-semibold rounded-lg hover:from-orange-700 hover:to-red-700 disabled:opacity-50" 
                                            id="complete-btn-document" onclick="completeGlobalTask('document')" disabled>
                                        <i class="fas fa-check mr-2"></i>결정 완료
                                    </button>
                                </div>
                            </div>
                        </div>
                        
                        <!-- 문제 3: 커뮤니케이션 프로토콜 -->
                        <div class="bg-white rounded-xl shadow-lg p-6" id="task-communication">
                            <div class="flex items-start justify-between mb-4">
                                <h3 class="text-xl font-bold flex items-center">
                                    <i class="fas fa-comments text-green-600 mr-2"></i>
                                    문제 3: 커뮤니케이션 프로토콜 수립
                                </h3>
                                <span class="text-xs px-3 py-1 bg-green-100 text-green-700 rounded-full font-semibold">중요</span>
                            </div>
                            
                            <div class="bg-green-50 border-l-4 border-green-400 p-4 mb-4">
                                <p class="text-sm text-green-800">
                                    <strong>문제:</strong> 각 지사가 서로 다른 커뮤니케이션 도구와 방식을 사용하여 
                                    정보 공유가 원활하지 않습니다.
                                </p>
                            </div>
                            
                            <div id="decision-area-communication">
                                <div class="text-sm font-semibold mb-3">커뮤니케이션 개선 방안</div>
                                <div class="space-y-3">
                                    <div>
                                        <label class="text-xs font-semibold mb-1 block">주요 도구 선정</label>
                                        <select id="comm-tool" class="w-full border-2 rounded-lg px-3 py-2 text-sm" onchange="updateGlobalDecision('communication')">
                                            <option value="">선택하세요</option>
                                            <option value="slack">Slack (실시간 채팅 + 채널 관리)</option>
                                            <option value="teams">Microsoft Teams (통합 협업)</option>
                                            <option value="혼합">Slack(일상) + Zoom(회의) + Notion(문서)</option>
                                        </select>
                                    </div>
                                    
                                    <div>
                                        <label class="text-xs font-semibold mb-1 block">응답 시간 규칙</label>
                                        <select id="comm-rule" class="w-full border-2 rounded-lg px-3 py-2 text-sm" onchange="updateGlobalDecision('communication')">
                                            <option value="">선택하세요</option>
                                            <option value="24시간">긴급: 24시간 내 응답 필수</option>
                                            <option value="48시간">일반: 48시간 내 응답</option>
                                            <option value="유연">유연한 비동기 소통</option>
                                        </select>
                                    </div>
                                    
                                    <textarea id="communication-note" class="w-full border-2 rounded-lg px-3 py-2 text-sm" rows="2" placeholder="추가 규칙 및 운영 방안..."></textarea>
                                    
                                    <button class="w-full py-2 bg-gradient-to-r from-green-600 to-teal-600 text-white font-semibold rounded-lg hover:from-green-700 hover:to-teal-700 disabled:opacity-50" 
                                            id="complete-btn-communication" onclick="completeGlobalTask('communication')" disabled>
                                        <i class="fas fa-check mr-2"></i>결정 완료
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- 오른쪽: 해결 현황 -->
                <div class="w-80 bg-white border-l overflow-y-auto">
                    <div class="p-5">
                        <h3 class="font-bold text-lg mb-4 flex items-center">
                            <i class="fas fa-clipboard-check text-blue-600 mr-2"></i>
                            해결 현황
                        </h3>
                        
                        <div id="global-summary" class="space-y-3 mb-6">
                            <div class="p-4 bg-gray-50 rounded-lg text-center text-gray-500 text-sm">
                                아직 해결된 문제가 없습니다
                            </div>
                        </div>
                        
                        <div class="p-4 bg-blue-50 rounded-lg mb-4">
                            <div class="text-sm font-semibold text-blue-900 mb-2">🌍 글로벌 협업 팁</div>
                            <ul class="text-xs text-blue-800 space-y-1">
                                <li>• 시차를 고려한 비동기 소통</li>
                                <li>• 명확한 문서화 및 버전 관리</li>
                                <li>• 문화적 차이 존중</li>
                                <li>• 정기적인 올핸즈 미팅</li>
                            </ul>
                        </div>
                        
                        <button class="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all" 
                                onclick="completeSimulation()">
                            <i class="fas fa-check mr-2"></i>완료하고 다음 단계로
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    window.globalDecisions = {
        meeting: {},
        document: {},
        communication: {}
    };
}

function updateGlobalDecision(task) {
    if (task === 'meeting') {
        const time = document.getElementById('meeting-time')?.value;
        const note = document.getElementById('meeting-note')?.value;
        window.globalDecisions.meeting = { time, note };
        
        const btn = document.getElementById('complete-btn-meeting');
        if (time && btn) {
            btn.disabled = false;
            btn.classList.remove('opacity-50');
        }
    } else if (task === 'document') {
        const strategy = document.getElementById('document-strategy')?.value;
        const note = document.getElementById('document-note')?.value;
        window.globalDecisions.document = { strategy, note };
        
        const btn = document.getElementById('complete-btn-document');
        if (strategy && btn) {
            btn.disabled = false;
            btn.classList.remove('opacity-50');
        }
    } else if (task === 'communication') {
        const tool = document.getElementById('comm-tool')?.value;
        const rule = document.getElementById('comm-rule')?.value;
        const note = document.getElementById('communication-note')?.value;
        window.globalDecisions.communication = { tool, rule, note };
        
        const btn = document.getElementById('complete-btn-communication');
        if (tool && rule && btn) {
            btn.disabled = false;
            btn.classList.remove('opacity-50');
        }
    }
}

function completeGlobalTask(task) {
    const decision = window.globalDecisions[task];
    
    if (task === 'meeting' && !decision.time) {
        alert('회의 시간을 선택해주세요.');
        return;
    }
    if (task === 'document' && !decision.strategy) {
        alert('문서 관리 전략을 선택해주세요.');
        return;
    }
    if (task === 'communication' && (!decision.tool || !decision.rule)) {
        alert('커뮤니케이션 도구와 규칙을 모두 선택해주세요.');
        return;
    }
    
    decision.complete = true;
    
    // UI 업데이트
    const decisionArea = document.getElementById(`decision-area-${task}`);
    const taskCard = document.getElementById(`task-${task}`);
    
    if (decisionArea && taskCard) {
        taskCard.classList.add('border-2', 'border-green-500');
        
        let summary = '';
        if (task === 'meeting') {
            summary = `회의 시간: ${decision.time}`;
        } else if (task === 'document') {
            summary = `전략: ${decision.strategy}`;
        } else if (task === 'communication') {
            summary = `도구: ${decision.tool} | 규칙: ${decision.rule}`;
        }
        
        decisionArea.innerHTML = `
            <div class="bg-green-100 border-2 border-green-500 rounded-lg p-4">
                <div class="flex items-center mb-2">
                    <i class="fas fa-check-circle text-green-600 text-2xl mr-2"></i>
                    <span class="font-bold text-green-800">해결 완료</span>
                </div>
                <div class="text-sm text-gray-700">
                    <div>${summary}</div>
                    ${decision.note ? `<div class="mt-1"><strong>메모:</strong> ${decision.note}</div>` : ''}
                </div>
            </div>
        `;
    }
    
    updateGlobalProgress();
}

function updateGlobalProgress() {
    const tasks = Object.values(window.globalDecisions);
    const completed = tasks.filter(t => t.complete).length;
    const total = totalTasks;
    const percentage = Math.round((completed / total) * 100);
    
    const progressBar = document.getElementById('global-progress-bar');
    const progressText = document.getElementById('global-progress-text');
    
    if (progressBar) progressBar.style.width = `${percentage}%`;
    if (progressText) progressText.textContent = `${percentage}%`;
    
    const mainProgressBar = document.getElementById('progress-bar');
    const mainProgressText = document.getElementById('progress-text');
    if (mainProgressBar) mainProgressBar.style.width = `${percentage}%`;
    if (mainProgressText) mainProgressText.textContent = `${percentage}%`;
    
    // 요약 업데이트
    const summaryEl = document.getElementById('global-summary');
    if (summaryEl && completed > 0) {
        const taskNames = { meeting: '회의 조율', document: '문서 관리', communication: '커뮤니케이션' };
        summaryEl.innerHTML = Object.entries(window.globalDecisions)
            .filter(([_, d]) => d.complete)
            .map(([task, _]) => `
                <div class="p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div class="font-semibold text-sm text-green-800">
                        ✓ ${taskNames[task]} 해결
                    </div>
                </div>
            `).join('');
    }
}

function renderContractReview(question) {
    const content = document.getElementById('simulation-content');
    
    const clauses = [
        {
            id: 1,
            title: '제1조 계약 금액 및 지급 조건',
            content: '총 계약 금액은 50억원이며, 계약 체결 시 30%, 중간 점검 시 40%, 완료 시 30%를 지급한다.',
            risk: 'low',
            riskDesc: '표준적인 지급 조건',
            suggestion: ''
        },
        {
            id: 2,
            title: '제3조 위약금 조항',
            content: '납기 지연 시 계약 금액의 20%를 위약금으로 지급한다. 중대한 하자 발생 시 계약 금액의 50%를 배상한다.',
            risk: 'high',
            riskDesc: '위약금 비율이 업계 평균(10%)의 2배로 과도함',
            suggestion: '위약금을 계약 금액의 10%로 하향 조정 요청'
        },
        {
            id: 3,
            title: '제5조 품질 보증 기간',
            content: '제품 인도 후 5년간 무상 품질 보증 및 유지보수를 제공한다.',
            risk: 'high',
            riskDesc: '업계 표준(2년)보다 2배 이상 긴 보증 기간',
            suggestion: '보증 기간을 3년으로 단축하거나, 유상 연장 보증 옵션 제안'
        },
        {
            id: 4,
            title: '제7조 지적재산권',
            content: '본 프로젝트에서 개발된 모든 지적재산권은 발주사에 귀속된다.',
            risk: 'medium',
            riskDesc: '기존 기술/노하우 포함 시 문제 발생 가능',
            suggestion: '기존 보유 기술은 제외하고, 신규 개발분만 귀속되도록 수정'
        },
        {
            id: 5,
            title: '제9조 비밀유지 의무',
            content: '계약 당사자는 계약 종료 후 10년간 프로젝트 관련 정보를 비밀로 유지한다.',
            risk: 'low',
            riskDesc: '합리적인 수준의 비밀유지 기간',
            suggestion: ''
        },
        {
            id: 6,
            title: '제11조 계약 해지 조건',
            content: '발주사는 언제든지 사유 없이 계약을 해지할 수 있으며, 이 경우 진행분에 대해서만 대금을 지급한다.',
            risk: 'high',
            riskDesc: '일방적 해지 조항으로 수주사에 매우 불리',
            suggestion: '해지 시 최소 30일 전 사전 통보 및 손해배상 조항 추가'
        }
    ];
    
    totalTasks = clauses.filter(c => c.risk === 'high' || c.risk === 'medium').length;
    
    content.innerHTML = `
        <div class="h-screen bg-gradient-to-br from-amber-50 to-orange-50 flex flex-col">
            <!-- 헤더 -->
            <div class="bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-lg">
                <div class="px-6 py-4">
                    <div class="flex items-center justify-between">
                        <div class="flex items-center space-x-4">
                            <i class="fas fa-gavel text-3xl"></i>
                            <div>
                                <div class="text-2xl font-bold">계약서 법무 검토 시스템</div>
                                <div class="text-sm opacity-90 mt-1">⚖️ 50억원 규모 계약서 리스크 분석</div>
                            </div>
                        </div>
                        <div class="text-right">
                            <div class="text-sm opacity-75">검토 완료율</div>
                            <div class="text-3xl font-bold" id="contract-progress-text">0%</div>
                        </div>
                    </div>
                </div>
                <div class="px-6 pb-2">
                    <div class="w-full bg-white bg-opacity-30 rounded-full h-2">
                        <div id="contract-progress-bar" class="bg-white h-2 rounded-full transition-all duration-300" style="width: 0%"></div>
                    </div>
                </div>
            </div>
            
            <div class="flex-1 flex overflow-hidden">
                <!-- 좌측: 조항 목록 -->
                <div class="w-80 bg-white border-r overflow-y-auto">
                    <div class="p-4">
                        <h3 class="font-bold mb-4 flex items-center">
                            <i class="fas fa-list text-amber-600 mr-2"></i>
                            계약 조항 목록
                        </h3>
                        
                        <!-- 리스크 통계 -->
                        <div class="grid grid-cols-3 gap-2 mb-4">
                            <div class="text-center p-2 bg-red-50 rounded">
                                <div class="text-xl font-bold text-red-600">${clauses.filter(c => c.risk === 'high').length}</div>
                                <div class="text-xs text-gray-600">고위험</div>
                            </div>
                            <div class="text-center p-2 bg-yellow-50 rounded">
                                <div class="text-xl font-bold text-yellow-600">${clauses.filter(c => c.risk === 'medium').length}</div>
                                <div class="text-xs text-gray-600">중위험</div>
                            </div>
                            <div class="text-center p-2 bg-green-50 rounded">
                                <div class="text-xl font-bold text-green-600">${clauses.filter(c => c.risk === 'low').length}</div>
                                <div class="text-xs text-gray-600">저위험</div>
                            </div>
                        </div>
                        
                        <!-- 조항 리스트 -->
                        <div class="space-y-2">
                            ${clauses.map(clause => `
                                <div class="p-3 border-2 rounded-lg cursor-pointer hover:border-amber-400 ${
                                    clause.risk === 'high' ? 'border-red-200 bg-red-50' : 
                                    clause.risk === 'medium' ? 'border-yellow-200 bg-yellow-50' : 
                                    'border-green-200 bg-green-50'
                                }" onclick="scrollToClause(${clause.id})">
                                    <div class="flex items-start justify-between">
                                        <div class="flex-1">
                                            <div class="text-xs font-semibold mb-1">${clause.title}</div>
                                        </div>
                                        <span class="ml-2 text-xs px-2 py-1 rounded font-semibold ${
                                            clause.risk === 'high' ? 'bg-red-100 text-red-700' : 
                                            clause.risk === 'medium' ? 'bg-yellow-100 text-yellow-700' : 
                                            'bg-green-100 text-green-700'
                                        }">
                                            ${clause.risk === 'high' ? '⚠️ 고' : clause.risk === 'medium' ? '⚠ 중' : '✓ 저'}
                                        </span>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
                
                <!-- 중앙: 계약서 뷰어 -->
                <div class="flex-1 p-6 overflow-y-auto bg-gray-50">
                    <div class="max-w-4xl mx-auto">
                        <div class="bg-white shadow-xl rounded-lg">
                            <!-- 계약서 헤더 -->
                            <div class="bg-gradient-to-r from-amber-100 to-orange-100 border-b-4 border-amber-600 p-6">
                                <h1 class="text-3xl font-bold text-gray-800 mb-2">공급 계약서</h1>
                                <div class="text-sm text-gray-600">
                                    <div>계약 번호: CTR-2026-001</div>
                                    <div>계약 금액: 50억원</div>
                                    <div>계약일: 2026년 2월 20일</div>
                                    <div>서명 마감: 2026년 2월 25일 (2일 내)</div>
                                </div>
                            </div>
                            
                            <!-- 계약 조항들 -->
                            <div class="p-8 space-y-6">
                                ${clauses.map(clause => `
                                    <div class="border-2 rounded-lg p-6 ${
                                        clause.risk === 'high' ? 'border-red-300 bg-red-50' : 
                                        clause.risk === 'medium' ? 'border-yellow-300 bg-yellow-50' : 
                                        'border-gray-200'
                                    }" id="clause-${clause.id}">
                                        <div class="flex items-start justify-between mb-3">
                                            <h3 class="text-lg font-bold text-gray-800">${clause.title}</h3>
                                            <span class="text-xs px-3 py-1 rounded-full font-semibold ${
                                                clause.risk === 'high' ? 'bg-red-100 text-red-700' : 
                                                clause.risk === 'medium' ? 'bg-yellow-100 text-yellow-700' : 
                                                'bg-green-100 text-green-700'
                                            }">
                                                ${clause.risk === 'high' ? '⚠️ 고위험' : clause.risk === 'medium' ? '⚠ 중위험' : '✓ 저위험'}
                                            </span>
                                        </div>
                                        
                                        <p class="text-gray-700 mb-4 leading-relaxed">${clause.content}</p>
                                        
                                        ${clause.risk !== 'low' ? `
                                            <!-- 리스크 분석 -->
                                            <div class="bg-white border-2 ${clause.risk === 'high' ? 'border-red-200' : 'border-yellow-200'} rounded-lg p-4 mb-4">
                                                <div class="font-semibold text-sm mb-2 ${clause.risk === 'high' ? 'text-red-800' : 'text-yellow-800'}">
                                                    <i class="fas fa-exclamation-triangle mr-1"></i>리스크 분석
                                                </div>
                                                <p class="text-sm text-gray-700">${clause.riskDesc}</p>
                                            </div>
                                            
                                            <!-- 수정 제안 -->
                                            <div class="bg-blue-50 border-2 border-blue-200 rounded-lg p-4 mb-4">
                                                <div class="font-semibold text-sm mb-2 text-blue-800">
                                                    <i class="fas fa-lightbulb mr-1"></i>수정 제안
                                                </div>
                                                <p class="text-sm text-gray-700">${clause.suggestion}</p>
                                            </div>
                                            
                                            <!-- 의사결정 영역 -->
                                            <div id="decision-area-${clause.id}">
                                                <div class="text-sm font-semibold mb-3">법무 검토 의견</div>
                                                <div class="space-y-3">
                                                    <select id="decision-${clause.id}" class="w-full border-2 rounded-lg px-3 py-2 text-sm focus:border-amber-500" onchange="updateContractDecision(${clause.id})">
                                                        <option value="">선택하세요</option>
                                                        <option value="수정요청">🔧 수정 요청 (제안대로)</option>
                                                        <option value="협상">🤝 협상 진행 (조건 조율)</option>
                                                        <option value="수용">✅ 원안 수용 (리스크 감수)</option>
                                                        <option value="거절">❌ 계약 거절 (리스크 과다)</option>
                                                    </select>
                                                    
                                                    <textarea id="note-${clause.id}" class="w-full border-2 rounded-lg px-3 py-2 text-sm" rows="2" placeholder="세부 의견 및 협상 전략..."></textarea>
                                                    
                                                    <button class="w-full py-2 bg-gradient-to-r from-amber-600 to-orange-600 text-white font-semibold rounded-lg hover:from-amber-700 hover:to-orange-700 disabled:opacity-50" 
                                                            id="complete-btn-${clause.id}" onclick="completeContractReview(${clause.id})" disabled>
                                                        <i class="fas fa-check mr-2"></i>검토 완료
                                                    </button>
                                                </div>
                                            </div>
                                        ` : `
                                            <div class="bg-green-100 border-2 border-green-500 rounded-lg p-4">
                                                <div class="flex items-center text-green-800">
                                                    <i class="fas fa-check-circle text-xl mr-2"></i>
                                                    <span class="font-semibold">리스크 없음 - 검토 통과</span>
                                                </div>
                                            </div>
                                        `}
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- 우측: 검토 요약 -->
                <div class="w-80 bg-white border-l overflow-y-auto">
                    <div class="p-5">
                        <h3 class="font-bold text-lg mb-4 flex items-center">
                            <i class="fas fa-clipboard-check text-amber-600 mr-2"></i>
                            검토 요약
                        </h3>
                        
                        <div id="contract-summary" class="space-y-3 mb-6">
                            <div class="p-4 bg-gray-50 rounded-lg text-center text-gray-500 text-sm">
                                아직 검토된 조항이 없습니다
                            </div>
                        </div>
                        
                        <div class="p-4 bg-amber-50 rounded-lg mb-4">
                            <div class="text-sm font-semibold text-amber-900 mb-2">⚖️ 법무 검토 기준</div>
                            <ul class="text-xs text-amber-800 space-y-1">
                                <li>• 업계 표준 대비 조건</li>
                                <li>• 재무적 리스크 평가</li>
                                <li>• 실행 가능성 검토</li>
                                <li>• 협상 여지 분석</li>
                            </ul>
                        </div>
                        
                        <button class="w-full py-3 bg-gradient-to-r from-amber-600 to-orange-600 text-white font-bold rounded-lg hover:from-amber-700 hover:to-orange-700 transition-all" 
                                onclick="completeSimulation()">
                            <i class="fas fa-check mr-2"></i>완료하고 다음 단계로
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    window.contractDecisions = {};
}

function updateContractDecision(clauseId) {
    const decision = document.getElementById(`decision-${clauseId}`)?.value;
    const note = document.getElementById(`note-${clauseId}`)?.value;
    
    if (!window.contractDecisions[clauseId]) {
        window.contractDecisions[clauseId] = {};
    }
    
    window.contractDecisions[clauseId].decision = decision;
    window.contractDecisions[clauseId].note = note;
    
    const btn = document.getElementById(`complete-btn-${clauseId}`);
    if (decision && btn) {
        btn.disabled = false;
        btn.classList.remove('opacity-50');
    }
}

function completeContractReview(clauseId) {
    const review = window.contractDecisions[clauseId];
    if (!review || !review.decision) {
        alert('검토 의견을 선택해주세요.');
        return;
    }
    
    review.complete = true;
    
    const decisionArea = document.getElementById(`decision-area-${clauseId}`);
    
    if (decisionArea) {
        decisionArea.innerHTML = `
            <div class="bg-green-100 border-2 border-green-500 rounded-lg p-4">
                <div class="flex items-center mb-2">
                    <i class="fas fa-check-circle text-green-600 text-2xl mr-2"></i>
                    <span class="font-bold text-green-800">검토 완료</span>
                </div>
                <div class="text-sm text-gray-700">
                    <div><strong>의견:</strong> ${review.decision}</div>
                    ${review.note ? `<div class="mt-1"><strong>세부:</strong> ${review.note}</div>` : ''}
                </div>
            </div>
        `;
    }
    
    updateContractProgress();
}

function updateContractProgress() {
    const completed = Object.values(window.contractDecisions).filter(d => d.complete).length;
    const total = totalTasks;
    const percentage = Math.round((completed / total) * 100);
    
    const progressBar = document.getElementById('contract-progress-bar');
    const progressText = document.getElementById('contract-progress-text');
    
    if (progressBar) progressBar.style.width = `${percentage}%`;
    if (progressText) progressText.textContent = `${percentage}%`;
    
    const mainProgressBar = document.getElementById('progress-bar');
    const mainProgressText = document.getElementById('progress-text');
    if (mainProgressBar) mainProgressBar.style.width = `${percentage}%`;
    if (mainProgressText) mainProgressText.textContent = `${percentage}%`;
    
    // 요약 업데이트
    const summaryEl = document.getElementById('contract-summary');
    const decisions = Object.values(window.contractDecisions).filter(d => d.complete);
    
    if (summaryEl && decisions.length > 0) {
        summaryEl.innerHTML = decisions.map((d, idx) => `
            <div class="p-3 bg-green-50 border border-green-200 rounded-lg">
                <div class="font-semibold text-sm">조항 ${idx + 1}</div>
                <div class="text-xs text-gray-700 mt-1">${d.decision}</div>
            </div>
        `).join('');
    }
}

function scrollToClause(clauseId) {
    const element = document.getElementById(`clause-${clauseId}`);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        element.classList.add('ring-4', 'ring-amber-400');
        setTimeout(() => {
            element.classList.remove('ring-4', 'ring-amber-400');
        }, 2000);
    }
}

function renderToolSelection(question) {
    const content = document.getElementById('simulation-content');
    
    const tools = [
        {
            id: 1,
            name: 'ChatGPT Plus',
            category: 'AI 챗봇',
            price: 240,
            priceUnit: '만원/년',
            features: ['문서 작성 자동화', '고객 응대 지원', '코드 생성'],
            roi: 8,
            roiMonths: '투자 회수 기간',
            timesSaved: 480,
            icon: '🤖'
        },
        {
            id: 2,
            name: 'Notion AI',
            category: '문서/협업',
            price: 120,
            priceUnit: '만원/년',
            features: ['회의록 자동 생성', '문서 요약', '번역'],
            roi: 12,
            roiMonths: '투자 회수 기간',
            timesSaved: 240,
            icon: '📝'
        },
        {
            id: 3,
            name: 'Midjourney',
            category: '디자인/이미지',
            price: 360,
            priceUnit: '만원/년',
            features: ['마케팅 이미지', 'SNS 콘텐츠', '프레젠테이션'],
            roi: 6,
            roiMonths: '투자 회수 기간',
            timesSaved: 720,
            icon: '🎨'
        },
        {
            id: 4,
            name: 'GitHub Copilot',
            category: '개발 지원',
            price: 1200,
            priceUnit: '만원/년',
            features: ['코드 자동완성', '버그 수정', '테스트 코드'],
            roi: 3,
            roiMonths: '투자 회수 기간',
            timesSaved: 1200,
            icon: '💻'
        }
    ];
    
    const totalBudget = 1200;
    totalTasks = tools.length;
    
    content.innerHTML = `
        <div class="h-screen bg-gradient-to-br from-cyan-50 to-blue-100 flex flex-col">
            <div class="bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg">
                <div class="px-6 py-4">
                    <div class="flex items-center justify-between">
                        <div class="flex items-center space-x-4">
                            <i class="fas fa-robot text-3xl"></i>
                            <div>
                                <div class="text-2xl font-bold">AI 도구 도입 평가 시스템</div>
                                <div class="text-sm opacity-90 mt-1">💡 연간 3,120만원 투자, 8개월 회수 예상</div>
                            </div>
                        </div>
                        <div class="text-right">
                            <div class="text-sm opacity-75">평가 완료율</div>
                            <div class="text-3xl font-bold" id="tool-progress-text">0%</div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="flex-1 p-6 overflow-y-auto">
                <div class="max-w-6xl mx-auto">
                    <div class="bg-white rounded-xl shadow-lg p-6 mb-6">
                        <h3 class="text-xl font-bold mb-4">💰 예산 현황</h3>
                        <div class="grid grid-cols-4 gap-4">
                            <div class="text-center p-4 bg-blue-50 rounded-lg">
                                <div class="text-2xl font-bold text-blue-600">${totalBudget.toLocaleString()}</div>
                                <div class="text-sm text-gray-600">가용 예산 (만원)</div>
                            </div>
                            <div class="text-center p-4 bg-purple-50 rounded-lg">
                                <div class="text-2xl font-bold text-purple-600" id="allocated-tool">0</div>
                                <div class="text-sm text-gray-600">할당 예산 (만원)</div>
                            </div>
                            <div class="text-center p-4 bg-green-50 rounded-lg">
                                <div class="text-2xl font-bold text-green-600" id="remaining-tool">${totalBudget.toLocaleString()}</div>
                                <div class="text-sm text-gray-600">잔액 (만원)</div>
                            </div>
                            <div class="text-center p-4 bg-orange-50 rounded-lg">
                                <div class="text-2xl font-bold text-orange-600" id="roi-avg">0</div>
                                <div class="text-sm text-gray-600">평균 ROI (개월)</div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="grid grid-cols-2 gap-6">
                        ${tools.map(tool => `
                            <div class="bg-white border-2 rounded-xl p-6" id="tool-card-${tool.id}">
                                <div class="flex items-start justify-between mb-4">
                                    <div class="flex items-center">
                                        <span class="text-4xl mr-3">${tool.icon}</span>
                                        <div>
                                            <h4 class="text-xl font-bold">${tool.name}</h4>
                                            <span class="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded">${tool.category}</span>
                                        </div>
                                    </div>
                                </div>
                                
                                <div class="grid grid-cols-2 gap-3 mb-4">
                                    <div class="bg-gray-50 rounded p-3">
                                        <div class="text-xs text-gray-600">연간 비용</div>
                                        <div class="text-lg font-bold text-purple-600">${tool.price}만원</div>
                                    </div>
                                    <div class="bg-gray-50 rounded p-3">
                                        <div class="text-xs text-gray-600">ROI</div>
                                        <div class="text-lg font-bold text-green-600">${tool.roi}개월</div>
                                    </div>
                                </div>
                                
                                <div class="mb-4">
                                    <div class="text-sm font-semibold mb-2">주요 기능</div>
                                    <ul class="text-xs space-y-1">
                                        ${tool.features.map(f => `<li class="flex items-center"><i class="fas fa-check text-green-600 mr-2"></i>${f}</li>`).join('')}
                                    </ul>
                                </div>
                                
                                <div class="bg-blue-50 rounded p-3 mb-4">
                                    <div class="text-xs text-gray-600">예상 절감 시간</div>
                                    <div class="text-xl font-bold text-blue-600">${tool.timesSaved}시간/년</div>
                                </div>
                                
                                <div id="decision-area-tool-${tool.id}">
                                    <select id="decision-tool-${tool.id}" class="w-full border-2 rounded-lg px-3 py-2 text-sm mb-2" onchange="updateToolDecision(${tool.id}, ${tool.price}, ${tool.roi})">
                                        <option value="">선택하세요</option>
                                        <option value="1순위">⭐⭐⭐ 1순위 (즉시 도입)</option>
                                        <option value="2순위">⭐⭐ 2순위 (예산 허용 시)</option>
                                        <option value="3순위">⭐ 3순위 (차후 검토)</option>
                                        <option value="보류">❌ 보류 (도입 안 함)</option>
                                    </select>
                                    <button class="w-full py-2 bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-semibold rounded-lg disabled:opacity-50" 
                                            id="complete-btn-tool-${tool.id}" onclick="completeToolDecision(${tool.id})" disabled>
                                        <i class="fas fa-check mr-2"></i>결정 완료
                                    </button>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        </div>
    `;
    
    window.toolDecisions = {};
    window.toolBudget = totalBudget;
}

function updateToolDecision(toolId, price, roi) {
    const decision = document.getElementById(`decision-tool-${toolId}`)?.value;
    window.toolDecisions[toolId] = { decision, price, roi };
    
    const btn = document.getElementById(`complete-btn-tool-${toolId}`);
    if (decision && btn) {
        btn.disabled = false;
        btn.classList.remove('opacity-50');
    }
}

function completeToolDecision(toolId) {
    const dec = window.toolDecisions[toolId];
    if (!dec || !dec.decision) return alert('선택하세요.');
    
    dec.complete = true;
    const area = document.getElementById(`decision-area-tool-${toolId}`);
    if (area) {
        area.innerHTML = `<div class="bg-green-100 border-2 border-green-500 rounded p-3 text-center font-bold text-green-800">✓ ${dec.decision}</div>`;
    }
    
    // 예산 계산
    const decisions = Object.values(window.toolDecisions).filter(d => d.complete && d.decision !== '보류');
    const allocated = decisions.reduce((sum, d) => sum + d.price, 0);
    const remaining = window.toolBudget - allocated;
    const avgRoi = decisions.length > 0 ? Math.round(decisions.reduce((sum, d) => sum + d.roi, 0) / decisions.length) : 0;
    
    document.getElementById('allocated-tool').textContent = allocated.toLocaleString();
    document.getElementById('remaining-tool').textContent = remaining.toLocaleString();
    document.getElementById('remaining-tool').className = remaining >= 0 ? 'text-2xl font-bold text-green-600' : 'text-2xl font-bold text-red-600';
    document.getElementById('roi-avg').textContent = avgRoi;
    
    const completed = Object.values(window.toolDecisions).filter(d => d.complete).length;
    const percentage = Math.round((completed / totalTasks) * 100);
    document.getElementById('tool-progress-text').textContent = `${percentage}%`;
    document.getElementById('progress-text').textContent = `${percentage}%`;
}

// 인사 관리 시뮬레이션 - 조직도 기반 갈등 해결
function renderHRSystem(question) {
    const content = document.getElementById('simulation-content');
    
    // question.title에 따라 다른 UI 렌더링
    const title = question.title || '';
    
    // 신입사원 교육 프로그램 기획안 검토 요청
    if (title.includes('신입사원') || title.includes('교육 프로그램')) {
        renderNewHireTraining(question);
        return;
    }
    
    // 직원 복지제도 개선 제안
    if (title.includes('복지') || title.includes('복지제도')) {
        renderEmployeeBenefits(question);
        return;
    }
    
    // 기본: HR 갈등 관리 시스템
    const employees = [
        { id: 1, name: '김철수', dept: '영업', position: '팀장', team: 'sales', status: 'conflict', issue: '부서 간 협업 거부' },
        { id: 2, name: '이영희', dept: '영업', position: '과장', team: 'sales', status: 'quit', issue: '과도한 업무 부담' },
        { id: 3, name: '박민수', dept: '생산', position: '팀장', team: 'production', status: 'conflict', issue: '일정 지연 책임 공방' },
        { id: 4, name: '최지혜', dept: '생산', position: '대리', team: 'production', status: 'quit', issue: '타부서와의 갈등' }
    ];
    
    totalTasks = 3; // 3가지 의사결정 (프로세스, 팀빌딩, 개별면담)
    
    content.innerHTML = `
        <div class="h-screen bg-gradient-to-br from-purple-50 to-pink-100 flex flex-col">
            <div class="bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg">
                <div class="px-6 py-4">
                    <div class="flex items-center justify-between">
                        <div class="flex items-center space-x-4">
                            <i class="fas fa-sitemap text-3xl"></i>
                            <div>
                                <div class="text-2xl font-bold">${question.title || 'HR 갈등 관리 시스템'}</div>
                                <div class="text-sm opacity-90 mt-1">${question.sender || '인사팀'} • ${question.date || '2026-02-23'}</div>
                            </div>
                        </div>
                        <div class="text-right">
                            <div class="text-sm opacity-75">해결 진행률</div>
                            <div class="text-3xl font-bold" id="hr-progress-text">0%</div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="flex-1 p-6 overflow-y-auto">
                <div class="max-w-7xl mx-auto">
                    <!-- 조직도 -->
                    <div class="bg-white rounded-xl shadow-lg p-6 mb-6">
                        <h3 class="text-xl font-bold mb-4 flex items-center">
                            <i class="fas fa-project-diagram mr-2 text-purple-600"></i>
                            조직도 및 갈등 현황
                        </h3>
                        <div class="flex justify-around items-start">
                            <!-- 영업팀 -->
                            <div class="text-center">
                                <div class="text-lg font-bold mb-3 text-blue-600">영업 부서</div>
                                ${employees.filter(e => e.team === 'sales').map(emp => `
                                    <div class="mb-3 p-3 border-2 ${emp.status === 'conflict' ? 'border-red-400 bg-red-50' : 'border-orange-400 bg-orange-50'} rounded-lg">
                                        <div class="font-bold">${emp.name}</div>
                                        <div class="text-xs text-gray-600">${emp.position}</div>
                                        <div class="text-xs mt-1 ${emp.status === 'conflict' ? 'text-red-600' : 'text-orange-600'} font-semibold">
                                            ${emp.status === 'conflict' ? '⚡ 갈등 당사자' : '💼 퇴사 예정'}
                                        </div>
                                        <div class="text-xs mt-1 text-gray-700">${emp.issue}</div>
                                    </div>
                                `).join('')}
                            </div>
                            
                            <!-- 중앙 화살표 -->
                            <div class="flex items-center justify-center px-8">
                                <div class="text-center">
                                    <i class="fas fa-exchange-alt text-4xl text-red-500 animate-pulse"></i>
                                    <div class="text-red-600 font-bold mt-2">협업 갈등</div>
                                    <div class="text-xs text-gray-600">납기 vs 품질</div>
                                </div>
                            </div>
                            
                            <!-- 생산팀 -->
                            <div class="text-center">
                                <div class="text-lg font-bold mb-3 text-green-600">생산 부서</div>
                                ${employees.filter(e => e.team === 'production').map(emp => `
                                    <div class="mb-3 p-3 border-2 ${emp.status === 'conflict' ? 'border-red-400 bg-red-50' : 'border-orange-400 bg-orange-50'} rounded-lg">
                                        <div class="font-bold">${emp.name}</div>
                                        <div class="text-xs text-gray-600">${emp.position}</div>
                                        <div class="text-xs mt-1 ${emp.status === 'conflict' ? 'text-red-600' : 'text-orange-600'} font-semibold">
                                            ${emp.status === 'conflict' ? '⚡ 갈등 당사자' : '💼 퇴사 예정'}
                                        </div>
                                        <div class="text-xs mt-1 text-gray-700">${emp.issue}</div>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    </div>
                    
                    <!-- 의사결정 영역 -->
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <!-- 1. 프로세스 정립 -->
                        <div class="bg-white rounded-xl shadow-lg p-6" id="hr-decision-1">
                            <div class="flex items-center mb-4">
                                <span class="text-2xl mr-2">📋</span>
                                <h4 class="text-lg font-bold">1. 프로세스 정립</h4>
                            </div>
                            <p class="text-sm text-gray-700 mb-4">부서 간 협업 프로세스를 명확히 정의합니다</p>
                            <select id="hr-process" class="w-full border-2 rounded-lg px-3 py-2 mb-3" onchange="updateHRDecision('process')">
                                <option value="">선택하세요</option>
                                <option value="sop">📖 SOP 문서화 (2주 소요)</option>
                                <option value="workflow">🔄 워크플로우 시스템 도입 (1개월)</option>
                                <option value="meeting">🤝 정기 협의체 구성 (즉시 가능)</option>
                                <option value="mediator">👤 조정자 배치 (1주 소요)</option>
                            </select>
                            <textarea id="hr-process-note" placeholder="근거 및 기대효과 작성" class="w-full border-2 rounded-lg px-3 py-2 text-sm" rows="3"></textarea>
                        </div>
                        
                        <!-- 2. 팀빌딩 -->
                        <div class="bg-white rounded-xl shadow-lg p-6" id="hr-decision-2">
                            <div class="flex items-center mb-4">
                                <span class="text-2xl mr-2">🎯</span>
                                <h4 class="text-lg font-bold">2. 팀빌딩 활동</h4>
                            </div>
                            <p class="text-sm text-gray-700 mb-4">양 부서 간 신뢰 회복 프로그램</p>
                            <select id="hr-team" class="w-full border-2 rounded-lg px-3 py-2 mb-3" onchange="updateHRDecision('team')">
                                <option value="">선택하세요</option>
                                <option value="workshop">🏕️ 워크숍 (1박2일, 500만원)</option>
                                <option value="project">🚀 합동 프로젝트 (2개월)</option>
                                <option value="training">📚 협업 교육 (1주, 300만원)</option>
                                <option value="rotation">🔄 순환 근무 (3개월)</option>
                            </select>
                            <textarea id="hr-team-note" placeholder="프로그램 세부 계획" class="w-full border-2 rounded-lg px-3 py-2 text-sm" rows="3"></textarea>
                        </div>
                        
                        <!-- 3. 개별 면담 -->
                        <div class="bg-white rounded-xl shadow-lg p-6" id="hr-decision-3">
                            <div class="flex items-center mb-4">
                                <span class="text-2xl mr-2">💬</span>
                                <h4 class="text-lg font-bold">3. 개별 면담 전략</h4>
                            </div>
                            <p class="text-sm text-gray-700 mb-4">퇴사 예정자 2명 대응 방안</p>
                            <select id="hr-interview" class="w-full border-2 rounded-lg px-3 py-2 mb-3" onchange="updateHRDecision('interview')">
                                <option value="">선택하세요</option>
                                <option value="retain">🎁 잔류 제안 (승진, 처우 개선)</option>
                                <option value="transfer">🔀 타부서 이동 제안</option>
                                <option value="accept">✅ 퇴사 수용 및 인수인계</option>
                                <option value="mediation">⚖️ 조정 후 판단 (1주 유예)</option>
                            </select>
                            <textarea id="hr-interview-note" placeholder="면담 시 핵심 메시지" class="w-full border-2 rounded-lg px-3 py-2 text-sm" rows="3"></textarea>
                        </div>
                    </div>
                    
                    <!-- 요약 패널 -->
                    <div class="bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl shadow-lg p-6 mt-6">
                        <h3 class="text-xl font-bold mb-4">📊 해결 방안 요약</h3>
                        <div id="hr-summary" class="text-sm space-y-2">
                            <div class="text-gray-600">아직 결정되지 않았습니다</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    window.hrDecisions = { process: null, team: null, interview: null };
}

// 신입사원 교육 프로그램 기획안 검토
function renderNewHireTraining(question) {
    const content = document.getElementById('simulation-content');
    
    const programs = [
        { id: 1, name: '오리엔테이션 프로그램', duration: '3일', cost: 1500, participants: 15, content: '회사 소개, 비전 공유, 핵심 가치 교육', status: 'submitted' },
        { id: 2, name: '직무 기초 교육', duration: '1주', cost: 3000, participants: 15, content: '각 부서별 기본 직무 교육 및 멘토링', status: 'submitted' },
        { id: 3, name: '소프트스킬 워크숍', duration: '2일', cost: 2000, participants: 15, content: '커뮤니케이션, 협업, 문제해결 능력 향상', status: 'pending' },
        { id: 4, name: '팀빌딩 프로그램', duration: '1일', cost: 1000, participants: 15, content: '신입사원 간 네트워킹 및 유대감 형성', status: 'pending' }
    ];
    
    totalTasks = 4;
    
    content.innerHTML = `
        <div class="h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col">
            <div class="bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg">
                <div class="px-6 py-4">
                    <div class="flex items-center justify-between">
                        <div class="flex items-center space-x-4">
                            <i class="fas fa-graduation-cap text-3xl"></i>
                            <div>
                                <div class="text-2xl font-bold">${question.title || '신입사원 교육 프로그램'}</div>
                                <div class="text-sm opacity-90 mt-1">${question.sender || '인재개발팀'} • ${question.date || '2026-02-23'}</div>
                            </div>
                        </div>
                        <div class="text-right">
                            <div class="text-sm opacity-75">검토 진행률</div>
                            <div class="text-3xl font-bold" id="hr-progress-text">0%</div>
                        </div>
                    </div>
                </div>
                <div class="px-6 pb-3">
                    <div class="bg-white bg-opacity-20 rounded-lg p-3">
                        <div class="flex items-start text-sm">
                            <i class="fas fa-info-circle mr-2 mt-0.5"></i>
                            <div>${question.content || '2026년 상반기 신입사원 15명에 대한 교육 프로그램 기획안이 제출되었습니다. 각 프로그램의 내용, 예산, 일정을 검토하고 승인 여부를 결정해주세요.'}</div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="flex-1 p-6 overflow-y-auto">
                <div class="max-w-6xl mx-auto">
                    <!-- 예산 요약 -->
                    <div class="bg-white rounded-xl shadow-lg p-6 mb-6">
                        <div class="grid grid-cols-4 gap-6">
                            <div class="text-center">
                                <div class="text-3xl font-bold text-blue-600">15명</div>
                                <div class="text-sm text-gray-600 mt-1">신입사원</div>
                            </div>
                            <div class="text-center">
                                <div class="text-3xl font-bold text-green-600">6,000<span class="text-lg">만원</span></div>
                                <div class="text-sm text-gray-600 mt-1">총 예산</div>
                            </div>
                            <div class="text-center">
                                <div class="text-3xl font-bold text-purple-600">7일</div>
                                <div class="text-sm text-gray-600 mt-1">총 교육기간</div>
                            </div>
                            <div class="text-center">
                                <div class="text-3xl font-bold text-orange-600" id="approved-count">0/4</div>
                                <div class="text-sm text-gray-600 mt-1">승인 완료</div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- 프로그램 카드 -->
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        ${programs.map(prog => `
                            <div class="bg-white rounded-xl shadow-lg p-6" id="program-${prog.id}">
                                <div class="flex items-start justify-between mb-4">
                                    <div class="flex-1">
                                        <div class="flex items-center mb-2">
                                            ${prog.status === 'submitted' ? '<span class="px-2 py-1 bg-green-100 text-green-700 text-xs font-bold rounded mr-2">기획안 제출됨</span>' : '<span class="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-bold rounded mr-2">검토 대기</span>'}
                                        </div>
                                        <h4 class="text-lg font-bold text-gray-800">${prog.name}</h4>
                                        <div class="text-sm text-gray-600 mt-2 space-y-1">
                                            <div><i class="fas fa-clock mr-2 text-blue-500"></i>기간: ${prog.duration}</div>
                                            <div><i class="fas fa-won-sign mr-2 text-green-500"></i>예산: ${prog.cost.toLocaleString()}만원</div>
                                            <div><i class="fas fa-users mr-2 text-purple-500"></i>대상: ${prog.participants}명</div>
                                        </div>
                                    </div>
                                </div>
                                
                                <div class="bg-gray-50 rounded-lg p-3 mb-4">
                                    <div class="text-sm text-gray-700">
                                        <strong>프로그램 내용:</strong><br/>
                                        ${prog.content}
                                    </div>
                                </div>
                                
                                <div class="mb-4">
                                    <label class="block text-sm font-semibold text-gray-700 mb-2">검토 의견</label>
                                    <select id="program-decision-${prog.id}" class="w-full border-2 rounded-lg px-3 py-2 mb-2" onchange="updateProgramDecision(${prog.id})">
                                        <option value="">결정을 선택하세요</option>
                                        <option value="approve">✅ 승인 (원안 그대로 진행)</option>
                                        <option value="modify">✏️ 수정 요청 (일부 수정 후 진행)</option>
                                        <option value="reduce">📉 예산 축소 (비용 절감 필요)</option>
                                        <option value="reject">❌ 반려 (재기획 필요)</option>
                                    </select>
                                </div>
                                
                                <div>
                                    <label class="block text-sm font-semibold text-gray-700 mb-2">상세 의견</label>
                                    <textarea id="program-note-${prog.id}" placeholder="검토 의견 및 수정 요청사항을 작성하세요" class="w-full border-2 rounded-lg px-3 py-2 text-sm" rows="2"></textarea>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                    
                    <!-- 최종 의사결정 -->
                    <div class="bg-gradient-to-r from-blue-100 to-indigo-100 rounded-xl shadow-lg p-6 mt-6">
                        <h3 class="text-xl font-bold mb-4"><i class="fas fa-clipboard-check mr-2"></i>최종 승인 결정</h3>
                        <div class="space-y-3">
                            <div>
                                <label class="block text-sm font-semibold text-gray-700 mb-2">전체 프로그램 시작일</label>
                                <input type="date" id="training-start-date" class="border-2 rounded-lg px-3 py-2" value="2026-03-10" />
                            </div>
                            <div>
                                <label class="block text-sm font-semibold text-gray-700 mb-2">특이사항</label>
                                <textarea id="final-note" placeholder="전체 프로그램에 대한 종합 의견" class="w-full border-2 rounded-lg px-3 py-2 text-sm" rows="2"></textarea>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    window.programDecisions = {};
}

function updateProgramDecision(progId) {
    const select = document.getElementById(`program-decision-${progId}`);
    const note = document.getElementById(`program-note-${progId}`).value;
    
    if (select.value) {
        window.programDecisions[progId] = {
            decision: select.value,
            note: note
        };
        
        const card = document.getElementById(`program-${progId}`);
        if (select.value === 'approve') {
            card.classList.add('border-2', 'border-green-500', 'bg-green-50');
        } else if (select.value === 'reject') {
            card.classList.add('border-2', 'border-red-500', 'bg-red-50');
        } else {
            card.classList.add('border-2', 'border-yellow-500', 'bg-yellow-50');
        }
        
        const completed = Object.keys(window.programDecisions).length;
        const percentage = Math.round((completed / totalTasks) * 100);
        document.getElementById('hr-progress-text').textContent = `${percentage}%`;
        document.getElementById('progress-text').textContent = `${percentage}%`;
        document.getElementById('approved-count').textContent = `${completed}/${totalTasks}`;
    }
}

// 직원 복지제도 개선 제안
function renderEmployeeBenefits(question) {
    const content = document.getElementById('simulation-content');
    
    const proposals = [
        { id: 1, title: '재택근무 확대', cost: 500, target: '전 직원', satisfaction: '+15%', content: '주 2회 재택근무를 주 3회로 확대. 통근 시간 절감 및 워라밸 개선 효과 기대' },
        { id: 2, title: '건강검진 패키지 업그레이드', cost: 2000, target: '전 직원', satisfaction: '+10%', content: '기본 검진에서 종합 건강검진으로 업그레이드. 가족 검진 지원 포함' },
        { id: 3, title: '자녀 학자금 지원', cost: 3000, target: '자녀 있는 직원', satisfaction: '+20%', content: '초중고 학자금 연 300만원, 대학생 연 500만원 지원' },
        { id: 4, title: '경조사 지원금 인상', cost: 500, target: '전 직원', satisfaction: '+8%', content: '결혼 100만원→200만원, 출산 50만원→100만원으로 인상' }
    ];
    
    totalTasks = 4;
    
    content.innerHTML = `
        <div class="h-screen bg-gradient-to-br from-green-50 to-teal-100 flex flex-col">
            <div class="bg-gradient-to-r from-green-600 to-teal-600 text-white shadow-lg">
                <div class="px-6 py-4">
                    <div class="flex items-center justify-between">
                        <div class="flex items-center space-x-4">
                            <i class="fas fa-heart text-3xl"></i>
                            <div>
                                <div class="text-2xl font-bold">${question.title || '직원 복지제도 개선 제안'}</div>
                                <div class="text-sm opacity-90 mt-1">${question.sender || '인사팀'} • ${question.date || '2026-02-23'}</div>
                            </div>
                        </div>
                        <div class="text-right">
                            <div class="text-sm opacity-75">검토 진행률</div>
                            <div class="text-3xl font-bold" id="hr-progress-text">0%</div>
                        </div>
                    </div>
                </div>
                <div class="px-6 pb-3">
                    <div class="bg-white bg-opacity-20 rounded-lg p-3">
                        <div class="flex items-start text-sm">
                            <i class="fas fa-info-circle mr-2 mt-0.5"></i>
                            <div>${question.content || '직원 만족도 조사 결과를 바탕으로 복지제도 개선안 4건이 제안되었습니다. 예산 8,000만원 내에서 우선순위를 정하고 시행 시기를 결정해주세요.'}</div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="flex-1 p-6 overflow-y-auto">
                <div class="max-w-6xl mx-auto">
                    <!-- 예산 현황 -->
                    <div class="bg-white rounded-xl shadow-lg p-6 mb-6">
                        <div class="grid grid-cols-4 gap-6">
                            <div class="text-center">
                                <div class="text-3xl font-bold text-blue-600">8,000<span class="text-lg">만원</span></div>
                                <div class="text-sm text-gray-600 mt-1">가용 예산</div>
                            </div>
                            <div class="text-center">
                                <div class="text-3xl font-bold text-purple-600" id="used-budget">0<span class="text-lg">만원</span></div>
                                <div class="text-sm text-gray-600 mt-1">사용 예산</div>
                            </div>
                            <div class="text-center">
                                <div class="text-3xl font-bold text-green-600" id="remaining-budget">8,000<span class="text-lg">만원</span></div>
                                <div class="text-sm text-gray-600 mt-1">잔여 예산</div>
                            </div>
                            <div class="text-center">
                                <div class="text-3xl font-bold text-orange-600" id="satisfaction-increase">0%</div>
                                <div class="text-sm text-gray-600 mt-1">예상 만족도 증가</div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- 복지 제안 카드 -->
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        ${proposals.map(prop => `
                            <div class="bg-white rounded-xl shadow-lg p-6" id="benefit-${prop.id}">
                                <div class="mb-4">
                                    <h4 class="text-lg font-bold text-gray-800 mb-2">${prop.title}</h4>
                                    <div class="flex gap-2 mb-3">
                                        <span class="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded">💰 ${prop.cost.toLocaleString()}만원</span>
                                        <span class="px-2 py-1 bg-purple-100 text-purple-700 text-xs font-bold rounded">👥 ${prop.target}</span>
                                        <span class="px-2 py-1 bg-green-100 text-green-700 text-xs font-bold rounded">📈 ${prop.satisfaction}</span>
                                    </div>
                                    <div class="bg-gray-50 rounded-lg p-3">
                                        <div class="text-sm text-gray-700">${prop.content}</div>
                                    </div>
                                </div>
                                
                                <div class="mb-4">
                                    <label class="block text-sm font-semibold text-gray-700 mb-2">승인 결정</label>
                                    <select id="benefit-decision-${prop.id}" class="w-full border-2 rounded-lg px-3 py-2 mb-2" onchange="updateBenefitDecision(${prop.id}, ${prop.cost}, '${prop.satisfaction}')">
                                        <option value="">결정을 선택하세요</option>
                                        <option value="approve-h1">✅ 승인 (2026 상반기 시행)</option>
                                        <option value="approve-h2">⏳ 승인 (2026 하반기 시행)</option>
                                        <option value="approve-2027">📅 승인 (2027년 시행)</option>
                                        <option value="pending">⚠️ 보류 (재검토 필요)</option>
                                        <option value="reject">❌ 반려</option>
                                    </select>
                                </div>
                                
                                <div>
                                    <label class="block text-sm font-semibold text-gray-700 mb-2">우선순위</label>
                                    <select id="benefit-priority-${prop.id}" class="w-full border-2 rounded-lg px-3 py-2">
                                        <option value="">-</option>
                                        <option value="1">⭐⭐⭐ 최우선</option>
                                        <option value="2">⭐⭐ 높음</option>
                                        <option value="3">⭐ 보통</option>
                                    </select>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                    
                    <!-- 시행 계획 -->
                    <div class="bg-gradient-to-r from-green-100 to-teal-100 rounded-xl shadow-lg p-6 mt-6">
                        <h3 class="text-xl font-bold mb-4"><i class="fas fa-calendar-check mr-2"></i>시행 계획 요약</h3>
                        <div id="benefit-summary" class="text-sm space-y-2">
                            <div class="text-gray-600">아직 결정되지 않았습니다</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    window.benefitDecisions = {};
    window.totalBudgetUsed = 0;
    window.totalSatisfaction = 0;
}

function updateBenefitDecision(id, cost, satisfaction) {
    const select = document.getElementById(`benefit-decision-${id}`);
    const priority = document.getElementById(`benefit-priority-${id}`).value;
    
    if (select.value) {
        const isApproved = select.value.startsWith('approve');
        
        // 이전 결정 취소 시 예산 복구
        if (window.benefitDecisions[id] && window.benefitDecisions[id].approved) {
            window.totalBudgetUsed -= cost;
            window.totalSatisfaction -= parseFloat(satisfaction.replace('%', '').replace('+', ''));
        }
        
        window.benefitDecisions[id] = {
            decision: select.value,
            priority: priority,
            approved: isApproved
        };
        
        // 예산 및 만족도 업데이트
        if (isApproved) {
            window.totalBudgetUsed += cost;
            window.totalSatisfaction += parseFloat(satisfaction.replace('%', '').replace('+', ''));
        }
        
        const card = document.getElementById(`benefit-${id}`);
        card.classList.remove('border-2', 'border-green-500', 'bg-green-50', 'border-red-500', 'bg-red-50', 'border-yellow-500', 'bg-yellow-50');
        
        if (isApproved) {
            card.classList.add('border-2', 'border-green-500', 'bg-green-50');
        } else if (select.value === 'reject') {
            card.classList.add('border-2', 'border-red-500', 'bg-red-50');
        } else {
            card.classList.add('border-2', 'border-yellow-500', 'bg-yellow-50');
        }
        
        // UI 업데이트
        document.getElementById('used-budget').innerHTML = `${window.totalBudgetUsed.toLocaleString()}<span class="text-lg">만원</span>`;
        document.getElementById('remaining-budget').innerHTML = `${(8000 - window.totalBudgetUsed).toLocaleString()}<span class="text-lg">만원</span>`;
        document.getElementById('satisfaction-increase').textContent = `+${window.totalSatisfaction}%`;
        
        const completed = Object.keys(window.benefitDecisions).length;
        const percentage = Math.round((completed / totalTasks) * 100);
        document.getElementById('hr-progress-text').textContent = `${percentage}%`;
        document.getElementById('progress-text').textContent = `${percentage}%`;
        
        // 요약 업데이트
        updateBenefitSummary();
    }
}

function updateBenefitSummary() {
    const summary = document.getElementById('benefit-summary');
    const decisions = window.benefitDecisions;
    
    const h1Items = [];
    const h2Items = [];
    const y2027Items = [];
    
    Object.keys(decisions).forEach(id => {
        const dec = decisions[id];
        if (dec.decision === 'approve-h1') h1Items.push(id);
        else if (dec.decision === 'approve-h2') h2Items.push(id);
        else if (dec.decision === 'approve-2027') y2027Items.push(id);
    });
    
    let html = '';
    if (h1Items.length > 0) html += `<div><strong>✅ 2026 상반기:</strong> ${h1Items.length}건 시행</div>`;
    if (h2Items.length > 0) html += `<div><strong>⏳ 2026 하반기:</strong> ${h2Items.length}건 시행</div>`;
    if (y2027Items.length > 0) html += `<div><strong>📅 2027년:</strong> ${y2027Items.length}건 시행</div>`;
    
    if (html === '') html = '<div class="text-gray-600">아직 결정되지 않았습니다</div>';
    
    summary.innerHTML = html;
}

function updateHRDecision(type) {
    const select = document.getElementById(`hr-${type}`);
    const note = document.getElementById(`hr-${type}-note`).value;
    
    if (select.value) {
        window.hrDecisions[type] = {
            decision: select.options[select.selectedIndex].text,
            note: note
        };
        
        // 카드 색상 변경
        const card = document.getElementById(`hr-decision-${type === 'process' ? '1' : type === 'team' ? '2' : '3'}`);
        card.classList.add('border-2', 'border-green-500', 'bg-green-50');
        
        // 요약 업데이트
        updateHRSummary();
        updateHRProgress();
    }
}

function updateHRSummary() {
    const summary = document.getElementById('hr-summary');
    const decisions = window.hrDecisions;
    
    let html = '';
    if (decisions.process) {
        html += `<div class="flex items-start"><i class="fas fa-check-circle text-green-600 mr-2 mt-1"></i><div><strong>프로세스:</strong> ${decisions.process.decision}</div></div>`;
    }
    if (decisions.team) {
        html += `<div class="flex items-start"><i class="fas fa-check-circle text-green-600 mr-2 mt-1"></i><div><strong>팀빌딩:</strong> ${decisions.team.decision}</div></div>`;
    }
    if (decisions.interview) {
        html += `<div class="flex items-start"><i class="fas fa-check-circle text-green-600 mr-2 mt-1"></i><div><strong>면담:</strong> ${decisions.interview.decision}</div></div>`;
    }
    
    if (html === '') {
        html = '<div class="text-gray-600">아직 결정되지 않았습니다</div>';
    }
    
    summary.innerHTML = html;
}

function updateHRProgress() {
    const decisions = window.hrDecisions;
    const completed = Object.values(decisions).filter(d => d !== null).length;
    const percentage = Math.round((completed / totalTasks) * 100);
    
    document.getElementById('hr-progress-text').textContent = `${percentage}%`;
    document.getElementById('progress-text').textContent = `${percentage}%`;
}
// 재무 관리 시뮬레이션 - 예산 재배분 인터랙티브 차트
function renderFinanceSystem(question) {
    const content = document.getElementById('simulation-content');
    
    const departments = [
        { id: 1, name: '마케팅', current: 5000, request: 8000, priority: 'high', reason: '신제품 론칭 캠페인' },
        { id: 2, name: '연구개발', current: 8000, request: 12000, priority: 'high', reason: '차세대 기술 개발' },
        { id: 3, name: '영업', current: 6000, request: 8000, priority: 'medium', reason: '영업인력 확충' },
        { id: 4, name: '생산', current: 10000, request: 12000, priority: 'high', reason: '설비 노후화 교체' }
    ];
    
    const available = 7000;
    const totalRequest = departments.reduce((sum, d) => sum + (d.request - d.current), 0);
    
    totalTasks = departments.length;
    
    content.innerHTML = `
        <div class="h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex flex-col">
            <div class="bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg">
                <div class="px-6 py-4">
                    <div class="flex items-center justify-between">
                        <div class="flex items-center space-x-4">
                            <i class="fas fa-chart-pie text-3xl"></i>
                            <div>
                                <div class="text-2xl font-bold">재무 예산 배분 시스템</div>
                                <div class="text-sm opacity-90 mt-1">💰 가용 예산: ${available.toLocaleString()}만원 / 요청: ${totalRequest.toLocaleString()}만원</div>
                            </div>
                        </div>
                        <div class="text-right">
                            <div class="text-sm opacity-75">배분 완료율</div>
                            <div class="text-3xl font-bold" id="finance-progress-text">0%</div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="flex-1 p-6 overflow-y-auto">
                <div class="max-w-7xl mx-auto">
                    <!-- 예산 현황 카드 -->
                    <div class="grid grid-cols-4 gap-4 mb-6">
                        <div class="bg-white rounded-xl shadow-lg p-6 text-center">
                            <div class="text-3xl font-bold text-blue-600">${available.toLocaleString()}</div>
                            <div class="text-sm text-gray-600 mt-1">가용 예산 (만원)</div>
                        </div>
                        <div class="bg-white rounded-xl shadow-lg p-6 text-center">
                            <div class="text-3xl font-bold text-orange-600" id="finance-allocated">0</div>
                            <div class="text-sm text-gray-600 mt-1">배분 예산 (만원)</div>
                        </div>
                        <div class="bg-white rounded-xl shadow-lg p-6 text-center">
                            <div class="text-3xl font-bold text-green-600" id="finance-remaining">${available.toLocaleString()}</div>
                            <div class="text-sm text-gray-600 mt-1">잔액 (만원)</div>
                        </div>
                        <div class="bg-white rounded-xl shadow-lg p-6 text-center">
                            <div class="text-3xl font-bold text-red-600">${(totalRequest - available).toLocaleString()}</div>
                            <div class="text-sm text-gray-600 mt-1">부족액 (만원)</div>
                        </div>
                    </div>
                    
                    <!-- 부서별 예산 배분 -->
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        ${departments.map(dept => `
                            <div class="bg-white rounded-xl shadow-lg p-6" id="finance-card-${dept.id}">
                                <div class="flex items-start justify-between mb-4">
                                    <div>
                                        <h4 class="text-xl font-bold">${dept.name} 부서</h4>
                                        <span class="text-xs px-2 py-1 rounded ${
                                            dept.priority === 'high' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                                        }">
                                            ${dept.priority === 'high' ? '🔴 긴급' : '🟡 보통'}
                                        </span>
                                    </div>
                                </div>
                                
                                <div class="grid grid-cols-3 gap-2 mb-4">
                                    <div class="bg-gray-50 rounded p-2 text-center">
                                        <div class="text-xs text-gray-600">현재 예산</div>
                                        <div class="text-lg font-bold">${dept.current.toLocaleString()}</div>
                                    </div>
                                    <div class="bg-blue-50 rounded p-2 text-center">
                                        <div class="text-xs text-gray-600">요청 예산</div>
                                        <div class="text-lg font-bold text-blue-600">${dept.request.toLocaleString()}</div>
                                    </div>
                                    <div class="bg-orange-50 rounded p-2 text-center">
                                        <div class="text-xs text-gray-600">추가 요청</div>
                                        <div class="text-lg font-bold text-orange-600">+${(dept.request - dept.current).toLocaleString()}</div>
                                    </div>
                                </div>
                                
                                <div class="bg-yellow-50 border-l-4 border-yellow-400 p-3 mb-4">
                                    <div class="text-sm font-semibold text-gray-700">요청 사유</div>
                                    <div class="text-sm text-gray-600">${dept.reason}</div>
                                </div>
                                
                                <div class="space-y-3">
                                    <div>
                                        <label class="text-sm font-semibold block mb-2">배분 금액 (만원)</label>
                                        <input type="number" id="finance-amount-${dept.id}" class="w-full border-2 rounded-lg px-3 py-2" 
                                               min="0" max="${dept.request - dept.current}" value="0"
                                               onchange="updateFinanceDecision(${dept.id}, ${dept.current})">
                                    </div>
                                    <div>
                                        <label class="text-sm font-semibold block mb-2">결정</label>
                                        <select id="finance-decision-${dept.id}" class="w-full border-2 rounded-lg px-3 py-2" 
                                                onchange="updateFinanceDecision(${dept.id}, ${dept.current})">
                                            <option value="">선택하세요</option>
                                            <option value="full">✅ 전액 승인</option>
                                            <option value="partial">⚖️ 일부 승인</option>
                                            <option value="reject">❌ 승인 거부</option>
                                            <option value="defer">⏳ 차기 분기 검토</option>
                                        </select>
                                    </div>
                                    <textarea id="finance-note-${dept.id}" placeholder="배분 근거 작성" 
                                              class="w-full border-2 rounded-lg px-3 py-2 text-sm" rows="2"></textarea>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                    
                    <!-- 배분 요약 -->
                    <div class="bg-gradient-to-r from-green-100 to-emerald-100 rounded-xl shadow-lg p-6 mt-6">
                        <h3 class="text-xl font-bold mb-4">📊 예산 배분 요약</h3>
                        <div id="finance-summary" class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div class="text-sm text-gray-600">아직 배분되지 않았습니다</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    window.financeDecisions = {};
    window.financeAvailable = available;
}

function updateFinanceDecision(deptId, currentBudget) {
    const amount = parseInt(document.getElementById(`finance-amount-${deptId}`).value) || 0;
    const decision = document.getElementById(`finance-decision-${deptId}`).value;
    const note = document.getElementById(`finance-note-${deptId}`).value;
    
    if (decision && amount >= 0) {
        window.financeDecisions[deptId] = {
            amount: amount,
            decision: decision,
            note: note
        };
        
        // 총 배분액 계산
        const totalAllocated = Object.values(window.financeDecisions).reduce((sum, d) => sum + d.amount, 0);
        const remaining = window.financeAvailable - totalAllocated;
        
        // 화면 업데이트
        document.getElementById('finance-allocated').textContent = totalAllocated.toLocaleString();
        document.getElementById('finance-remaining').textContent = remaining.toLocaleString();
        
        // 잔액 색상
        const remainingEl = document.getElementById('finance-remaining');
        if (remaining < 0) {
            remainingEl.classList.remove('text-green-600');
            remainingEl.classList.add('text-red-600');
        } else {
            remainingEl.classList.remove('text-red-600');
            remainingEl.classList.add('text-green-600');
        }
        
        // 카드 색상
        const card = document.getElementById(`finance-card-${deptId}`);
        card.classList.add('border-2', 'border-green-500', 'bg-green-50');
        
        updateFinanceSummary();
        updateFinanceProgress();
    }
}

function updateFinanceSummary() {
    const summary = document.getElementById('finance-summary');
    const decisions = window.financeDecisions;
    
    if (Object.keys(decisions).length === 0) return;
    
    const deptNames = ['', '마케팅', '연구개발', '영업', '생산'];
    let html = '';
    
    for (const [deptId, data] of Object.entries(decisions)) {
        html += `
            <div class="bg-white rounded p-3">
                <div class="font-bold">${deptNames[deptId]}</div>
                <div class="text-green-600 font-bold">+${data.amount.toLocaleString()}만원</div>
                <div class="text-xs text-gray-600 mt-1">${data.note || '근거 미작성'}</div>
            </div>
        `;
    }
    
    summary.innerHTML = html;
}

function updateFinanceProgress() {
    const completed = Object.keys(window.financeDecisions).length;
    const percentage = Math.round((completed / totalTasks) * 100);
    
    document.getElementById('finance-progress-text').textContent = `${percentage}%`;
    document.getElementById('progress-text').textContent = `${percentage}%`;
}
// 고객 관리 시뮬레이션 - CRM 대시보드
function renderCRMSystem(question) {
    const content = document.getElementById('simulation-content');
    
    // question에서 고객 정보 가져오기 (기본값 제공)
    const client = {
        name: 'ABC 그룹',
        value: 150,
        contract: '2022-03-15',
        level: 'VIP',
        issues: [
            { date: '2025-11-05', type: '품질', desc: '제품 불량률 2% 발생', status: '미해결' },
            { date: '2025-12-12', type: '납기', desc: '납기 3일 지연', status: '미해결' },
            { date: '2026-01-10', type: '품질', desc: '사양 불일치', status: '미해결' },
            { date: '2026-02-08', type: '서비스', desc: 'A/S 응대 불만', status: '미해결' }
        ],
        demands: [
            { item: '가격 할인', desc: '30% 단가 인하 요구', cost: 4500 },
            { item: '품질 보증', desc: '5년 무상 A/S', cost: 2000 },
            { item: '전담팀', desc: '전담 관리팀 구성', cost: 1200 }
        ]
    };
    
    totalTasks = 4; // 4가지 의사결정
    
    content.innerHTML = `
        <div class="h-screen bg-gradient-to-br from-blue-50 to-cyan-100 flex flex-col">
            <div class="bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg">
                <div class="px-6 py-4">
                    <div class="flex items-center justify-between">
                        <div class="flex items-center space-x-4">
                            <i class="fas fa-user-tie text-3xl"></i>
                            <div>
                                <div class="text-2xl font-bold">${question.title || 'VIP 고객 위기 관리 CRM'}</div>
                                <div class="text-sm opacity-90 mt-1">${question.sender || '영업팀'} • ${question.date || '2026-02-23'}</div>
                            </div>
                        </div>
                        <div class="text-right">
                            <div class="text-sm opacity-75">대응 완료율</div>
                            <div class="text-3xl font-bold" id="crm-progress-text">0%</div>
                        </div>
                    </div>
                </div>
                <div class="px-6 pb-3">
                    <div class="bg-white bg-opacity-20 rounded-lg p-3">
                        <div class="flex items-start text-sm">
                            <i class="fas fa-exclamation-triangle mr-2 mt-0.5"></i>
                            <div>${question.content || `🚨 ${client.name} (연 매출 ${client.value}억원) 이탈 위기. 누적 이슈 ${client.issues.length}건 미해결 상태이며, 계약 종료를 통보받았습니다. 즉시 대응이 필요합니다.`}</div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="flex-1 p-6 overflow-y-auto">
                <div class="max-w-7xl mx-auto">
                    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <!-- 좌측: 고객 정보 -->
                        <div class="lg:col-span-1 space-y-4">
                            <!-- 고객 프로필 -->
                            <div class="bg-white rounded-xl shadow-lg p-6">
                                <div class="flex items-center mb-4">
                                    <div class="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white text-2xl font-bold mr-4">
                                        ${client.name[0]}
                                    </div>
                                    <div>
                                        <h3 class="text-xl font-bold">${client.name}</h3>
                                        <span class="text-xs px-2 py-1 bg-red-100 text-red-700 rounded">🔴 VIP 고객</span>
                                    </div>
                                </div>
                                <div class="space-y-2 text-sm">
                                    <div class="flex justify-between">
                                        <span class="text-gray-600">연간 매출</span>
                                        <span class="font-bold text-blue-600">${client.value}억원</span>
                                    </div>
                                    <div class="flex justify-between">
                                        <span class="text-gray-600">계약 시작</span>
                                        <span>${client.contract}</span>
                                    </div>
                                    <div class="flex justify-between">
                                        <span class="text-gray-600">거래 기간</span>
                                        <span>3년 10개월</span>
                                    </div>
                                    <div class="flex justify-between">
                                        <span class="text-gray-600">누적 이슈</span>
                                        <span class="font-bold text-red-600">${client.issues.length}건</span>
                                    </div>
                                </div>
                            </div>
                            
                            <!-- 이슈 히스토리 -->
                            <div class="bg-white rounded-xl shadow-lg p-6">
                                <h4 class="text-lg font-bold mb-4 flex items-center">
                                    <i class="fas fa-exclamation-triangle text-red-500 mr-2"></i>
                                    이슈 히스토리
                                </h4>
                                <div class="space-y-3">
                                    ${client.issues.map(issue => `
                                        <div class="border-l-4 border-red-400 pl-3 py-2 bg-red-50">
                                            <div class="text-xs text-gray-500">${issue.date}</div>
                                            <div class="font-semibold text-sm">[${issue.type}] ${issue.desc}</div>
                                            <span class="text-xs px-2 py-1 bg-red-200 text-red-700 rounded">${issue.status}</span>
                                        </div>
                                    `).join('')}
                                </div>
                            </div>
                            
                            <!-- 고객 요구사항 -->
                            <div class="bg-white rounded-xl shadow-lg p-6">
                                <h4 class="text-lg font-bold mb-4 flex items-center">
                                    <i class="fas fa-list-check text-orange-500 mr-2"></i>
                                    고객 요구사항
                                </h4>
                                <div class="space-y-2 text-sm">
                                    ${client.demands.map(demand => `
                                        <div class="flex justify-between items-center p-2 bg-orange-50 rounded">
                                            <div>
                                                <div class="font-semibold">${demand.item}</div>
                                                <div class="text-xs text-gray-600">${demand.desc}</div>
                                            </div>
                                            <div class="text-right">
                                                <div class="font-bold text-orange-600">${demand.cost.toLocaleString()}만</div>
                                            </div>
                                        </div>
                                    `).join('')}
                                    <div class="text-right pt-2 border-t-2 border-orange-200">
                                        <span class="text-xs text-gray-600">연간 비용 증가 예상</span>
                                        <div class="text-xl font-bold text-orange-600">${client.demands.reduce((s, d) => s + d.cost, 0).toLocaleString()}만원</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <!-- 우측: 의사결정 영역 -->
                        <div class="lg:col-span-2 space-y-6">
                            <!-- 1. 즉각 대응 -->
                            <div class="bg-white rounded-xl shadow-lg p-6" id="crm-decision-1">
                                <div class="flex items-center mb-4">
                                    <span class="text-3xl mr-3">⚡</span>
                                    <div>
                                        <h4 class="text-xl font-bold">1. 즉각 대응 전략 (6시간 내)</h4>
                                        <p class="text-sm text-gray-600">고객사 긴급 미팅 준비</p>
                                    </div>
                                </div>
                                <select id="crm-response" class="w-full border-2 rounded-lg px-3 py-2 mb-3" onchange="updateCRMDecision('response')">
                                    <option value="">선택하세요</option>
                                    <option value="ceo">🏢 CEO 직접 방문 사과</option>
                                    <option value="team">👥 대응팀 즉시 파견</option>
                                    <option value="proposal">📄 개선안 문서 제출</option>
                                    <option value="discount">💰 긴급 보상안 제시</option>
                                </select>
                                <textarea id="crm-response-note" placeholder="대응 전략 상세 계획" class="w-full border-2 rounded-lg px-3 py-2 text-sm" rows="3"></textarea>
                            </div>
                            
                            <!-- 2. 가격 협상 -->
                            <div class="bg-white rounded-xl shadow-lg p-6" id="crm-decision-2">
                                <div class="flex items-center mb-4">
                                    <span class="text-3xl mr-3">💰</span>
                                    <div>
                                        <h4 class="text-xl font-bold">2. 가격 협상 (30% 할인 요구)</h4>
                                        <p class="text-sm text-gray-600">연 4,500만원 비용 증가</p>
                                    </div>
                                </div>
                                <div class="mb-3">
                                    <label class="text-sm font-semibold block mb-2">할인율 제안 (%)</label>
                                    <input type="number" id="crm-discount" class="w-full border-2 rounded-lg px-3 py-2" 
                                           min="0" max="30" value="0" onchange="updateCRMDecision('price')">
                                </div>
                                <select id="crm-price" class="w-full border-2 rounded-lg px-3 py-2 mb-3" onchange="updateCRMDecision('price')">
                                    <option value="">협상 방향 선택</option>
                                    <option value="accept">✅ 요구 수용 (30% 할인)</option>
                                    <option value="partial">⚖️ 부분 수용 (10~20%)</option>
                                    <option value="alternative">🎁 대체 혜택 제시</option>
                                    <option value="reject">❌ 할인 거부, 품질 개선</option>
                                </select>
                                <textarea id="crm-price-note" placeholder="협상 근거 및 대안" class="w-full border-2 rounded-lg px-3 py-2 text-sm" rows="3"></textarea>
                            </div>
                            
                            <!-- 3. 품질 개선 -->
                            <div class="bg-white rounded-xl shadow-lg p-6" id="crm-decision-3">
                                <div class="flex items-center mb-4">
                                    <span class="text-3xl mr-3">🎯</span>
                                    <div>
                                        <h4 class="text-xl font-bold">3. 품질 보증 방안</h4>
                                        <p class="text-sm text-gray-600">5년 무상 A/S 요구 (연 2,000만원)</p>
                                    </div>
                                </div>
                                <select id="crm-quality" class="w-full border-2 rounded-lg px-3 py-2 mb-3" onchange="updateCRMDecision('quality')">
                                    <option value="">선택하세요</option>
                                    <option value="5year">✅ 5년 보증 수용</option>
                                    <option value="3year">⏰ 3년 보증 제안</option>
                                    <option value="premium">🌟 프리미엄 플랜 (유상)</option>
                                    <option value="improvement">🔧 품질 개선 투자</option>
                                </select>
                                <textarea id="crm-quality-note" placeholder="품질 보증 실행 방안" class="w-full border-2 rounded-lg px-3 py-2 text-sm" rows="3"></textarea>
                            </div>
                            
                            <!-- 4. 관계 강화 -->
                            <div class="bg-white rounded-xl shadow-lg p-6" id="crm-decision-4">
                                <div class="flex items-center mb-4">
                                    <span class="text-3xl mr-3">🤝</span>
                                    <div>
                                        <h4 class="text-xl font-bold">4. 장기 관계 강화 전략</h4>
                                        <p class="text-sm text-gray-600">전담팀 구성 요구 (연 1,200만원)</p>
                                    </div>
                                </div>
                                <select id="crm-relationship" class="w-full border-2 rounded-lg px-3 py-2 mb-3" onchange="updateCRMDecision('relationship')">
                                    <option value="">선택하세요</option>
                                    <option value="dedicated">👥 전담팀 구성 (3명)</option>
                                    <option value="manager">👤 전담 매니저 배치 (1명)</option>
                                    <option value="regular">📅 정기 미팅 제도화</option>
                                    <option value="partnership">🌐 전략적 파트너십 체결</option>
                                </select>
                                <textarea id="crm-relationship-note" placeholder="관계 강화 실행 계획" class="w-full border-2 rounded-lg px-3 py-2 text-sm" rows="3"></textarea>
                            </div>
                            
                            <!-- 의사결정 요약 -->
                            <div class="bg-gradient-to-r from-blue-100 to-cyan-100 rounded-xl shadow-lg p-6">
                                <h3 class="text-xl font-bold mb-4">📊 대응 전략 요약</h3>
                                <div id="crm-summary" class="text-sm space-y-2">
                                    <div class="text-gray-600">아직 결정되지 않았습니다</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    window.crmDecisions = { response: null, price: null, quality: null, relationship: null };
}

function updateCRMDecision(type) {
    const select = document.getElementById(`crm-${type}`);
    const note = document.getElementById(`crm-${type}-note`).value;
    
    if (select && select.value) {
        window.crmDecisions[type] = {
            decision: select.options[select.selectedIndex].text,
            note: note
        };
        
        // 카드 색상
        const cardMap = { response: 1, price: 2, quality: 3, relationship: 4 };
        const card = document.getElementById(`crm-decision-${cardMap[type]}`);
        card.classList.add('border-2', 'border-green-500', 'bg-green-50');
        
        updateCRMSummary();
        updateCRMProgress();
    }
}

function updateCRMSummary() {
    const summary = document.getElementById('crm-summary');
    const decisions = window.crmDecisions;
    
    let html = '';
    const labels = { response: '즉각대응', price: '가격협상', quality: '품질보증', relationship: '관계강화' };
    
    for (const [key, data] of Object.entries(decisions)) {
        if (data) {
            html += `<div class="flex items-start"><i class="fas fa-check-circle text-green-600 mr-2 mt-1"></i><div><strong>${labels[key]}:</strong> ${data.decision}</div></div>`;
        }
    }
    
    if (html === '') {
        html = '<div class="text-gray-600">아직 결정되지 않았습니다</div>';
    }
    
    summary.innerHTML = html;
}

function updateCRMProgress() {
    const decisions = window.crmDecisions;
    const completed = Object.values(decisions).filter(d => d !== null).length;
    const percentage = Math.round((completed / totalTasks) * 100);
    
    document.getElementById('crm-progress-text').textContent = `${percentage}%`;
    document.getElementById('progress-text').textContent = `${percentage}%`;
}
// 윤리 경영 시뮬레이션 - 내부 고발 워크플로우
function renderComplianceSystem(question) {
    const content = document.getElementById('simulation-content');
    
    const whistleblower = {
        code: 'WB-2026-021',
        date: '2026-02-20 14:30',
        target: '구매팀 김과장 (재직 15년)',
        amount: 2400,
        evidence: ['은행 이체 기록 5건', '리베이트 계약서', '녹취록 3건'],
        impact: '연간 구매액 50억원 규모'
    };
    
    totalTasks = 4;
    
    content.innerHTML = `
        <div class="h-screen bg-gradient-to-br from-gray-50 to-slate-100 flex flex-col">
            <div class="bg-gradient-to-r from-slate-700 to-gray-800 text-white shadow-lg">
                <div class="px-6 py-4">
                    <div class="flex items-center justify-between">
                        <div class="flex items-center space-x-4">
                            <i class="fas fa-shield-alt text-3xl"></i>
                            <div>
                                <div class="text-2xl font-bold">윤리 경영 제보 처리 시스템</div>
                                <div class="text-sm opacity-90 mt-1">🚨 금품 수수 내부 고발 - 긴급 대응 필요</div>
                            </div>
                        </div>
                        <div class="text-right">
                            <div class="text-sm opacity-75">처리 진행률</div>
                            <div class="text-3xl font-bold" id="compliance-progress-text">0%</div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="flex-1 p-6 overflow-y-auto">
                <div class="max-w-7xl mx-auto">
                    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <!-- 좌측: 제보 내용 -->
                        <div class="lg:col-span-1 space-y-4">
                            <!-- 제보 정보 -->
                            <div class="bg-white rounded-xl shadow-lg p-6 border-l-4 border-red-500">
                                <div class="flex items-center mb-4">
                                    <i class="fas fa-file-alt text-2xl text-red-500 mr-3"></i>
                                    <div>
                                        <h3 class="text-lg font-bold">제보 정보</h3>
                                        <span class="text-xs px-2 py-1 bg-red-100 text-red-700 rounded">🔴 긴급</span>
                                    </div>
                                </div>
                                <div class="space-y-2 text-sm">
                                    <div class="flex justify-between">
                                        <span class="text-gray-600">제보 번호</span>
                                        <span class="font-mono">${whistleblower.code}</span>
                                    </div>
                                    <div class="flex justify-between">
                                        <span class="text-gray-600">접수 일시</span>
                                        <span>${whistleblower.date}</span>
                                    </div>
                                    <div class="flex justify-between">
                                        <span class="text-gray-600">제보 대상</span>
                                        <span class="font-bold">${whistleblower.target}</span>
                                    </div>
                                    <div class="flex justify-between">
                                        <span class="text-gray-600">혐의 금액</span>
                                        <span class="font-bold text-red-600">${whistleblower.amount.toLocaleString()}만원</span>
                                    </div>
                                </div>
                            </div>
                            
                            <!-- 증거 자료 -->
                            <div class="bg-white rounded-xl shadow-lg p-6">
                                <h4 class="text-lg font-bold mb-4 flex items-center">
                                    <i class="fas fa-folder-open text-yellow-600 mr-2"></i>
                                    증거 자료
                                </h4>
                                <div class="space-y-2">
                                    ${whistleblower.evidence.map((ev, idx) => `
                                        <div class="flex items-center p-3 bg-yellow-50 border border-yellow-200 rounded">
                                            <i class="fas fa-paperclip text-yellow-600 mr-2"></i>
                                            <span class="text-sm">${ev}</span>
                                        </div>
                                    `).join('')}
                                </div>
                            </div>
                            
                            <!-- 영향 범위 -->
                            <div class="bg-gradient-to-br from-red-50 to-orange-50 rounded-xl shadow-lg p-6 border-2 border-red-200">
                                <h4 class="text-lg font-bold mb-3 text-red-700">⚠️ 영향 분석</h4>
                                <div class="space-y-2 text-sm">
                                    <div class="flex items-start">
                                        <i class="fas fa-exclamation-circle text-red-500 mr-2 mt-1"></i>
                                        <div>
                                            <div class="font-semibold">구매 프로세스 신뢰도</div>
                                            <div class="text-gray-600">${whistleblower.impact}</div>
                                        </div>
                                    </div>
                                    <div class="flex items-start">
                                        <i class="fas fa-exclamation-circle text-red-500 mr-2 mt-1"></i>
                                        <div>
                                            <div class="font-semibold">내부 통제 시스템</div>
                                            <div class="text-gray-600">전사 점검 필요</div>
                                        </div>
                                    </div>
                                    <div class="flex items-start">
                                        <i class="fas fa-exclamation-circle text-red-500 mr-2 mt-1"></i>
                                        <div>
                                            <div class="font-semibold">외부 평판 리스크</div>
                                            <div class="text-gray-600">언론 보도 가능성</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <!-- 우측: 워크플로우 의사결정 -->
                        <div class="lg:col-span-2 space-y-6">
                            <!-- 단계 1: 초기 대응 -->
                            <div class="bg-white rounded-xl shadow-lg p-6" id="compliance-step-1">
                                <div class="flex items-center mb-4">
                                    <div class="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold mr-3">1</div>
                                    <div>
                                        <h4 class="text-xl font-bold">초기 대응 방향</h4>
                                        <p class="text-sm text-gray-600">제보 접수 후 즉각 조치</p>
                                    </div>
                                </div>
                                <select id="compliance-initial" class="w-full border-2 rounded-lg px-3 py-2 mb-3" onchange="updateComplianceDecision('initial')">
                                    <option value="">선택하세요</option>
                                    <option value="immediate">⚡ 즉시 조사 착수 (24시간 내)</option>
                                    <option value="committee">👥 윤리위원회 소집 (3일 소요)</option>
                                    <option value="external">🏢 외부 감사 의뢰 (1주 소요)</option>
                                    <option value="internal">🔍 내부 사전조사 (3일 소요)</option>
                                </select>
                                <textarea id="compliance-initial-note" placeholder="초기 대응 계획 및 근거" class="w-full border-2 rounded-lg px-3 py-2 text-sm" rows="3"></textarea>
                            </div>
                            
                            <!-- 단계 2: 대상자 조치 -->
                            <div class="bg-white rounded-xl shadow-lg p-6" id="compliance-step-2">
                                <div class="flex items-center mb-4">
                                    <div class="w-10 h-10 rounded-full bg-purple-500 text-white flex items-center justify-center font-bold mr-3">2</div>
                                    <div>
                                        <h4 class="text-xl font-bold">대상자 조치</h4>
                                        <p class="text-sm text-gray-600">김과장(재직 15년) 처우 결정</p>
                                    </div>
                                </div>
                                <select id="compliance-target" class="w-full border-2 rounded-lg px-3 py-2 mb-3" onchange="updateComplianceDecision('target')">
                                    <option value="">선택하세요</option>
                                    <option value="suspend">🚫 즉시 직위 해제 및 조사</option>
                                    <option value="transfer">🔀 타부서 임시 배치</option>
                                    <option value="continue">⏸️ 현 업무 유지하며 조사</option>
                                    <option value="leave">🏠 자택 대기 명령</option>
                                </select>
                                <textarea id="compliance-target-note" placeholder="인사 조치 사유 및 법적 검토 내용" class="w-full border-2 rounded-lg px-3 py-2 text-sm" rows="3"></textarea>
                            </div>
                            
                            <!-- 단계 3: 조사 범위 -->
                            <div class="bg-white rounded-xl shadow-lg p-6" id="compliance-step-3">
                                <div class="flex items-center mb-4">
                                    <div class="w-10 h-10 rounded-full bg-green-500 text-white flex items-center justify-center font-bold mr-3">3</div>
                                    <div>
                                        <h4 class="text-xl font-bold">조사 범위 설정</h4>
                                        <p class="text-sm text-gray-600">구매 프로세스 전반 점검</p>
                                    </div>
                                </div>
                                <div class="space-y-2 mb-3">
                                    <label class="flex items-center p-3 border-2 rounded-lg cursor-pointer hover:bg-gray-50">
                                        <input type="checkbox" class="mr-3" onchange="updateComplianceDecision('scope')">
                                        <span class="text-sm">📋 구매팀 전체 거래 내역 (최근 3년)</span>
                                    </label>
                                    <label class="flex items-center p-3 border-2 rounded-lg cursor-pointer hover:bg-gray-50">
                                        <input type="checkbox" class="mr-3" onchange="updateComplianceDecision('scope')">
                                        <span class="text-sm">👥 관련 협력업체 조사 (15개사)</span>
                                    </label>
                                    <label class="flex items-center p-3 border-2 rounded-lg cursor-pointer hover:bg-gray-50">
                                        <input type="checkbox" class="mr-3" onchange="updateComplianceDecision('scope')">
                                        <span class="text-sm">🏦 금융거래 추적 (계좌, 카드)</span>
                                    </label>
                                    <label class="flex items-center p-3 border-2 rounded-lg cursor-pointer hover:bg-gray-50">
                                        <input type="checkbox" class="mr-3" onchange="updateComplianceDecision('scope')">
                                        <span class="text-sm">📧 이메일 및 메신저 로그 분석</span>
                                    </label>
                                </div>
                                <textarea id="compliance-scope-note" placeholder="조사 우선순위 및 일정" class="w-full border-2 rounded-lg px-3 py-2 text-sm" rows="3"></textarea>
                            </div>
                            
                            <!-- 단계 4: 공개 및 보고 -->
                            <div class="bg-white rounded-xl shadow-lg p-6" id="compliance-step-4">
                                <div class="flex items-center mb-4">
                                    <div class="w-10 h-10 rounded-full bg-red-500 text-white flex items-center justify-center font-bold mr-3">4</div>
                                    <div>
                                        <h4 class="text-xl font-bold">공개 및 보고 전략</h4>
                                        <p class="text-sm text-gray-600">이사회, 언론, 직원 대상</p>
                                    </div>
                                </div>
                                <select id="compliance-disclosure" class="w-full border-2 rounded-lg px-3 py-2 mb-3" onchange="updateComplianceDecision('disclosure')">
                                    <option value="">선택하세요</option>
                                    <option value="full">📢 즉시 전사 공개 (투명성 강조)</option>
                                    <option value="board">🏛️ 이사회 보고 후 공개 (1주)</option>
                                    <option value="result">⏰ 조사 결과 후 공개 (1개월)</option>
                                    <option value="minimal">🤫 최소 공개 (관련자만)</option>
                                </select>
                                <textarea id="compliance-disclosure-note" placeholder="공개 범위, 메시지, 언론 대응 방안" class="w-full border-2 rounded-lg px-3 py-2 text-sm" rows="3"></textarea>
                            </div>
                            
                            <!-- 처리 요약 -->
                            <div class="bg-gradient-to-r from-slate-100 to-gray-100 rounded-xl shadow-lg p-6">
                                <h3 class="text-xl font-bold mb-4">📋 제보 처리 워크플로우</h3>
                                <div id="compliance-summary" class="space-y-3">
                                    <div class="text-gray-600 text-sm">각 단계의 의사결정을 완료해주세요</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    window.complianceDecisions = { initial: null, target: null, scope: null, disclosure: null };
}

function updateComplianceDecision(type) {
    if (type === 'scope') {
        // 체크박스는 별도 처리
        window.complianceDecisions.scope = 'checked';
    } else {
        const select = document.getElementById(`compliance-${type}`);
        const note = document.getElementById(`compliance-${type}-note`).value;
        
        if (select && select.value) {
            window.complianceDecisions[type] = {
                decision: select.options[select.selectedIndex].text,
                note: note
            };
        }
    }
    
    // 카드 색상
    const stepMap = { initial: 1, target: 2, scope: 3, disclosure: 4 };
    if (window.complianceDecisions[type]) {
        const card = document.getElementById(`compliance-step-${stepMap[type]}`);
        card.classList.add('border-2', 'border-green-500', 'bg-green-50');
    }
    
    updateComplianceSummary();
    updateComplianceProgress();
}

function updateComplianceSummary() {
    const summary = document.getElementById('compliance-summary');
    const decisions = window.complianceDecisions;
    
    let html = '';
    const labels = { initial: '1️⃣ 초기 대응', target: '2️⃣ 대상자 조치', scope: '3️⃣ 조사 범위', disclosure: '4️⃣ 공개 전략' };
    
    for (const [key, data] of Object.entries(decisions)) {
        if (data) {
            const text = typeof data === 'object' ? data.decision : '설정 완료';
            html += `<div class="flex items-start p-3 bg-white rounded-lg shadow"><i class="fas fa-check-circle text-green-600 mr-3 mt-1"></i><div><strong>${labels[key]}:</strong> ${text}</div></div>`;
        }
    }
    
    if (html === '') {
        html = '<div class="text-gray-600 text-sm">각 단계의 의사결정을 완료해주세요</div>';
    }
    
    summary.innerHTML = html;
}

function updateComplianceProgress() {
    const decisions = window.complianceDecisions;
    const completed = Object.values(decisions).filter(d => d !== null).length;
    const percentage = Math.round((completed / totalTasks) * 100);
    
    document.getElementById('compliance-progress-text').textContent = `${percentage}%`;
    document.getElementById('progress-text').textContent = `${percentage}%`;
}
// 전략 기획 시뮬레이션 - M&A 의사결정 매트릭스
function renderStrategyBoard(question) {
    const content = document.getElementById('simulation-content');
    
    const deal = {
        target: 'XYZ 테크놀로지',
        price: 1500,
        revenue: 300,
        profit: 45,
        employees: 250,
        tech: ['AI 엔진', '클라우드 플랫폼', '빅데이터 분석'],
        marketShare: { current: 12, after: 28 },
        synergy: 200,
        deadline: '72시간'
    };
    
    totalTasks = 5;
    
    content.innerHTML = `
        <div class="h-screen bg-gradient-to-br from-indigo-50 to-purple-100 flex flex-col">
            <div class="bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg">
                <div class="px-6 py-4">
                    <div class="flex items-center justify-between">
                        <div class="flex items-center space-x-4">
                            <i class="fas fa-chess-king text-3xl"></i>
                            <div>
                                <div class="text-2xl font-bold">전략 M&A 의사결정 시스템</div>
                                <div class="text-sm opacity-90 mt-1">🎯 ${deal.target} 인수 제안 - ${deal.deadline} 내 결정</div>
                            </div>
                        </div>
                        <div class="text-right">
                            <div class="text-sm opacity-75">평가 완료율</div>
                            <div class="text-3xl font-bold" id="strategy-progress-text">0%</div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="flex-1 p-6 overflow-y-auto">
                <div class="max-w-7xl mx-auto">
                    <!-- 딜 개요 -->
                    <div class="bg-white rounded-xl shadow-lg p-6 mb-6">
                        <h3 class="text-2xl font-bold mb-4 flex items-center">
                            <i class="fas fa-building text-indigo-600 mr-3"></i>
                            ${deal.target} 인수 개요
                        </h3>
                        <div class="grid grid-cols-5 gap-4">
                            <div class="text-center p-4 bg-indigo-50 rounded-lg">
                                <div class="text-3xl font-bold text-indigo-600">${deal.price.toLocaleString()}</div>
                                <div class="text-sm text-gray-600">인수가 (억원)</div>
                            </div>
                            <div class="text-center p-4 bg-blue-50 rounded-lg">
                                <div class="text-3xl font-bold text-blue-600">${deal.revenue.toLocaleString()}</div>
                                <div class="text-sm text-gray-600">연매출 (억원)</div>
                            </div>
                            <div class="text-center p-4 bg-green-50 rounded-lg">
                                <div class="text-3xl font-bold text-green-600">${deal.profit.toLocaleString()}</div>
                                <div class="text-sm text-gray-600">영업이익 (억원)</div>
                            </div>
                            <div class="text-center p-4 bg-purple-50 rounded-lg">
                                <div class="text-3xl font-bold text-purple-600">${deal.employees}</div>
                                <div class="text-sm text-gray-600">직원 수 (명)</div>
                            </div>
                            <div class="text-center p-4 bg-orange-50 rounded-lg">
                                <div class="text-2xl font-bold text-orange-600">${deal.marketShare.current}% → ${deal.marketShare.after}%</div>
                                <div class="text-sm text-gray-600">시장점유율</div>
                            </div>
                        </div>
                        <div class="mt-4 p-4 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg">
                            <div class="font-semibold mb-2">🎯 핵심 기술 자산</div>
                            <div class="flex flex-wrap gap-2">
                                ${deal.tech.map(t => `<span class="px-3 py-1 bg-white rounded-full text-sm font-medium">${t}</span>`).join('')}
                            </div>
                            <div class="mt-3 text-sm">
                                <span class="font-semibold">예상 시너지:</span>
                                <span class="text-green-600 font-bold ml-2">연 ${deal.synergy}억원</span>
                            </div>
                        </div>
                    </div>
                    
                    <!-- 의사결정 매트릭스 -->
                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <!-- 1. 재무적 타당성 -->
                        <div class="bg-white rounded-xl shadow-lg p-6" id="strategy-decision-1">
                            <div class="flex items-center mb-4">
                                <span class="text-3xl mr-3">💰</span>
                                <div>
                                    <h4 class="text-xl font-bold">1. 재무적 타당성</h4>
                                    <p class="text-sm text-gray-600">Price/Revenue 5.0배, ROI 분석</p>
                                </div>
                            </div>
                            <div class="space-y-3 mb-3">
                                <div class="flex items-center justify-between p-3 bg-gray-50 rounded">
                                    <span class="text-sm">인수가/매출 비율</span>
                                    <span class="font-bold">5.0x</span>
                                </div>
                                <div class="flex items-center justify-between p-3 bg-gray-50 rounded">
                                    <span class="text-sm">회수 예상 기간</span>
                                    <span class="font-bold">7.5년</span>
                                </div>
                            </div>
                            <select id="strategy-finance" class="w-full border-2 rounded-lg px-3 py-2 mb-2" onchange="updateStrategyDecision('finance')">
                                <option value="">평가 선택</option>
                                <option value="excellent">⭐ 매우 적정</option>
                                <option value="acceptable">✅ 수용 가능</option>
                                <option value="risky">⚠️ 위험 높음</option>
                                <option value="unacceptable">❌ 부적정</option>
                            </select>
                            <textarea id="strategy-finance-note" placeholder="재무 분석 근거" class="w-full border-2 rounded-lg px-3 py-2 text-sm" rows="3"></textarea>
                        </div>
                        
                        <!-- 2. 전략적 적합성 -->
                        <div class="bg-white rounded-xl shadow-lg p-6" id="strategy-decision-2">
                            <div class="flex items-center mb-4">
                                <span class="text-3xl mr-3">🎯</span>
                                <div>
                                    <h4 class="text-xl font-bold">2. 전략적 적합성</h4>
                                    <p class="text-sm text-gray-600">사업 포트폴리오 및 시너지</p>
                                </div>
                            </div>
                            <div class="space-y-2 mb-3">
                                <label class="flex items-center p-2 border rounded cursor-pointer hover:bg-gray-50">
                                    <input type="checkbox" class="mr-2" onchange="updateStrategyDecision('strategy')">
                                    <span class="text-sm">시장 지배력 강화 (12%→28%)</span>
                                </label>
                                <label class="flex items-center p-2 border rounded cursor-pointer hover:bg-gray-50">
                                    <input type="checkbox" class="mr-2" onchange="updateStrategyDecision('strategy')">
                                    <span class="text-sm">기술 역량 보완 (AI, 빅데이터)</span>
                                </label>
                                <label class="flex items-center p-2 border rounded cursor-pointer hover:bg-gray-50">
                                    <input type="checkbox" class="mr-2" onchange="updateStrategyDecision('strategy')">
                                    <span class="text-sm">신규 고객층 확보</span>
                                </label>
                            </div>
                            <select id="strategy-fit" class="w-full border-2 rounded-lg px-3 py-2 mb-2" onchange="updateStrategyDecision('strategy')">
                                <option value="">평가 선택</option>
                                <option value="high">🔥 시너지 높음</option>
                                <option value="medium">⚖️ 보통</option>
                                <option value="low">❄️ 시너지 낮음</option>
                            </select>
                            <textarea id="strategy-fit-note" placeholder="전략적 가치 분석" class="w-full border-2 rounded-lg px-3 py-2 text-sm" rows="3"></textarea>
                        </div>
                        
                        <!-- 3. 실사(DD) 리스크 -->
                        <div class="bg-white rounded-xl shadow-lg p-6" id="strategy-decision-3">
                            <div class="flex items-center mb-4">
                                <span class="text-3xl mr-3">🔍</span>
                                <div>
                                    <h4 class="text-xl font-bold">3. 실사(DD) 리스크</h4>
                                    <p class="text-sm text-gray-600">72시간 내 결정, 실사 시간 부족</p>
                                </div>
                            </div>
                            <div class="bg-red-50 border-l-4 border-red-400 p-3 mb-3">
                                <div class="text-sm font-semibold text-red-700">⚠️ 리스크 요인</div>
                                <ul class="text-xs text-red-600 mt-1 space-y-1">
                                    <li>• 재무제표 정밀 분석 불가</li>
                                    <li>• 법률 리스크 미확인</li>
                                    <li>• 핵심 인력 유출 가능성</li>
                                    <li>• 기술 자산 가치 검증 미흡</li>
                                </ul>
                            </div>
                            <select id="strategy-risk" class="w-full border-2 rounded-lg px-3 py-2 mb-2" onchange="updateStrategyDecision('risk')">
                                <option value="">리스크 평가</option>
                                <option value="proceed">✅ 감수 가능, 진행</option>
                                <option value="condition">⚠️ 조건부 진행 (보증 요구)</option>
                                <option value="extend">⏰ 실사 기간 연장 요청</option>
                                <option value="abort">❌ 리스크 과다, 중단</option>
                            </select>
                            <textarea id="strategy-risk-note" placeholder="리스크 대응 방안" class="w-full border-2 rounded-lg px-3 py-2 text-sm" rows="3"></textarea>
                        </div>
                        
                        <!-- 4. 통합(PMI) 계획 -->
                        <div class="bg-white rounded-xl shadow-lg p-6" id="strategy-decision-4">
                            <div class="flex items-center mb-4">
                                <span class="text-3xl mr-3">🔗</span>
                                <div>
                                    <h4 class="text-xl font-bold">4. 통합(PMI) 전략</h4>
                                    <p class="text-sm text-gray-600">인수 후 조직·시스템 통합</p>
                                </div>
                            </div>
                            <select id="strategy-pmi" class="w-full border-2 rounded-lg px-3 py-2 mb-2" onchange="updateStrategyDecision('pmi')">
                                <option value="">통합 방식 선택</option>
                                <option value="full">🏢 완전 통합 (6개월)</option>
                                <option value="gradual">⏰ 단계적 통합 (1년)</option>
                                <option value="independent">🔀 독립 운영 (자회사)</option>
                                <option value="hybrid">⚖️ 혼합형 (핵심만 통합)</option>
                            </select>
                            <div class="mb-2">
                                <label class="text-sm font-semibold block mb-2">통합 예산 (억원)</label>
                                <input type="number" id="strategy-pmi-budget" class="w-full border-2 rounded-lg px-3 py-2" 
                                       min="0" max="500" value="0" onchange="updateStrategyDecision('pmi')">
                            </div>
                            <textarea id="strategy-pmi-note" placeholder="PMI 실행 로드맵" class="w-full border-2 rounded-lg px-3 py-2 text-sm" rows="3"></textarea>
                        </div>
                        
                        <!-- 5. 최종 결정 -->
                        <div class="lg:col-span-2">
                            <div class="bg-gradient-to-br from-indigo-600 to-purple-600 text-white rounded-xl shadow-lg p-6" id="strategy-decision-5">
                                <div class="flex items-center mb-4">
                                    <span class="text-4xl mr-3">⚖️</span>
                                    <div>
                                        <h4 class="text-2xl font-bold">5. 최종 의사결정</h4>
                                        <p class="text-sm opacity-90">이사회 보고 및 실행 여부</p>
                                    </div>
                                </div>
                                <select id="strategy-final" class="w-full border-2 rounded-lg px-3 py-2 mb-3 text-gray-900" onchange="updateStrategyDecision('final')">
                                    <option value="">최종 결정 선택</option>
                                    <option value="approve">✅ 인수 추진 승인</option>
                                    <option value="negotiate">💬 재협상 요청 (가격, 조건)</option>
                                    <option value="defer">⏳ 실사 후 재검토 (1개월)</option>
                                    <option value="reject">❌ 인수 포기</option>
                                </select>
                                <textarea id="strategy-final-note" placeholder="최종 결정 사유 및 이사회 보고 메시지" class="w-full border-2 rounded-lg px-3 py-2 text-sm text-gray-900" rows="4"></textarea>
                            </div>
                        </div>
                    </div>
                    
                    <!-- 의사결정 요약 -->
                    <div class="bg-white rounded-xl shadow-lg p-6 mt-6">
                        <h3 class="text-xl font-bold mb-4">📊 M&A 의사결정 매트릭스</h3>
                        <div id="strategy-summary" class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div class="text-sm text-gray-600">각 항목의 평가를 완료해주세요</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    window.strategyDecisions = { finance: null, strategy: null, risk: null, pmi: null, final: null };
}

function updateStrategyDecision(type) {
    if (type === 'strategy') {
        // 체크박스와 셀렉트 통합 처리
        const fit = document.getElementById('strategy-fit');
        if (fit && fit.value) {
            window.strategyDecisions.strategy = {
                decision: fit.options[fit.selectedIndex].text,
                note: document.getElementById('strategy-fit-note').value
            };
        }
    } else if (type === 'pmi') {
        const pmi = document.getElementById('strategy-pmi');
        const budget = document.getElementById('strategy-pmi-budget').value;
        if (pmi && pmi.value) {
            window.strategyDecisions.pmi = {
                decision: pmi.options[pmi.selectedIndex].text,
                budget: budget,
                note: document.getElementById('strategy-pmi-note').value
            };
        }
    } else {
        const select = document.getElementById(`strategy-${type}`);
        const note = document.getElementById(`strategy-${type}-note`).value;
        
        if (select && select.value) {
            window.strategyDecisions[type] = {
                decision: select.options[select.selectedIndex].text,
                note: note
            };
        }
    }
    
    // 카드 색상
    const cardMap = { finance: 1, strategy: 2, risk: 3, pmi: 4, final: 5 };
    if (window.strategyDecisions[type]) {
        const card = document.getElementById(`strategy-decision-${cardMap[type]}`);
        if (card) card.classList.add('border-2', 'border-yellow-300', 'bg-yellow-50');
    }
    
    updateStrategySummary();
    updateStrategyProgress();
}

function updateStrategySummary() {
    const summary = document.getElementById('strategy-summary');
    const decisions = window.strategyDecisions;
    
    let html = '';
    const labels = {
        finance: '💰 재무 타당성',
        strategy: '🎯 전략 적합성',
        risk: '🔍 실사 리스크',
        pmi: '🔗 통합 전략',
        final: '⚖️ 최종 결정'
    };
    
    for (const [key, data] of Object.entries(decisions)) {
        if (data) {
            html += `
                <div class="p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg border border-indigo-200">
                    <div class="font-bold text-indigo-700">${labels[key]}</div>
                    <div class="text-sm mt-1">${data.decision}</div>
                    ${data.budget ? `<div class="text-xs text-purple-600 mt-1">예산: ${data.budget}억원</div>` : ''}
                </div>
            `;
        }
    }
    
    if (html === '') {
        html = '<div class="text-sm text-gray-600">각 항목의 평가를 완료해주세요</div>';
    }
    
    summary.innerHTML = html;
}

function updateStrategyProgress() {
    const decisions = window.strategyDecisions;
    const completed = Object.values(decisions).filter(d => d !== null).length;
    const percentage = Math.round((completed / totalTasks) * 100);
    
    document.getElementById('strategy-progress-text').textContent = `${percentage}%`;
    document.getElementById('progress-text').textContent = `${percentage}%`;
}

// 마케팅 캠페인 대시보드 시뮬레이션
function renderCampaignDashboard(question) {
    const content = document.getElementById('simulation-content');
    
    const campaigns = [
        {
            id: 1,
            name: 'SNS 인플루언서 캠페인',
            budget: 5000,
            spent: 4200,
            spentPercent: 84,
            views: 2500000,
            viewsTarget: 5000000,
            conversion: 0.8,
            conversionTarget: 2.0,
            daysLeft: 14,
            status: 'warning', // warning, success, danger
            icon: '📱'
        },
        {
            id: 2,
            name: '온라인 광고 캠페인',
            budget: 8000,
            spent: 7800,
            spentPercent: 97.5,
            clicks: 120000,
            clicksTarget: 150000,
            conversion: 3.2,
            conversionTarget: 3.0,
            daysLeft: 7,
            status: 'success',
            icon: '💻'
        },
        {
            id: 3,
            name: '오프라인 이벤트',
            budget: 3000,
            spent: 1500,
            spentPercent: 50,
            participants: 800,
            participantsTarget: 2000,
            conversion: 0,
            conversionTarget: 0,
            daysLeft: 21,
            status: 'danger',
            icon: '🎪'
        },
        {
            id: 4,
            name: '이메일 마케팅',
            budget: 1000,
            spent: 600,
            spentPercent: 60,
            openRate: 25,
            openRateTarget: 20,
            conversion: 4.0,
            conversionTarget: 3.0,
            daysLeft: 14,
            status: 'success',
            icon: '📧'
        }
    ];
    
    totalTasks = campaigns.length;
    
    const availableBudget = 1200; // 가용 예산
    const requestedBudget = 2000; // 영업팀 요청
    
    content.innerHTML = `
        <div class="h-screen bg-gradient-to-br from-pink-50 to-purple-50 flex flex-col">
            <!-- 대시보드 헤더 -->
            <div class="bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-lg">
                <div class="px-6 py-4">
                    <div class="flex items-center justify-between">
                        <div class="flex items-center space-x-4">
                            <i class="fas fa-bullhorn text-3xl"></i>
                            <div>
                                <div class="text-2xl font-bold">마케팅 캠페인 관리 대시보드</div>
                                <div class="text-sm opacity-90 mt-1">📊 ${campaigns.length}개 캠페인 성과 분석 및 예산 조정</div>
                            </div>
                        </div>
                        <div class="text-right">
                            <div class="text-sm opacity-75">결정 완료율</div>
                            <div class="text-3xl font-bold" id="campaign-progress-text">0%</div>
                        </div>
                    </div>
                </div>
                <div class="px-6 pb-2">
                    <div class="w-full bg-white bg-opacity-30 rounded-full h-2">
                        <div id="campaign-progress-bar" class="bg-white h-2 rounded-full transition-all duration-300" style="width: 0%"></div>
                    </div>
                </div>
            </div>
            
            <div class="flex-1 flex overflow-hidden">
                <!-- 메인 컨텐츠 -->
                <div class="flex-1 p-6 overflow-y-auto">
                    <div class="max-w-7xl mx-auto">
                        <!-- 예산 현황 카드 -->
                        <div class="bg-white rounded-xl shadow-lg p-6 mb-6">
                            <h3 class="text-xl font-bold mb-4 flex items-center">
                                <i class="fas fa-wallet text-green-600 mr-2"></i>
                                예산 현황
                            </h3>
                            <div class="grid grid-cols-4 gap-4">
                                <div class="text-center p-4 bg-blue-50 rounded-lg">
                                    <div class="text-2xl font-bold text-blue-600">${campaigns.reduce((sum, c) => sum + c.budget, 0).toLocaleString()}</div>
                                    <div class="text-sm text-gray-600 mt-1">총 예산 (만원)</div>
                                </div>
                                <div class="text-center p-4 bg-purple-50 rounded-lg">
                                    <div class="text-2xl font-bold text-purple-600">${campaigns.reduce((sum, c) => sum + c.spent, 0).toLocaleString()}</div>
                                    <div class="text-sm text-gray-600 mt-1">집행액 (만원)</div>
                                </div>
                                <div class="text-center p-4 bg-green-50 rounded-lg">
                                    <div class="text-2xl font-bold text-green-600">${availableBudget.toLocaleString()}</div>
                                    <div class="text-sm text-gray-600 mt-1">가용 예산 (만원)</div>
                                </div>
                                <div class="text-center p-4 bg-orange-50 rounded-lg">
                                    <div class="text-2xl font-bold text-orange-600">${requestedBudget.toLocaleString()}</div>
                                    <div class="text-sm text-gray-600 mt-1">추가 요청 (만원)</div>
                                </div>
                            </div>
                        </div>
                        
                        <!-- 캠페인 카드 그리드 -->
                        <h3 class="text-xl font-bold mb-4 flex items-center">
                            <i class="fas fa-chart-line text-purple-600 mr-2"></i>
                            캠페인별 성과 분석
                        </h3>
                        
                        <div class="grid grid-cols-2 gap-6">
                            ${campaigns.map(camp => {
                                const statusColors = {
                                    success: { bg: 'bg-green-50', border: 'border-green-200', badge: 'bg-green-100 text-green-700', icon: '✓' },
                                    warning: { bg: 'bg-yellow-50', border: 'border-yellow-200', badge: 'bg-yellow-100 text-yellow-700', icon: '⚠' },
                                    danger: { bg: 'bg-red-50', border: 'border-red-200', badge: 'bg-red-100 text-red-700', icon: '⚠' }
                                };
                                const style = statusColors[camp.status];
                                
                                return `
                                <div class="bg-white border-2 ${style.border} ${style.bg} rounded-xl p-6 transition-all" id="campaign-card-${camp.id}">
                                    <div class="flex items-start justify-between mb-4">
                                        <div class="flex items-center">
                                            <span class="text-3xl mr-3">${camp.icon}</span>
                                            <div>
                                                <h4 class="text-lg font-bold text-gray-800">${camp.name}</h4>
                                                <span class="text-xs px-2 py-1 rounded-full ${style.badge} font-semibold">
                                                    ${style.icon} ${camp.daysLeft}일 남음
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <!-- 예산 진행률 -->
                                    <div class="mb-4">
                                        <div class="flex justify-between text-sm mb-1">
                                            <span class="font-semibold">예산 집행률</span>
                                            <span class="font-bold text-purple-600">${camp.spentPercent}%</span>
                                        </div>
                                        <div class="w-full bg-gray-200 rounded-full h-3">
                                            <div class="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full" style="width: ${camp.spentPercent}%"></div>
                                        </div>
                                        <div class="flex justify-between text-xs text-gray-600 mt-1">
                                            <span>집행: ${camp.spent.toLocaleString()}만원</span>
                                            <span>총액: ${camp.budget.toLocaleString()}만원</span>
                                        </div>
                                    </div>
                                    
                                    <!-- 성과 지표 -->
                                    <div class="grid grid-cols-2 gap-3 mb-4">
                                        ${camp.views !== undefined ? `
                                            <div class="bg-white rounded-lg p-3 border">
                                                <div class="text-xs text-gray-600 mb-1">조회수</div>
                                                <div class="font-bold text-lg">${(camp.views / 10000).toFixed(0)}만</div>
                                                <div class="text-xs ${camp.views >= camp.viewsTarget ? 'text-green-600' : 'text-red-600'}">
                                                    목표: ${(camp.viewsTarget / 10000).toFixed(0)}만 (${Math.round(camp.views / camp.viewsTarget * 100)}%)
                                                </div>
                                            </div>
                                        ` : ''}
                                        ${camp.clicks !== undefined ? `
                                            <div class="bg-white rounded-lg p-3 border">
                                                <div class="text-xs text-gray-600 mb-1">클릭수</div>
                                                <div class="font-bold text-lg">${(camp.clicks / 10000).toFixed(0)}만</div>
                                                <div class="text-xs ${camp.clicks >= camp.clicksTarget ? 'text-green-600' : 'text-red-600'}">
                                                    목표: ${(camp.clicksTarget / 10000).toFixed(0)}만 (${Math.round(camp.clicks / camp.clicksTarget * 100)}%)
                                                </div>
                                            </div>
                                        ` : ''}
                                        ${camp.participants !== undefined ? `
                                            <div class="bg-white rounded-lg p-3 border">
                                                <div class="text-xs text-gray-600 mb-1">참여자</div>
                                                <div class="font-bold text-lg">${camp.participants}</div>
                                                <div class="text-xs ${camp.participants >= camp.participantsTarget ? 'text-green-600' : 'text-red-600'}">
                                                    목표: ${camp.participantsTarget} (${Math.round(camp.participants / camp.participantsTarget * 100)}%)
                                                </div>
                                            </div>
                                        ` : ''}
                                        ${camp.openRate !== undefined ? `
                                            <div class="bg-white rounded-lg p-3 border">
                                                <div class="text-xs text-gray-600 mb-1">오픈율</div>
                                                <div class="font-bold text-lg">${camp.openRate}%</div>
                                                <div class="text-xs ${camp.openRate >= camp.openRateTarget ? 'text-green-600' : 'text-red-600'}">
                                                    목표: ${camp.openRateTarget}%
                                                </div>
                                            </div>
                                        ` : ''}
                                        ${camp.conversion > 0 ? `
                                            <div class="bg-white rounded-lg p-3 border">
                                                <div class="text-xs text-gray-600 mb-1">전환율</div>
                                                <div class="font-bold text-lg">${camp.conversion}%</div>
                                                <div class="text-xs ${camp.conversion >= camp.conversionTarget ? 'text-green-600' : 'text-red-600'}">
                                                    목표: ${camp.conversionTarget}%
                                                </div>
                                            </div>
                                        ` : ''}
                                    </div>
                                    
                                    <!-- 의사결정 영역 -->
                                    <div id="decision-area-${camp.id}">
                                        <div class="text-sm font-semibold mb-3 text-gray-700">캠페인 조정 결정</div>
                                        <div class="space-y-2">
                                            <select id="action-${camp.id}" class="w-full border-2 rounded-lg px-3 py-2 text-sm focus:border-purple-500 focus:outline-none" onchange="updateCampaignDecision(${camp.id})">
                                                <option value="">조치 선택</option>
                                                <option value="계속">✅ 현재 계획 계속 진행</option>
                                                <option value="확대">📈 예산 확대 및 강화</option>
                                                <option value="축소">📉 예산 축소 및 최적화</option>
                                                <option value="중단">❌ 조기 중단 및 예산 회수</option>
                                            </select>
                                            
                                            <div id="budget-input-${camp.id}" class="hidden">
                                                <label class="text-xs font-semibold text-gray-700 mb-1 block">예산 조정액 (만원)</label>
                                                <input type="number" id="budget-amount-${camp.id}" class="w-full border-2 rounded-lg px-3 py-2 text-sm" placeholder="예: 500" onchange="updateCampaignDecision(${camp.id})">
                                            </div>
                                            
                                            <textarea id="note-${camp.id}" class="w-full border-2 rounded-lg px-3 py-2 text-sm focus:border-purple-500 focus:outline-none" rows="2" placeholder="결정 근거 및 개선 방안..."></textarea>
                                            
                                            <button class="w-full py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all disabled:opacity-50" 
                                                    id="complete-btn-${camp.id}" onclick="completeCampaignDecision(${camp.id})" disabled>
                                                <i class="fas fa-check mr-2"></i>결정 완료
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            `;
                            }).join('')}
                        </div>
                    </div>
                </div>
                
                <!-- 오른쪽: 결정 요약 -->
                <div class="w-80 bg-white border-l overflow-y-auto">
                    <div class="p-5">
                        <h3 class="font-bold text-lg mb-4 flex items-center">
                            <i class="fas fa-clipboard-list text-purple-600 mr-2"></i>
                            결정 요약
                        </h3>
                        
                        <div id="budget-summary" class="mb-6 p-4 bg-purple-50 rounded-lg">
                            <div class="text-sm font-semibold text-purple-900 mb-2">💰 예산 현황</div>
                            <div class="space-y-2 text-xs">
                                <div class="flex justify-between">
                                    <span>가용 예산:</span>
                                    <span class="font-bold">${availableBudget.toLocaleString()}만원</span>
                                </div>
                                <div class="flex justify-between">
                                    <span>할당 예산:</span>
                                    <span class="font-bold text-purple-600" id="allocated-budget">0만원</span>
                                </div>
                                <div class="flex justify-between border-t pt-2">
                                    <span>잔액:</span>
                                    <span class="font-bold text-green-600" id="remaining-budget">${availableBudget.toLocaleString()}만원</span>
                                </div>
                            </div>
                        </div>
                        
                        <div id="decision-summary" class="space-y-3 mb-6">
                            <div class="p-4 bg-gray-50 rounded-lg text-center text-gray-500 text-sm">
                                아직 결정된 캠페인이 없습니다
                            </div>
                        </div>
                        
                        <div class="p-4 bg-pink-50 rounded-lg">
                            <div class="text-sm font-semibold text-pink-900 mb-2">💡 평가 기준</div>
                            <ul class="text-xs text-pink-800 space-y-1">
                                <li>• ROI (투자 대비 수익률)</li>
                                <li>• 목표 달성률 및 진행도</li>
                                <li>• 전환율 및 성과 지표</li>
                                <li>• 남은 기간 대비 가능성</li>
                                <li>• 예산 효율성</li>
                            </ul>
                        </div>
                        
                        <button class="w-full mt-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all" 
                                onclick="completeSimulation()">
                            <i class="fas fa-check mr-2"></i>완료하고 다음 단계로
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    window.campaignDecisions = {};
    window.availableBudget = availableBudget;
}

function updateCampaignDecision(campaignId) {
    const action = document.getElementById(`action-${campaignId}`)?.value;
    const note = document.getElementById(`note-${campaignId}`)?.value;
    const budgetInput = document.getElementById(`budget-input-${campaignId}`);
    const budgetAmount = document.getElementById(`budget-amount-${campaignId}`)?.value || 0;
    
    // 예산 입력 필드 표시/숨김
    if (action === '확대' || action === '축소') {
        if (budgetInput) budgetInput.classList.remove('hidden');
    } else {
        if (budgetInput) budgetInput.classList.add('hidden');
    }
    
    if (!window.campaignDecisions[campaignId]) {
        window.campaignDecisions[campaignId] = {};
    }
    
    window.campaignDecisions[campaignId].action = action;
    window.campaignDecisions[campaignId].note = note;
    window.campaignDecisions[campaignId].budget = parseFloat(budgetAmount) || 0;
    
    // 완료 버튼 활성화
    const completeBtn = document.getElementById(`complete-btn-${campaignId}`);
    if (action && completeBtn) {
        completeBtn.disabled = false;
        completeBtn.classList.remove('opacity-50');
    }
}

function completeCampaignDecision(campaignId) {
    const decision = window.campaignDecisions[campaignId];
    if (!decision || !decision.action) {
        alert('조치를 선택해주세요.');
        return;
    }
    
    decision.complete = true;
    
    // UI 업데이트
    const decisionArea = document.getElementById(`decision-area-${campaignId}`);
    const card = document.getElementById(`campaign-card-${campaignId}`);
    
    if (decisionArea && card) {
        card.classList.add('border-green-500', 'bg-green-50');
        
        decisionArea.innerHTML = `
            <div class="bg-green-100 border-2 border-green-500 rounded-lg p-4">
                <div class="flex items-center mb-2">
                    <i class="fas fa-check-circle text-green-600 text-2xl mr-2"></i>
                    <span class="font-bold text-green-800">결정 완료</span>
                </div>
                <div class="text-sm space-y-1">
                    <div><strong>조치:</strong> ${decision.action}</div>
                    ${decision.budget > 0 ? `<div><strong>예산 조정:</strong> ${decision.action === '확대' ? '+' : '-'}${decision.budget.toLocaleString()}만원</div>` : ''}
                    ${decision.note ? `<div><strong>근거:</strong> ${decision.note}</div>` : ''}
                </div>
            </div>
        `;
    }
    
    updateCampaignProgress();
    updateBudgetSummary();
}

function updateCampaignProgress() {
    const completed = Object.values(window.campaignDecisions).filter(d => d.complete).length;
    const total = totalTasks;
    const percentage = Math.round((completed / total) * 100);
    
    const progressBar = document.getElementById('campaign-progress-bar');
    const progressText = document.getElementById('campaign-progress-text');
    
    if (progressBar) progressBar.style.width = `${percentage}%`;
    if (progressText) progressText.textContent = `${percentage}%`;
    
    const mainProgressBar = document.getElementById('progress-bar');
    const mainProgressText = document.getElementById('progress-text');
    if (mainProgressBar) mainProgressBar.style.width = `${percentage}%`;
    if (mainProgressText) mainProgressText.textContent = `${percentage}%`;
}

function updateBudgetSummary() {
    const decisions = Object.values(window.campaignDecisions).filter(d => d.complete);
    
    let totalAllocated = 0;
    decisions.forEach(d => {
        if (d.action === '확대') totalAllocated += d.budget;
        if (d.action === '축소') totalAllocated -= d.budget;
    });
    
    const remaining = window.availableBudget - totalAllocated;
    
    const allocatedEl = document.getElementById('allocated-budget');
    const remainingEl = document.getElementById('remaining-budget');
    
    if (allocatedEl) allocatedEl.textContent = `${totalAllocated.toLocaleString()}만원`;
    if (remainingEl) {
        remainingEl.textContent = `${remaining.toLocaleString()}만원`;
        remainingEl.className = remaining >= 0 ? 'font-bold text-green-600' : 'font-bold text-red-600';
    }
    
    // 결정 요약 업데이트
    const summaryEl = document.getElementById('decision-summary');
    if (summaryEl && decisions.length > 0) {
        summaryEl.innerHTML = decisions.map((d, idx) => `
            <div class="p-3 bg-green-50 border border-green-200 rounded-lg">
                <div class="font-semibold text-sm">캠페인 ${idx + 1}</div>
                <div class="text-xs text-gray-700 mt-1">
                    <div>조치: ${d.action}</div>
                    ${d.budget > 0 ? `<div>예산: ${d.action === '확대' ? '+' : '-'}${d.budget.toLocaleString()}만원</div>` : ''}
                </div>
            </div>
        `).join('');
    }
}

// 생산 라인 관리 시뮬레이션
function renderProductionControl(question) {
    const content = document.getElementById('simulation-content');
    
    const lines = [
        {
            id: 1,
            name: 'A제품 생산',
            product: 'A',
            status: 'normal',
            uptime: 98,
            daily: 1200,
            target: 1000,
            defectRate: 0.5,
            defectLimit: 1.0,
            delivery: '3일 후',
            deliveryAmount: 5000,
            icon: '🟢'
        },
        {
            id: 2,
            name: 'B제품 생산',
            product: 'B',
            status: 'emergency',
            uptime: 0,
            daily: 0,
            target: 1000,
            defectRate: 15,
            defectLimit: 1.0,
            delivery: '5일 후',
            deliveryAmount: 10000,
            currentStock: 2000,
            lossPerDay: 8000,
            icon: '🔴'
        },
        {
            id: 3,
            name: 'C제품 생산',
            product: 'C',
            status: 'warning',
            uptime: 70,
            daily: 700,
            target: 1000,
            defectRate: 3,
            defectLimit: 1.0,
            equipmentCost: 30000,
            equipmentTime: '2주',
            icon: '🟡'
        },
        {
            id: 4,
            name: 'D제품 생산 (신규)',
            product: 'D',
            status: 'testing',
            uptime: 60,
            daily: 300,
            target: 500,
            defectRate: 8,
            defectLimit: 10,
            launchDate: '1주 후',
            icon: '🔵'
        }
    ];
    
    totalTasks = lines.length;
    
    content.innerHTML = `
        <div class="h-screen bg-gradient-to-br from-gray-100 to-blue-50 flex flex-col">
            <!-- 헤더 -->
            <div class="bg-gradient-to-r from-gray-800 to-blue-900 text-white shadow-lg">
                <div class="px-6 py-4">
                    <div class="flex items-center justify-between">
                        <div class="flex items-center space-x-4">
                            <i class="fas fa-industry text-3xl"></i>
                            <div>
                                <div class="text-2xl font-bold">생산 라인 관리 시스템</div>
                                <div class="text-sm opacity-90 mt-1">🚨 라인 2 긴급 중단 - 즉각 대응 필요</div>
                            </div>
                        </div>
                        <div class="text-right">
                            <div class="text-sm opacity-75">대응 완료율</div>
                            <div class="text-3xl font-bold" id="production-progress-text">0%</div>
                        </div>
                    </div>
                </div>
                <div class="px-6 pb-2">
                    <div class="w-full bg-white bg-opacity-30 rounded-full h-2">
                        <div id="production-progress-bar" class="bg-white h-2 rounded-full transition-all duration-300" style="width: 0%"></div>
                    </div>
                </div>
            </div>
            
            <div class="flex-1 flex overflow-hidden">
                <!-- 메인 영역 -->
                <div class="flex-1 p-6 overflow-y-auto">
                    <div class="max-w-7xl mx-auto">
                        <!-- 전체 현황 -->
                        <div class="bg-white rounded-xl shadow-lg p-6 mb-6">
                            <h3 class="text-xl font-bold mb-4 flex items-center">
                                <i class="fas fa-tachometer-alt text-blue-600 mr-2"></i>
                                실시간 생산 현황
                            </h3>
                            <div class="grid grid-cols-4 gap-4">
                                <div class="text-center p-4 bg-green-50 rounded-lg">
                                    <div class="text-3xl font-bold text-green-600">1 / 4</div>
                                    <div class="text-sm text-gray-600 mt-1">정상 가동</div>
                                </div>
                                <div class="text-center p-4 bg-yellow-50 rounded-lg">
                                    <div class="text-3xl font-bold text-yellow-600">1 / 4</div>
                                    <div class="text-sm text-gray-600 mt-1">주의</div>
                                </div>
                                <div class="text-center p-4 bg-red-50 rounded-lg">
                                    <div class="text-3xl font-bold text-red-600">1 / 4</div>
                                    <div class="text-sm text-gray-600 mt-1">긴급 중단</div>
                                </div>
                                <div class="text-center p-4 bg-blue-50 rounded-lg">
                                    <div class="text-3xl font-bold text-blue-600">1 / 4</div>
                                    <div class="text-sm text-gray-600 mt-1">시험 생산</div>
                                </div>
                            </div>
                        </div>
                        
                        <!-- 생산 라인 카드 -->
                        <h3 class="text-xl font-bold mb-4">생산 라인별 상세 현황</h3>
                        <div class="space-y-4">
                            ${lines.map(line => {
                                const statusStyles = {
                                    normal: { bg: 'bg-green-50', border: 'border-green-300', header: 'bg-green-100' },
                                    warning: { bg: 'bg-yellow-50', border: 'border-yellow-300', header: 'bg-yellow-100' },
                                    emergency: { bg: 'bg-red-50', border: 'border-red-300', header: 'bg-red-100' },
                                    testing: { bg: 'bg-blue-50', border: 'border-blue-300', header: 'bg-blue-100' }
                                };
                                const style = statusStyles[line.status];
                                
                                return `
                                <div class="bg-white border-2 ${style.border} rounded-xl overflow-hidden transition-all" id="line-card-${line.id}">
                                    <div class="${style.header} px-6 py-3 flex items-center justify-between border-b-2 ${style.border}">
                                        <div class="flex items-center">
                                            <span class="text-2xl mr-3">${line.icon}</span>
                                            <div>
                                                <h4 class="text-lg font-bold">${line.name}</h4>
                                                <span class="text-xs font-semibold">${line.status === 'emergency' ? '🚨 긴급 중단' : line.status === 'warning' ? '⚠️ 효율 저하' : line.status === 'testing' ? '🔬 시험 생산' : '✅ 정상 가동'}</span>
                                            </div>
                                        </div>
                                        <div class="text-right">
                                            <div class="text-2xl font-bold">${line.uptime}%</div>
                                            <div class="text-xs">가동률</div>
                                        </div>
                                    </div>
                                    
                                    <div class="p-6 ${style.bg}">
                                        <div class="grid grid-cols-3 gap-4 mb-4">
                                            <div class="bg-white rounded-lg p-3 border">
                                                <div class="text-xs text-gray-600 mb-1">일일 생산</div>
                                                <div class="font-bold text-xl ${line.daily >= line.target ? 'text-green-600' : 'text-red-600'}">
                                                    ${line.daily.toLocaleString()}
                                                </div>
                                                <div class="text-xs text-gray-500">목표: ${line.target.toLocaleString()}개</div>
                                            </div>
                                            <div class="bg-white rounded-lg p-3 border">
                                                <div class="text-xs text-gray-600 mb-1">불량률</div>
                                                <div class="font-bold text-xl ${line.defectRate <= line.defectLimit ? 'text-green-600' : 'text-red-600'}">
                                                    ${line.defectRate}%
                                                </div>
                                                <div class="text-xs text-gray-500">기준: ${line.defectLimit}% 이하</div>
                                            </div>
                                            ${line.delivery ? `
                                                <div class="bg-white rounded-lg p-3 border">
                                                    <div class="text-xs text-gray-600 mb-1">납기일</div>
                                                    <div class="font-bold text-xl text-blue-600">${line.delivery}</div>
                                                    <div class="text-xs text-gray-500">${line.deliveryAmount.toLocaleString()}개</div>
                                                </div>
                                            ` : line.launchDate ? `
                                                <div class="bg-white rounded-lg p-3 border">
                                                    <div class="text-xs text-gray-600 mb-1">정식 양산</div>
                                                    <div class="font-bold text-xl text-blue-600">${line.launchDate}</div>
                                                    <div class="text-xs text-gray-500">예정</div>
                                                </div>
                                            ` : ''}
                                        </div>
                                        
                                        ${line.status === 'emergency' ? `
                                            <div class="bg-red-100 border-2 border-red-300 rounded-lg p-4 mb-4">
                                                <div class="font-bold text-red-800 mb-2">🚨 긴급 상황 정보</div>
                                                <div class="text-sm space-y-1">
                                                    <div>• 현재 재고: ${line.currentStock.toLocaleString()}개</div>
                                                    <div>• 납기: ${line.delivery} (${line.deliveryAmount.toLocaleString()}개)</div>
                                                    <div>• 부족량: ${(line.deliveryAmount - line.currentStock).toLocaleString()}개</div>
                                                    <div>• 1일 중단 손실: ${line.lossPerDay.toLocaleString()}만원</div>
                                                </div>
                                            </div>
                                        ` : ''}
                                        
                                        <!-- 의사결정 영역 -->
                                        <div id="decision-area-${line.id}">
                                            <div class="text-sm font-semibold mb-3">대응 방안 선택</div>
                                            <div class="space-y-2">
                                                <select id="action-${line.id}" class="w-full border-2 rounded-lg px-3 py-2 text-sm focus:border-blue-500" onchange="updateLineDecision(${line.id})">
                                                    <option value="">선택하세요</option>
                                                    ${line.status === 'emergency' ? `
                                                        <option value="원자재교체">🔄 원자재 전량 교체 (5천만원, 2일)</option>
                                                        <option value="라인전환">🔀 라인 1에서 긴급 생산 (일 600개)</option>
                                                        <option value="외주생산">🏭 외주 생산 의뢰 (비용 30% 증가)</option>
                                                        <option value="납기연장">📅 납기 연장 협상 (위약금 5천만원)</option>
                                                    ` : line.status === 'warning' ? `
                                                        <option value="유지보수">🔧 현재 수준 유지보수</option>
                                                        <option value="조기교체">⚡ 조기 설비 교체 (${line.equipmentCost.toLocaleString()}만원, ${line.equipmentTime})</option>
                                                        <option value="생산축소">📉 생산량 축소 운영</option>
                                                    ` : line.status === 'testing' ? `
                                                        <option value="양산진행">✅ 계획대로 양산 진행</option>
                                                        <option value="테스트연장">🔬 테스트 기간 연장 (1주)</option>
                                                        <option value="개선후진행">🛠 개선 작업 후 진행</option>
                                                    ` : `
                                                        <option value="계속">✅ 현재 계획 유지</option>
                                                        <option value="증산">📈 생산량 증대 (OT 활용)</option>
                                                    `}
                                                </select>
                                                
                                                <textarea id="note-${line.id}" class="w-full border-2 rounded-lg px-3 py-2 text-sm" rows="2" placeholder="결정 근거 및 세부 계획..."></textarea>
                                                
                                                <button class="w-full py-2 bg-gradient-to-r from-blue-600 to-gray-700 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-gray-800 transition-all disabled:opacity-50" 
                                                        id="complete-btn-${line.id}" onclick="completeLineDecision(${line.id})" disabled>
                                                    <i class="fas fa-check mr-2"></i>결정 완료
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            `;
                            }).join('')}
                        </div>
                    </div>
                </div>
                
                <!-- 오른쪽: 대응 현황 -->
                <div class="w-80 bg-white border-l overflow-y-auto">
                    <div class="p-5">
                        <h3 class="font-bold text-lg mb-4 flex items-center">
                            <i class="fas fa-tasks text-blue-600 mr-2"></i>
                            대응 현황
                        </h3>
                        
                        <div id="line-summary" class="space-y-3 mb-6">
                            <div class="p-4 bg-gray-50 rounded-lg text-center text-gray-500 text-sm">
                                아직 결정된 라인이 없습니다
                            </div>
                        </div>
                        
                        <div class="p-4 bg-red-50 rounded-lg mb-4">
                            <div class="text-sm font-semibold text-red-900 mb-2">🚨 긴급 우선순위</div>
                            <ol class="text-xs text-red-800 space-y-1">
                                <li>1. 라인 2 긴급 중단 대응</li>
                                <li>2. 납기 준수 방안 수립</li>
                                <li>3. 라인 3 효율 개선</li>
                                <li>4. 신제품 양산 일정</li>
                            </ol>
                        </div>
                        
                        <div class="p-4 bg-blue-50 rounded-lg">
                            <div class="text-sm font-semibold text-blue-900 mb-2">💡 의사결정 고려사항</div>
                            <ul class="text-xs text-blue-800 space-y-1">
                                <li>• 납기 준수 여부</li>
                                <li>• 비용 대비 효과</li>
                                <li>• 실행 소요 시간</li>
                                <li>• 품질 유지 가능성</li>
                                <li>• 장기적 영향도</li>
                            </ul>
                        </div>
                        
                        <button class="w-full mt-6 py-3 bg-gradient-to-r from-blue-600 to-gray-700 text-white font-bold rounded-lg hover:from-blue-700 hover:to-gray-800 transition-all" 
                                onclick="completeSimulation()">
                            <i class="fas fa-check mr-2"></i>완료하고 다음 단계로
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    window.lineDecisions = {};
}

function updateLineDecision(lineId) {
    const action = document.getElementById(`action-${lineId}`)?.value;
    const note = document.getElementById(`note-${lineId}`)?.value;
    
    if (!window.lineDecisions[lineId]) {
        window.lineDecisions[lineId] = {};
    }
    
    window.lineDecisions[lineId].action = action;
    window.lineDecisions[lineId].note = note;
    
    const completeBtn = document.getElementById(`complete-btn-${lineId}`);
    if (action && completeBtn) {
        completeBtn.disabled = false;
        completeBtn.classList.remove('opacity-50');
    }
}

function completeLineDecision(lineId) {
    const decision = window.lineDecisions[lineId];
    if (!decision || !decision.action) {
        alert('대응 방안을 선택해주세요.');
        return;
    }
    
    decision.complete = true;
    
    const decisionArea = document.getElementById(`decision-area-${lineId}`);
    const card = document.getElementById(`line-card-${lineId}`);
    
    if (decisionArea && card) {
        card.classList.add('border-green-500');
        
        decisionArea.innerHTML = `
            <div class="bg-green-100 border-2 border-green-500 rounded-lg p-4">
                <div class="flex items-center mb-2">
                    <i class="fas fa-check-circle text-green-600 text-2xl mr-2"></i>
                    <span class="font-bold text-green-800">대응 완료</span>
                </div>
                <div class="text-sm space-y-1">
                    <div><strong>조치:</strong> ${decision.action}</div>
                    ${decision.note ? `<div><strong>근거:</strong> ${decision.note}</div>` : ''}
                </div>
            </div>
        `;
    }
    
    updateProductionProgress();
}

function updateProductionProgress() {
    const completed = Object.values(window.lineDecisions).filter(d => d.complete).length;
    const total = totalTasks;
    const percentage = Math.round((completed / total) * 100);
    
    const progressBar = document.getElementById('production-progress-bar');
    const progressText = document.getElementById('production-progress-text');
    
    if (progressBar) progressBar.style.width = `${percentage}%`;
    if (progressText) progressText.textContent = `${percentage}%`;
    
    const mainProgressBar = document.getElementById('progress-bar');
    const mainProgressText = document.getElementById('progress-text');
    if (mainProgressBar) mainProgressBar.style.width = `${percentage}%`;
    if (mainProgressText) mainProgressText.textContent = `${percentage}%`;
    
    // 요약 업데이트
    const summaryEl = document.getElementById('line-summary');
    const decisions = Object.values(window.lineDecisions).filter(d => d.complete);
    
    if (summaryEl && decisions.length > 0) {
        summaryEl.innerHTML = decisions.map((d, idx) => `
            <div class="p-3 bg-green-50 border border-green-200 rounded-lg">
                <div class="font-semibold text-sm">라인 ${idx + 1}</div>
                <div class="text-xs text-gray-700 mt-1">
                    <div>${d.action}</div>
                </div>
            </div>
        `).join('');
    }
}

function showError(message) {
    alert(message);
    window.location.href = 'index.html';
}
