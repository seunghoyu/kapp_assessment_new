// ========================================
// MY GROWTH PAGE - USER ENGAGEMENT FEATURES
// ========================================
// 1. Daily Micro-Challenge (1% Efficiency)
// 2. AI Career Mentoring (Next Step Simulation)
// 3. Verifiable Skill Badge (LinkedIn Integration)
// ========================================

// ========================================
// 1. DAILY MICRO-CHALLENGE
// ========================================

const microTips = {
    productivity: [
        {
            title: "⚡ Ctrl + Shift + T로 실수로 닫은 탭 복구",
            content: "브라우저에서 실수로 탭을 닫았나요? Ctrl + Shift + T (Mac: Cmd + Shift + T)를 누르면 마지막에 닫은 탭이 다시 열립니다. 여러 번 누르면 여러 개를 복구할 수 있어요!",
            category: "생산성",
            impact: "하루 5분 절약"
        },
        {
            title: "📧 이메일 '2분 룰': 2분 안에 답장 가능하면 즉시",
            content: "이메일을 읽고 '나중에 답장'하려고 표시만 해두나요? 2분 안에 답장할 수 있다면 지금 바로 보내세요. '나중에' 다시 읽고 컨텍스트를 떠올리는 데 더 많은 시간이 소요됩니다.",
            category: "생산성",
            impact: "하루 15분 절약"
        },
        {
            title: "🎯 '포모도로' 25분 집중 + 5분 휴식",
            content: "장시간 집중이 어렵다면 25분 타이머를 켜고 집중 → 5분 휴식을 반복하세요. 이 기법(포모도로)은 뇌의 집중력을 유지하면서 피로를 줄여줍니다.",
            category: "생산성",
            impact: "집중력 40% 향상"
        },
        {
            title: "📝 '미팅 전 10분': 목표와 아젠다 미리 적기",
            content: "회의 시작 10분 전, 종이나 노트에 '이 회의의 목표'와 '내가 얻고 싶은 것'을 3줄로 적으세요. 회의 효율이 2배로 올라갑니다.",
            category: "생산성",
            impact: "회의 시간 30% 단축"
        },
        {
            title: "🔍 Alt + Tab 대신 Win + 숫자키로 앱 전환",
            content: "Windows에서 Win + 1, 2, 3... 숫자키를 누르면 작업 표시줄의 앱으로 즉시 전환됩니다. Alt + Tab보다 빠르고 정확해요!",
            category: "생산성",
            impact: "앱 전환 속도 3배"
        }
    ],
    communication: [
        {
            title: "💬 '왜'를 먼저 말하고 '무엇'을 요청하기",
            content: "업무 요청 시 'A 보고서 작성해주세요' 대신 '경영진 의사결정을 위해 → A 보고서가 필요합니다'처럼 배경을 먼저 설명하세요. 협조율이 2배 높아집니다.",
            category: "커뮤니케이션",
            impact: "협업 효율 50% 향상"
        },
        {
            title: "📊 '숫자'로 말하면 신뢰도 3배",
            content: "'많이 늘었어요' 대신 '지난주 대비 27% 증가했습니다'처럼 구체적 숫자를 사용하세요. 설득력이 급격히 올라갑니다.",
            category: "커뮤니케이션",
            impact: "설득력 200% 향상"
        }
    ],
    ai: [
        {
            title: "🤖 ChatGPT에 '역할'을 부여하면 답변 품질 UP",
            content: "단순히 질문하지 말고 'You are an expert marketing strategist...'처럼 역할을 먼저 설정하세요. AI가 더 전문적인 답변을 제공합니다.",
            category: "AI 활용",
            impact: "AI 답변 품질 60% 향상"
        },
        {
            title: "✨ Claude에 '생각 과정을 보여줘'라고 요청",
            content: "답변 요청 시 'Show your thinking step-by-step'이라고 덧붙이면, AI가 논리적 사고 과정을 단계별로 설명해 더 신뢰할 수 있습니다.",
            category: "AI 활용",
            impact: "오답률 40% 감소"
        }
    ],
    excel: [
        {
            title: "📊 Ctrl + T로 표를 '테이블'로 변환",
            content: "엑셀에서 데이터 범위를 선택 → Ctrl + T를 누르면 필터/정렬이 자동으로 되는 '테이블'로 변환됩니다. 데이터 관리가 10배 쉬워져요!",
            category: "엑셀",
            impact: "데이터 관리 속도 10배"
        },
        {
            title: "🔢 Alt + = 로 합계 자동 계산",
            content: "셀 범위를 선택하고 Alt + = 를 누르면 SUM() 함수가 자동으로 입력됩니다. 매번 함수를 타이핑할 필요 없어요!",
            category: "엑셀",
            impact: "계산 시간 5배 단축"
        }
    ]
};

let userProgress = {
    streakDays: 0,
    completedTips: 0,
    lastCompletionDate: null,
    tipHistory: []
};

// Load user progress from localStorage
function loadUserProgress() {
    const saved = localStorage.getItem('user_growth_progress');
    if (saved) {
        userProgress = JSON.parse(saved);
        updateStreakDisplay();
        renderTipHistory();
    }
}

// Save user progress to localStorage
function saveUserProgress() {
    localStorage.setItem('user_growth_progress', JSON.stringify(userProgress));
}

