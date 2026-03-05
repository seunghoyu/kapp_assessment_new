// 연간 마케팅 전략 회의 일정 조율 UI
function renderMarketingStrategyMeeting(question) {
    const content = document.getElementById('simulation-content');
    
    const conflictingMeetings = [
        { id: 1, time: '14:00-16:00', title: '마케팅 전략 회의', attendees: ['CEO', 'CMO', '마케팅팀 전원(10명)'], room: '본사 대회의실', importance: 'critical', canMove: false },
        { id: 2, time: '14:00-15:00', title: '신입사원 오리엔테이션', attendees: ['인사팀장', '신입사원 15명'], room: '3층 세미나실', importance: 'medium', canMove: true },
        { id: 3, time: '14:30-16:00', title: '협력업체 미팅', attendees: ['구매팀장', '협력사 대표'], room: '2층 소회의실', importance: 'high', canMove: true }
    ];
    
    totalTasks = conflictingMeetings.length;
    
    content.innerHTML = `
        <div class="h-screen bg-gradient-to-br from-indigo-50 to-purple-100 flex flex-col">
            <div class="bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg">
                <div class="px-6 py-4">
                    <div class="flex items-center justify-between">
                        <div class="flex items-center space-x-4">
                            <i class="fas fa-calendar-check text-3xl"></i>
                            <div>
                                <div class="text-2xl font-bold">${question.title || '연간 마케팅 전략 회의 일정 조율'}</div>
                                <div class="text-sm opacity-90 mt-1">${question.sender || '경영기획팀'} • ${question.date || '2026-02-23'}</div>
                            </div>
                        </div>
                        <div class="text-right">
                            <div class="text-sm opacity-75">조율 진행률</div>
                            <div class="text-3xl font-bold" id="calendar-progress-text">0%</div>
                        </div>
                    </div>
                </div>
                <div class="px-6 pb-3">
                    <div class="bg-white bg-opacity-20 rounded-lg p-3">
                        <div class="flex items-start text-sm">
                            <i class="fas fa-info-circle mr-2 mt-0.5"></i>
                            <div>${question.content || '2026년 3월 4일(화) 오후 2시에 마케팅 전략 회의가 예정되어 있으나, 동일 시간대에 다른 회의 3건이 중복되어 있습니다. 각 회의의 중요도와 참석자를 고려하여 일정을 조율해주세요.'}</div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="flex-1 p-6 overflow-y-auto">
                <div class="max-w-6xl mx-auto">
                    <!-- 타임라인 시각화 -->
                    <div class="bg-white rounded-xl shadow-lg p-6 mb-6">
                        <h3 class="text-xl font-bold mb-4 flex items-center">
                            <i class="fas fa-clock text-indigo-600 mr-2"></i>
                            2026년 3월 4일 (화) 일정 타임라인
                        </h3>
                        <div class="relative">
                            <div class="flex text-xs text-gray-500 mb-2">
                                <div class="w-20">시간</div>
                                <div class="flex-1 grid grid-cols-4">
                                    <div>13:00</div>
                                    <div>14:00</div>
                                    <div>15:00</div>
                                    <div>16:00</div>
                                </div>
                            </div>
                            <div class="flex">
                                <div class="w-20"></div>
                                <div class="flex-1 relative" style="height: 150px;">
                                    <!-- 13:00-17:00 그리드 -->
                                    <div class="absolute inset-0 grid grid-cols-4 border-l border-t">
                                        <div class="border-r border-b"></div>
                                        <div class="border-r border-b bg-red-50"></div>
                                        <div class="border-r border-b bg-red-50"></div>
                                        <div class="border-r border-b"></div>
                                    </div>
                                    <!-- 충돌 표시 -->
                                    <div class="absolute top-1/2 left-1/4 right-0 transform -translate-y-1/2 bg-red-200 border-2 border-red-600 rounded-lg p-2 animate-pulse">
                                        <div class="text-sm font-bold text-red-800">⚠️ 3개 회의 동시 진행 중</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- 회의 조율 카드 -->
                    <div class="space-y-4">
                        ${conflictingMeetings.map(meeting => `
                            <div class="bg-white rounded-xl shadow-lg p-6 ${meeting.importance === 'critical' ? 'border-2 border-red-500' : ''}" id="meeting-${meeting.id}">
                                <div class="flex items-start justify-between mb-4">
                                    <div class="flex-1">
                                        <div class="flex items-center mb-2">
                                            ${meeting.importance === 'critical' ? '<span class="px-2 py-1 bg-red-100 text-red-700 text-xs font-bold rounded mr-2">🔴 필수</span>' : meeting.importance === 'high' ? '<span class="px-2 py-1 bg-orange-100 text-orange-700 text-xs font-bold rounded mr-2">🟠 중요</span>' : '<span class="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded mr-2">🔵 보통</span>'}
                                            ${!meeting.canMove ? '<span class="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-bold rounded">⚠️ 일정 변경 불가</span>' : ''}
                                        </div>
                                        <h4 class="text-lg font-bold text-gray-800 mb-2">${meeting.title}</h4>
                                        <div class="grid grid-cols-2 gap-3 text-sm text-gray-600">
                                            <div><i class="fas fa-clock mr-2 text-indigo-500"></i>${meeting.time}</div>
                                            <div><i class="fas fa-map-marker-alt mr-2 text-green-500"></i>${meeting.room}</div>
                                        </div>
                                        <div class="mt-2 text-sm text-gray-700">
                                            <i class="fas fa-users mr-2 text-purple-500"></i>
                                            <strong>참석자:</strong> ${meeting.attendees.join(', ')}
                                        </div>
                                    </div>
                                </div>
                                
                                <div class="mb-4">
                                    <label class="block text-sm font-semibold text-gray-700 mb-2">조율 결정</label>
                                    <select id="meeting-decision-${meeting.id}" class="w-full border-2 rounded-lg px-3 py-2 mb-2" onchange="updateMeetingDecision(${meeting.id})">
                                        <option value="">선택하세요</option>
                                        ${meeting.canMove ? `
                                            <option value="reschedule-morning">📅 오전으로 변경 (09:00-10:00)</option>
                                            <option value="reschedule-afternoon">📅 오후로 변경 (16:00-17:00)</option>
                                            <option value="reschedule-next-day">📅 다음 날로 연기 (3월 5일)</option>
                                            <option value="online">💻 온라인 미팅 전환 (장소 제약 해소)</option>
                                        ` : `
                                            <option value="keep">✅ 현재 시간 유지 (다른 회의 조정 필요)</option>
                                        `}
                                        <option value="cancel">❌ 회의 취소</option>
                                    </select>
                                </div>
                                
                                <div>
                                    <label class="block text-sm font-semibold text-gray-700 mb-2">참석자 통보 메시지</label>
                                    <textarea id="meeting-message-${meeting.id}" placeholder="일정 변경 사유 및 참석 요청 메시지 작성" class="w-full border-2 rounded-lg px-3 py-2 text-sm" rows="2"></textarea>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                    
                    <!-- 최종 조율 결과 -->
                    <div class="bg-gradient-to-r from-indigo-100 to-purple-100 rounded-xl shadow-lg p-6 mt-6">
                        <h3 class="text-xl font-bold mb-4"><i class="fas fa-check-circle mr-2"></i>일정 조율 결과</h3>
                        <div id="meeting-summary" class="text-sm space-y-2">
                            <div class="text-gray-600">아직 결정되지 않았습니다</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    window.meetingDecisions = {};
}

