// Global variables
let currentQuestions = [];
let currentJobFilter = 'all';

// Job category mapping - 확장된 12개 직무
const jobCategories = {
    '이메일 관리': '커뮤니케이션',
    '메신저 대응': '커뮤니케이션',
    '보고서 작성': '경영/기획',
    '일정 관리': '경영/기획',
    '통합 업무': '프로젝트관리',
    '위기 관리': '위기대응',
    '글로벌 협업': '프로젝트관리',
    '법무 검토': '법무/컴플라이언스',
    '디지털 활용': 'IT/디지털',
    '인사 관리': '인사/조직',
    '재무 관리': '재무/회계',
    '고객 관리': '고객서비스',
    '윤리 경영': '법무/컴플라이언스',
    '전략 기획': '경영/기획',
    '마케팅캠페인': '마케팅/영업',
    '생산관리': '생산/운영'
};

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    console.log('페이지 로드 시작');
    loadQuestions();
});

// Load all questions from the database
async function loadQuestions() {
    console.log('문항 로드 시작...');
    
    // Show loading state
    const container = document.getElementById('question-cards');
    container.innerHTML = `
        <div class="col-span-full text-center py-20">
            <div class="inline-block animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mb-4"></div>
            <p class="text-gray-600 text-lg">문항을 불러오는 중...</p>
        </div>
    `;
    
    try {
        console.log('API 호출 시작: tables/questions?limit=100');
        const response = await fetch('tables/questions?limit=100');
        console.log('API 응답 상태:', response.status, response.statusText);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('받은 데이터 구조:', {
            hasData: !!data,
            dataKeys: data ? Object.keys(data) : [],
            dataType: typeof data,
            dataLength: data.data ? data.data.length : 'N/A'
        });
        console.log('전체 응답 데이터:', data);
        
        currentQuestions = data.data || [];
        console.log('문항 개수:', currentQuestions.length);
        
        if (currentQuestions.length > 0) {
            console.log('첫 번째 문항 샘플:', currentQuestions[0]);
            console.log('모든 문항 카테고리:', currentQuestions.map(q => q.category));
        }
        
        if (currentQuestions.length === 0) {
            console.warn('⚠️ 문항이 없습니다! 데이터베이스가 비어있을 수 있습니다.');
            showNoQuestionsMessage();
            return;
        }
        
        console.log('✅ 문항 로드 성공! 카드 표시 시작...');
        updateJobCounts();
        displayQuestionCards(currentQuestions);
        updateTotalCount(currentQuestions.length);
        console.log('✅ 모든 UI 업데이트 완료');
    } catch (error) {
        console.error('❌ 문항 로드 실패:', error);
        console.error('에러 상세:', {
            message: error.message,
            stack: error.stack,
            name: error.name
        });
        showError('문항을 불러오는데 실패했습니다: ' + error.message);
        showNoQuestionsMessage();
    }
}

// Show no questions message
function showNoQuestionsMessage() {
    const container = document.getElementById('question-cards');
    container.innerHTML = `
        <div class="col-span-full text-center py-20">
            <i class="fas fa-exclamation-circle text-6xl text-yellow-400 mb-4"></i>
            <p class="text-gray-800 text-xl font-bold mb-2">문항 데이터가 없습니다</p>
            <p class="text-gray-600 text-sm mb-4">데이터베이스에 문항을 추가해주세요</p>
            <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-2xl mx-auto mb-4">
                <p class="text-sm text-gray-700 mb-2"><strong>디버깅 정보:</strong></p>
                <p class="text-xs text-gray-600 font-mono mb-1">1. <a href="test.html" class="text-blue-600 underline">API 테스트 페이지</a>에서 상태를 확인하세요</p>
                <p class="text-xs text-gray-600 font-mono mb-1">2. F12를 눌러 개발자 콘솔을 열어주세요</p>
                <p class="text-xs text-gray-600 font-mono mb-1">3. Console 탭에서 로드 상태를 확인하세요</p>
                <p class="text-xs text-gray-600 font-mono">4. Network 탭에서 API 호출을 확인하세요</p>
            </div>
            <div class="flex gap-4 justify-center">
                <a href="test.html" class="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 shadow-lg">
                    <i class="fas fa-vial mr-2"></i>API 테스트
                </a>
                <button onclick="loadQuestions()" class="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-3 rounded-lg hover:from-purple-700 hover:to-indigo-700 shadow-lg">
                    <i class="fas fa-sync-alt mr-2"></i>다시 시도
                </button>
            </div>
        </div>
    `;
}

// Update job category counts
function updateJobCounts() {
    const counts = {
        'all': currentQuestions.length,
        '경영/기획': 0,
        '커뮤니케이션': 0,
        '고객서비스': 0,
        '인사/조직': 0,
        '재무/회계': 0,
        'IT/디지털': 0,
        '법무/컴플라이언스': 0,
        '프로젝트관리': 0,
        '위기대응': 0,
        '마케팅/영업': 0,
        '생산/운영': 0
    };
    
    currentQuestions.forEach(q => {
        const job = jobCategories[q.category];
        if (job && counts[job] !== undefined) {
            counts[job]++;
        }
    });
    
    console.log('직무별 개수:', counts);
    
    Object.keys(counts).forEach(job => {
        const element = document.getElementById(`count-${job}`);
        if (element) {
            element.textContent = counts[job];
        }
    });
}