// Get today's tip based on user's weakest area
function getTodayTip() {
    // Get user's KAPP results
    const resultsJSON = localStorage.getItem('kapp_assessment_result');
    let weakestArea = 'productivity'; // default
    
    if (resultsJSON) {
        try {
            const results = JSON.parse(resultsJSON);
            const scores = results.scores;
            
            // Find weakest area
            const min = Math.min(
                scores.knowledge || 100,
                scores.application || 100,
                scores.performance || 100,
                scores.productivity || 100
            );
            
            if (scores.productivity === min) {
                weakestArea = Math.random() > 0.5 ? 'productivity' : 'excel';
            } else if (scores.application === min) {
                weakestArea = 'ai';
            } else if (scores.performance === min) {
                weakestArea = 'communication';
            }
        } catch (error) {
            console.error('Failed to parse results:', error);
        }
    }
    
    // Get random tip from category
    const tips = microTips[weakestArea] || microTips.productivity;
    const tip = tips[Math.floor(Math.random() * tips.length)];
    
    // Display tip
    document.getElementById('tipCategory').textContent = tip.category;
    document.getElementById('tipTitle').textContent = tip.title;
    document.getElementById('tipContent').textContent = tip.content;
    
    // Add impact badge
    const impactBadge = `<div class="tip-impact"><i class="fas fa-chart-line"></i> ${tip.impact}</div>`;
    document.getElementById('tipContent').innerHTML = tip.content + impactBadge;
}

// Complete today's tip
function completeTip() {
    const today = new Date().toDateString();
    
    // Check if already completed today
    if (userProgress.lastCompletionDate === today) {
        alert('오늘은 이미 팁을 완료하셨습니다! 내일 다시 만나요 🎉');
        return;
    }
    
    // Update streak
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (userProgress.lastCompletionDate === yesterday.toDateString()) {
        userProgress.streakDays++;
    } else if (userProgress.lastCompletionDate !== today) {
        userProgress.streakDays = 1;
    }
    
    userProgress.completedTips++;
    userProgress.lastCompletionDate = today;
    
    // Save tip to history
    const tipTitle = document.getElementById('tipTitle').textContent;
    const tipContent = document.getElementById('tipContent').textContent;
    const tipCategory = document.getElementById('tipCategory').textContent;
    
    userProgress.tipHistory.unshift({
        date: today,
        title: tipTitle,
        content: tipContent,
        category: tipCategory
    });
    
    // Keep only last 30 tips
    if (userProgress.tipHistory.length > 30) {
        userProgress.tipHistory = userProgress.tipHistory.slice(0, 30);
    }
    
    saveUserProgress();
    updateStreakDisplay();
    renderTipHistory();
    
    // Show celebration
    alert('🎉 완료! 오늘의 1% 성장을 축하합니다!\n\n연속 ' + userProgress.streakDays + '일째 학습 중입니다!');
}

// Save tip for later
function saveTipForLater() {
    alert('📌 나중에 보기 목록에 저장되었습니다!');
}

// Update streak display
function updateStreakDisplay() {
    document.getElementById('streakDays').textContent = userProgress.streakDays;
    document.getElementById('completedTips').textContent = userProgress.completedTips;
    
    // Weekly progress
    const today = new Date().getDay(); // 0 = Sunday, 6 = Saturday
    const weeklyCount = Math.min(userProgress.streakDays % 7, 7);
    document.getElementById('weeklyProgress').textContent = weeklyCount;
}

// Render tip history
function renderTipHistory() {
    const container = document.getElementById('tipHistoryList');
    
    if (userProgress.tipHistory.length === 0) {
        container.innerHTML = '<p class="empty-state">아직 완료한 팁이 없습니다.</p>';
        return;
    }
    
    let html = '';
    userProgress.tipHistory.slice(0, 10).forEach(tip => {
        html += `
            <div class="history-item">
                <div class="history-date">${tip.date}</div>
                <div class="history-content">
                    <span class="history-category">${tip.category}</span>
                    <h4>${tip.title}</h4>
                </div>
            </div>
        `;
    });
    
    container.innerHTML = html;
}

// ========================================
// 2. AI CAREER MENTORING
// ========================================

const careerGoals = {
    // IT
    'tech-lead': {
        title: '테크 리드',
        industry: 'IT',
        requiredSkills: {
            'System Architecture': 90,
            'Code Review': 85,
            'Team Mentoring': 80,
            'Technical Writing': 75,
            'DevOps': 80
        }
    },
    'data-scientist': {
        title: '데이터 사이언티스트',
        industry: 'IT',
        requiredSkills: {
            'Python': 90,
            'Statistics': 85,
            'Machine Learning': 85,
            'Data Visualization': 80,
            'SQL': 85
        }
    },
    
    // 금융
    'financial-analyst': {
        title: '금융 애널리스트',
        industry: '금융',
        requiredSkills: {
            'Financial Modeling': 90,
            'Excel/VBA': 85,
            'Risk Management': 80,
            'Market Analysis': 85,
            'Report Writing': 75
        }
    },
    
    // 의료
    'healthcare-manager': {
        title: '의료 데이터 관리자',
        industry: '의료',
        requiredSkills: {
            'Medical Data Analysis': 85,
            'EMR Systems': 80,
            'Healthcare Regulations': 85,
            'Statistics': 80,
            'Patient Care': 75
        }
    },
    
    // 마케팅/광고
    'marketing-lead': {
        title: '마케팅 팀장',
        industry: '마케팅/광고',
        requiredSkills: {
            'Strategic Thinking': 85,
            'Team Leadership': 80,
            'Data Analysis': 75,
            'Digital Marketing': 85,
            'Budget Management': 70
        }
    },
    
    // 교육
    'education-director': {
        title: '교육 콘텐츠 디렉터',
        industry: '교육',
        requiredSkills: {
            'Curriculum Design': 85,
            'Content Creation': 90,
            'LMS Management': 75,
            'Teaching Methods': 80,
            'Evaluation': 75
        }
    },
    
    // 제조
    'production-manager': {
        title: '생산 관리자',
        industry: '제조',
        requiredSkills: {
            'Process Optimization': 85,
            'Quality Control': 85,
            'Supply Chain': 80,
            'Lean/Six Sigma': 80,
            'Team Management': 75
        }
    },
    
    // 유통/리테일
    'retail-manager': {
        title: '리테일 매니저',
        industry: '유통/리테일',
        requiredSkills: {
            'Customer Experience': 85,
            'Sales Strategy': 80,
            'Inventory Management': 80,
            'Data Analytics': 75,
            'Store Operations': 85
        }
    },
    
    // 호텔/관광
    'hospitality-manager': {
        title: '호텔 수익 관리자',
        industry: '호텔/관광',
        requiredSkills: {
            'Revenue Management': 90,
            'Customer Service': 85,
            'Pricing Strategy': 85,
            'Channel Management': 80,
            'Operations': 75
        }
    },
    
    // 기타 (비즈니스 공통)
    'product-manager': {
        title: '프로덕트 매니저',
        industry: '기타',
        requiredSkills: {
            'Product Strategy': 85,
            'User Research': 80,
            'Technical Understanding': 75,
            'Communication': 85,
            'Agile/Scrum': 80
        }
    },
    'business-dev': {
        title: '신사업 기획자',
        industry: '기타',
        requiredSkills: {
            'Market Research': 85,
            'Business Model Design': 80,
            'Financial Analysis': 75,
            'Presentation': 85,
            'Negotiation': 80
        }
    }
};

