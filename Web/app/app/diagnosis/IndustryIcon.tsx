"use client";

import {
  TreePine,
  Mountain,
  Factory,
  Zap,
  Recycle,
  HardHat,
  ShoppingCart,
  Truck,
  UtensilsCrossed,
  Smartphone,
  Landmark,
  Building2,
  Microscope,
  Briefcase,
  Shield,
  GraduationCap,
  Heart,
  Palette,
  Users,
  Home,
  Globe,
  type LucideIcon,
} from "lucide-react";

/** 대분류 코드(A~U) → Lucide 아이콘 매핑 */
const MAJOR_CODE_ICON: Record<string, LucideIcon> = {
  A: TreePine,       // 농업, 임업 및 어업
  B: Mountain,       // 광업
  C: Factory,        // 제조업
  D: Zap,            // 전기, 가스, 증기 및 공기조절 공급업
  E: Recycle,        // 수도, 하수 및 폐기물 처리, 원료 재생업
  F: HardHat,        // 건설업
  G: ShoppingCart,   // 도매 및 소매업
  H: Truck,          // 운수 및 창고업
  I: UtensilsCrossed, // 숙박 및 음식점업
  J: Smartphone,     // 정보통신업
  K: Landmark,       // 금융 및 보험업
  L: Building2,      // 부동산 임대 및 공급업
  M: Microscope,     // 전문, 과학 및 기술 서비스업
  N: Briefcase,      // 사업시설 관리, 사업 지원 및 임대 서비스업
  O: Shield,         // 공공 행정, 국방 및 사회보장 행정
  P: GraduationCap,  // 교육 서비스업
  Q: Heart,          // 보건업 및 사회복지 서비스업
  R: Palette,        // 예술, 스포츠 및 여가 관련 서비스업
  S: Users,          // 협회 및 단체, 수리 및 기타 개인 서비스업
  T: Home,           // 가구 내 고용 활동...
  U: Globe,          // 국제 및 외국기관
};

type Props = {
  code: string;
  className?: string;
};

export default function IndustryIcon({ code, className }: Props) {
  const Icon = MAJOR_CODE_ICON[code] ?? Briefcase;
  return <Icon className={className} aria-hidden />;
}
