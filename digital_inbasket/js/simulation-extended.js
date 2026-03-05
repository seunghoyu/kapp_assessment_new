// 확장 시뮬레이션 함수들 (인사, 재무, 고객, 윤리, 전략)

// 인사 관리 - 조직도 기반 갈등 해결
window.renderHRSystemExtended = function(question) {
    const content = document.getElementById('simulation-content');
    
    content.innerHTML = `
        <div class="h-screen bg-gradient-to-br from-pink-50 to-rose-100 flex flex-col">
            <div class="bg-gradient-to-r from-pink-600 to-rose-600 text-white shadow-lg">
                <div class="px-6 py-4">
                    <div class="flex items-center justify-between">
                        <div class="flex items-center space-x-4">
                            <i class="fas fa-sitemap text-3xl"></i>
                            <div>
                                <div class="text-2xl font-bold">조직 갈등 관리 시스템</div>
                                <div class="text-sm opacity-90 mt-1">👥 영업팀 vs 생산팀 협업 중단 위기</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="flex-1 p-6 overflow-y-auto">
                <div class="max-w-6xl mx-auto">
                    <!-- 조직도 -->
                    <div class="bg-white rounded-xl shadow-lg p-6 mb-6">
                        <h3 class="text-xl font-bold mb-4">조직도 및 갈등 상황</h3>
                        <div class="flex justify-center space-x-8">
                            <div class="text-center">
                                <div class="bg-blue-100 border-4 border-blue-500 rounded-lg p-4 w-40">
                                    <i class="fas fa-chart-line text-3xl text-blue-600 mb-2"></i>
                                    <div class="font-bold">영업팀</div>
                                    <div class="text-xs text-gray-600">김팀장, 이과장, 박대리, 최사원</div>
                                </div>
                                <div class="mt-2 text-xs text-red-600">⚠️ 2명 이직 의사</div>
                            </div>
                            
                            <div class="flex items-center">
                                <div class="text-4xl text-red-600 animate-pulse">⚡</div>
                            </div>
                            
                            <div class="text-center">
                                <div class="bg-orange-100 border-4 border-orange-500 rounded-lg p-4 w-40">
                                    <i class="fas fa-industry text-3xl text-orange-600 mb-2"></i>
                                    <div class="font-bold">생산팀</div>
                                    <div class="text-xs text-gray-600">정팀장, 강과장, 윤대리, 조사원</div>
                                </div>
                                <div class="mt-2 text-xs text-red-600">⚠️ 2명 이직 의사</div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- 갈등 원인 및 해결 -->
                    <div class="grid grid-cols-2 gap-6">
                        <div class="bg-white rounded-xl shadow-lg p-6">
                            <h4 class="font-bold mb-3">🔍 갈등 원인</h4>
                            <ul class="text-sm space-y-2">
                                <li class="flex items-start"><span class="text-red-600 mr-2">•</span>영업팀: 생산 지연으로 고객 신뢰 하락</li>
                                <li class="flex items-start"><span class="text-red-600 mr-2">•</span>생산팀: 무리한 납기 요구로 품질 저하</li>
                                <li class="flex items-start"><span class="text-red-600 mr-2">•</span>불명확한 책임 소재</li>
                            </ul>
                        </div>
                        
                        <div class="bg-white rounded-xl shadow-lg p-6">
                            <h4 class="font-bold mb-3">💡 해결 방안 선택</h4>
                            <select id="hr-solution" class="w-full border-2 rounded-lg px-3 py-2 mb-3" onchange="window.completeHRDecision()">
                                <option value="">선택하세요</option>
                                <option value="프로세스개선">📋 명확한 프로세스 수립</option>
                                <option value="중재회의">🤝 중재 회의 주선</option>
                                <option value="인센티브">💰 협업 인센티브 제도</option>
                                <option value="조직개편">🔄 조직 개편 검토</option>
                            </select>
                            <button class="w-full py-2 bg-gradient-to-r from-pink-600 to-rose-600 text-white font-semibold rounded-lg" 
                                    onclick="window.completeHRDecision()">결정 완료</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
};

window.completeHRDecision = function() {
    const sol = document.getElementById('hr-solution')?.value;
    if (!sol) return alert('해결 방안을 선택하세요.');
    document.getElementById('progress-text').textContent = '100%';
    alert('인사 관리 시뮬레이션 완료!');
};

// 재무 관리 - 예산 배분 차트
window.renderFinanceSystemExtended = function(question) {
    const content = document.getElementById('simulation-content');
    
    content.innerHTML = `
        <div class="h-screen bg-gradient-to-br from-emerald-50 to-teal-100 flex flex-col">
            <div class="bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg">
                <div class="px-6 py-4">
                    <div class="flex items-center justify-between">
                        <div><div class="text-2xl font-bold">💰 예산 재배분 시뮬레이션</div></div>
                    </div>
                </div>
            </div>
            
            <div class="flex-1 p-6 overflow-y-auto">
                <div class="max-w-6xl mx-auto">
                    <div class="bg-white rounded-xl shadow-lg p-6">
                        <h3 class="text-xl font-bold mb-4">부서별 예산 요청</h3>
                        <div class="space-y-4">
                            ${['마케팅팀 (6천만원)', '개발팀 (8천만원)', '영업팀 (4천만원)', '인사팀 (2천만원)'].map((dept, i) => `
                                <div class="border-2 rounded-lg p-4">
                                    <div class="flex justify-between items-center mb-2">
                                        <span class="font-bold">${dept}</span>
                                        <input type="range" min="0" max="100" value="0" class="w-48" 
                                               onchange="window.updateFinanceBudget(${i}, this.value)">
                                    </div>
                                    <div id="finance-value-${i}" class="text-sm text-gray-600">할당: 0만원</div>
                                </div>
                            `).join('')}
                        </div>
                        <div class="mt-6 p-4 bg-blue-50 rounded-lg">
                            <div class="font-bold">가용 예산: 7,000만원</div>
                            <div id="finance-remaining" class="text-lg font-bold text-green-600">잔액: 7,000만원</div>
                        </div>
                        <button class="w-full mt-4 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold rounded-lg" 
                                onclick="completeSimulation()">완료</button>
                    </div>
                </div>
            </div>
        </div>
    `;
};

window.updateFinanceBudget = function(idx, val) {
    const amounts = [6000, 8000, 4000, 2000];
    const allocated = Math.round(amounts[idx] * val / 100);
    document.getElementById(`finance-value-${idx}`).textContent = `할당: ${allocated.toLocaleString()}만원`;
    
    let total = 0;
    for (let i = 0; i < 4; i++) {
        const v = document.querySelector(`input[onchange*="updateFinanceBudget(${i}"]`)?.value || 0;
        total += Math.round(amounts[i] * v / 100);
    }
    const remaining = 7000 - total;
    document.getElementById('finance-remaining').textContent = `잔액: ${remaining.toLocaleString()}만원`;
    document.getElementById('finance-remaining').className = remaining >= 0 ? 'text-lg font-bold text-green-600' : 'text-lg font-bold text-red-600';
};

// 고객 관리 - CRM 대시보드
window.renderCRMSystemExtended = function(question) {
    const content = document.getElementById('simulation-content');
    
    content.innerHTML = `
        <div class="h-screen bg-gradient-to-br from-violet-50 to-purple-100 flex flex-col">
            <div class="bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-lg">
                <div class="px-6 py-4">
                    <div><div class="text-2xl font-bold">🎧 VIP 고객 이탈 위기 관리</div></div>
                </div>
            </div>
            
            <div class="flex-1 p-6 overflow-y-auto">
                <div class="max-w-6xl mx-auto">
                    <div class="bg-white rounded-xl shadow-lg p-6 mb-6">
                        <h3 class="text-xl font-bold mb-4">고객 정보</h3>
                        <div class="grid grid-cols-3 gap-4">
                            <div class="bg-purple-50 rounded p-4">
                                <div class="text-sm text-gray-600">고객명</div>
                                <div class="text-xl font-bold">A사 (플래티넘)</div>
                            </div>
                            <div class="bg-purple-50 rounded p-4">
                                <div class="text-sm text-gray-600">연 거래액</div>
                                <div class="text-xl font-bold text-purple-600">15억원</div>
                            </div>
                            <div class="bg-red-50 rounded p-4">
                                <div class="text-sm text-gray-600">품질 문제</div>
                                <div class="text-xl font-bold text-red-600">4회 (3개월)</div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="bg-white rounded-xl shadow-lg p-6">
                        <h3 class="text-xl font-bold mb-4">대응 방안</h3>
                        <div class="space-y-3">
                            <select id="crm-action" class="w-full border-2 rounded-lg px-3 py-2">
                                <option value="">선택하세요</option>
                                <option value="할인수용">💰 30% 할인 + 5년 보증 수용</option>
                                <option value="절충안">🤝 15% 할인 + 3년 보증 제안</option>
                                <option value="품질개선">🔧 품질 개선 + 보상금 지급</option>
                                <option value="경영진미팅">👔 CEO 직접 방문 사과</option>
                            </select>
                            <button class="w-full py-3 bg-gradient-to-r from-violet-600 to-purple-600 text-white font-bold rounded-lg" 
                                    onclick="window.completeCRMDecision()">결정 완료</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
};