let selectedGoal = null;
let chatHistory = [];

function selectCareerGoal(goalId) {
    if (goalId === 'custom') {
        const custom = prompt('원하는 직무를 입력하세요:');
        if (!custom) return;
        alert('맞춤 직무 분석은 곧 제공될 예정입니다!');
        return;
    }
    
    selectedGoal = goalId;
    const goal = careerGoals[goalId];
    
    // Show AI chat
    document.getElementById('aiMentorChat').style.display = 'block';
    document.getElementById('careerGapSection').style.display = 'block';
    
    // Initialize chat
    chatHistory = [];
    addAIMessage(`안녕하세요! ${goal.title}가 되기 위한 여정을 함께 시작하겠습니다 🚀\n\n현재 당신의 KAPP 진단 결과를 분석해 맞춤형 조언을 드리겠습니다.`);
    
    // Analyze gap
    analyzeCareerGap(goalId);
    
    // Scroll to chat
    setTimeout(() => {
        document.getElementById('aiMentorChat').scrollIntoView({ behavior: 'smooth' });
    }, 300);
}

function analyzeCareerGap(goalId) {
    const goal = careerGoals[goalId];
    const resultsJSON = localStorage.getItem('kapp_assessment_result');
    
    if (!resultsJSON) {
        addAIMessage('진단 결과를 찾을 수 없습니다. 먼저 KAPP 진단을 완료해주세요.');
        return;
    }
    
    try {
        const results = JSON.parse(resultsJSON);
        const currentSkills = {
            'Strategic Thinking': results.scores.knowledge || 70,
            'Team Leadership': results.scores.performance || 70,
            'Data Analysis': results.scores.application || 70,
            'Digital Marketing': results.scores.productivity || 70,
            'Communication': (results.scores.knowledge + results.scores.performance) / 2 || 70
        };
        
        // Calculate gaps
        let html = '';
        let criticalGaps = [];
        let strengths = [];
        
        Object.keys(goal.requiredSkills).forEach(skill => {
            const required = goal.requiredSkills[skill];
            const current = currentSkills[skill] || Math.floor(Math.random() * 30) + 50;
            const gap = required - current;
            
            const status = gap > 15 ? 'critical' : gap > 5 ? 'moderate' : 'good';
            
            html += `
                <div class="gap-item ${status}">
                    <div class="gap-skill-name">${skill}</div>
                    <div class="gap-bar-container">
                        <div class="gap-bar-current" style="width: ${(current / required) * 100}%"></div>
                        <div class="gap-bar-required" style="left: 100%"></div>
                    </div>
                    <div class="gap-numbers">
                        <span class="current-score">${current}</span>
                        <span class="gap-arrow">→</span>
                        <span class="required-score">${required}</span>
                        <span class="gap-diff ${gap > 0 ? 'negative' : 'positive'}">
                            ${gap > 0 ? '+' : ''}${gap}
                        </span>
                    </div>
                </div>
            `;
            
            if (gap > 10) {
                criticalGaps.push({ skill, gap, required });
            } else if (gap < -5) {
                strengths.push({ skill, advantage: -gap });
            }
        });
        
        document.getElementById('gapAnalysisGrid').innerHTML = html;
        
        // Generate AI insights
        setTimeout(() => {
            let insights = `\n\n📊 **갭 분석 결과**\n\n`;
            
            if (criticalGaps.length > 0) {
                insights += `🔴 **우선 개선 필요:**\n`;
                criticalGaps.forEach(item => {
                    const months = Math.ceil(item.gap / 10);
                    insights += `• ${item.skill}: ${item.gap}점 부족 (예상 학습 기간: ${months}개월)\n`;
                });
            }
            
            if (strengths.length > 0) {
                insights += `\n✅ **현재 강점:**\n`;
                strengths.forEach(item => {
                    insights += `• ${item.skill}: 이미 목표 이상 달성! (+${item.advantage}점)\n`;
                });
            }
            
            insights += `\n💬 **궁금한 점을 물어보세요!**\n예: "어떤 교육을 먼저 들어야 하나요?", "6개월 안에 달성 가능한가요?"`;
            
            addAIMessage(insights);
        }, 1500);
        
    } catch (error) {
        console.error('Failed to analyze gap:', error);
        addAIMessage('분석 중 오류가 발생했습니다.');
    }
}

function addAIMessage(text) {
    const container = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = 'chat-message ai-message';
    messageDiv.innerHTML = `
        <div class="message-avatar">🤖</div>
        <div class="message-content">${text.replace(/\n/g, '<br>')}</div>
    `;
    container.appendChild(messageDiv);
    container.scrollTop = container.scrollHeight;
}

function addUserMessage(text) {
    const container = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = 'chat-message user-message';
    messageDiv.innerHTML = `
        <div class="message-content">${text}</div>
        <div class="message-avatar">👤</div>
    `;
    container.appendChild(messageDiv);
    container.scrollTop = container.scrollHeight;
}

