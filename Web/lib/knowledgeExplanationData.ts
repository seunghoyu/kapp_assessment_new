import explanationsJson from "@/data/kappDiagnosis/knowledgeExplanations.json";

export type KnowledgeExplanation = {
  /** 지식 문항 id (예: mc_1). 현재는 더미 fallback을 위해 "example"도 사용 */
  id: string;
  /** ①핵심해설 */
  core: string;
  /** ②오답분석 */
  wrongAnswerAnalysis: string;
  /** ③용어설명 */
  glossary: string;
  /** ④상세해설 */
  detailed: string;
  /** ⑤심화포인트 */
  advanced: string;
  /** ⑥실무적용 */
  practical: string;
  /** ⑦학습추천 */
  recommendations: string;
};

type KnowledgeExplanationsJson = {
  description?: string;
  items: KnowledgeExplanation[];
};

function getAll(): KnowledgeExplanation[] {
  const data = explanationsJson as unknown as KnowledgeExplanationsJson;
  if (!data || !Array.isArray(data.items)) return [];
  return data.items;
}

export function getKnowledgeExplanation(questionId: string): KnowledgeExplanation | null {
  const items = getAll();
  if (items.length === 0) return null;

  const byId = items.find((x) => x.id === questionId);
  if (byId) return byId;

  // 현재 요구사항: 더미데이터가 모든 문항에서 고정으로 나오도록 fallback 제공
  const fallback = items.find((x) => x.id === "example") ?? items[0] ?? null;
  return fallback;
}

