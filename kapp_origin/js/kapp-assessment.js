// KAPP Assessment Logic - Adaptive Testing & Advanced Diagnostics

// State management
const kappState = {
    userData: {},
    currentStep: 'userInfo',
    currentCategory: 'knowledge',
    currentDifficulty: 'medium',
    questionHistory: [],
    currentQuestionIndex: 0,
    answers: {},
    knowledgeLevel: 3, // Starts at medium
    etrayActions: [],
    etrayStartTime: null,
    etrayTimerInterval: null, // 타이머 인터벌 저장
    results: {}
};

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    initializeKAPP();
    setupEventListeners();
});

// Initialize KAPP Assessment
function initializeKAPP() {
    console.log('🔍 initializeKAPP 시작');
    console.log('📊 industryJobData:', window.industryJobData);
    console.log('📊 kappQuestionBank:', window.kappQuestionBank);
    
    if (!window.industryJobData) {
        console.error('❌ industryJobData가 로드되지 않았습니다!');
        return;
    }
    
    populateDropdowns();
    updateProgress();
}

// Populate dropdowns with data
function populateDropdowns() {
    console.log('📝 populateDropdowns 시작');
    
    // Industry dropdown
    const industrySelect = document.getElementById('userIndustry');
    if (!industrySelect) {
        console.error('❌ userIndustry 엘리먼트를 찾을 수 없습니다!');
        return;
    }
    
    console.log('✅ industrySelect 찾음:', industrySelect);
    console.log('🔑 Industry 키:', Object.keys(window.industryJobData));
    
    Object.keys(window.industryJobData).forEach(industry => {
        const option = document.createElement('option');
        option.value = industry;
        option.textContent = `${window.industryJobData[industry].icon} ${industry}`;
        industrySelect.appendChild(option);
        console.log('➕ 추가됨:', industry);
    });
    
    console.log('✅ Industry dropdown 완료. 총 옵션:', industrySelect.options.length);
    
    // Position dropdown
    const positionSelect = document.getElementById('userPosition');
    window.positionLevels.forEach(pos => {
        const option = document.createElement('option');
        option.value = pos.value;
        option.textContent = pos.label;
        positionSelect.appendChild(option);
    });
    
    // Experience dropdown
    const experienceSelect = document.getElementById('userExperience');
    window.experienceYears.forEach(exp => {
        const option = document.createElement('option');
        option.value = exp.value;
        option.textContent = exp.label;
        experienceSelect.appendChild(option);
    });
    
    // Company size dropdown
    const sizeSelect = document.getElementById('userCompanySize');
    window.companySizes.forEach(size => {
        const option = document.createElement('option');
        option.value = size.value;
        option.textContent = `${size.icon} ${size.label}`;
        sizeSelect.appendChild(option);
    });
}

// Setup event listeners
function setupEventListeners() {
    // Industry change - update job dropdown
    document.getElementById('userIndustry').addEventListener('change', function() {
        updateJobDropdown(this.value);
    });
    
    // User info form submission
    document.getElementById('userInfoForm').addEventListener('submit', handleUserInfoSubmit);
    
    // Navigation buttons
    document.getElementById('nextBtn')?.addEventListener('click', handleNextQuestion);
    document.getElementById('prevBtn')?.addEventListener('click', handlePrevQuestion);
    
    // E-tray complete
    document.getElementById('etrayComplete')?.addEventListener('click', completeEtraySimulation);
}

// Update job dropdown based on industry
function updateJobDropdown(industry) {
    const jobSelect = document.getElementById('userJob');
    jobSelect.innerHTML = '<option value="">선택해주세요</option>';
    
    if (industry && window.industryJobData[industry]) {
        window.industryJobData[industry].jobs.forEach(job => {
            const option = document.createElement('option');
            option.value = job;
            option.textContent = job;
            jobSelect.appendChild(option);
        });
        jobSelect.disabled = false;
    } else {
        jobSelect.disabled = true;
    }
}

// Handle user info submission
function handleUserInfoSubmit(e) {
    e.preventDefault();
    
    // Collect user data
    kappState.userData = {
        name: document.getElementById('userName').value,
        email: document.getElementById('userEmail').value || '',
        industry: document.getElementById('userIndustry').value,
        job: document.getElementById('userJob').value,
        position: document.getElementById('userPosition').value,
        experience: document.getElementById('userExperience').value,
        company: document.getElementById('userCompany').value || '',
        companySize: document.getElementById('userCompanySize').value,
        goals: Array.from(document.querySelectorAll('input[name="goal"]:checked')).map(cb => cb.value),
        timestamp: new Date().toISOString()
    };
    
    console.log('User Data:', kappState.userData);
    
    // Start KAPP assessment
    startKAPPAssessment();
}