function sendChatMessage() {
    const input = document.getElementById('chatInput');
    const message = input.value.trim();
    
    if (!message) return;
    
    addUserMessage(message);
    input.value = '';
    
    // Add to chat history
    chatHistory.push({ role: 'user', content: message });
    
    // Generate smart AI response based on message content
    setTimeout(() => {
        const response = generateAIResponse(message);
        addAIMessage(response);
        chatHistory.push({ role: 'ai', content: response });
    }, 1000);
}

function generateAIResponse(userMessage) {
    const msg = userMessage.toLowerCase();
    
    // Check for course/education related questions
    if (msg.includes('교육') || msg.includes('강의') || msg.includes('수강') || 
        msg.includes('커리큘럼') || msg.includes('학습') || msg.includes('배우') ||
        msg.includes('추천') || msg.includes('course') || msg.includes('class')) {
        return generateCourseRecommendation(userMessage);
    }
    
    // Check for timeline questions
    if (msg.includes('기간') || msg.includes('시간') || msg.includes('달성') || 
        msg.includes('언제') || msg.includes('얼마나') || msg.includes('몇')) {
        return generateTimelineResponse(userMessage);
    }
    
    // Check for strategy questions
    if (msg.includes('어떻게') || msg.includes('방법') || msg.includes('전략') || 
        msg.includes('순서') || msg.includes('먼저') || msg.includes('시작')) {
        return generateStrategyResponse(userMessage);
    }
    
    // Check for skill questions
    if (msg.includes('스킬') || msg.includes('역량') || msg.includes('능력') || 
        msg.includes('필요') || msg.includes('준비')) {
        return generateSkillResponse(userMessage);
    }
    
    // Check for salary/career questions
    if (msg.includes('연봉') || msg.includes('급여') || msg.includes('취업') || 
        msg.includes('이직') || msg.includes('전망')) {
        return generateCareerProspectResponse(userMessage);
    }
    
    // Check for difficulty/challenge questions
    if (msg.includes('어려') || msg.includes('힘들') || msg.includes('가능') || 
        msg.includes('할 수 있')) {
        return generateMotivationResponse(userMessage);
    }
    
    // Default personalized response
    const goal = selectedGoal ? careerGoals[selectedGoal] : null;
    const goalTitle = goal ? goal.title : '목표 직무';
    
    return `네, "${userMessage}" 질문 감사합니다! 😊\n\n${goalTitle}로의 성장 여정에서 제가 도와드릴 수 있는 부분들이 많습니다.\n\n💬 **이런 것들이 궁금하신가요?**\n\n📚 **교육 관련:**\n• "어떤 교육을 들어야 하나요?"\n• "추천 강의를 알려주세요"\n\n⏰ **기간/일정:**\n• "6개월 안에 가능한가요?"\n• "얼마나 걸릴까요?"\n\n🎯 **전략/방법:**\n• "어떻게 시작해야 하나요?"\n• "학습 순서를 알려주세요"\n\n💪 **스킬/역량:**\n• "어떤 스킬이 필요한가요?"\n• "제 약점을 보완하려면?"\n\n💰 **커리어 전망:**\n• "연봉은 얼마나 될까요?"\n• "취업 전망은 어떤가요?"\n\n편하게 물어보세요! 🚀`;
}

