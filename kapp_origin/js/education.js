// Education Page Logic
// coursesData is loaded from education-data-extended.js
// This file should be loaded AFTER education-data-extended.js

console.log('🎓 Education.js loaded');
console.log('📚 Courses available:', typeof coursesData !== 'undefined' ? coursesData.length : 'coursesData not defined!');

// Check if coursesData is available
if (typeof coursesData === 'undefined') {
    console.error('❌ coursesData is not defined! Make sure education-data-extended.js is loaded first.');
}

// Learning paths data
const learningPaths = {
    '문제 해결': [
        {
            step: 1,
            title: "기초 분석 역량 구축",
            description: "데이터 분석의 기본을 익히고 논리적 사고를 개발합니다.",
            courses: ["데이터 기반 의사결정 마스터", "비즈니스 분석 기초"]
        },
        {
            step: 2,
            title: "고급 문제 해결 기법",
            description: "복잡한 비즈니스 문제를 해결하는 프레임워크를 학습합니다.",
            courses: ["비즈니스 문제 해결 프레임워크", "전략적 사고와 분석"]
        },
        {
            step: 3,
            title: "실전 프로젝트 적용",
            description: "실제 프로젝트에 학습한 내용을 적용하고 경험을 쌓습니다.",
            courses: ["데이터 기반 의사결정 실무", "프로젝트 관리 실전"]
        }
    ],
    '의사소통': [
        {
            step: 1,
            title: "기본 커뮤니케이션 스킬",
            description: "효과적인 메시지 전달 기법을 익힙니다.",
            courses: ["효과적인 프레젠테이션 스킬", "비즈니스 글쓰기"]
        },
        {
            step: 2,
            title: "설득과 협상",
            description: "상대방을 설득하고 협상하는 고급 기법을 배웁니다.",
            courses: ["설득 커뮤니케이션", "협상 전략"]
        },
        {
            step: 3,
            title: "리더십 커뮤니케이션",
            description: "리더로서 팀을 이끄는 커뮤니케이션을 학습합니다.",
            courses: ["리더십 커뮤니케이션", "조직 커뮤니케이션"]
        }
    ],
    '리더십': [
        {
            step: 1,
            title: "리더십 기초",
            description: "리더의 역할과 책임을 이해합니다.",
            courses: ["리더십 핵심 역량 개발", "리더십 스타일 탐색"]
        },
        {
            step: 2,
            title: "팀 관리 및 코칭",
            description: "효과적인 팀 관리와 코칭 스킬을 개발합니다.",
            courses: ["팀 빌딩 전략", "코칭과 멘토링"]
        },
        {
            step: 3,
            title: "전략적 리더십",
            description: "조직 전체를 이끄는 전략적 리더십을 배웁니다.",
            courses: ["전략적 의사결정", "변화 관리 리더십"]
        }
    ],
    '학습': [
        {
            step: 1,
            title: "효과적인 학습 방법",
            description: "자기주도 학습의 기초를 다집니다.",
            courses: ["자기주도 학습 전략", "효율적인 시간 관리"]
        },
        {
            step: 2,
            title: "학습 습관 형성",
            description: "지속 가능한 학습 루틴을 만듭니다.",
            courses: ["습관의 힘", "목표 설정과 실행"]
        },
        {
            step: 3,
            title: "평생 학습자 되기",
            description: "변화하는 환경에서 지속적으로 성장하는 방법을 익힙니다.",
            courses: ["미래 역량 개발", "학습하는 조직"]
        }
    ],
    '기술': [
        {
            step: 1,
            title: "디지털 도구 기초",
            description: "업무에 필요한 기본 디지털 도구를 익힙니다.",
            courses: ["디지털 도구 마스터하기", "협업 도구 활용"]
        },
        {
            step: 2,
            title: "업무 자동화",
            description: "반복 업무를 자동화하여 생산성을 높입니다.",
            courses: ["업무 자동화 기초", "데이터 분석 도구"]
        },
        {
            step: 3,
            title: "AI 도구 활용",
            description: "AI 도구를 업무에 적용하여 효율을 극대화합니다.",
            courses: ["AI 워크플로우", "생성형 AI 활용"]
        }
    ],
    '협업': [
        {
            step: 1,
            title: "팀워크 기초",
            description: "효과적인 팀 협업의 기본을 익힙니다.",
            courses: ["효과적인 팀워크 전략", "협업 커뮤니케이션"]
        },
        {
            step: 2,
            title: "갈등 관리",
            description: "팀 내 갈등을 건설적으로 해결하는 방법을 배웁니다.",
            courses: ["갈등 관리와 해결", "팀 빌딩"]
        },
        {
            step: 3,
            title: "크로스 펑셔널 협업",
            description: "다양한 부서와 효과적으로 협업하는 스킬을 개발합니다.",
            courses: ["조직 간 협업", "프로젝트 협업"]
        }
    ]
};