// Filter by job category
function filterByJob(job) {
    console.log('직무 필터:', job);
    currentJobFilter = job;
    
    // Update active pill
    document.querySelectorAll('.job-pill').forEach(pill => {
        pill.classList.remove('active');
    });
    event.currentTarget.classList.add('active');
    
    // Update badge
    const jobNames = {
        'all': '전체',
        '경영/기획': '경영/기획',
        '커뮤니케이션': '커뮤니케이션',
        '고객서비스': '고객서비스',
        '인사/조직': '인사/조직',
        '재무/회계': '재무/회계',
        'IT/디지털': 'IT/디지털',
        '법무/컴플라이언스': '법무/컴플',
        '프로젝트관리': '프로젝트관리',
        '위기대응': '위기대응',
        '마케팅/영업': '마케팅/영업',
        '생산/운영': '생산/운영'
    };
    document.getElementById('current-job-badge').textContent = jobNames[job] || '전체';
    document.getElementById('current-job-title').textContent = (jobNames[job] || '전체') + ' 문항';
    
    // Filter and display
    if (job === 'all') {
        displayQuestionCards(currentQuestions);
    } else {
        const filtered = currentQuestions.filter(q => jobCategories[q.category] === job);
        console.log('필터된 문항:', filtered.length, '개');
        displayQuestionCards(filtered);
    }
}

// Display question cards
function displayQuestionCards(questions) {
    console.log('카드 표시 시작, 문항 수:', questions.length);
    const container = document.getElementById('question-cards');
    
    if (!container) {
        console.error('question-cards 컨테이너를 찾을 수 없습니다!');
        return;
    }
    
    if (questions.length === 0) {
        container.innerHTML = `
            <div class="col-span-full text-center py-20">
                <i class="fas fa-inbox text-6xl text-gray-300 mb-4"></i>
                <p class="text-gray-600 text-lg">해당 직무의 문항이 없습니다</p>
            </div>
        `;
        return;
    }
    
    const cardsHTML = questions.map(q => {
        const priorityClass = getPriorityGradientClass(q.priority);
        const iconClass = getCategoryIcon(q.category);
        const contentPreview = q.content ? q.content.substring(0, 80) + '...' : '내용 없음';
        
        return `
            <div class="question-card bg-white rounded-2xl shadow-lg overflow-hidden" onclick="showQuestionModal('${q.id}')">
                <!-- Priority Badge -->
                <div class="${priorityClass} text-white px-4 py-2 flex items-center justify-between">
                    <span class="text-xs font-semibold uppercase">${q.priority || '보통'}</span>
                    <i class="${iconClass}"></i>
                </div>
                
                <!-- Card Content -->
                <div class="p-6">
                    <h3 class="font-bold text-lg text-gray-800 mb-3 line-clamp-2">${q.title || '제목 없음'}</h3>
                    
                    <div class="space-y-2 mb-4">
                        <div class="flex items-center text-sm text-gray-600">
                            <i class="fas fa-user w-5 text-purple-500"></i>
                            <span>${q.sender || '발신자 정보 없음'}</span>
                        </div>
                        <div class="flex items-center text-sm text-gray-600">
                            <i class="fas fa-calendar w-5 text-blue-500"></i>
                            <span>${q.date || '날짜 정보 없음'}</span>
                        </div>
                        <div class="flex items-center text-sm text-gray-600">
                            <i class="fas fa-tag w-5 text-green-500"></i>
                            <span>${q.category || '카테고리 없음'}</span>
                        </div>
                    </div>
                    
                    <!-- Preview Content -->
                    <p class="text-sm text-gray-500 mb-4 line-clamp-2">${contentPreview}</p>
                    
                    <!-- Actions -->
                    <div class="flex space-x-2">
                        <button onclick="event.stopPropagation(); showQuestionModal('${q.id}')" 
                                class="flex-1 bg-gradient-to-r from-purple-500 to-blue-500 text-white py-2 rounded-lg font-semibold hover:shadow-lg transition">
                            <i class="fas fa-eye mr-1"></i>상세보기
                        </button>
                        <button onclick="event.stopPropagation(); startSimulation('${q.id}')" 
                                class="flex-1 bg-gradient-to-r from-green-500 to-teal-500 text-white py-2 rounded-lg font-semibold hover:shadow-lg transition">
                            <i class="fas fa-play mr-1"></i>시작
                        </button>
                    </div>
                </div>
            </div>
        `;
    }).join('');
    
    console.log('카드 HTML 생성 완료');
    container.innerHTML = cardsHTML;
}