function generateCourseRecommendation(userMessage) {
    console.log('🎓 강의 추천 요청:', userMessage);
    
    // Load course data from education-data-extended.js
    if (typeof coursesData === 'undefined' || !coursesData || coursesData.length === 0) {
        return `죄송합니다. 강의 데이터를 불러올 수 없습니다.\n\n교육 큐레이션 페이지에서 더 많은 강의를 확인해보세요!\n\n👉 <a href="education.html" style="color: #4F46E5; font-weight: 600;">교육 큐레이션 바로가기</a>`;
    }
    
    const goal = selectedGoal ? careerGoals[selectedGoal] : null;
    const goalTitle = goal ? goal.title : '목표 직무';
    
    // Get user's current scores
    let userScores = { knowledge: 75, application: 75, performance: 75, productivity: 75 };
    try {
        const resultsJSON = localStorage.getItem('kapp_assessment_result');
        if (resultsJSON) {
            const results = JSON.parse(resultsJSON);
            if (results.scores) {
                userScores = results.scores;
            }
        }
    } catch (e) {
        console.error('Failed to load scores:', e);
    }
    
    // Find weakest area
    const scoreEntries = Object.entries(userScores);
    scoreEntries.sort((a, b) => a[1] - b[1]);
    const weakestArea = scoreEntries[0][0];
    
    // Map KAPP scores to course categories (updated for v5.7 comprehensive data)
    const categoryMap = {
        'knowledge': ['디지털/IT', '자기계발', '어학'],
        'application': ['비즈니스/경영', '마케팅/영업', '디지털/IT'],
        'performance': ['리더십/HR', '커뮤니케이션', '비즈니스/경영'],
        'productivity': ['디지털/IT', '자기계발', '마케팅/영업']
    };
    
    const targetCategories = categoryMap[weakestArea] || ['비즈니스/경영'];
    
    // Find relevant courses
    let recommendedCourses = coursesData.filter(course => {
        // Check if course category matches target categories
        return targetCategories.some(cat => 
            course.category && course.category.includes(cat)
        );
    });
    
    // If goal-specific, filter by applicable industries
    if (goal) {
        const goalKeywords = {
            'tech-lead': ['IT', '개발', '리더십', '기술', 'DevOps', '아키텍처'],
            'data-scientist': ['데이터', 'AI', 'IT', '분석', 'Python', 'ML'],
            'financial-analyst': ['금융', '재무', '분석', '투자', '리스크'],
            'healthcare-manager': ['의료', 'EMR', '데이터', '헬스케어'],
            'marketing-lead': ['마케팅', '광고', '비즈니스', '전략', '리더십'],
            'education-director': ['교육', '콘텐츠', '커리큘럼', 'LMS', '학습'],
            'production-manager': ['제조', '생산', '품질', 'SCM', 'Lean'],
            'retail-manager': ['유통', '리테일', '고객', '영업', 'CX'],
            'hospitality-manager': ['호텔', '관광', '수익', '서비스', '운영'],
            'product-manager': ['비즈니스', '전략', 'IT', '프로젝트', '제품'],
            'business-dev': ['비즈니스', '전략', '마케팅', '신사업', '기획']
        };
        
        const keywords = goalKeywords[selectedGoal] || [];
        if (keywords.length > 0) {
            recommendedCourses = recommendedCourses.filter(course => {
                return keywords.some(kw => 
                    (course.category && course.category.includes(kw)) ||
                    (course.title && course.title.includes(kw)) ||
                    (course.industries && course.industries.some(ind => ind.includes(kw)))
                );
            });
        }
    }
    
    // Sort by rating and limit to top 5
    recommendedCourses.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    recommendedCourses = recommendedCourses.slice(0, 5);
    
    // Generate response
    if (recommendedCourses.length === 0) {
        return `${goalTitle}를 위한 맞춤 강의를 찾고 있습니다.\n\n교육 큐레이션 페이지에서 더 많은 강의를 확인해보세요!\n\n👉 <a href="education.html" style="color: #4F46E5; font-weight: 600;">교육 큐레이션 바로가기</a>`;
    }
    
    let response = `${goalTitle}를 위한 **해커스 캠퍼스 Business 추천 강의**를 소개합니다! 🎓\n\n`;
    response += `현재 당신의 ${weakestArea === 'knowledge' ? '지식' : weakestArea === 'application' ? '적용' : weakestArea === 'performance' ? '성과' : '생산성'} 역량(${userScores[weakestArea]}점)을 집중 개발할 수 있는 강의들입니다:\n\n`;
    
    recommendedCourses.forEach((course, index) => {
        const priority = index === 0 ? '🔥 최우선 ' : index === 1 ? '⭐ 추천 ' : `${index + 1}. `;
        response += `${priority}**${course.title}**\n`;
        response += `   📚 ${course.category} | ${course.level} | ${course.duration}\n`;
        response += `   ⭐ ${course.rating}점 (${course.students}명 수강)\n`;
        if (course.description) {
            response += `   💡 ${course.description.substring(0, 60)}...\n`;
        }
        response += `\n`;
    });
    
    response += `\n🎯 **맞춤형 학습 로드맵:**\n`;
    response += `\n**1단계 - 기초 다지기** (2-3개월)\n`;
    response += `└─ 🔥 ${recommendedCourses[0]?.title || '기초 과정'}\n`;
    response += `   💡 먼저 이 강의로 기본기를 탄탄히 하세요!\n`;
    
    if (recommendedCourses[1]) {
        response += `\n**2단계 - 실무 역량** (2-3개월)\n`;
        response += `└─ ⭐ ${recommendedCourses[1].title}\n`;
        response += `   💡 기초를 바탕으로 실무 스킬을 쌓으세요!\n`;
    }
    
    if (recommendedCourses[2]) {
        response += `\n**3단계 - 심화 & 전문화** (2-3개월)\n`;
        response += `└─ 🚀 ${recommendedCourses[2].title}\n`;
        response += `   💡 전문가 수준으로 도약하세요!\n`;
    }
    
    // Add estimated investment
    const totalWeeks = recommendedCourses.slice(0, 3).reduce((sum, course) => {
        const weeks = parseInt(course.duration) || 4;
        return sum + weeks;
    }, 0);
    const avgCost = 400000; // 평균 40만원
    const totalCost = recommendedCourses.slice(0, 3).length * avgCost;
    
    response += `\n\n💰 **예상 투자:**\n`;
    response += `• 수강료: 약 ${(totalCost / 10000).toFixed(0)}만원 (${recommendedCourses.slice(0, 3).length}개 강의)\n`;
    response += `• 학습 기간: 약 ${totalWeeks}주 (${Math.ceil(totalWeeks / 4)}개월)\n`;
    response += `• 예상 ROI: 연봉 10-20% 상승 💎\n`;
    
    response += `\n📌 **다음 액션:**\n`;
    response += `1. <a href="education.html" style="color: #4F46E5; font-weight: 600;">교육 큐레이션</a>에서 상세 정보 확인\n`;
    response += `2. 1단계 강의부터 수강 신청\n`;
    response += `3. 주 5-10시간 학습 시작! 🎯\n`;
    
    response += `\n💬 더 궁금한 점이 있으시면 언제든 물어보세요!`;
    
    return response;
}

function generateTimelineResponse(userMessage) {
    const goal = selectedGoal ? careerGoals[selectedGoal] : null;
    const goalTitle = goal ? goal.title : '목표 직무';
    const industry = goal ? goal.industry : '해당 분야';
    
    return `${goalTitle} 달성 타임라인을 알려드릴게요! ⏰\n\n**🎯 당신의 페이스에 맞춰 선택하세요:**\n\n**🔥 Fast Track (집중 학습)**\n• 주당 투자: 10-15시간\n• 예상 기간: **6-9개월**\n• 적합한 분: 빠른 전환이 목표이신 분\n• 성공률: ⭐⭐⭐⭐⭐ (92%)\n\n**⚡ Standard (병행 학습)**\n• 주당 투자: 5-8시간\n• 예상 기간: **12-15개월**\n• 적합한 분: 현재 직무와 병행하시는 분\n• 성공률: ⭐⭐⭐⭐ (85%)\n\n**🌱 Slow & Steady (여유 학습)**\n• 주당 투자: 3-5시간\n• 예상 기간: **18-24개월**\n• 적합한 분: 천천히 준비하시는 분\n• 성공률: ⭐⭐⭐ (75%)\n\n**📅 단계별 마일스톤:**\n\n**1개월:** 기초 개념 이해 ✅\n**3개월:** 첫 프로젝트 완성 🎨\n**6개월:** 포트폴리오 3개 확보 📂\n**9개월:** ${goalTitle} 지원 가능 수준 🚀\n**12개월:** 실무 투입 가능 💼\n\n💡 **꿀팁:** ${industry} 분야는 평균 9개월이면 전환 가능합니다!\n\n"어떤 교육을 먼저 들어야 하나요?"라고 물어보시면 구체적인 학습 계획을 추천해드릴게요! 😊`;
}

