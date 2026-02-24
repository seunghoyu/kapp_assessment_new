/**
 * 디지털 인바스켓 문항 데이터 로딩 로직
 * - 소스: data/kappDiagnosis/inbasket/inbasketQuestions.json (더미데이터)
 * - 빌드 시 정적 import로 번들에 포함되며, 런타임 API 호출 없이 사용
 */

import inbasketQuestionsJson from "@/data/kappDiagnosis/inbasket/inbasketQuestions.json";

/** 디지털 인바스켓 문항 1건 스키마 (JSON과 동일) */
export type InbasketQuestion = {
  id: string;
  title: string;
  category: string;
  jobCategory: string;
  sender: string;
  date: string;
  priority: string;
  content: string;
  attachments?: string[];
};

/** JSON 파일 루트 구조 */
type InbasketQuestionsJson = {
  description?: string;
  questions: InbasketQuestion[];
};

/**
 * 디지털 인바스켓 더미데이터(문항 목록)를 반환합니다.
 * 진단 페이지·인바스켓 목록·시뮬레이션에서 이 배열을 사용합니다.
 */
export function getInbasketQuestions(): InbasketQuestion[] {
  const data = inbasketQuestionsJson as InbasketQuestionsJson;
  if (!data?.questions || !Array.isArray(data.questions)) return [];
  return data.questions;
}