function updateMeetingDecision(id) {
    const select = document.getElementById(`meeting-decision-${id}`);
    const message = document.getElementById(`meeting-message-${id}`).value;
    
    if (select.value) {
        window.meetingDecisions[id] = {
            decision: select.options[select.selectedIndex].text,
            message: message
        };
        
        const card = document.getElementById(`meeting-${id}`);
        if (select.value.includes('cancel')) {
            card.classList.add('border-2', 'border-red-500', 'bg-red-50');
        } else {
            card.classList.add('border-2', 'border-green-500', 'bg-green-50');
        }
        
        const completed = Object.keys(window.meetingDecisions).length;
        const percentage = Math.round((completed / totalTasks) * 100);
        document.getElementById('calendar-progress-text').textContent = `${percentage}%`;
        document.getElementById('progress-text').textContent = `${percentage}%`;
        
        updateMeetingSummary();
    }
}

function updateMeetingSummary() {
    const summary = document.getElementById('meeting-summary');
    const decisions = window.meetingDecisions;
    
    let html = '';
    Object.keys(decisions).forEach(id => {
        const dec = decisions[id];
        html += `<div class="flex items-start"><i class="fas fa-check-circle text-green-600 mr-2 mt-1"></i><div><strong>회의 #${id}:</strong> ${dec.decision}</div></div>`;
    });
    
    if (html === '') {
        html = '<div class="text-gray-600">아직 결정되지 않았습니다</div>';
    }
    
    summary.innerHTML = html;
}

