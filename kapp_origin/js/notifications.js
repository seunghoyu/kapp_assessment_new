// ========================================
// NOTIFICATIONS & PROGRESS TRACKING
// ========================================
// 1. Push Notifications & Email Alerts
// 2. Learning Progress Tracking
// 3. Advanced AI Mentor (Voice/Video)
// ========================================

// Notification Settings
let notificationSettings = {
    dailyTips: true,
    streakAlert: true,
    learningPath: true,
    achievement: true,
    emailDigest: true,
    aiMentor: true,
    email: '',
    dailyTipTime: '09:00',
    weeklyReportDay: 'monday'
};

// Learning Progress Data
let progressData = {
    currentStreak: 7,
    maxStreak: 14,
    completedTips: 23,
    weeklyTips: 7,
    totalTime: 145,
    avgTime: 21,
    totalBadges: 5,
    weeklyActivity: [5, 8, 6, 7, 9, 4, 7] // Last 7 days
};

// ========================================
// 1. PUSH NOTIFICATIONS
// ========================================

function requestPushPermission() {
    if (!('Notification' in window)) {
        alert('이 브라우저는 알림을 지원하지 않습니다.');
        return;
    }
    
    Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
            console.log('✅ 푸시 알림 권한 허용됨');
            document.getElementById('pushNotificationRequest').style.display = 'none';
            
            // Show success notification
            new Notification('알림이 활성화되었습니다!', {
                body: '매일 오전 9시에 오늘의 팁을 받아보세요 🚀',
                icon: 'https://via.placeholder.com/128/667eea/ffffff?text=H',
                badge: 'https://via.placeholder.com/96/667eea/ffffff?text=H'
            });
            
            // Save to localStorage
            localStorage.setItem('push_notifications_enabled', 'true');
            
            // Schedule daily notifications
            scheduleDailyNotifications();
        } else if (permission === 'denied') {
            alert('알림이 차단되었습니다. 브라우저 설정에서 알림을 허용해주세요.');
        } else {
            alert('알림 권한이 필요합니다.');
        }
    });
}

function scheduleDailyNotifications() {
    console.log('📅 일일 알림 스케줄링...');
    
    // In real implementation, this would be done by a service worker
    // For demo purposes, we'll show an immediate notification
    
    // Calculate time until next notification
    const now = new Date();
    const notificationTime = new Date();
    notificationTime.setHours(parseInt(notificationSettings.dailyTipTime.split(':')[0]), 0, 0, 0);
    
    if (notificationTime <= now) {
        notificationTime.setDate(notificationTime.getDate() + 1);
    }
    
    const timeUntilNotification = notificationTime - now;
    
    setTimeout(() => {
        sendDailyTipNotification();
    }, Math.min(timeUntilNotification, 5000)); // For demo, max 5 seconds
}

function sendDailyTipNotification() {
    if (Notification.permission === 'granted' && notificationSettings.dailyTips) {
        const tips = [
            '⚡ Ctrl + Shift + T로 실수로 닫은 탭 복구하기',
            '📧 이메일 2분 룰: 2분 안에 답장 가능하면 즉시!',
            '🎯 포모도로 25분 집중 + 5분 휴식',
            '🤖 ChatGPT에 역할을 부여하면 답변 품질 UP'
        ];
        
        const randomTip = tips[Math.floor(Math.random() * tips.length)];
        
        new Notification('오늘의 1% 효율 팁', {
            body: randomTip,
            icon: 'https://via.placeholder.com/128/667eea/ffffff?text=💡',
            requireInteraction: true,
            actions: [
                { action: 'view', title: '자세히 보기' },
                { action: 'dismiss', title: '나중에' }
            ]
        });
    }
}

function sendStreakAlertNotification() {
    if (Notification.permission === 'granted' && notificationSettings.streakAlert) {
        new Notification('🔥 연속 학습 기록 알림', {
            body: '오늘 팁을 완료하지 않으면 7일 연속 기록이 끊어집니다!',
            icon: 'https://via.placeholder.com/128/ef4444/ffffff?text=🔥',
            requireInteraction: true
        });
    }
}