// Start KAPP Assessment
function startKAPPAssessment() {
    // Hide user info screen
    document.getElementById('userInfoScreen').classList.remove('active');
    
    // Show assessment screen
    document.getElementById('kappAssessmentScreen').classList.add('active');
    
    // Update progress
    kappState.currentStep = 'knowledge';
    updateProgress();
    
    // Debug: Check if enhanced questions are available
    console.log('🔍 Checking enhanced questions...');
    console.log('window.enhancedQuestions:', window.enhancedQuestions);
    console.log('window.questionTypes:', window.questionTypes);
    console.log('window.renderQuestion:', window.renderQuestion);
    
    if (window.enhancedQuestions) {
        console.log('✅ Enhanced questions loaded!');
        console.log('  - Knowledge:', window.enhancedQuestions.knowledge?.length, 'questions');
        console.log('  - Application:', window.enhancedQuestions.application?.length, 'questions');
        console.log('  - Performance:', window.enhancedQuestions.performance?.length, 'questions');
        console.log('  - Productivity:', window.enhancedQuestions.productivity?.length, 'questions');
    } else {
        console.warn('⚠️ Enhanced questions NOT loaded! Using fallback.');
    }
    
    // Load first question (Knowledge - Medium difficulty)
    loadAdaptiveQuestion();
}

// Load adaptive question based on current state - ENHANCED VERSION
function loadAdaptiveQuestion() {
    const { currentCategory, currentDifficulty, userData } = kappState;
    
    console.log(`\n📋 Loading question for category: ${currentCategory}`);
    
    let question = null;
    let questionPool = [];
    
    // Check if enhanced questions are available
    if (window.enhancedQuestions) {
        console.log('✅ Using ENHANCED question types!');
        
        // Use enhanced diverse question types
        const categoryQuestions = window.enhancedQuestions[currentCategory] || [];
        console.log(`  - Total ${currentCategory} questions:`, categoryQuestions.length);
        
        // Filter by industry/job/position if available
        questionPool = categoryQuestions.filter(q => 
            (!q.industry || q.industry === userData.industry) &&
            (!q.job || q.job === userData.job) &&
            (!q.position || q.position === userData.position) &&
            !kappState.answers[q.id]
        );
        
        console.log(`  - Filtered questions (industry: ${userData.industry}, job: ${userData.job}):`, questionPool.length);
        console.log(`  - Available question IDs:`, questionPool.map(q => q.id));
        
        // Debug: Show some question details
        if (questionPool.length > 0) {
            const sample = questionPool[0];
            console.log(`  - Sample question: [${sample.type}] ${sample.question?.substring(0, 50)}...`);
        }
        
        // If no matched questions, use all category questions
        if (questionPool.length === 0) {
            questionPool = categoryQuestions.filter(q => !kappState.answers[q.id]);
            console.log(`  - Using all ${currentCategory} questions:`, questionPool.length);
        }
        
        // Random selection for variety
        if (questionPool.length > 0) {
            const randomIndex = Math.floor(Math.random() * questionPool.length);
            question = questionPool[randomIndex];
            console.log(`  - Selected question: ${question.type} (${question.id})`);
        } else {
            console.warn('  - ⚠️ No questions available in enhanced pool!');
        }
    } else {
        console.log('⚠️ Enhanced questions not available, using fallback...');
    }
    
    // Fallback to original question bank if enhanced not available
    if (!question && window.kappQuestionBank) {
        console.log('📦 Using fallback question bank...');
        if (currentCategory === 'knowledge') {
            const difficultyQuestions = window.kappQuestionBank.knowledge[currentDifficulty] || [];
            const matchedQuestions = difficultyQuestions.filter(q => 
                (!q.industry || q.industry === userData.industry) &&
                (!q.job || q.job === userData.job) &&
                !kappState.answers[q.id]
            );
            questionPool = matchedQuestions.length > 0 ? matchedQuestions : difficultyQuestions;
            question = questionPool.find(q => !kappState.answers[q.id]);
        } else if (currentCategory === 'application') {
            const appQuestions = (window.kappQuestionBank.application || []).filter(q => 
                (!q.industry || q.industry === userData.industry) &&
                (!q.job || q.job === userData.job) &&
                !kappState.answers[q.id]
            );
            question = appQuestions[0];
            console.log(`  - Application questions found: ${appQuestions.length}`);
        } else if (currentCategory === 'performance') {
            const perfQuestions = (window.kappQuestionBank.performance || []).filter(q => 
                (!q.industry || q.industry === userData.industry) &&
                (!q.job || q.job === userData.job) &&
                !kappState.answers[q.id]
            );
            question = perfQuestions[0];
            console.log(`  - Performance questions found: ${perfQuestions.length}`);
        }
        
        if (question) {
            console.log(`  - Using fallback question: ${question.id}`);
        }
    }
    
    if (question) {
        console.log('✅ Question loaded successfully!', question);
        displayQuestion(question);
        kappState.questionHistory.push(question);
    } else {
        console.log('⏭️ No more questions, moving to next category...');
        // Move to next category or complete
        proceedToNextCategory();
    }
}

