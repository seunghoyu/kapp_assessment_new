// Admin Page Logic

// Sample employee data
const employeesData = [
    { name: "김철수", department: "개발팀", position: "팀장", score: 82, strength: "기술", weakness: "의사소통", education: "2/3 완료" },
    { name: "이영희", department: "마케팅팀", position: "대리", score: 75, strength: "협업", weakness: "문제 해결", education: "1/2 완료" },
    { name: "한수진", department: "고객지원팀", position: "주임", score: 57, strength: "의사소통", weakness: "기술", education: "0/4 진행중" },
    { name: "박민수", department: "영업팀", position: "과장", score: 88, strength: "의사소통", weakness: "기술", education: "3/3 완료" },
    { name: "정지현", department: "개발팀", position: "주임", score: 68, strength: "학습", weakness: "리더십", education: "0/2 진행중" },
    { name: "최서연", department: "인사팀", position: "팀장", score: 85, strength: "리더십", weakness: "기술", education: "2/2 완료" },
    { name: "강동훈", department: "기획팀", position: "차장", score: 79, strength: "문제 해결", weakness: "협업", education: "1/3 진행중" },
    { name: "조민준", department: "재무팀", position: "사원", score: 63, strength: "문제 해결", weakness: "협업", education: "0/3 진행중" },
    { name: "윤미래", department: "디자인팀", position: "사원", score: 72, strength: "학습", weakness: "의사소통", education: "2/3 완료" },
    { name: "임태양", department: "영업팀", position: "대리", score: 91, strength: "협업", weakness: "학습", education: "4/4 완료" }
];

let departmentChart = null;
let skillDistributionChart = null;

// Department score data by period (시뮬레이션 데이터)
// 2026년 1월이 가장 최신, 과거로 갈수록 점수가 낮아짐
const departmentScoresByPeriod = {
    '2026-01': {
        departments: ['개발팀', '마케팅팀', '영업팀', '인사팀', '기획팀', '디자인팀'],
        scores: [82, 85, 88, 86, 83, 80],  // 최신 데이터 (가장 높음)
        label: '2026년 1월'
    },
    '2025-12': {
        departments: ['개발팀', '마케팅팀', '영업팀', '인사팀', '기획팀', '디자인팀'],
        scores: [78, 82, 85, 83, 79, 77],  // 1개월 전 (-4점)
        label: '2025년 12월'
    },
    '2025-11': {
        departments: ['개발팀', '마케팅팀', '영업팀', '인사팀', '기획팀', '디자인팀'],
        scores: [74, 78, 82, 80, 75, 73],  // 2개월 전 (-8점)
        label: '2025년 11월'
    },
    '2025-10': {
        departments: ['개발팀', '마케팅팀', '영업팀', '인사팀', '기획팀', '디자인팀'],
        scores: [70, 74, 78, 76, 71, 69],  // 3개월 전 (-12점)
        label: '2025년 10월'
    },
    '2025-09': {
        departments: ['개발팀', '마케팅팀', '영업팀', '인사팀', '기획팀', '디자인팀'],
        scores: [66, 70, 74, 72, 67, 65],  // 4개월 전 (-16점)
        label: '2025년 9월'
    },
    '2025-08': {
        departments: ['개발팀', '마케팅팀', '영업팀', '인사팀', '기획팀', '디자인팀'],
        scores: [62, 66, 70, 68, 63, 61],  // 5개월 전 (-20점)
        label: '2025년 8월'
    }
};

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    loadAdminDashboard();
});

// Load Admin Dashboard
function loadAdminDashboard() {
    createDepartmentChart('2026-01');  // 기본값: 최신 데이터
    createSkillDistributionChart();
    loadEmployeeTable();
}

// Create Department Chart
function createDepartmentChart(period = '2026-01') {
    const ctx = document.getElementById('departmentChart');
    
    if (departmentChart) {
        departmentChart.destroy();
    }
    
    // Get data for selected period
    const periodData = departmentScoresByPeriod[period] || departmentScoresByPeriod['2026-01'];
    const departments = periodData.departments;
    const scores = periodData.scores;
    
    console.log(`📊 부서별 역량 차트 업데이트: ${periodData.label}`, scores);
    
    departmentChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: departments,
            datasets: [{
                label: `평균 역량 점수 (${periodData.label})`,
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
                        }
                    },
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    }
                },
                x: {
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
                    callbacks: {
                        label: function(context) {
                            return '평균 점수: ' + context.parsed.y + '점';
                        }
                    }
                }
            }
        }
    });
}