function updateNotificationSettings(settingName) {
    const checkbox = document.getElementById(settingName);
    notificationSettings[settingName] = checkbox.checked;
    
    // Save to localStorage
    localStorage.setItem('notification_settings', JSON.stringify(notificationSettings));
    
    console.log(`Setting updated: ${settingName} = ${checkbox.checked}`);
}

function updateEmail() {
    const email = document.getElementById('emailAddress').value;
    
    if (!email) {
        alert('이메일 주소를 입력하세요.');
        return;
    }
    
    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert('올바른 이메일 주소를 입력하세요.');
        return;
    }
    
    notificationSettings.email = email;
    localStorage.setItem('notification_settings', JSON.stringify(notificationSettings));
    
    alert(`✅ 이메일 주소가 저장되었습니다: ${email}\n\n주간 리포트를 받아보실 수 있습니다!`);
}

function updateSchedule(type) {
    if (type === 'dailyTip') {
        const time = document.getElementById('dailyTipTime').value;
        notificationSettings.dailyTipTime = time;
        alert(`오늘의 팁 알림 시간이 ${time}로 설정되었습니다.`);
    } else if (type === 'weeklyReport') {
        const day = document.getElementById('weeklyReportDay').value;
        notificationSettings.weeklyReportDay = day;
        const dayNames = {
            'monday': '월요일',
            'tuesday': '화요일',
            'wednesday': '수요일',
            'thursday': '목요일',
            'friday': '금요일'
        };
        alert(`주간 리포트가 ${dayNames[day]} 오전에 전송됩니다.`);
    }
    
    localStorage.setItem('notification_settings', JSON.stringify(notificationSettings));
}

// ========================================
// 2. LEARNING PROGRESS TRACKING
// ========================================

let weeklyChart = null;

function loadProgressData() {
    // Load from localStorage
    const saved = localStorage.getItem('learning_progress');
    if (saved) {
        progressData = { ...progressData, ...JSON.parse(saved) };
    }
    
    // Update UI
    document.getElementById('currentStreak').textContent = progressData.currentStreak;
    document.getElementById('maxStreak').textContent = progressData.maxStreak;
    document.getElementById('completedTips').textContent = progressData.completedTips;
    document.getElementById('weeklyTips').textContent = progressData.weeklyTips;
    document.getElementById('totalTime').textContent = progressData.totalTime;
    document.getElementById('avgTime').textContent = progressData.avgTime;
    document.getElementById('totalBadges').textContent = progressData.totalBadges;
    
    // Render chart
    renderWeeklyChart();
}

function renderWeeklyChart() {
    const canvas = document.getElementById('weeklyActivityChart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    // Destroy existing chart
    if (weeklyChart) {
        weeklyChart.destroy();
    }
    
    const days = ['월', '화', '수', '목', '금', '토', '일'];
    
    weeklyChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: days,
            datasets: [{
                label: '학습 시간 (분)',
                data: progressData.weeklyActivity,
                backgroundColor: 'rgba(102, 126, 234, 0.8)',
                borderColor: 'rgb(102, 126, 234)',
                borderWidth: 2,
                borderRadius: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return context.parsed.y + '분';
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return value + '분';
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
            }
        }
    });
}

function changeReportPeriod(period) {
    // Update button states
    const buttons = document.querySelectorAll('.header-actions .btn-ghost');
    buttons.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    console.log(`Report period changed to: ${period}`);
    
    // In real implementation, this would reload data for the selected period
    alert(`${period === 'daily' ? '일간' : period === 'weekly' ? '주간' : '월간'} 리포트로 변경되었습니다.`);
}

