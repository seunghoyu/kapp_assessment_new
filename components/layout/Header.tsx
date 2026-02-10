"use client";

import Icon from "@/components/ui/Icon";

interface HeaderProps {
  title?: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

export default function Header({ title, subtitle, actions }: HeaderProps) {
  return (
    <header className="sticky top-0 z-10 border-b border-gray-200 bg-white">
      <div className="flex h-16 items-center justify-between px-6">
        {/* Page Title */}
        <div>
          <h1 className="text-xl font-semibold text-gray-900">
            {title || "대시보드"}
          </h1>
          {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
        </div>

        {/* Right Side: Profile */}
        <div className="flex items-center gap-4">
          {/* Actions */}
          {actions && <div className="flex items-center gap-2">{actions}</div>}

          {/* Profile */}
          <button className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200 text-gray-600 transition-colors hover:bg-gray-300">
            <span className="text-sm font-medium">U</span>
          </button>
        </div>
      </div>
    </header>
  );
}