// 사무실 냉난방기 고장 - 수리 업체 선정 UI
function renderHVACRepair(question) {
    const content = document.getElementById('simulation-content');
    
    const vendors = [
        { id: 1, name: 'A공조', price: 80, arrivalTime: '1시간', repairTime: '2시간', warranty: '1년', rating: 4.5, reviews: 234 },
        { id: 2, name: 'B설비', price: 120, arrivalTime: '30분', repairTime: '1시간', warranty: '2년', rating: 4.8, reviews: 456 },
        { id: 3, name: 'C기술', price: 60, arrivalTime: '3시간', repairTime: '3시간', warranty: '6개월', rating: 4.0, reviews: 89 }
    ];
    
    totalTasks = 4; // 업체 선정, 임시 조치, 예산 결재, 직원 안내
    
    content.innerHTML = `
        <div class="h-screen bg-gradient-to-br from-orange-50 to-red-100 flex flex-col">
            <div class="bg-gradient-to-r from-orange-600 to-red-600 text-white shadow-lg">
                <div class="px-6 py-4">
                    <div class="flex items-center justify-between">
                        <div class="flex items-center space-x-4">
                            <i class="fas fa-thermometer-half text-3xl"></i>
                            <div>
                                <div class="text-2xl font-bold">${question.title || '사무실 냉난방기 고장 - 긴급 수리'}</div>
                                <div class="text-sm opacity-90 mt-1">${question.sender || '총무팀'} • ${question.date || '2026-02-23 08:30'}</div>
                            </div>
                        </div>
                        <div class="text-right">
                            <div class="text-sm opacity-75">처리 진행률</div>
                            <div class="text-3xl font-bold" id="hvac-progress-text">0%</div>
                        </div>
                    </div>
                </div>
                <div class="px-6 pb-3">
                    <div class="bg-white bg-opacity-20 rounded-lg p-3">
                        <div class="flex items-start text-sm">
                            <i class="fas fa-exclamation-triangle mr-2 mt-0.5"></i>
                            <div>${question.content || '오전 8시 30분, 사무실 냉난방기가 고장났습니다. 현재 실내 온도 13도로 직원들이 업무에 어려움을 겪고 있습니다. 3개 업체에서 견적을 받았으며, 임시 조치와 함께 긴급 수리 업체를 선정해야 합니다.'}</div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="flex-1 p-6 overflow-y-auto">
                <div class="max-w-6xl mx-auto">
                    <!-- 현재 상황 -->
                    <div class="bg-white rounded-xl shadow-lg p-6 mb-6">
                        <h3 class="text-xl font-bold mb-4 flex items-center">
                            <i class="fas fa-info-circle text-red-600 mr-2"></i>
                            현재 상황
                        </h3>
                        <div class="grid grid-cols-4 gap-4">
                            <div class="text-center p-4 bg-red-50 rounded-lg">
                                <div class="text-3xl font-bold text-red-600">13°C</div>
                                <div class="text-sm text-gray-600 mt-1">현재 실내 온도</div>
                            </div>
                            <div class="text-center p-4 bg-blue-50 rounded-lg">
                                <div class="text-3xl font-bold text-blue-600">45명</div>
                                <div class="text-sm text-gray-600 mt-1">재실 직원 수</div>
                            </div>
                            <div class="text-center p-4 bg-orange-50 rounded-lg">
                                <div class="text-3xl font-bold text-orange-600">3시간</div>
                                <div class="text-sm text-gray-600 mt-1">고장 경과 시간</div>
                            </div>
                            <div class="text-center p-4 bg-purple-50 rounded-lg">
                                <div class="text-3xl font-bold text-purple-600">18°C</div>
                                <div class="text-sm text-gray-600 mt-1">목표 온도</div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- 1. 수리 업체 선정 -->
                    <div class="mb-6">
                        <h3 class="text-xl font-bold mb-4 flex items-center">
                            <i class="fas fa-tools text-orange-600 mr-2"></i>
                            1. 수리 업체 선정
                        </h3>
                        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                            ${vendors.map(vendor => `
                                <div class="bg-white rounded-xl shadow-lg p-5 border-2 cursor-pointer hover:border-orange-500 transition-all" 
                                     id="vendor-${vendor.id}" 
                                     onclick="selectVendor(${vendor.id})">
                                    <div class="flex items-center justify-between mb-3">
                                        <h4 class="text-lg font-bold">${vendor.name}</h4>
                                        <div class="flex items-center text-yellow-500">
                                            <i class="fas fa-star mr-1"></i>
                                            <span class="text-sm font-semibold">${vendor.rating}</span>
                                            <span class="text-xs text-gray-500 ml-1">(${vendor.reviews})</span>
                                        </div>
                                    </div>
                                    <div class="space-y-2 text-sm text-gray-700">
                                        <div><i class="fas fa-won-sign mr-2 text-green-500"></i><strong>견적:</strong> ${vendor.price}만원</div>
                                        <div><i class="fas fa-car mr-2 text-blue-500"></i><strong>도착:</strong> ${vendor.arrivalTime}</div>
                                        <div><i class="fas fa-wrench mr-2 text-orange-500"></i><strong>수리:</strong> ${vendor.repairTime}</div>
                                        <div><i class="fas fa-shield-alt mr-2 text-purple-500"></i><strong>보증:</strong> ${vendor.warranty}</div>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                    
                    <!-- 2. 임시 조치 -->
                    <div class="bg-white rounded-xl shadow-lg p-6 mb-6" id="temp-measure">
                        <h3 class="text-lg font-bold mb-4 flex items-center">
                            <i class="fas fa-fire-alt text-red-600 mr-2"></i>
                            2. 임시 조치 선택
                        </h3>
                        <select id="temp-action" class="w-full border-2 rounded-lg px-3 py-2 mb-3" onchange="updateTempAction()">
                            <option value="">선택하세요</option>
                            <option value="heater">🔥 전기 히터 대여 (10대, 20만원)</option>
                            <option value="remote">💻 재택근무 전환 (오늘 하루)</option>
                            <option value="early">⏰ 조기 퇴근 (오후 2시)</option>
                            <option value="space">🏢 다른 사무공간 임시 이동</option>
                        </select>
                    </div>
                    
                    <!-- 3. 예산 결재 -->
                    <div class="bg-white rounded-xl shadow-lg p-6 mb-6" id="budget-approval">
                        <h3 class="text-lg font-bold mb-4 flex items-center">
                            <i class="fas fa-file-invoice-dollar text-green-600 mr-2"></i>
                            3. 긴급 예산 결재 요청
                        </h3>
                        <div class="mb-3">
                            <label class="block text-sm font-semibold text-gray-700 mb-2">결재 라인</label>
                            <select id="approval-line" class="w-full border-2 rounded-lg px-3 py-2" onchange="updateApproval()">
                                <option value="">선택하세요</option>
                                <option value="normal">📋 일반 결재 (팀장→부장→이사, 1일 소요)</option>
                                <option value="urgent">⚡ 긴급 결재 (부장 직결, 2시간)</option>
                                <option value="skip">🏃 전결 처리 (즉시, 사후 보고)</option>
                            </select>
                        </div>
                    </div>
                    
                    <!-- 4. 직원 안내 -->
                    <div class="bg-white rounded-xl shadow-lg p-6" id="staff-notice">
                        <h3 class="text-lg font-bold mb-4 flex items-center">
                            <i class="fas fa-bullhorn text-purple-600 mr-2"></i>
                            4. 직원 안내 메시지 작성
                        </h3>
                        <textarea id="notice-message" placeholder="직원들에게 보낼 안내 메시지를 작성하세요 (현황, 조치사항, 예상 복구 시간 등)" class="w-full border-2 rounded-lg px-3 py-2 text-sm" rows="4" onchange="updateNotice()"></textarea>
                        <div class="mt-3 flex space-x-2">
                            <button onclick="sendNoticeEmail()" class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm">
                                <i class="fas fa-envelope mr-2"></i>이메일 발송
                            </button>
                            <button onclick="sendNoticeMessenger()" class="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 text-sm">
                                <i class="fas fa-comment mr-2"></i>메신저 발송
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    window.hvacDecisions = { vendor: null, tempAction: null, approval: null, notice: null };
}