// Display question - ENHANCED VERSION with 8 question types
function displayQuestion(question) {
    // Update category indicator
    const categoryIcons = {
        knowledge: '📚',
        application: '⚙️',
        performance: '📊',
        productivity: '⚡'
    };
    
    const categoryTitles = {
        knowledge: '지식 (Knowledge)',
        application: '적용 (Application)',
        performance: '성과 (Performance)',
        productivity: '생산성 (Productivity)'
    };
    
    const categoryDescs = {
        knowledge: 'NCS 기반 직무 지식 및 전문성 측정',
        application: '실무 상황에서의 의사결정 및 문제 해결 능력',
        performance: 'KPI 중심의 성과 창출 역량',
        productivity: '업무 효율성 및 리소스 최적화 능력'
    };
    
    document.getElementById('categoryIcon').textContent = categoryIcons[question.category];
    document.getElementById('categoryTitle').textContent = categoryTitles[question.category];
    document.getElementById('categoryDescription').textContent = categoryDescs[question.category];
    
    // Update question number
    document.getElementById('currentQuestionNum').textContent = kappState.questionHistory.length;
    
    // Update difficulty badge
    const difficultyBadge = document.getElementById('difficultyBadge');
    if (question.difficulty) {
        difficultyBadge.textContent = `난이도: ${question.difficulty === 'easy' ? '하' : question.difficulty === 'medium' ? '중' : '상'}`;
        difficultyBadge.className = `difficulty-badge ${question.difficulty}`;
    } else {
        difficultyBadge.style.display = 'none';
    }
    
    // Get container for rendering
    const optionsDiv = document.getElementById('answerOptions');
    optionsDiv.innerHTML = '';
    
    // Check if we have enhanced renderers available
    if (window.renderQuestion && question.type) {
        // Use enhanced rendering system for diverse question types
        console.log(`🎯 Rendering ${question.type} question:`, question.id);
        window.renderQuestion(question, optionsDiv, (answer) => {
            kappState.answers[question.id] = answer;
            document.getElementById('nextBtn').disabled = false;
        });
    } else {
        // Fallback to basic rendering
        console.log('⚠️ Using basic rendering');
        
        // Display question text
        const questionTextDiv = document.createElement('div');
        questionTextDiv.className = 'question-text-container';
        questionTextDiv.innerHTML = `<p id="questionText">${question.question || question.scenario || ''}</p>`;
        optionsDiv.appendChild(questionTextDiv);
        
        // Display basic options
        if (question.options && Array.isArray(question.options)) {
            question.options.forEach((option, index) => {
                const optionDiv = document.createElement('div');
                optionDiv.className = 'answer-option-kapp';
                optionDiv.innerHTML = `
                    <span class="option-label">선택 ${index + 1}</span>
                    <div class="option-text">${option}</div>
                `;
                optionDiv.addEventListener('click', () => selectAnswer(question.id, index));
                optionsDiv.appendChild(optionDiv);
            });
        }
    }
    
    // Update adaptive info
    updateAdaptiveInfo();
    
    // Enable/disable next button
    const nextBtn = document.getElementById('nextBtn');
    nextBtn.disabled = kappState.answers[question.id] === undefined;
}