// Show question detail modal
async function showQuestionModal(questionId) {
    try {
        const response = await fetch(`tables/questions/${questionId}`);
        const question = await response.json();
        
        const modalContent = document.getElementById('modal-content');
        modalContent.innerHTML = `
            <div class="space-y-6">
                <!-- Header -->
                <div class="border-b pb-4">
                    <div class="flex items-start justify-between mb-3">
                        <h2 class="text-3xl font-bold text-gray-800 flex-1">${question.title}</h2>
                        <span class="px-4 py-2 rounded-full text-sm font-bold ${getPriorityBadgeClass(question.priority)}">${question.priority}</span>
                    </div>
                    <div class="flex items-center space-x-4 text-sm text-gray-600">
                        <span><i class="fas fa-user mr-2 text-purple-500"></i>${question.sender}</span>
                        <span><i class="fas fa-calendar mr-2 text-blue-500"></i>${question.date}</span>
                        <span><i class="fas fa-tag mr-2 text-green-500"></i>${question.category}</span>
                    </div>
                </div>
                
                <!-- Content -->
                <div class="bg-gradient-to-br from-gray-50 to-blue-50 p-6 rounded-xl">
                    <h3 class="font-bold text-gray-800 mb-3 flex items-center">
                        <i class="fas fa-file-alt mr-2 text-blue-600"></i>문항 내용
                    </h3>
                    <div class="text-gray-700 leading-relaxed whitespace-pre-wrap">${question.content}</div>
                </div>
                
                <!-- Attachments -->
                ${question.attachments && question.attachments.length > 0 ? `
                <div>
                    <h3 class="font-bold text-gray-800 mb-3 flex items-center">
                        <i class="fas fa-paperclip mr-2 text-purple-600"></i>첨부 문서 (${question.attachments.length}개)
                    </h3>
                    <div class="grid grid-cols-2 gap-2">
                        ${question.attachments.map(att => `
                            <div class="flex items-center bg-white p-3 rounded-lg border border-gray-200">
                                <i class="fas fa-file text-blue-500 mr-2"></i>
                                <span class="text-sm text-gray-700">${att}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
                ` : ''}
                
                <!-- Actions -->
                <div class="flex space-x-3 pt-4">
                    <button onclick="startSimulation('${question.id}')" 
                            class="flex-1 bg-gradient-to-r from-green-500 to-teal-500 text-white py-4 rounded-xl font-bold text-lg hover:shadow-2xl transition">
                        <i class="fas fa-play-circle mr-2"></i>시뮬레이션 시작
                    </button>
                    <button onclick="showBasicResponse('${question.id}')" 
                            class="flex-1 bg-gradient-to-r from-purple-500 to-blue-500 text-white py-4 rounded-xl font-bold text-lg hover:shadow-2xl transition">
                        <i class="fas fa-pen mr-2"></i>기본 응답 작성
                    </button>
                </div>
            </div>
        `;
        
        document.getElementById('detail-modal').classList.remove('hidden');
    } catch (error) {
        console.error('문항 로드 실패:', error);
        showError('문항 상세 정보를 불러오는데 실패했습니다.');
    }
}

// Close modal
function closeModal(event) {
    if (!event || event.target.id === 'detail-modal') {
        document.getElementById('detail-modal').classList.add('hidden');
    }
}

// Show basic response form
function showBasicResponse(questionId) {
    // Implement basic response form
    alert('기본 응답 작성 기능은 개발 중입니다. 시뮬레이션을 이용해주세요.');
}

// Start simulation
function startSimulation(questionId) {
    window.location.href = `simulation.html?id=${questionId}`;
}

// Helper functions
function getPriorityGradientClass(priority) {
    switch(priority) {
        case '긴급': return 'priority-urgent';
        case '보통': return 'priority-normal';
        case '낮음': return 'priority-low';
        default: return 'priority-normal';
    }
}

function getPriorityBadgeClass(priority) {
    switch(priority) {
        case '긴급': return 'bg-red-500 text-white';
        case '보통': return 'bg-blue-500 text-white';
        case '낮음': return 'bg-gray-500 text-white';
        default: return 'bg-blue-500 text-white';
    }
}

function getCategoryIcon(category) {
    const icons = {
        '이메일 관리': 'fas fa-envelope',
        '메신저 대응': 'fas fa-comments',
        '보고서 작성': 'fas fa-file-alt',
        '일정 관리': 'fas fa-calendar-alt',
        '통합 업무': 'fas fa-project-diagram',
        '위기 관리': 'fas fa-exclamation-triangle',
        '글로벌 협업': 'fas fa-globe',
        '법무 검토': 'fas fa-gavel',
        '디지털 활용': 'fas fa-laptop-code',
        '인사 관리': 'fas fa-users',
        '재무 관리': 'fas fa-calculator',
        '고객 관리': 'fas fa-handshake',
        '윤리 경영': 'fas fa-balance-scale',
        '전략 기획': 'fas fa-chess'
    };
    return icons[category] || 'fas fa-file';
}

function updateTotalCount(count) {
    document.getElementById('total-questions').textContent = count;
}

function showError(message) {
    alert('❌ ' + message);
}
