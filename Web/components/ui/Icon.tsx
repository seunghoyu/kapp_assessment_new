// 아이콘 래퍼 컴포넌트 - Lucide React 통일 사용
import {
  LayoutDashboard,
  Users,
  BarChart3,
  GraduationCap,
  Lightbulb,
  Wrench,
  Settings,
  HelpCircle,
  Search,
  Bell,
  ChevronRight,
  ChevronDown,
  ChevronLeft,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  CheckCircle,
  XCircle,
  Edit,
  Trash2,
  Plus,
  Download,
  Filter,
  MoreVertical,
  ListTodo,
  UserPlus,
  Eye,
  Table2,
} from "lucide-react";

export const Icons = {
  dashboard: LayoutDashboard,
  users: Users,
  analytics: BarChart3,
  programs: GraduationCap,
  insights: Lightbulb,
  tools: Wrench,
  settings: Settings,
  help: HelpCircle,
  search: Search,
  bell: Bell,
  chevronLeft: ChevronLeft,
  chevronRight: ChevronRight,
  chevronDown: ChevronDown,
  trendingUp: TrendingUp,
  trendingDown: TrendingDown,
  alert: AlertCircle,
  check: CheckCircle,
  x: XCircle,
  edit: Edit,
  delete: Trash2,
  plus: Plus,
  download: Download,
  filter: Filter,
  more: MoreVertical,
  tasks: ListTodo,
  userPlus: UserPlus,
  eye: Eye,
  table: Table2,
};

interface IconProps {
  name: keyof typeof Icons;
  className?: string;
  size?: number;
}

export default function Icon({ name, className = "", size = 20 }: IconProps) {
  const IconComponent = Icons[name];
  if (!IconComponent) return null;
  return <IconComponent className={className} size={size} />;
}