// Select answer
function selectAnswer(questionId, optionIndex) {
    kappState.answers[questionId] = optionIndex;
    
    // Update UI
    const options = document.querySelectorAll('.answer-option-kapp');
    options.forEach((option, index) => {
        if (index === optionIndex) {
            option.classList.add('selected');
        } else {
            option.classList.remove('selected');
        }
    });
    
    // Enable next button
    document.getElementById('nextBtn').disabled = false;
}

// Handle next question
function handleNextQuestion() {
    const currentQuestion = kappState.questionHistory[kappState.questionHistory.length - 1];
    const userAnswer = kappState.answers[currentQuestion.id];
    const correctAnswer = currentQuestion.answer;
    
    // Adaptive difficulty adjustment (for Knowledge category)
    if (currentQuestion.category === 'knowledge') {
        if (userAnswer === correctAnswer) {
            // Correct answer - increase difficulty
            if (kappState.currentDifficulty === 'easy') {
                kappState.currentDifficulty = 'medium';
            } else if (kappState.currentDifficulty === 'medium') {
                kappState.currentDifficulty = 'hard';
            }
            kappState.knowledgeLevel = Math.min(5, kappState.knowledgeLevel + 0.5);
        } else {
            // Wrong answer - decrease difficulty
            if (kappState.currentDifficulty === 'hard') {
                kappState.currentDifficulty = 'medium';
            } else if (kappState.currentDifficulty === 'medium') {
                kappState.currentDifficulty = 'easy';
            }
            kappState.knowledgeLevel = Math.max(1, kappState.knowledgeLevel - 0.5);
        }
    }
    
    // Check if category is complete (3-4 questions per category)
    const categoryQuestions = kappState.questionHistory.filter(q => q.category === kappState.currentCategory);
    
    if (categoryQuestions.length >= 3) {
        proceedToNextCategory();
    } else {
        loadAdaptiveQuestion();
    }
}

// Proceed to next category
function proceedToNextCategory() {
    if (kappState.currentCategory === 'knowledge') {
        kappState.currentCategory = 'application';
        kappState.currentStep = 'application';
        updateProgress();
        loadAdaptiveQuestion();
    } else if (kappState.currentCategory === 'application') {
        kappState.currentCategory = 'performance';
        kappState.currentStep = 'performance';
        updateProgress();
        loadAdaptiveQuestion();
    } else if (kappState.currentCategory === 'performance') {
        // Start E-tray simulation
        startEtraySimulation();
    } else {
        // Complete assessment
        completeAssessment();
    }
}

// Handle previous question (뒤로 가기)
function handlePrevQuestion() {
    // E-tray나 analysis 단계에서는 뒤로 가기 비활성화
    if (kappState.currentStep === 'productivity' || kappState.currentStep === 'analysis') {
        return;
    }
    
    // 이전 문항으로 이동
    if (kappState.currentQuestionIndex > 0) {
        kappState.currentQuestionIndex--;
        const prevQuestion = kappState.questionHistory[kappState.currentQuestionIndex];
        if (prevQuestion) {
            renderQuestion(prevQuestion);
        }
    }
}

// Start E-tray simulation
function startEtraySimulation() {
    document.getElementById('kappAssessmentScreen').classList.remove('active');
    document.getElementById('etrayScreen').classList.add('active');
    
    kappState.currentStep = 'productivity';
    kappState.etrayStartTime = Date.now();
    updateProgress();
    
    // Load sample emails
    loadEtrayEmails();
    
    // Start timer (10 minutes)
    startEtrayTimer(600);
    
    // ✅ E-tray 완료 버튼 이벤트 다시 연결
    const etrayCompleteBtn = document.getElementById('etrayComplete');
    if (etrayCompleteBtn) {
        // 기존 이벤트 제거 (중복 방지)
        etrayCompleteBtn.removeEventListener('click', completeEtraySimulation);
        // 새로 연결
        etrayCompleteBtn.addEventListener('click', completeEtraySimulation);
        console.log('✅ E-tray 완료 버튼 이벤트 연결됨');
    } else {
        console.error('❌ E-tray 완료 버튼을 찾을 수 없습니다!');
    }
}

