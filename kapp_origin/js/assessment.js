// Assessment Page Logic

// Assessment questions data
const assessmentQuestions = [
    // 문제 해결 역량
    {
        id: 1,
        category: "문제 해결",
        question: "복잡한 문제에 직면했을 때, 어떻게 접근하시나요?",
        description: "업무 중 예상치 못한 문제가 발생했을 때의 대응 방식을 선택해주세요.",
        options: [
            { text: "문제를 작은 단위로 나누어 체계적으로 분석한다", score: 5 },
            { text: "유사한 과거 사례를 찾아 참고한다", score: 4 },
            { text: "동료나 상사에게 조언을 구한다", score: 3 },
            { text: "일단 시도해보고 결과를 본다", score: 2 }
        ]
    },
    {
        id: 2,
        category: "문제 해결",
        question: "데이터를 활용하여 의사결정을 내리는 빈도는?",
        description: "업무 의사결정 시 데이터 분석을 얼마나 활용하시나요?",
        options: [
            { text: "항상 데이터를 수집하고 분석하여 결정한다", score: 5 },
            { text: "중요한 결정에서는 데이터를 참고한다", score: 4 },
            { text: "가끔 데이터를 확인한다", score: 3 },
            { text: "주로 경험과 직관으로 결정한다", score: 2 }
        ]
    },
    // 의사소통 역량
    {
        id: 3,
        category: "의사소통",
        question: "복잡한 개념을 다른 사람에게 설명하는 능력은?",
        description: "전문적인 내용을 비전문가에게 설명할 때의 자신감을 평가해주세요.",
        options: [
            { text: "누구에게나 쉽게 설명할 수 있다", score: 5 },
            { text: "대부분 잘 전달하지만 가끔 어려움이 있다", score: 4 },
            { text: "전문가에게는 잘 설명하지만 비전문가에게는 어렵다", score: 3 },
            { text: "설명하는 것이 다소 어렵다", score: 2 }
        ]
    },
    {
        id: 4,
        category: "의사소통",
        question: "팀 회의에서 당신의 역할은 주로 무엇인가요?",
        description: "회의 상황에서의 참여 스타일을 선택해주세요.",
        options: [
            { text: "적극적으로 의견을 제시하고 토론을 이끈다", score: 5 },
            { text: "필요할 때 의견을 제시한다", score: 4 },
            { text: "주로 경청하고 질문한다", score: 3 },
            { text: "조용히 듣는 편이다", score: 2 }
        ]
    },
    // 리더십 역량
    {
        id: 5,
        category: "리더십",
        question: "프로젝트를 주도적으로 이끈 경험이 있나요?",
        description: "리더 역할을 수행한 경험과 빈도를 평가해주세요.",
        options: [
            { text: "여러 프로젝트를 성공적으로 리드한 경험이 많다", score: 5 },
            { text: "몇 차례 프로젝트를 리드한 경험이 있다", score: 4 },
            { text: "소규모 태스크를 이끈 경험이 있다", score: 3 },
            { text: "리더 역할 경험이 거의 없다", score: 2 }
        ]
    },
    {
        id: 6,
        category: "리더십",
        question: "팀원들의 동기를 부여하는 방법은?",
        description: "팀 분위기를 개선하고 동기부여하는 능력을 선택해주세요.",
        options: [
            { text: "각자의 강점을 파악하고 맞춤형 동기부여를 한다", score: 5 },
            { text: "긍정적인 피드백과 격려를 자주 한다", score: 4 },
            { text: "목표를 명확히 제시하고 지원한다", score: 3 },
            { text: "팀워크보다 개인 업무에 집중한다", score: 2 }
        ]
    },
    // 학습 역량
    {
        id: 7,
        category: "학습",
        question: "새로운 기술이나 지식을 학습하는 빈도는?",
        description: "자기계발과 학습에 투자하는 시간을 평가해주세요.",
        options: [
            { text: "매일 또는 매주 새로운 것을 학습한다", score: 5 },
            { text: "한 달에 몇 번 학습 시간을 갖는다", score: 4 },
            { text: "필요할 때만 학습한다", score: 3 },
            { text: "거의 학습하지 않는다", score: 2 }
        ]
    },
    {
        id: 8,
        category: "학습",
        question: "학습한 내용을 실무에 적용하는 능력은?",
        description: "이론을 실전에 연결하는 능력을 평가해주세요.",
        options: [
            { text: "학습 즉시 업무에 적용하고 개선한다", score: 5 },
            { text: "시간을 두고 점진적으로 적용한다", score: 4 },
            { text: "일부만 실무에 활용한다", score: 3 },
            { text: "적용하는 데 어려움을 느낀다", score: 2 }
        ]
    },
    // 기술 역량
    {
        id: 9,
        category: "기술",
        question: "현재 직무에 필요한 도구/기술을 얼마나 활용하나요?",
        description: "업무 관련 도구와 기술의 숙련도를 평가해주세요.",
        options: [
            { text: "고급 기능까지 능숙하게 사용한다", score: 5 },
            { text: "주요 기능은 잘 활용한다", score: 4 },
            { text: "기본 기능만 사용한다", score: 3 },
            { text: "사용이 미숙하다", score: 2 }
        ]
    },
    {
        id: 10,
        category: "기술",
        question: "새로운 도구나 시스템에 얼마나 빨리 적응하나요?",
        description: "변화하는 기술 환경에 대한 적응력을 선택해주세요.",
        options: [
            { text: "매우 빠르게 익히고 활용한다", score: 5 },
            { text: "일주일 내에 익숙해진다", score: 4 },
            { text: "한 달 정도 걸린다", score: 3 },
            { text: "적응하는 데 시간이 오래 걸린다", score: 2 }
        ]
    },
    // 협업 역량
    {
        id: 11,
        category: "협업",
        question: "다른 부서와 협업하는 프로젝트 경험은?",
        description: "크로스 팀 협업 경험을 평가해주세요.",
        options: [
            { text: "여러 부서와 원활하게 협업한 경험이 많다", score: 5 },
            { text: "몇 차례 협업 경험이 있다", score: 4 },
            { text: "같은 팀 내에서만 주로 협업한다", score: 3 },
            { text: "협업 경험이 거의 없다", score: 2 }
        ]
    },
    {
        id: 12,
        category: "협업",
        question: "의견 충돌이 생겼을 때 어떻게 대처하나요?",
        description: "갈등 상황에서의 대응 방식을 선택해주세요.",
        options: [
            { text: "적극적으로 소통하며 win-win 해결책을 찾는다", score: 5 },
            { text: "상대의 의견을 경청하고 조율한다", score: 4 },
            { text: "타협점을 찾으려 노력한다", score: 3 },
            { text: "충돌을 피하려는 경향이 있다", score: 2 }
        ]
    }
];