function downloadReport() {
    const period = document.querySelector('.header-actions .btn-ghost.active')?.textContent.trim() || '주간';
    
    alert(`📊 ${period} 학습 리포트 다운로드\n\n포함 내용:\n- 학습 시간 및 완료율\n- 카테고리별 진도\n- AI 인사이트\n- 추천 학습 경로\n\n파일: learning_report_${new Date().toISOString().split('T')[0]}.pdf`);
}

// ========================================
// 3. ADVANCED AI MENTOR
// ========================================

let currentMode = 'text';
let isRecording = false;
let recognition = null;

function selectMentorMode(mode) {
    currentMode = mode;
    
    // Update button states
    document.querySelectorAll('.mode-btn').forEach(btn => btn.classList.remove('active'));
    document.getElementById(`mode${mode.charAt(0).toUpperCase() + mode.slice(1)}`).classList.add('active');
    
    // Show/hide interfaces
    document.getElementById('mentorText').style.display = mode === 'text' ? 'block' : 'none';
    document.getElementById('mentorVoice').style.display = mode === 'voice' ? 'block' : 'none';
    document.getElementById('mentorVideo').style.display = mode === 'video' ? 'block' : 'none';
    
    console.log(`Mentor mode: ${mode}`);
}

// Voice Recognition
function initVoiceRecognition() {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
        console.warn('음성 인식이 지원되지 않는 브라우저입니다.');
        return;
    }
    
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition = new SpeechRecognition();
    
    recognition.lang = 'ko-KR';
    recognition.continuous = false;
    recognition.interimResults = false;
    
    recognition.onstart = function() {
        console.log('🎤 음성 인식 시작');
        document.getElementById('voiceStatus').textContent = '듣고 있습니다...';
        document.getElementById('voiceIndicator').style.display = 'flex';
        document.getElementById('voiceAvatar').style.animation = 'pulse 1.5s ease-in-out infinite';
    };
    
    recognition.onresult = function(event) {
        const transcript = event.results[0][0].transcript;
        console.log('📝 인식된 텍스트:', transcript);
        
        // Display transcript
        document.getElementById('voiceTranscript').innerHTML = `
            <div class="transcript-user">
                <strong>당신:</strong> ${transcript}
            </div>
            <div class="transcript-ai">
                <strong>AI 멘토:</strong> "${transcript}"에 대해 답변드리겠습니다. 
                ${generateAIResponse(transcript)}
            </div>
        `;
        
        // Speak response (using Web Speech API)
        speakResponse(generateAIResponse(transcript));
    };
    
    recognition.onerror = function(event) {
        console.error('음성 인식 오류:', event.error);
        document.getElementById('voiceStatus').textContent = '오류 발생: ' + event.error;
        stopVoiceRecording();
    };
    
    recognition.onend = function() {
        console.log('🛑 음성 인식 종료');
        stopVoiceRecording();
    };
}

function toggleVoice() {
    if (isRecording) {
        stopVoiceRecording();
    } else {
        startVoiceRecording();
    }
}

function startVoiceRecording() {
    if (!recognition) {
        initVoiceRecognition();
    }
    
    if (!recognition) {
        alert('음성 인식이 지원되지 않는 브라우저입니다.\n\nChrome, Edge 등의 브라우저를 사용해주세요.');
        return;
    }
    
    isRecording = true;
    recognition.start();
    
    const btn = document.getElementById('voiceBtn');
    btn.innerHTML = '<i class="fas fa-stop"></i><span>녹음 중...</span>';
    btn.style.background = 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)';
}

function stopVoiceRecording() {
    isRecording = false;
    
    if (recognition) {
        recognition.stop();
    }
    
    document.getElementById('voiceStatus').textContent = '준비됨';
    document.getElementById('voiceIndicator').style.display = 'none';
    document.getElementById('voiceAvatar').style.animation = 'none';
    
    const btn = document.getElementById('voiceBtn');
    btn.innerHTML = '<i class="fas fa-microphone"></i><span>눌러서 말하기</span>';
    btn.style.background = '';
}

