// ========================================
// GAMIFICATION & GROWTH TRACKING
// ========================================

// Badge database
const badgeDatabase = [
    {
        id: 'first_assessment',
        name: '첫 진단 완료',
        icon: '🎯',
        description: '첫 KAPP 진단을 완료했습니다',
        points: 100,
        condition: (data) => data.assessmentCount >= 1
    },
    {
        id: 'knowledge_master',
        name: 'Knowledge 마스터',
        icon: '📚',
        description: 'Knowledge 점수 90점 이상 달성',
        points: 200,
        condition: (data) => data.scores.knowledge >= 90
    },
    {
        id: 'application_expert',
        name: 'Application 전문가',
        icon: '⚙️',
        description: 'Application 점수 90점 이상 달성',
        points: 200,
        condition: (data) => data.scores.application >= 90
    },
    {
        id: 'performance_pro',
        name: 'Performance 프로',
        icon: '📊',
        description: 'Performance 점수 90점 이상 달성',
        points: 200,
        condition: (data) => data.scores.performance >= 90
    },
    {
        id: 'productivity_champion',
        name: 'Productivity 챔피언',
        icon: '⚡',
        description: 'Productivity 점수 95점 이상 달성',
        points: 250,
        condition: (data) => data.scores.productivity >= 95
    },
    {
        id: 'all_rounder',
        name: '올라운더',
        icon: '🌟',
        description: '모든 영역 80점 이상 달성',
        points: 500,
        condition: (data) => {
            const { knowledge, application, performance, productivity } = data.scores;
            return knowledge >= 80 && application >= 80 && performance >= 80 && productivity >= 80;
        }
    },
    {
        id: 'fast_learner',
        name: '빠른 학습자',
        icon: '🚀',
        description: '1개월 내 20점 이상 향상',
        points: 300,
        condition: (data) => data.improvementRate >= 20
    },
    {
        id: 'consistent_grower',
        name: '꾸준한 성장자',
        icon: '📈',
        description: '3회 연속 진단 완료',
        points: 400,
        condition: (data) => data.assessmentCount >= 3
    },
    {
        id: 'top_performer',
        name: '최고 성과자',
        icon: '🏆',
        description: '전체 평균 90점 이상',
        points: 1000,
        condition: (data) => {
            const avg = (data.scores.knowledge + data.scores.application + data.scores.performance + data.scores.productivity) / 4;
            return avg >= 90;
        }
    },
    {
        id: 'skill_collector',
        name: '스킬 컬렉터',
        icon: '💎',
        description: '5개 이상 스킬 레벨업',
        points: 600,
        condition: (data) => data.levelUpCount >= 5
    }
];

// Initialize gamification
function initializeGamification() {
    const resultsJSON = localStorage.getItem('kapp_assessment_result');
    if (!resultsJSON) {
        console.warn('No assessment results found for gamification');
        return;
    }
    
    const results = JSON.parse(resultsJSON);
    
    // Get or create gamification data
    let gamificationData = getGamificationData();
    
    // Update with current assessment
    gamificationData = updateGamificationData(gamificationData, results);
    
    // Save updated data
    localStorage.setItem('gamification_data', JSON.stringify(gamificationData));
    
    // Check and award badges
    const newBadges = checkAndAwardBadges(gamificationData);
    
    // Display gamification UI
    displayGamificationStats(gamificationData);
    displayBadges(gamificationData.badges);
    displayLeaderboard();
    
    // Show badge notifications
    if (newBadges.length > 0) {
        showBadgeNotifications(newBadges);
    }
}

// Get gamification data from localStorage
function getGamificationData() {
    const dataJSON = localStorage.getItem('gamification_data');
    if (dataJSON) {
        return JSON.parse(dataJSON);
    }
    
    // Initialize new data
    return {
        totalPoints: 0,
        badges: [],
        assessmentCount: 0,
        levelUpCount: 0,
        improvementRate: 0,
        assessmentHistory: [],
        lastAssessmentDate: null
    };
}

// Update gamification data
function updateGamificationData(data, results) {
    data.assessmentCount++;
    data.lastAssessmentDate = new Date().toISOString();
    
    // Add to history
    data.assessmentHistory.push({
        date: new Date().toISOString(),
        scores: results.scores,
        overallScore: results.overallScore
    });
    
    // Calculate improvement rate
    if (data.assessmentHistory.length >= 2) {
        const previous = data.assessmentHistory[data.assessmentHistory.length - 2];
        const current = data.assessmentHistory[data.assessmentHistory.length - 1];
        data.improvementRate = current.overallScore - previous.overallScore;
    }
    
    // Count level ups (simulated)
    data.levelUpCount = Math.floor(data.assessmentCount * 1.5);
    
    return data;
}