// Assessment state
let currentQuestionIndex = 0;
let userAnswers = [];
let userData = {};

// DOM Elements
const startScreen = document.getElementById('startScreen');
const questionScreen = document.getElementById('questionScreen');
const resultScreen = document.getElementById('resultScreen');
const userInfoForm = document.getElementById('userInfoForm');
const progressFill = document.getElementById('progressFill');
const progressPercent = document.getElementById('progressPercent');
const currentQuestion = document.getElementById('currentQuestion');
const totalQuestions = document.getElementById('totalQuestions');
const categoryName = document.getElementById('categoryName');
const questionText = document.getElementById('questionText');
const questionDesc = document.getElementById('questionDesc');
const answerOptions = document.getElementById('answerOptions');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    totalQuestions.textContent = assessmentQuestions.length;
    setupEventListeners();
});

// Event Listeners
function setupEventListeners() {
    userInfoForm.addEventListener('submit', startAssessment);
    prevBtn.addEventListener('click', previousQuestion);
    nextBtn.addEventListener('click', nextQuestion);
}

// Start Assessment
function startAssessment(e) {
    e.preventDefault();
    
    userData = {
        name: document.getElementById('userName').value,
        job: document.getElementById('userJob').value,
        experience: document.getElementById('userExperience').value,
        company: document.getElementById('userCompany').value,
        timestamp: new Date().toISOString()
    };
    
    // Hide start screen, show question screen
    startScreen.classList.remove('active');
    questionScreen.classList.add('active');
    
    // Load first question
    loadQuestion(0);
}

