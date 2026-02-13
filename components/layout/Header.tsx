"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";

interface HeaderProps {
  title?: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

export default function Header({ title, subtitle, actions }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    if (menuOpen) {
      document.addEventListener("click", handleClickOutside);
    }
    return () => document.removeEventListener("click", handleClickOutside);
  }, [menuOpen]);

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white">
      <div className="flex h-16 items-center justify-between px-6">
        {/* Page Title */}
        <div>
          <h1 className="text-xl font-semibold text-gray-900">
            {title || "대시보드"}
          </h1>
          {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
        </div>

        {/* Right Side: Profile + Menu */}
        <div className="flex items-center gap-4">
          {actions && <div className="flex items-center gap-2">{actions}</div>}

          {/* Profile with dropdown */}
          <div className="relative" ref={menuRef}>
            <button
              type="button"
              onClick={() => setMenuOpen((o) => !o)}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200 text-gray-600 transition-colors hover:bg-gray-300"
              aria-haspopup="menu"
              aria-expanded={menuOpen}
              aria-label="메뉴 열기"
            >
              <span className="text-sm font-medium">U</span>
            </button>
            {menuOpen && (
              <div
                className="absolute right-0 top-full z-20 mt-1 min-w-[160px] rounded-lg border border-gray-200 bg-white py-1 shadow-lg"
                role="menu"
              >
                <Link
                  href="/docs/index.html"
                  role="menuitem"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => setMenuOpen(false)}
                >
                  Docs
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
