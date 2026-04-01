/**
 * KAPP index.html — buildQuestions() P2 라우팅 패치
 * v2: IB[industry] 단독 조회 → IB[scenario_key] 복합키 조회 + fallback 체인
 *
 * 적용 위치: buildQuestions(ctx) 함수 내 P2 섹션
 * ctx 구조: { industry, job, level, size, type, tenure, name }
 * job → JOB_FAMILY[job] → { id, group } 로 확장 필요
 */

// ── 1. JOB_FAMILY 데이터 구조 확장 (기존: string → 객체)
// 기존: JOB_FAMILY = { "마케터": "marketing", ... }
// 변경: JOB_FAMILY = { "마케터": { id: "JF_MARKETING_01", group: "MARKETING" }, ... }
// (점진적 적용: string이면 하위호환 처리)

function getJfGroup(job) {
  const jf = JOB_FAMILY[job];
  if (!jf) return null;
  if (typeof jf === 'string') {
    // 하위호환: 기존 string → 대문자 group으로 변환
    return jf.toUpperCase();
  }
  return jf.group || jf.toUpperCase();
}

// ── 2. P2 시나리오 조회 함수 (핵심 변경)
function getP2Scenario(ctx) {
  const industry = ctx.industry || 'IT_TECH';
  const jfGroup  = getJfGroup(ctx.job) || 'COMMON';
  const roleLevel = ctx.level || 3;

  // fallback 체인 순서대로 조회
  const lookupKeys = [
    `${industry}_${jfGroup}_L${roleLevel}`,  // step 1: 산업+직무+직급
    `${industry}_${jfGroup}`,                 // step 2: 산업+직무 ← 핵심
    `${industry}_${jfGroup.split('_')[0]}`,   // step 3: 산업+직무상위
    `${industry}_COMMON`,                     // step 4: 산업 공통
  ];

  for (const key of lookupKeys) {
    if (IB[key] && IB[key].length > 0) {
      // 같은 키에 여러 시나리오가 있으면 랜덤 1개
      const pool = IB[key];
      return pool[Math.floor(Math.random() * pool.length)];
    }
  }

  // step 5: 실시간 생성 (현재는 플레이스홀더 — 추후 API 연결)
  console.warn(`[P2] No scenario found for keys: ${lookupKeys.join(', ')}. Using placeholder.`);
  return getP2Placeholder(industry, jfGroup);
}

function getP2Placeholder(industry, jfGroup) {
  return {
    scenario_key: `${industry}_${jfGroup}`,
    world: {
      company_name: "주식회사 케이앱",
      industry_context: `${industry} 산업 환경`,
      team_context: `${jfGroup} 직무 팀`,
      role_description: "팀 내 중간관리자"
    },
    trigger_event: "오늘 오전, 출근하자마자 처리해야 할 긴급 이메일 4건이 쌓여 있습니다.",
    emails: [
      {
        email_id: "E1",
        from: "김팀장 (상사)",
        subject: "[긴급] 오늘 오후 3시 임원 보고 자료 준비 요청",
        body: "오늘 오후 3시에 임원 보고가 갑자기 잡혔습니다. 지난달 성과 데이터와 이번 달 계획을 1페이지로 정리해주세요. 최대한 빨리 부탁드립니다.",
        urgency: "high",
        type: "요청",
        stakeholder: "상사"
      },
      {
        email_id: "E2",
        from: "이대리 (팀원)",
        subject: "오늘 오전 미팅 관련 자료 공유",
        body: "오전 10시 팀 미팅 자료입니다. 검토 후 피드백 주시면 감사하겠습니다. 특히 3페이지 데이터 해석 부분이 맞는지 확인 부탁드립니다.",
        urgency: "medium",
        type: "보고",
        stakeholder: "부하"
      },
      {
        email_id: "E3",
        from: "박과장 (타부서)",
        subject: "협업 프로젝트 일정 조율 요청",
        body: "지난주에 말씀드린 협업 건 관련해서 이번 주 안에 일정을 확정해야 합니다. 가능한 날짜 공유 부탁드립니다.",
        urgency: "medium",
        type: "요청",
        stakeholder: "동료"
      },
      {
        email_id: "E4",
        from: "총무팀",
        subject: "사무용품 신청 마감 안내 (이번 주 금요일까지)",
        body: "이번 달 사무용품 신청 마감이 이번 주 금요일입니다. 필요한 물품 있으시면 신청서 작성 후 제출해주세요.",
        urgency: "low",
        type: "정보",
        stakeholder: "내부기관"
      }
    ],
    scoring_criteria: {
      priority_ranking: {
        optimal: ["E1", "E2", "E3", "E4"],
        acceptable: ["E1", "E3", "E2", "E4"],
        rationale: "임원 보고(E1)가 최우선. 팀원 피드백(E2)은 미팅 전 처리. 협업 일정(E3)은 금일 중. 사무용품(E4)은 금요일까지."
      },
      action_points: [
        { email_id: "E1", optimal_action: "즉시 착수, AI로 초안 작성 후 팀장 중간 확인", acceptable_action: "직접 작성 후 제출", avoid: "다른 업무 먼저 처리", score_weight: 0.35 },
        { email_id: "E2", optimal_action: "미팅 전 검토 완료 후 구체적 피드백", acceptable_action: "미팅 후 피드백", avoid: "무응답", score_weight: 0.25 },
        { email_id: "E3", optimal_action: "가능 일정 2~3개 제시하며 빠른 확정", acceptable_action: "오늘 중 회신", avoid: "이번 주 내 무응답", score_weight: 0.25 },
        { email_id: "E4", optimal_action: "E1~E3 처리 후 여유 시간에 신청", acceptable_action: "금요일 전 신청", avoid: "마감 초과", score_weight: 0.15 }
      ],
      ai_use_opportunity: "E1 보고 자료 초안 작성에 AI 활용 시 가산점",
      validation_check: "E1 보고 자료의 데이터 수치가 E2 자료와 일치하는지 교차 확인"
    }
  };
}

// ── 3. IB 데이터 구조 변경 (기존 → 신규)
// 기존: IB = { "IT_TECH": { emails: [...] }, ... }
// 신규: IB = { "IT_TECH_HR": [{ ...scenario }], "IT_TECH_IT_DEV": [{ ...scenario }], ... }
//
// 하위호환 래퍼: 기존 IB 구조도 읽을 수 있게 처리
function migrateIBLegacy(legacyIB) {
  const newIB = {};
  for (const [industry, scenario] of Object.entries(legacyIB)) {
    // 기존 구조(단일 객체)를 COMMON으로 마이그레이션
    if (!Array.isArray(scenario)) {
      const key = `${industry}_COMMON`;
      newIB[key] = [scenario];
    } else {
      // 이미 배열이면 그대로
      newIB[industry] = scenario;
    }
  }
  return newIB;
}

// ── 4. buildQuestions() 내 P2 섹션 교체 코드
// 기존 코드 (제거):
//   const ibScenario = IB[ctx.industry] || IB['IT_TECH'];
//
// 신규 코드 (적용):
//   const ibScenario = getP2Scenario(ctx);
//
// 나머지 P2 문항 생성 로직은 동일하게 유지

