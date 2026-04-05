/**
 * aiToolsCatalog.json: Papago·Kanana 제거 + focusStrengths(특화·강점) 병합
 * 실행: node scripts/merge-ai-catalog-focus-strengths.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const catalogPath = path.join(root, "data", "kappDiagnosis", "aiToolsCatalog.json");

const REMOVE_IDS = new Set(["naver_papago", "kakao_kanana"]);

/** toolId → 한 줄 특화·강점 (공개 자료·벤더 설명 기반 요약) */
const FOCUS = {
  chatgpt_team:
    "질문 기반 글·아이디어·코드 등을 만드는 범용 대화형 AI·멀티목적 활용에 강함.",
  copilot_github:
    "IDE 안 코드 자동완성·생성과 자연어→코드 변환 코딩 보조에 특화.",
  cursor:
    "코드 생성·수정·프로젝트 이해를 묶은 AI 중심 개발 환경(코드베이스 맥락)에 특화.",
  perplexity:
    "웹 검색+AI 요약·출처 제시로 정보 탐색·리서치에 특화.",
  notion_ai:
    "노션 문서 흐름 속 회의록·요약·정리 등 워크플로형 업무 AI에 특화.",
  gamma:
    "텍스트만으로 슬라이드·문서·웹페이지 초안과 레이아웃을 자동 구성하는 데 특화.",
  meta_advantage:
    "메타 광고·캠페인 타겟·소재 최적화(퍼포먼스 마케팅)에 특화.",
  h2o_automl:
    "표 형태 데이터 예측·AutoML(코딩 없이 모델 탐색)에 특화.",
  google_gemini:
    "멀티모달·긴 컨텍스트·구글 워크스페이스·검색 연계에 강점.",
  anthropic_claude:
    "긴 문서 분석·안전성·지시 준수(엔터프라이즈 문서 워크로드)에 자주 쓰임.",
  aws_bedrock:
    "여러 파운데이션 모델을 AWS 안에서 통합·거버넌스하며 쓰기에 특화.",
  mistral_ai:
    "유럽·효율적인 오픈/상용 모델·엔터프라이즈 배포에 강점.",
  aleph_alpha:
    "독일·EU 기업·공공 맥락의 LLM·온프레미스 옵션에 특화.",
  sap_generative_ai:
    "SAP ERP·비즈니스 프로세스 안의 생성형(업무 데이터 맥락)에 특화.",
  cohere_command:
    "임베딩·RAG·엔터프라이즈 검색·다국어 비즈니스 텍스트에 강점.",
  ai21_studio:
    "영어 중심 긴 텍스트·앱/API 임베딩에 특화(지역·언어는 제품별 확인).",
  naver_clova_x:
    "한국어 대화·검색·국내 서비스 연계에 강점.",
  wrtn_ai:
    "한국어 캐주얼 채팅·짧은 창작·아이디어 스케치에 가볍게 특화.",
  upstage_solar:
    "한국어 문서·표·코드 이해·API 연동(국내 기업 워크로드)에 강조.",
  scatterlab_hello:
    "캐릭터 대화·감성 챗(엔터테인)에 특화, 업무용과는 목적이 다름.",
  skt_a_dot:
    "통신·단말·생활 비서형 기능(캐리어 연계)에 특화.",
  line_clova_jp:
    "일본·라인 생태계 비즈니스 챗·현지어에 특화.",
  preferred_pfn:
    "공장·물류·이미지 등 산업 현장 딥러닝(일반 챗과 목적 다름).",
  stability_ai:
    "오픈 이미지 생성·모델 생태계(창작·디자인)에 특화.",
  synthesia:
    "아바타 영상·다국어 나레이션(기업 교육·마케 영상)에 특화.",
  canva_magic:
    "디자인 템플릿 안에서 카피·이미지 보조(창작 워크플로)에 특화.",
  sarvam_ai:
    "국가·기업 자체 AI 구축(소버린·풀스택)과 인도 로컬 언어·문화 맥락에 강조.",
  appier_aixon:
    "광고·CRM·퍼포먼스 자동화(마케팅 데이터)에 특화.",
  relex_solutions:
    "소매·공급망·수요 예측 기획에 특화.",
  vespa_ai:
    "대규모 검색+벡터·하이브리드 검색(서비스 백엔드)에 특화.",
  sophia_genetics:
    "의료 유전체·진단 보조(규제·도메인 특화)에 특화.",
  klarna_ai:
    "쇼핑·결제 맥락의 추천·고객 응대에 특화.",
  grab_ai:
    "슈퍼앱(이동·배달·금융) 맥락의 개인화·지원에 특화.",
  huggingface_hub:
    "모델·데이터셋 공유·호스팅(연구·MLOps 허브)에 특화.",
  databricks_mosaic:
    "데이터 레이크하우스 위 ML·생성형 통합에 특화.",
  ibm_watsonx:
    "엔터프라이즈 거버넌스·금융·레거시 연계에 강조되는 스택.",
  g42_jais:
    "아랍어 중심·방언·문화 표현과 아랍어·영어 이중언어 챗에 특화.",
  telefonica_aura:
    "통신사 고객 지원·유럽 규제 맥락에 특화.",
  leonardo_ai:
    "이미지·영상 생성·편집·업스케일을 묶은 올인원 크리에이티브 생성형 AI에 특화.",
  prosus_naspers:
    "지역별 이커머스·투자 포트폴리오 내 AI(참고용 사례).",
  oss_ollama:
    "로컬에서 LLM 실행·단일 바이너리 편의에 특화.",
  oss_llama_cpp:
    "CPU/GPU에서 가벼운 추론·엣지에 특화.",
  oss_vllm:
    "서버 대량 추론 처리량·배치 서빙에 특화.",
  oss_transformers:
    "연구·파인튜닝·파이프라인 실험(라이브러리)에 특화.",
  oss_langchain:
    "체인·에이전트·툴 연결(앱 조립)에 특화.",
  oss_llamaindex:
    "RAG·데이터 커넥터·인덱싱에 특화.",
  oss_comfyui:
    "노드 기반 이미지 생성 워크플로에 특화.",
  oss_sd_webui:
    "Stable Diffusion 로컬 UI·실험에 특화.",
  oss_open_webui:
    "로컬 챗 UI(OpenAI 호환)·자체 호스팅에 특화.",
  oss_whisper:
    "다국어 음성→텍스트(전사) 품질·오픈 모델에 특화.",
  oss_chroma:
    "임베딩 저장·벡터 검색(프로토타입 RAG)에 특화.",
  oss_textgen_webui:
    "여러 모델을 한 UI에서 실험·로컬 챗에 특화.",
  oss_localai:
    "온프레미스에서 OpenAI 호환 API로 붙이기에 특화.",
  xai_grok:
    "실시간 웹·X(트위터) 맥락·툴 사용·추론(최신 이슈)에 강조.",
  zeta_ai_kr:
    "국내에서 마케·채널 자동화 브랜드명이 겹칠 수 있어 공식 제품 확인 필요.",
  crack_ai:
    "동일 표기 서비스가 여럿일 수 있어 공식 앱명으로 확인 필요.",
  daglo:
    "한국어 음성 인식·회의·콜 전사 정확도에 특화(스크립트·문서화).",
  chatty_kr:
    "동일 명칭 앱이 여럿일 수 있어 스토어의 공식 개발사 확인 필요.",
  lg_exaone:
    "한·영 및 벤치에서 강한 오픈웨이트 계열(연구·API·K-EXAONE 등).",
  liner_ai:
    "출처·인용 기반 검색·딥리서치·학술(저학술 부정확도 낮춤)에 특화.",
  microsoft_copilot:
    "윈도우·엣지·M365·웹에서 문서·메일·회의 요약·검색 연계에 특화(생산성 도구와 일체형).",
  zapier:
    "수천 개 SaaS 연결·Zap 레시피·자연어로 자동화 설계(AI)에 강점.",
  n8n:
    "시각적 워크플로·자체 호스팅·400+ 통합·확장(코드 노드)에 특화.",
  internal_llm_placeholder:
    "외부 전송 없이 사내 규정·보안에 맞춘 전용 배포에 특화(성능은 구축에 따라 다름).",
};

const raw = JSON.parse(fs.readFileSync(catalogPath, "utf8"));
raw.tools = raw.tools
  .filter((t) => !REMOVE_IDS.has(t.toolId))
  .map((t) => {
    const focus = FOCUS[t.toolId];
    if (!focus) {
      console.warn("Missing FOCUS for", t.toolId);
    }
    return {
      ...t,
      ...(focus ? { focusStrengths: focus } : {}),
    };
  });

raw.version = "2026-Q2-no-cn-focus";

fs.writeFileSync(catalogPath, JSON.stringify(raw, null, 2) + "\n", "utf8");
console.log("Wrote", catalogPath, "tools:", raw.tools.length);