// Check and award badges
function checkAndAwardBadges(data) {
    const newBadges = [];
    const results = JSON.parse(localStorage.getItem('kapp_assessment_result'));
    
    const checkData = {
        ...data,
        scores: results.scores
    };
    
    badgeDatabase.forEach(badge => {
        // Check if badge already earned
        if (data.badges.some(b => b.id === badge.id)) {
            return;
        }
        
        // Check condition
        if (badge.condition(checkData)) {
            data.badges.push({
                id: badge.id,
                name: badge.name,
                icon: badge.icon,
                description: badge.description,
                earnedDate: new Date().toISOString()
            });
            data.totalPoints += badge.points;
            newBadges.push(badge);
        }
    });
    
    // Save updated data
    localStorage.setItem('gamification_data', JSON.stringify(data));
    
    return newBadges;
}

// Display gamification stats
function displayGamificationStats(data) {
    document.getElementById('totalPoints').textContent = data.totalPoints.toLocaleString();
    document.getElementById('totalBadges').textContent = data.badges.length;
    document.getElementById('levelUpCount').textContent = data.levelUpCount;
    
    // Calculate rank (simulated)
    const rank = calculateRank(data.totalPoints);
    document.getElementById('userRank').textContent = rank;
}

// Calculate rank based on points
function calculateRank(points) {
    if (points >= 5000) return '🏆 Top 1%';
    if (points >= 3000) return '🥇 Top 5%';
    if (points >= 2000) return '🥈 Top 10%';
    if (points >= 1000) return '🥉 Top 20%';
    if (points >= 500) return '🎖️ Top 40%';
    return '⭐ 성장 중';
}

// Display badges
function displayBadges(badges) {
    const container = document.getElementById('badgeGrid');
    if (!container) return;
    
    if (badges.length === 0) {
        container.innerHTML = '<p class="empty-state">진단을 완료하고 배지를 획득하세요!</p>';
        return;
    }
    
    let html = '';
    badges.forEach(badge => {
        html += `
            <div class="badge-item earned">
                <div class="badge-icon">${badge.icon}</div>
                <div class="badge-name">${badge.name}</div>
                <div class="badge-date">${formatDate(badge.earnedDate)}</div>
            </div>
        `;
    });
    
    // Add locked badges
    const lockedBadges = badgeDatabase.filter(b => !badges.some(earned => earned.id === b.id));
    lockedBadges.slice(0, 6).forEach(badge => {
        html += `
            <div class="badge-item locked">
                <div class="badge-icon">🔒</div>
                <div class="badge-name">${badge.name}</div>
                <div class="badge-desc">${badge.description}</div>
            </div>
        `;
    });
    
    container.innerHTML = html;
}

// Display leaderboard
function displayLeaderboard() {
    const container = document.getElementById('leaderboardList');
    if (!container) return;
    
    // Simulated leaderboard data
    const leaderboard = [
        { rank: 1, name: '김해커', points: 8500, avatar: '🏆', department: 'IT개발팀' },
        { rank: 2, name: '이성장', points: 7200, avatar: '🥇', department: '데이터팀' },
        { rank: 3, name: '박탁월', points: 6800, avatar: '🥈', department: '기획팀' },
        { rank: 4, name: '최우수', points: 5900, avatar: '🥉', department: 'IT개발팀' },
        { rank: 5, name: '당신', points: parseInt(document.getElementById('totalPoints').textContent.replace(/,/g, '')), avatar: '⭐', department: 'IT개발팀', isCurrentUser: true }
    ];
    
    leaderboard.sort((a, b) => b.points - a.points);
    leaderboard.forEach((user, index) => {
        user.rank = index + 1;
    });
    
    let html = '';
    leaderboard.forEach(user => {
        html += `
            <div class="leaderboard-item ${user.isCurrentUser ? 'current-user' : ''}">
                <div class="rank-badge rank-${user.rank}">${user.rank}</div>
                <div class="user-avatar">${user.avatar}</div>
                <div class="user-info">
                    <div class="user-name">${user.name} ${user.isCurrentUser ? '(나)' : ''}</div>
                    <div class="user-department">${user.department}</div>
                </div>
                <div class="user-points">${user.points.toLocaleString()}pt</div>
            </div>
        `;
    });
    
    container.innerHTML = html;
}

// Show badge notifications
function showBadgeNotifications(badges) {
    badges.forEach((badge, index) => {
        setTimeout(() => {
            showNotification(
                `🎉 새 배지 획득!\n\n${badge.icon} ${badge.name}\n+${badge.points} 포인트`,
                'success',
                5000
            );
        }, index * 2000);
    });
}

// Format date
function formatDate(dateString) {
    const date = new Date(dateString);
    return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;
}

// Show notification
function showNotification(message, type = 'info', duration = 3000) {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        animation: slideInRight 0.3s ease-out;
        white-space: pre-line;
        max-width: 400px;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease-out';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, duration);
}

// Export functions
window.initializeGamification = initializeGamification;