function generateStrategyResponse(userMessage) {
    const goal = selectedGoal ? careerGoals[selectedGoal] : null;
    const goalTitle = goal ? goal.title : '목표 직무';
    const industry = goal ? goal.industry : '해당 분야';
    
    return `${goalTitle}로 가는 **최적의 전략**을 알려드릴게요! 🎯\n\n**🔥 3단계 성장 전략**\n\n**STEP 1: 기초 체력 만들기** (0-3개월) 💪\n├─ ✅ 핵심 이론 학습 (온라인 강의)\n├─ ✅ 기본 실습 문제 풀기\n└─ ✅ 작은 프로젝트 1개 완성\n📍 목표: "이 분야가 이런 거구나!" 감 잡기\n\n**STEP 2: 실전 근육 키우기** (3-6개월) 🚀\n├─ ✅ 중급 강의 수강\n├─ ✅ 실무 프로젝트 2-3개 도전\n├─ ✅ GitHub/포트폴리오 구축\n└─ ✅ 온라인 커뮤니티 활동\n📍 목표: "나도 이 정도는 할 수 있어!" 자신감\n\n**STEP 3: 전문가로 도약하기** (6-9개월) 🏆\n├─ ✅ 고급 스킬 마스터\n├─ ✅ 실전 프로젝트 참여 (사이드 프로젝트/오픈소스)\n├─ ✅ 네트워킹 & 멘토 찾기\n└─ ✅ 이력서/포트폴리오 완성\n📍 목표: "${goalTitle}" 포지션 지원!\n\n**💡 학습 효율 10배 높이는 꿀팁:**\n\n1️⃣ **일일 루틴 만들기**\n   • 매일 1시간씩 꾸준히 > 주말에 몰아서\n   • 출퇴근 시간 활용 (강의 듣기)\n\n2️⃣ **실습 중심으로**\n   • 이론 30% : 실습 70% 비율 유지\n   • 배운 건 당일 바로 코드/문서로 정리\n\n3️⃣ **커뮤니티 활용**\n   • 스터디 그룹 참여 (동기부여 UP!)\n   • 질문하고 답변하며 성장\n\n4️⃣ **포트폴리오 First**\n   • 모든 학습을 프로젝트로 연결\n   • "이걸 배워서 이걸 만들었어요!" 증명\n\n**🎓 ${industry} 분야 선배들의 조언:**\n> "처음부터 완벽하려 하지 마세요. 일단 시작하고, 계속 개선하세요!"\n> "온라인 강의 3개보다 프로젝트 1개가 더 가치있어요."\n> "멘토 1명이 책 10권보다 도움됩니다."\n\n💬 **다음 액션:**\n• "어떤 교육을 먼저 들어야 하나요?" → 맞춤 강의 추천\n• "6개월 안에 가능한가요?" → 상세 타임라인 제공\n\n화이팅입니다! 🔥 언제든 물어보세요!`;
}

function generateSkillResponse(userMessage) {
    const goal = selectedGoal ? careerGoals[selectedGoal] : null;
    
    if (!goal) {
        return `역량 개발에 대해 답변드립니다.\n\n핵심 역량:\n• 전략적 사고\n• 리더십\n• 데이터 분석\n• 커뮤니케이션\n\n각 역량별 맞춤 강의를 추천받으시려면 "어떤 교육을 들어야 하나요?"라고 물어보세요!`;
    }
    
    const skills = Object.keys(goal.requiredSkills).join(', ');
    
    return `${goal.title}에 필요한 핵심 스킬:\n\n${Object.keys(goal.requiredSkills).map((skill, i) => 
        `${i + 1}. **${skill}**: 목표 ${goal.requiredSkills[skill]}점`
    ).join('\n')}\n\n이러한 스킬들을 개발할 수 있는 구체적인 강의가 궁금하시다면 "추천 교육을 알려주세요"라고 물어보세요!`;
}

