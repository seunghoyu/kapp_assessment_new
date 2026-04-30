"use client";

import { Icon } from "@iconify/react";

export type CardItemProps = {
  title: string;
  roles: string[];
  /** Iconify 아이콘 ID (예: mdi:handshake-outline) */
  iconifyIcon: string;
  bottomColorClass: string;
  onClick: () => void;
};

export default function CardItem({
  title,
  roles,
  iconifyIcon,
  bottomColorClass,
  onClick,
}: CardItemProps) {
  const left = roles.slice(0, 5);
  const right = roles.slice(5);

  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "group relative flex h-full min-h-0 w-full min-w-0 flex-col overflow-hidden rounded-xl border bg-white text-left shadow-sm transition",
        "border-gray-200 hover:border-gray-300 hover:shadow-md",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2",
      ].join(" ")}
    >
      <div className="min-h-0 flex-[3] px-3 py-2.5">
        <h3 className="text-lg font-bold leading-snug text-gray-900 line-clamp-2">{title}</h3>
        <div className="mt-2 grid grid-cols-2 gap-x-3 min-h-0">
          <p className="whitespace-pre-line text-sm leading-relaxed text-gray-600 line-clamp-5">
            {left.join("\n")}
          </p>
          <p className="whitespace-pre-line text-sm leading-relaxed text-gray-600 line-clamp-5">
            {right.join("\n")}
          </p>
        </div>
      </div>
      <div
        className={[
          "flex flex-[2] shrink-0 items-center justify-center text-white",
          "[&_svg]:drop-shadow-sm transition-transform duration-200",
          "group-hover:[&_svg]:scale-110",
          bottomColorClass,
        ].join(" ")}
      >
        <Icon icon={iconifyIcon} width={34} height={34} aria-hidden />
      </div>
    </button>
  );
}