// State
let filteredCourses = [...coursesData];
let currentView = 'grid';

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    loadEducationPage();
    setupEventListeners();
});

// Load Education Page
function loadEducationPage() {
    console.log('📚 교육 큐레이션 페이지 로딩...');
    
    // Load user's industry from KAPP assessment or dashboard
    const kappResult = localStorage.getItem('kapp_assessment_result');
    const assessmentResult = localStorage.getItem('assessment_result');
    
    let userData = null;
    
    if (kappResult) {
        const data = JSON.parse(kappResult);
        userData = data.userData;
        console.log('✅ KAPP 결과에서 사용자 정보 로드:', userData);
    } else if (assessmentResult) {
        const data = JSON.parse(assessmentResult);
        userData = data.userData || data;
        console.log('✅ Assessment 결과에서 사용자 정보 로드:', userData);
    }
    
    // Auto-select user's industry in filter
    if (userData && userData.industry && document.getElementById('industryFilter')) {
        document.getElementById('industryFilter').value = userData.industry;
        console.log('🎯 사용자 산업군 자동 선택:', userData.industry);
        
        // Apply filter automatically
        applyFilters();
        
        // Update recommendation reason
        const reasonElement = document.getElementById('recommendationReason');
        if (reasonElement) {
            reasonElement.textContent = `${userData.industry} 산업에 맞춤 추천된 교육입니다`;
        }
    } else {
        displayCourses();
    }
    
    // Display learning path based on KAPP scores or weakness
    if (assessmentResult) {
        try {
            const data = JSON.parse(assessmentResult);
            
            // Find weakness from KAPP scores
            let weakestArea = '문제 해결'; // Default
            
            if (data.scores) {
                const scores = data.scores;
                const scoreMap = {
                    knowledge: { value: scores.knowledge || 0, category: '학습' },
                    application: { value: scores.application || 0, category: '문제 해결' },
                    performance: { value: scores.performance || 0, category: '협업' },
                    productivity: { value: scores.productivity || 0, category: '기술' }
                };
                
                // Find the lowest score
                let minScore = 100;
                for (const [key, data] of Object.entries(scoreMap)) {
                    if (data.value < minScore) {
                        minScore = data.value;
                        weakestArea = data.category;
                    }
                }
                
                console.log('📊 약점 분석:', scoreMap);
                console.log('🎯 추천 학습 경로:', weakestArea);
            } else if (data.weakness) {
                weakestArea = data.weakness;
            }
            
            displayLearningPath(weakestArea);
        } catch (e) {
            console.error('학습 경로 표시 오류:', e);
            // Show default learning path
            displayLearningPath('문제 해결');
        }
    } else {
        // No assessment result - show default learning path
        console.log('📚 진단 결과 없음 - 기본 학습 경로 표시');
        displayLearningPath('문제 해결');
    }
}

// Setup Event Listeners
function setupEventListeners() {
    // Filter listeners
    if (document.getElementById('industryFilter')) {
        document.getElementById('industryFilter').addEventListener('change', applyFilters);
    }
    document.getElementById('categoryFilter').addEventListener('change', applyFilters);
    document.getElementById('levelFilter').addEventListener('change', applyFilters);
    document.getElementById('durationFilter').addEventListener('change', applyFilters);
    document.getElementById('resetFilter').addEventListener('click', resetFilters);
    
    // View toggle
    document.querySelectorAll('.view-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.view-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            currentView = this.dataset.view;
            updateView();
        });
    });
    
    // Modal listeners
    document.querySelectorAll('.modal-close, .modal-close-btn').forEach(el => {
        el.addEventListener('click', closeModal);
    });
    
    document.getElementById('courseModal').addEventListener('click', function(e) {
        if (e.target === this) closeModal();
    });
}

// Update Recommendation Reason
function updateRecommendationReason(data) {
    const reason = document.getElementById('recommendationReason');
    reason.textContent = `${data.weakness} 역량 향상을 위해 선별된 과정입니다 (현재 점수: ${data.scores[data.weakness]}점)`;
}

// Display Courses
function displayCourses() {
    const recommendedContainer = document.getElementById('recommendedCourses');
    const allCoursesContainer = document.getElementById('allCourses');
    
    const recommendedCourses = filteredCourses.filter(c => c.recommended);
    const otherCourses = filteredCourses.filter(c => !c.recommended);
    
    recommendedContainer.innerHTML = recommendedCourses.map(course => createCourseCard(course, true)).join('');
    allCoursesContainer.innerHTML = otherCourses.map(course => createCourseCard(course, false)).join('');
    
    // Add click listeners
    document.querySelectorAll('.course-card').forEach(card => {
        card.addEventListener('click', () => openCourseModal(card.dataset.courseId));
    });
}

