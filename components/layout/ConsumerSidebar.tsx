"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import {
  ClipboardList,
  LayoutDashboard,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { ROUTES } from "@/lib/routes";

const consumerMenuItems = [
  { icon: ClipboardList, label: "KAPP 진단", href: ROUTES.APP_DIAGNOSIS },
  { icon: LayoutDashboard, label: "마이 대시보드", href: ROUTES.APP_MY_DASHBOARD },
];

export default function ConsumerSidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(true);

  // /app Hero 페이지 최초 진입 시 사이드바 collapsed 유지
  useEffect(() => {
    if (pathname === ROUTES.APP) {
      setIsCollapsed(true);
    }
  }, [pathname]);

  return (
    <aside
      className={`flex flex-shrink-0 flex-col border-r border-gray-200 bg-white transition-all duration-300 sticky top-0 self-start h-screen ${
        isCollapsed ? "w-16" : "w-56"
      }`}
    >
      <div className="border-b border-gray-200 h-16 px-4 flex items-center justify-between">
        {!isCollapsed && (
          <Link
            href={ROUTES.APP}
            className="relative w-full h-full flex items-center justify-center"
          >
            <Image
              src="/images/logo.png"
              alt="Kapp Assessment Logo"
              fill
              className="object-contain"
              priority
            />
          </Link>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1 rounded-md hover:bg-gray-100 text-gray-500"
        >
          {isCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <div className="space-y-1">
          {consumerMenuItems.map((item) => {
            const isActive =
              pathname === item.href || pathname.startsWith(item.href + "/");
            const Icon = item.icon;
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
                  className={isActive ? "text-blue-600 shrink-0" : "text-gray-500 shrink-0"}
                  size={20}
                />
                {!isCollapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
        </div>
      </nav>
    </aside>
  );
}