// Load E-tray emails - Industry-Specific Version
function loadEtrayEmails() {
    // Get user's industry from kappState
    const userIndustry = kappState.userData.industry || '기타';
    
    console.log('🏢 Loading E-tray for industry:', userIndustry);
    
    // Get industry-specific emails, fallback to default if not found
    let emails = [];
    
    if (window.etrayByIndustry && window.etrayByIndustry[userIndustry]) {
        emails = window.etrayByIndustry[userIndustry];
        console.log(`✅ Loaded ${emails.length} industry-specific E-tray emails for ${userIndustry}`);
    } else {
        // Fallback to default generic emails
        console.log('⚠️ Industry-specific E-tray not found, using default emails');
        emails = [
            {
                id: 'e1',
                sender: '김팀장',
                subject: '[긴급] 내일 오전 임원 보고 자료 요청',
                time: '10분 전',
                priority: 'high',
                body: `내일 오전 10시 임원 회의에서 사용할 분기 실적 보고서가 필요합니다.\n\n포함 내용:\n- 분기 매출 및 성장률\n- 주요 성과 지표\n- 차기 분기 계획\n\n오늘 오후 5시까지 초안을 보내주세요.`,
                unread: true
            },
            {
                id: 'e2',
                sender: '이대리',
                subject: '프로젝트 일정 조율 요청',
                time: '1시간 전',
                priority: 'medium',
                body: `안녕하세요.\n\n현재 진행 중인 프로젝트 일정이 겹쳐서 조율이 필요합니다.\n\n가능한 시간대를 알려주시면 회의를 잡겠습니다.`,
                unread: true
            },
            {
                id: 'e3',
                sender: '박과장 (타부서)',
                subject: '협업 프로젝트 진행 상황 문의',
                time: '2시간 전',
                priority: 'medium',
                body: `협업 중인 프로젝트 진행 상황을 공유해주실 수 있을까요?\n\n특히 다음 사항이 궁금합니다:\n1. 현재 진행률\n2. 예상 완료 시점\n3. 지원이 필요한 부분\n\n이번 주 내로 답변 부탁드립니다.`,
                unread: true
            },
            {
                id: 'e4',
                sender: '신입사원 최주임',
                subject: '업무 관련 질문',
                time: '3시간 전',
                priority: 'low',
                body: `선배님, 업무 처리 방법에 대해 몇 가지 질문이 있습니다.\n\n시간 되실 때 조언 부탁드립니다.`,
                unread: true
            },
            {
                id: 'e5',
                sender: '총무팀',
                subject: '[공지] 사무실 이전 안내',
                time: '5시간 전',
                priority: 'low',
                body: `다음 달 사무실 이전 예정입니다.\n\n상세 일정은 추후 공지하겠습니다.`,
                unread: true
            }
        ];
    }
    
    const emailList = document.getElementById('emailList');
    emailList.innerHTML = '';
    
    emails.forEach(email => {
        const emailDiv = document.createElement('div');
        emailDiv.className = `email-item ${email.unread ? 'unread' : ''}`;
        emailDiv.innerHTML = `
            <div class="email-sender">${email.sender}</div>
            <div class="email-subject">${email.subject}</div>
            <div class="email-time">${email.time}</div>
            <span class="email-priority priority-${email.priority}">${email.priority === 'high' ? '긴급' : email.priority === 'medium' ? '중요' : '일반'}</span>
        `;
        
        emailDiv.addEventListener('click', () => displayEmail(email));
        emailList.appendChild(emailDiv);
    });
}

// Display email content
function displayEmail(email) {
    const contentArea = document.getElementById('emailContent');
    contentArea.innerHTML = `
        <div class="email-header">
            <div class="email-from">보낸 사람: ${email.sender}</div>
            <div class="email-subject-full">${email.subject}</div>
            <div class="email-meta">${email.time}</div>
        </div>
        <div class="email-body">${email.body}</div>
        <div class="email-actions">
            <button class="email-action-btn" onclick="handleEmailAction('${email.id}', 'reply')">
                <i class="fas fa-reply"></i> 답장
            </button>
            <button class="email-action-btn" onclick="handleEmailAction('${email.id}', 'forward')">
                <i class="fas fa-share"></i> 전달
            </button>
            <button class="email-action-btn" onclick="handleEmailAction('${email.id}', 'archive')">
                <i class="fas fa-archive"></i> 보관
            </button>
        </div>
    `;
    
    // Update selected state
    document.querySelectorAll('.email-item').forEach(item => item.classList.remove('selected'));
    event.currentTarget.classList.add('selected');
    
    // Mark as read
    event.currentTarget.classList.remove('unread');
    
    // Record action
    kappState.etrayActions.push({
        emailId: email.id,
        action: 'open',
        timestamp: Date.now()
    });
}

