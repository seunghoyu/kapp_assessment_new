"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Icon from "@/components/ui/Icon";

interface SidebarItem {
  icon: keyof typeof import("@/components/ui/Icon").Icons;
  label: string;
  href: string;
}

interface SidebarGroup {
  label?: string;
  items: SidebarItem[];
}

interface DashboardSubItem {
  label: string;
  href: string;
}

const dashboardSubItems: DashboardSubItem[] = [
  { label: "개요", href: "/dashboard" },
  { label: "역량 분석", href: "/dashboard/competency" },
];

// 대시보드 외 단일 메뉴
const mainSections: SidebarGroup = {
  items: [
    { icon: "users", label: "직원 관리", href: "/dashboard/employees" },
    { icon: "analytics", label: "분석/리포트", href: "/dashboard/analytics" },
    { icon: "programs", label: "교육 프로그램", href: "/dashboard/programs" },
    { icon: "insights", label: "AI 인사이트", href: "/dashboard/insights" },
  ],
};

const bottomSections: SidebarGroup = {
  items: [
    { icon: "settings", label: "설정", href: "/dashboard/settings" },
  ],
};

export default function Sidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const isDashboardActive =
    pathname === "/dashboard" || pathname.startsWith("/dashboard/competency");
  const isCompetencyActive = pathname === "/dashboard/competency";
  const [dashboardOpen, setDashboardOpen] = useState(isDashboardActive);
  
  useEffect(() => {
    if (isCompetencyActive) setDashboardOpen(true);
  }, [isCompetencyActive]);

  const renderSidebarItem = (item: SidebarItem) => {
    const isActive =
      pathname === item.href || pathname.startsWith(item.href + "/");
    return (
      <Link
        key={item.href}
        href={item.href}
        className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
          isActive
            ? "bg-blue-50 text-blue-700"
            : "text-gray-700 hover:bg-gray-50"
        } ${isCollapsed ? "justify-center" : ""}`}
      >
        <Icon
          name={item.icon}
          className={isActive ? "text-blue-600" : "text-gray-500"}
          size={20}
        />
        {!isCollapsed && <span>{item.label}</span>}
      </Link>
    );
  };

  return (
    <aside className={`flex flex-shrink-0 flex-col border-r border-gray-200 bg-white transition-all duration-300 ${isCollapsed ? 'w-16' : 'w-56'}`}>
      <div className="border-b border-gray-200 px-4 py-4 flex items-center justify-between">
        {!isCollapsed && (
          <Link href="/dashboard" className="flex items-center gap-2">
            <span className="text-xl font-bold text-gray-900">Kapp</span>
            <span className="text-sm text-gray-500">Assessment</span>
          </Link>
        )}
        <button onClick={() => setIsCollapsed(!isCollapsed)} className="p-1 rounded-md hover:bg-gray-100 text-gray-500">
          <Icon name={isCollapsed ? "chevronRight" : "chevronLeft"} size={20} />
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <div className="space-y-1">
          {/* 대시보드 드롭다운 */}
          <div>
            <button
              type="button"
              onClick={() => !isCollapsed && setDashboardOpen((o) => !o)}
              className={`flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                isDashboardActive && !dashboardOpen
                  ? "bg-blue-50 text-blue-700"
                  : isDashboardActive
                    ? "bg-blue-50/50 text-blue-700"
                    : "text-gray-700 hover:bg-gray-50"
              } ${isCollapsed ? "justify-center" : "justify-between"}`}
            >
              <div className="flex items-center gap-3">
                <Icon
                  name="dashboard"
                  className={isDashboardActive ? "text-blue-600" : "text-gray-500"}
                  size={20}
                />
                {!isCollapsed && <span>대시보드</span>}
              </div>
              {!isCollapsed && (
                <Icon
                  name="chevronDown"
                  className={`text-gray-500 transition-transform ${dashboardOpen ? "rotate-180" : ""}`}
                  size={16}
                />
              )}
            </button>
            {!isCollapsed && dashboardOpen && (
              <div className="ml-6 mt-1 space-y-0.5 border-l border-gray-200 pl-3">
                {dashboardSubItems.map((sub) => {
                  const isSubActive = pathname === sub.href;
                  return (
                    <Link
                      key={sub.href}
                      href={sub.href}
                      className={`block rounded-md px-2 py-1.5 text-sm transition-colors ${
                        isSubActive
                          ? "bg-blue-50 font-medium text-blue-700"
                          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                      }`}
                    >
                      {sub.label}
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          {mainSections.items.map(renderSidebarItem)}
        </div>
      </nav>
    </aside>
  );
}