// Load Question
function loadQuestion(index) {
    currentQuestionIndex = index;
    const question = assessmentQuestions[index];
    
    // Update progress
    const progress = ((index + 1) / assessmentQuestions.length) * 100;
    progressFill.style.width = `${progress}%`;
    progressPercent.textContent = Math.round(progress);
    currentQuestion.textContent = index + 1;
    
    // Update question content
    categoryName.textContent = question.category;
    questionText.textContent = question.question;
    questionDesc.textContent = question.description;
    
    // Render answer options
    renderAnswerOptions(question.options, index);
    
    // Update navigation buttons
    prevBtn.style.display = index > 0 ? 'inline-flex' : 'none';
    nextBtn.textContent = index === assessmentQuestions.length - 1 ? '결과 보기' : '다음';
    nextBtn.innerHTML = index === assessmentQuestions.length - 1 
        ? '<i class="fas fa-check"></i> 결과 보기' 
        : '다음 <i class="fas fa-arrow-right"></i>';
    
    // Check if answer already selected
    if (userAnswers[index] !== undefined) {
        nextBtn.disabled = false;
    } else {
        nextBtn.disabled = true;
    }
}

// Render Answer Options
function renderAnswerOptions(options, questionIndex) {
    answerOptions.innerHTML = '';
    
    options.forEach((option, optionIndex) => {
        const optionElement = document.createElement('div');
        optionElement.className = 'answer-option';
        
        if (userAnswers[questionIndex] === optionIndex) {
            optionElement.classList.add('selected');
        }
        
        optionElement.innerHTML = `
            <div class="answer-option-radio"></div>
            <div class="answer-option-text">${option.text}</div>
        `;
        
        optionElement.addEventListener('click', () => selectAnswer(questionIndex, optionIndex));
        answerOptions.appendChild(optionElement);
    });
}

// Select Answer
function selectAnswer(questionIndex, optionIndex) {
    userAnswers[questionIndex] = optionIndex;
    
    // Update UI
    const options = answerOptions.querySelectorAll('.answer-option');
    options.forEach((option, index) => {
        if (index === optionIndex) {
            option.classList.add('selected');
        } else {
            option.classList.remove('selected');
        }
    });
    
    nextBtn.disabled = false;
}

// Previous Question
function previousQuestion() {
    if (currentQuestionIndex > 0) {
        loadQuestion(currentQuestionIndex - 1);
    }
}

// Next Question
function nextQuestion() {
    if (currentQuestionIndex < assessmentQuestions.length - 1) {
        loadQuestion(currentQuestionIndex + 1);
    } else {
        // Assessment complete
        showResults();
    }
}

// Show Results
function showResults() {
    questionScreen.classList.remove('active');
    resultScreen.classList.add('active');
    
    // Update progress to 100%
    progressFill.style.width = '100%';
    progressPercent.textContent = '100';
    
    // Simulate AI analysis
    setTimeout(() => {
        calculateResults();
    }, 2000);
}

// Calculate Results
function calculateResults() {
    // Calculate scores by category
    const categoryScores = {};
    const categoryMaxScores = {};
    
    assessmentQuestions.forEach((question, index) => {
        const category = question.category;
        const selectedOptionIndex = userAnswers[index];
        const score = question.options[selectedOptionIndex].score;
        
        if (!categoryScores[category]) {
            categoryScores[category] = 0;
            categoryMaxScores[category] = 0;
        }
        
        categoryScores[category] += score;
        categoryMaxScores[category] += 5; // Max score per question
    });
    
    // Calculate percentages
    const categoryPercentages = {};
    Object.keys(categoryScores).forEach(category => {
        categoryPercentages[category] = Math.round((categoryScores[category] / categoryMaxScores[category]) * 100);
    });
    
    // Find strength and weakness
    const categories = Object.keys(categoryPercentages);
    const strength = categories.reduce((a, b) => categoryPercentages[a] > categoryPercentages[b] ? a : b);
    const weakness = categories.reduce((a, b) => categoryPercentages[a] < categoryPercentages[b] ? a : b);
    
    // Calculate total score
    const totalScore = Math.round(Object.values(categoryPercentages).reduce((a, b) => a + b, 0) / categories.length);
    
    // Prepare result data
    const resultData = {
        user: userData,
        scores: categoryPercentages,
        totalScore: totalScore,
        strength: strength,
        weakness: weakness,
        timestamp: new Date().toISOString(),
        answers: userAnswers
    };
    
    // Save to localStorage
    localStorage.setItem('assessment_result', JSON.stringify(resultData));
    
    // Display results
    displayResults(resultData);
}

// Display Results
function displayResults(data) {
    document.querySelector('.loading-animation').style.display = 'none';
    const resultContent = document.getElementById('resultContent');
    resultContent.style.display = 'block';
    
    document.getElementById('totalScore').textContent = `${data.totalScore}점`;
    document.getElementById('strengthArea').textContent = data.strength;
    document.getElementById('weaknessArea').textContent = data.weakness;
    
    showNotification('진단이 완료되었습니다!', 'success');
}