// Handle email action
window.handleEmailAction = function(emailId, action) {
    kappState.etrayActions.push({
        emailId: emailId,
        action: action,
        timestamp: Date.now()
    });
    
    showNotification(`${action === 'reply' ? '답장' : action === 'forward' ? '전달' : '보관'} 처리되었습니다.`, 'success');
};

// Start E-tray timer
function startEtrayTimer(seconds) {
    let remaining = seconds;
    const timerDisplay = document.getElementById('timeRemaining');
    
    // 타이머 인터벌을 전역 상태에 저장
    kappState.etrayTimerInterval = setInterval(() => {
        remaining--;
        const mins = Math.floor(remaining / 60);
        const secs = remaining % 60;
        timerDisplay.textContent = `${mins}:${secs.toString().padStart(2, '0')}`;
        
        if (remaining <= 0) {
            clearInterval(kappState.etrayTimerInterval);
            kappState.etrayTimerInterval = null;
            completeEtraySimulation();
        }
    }, 1000);
}

// Complete E-tray simulation
function completeEtraySimulation() {
    console.log('🔘 E-tray 완료 버튼 클릭됨!');
    
    // 타이머가 실행 중이면 멈춤
    if (kappState.etrayTimerInterval) {
        clearInterval(kappState.etrayTimerInterval);
        kappState.etrayTimerInterval = null;
        console.log('⏱️ E-tray 타이머 중지됨');
    }
    
    const duration = Date.now() - kappState.etrayStartTime;
    kappState.etrayDuration = duration;
    
    console.log(`✅ E-tray 완료! 소요 시간: ${Math.round(duration / 1000)}초`);
    console.log(`📧 처리한 이메일 액션: ${kappState.etrayActions.length}개`);
    
    // Show AI Workflow screen instead of analysis
    const etrayScreen = document.getElementById('etrayScreen');
    const aiWorkflowScreen = document.getElementById('aiWorkflowScreen');
    
    if (etrayScreen && aiWorkflowScreen) {
        etrayScreen.classList.remove('active');
        aiWorkflowScreen.classList.add('active');
        console.log('🤖 AI 워크플로우 화면으로 전환됨');
        
        // Load AI workflow for user's industry
        loadAIWorkflow();
    } else {
        console.error('❌ 화면 전환 실패: etrayScreen 또는 aiWorkflowScreen을 찾을 수 없음');
    }
    
    kappState.currentStep = 'aiWorkflow';
    updateProgress();
}

// Load AI Workflow simulation based on user's industry
function loadAIWorkflow() {
    const userIndustry = kappState.userData.industry || '기타';
    console.log('🏢 Loading AI Workflow for industry:', userIndustry);
    
    // Get industry-specific AI workflow
    let workflow = null;
    
    // Try new dedicated file first
    if (window.aiWorkflowSimulations) {
        workflow = window.aiWorkflowSimulations.find(
            w => w.industry === userIndustry
        );
        console.log(`🔍 Found ${window.aiWorkflowSimulations.length} AI workflows in aiWorkflowSimulations`);
    }
    
    // Fallback to productivityQuestions
    if (!workflow && window.productivityQuestions && window.productivityQuestions.aiWorkflowSimulations) {
        workflow = window.productivityQuestions.aiWorkflowSimulations.find(
            w => w.industry === userIndustry
        );
        console.log(`🔍 Found workflow in productivityQuestions`);
    }
    
    if (!workflow) {
        console.warn('⚠️ Industry-specific AI workflow not found, using default');
        // Use IT as fallback
        workflow = window.aiWorkflowSimulations?.[0] || window.productivityQuestions?.aiWorkflowSimulations?.[0];
    }
    
    if (workflow) {
        console.log(`✅ Loaded AI workflow: ${workflow.title}`);
        renderAIWorkflow(workflow);
    } else {
        console.error('❌ No AI workflow available, skipping to analysis');
        completeAIWorkflow();
    }
}

