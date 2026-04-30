"use client";

import type { ComponentType } from "react";
import type { InbasketQuestion } from "../InbasketList";
import EmailSimulation from "./EmailSimulation";
import MessengerSimulation from "./MessengerSimulation";
import ReportSimulation from "./ReportSimulation";
import CalendarSimulation from "./CalendarSimulation";
import IntegratedWorkSimulation from "./IntegratedWorkSimulation";
import EmergencySimulation from "./EmergencySimulation";
import GlobalSimulation from "./GlobalSimulation";
import LegalSimulation from "./LegalSimulation";
import DigitalToolSimulation from "./DigitalToolSimulation";
import HRSimulation from "./HRSimulation";
import FinanceSimulation from "./FinanceSimulation";
import CustomerSimulation from "./CustomerSimulation";
import EthicsSimulation from "./EthicsSimulation";
import StrategySimulation from "./StrategySimulation";
import MarketingCampaignSimulation from "./MarketingCampaignSimulation";
import ProductionSimulation from "./ProductionSimulation";
import PlaceholderSimulation from "./PlaceholderSimulation";

const CATEGORY_COMPONENTS: Record<string, ComponentType<{ question: InbasketQuestion }>> = {
  "이메일 관리": EmailSimulation,
  "메신저 대응": MessengerSimulation,
  "보고서 작성": ReportSimulation,
  "일정 관리": CalendarSimulation,
  "통합 업무": IntegratedWorkSimulation,
  "위기 관리": EmergencySimulation,
  "글로벌 협업": GlobalSimulation,
  "법무 검토": LegalSimulation,
  "디지털 활용": DigitalToolSimulation,
  "인사 관리": HRSimulation,
  "재무 관리": FinanceSimulation,
  "고객 관리": CustomerSimulation,
  "윤리 경영": EthicsSimulation,
  "전략 기획": StrategySimulation,
  "마케팅캠페인": MarketingCampaignSimulation,
  "생산관리": ProductionSimulation,
};

export function SimulationContent({ question }: { question: InbasketQuestion }) {
  const Component = CATEGORY_COMPONENTS[question.category] ?? PlaceholderSimulation;
  return <Component question={question} />;
}