window.completeCRMDecision = function() {
    const action = document.getElementById('crm-action')?.value;
    if (!action) return alert('대응 방안을 선택하세요.');
    document.getElementById('progress-text').textContent = '100%';
    alert('고객 관리 시뮬레이션 완료!');
};

// 윤리 경영 - 제보 처리 워크플로우
window.renderComplianceSystemExtended = function(question) {
    const content = document.getElementById('simulation-content');
    
    content.innerHTML = `
        <div class="h-screen bg-gradient-to-br from-slate-50 to-gray-100 flex flex-col">
            <div class="bg-gradient-to-r from-slate-700 to-gray-800 text-white shadow-lg">
                <div class="px-6 py-4">
                    <div><div class="text-2xl font-bold">⚖️ 내부 부정 제보 처리</div></div>
                </div>
            </div>
            
            <div class="flex-1 p-6 overflow-y-auto">
                <div class="max-w-6xl mx-auto">
                    <div class="bg-white rounded-xl shadow-lg p-6 mb-6">
                        <h3 class="text-xl font-bold mb-4 text-red-600">🚨 제보 내용</h3>
                        <div class="bg-red-50 border-l-4 border-red-500 p-4">
                            <p class="text-sm">구매팀 부장의 리베이트 수수 의혹</p>
                            <p class="text-sm">증거: 계좌이체 내역 5건 (총 3천만원)</p>
                            <p class="text-sm">제보자: 익명 (내부 직원 추정)</p>
                        </div>
                    </div>
                    
                    <div class="bg-white rounded-xl shadow-lg p-6">
                        <h3 class="text-xl font-bold mb-4">처리 프로세스</h3>
                        <div class="space-y-4">
                            <div class="border-2 rounded-lg p-4">
                                <div class="font-bold mb-2">1단계: 초기 대응</div>
                                <select id="compliance-step1" class="w-full border rounded px-3 py-2 text-sm">
                                    <option value="">선택</option>
                                    <option value="즉시조사">⚡ 즉시 내부 조사 착수</option>
                                    <option value="외부감사">🔍 외부 감사 기관 의뢰</option>
                                    <option value="신중접근">⏰ 신중한 사실 확인</option>
                                </select>
                            </div>
                            
                            <div class="border-2 rounded-lg p-4">
                                <div class="font-bold mb-2">2단계: 인사 조치</div>
                                <select id="compliance-step2" class="w-full border rounded px-3 py-2 text-sm">
                                    <option value="">선택</option>
                                    <option value="즉시정직">⛔ 즉시 정직 처분</option>
                                    <option value="직무배제">📋 조사 기간 직무 배제</option>
                                    <option value="정상근무">✅ 정상 근무 유지</option>
                                </select>
                            </div>
                            
                            <div class="border-2 rounded-lg p-4">
                                <div class="font-bold mb-2">3단계: 재발 방지</div>
                                <select id="compliance-step3" class="w-full border rounded px-3 py-2 text-sm">
                                    <option value="">선택</option>
                                    <option value="제도개선">📜 구매 프로세스 개선</option>
                                    <option value="교육강화">📚 윤리 교육 강화</option>
                                    <option value="감시강화">👁️ 내부 감시 시스템 구축</option>
                                </select>
                            </div>
                            
                            <button class="w-full py-3 bg-gradient-to-r from-slate-700 to-gray-800 text-white font-bold rounded-lg" 
                                    onclick="window.completeComplianceDecision()">결정 완료</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
};

window.completeComplianceDecision = function() {
    const s1 = document.getElementById('compliance-step1')?.value;
    const s2 = document.getElementById('compliance-step2')?.value;
    const s3 = document.getElementById('compliance-step3')?.value;
    if (!s1 || !s2 || !s3) return alert('모든 단계를 선택하세요.');
    document.getElementById('progress-text').textContent = '100%';
    alert('윤리 경영 시뮬레이션 완료!');
};

// 전략 기획 - 의사결정 매트릭스
window.renderStrategyBoardExtended = function(question) {
    const content = document.getElementById('simulation-content');
    
    content.innerHTML = `
        <div class="h-screen bg-gradient-to-br from-indigo-50 to-blue-100 flex flex-col">
            <div class="bg-gradient-to-r from-indigo-600 to-blue-700 text-white shadow-lg">
                <div class="px-6 py-4">
                    <div><div class="text-2xl font-bold">📈 경쟁사 인수 의사결정 매트릭스</div></div>
                </div>
            </div>
            
            <div class="flex-1 p-6 overflow-y-auto">
                <div class="max-w-6xl mx-auto">
                    <!-- 매트릭스 -->
                    <div class="bg-white rounded-xl shadow-lg p-6 mb-6">
                        <h3 class="text-xl font-bold mb-4">인수 조건</h3>
                        <div class="grid grid-cols-2 gap-6">
                            <div class="space-y-4">
                                <div class="bg-blue-50 rounded p-4">
                                    <div class="font-bold text-blue-800">긍정 요소 ✓</div>
                                    <ul class="text-sm mt-2 space-y-1">
                                        <li>• 시장점유율 1위 가능</li>
                                        <li>• 기술력 확보</li>
                                        <li>• 고객 기반 확대</li>
                                        <li>• 시너지 효과 예상</li>
                                    </ul>
                                </div>
                            </div>
                            
                            <div class="space-y-4">
                                <div class="bg-red-50 rounded p-4">
                                    <div class="font-bold text-red-800">부정 요소 ✗</div>
                                    <ul class="text-sm mt-2 space-y-1">
                                        <li>• 150억원 고액 투자</li>
                                        <li>• 실사 기간 부족 (72시간)</li>
                                        <li>• 조직 문화 차이</li>
                                        <li>• 인수 후 통합 리스크</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- 의사결정 -->
                    <div class="bg-white rounded-xl shadow-lg p-6">
                        <h3 class="text-xl font-bold mb-4">최종 의사결정</h3>
                        <div class="space-y-3">
                            <select id="strategy-decision" class="w-full border-2 rounded-lg px-3 py-2">
                                <option value="">선택하세요</option>
                                <option value="즉시인수">✅ 즉시 인수 진행 (기회 포착)</option>
                                <option value="조건부수용">🤝 조건부 수용 (실사 기간 연장 요청)</option>
                                <option value="부분인수">📊 부분 지분 인수 (리스크 최소화)</option>
                                <option value="거절">❌ 인수 거절 (리스크 과다)</option>
                            </select>
                            
                            <textarea id="strategy-note" class="w-full border-2 rounded-lg px-3 py-2" rows="3" placeholder="결정 근거 및 실행 계획..."></textarea>
                            
                            <button class="w-full py-3 bg-gradient-to-r from-indigo-600 to-blue-700 text-white font-bold rounded-lg" 
                                    onclick="window.completeStrategyDecision()">결정 완료</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
};

window.completeStrategyDecision = function() {
    const decision = document.getElementById('strategy-decision')?.value;
    if (!decision) return alert('의사결정을 선택하세요.');
    document.getElementById('progress-text').textContent = '100%';
    alert('전략 기획 시뮬레이션 완료!');
};