// Create Skill Distribution Chart
function createSkillDistributionChart() {
    const ctx = document.getElementById('skillDistributionChart');
    
    if (skillDistributionChart) {
        skillDistributionChart.destroy();
    }
    
    const categories = ['문제 해결', '의사소통', '리더십', '학습', '기술', '협업'];
    const data = [68, 75, 72, 79, 71, 81];
    
    skillDistributionChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: categories,
            datasets: [{
                data: data,
                backgroundColor: [
                    'rgba(0, 102, 255, 0.8)',
                    'rgba(0, 201, 167, 0.8)',
                    'rgba(246, 173, 85, 0.8)',
                    'rgba(72, 187, 120, 0.8)',
                    'rgba(159, 122, 234, 0.8)',
                    'rgba(255, 107, 107, 0.8)'
                ],
                borderColor: 'white',
                borderWidth: 3
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 20,
                        font: {
                            size: 12,
                            weight: '600'
                        }
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    padding: 12,
                    callbacks: {
                        label: function(context) {
                            const label = context.label || '';
                            const value = context.parsed || 0;
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = Math.round((value / total) * 100);
                            return label + ': ' + value + '점 (' + percentage + '%)';
                        }
                    }
                }
            }
        }
    });
}

// Load Employee Table
function loadEmployeeTable() {
    const tbody = document.getElementById('employeeTableBody');
    tbody.innerHTML = '';
    
    employeesData.forEach(employee => {
        const tr = document.createElement('tr');
        
        const scoreClass = employee.score >= 80 ? 'high' : employee.score >= 70 ? 'medium' : 'low';
        
        tr.innerHTML = `
            <td><span class="employee-name">${employee.name}</span></td>
            <td>${employee.department}</td>
            <td>${employee.position}</td>
            <td><span class="score-badge ${scoreClass}">${employee.score}점</span></td>
            <td><span class="skill-tag">${employee.strength}</span></td>
            <td><span class="skill-tag">${employee.weakness}</span></td>
            <td><span class="education-status">${employee.education}</span></td>
            <td class="action-buttons">
                <button class="btn-icon" title="상세보기" onclick="viewEmployee('${employee.name}')">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="btn-icon" title="교육 배정" onclick="assignEducation('${employee.name}')">
                    <i class="fas fa-graduation-cap"></i>
                </button>
                <button class="btn-icon" title="리포트" onclick="downloadReport('${employee.name}')">
                    <i class="fas fa-download"></i>
                </button>
            </td>
        `;
        
        tbody.appendChild(tr);
    });
}

// View Employee
function viewEmployee(name) {
    showNotification(`${name}의 상세 정보를 조회합니다.`, 'info');
}

// Assign Education
function assignEducation(name) {
    showNotification(`${name}에게 교육을 배정합니다.`, 'success');
}

// Download Report
function downloadReport(name) {
    showNotification(`${name}의 리포트를 다운로드합니다.`, 'info');
}

// Update Department Chart when period changes
function updateDepartmentChart() {
    const select = document.getElementById('departmentPeriodSelect');
    const selectedPeriod = select.value;
    
    console.log('📅 기간 변경:', selectedPeriod);
    
    // Recreate chart with new period data
    createDepartmentChart(selectedPeriod);
    
    // Show notification
    const periodData = departmentScoresByPeriod[selectedPeriod];
    if (periodData) {
        showNotification(`${periodData.label} 데이터로 업데이트되었습니다.`, 'info');
    }
}

// Filter Progress Cards by status
function filterProgress(status) {
    console.log('🔍 역량 개발 필터:', status);
    
    const cards = document.querySelectorAll('.progress-card');
    const filterBtns = document.querySelectorAll('.header-filters .filter-btn');
    
    // Update active button
    filterBtns.forEach(btn => {
        btn.classList.remove('active');
        if (btn.textContent.trim() === (status === 'all' ? '전체' : status === 'ongoing' ? '진행중' : '완료')) {
            btn.classList.add('active');
        }
    });
    
    // Filter cards
    let visibleCount = 0;
    cards.forEach(card => {
        const cardStatus = card.getAttribute('data-status');
        
        if (status === 'all') {
            card.style.display = 'block';
            visibleCount++;
        } else if (cardStatus === status) {
            card.style.display = 'block';
            visibleCount++;
        } else {
            card.style.display = 'none';
        }
    });
    
    console.log(`✅ ${visibleCount}개 카드 표시됨`);
    
    // Show notification
    const statusText = status === 'all' ? '전체' : status === 'ongoing' ? '진행중' : '완료';
    showNotification(`${statusText} 역량 개발 ${visibleCount}개 표시`, 'info');
}

// Search functionality
const searchInput = document.querySelector('.search-input');
if (searchInput) {
    searchInput.addEventListener('input', function(e) {
        const searchTerm = e.target.value.toLowerCase();
        const rows = document.querySelectorAll('.employee-table tbody tr');
        
        rows.forEach(row => {
            const name = row.querySelector('.employee-name').textContent.toLowerCase();
            const department = row.cells[1].textContent.toLowerCase();
            
            if (name.includes(searchTerm) || department.includes(searchTerm)) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        });
    });
}

// Filter buttons
document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        
        const filter = this.textContent;
        console.log('Filter:', filter);
        // Implement filtering logic here
    });
});