// Create Course Card
function createCourseCard(course, isRecommended) {
    return `
        <div class="course-card" data-course-id="${course.id}">
            <div class="course-thumbnail">
                ${course.thumbnail}
                ${isRecommended ? '<div class="course-recommended-badge">추천</div>' : ''}
            </div>
            <div class="course-info">
                <span class="course-category">${course.category}</span>
                <h3 class="course-title">${course.title}</h3>
                <p class="course-description">${course.description}</p>
                <div class="course-meta">
                    <span><i class="fas fa-clock"></i> ${course.duration}</span>
                    <span><i class="fas fa-users"></i> ${course.students}명</span>
                    <span><i class="fas fa-star"></i> ${course.rating}</span>
                </div>
                <div class="course-footer">
                    <span class="course-level">${course.level}</span>
                    <button class="course-action">자세히 보기 <i class="fas fa-arrow-right"></i></button>
                </div>
            </div>
        </div>
    `;
}

// Apply Filters
function applyFilters() {
    const industry = document.getElementById('industryFilter')?.value || '';
    const category = document.getElementById('categoryFilter').value;
    const level = document.getElementById('levelFilter').value;
    const duration = document.getElementById('durationFilter').value;
    
    console.log('🔍 필터 적용:', { industry, category, level, duration });
    
    filteredCourses = coursesData.filter(course => {
        // 산업군 필터 (industries 배열에 포함되어 있거나 "전체"인 경우)
        const industryMatch = !industry || 
                            (course.industries && (
                                course.industries.includes(industry) || 
                                course.industries.includes('전체')
                            ));
        
        // 기존 필터들
        const categoryMatch = !category || course.category === category;
        const levelMatch = !level || course.level === level;
        const durationMatch = !duration || course.duration.includes(duration);
        
        return industryMatch && categoryMatch && levelMatch && durationMatch;
    });
    
    console.log('✅ 필터링 결과:', filteredCourses.length, '개 강의');
    
    displayCourses();
}

// Reset Filters
function resetFilters() {
    if (document.getElementById('industryFilter')) {
        document.getElementById('industryFilter').value = '';
    }
    document.getElementById('categoryFilter').value = '';
    document.getElementById('levelFilter').value = '';
    document.getElementById('durationFilter').value = '';
    filteredCourses = [...coursesData];
    displayCourses();
}

// Update View
function updateView() {
    const allCoursesContainer = document.getElementById('allCourses');
    if (currentView === 'list') {
        allCoursesContainer.classList.add('list-view');
    } else {
        allCoursesContainer.classList.remove('list-view');
    }
}

// Display Learning Path
function displayLearningPath(weakness) {
    console.log('🛤️ 학습 경로 표시:', weakness);
    
    const pathContainer = document.getElementById('learningPath');
    if (!pathContainer) {
        console.error('❌ learningPath 컨테이너를 찾을 수 없습니다');
        return;
    }
    
    const path = learningPaths[weakness] || learningPaths['문제 해결'];
    console.log('📚 선택된 학습 경로:', path);
    
    if (!path || path.length === 0) {
        console.error('❌ 학습 경로 데이터가 없습니다');
        return;
    }
    
    const html = path.map(step => `
        <div class="path-step">
            <div class="path-number">${step.step}</div>
            <div class="path-content">
                <h3 class="path-title">${step.title}</h3>
                <p class="path-description">${step.description}</p>
                <div class="path-courses">
                    ${step.courses.map(c => `<span class="path-course-tag">${c}</span>`).join('')}
                </div>
            </div>
        </div>
    `).join('');
    
    pathContainer.innerHTML = html;
    console.log('✅ 학습 경로 렌더링 완료:', path.length, '단계');
}

// Open Course Modal
function openCourseModal(courseId) {
    const course = coursesData.find(c => c.id == courseId);
    if (!course) return;
    
    document.getElementById('modalTitle').textContent = course.title;
    document.getElementById('modalCategory').textContent = course.category;
    document.getElementById('modalLevel').textContent = course.level;
    document.getElementById('modalDuration').textContent = course.duration;
    document.getElementById('modalStudents').textContent = course.students;
    document.getElementById('modalRating').textContent = course.rating;
    document.getElementById('modalDescription').textContent = course.description;
    
    const curriculumList = document.getElementById('modalCurriculum');
    curriculumList.innerHTML = course.curriculum.map(item => `<li>${item}</li>`).join('');
    
    const outcomesList = document.getElementById('modalOutcomes');
    outcomesList.innerHTML = course.outcomes.map(item => `<li>${item}</li>`).join('');
    
    document.getElementById('courseModal').classList.add('active');
}

// Close Modal
function closeModal() {
    document.getElementById('courseModal').classList.remove('active');
}