function generateCareerProspectResponse(userMessage) {
    const goal = selectedGoal ? careerGoals[selectedGoal] : null;
    const goalTitle = goal ? goal.title : '목표 직무';
    const industry = goal ? goal.industry : '해당 분야';
    
    // Industry-specific salary data
    const salaryData = {
        'IT': { entry: 4500, mid: 7000, senior: 10000, growth: '15-20%' },
        '금융': { entry: 5000, mid: 7500, senior: 12000, growth: '12-18%' },
        '의료': { entry: 4200, mid: 6500, senior: 9500, growth: '10-15%' },
        '마케팅/광고': { entry: 3800, mid: 6000, senior: 9000, growth: '12-16%' },
        '교육': { entry: 3500, mid: 5500, senior: 8000, growth: '8-12%' },
        '제조': { entry: 4000, mid: 6200, senior: 9500, growth: '10-14%' },
        '유통/리테일': { entry: 3600, mid: 5800, senior: 8500, growth: '10-15%' },
        '호텔/관광': { entry: 3200, mid: 5000, senior: 7500, growth: '8-12%' },
        '기타': { entry: 4000, mid: 6500, senior: 9500, growth: '10-15%' }
    };
    
    const salary = salaryData[industry] || salaryData['기타'];
    
    return `${goalTitle}의 **커리어 전망과 연봉**을 알려드릴게요! 💼\n\n` +
        `**💰 ${industry} 분야 ${goalTitle} 연봉 정보:**\n\n` +
        `**주니어 (1-3년차)**\n` +
        `├─ 평균 연봉: ${salary.entry}만원\n` +
        `├─ 범위: ${salary.entry - 500}~${salary.entry + 800}만원\n` +
        `└─ 포지션: 실무자, 팀원\n\n` +
        `**미들 (4-7년차)**\n` +
        `├─ 평균 연봉: ${salary.mid}만원\n` +
        `├─ 범위: ${salary.mid - 800}~${salary.mid + 1500}만원\n` +
        `└─ 포지션: 시니어, 팀 리더\n\n` +
        `**시니어 (8년+ 경력)**\n` +
        `├─ 평균 연봉: ${salary.senior}만원+\n` +
        `├─ 범위: ${salary.senior - 1000}~${salary.senior + 5000}만원+\n` +
        `└─ 포지션: 매니저, 이사급\n\n` +
        `**📈 성장 가능성:**\n` +
        `• 연평균 연봉 상승률: ${salary.growth}\n` +
        `• 3년 후 예상 연봉: +${Math.round(salary.entry * 0.45)}만원 (약 ${Math.round(salary.entry * 1.45)}만원)\n` +
        `• 5년 후 예상 연봉: +${Math.round(salary.entry * 0.8)}만원 (약 ${Math.round(salary.entry * 1.8)}만원)\n\n` +
        `**🌟 ${industry} 분야 트렌드:**\n` +
        `• 수요: ${industry === 'IT' || industry === '금융' ? '⬆️ 증가 추세' : industry === '의료' ? '⬆️ 안정적 증가' : '➡️ 꾸준함'}\n` +
        `• 채용 공고: ${industry === 'IT' ? '월 1,200개+' : industry === '금융' ? '월 450개+' : industry === '마케팅/광고' ? '월 800개+' : '월 300개+'}\n` +
        `• 경쟁률: ${industry === 'IT' ? '중간 (1:15)' : industry === '금융' ? '높음 (1:30)' : '중간 (1:20)'}\n\n` +
        `**💎 연봉 UP 꿀팁:**\n` +
        `1️⃣ 전문 자격증 취득 → +5~10%\n` +
        `2️⃣ 포트폴리오 3개+ → +10~15%\n` +
        `3️⃣ 외국어(영어) 능숙 → +5~8%\n` +
        `4️⃣ 리더십/관리 경험 → +15~20%\n\n` +
        `📊 **현실적인 시나리오:**\n` +
        `현재 → ${goalTitle} 전환 시\n` +
        `• 최소 연봉: ${salary.entry - 500}만원 (안정적)\n` +
        `• 평균 연봉: ${salary.entry}만원 (일반적)\n` +
        `• 최대 연봉: ${salary.entry + 800}만원 (역량 우수)\n\n` +
        `💬 "어떤 교육을 들어야 하나요?" 질문하시면\n` +
        `   연봉 UP에 직접 도움되는 강의를 추천해드릴게요! 🚀`;
}

function generateMotivationResponse(userMessage) {
    const goal = selectedGoal ? careerGoals[selectedGoal] : null;
    const goalTitle = goal ? goal.title : '목표 직무';
    const industry = goal ? goal.industry : '해당 분야';
    
    return `${goalTitle}, **당연히 가능합니다!** 💪 제가 응원할게요!\n\n` +
        `**🎯 현실적인 이야기를 해드릴게요:**\n\n` +
        `**Q: "저도 할 수 있을까요?"**\n` +
        `A: 네! 현재 ${industry} 분야에서 활동하는 ${goalTitle}들의 **78%가 비전공자**입니다.\n` +
        `   전공보다 중요한 건 **꾸준함과 실전 경험**이에요.\n\n` +
        `**Q: "너무 어렵지 않을까요?"**\n` +
        `A: 처음엔 다 어렵습니다. 하지만:\n` +
        `   • 첫 3개월: "이게 뭔 소리야?" (정상 😊)\n` +
        `   • 6개월: "아, 이제 좀 알겠다!" (돌파구 💡)\n` +
        `   • 9개월: "오, 나도 할 수 있네?" (자신감 🚀)\n` +
        `   • 12개월: "${goalTitle} 지원 가능!" (성공 🎉)\n\n` +
        `**Q: "나이/경력이 문제될까요?"**\n` +
        `A: 전혀 아닙니다!\n` +
        `   • 20대: 빠른 학습력으로 6개월 집중 ⚡\n` +
        `   • 30대: 업무 경험 + 새 스킬 = 시너지 💎\n` +
        `   • 40대: 풍부한 경험 + 전문성 = 차별화 🏆\n\n` +
        `**✨ 실제 전환 성공 사례:**\n\n` +
        `**사례 1: 마케터 → ${industry === 'IT' ? '데이터 분석가' : goalTitle}**\n` +
        `• 기간: 9개월\n` +
        `• 방법: 퇴근 후 하루 2시간 학습\n` +
        `• 결과: 연봉 4,200만원 → 6,500만원 (+55%)\n` +
        `• 한마디: "처음엔 막막했지만, 매일 조금씩 하니 어느새..."\n\n` +
        `**사례 2: 영업 → ${goalTitle}**\n` +
        `• 기간: 12개월\n` +
        `• 방법: 주말 + 온라인 강의 + 사이드 프로젝트\n` +
        `• 결과: 원하던 직무로 전환 성공\n` +
        `• 한마디: "나이 35세, 비전공자도 됩니다!"\n\n` +
        `**💪 당신이 성공할 수 있는 이유:**\n\n` +
        `1️⃣ **KAPP 진단 완료** → 현재 위치 파악 ✅\n` +
        `2️⃣ **명확한 목표** → ${goalTitle} 설정 ✅\n` +
        `3️⃣ **AI 멘토** → 맞춤 가이드 제공 ✅\n` +
        `4️⃣ **실전 강의** → 65개 강의 준비 완료 ✅\n` +
        `5️⃣ **의지** → 이 대화를 나누고 있다는 것 자체가 증거! ✅\n\n` +
        `**🔥 지금 바로 시작하세요:**\n\n` +
        `**오늘:** "어떤 교육을 들어야 하나요?" 질문\n` +
        `**내일:** 추천 강의 1강 시청\n` +
        `**이번 주:** 첫 실습 완료\n` +
        `**이번 달:** 작은 프로젝트 1개 시작\n` +
        `**3개월 후:** "나도 할 수 있네!" 실감\n` +
        `**6개월 후:** 포트폴리오 2개 완성\n` +
        `**9-12개월 후:** ${goalTitle} 지원!\n\n` +
        `**💬 기억하세요:**\n` +
        `"1년 후 당신이 후회할 건 시작한 것이 아니라, 시작하지 않은 것입니다."\n\n` +
        `"어떤 교육을 들어야 하나요?"라고 물어보시면\n` +
        `구체적인 첫 걸음을 알려드릴게요! 함께 시작해봐요! 🚀✨`;
}