function generateAIResponse(question) {
    // Simple keyword-based responses
    const lowerQuestion = question.toLowerCase();
    
    if (lowerQuestion.includes('커리어') || lowerQuestion.includes('직무')) {
        return '커리어 발전을 위해서는 현재 보유한 스킬을 기반으로 다음 단계를 계획하는 것이 중요합니다. 목표 직무에 필요한 핵심 역량을 파악하고, 6개월 단위로 학습 계획을 수립해보세요.';
    } else if (lowerQuestion.includes('학습') || lowerQuestion.includes('공부')) {
        return '효과적인 학습을 위해서는 일일 30분 이상 꾸준한 학습과 실전 프로젝트 적용이 중요합니다. 매일 오늘의 팁을 실천하고, 주 1회 이상 학습한 내용을 업무에 적용해보세요.';
    } else if (lowerQuestion.includes('시간') || lowerQuestion.includes('기간')) {
        return '일반적으로 새로운 스킬을 익히는 데는 3-6개월이 소요됩니다. 주당 10시간 이상 투자하면 더 빠른 성장이 가능합니다. KAPP 진단 결과를 기반으로 맞춤 학습 경로를 제공해드립니다.';
    } else {
        return '좋은 질문입니다! 더 구체적인 답변을 위해 "나의 성장" 페이지에서 AI 멘토와 텍스트 채팅을 시작해보세요. 1:1 맞춤 코칭을 제공해드립니다.';
    }
}

function speakResponse(text) {
    if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'ko-KR';
        utterance.rate = 1.0;
        utterance.pitch = 1.0;
        
        speechSynthesis.speak(utterance);
    }
}

// Video Mentor
function startVideoSession() {
    alert('🎥 비디오 멘토링 세션\n\n실시간 비디오 멘토링 기능은 곧 제공될 예정입니다.\n\n포함 예정 기능:\n- AI 아바타 실시간 대화\n- 표정 및 제스처 인식\n- 화면 공유 기능\n- 학습 자료 함께 보기');
}

function selectMentorQuestion(type) {
    const questions = {
        career: [
            '현재 직무에서 다음 단계로 성장하려면?',
            '커리어 전환을 위한 준비 사항은?',
            '프로모션을 위해 필요한 역량은?'
        ],
        skill: [
            '가장 먼저 배워야 할 스킬은?',
            '실무에 바로 적용 가능한 학습 경로는?',
            'AI 시대에 필수적인 스킬은?'
        ]
    };
    
    const list = questions[type].map((q, i) => `${i + 1}. ${q}`).join('\n');
    alert(`📋 ${type === 'career' ? '커리어' : '스킬'} 질문 예시\n\n${list}\n\n이 중 하나를 선택하거나 자유롭게 질문하세요!`);
}

// ========================================
// INITIALIZATION
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('🔔 Notifications & Progress 초기화');
    
    // Load settings
    const savedSettings = localStorage.getItem('notification_settings');
    if (savedSettings) {
        notificationSettings = { ...notificationSettings, ...JSON.parse(savedSettings) };
    }
    
    // Check if push notifications are enabled
    const pushEnabled = localStorage.getItem('push_notifications_enabled');
    if (pushEnabled === 'true') {
        document.getElementById('pushNotificationRequest').style.display = 'none';
    }
    
    // Load email
    if (notificationSettings.email) {
        document.getElementById('emailAddress').value = notificationSettings.email;
    }
    
    // Load progress data
    loadProgressData();
    
    // Initialize voice recognition
    initVoiceRecognition();
    
    // Demo: Send test notification after 3 seconds
    setTimeout(() => {
        if (Notification.permission === 'granted') {
            console.log('📬 테스트 알림 전송 (3초 후)');
        }
    }, 3000);
});

// Demo: Simulate daily notification for testing
function testNotification() {
    sendDailyTipNotification();
}

// Add to window for debugging
window.testNotification = testNotification;
window.sendStreakAlert = sendStreakAlertNotification;