function selectVendor(id) {
    document.querySelectorAll('[id^="vendor-"]').forEach(card => {
        card.classList.remove('border-orange-500', 'bg-orange-50');
    });
    
    const card = document.getElementById(`vendor-${id}`);
    card.classList.add('border-orange-500', 'bg-orange-50');
    
    window.hvacDecisions.vendor = id;
    updateHVACProgress();
}

function updateTempAction() {
    const select = document.getElementById('temp-action');
    if (select.value) {
        window.hvacDecisions.tempAction = select.value;
        document.getElementById('temp-measure').classList.add('border-2', 'border-green-500', 'bg-green-50');
        updateHVACProgress();
    }
}

function updateApproval() {
    const select = document.getElementById('approval-line');
    if (select.value) {
        window.hvacDecisions.approval = select.value;
        document.getElementById('budget-approval').classList.add('border-2', 'border-green-500', 'bg-green-50');
        updateHVACProgress();
    }
}

function updateNotice() {
    const message = document.getElementById('notice-message').value;
    if (message.length > 10) {
        window.hvacDecisions.notice = message;
        document.getElementById('staff-notice').classList.add('border-2', 'border-green-500', 'bg-green-50');
        updateHVACProgress();
    }
}

function sendNoticeEmail() {
    alert('✅ 이메일이 전 직원에게 발송되었습니다.');
}

function sendNoticeMessenger() {
    alert('✅ 메신저 메시지가 전 직원에게 발송되었습니다.');
}

function updateHVACProgress() {
    const decisions = window.hvacDecisions;
    const completed = Object.values(decisions).filter(d => d !== null).length;
    const percentage = Math.round((completed / totalTasks) * 100);
    
    document.getElementById('hvac-progress-text').textContent = `${percentage}%`;
    document.getElementById('progress-text').textContent = `${percentage}%`;
}

// Export functions to window
window.renderMarketingStrategyMeeting = renderMarketingStrategyMeeting;
window.renderHVACRepair = renderHVACRepair;