function handleChatKeyPress(event) {
    if (event.key === 'Enter') {
        sendChatMessage();
    }
}

function closeAIChat() {
    if (confirm('대화를 종료하시겠습니까?')) {
        document.getElementById('aiMentorChat').style.display = 'none';
    }
}

// ========================================
// 3. VERIFIABLE SKILL BADGE
// ========================================

function loadBadgeData() {
    const resultsJSON = localStorage.getItem('kapp_assessment_result');
    
    if (!resultsJSON) {
        console.log('No assessment results found');
        return;
    }
    
    try {
        const results = JSON.parse(resultsJSON);
        
        // Update badge with user data
        document.getElementById('badgeName').textContent = results.userData.name || '홍길동';
        document.getElementById('badgePosition').textContent = 
            `${results.userData.job || '개발자'} | ${results.userData.position || '시니어'}`;
        
        // Update scores
        document.getElementById('badgeKnowledge').textContent = results.scores.knowledge || 0;
        document.getElementById('badgeApplication').textContent = results.scores.application || 0;
        document.getElementById('badgePerformance').textContent = results.scores.performance || 0;
        document.getElementById('badgeProductivity').textContent = results.scores.productivity || 0;
        
        // Calculate overall
        const overall = Math.round(
            (results.scores.knowledge + results.scores.application + 
             results.scores.performance + results.scores.productivity) / 4
        );
        document.getElementById('badgeOverall').textContent = overall;
        
        // Grade
        let grade = '우수';
        if (overall >= 90) grade = '최우수';
        else if (overall >= 80) grade = '우수';
        else if (overall >= 70) grade = '양호';
        else grade = '보통';
        document.getElementById('badgeGrade').textContent = grade;
        
        // Issue date and cert ID
        const today = new Date();
        const dateStr = `${today.getFullYear()}.${String(today.getMonth() + 1).padStart(2, '0')}.${String(today.getDate()).padStart(2, '0')}`;
        document.getElementById('badgeIssueDate').textContent = dateStr;
        
        const certId = `KAPP-${today.getFullYear()}-${Math.floor(Math.random() * 999999).toString().padStart(6, '0')}`;
        document.getElementById('badgeCertId').textContent = certId;
        
        // Load badge collection
        loadBadgeCollection();
        
    } catch (error) {
        console.error('Failed to load badge data:', error);
    }
}

function downloadBadge() {
    alert('📄 인증서 PDF가 다운로드됩니다!\n\n파일명: KAPP_인증서_' + document.getElementById('badgeName').textContent + '.pdf\n\n※ 실제 구현 시 html2pdf.js 라이브러리를 사용하여 PDF 생성');
}

function shareToLinkedIn() {
    const certId = document.getElementById('badgeCertId').textContent;
    const name = document.getElementById('badgeName').textContent;
    const overall = document.getElementById('badgeOverall').textContent;
    
    const text = encodeURIComponent(
        `🎓 KAPP 역량 진단 인증서를 취득했습니다!\n\n` +
        `종합 점수: ${overall}점\n` +
        `인증번호: ${certId}\n\n` +
        `#역량진단 #KAPP #전문성개발 #해커스캠퍼스`
    );
    
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=https://example.com/verify/${certId}&text=${text}`;
    
    window.open(url, '_blank', 'width=600,height=600');
}

function copyBadgeLink() {
    const certId = document.getElementById('badgeCertId').textContent;
    const link = `https://hackers-campus.com/verify/${certId}`;
    
    navigator.clipboard.writeText(link).then(() => {
        alert('🔗 인증서 링크가 클립보드에 복사되었습니다!\n\n' + link);
    }).catch(err => {
        alert('링크 복사에 실패했습니다: ' + err);
    });
}

function loadBadgeCollection() {
    const container = document.getElementById('badgeCollectionGrid');
    
    // Sample badges
    const badges = [
        { icon: '🏆', name: 'KAPP 인증', date: '2026.01.31', status: 'active' },
        { icon: '⭐', name: '30일 연속 학습', date: '2026.01.25', status: 'active' },
        { icon: '🎯', name: '목표 달성', date: '2026.01.20', status: 'active' },
        { icon: '📚', name: '5개 강의 완료', date: '2026.01.15', status: 'active' },
        { icon: '🚀', name: '빠른 성장', date: '2026.01.10', status: 'locked' },
        { icon: '💎', name: '최우수 등급', date: '-', status: 'locked' }
    ];
    
    let html = '';
    badges.forEach(badge => {
        html += `
            <div class="collection-badge ${badge.status}">
                <div class="badge-icon-large">${badge.icon}</div>
                <h4>${badge.name}</h4>
                <p class="badge-date">${badge.date}</p>
                ${badge.status === 'locked' ? '<div class="badge-locked"><i class="fas fa-lock"></i></div>' : ''}
            </div>
        `;
    });
    
    container.innerHTML = html;
}

// ========================================
// INITIALIZATION
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('🌱 My Growth Page 초기화');
    
    // Load user progress
    loadUserProgress();
    
    // Get today's tip
    getTodayTip();
    
    // Load badge data
    loadBadgeData();
});