// Render AI Workflow scenario
function renderAIWorkflow(workflow) {
    const container = document.getElementById('aiWorkflowContent');
    if (!container) return;
    
    container.innerHTML = `
        <div class="workflow-scenario">
            <h3>${workflow.title}</h3>
            <div class="workflow-task">
                <pre style="white-space: pre-wrap; font-family: 'Noto Sans KR', sans-serif; line-height: 1.8;">${workflow.task}</pre>
            </div>
            
            <div class="workflow-timer">
                ⏱️ 제한 시간: ${workflow.timeLimit / 60}분
            </div>
            
            <div class="workflow-options">
                ${workflow.options.map((option, index) => `
                    <div class="workflow-option" data-index="${index}">
                        <input type="radio" 
                               name="aiWorkflowChoice" 
                               id="option_${index}" 
                               value="${index}">
                        <label for="option_${index}">
                            <strong>${option.choice}</strong>
                            <div class="workflow-steps">
                                ${option.workflow.map(step => `<div class="workflow-step">▪ ${step}</div>`).join('')}
                            </div>
                            <div class="workflow-metrics">
                                <span class="metric">⚡ 시간 절감: ${option.timeReduction}</span>
                                <span class="metric">⭐ 품질: ${option.qualityScore}점</span>
                                <span class="metric">🤖 자동화: ${option.automationLevel}</span>
                            </div>
                        </label>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
    
    // Store workflow in state
    kappState.currentWorkflow = workflow;
    
    // Setup complete button
    const completeBtn = document.getElementById('aiWorkflowComplete');
    if (completeBtn) {
        completeBtn.removeEventListener('click', completeAIWorkflow);
        completeBtn.addEventListener('click', completeAIWorkflow);
    }
}

// Complete AI Workflow and proceed to analysis
function completeAIWorkflow() {
    console.log('✅ AI 워크플로우 완료!');
    
    // Get selected option
    const selected = document.querySelector('input[name="aiWorkflowChoice"]:checked');
    if (selected && kappState.currentWorkflow) {
        const selectedIndex = parseInt(selected.value);
        const selectedOption = kappState.currentWorkflow.options[selectedIndex];
        
        kappState.aiWorkflowAnswer = {
            workflowId: kappState.currentWorkflow.id,
            selectedIndex: selectedIndex,
            isCorrect: selectedIndex === kappState.currentWorkflow.answer,
            timeReduction: selectedOption.timeReduction,
            qualityScore: selectedOption.qualityScore,
            automationLevel: selectedOption.automationLevel
        };
        
        console.log('📊 AI 워크플로우 답변:', kappState.aiWorkflowAnswer);
    } else {
        console.warn('⚠️ No option selected');
    }
    
    // Show analysis screen
    const aiWorkflowScreen = document.getElementById('aiWorkflowScreen');
    const analysisScreen = document.getElementById('analysisScreen');
    
    if (aiWorkflowScreen && analysisScreen) {
        aiWorkflowScreen.classList.remove('active');
        analysisScreen.classList.add('active');
        console.log('📊 분석 화면으로 전환됨');
    }
    
    kappState.currentStep = 'analysis';
    updateProgress();
    
    // Simulate analysis
    simulateAnalysis();
}

// 전역 함수로 노출 (HTML onclick에서 사용)
window.completeEtraySimulation = completeEtraySimulation;
window.completeAssessment = completeAssessment; // 테스트용
window.simulateAnalysis = simulateAnalysis; // 테스트용

// Simulate AI analysis
function simulateAnalysis() {
    console.log('🤖 AI 분석 시작...');
    
    const steps = document.querySelectorAll('.analysis-step');
    console.log(`📊 분석 단계: ${steps.length}개`);
    
    if (steps.length === 0) {
        console.error('❌ 분석 단계를 찾을 수 없습니다!');
        // 강제로 완료 처리
        setTimeout(() => completeAssessment(), 1000);
        return;
    }
    
    let currentStep = 0;
    
    const interval = setInterval(() => {
        if (currentStep < steps.length) {
            steps[currentStep].classList.add('active');
            console.log(`✅ 분석 단계 ${currentStep + 1}/${steps.length} 완료`);
            currentStep++;
        } else {
            clearInterval(interval);
            console.log('🎉 모든 분석 단계 완료!');
            
            // Complete analysis and redirect to dashboard
            setTimeout(() => {
                completeAssessment();
            }, 1000);
        }
    }, 1500);
}

// Complete assessment
function completeAssessment() {
    console.log('📊 진단 완료 처리 시작...');
    
    // Calculate results
    const results = calculateKAPPResults();
    
    console.log('✅ KAPP 결과 계산 완료:', results);
    console.log('📊 점수:', results.scores);
    console.log('👤 사용자 정보:', results.userData);
    
    // Save to localStorage
    try {
        const resultsJSON = JSON.stringify(results);
        localStorage.setItem('kapp_assessment_result', resultsJSON);
        localStorage.setItem('assessment_result', resultsJSON); // 기존 대시보드용
        
        console.log('💾 결과 저장 완료 (localStorage)');
        console.log('📏 저장된 데이터 크기:', resultsJSON.length, 'bytes');
        
        // 저장 확인
        const saved = localStorage.getItem('kapp_assessment_result');
        if (saved) {
            console.log('✅ 저장 검증 완료: localStorage에서 데이터 확인됨');
        } else {
            console.error('❌ 저장 검증 실패: localStorage에서 데이터 없음');
        }
    } catch (error) {
        console.error('❌ 저장 실패:', error);
        showNotification('결과 저장에 실패했습니다.', 'error');
        return;
    }
    
    // Show notification
    showNotification('KAPP 진단이 완료되었습니다!', 'success');
    
    // Redirect to dashboard
    console.log('🔄 KAPP 대시보드로 리다이렉트 중...');
    setTimeout(() => {
        // ✅ dashboard-kapp.html로 이동
        window.location.href = 'dashboard-kapp.html';
    }, 1500);
}

// Calculate KAPP results
function calculateKAPPResults() {
    const { userData, answers, questionHistory, knowledgeLevel, etrayActions, etrayDuration } = kappState;
    
    // Calculate scores per category
    const scores = {
        knowledge: calculateKnowledgeScore(),
        application: calculateApplicationScore(),
        performance: calculatePerformanceScore(),
        productivity: calculateProductivityScore()
    };
    
    return {
        userData: userData,
        scores: scores,
        overallScore: Math.round((scores.knowledge + scores.application + scores.performance + scores.productivity) / 4),
        knowledgeLevel: knowledgeLevel,
        answers: answers,
        questionHistory: questionHistory,
        etrayActions: etrayActions,
        etrayDuration: etrayDuration,
        timestamp: new Date().toISOString()
    };
}

// Calculate Knowledge score
function calculateKnowledgeScore() {
    return Math.round(kappState.knowledgeLevel * 20); // 1-5 level to 20-100 score
}

// Calculate Application score
function calculateApplicationScore() {
    const appQuestions = kappState.questionHistory.filter(q => q.category === 'application');
    let correct = 0;
    
    appQuestions.forEach(q => {
        if (kappState.answers[q.id] === q.answer) correct++;
    });
    
    return appQuestions.length > 0 ? Math.round((correct / appQuestions.length) * 100) : 75;
}

// Calculate Performance score
function calculatePerformanceScore() {
    const perfQuestions = kappState.questionHistory.filter(q => q.category === 'performance');
    let correct = 0;
    
    perfQuestions.forEach(q => {
        if (kappState.answers[q.id] === q.answer) correct++;
    });
    
    return perfQuestions.length > 0 ? Math.round((correct / perfQuestions.length) * 100) : 70;
}

// Calculate Productivity score
function calculateProductivityScore() {
    // Analyze E-tray performance
    const { etrayActions, etrayDuration } = kappState;
    
    // Priority handling score
    const highPriorityHandled = etrayActions.filter(a => a.emailId === 'e1' && a.action === 'reply').length > 0;
    const efficiencyScore = etrayDuration < 600000 ? 100 : 70; // Under 10 minutes
    
    return highPriorityHandled ? efficiencyScore : Math.max(60, efficiencyScore - 20);
}

// Update progress
function updateProgress() {
    const steps = {
        userInfo: 0,
        knowledge: 25,
        application: 50,
        performance: 75,
        productivity: 90,
        analysis: 100
    };
    
    const progress = steps[kappState.currentStep] || 0;
    document.getElementById('progressFill').style.width = `${progress}%`;
    document.getElementById('progressPercent').textContent = progress;
    
    const stepNames = {
        userInfo: '정보 입력',
        knowledge: '지식 측정',
        application: '적용 평가',
        performance: '성과 분석',
        productivity: '생산성 측정',
        analysis: '결과 분석'
    };
    
    document.getElementById('currentStep').textContent = stepNames[kappState.currentStep] || '';
}

// Update adaptive info
function updateAdaptiveInfo() {
    const info = document.getElementById('adaptiveInfo');
    if (kappState.currentCategory === 'knowledge') {
        info.textContent = `현재 지식 수준: Lv.${Math.round(kappState.knowledgeLevel)} / 난이도 자동 조정 중`;
    } else {
        info.textContent = '';
    }
}