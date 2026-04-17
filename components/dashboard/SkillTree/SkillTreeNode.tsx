"use client";

import { Icon } from "@iconify/react";

type Props = {
  title: string;
  active: boolean;
  iconId: string;
  abilityUnits: { label: string; iconId: string }[];
};

export default function SkillTreeNode({ title, active, iconId, abilityUnits }: Props) {
  return (
    <div className="flex items-stretch gap-3 w-full">
      <div
        className={[
          "relative w-16 h-16 rounded-xl border shadow-sm flex items-center justify-center transition-colors flex-shrink-0",
          active
            ? "bg-white border-blue-200 ring-1 ring-blue-100 text-blue-700"
            : "bg-gray-100 border-gray-200 text-gray-400 opacity-75",
        ].join(" ")}
        aria-label={title}
        title={title}
      >
        <Icon icon={iconId} width={30} height={30} />
        {!active && (
          <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-gray-200 border border-gray-300 flex items-center justify-center text-[10px] text-gray-600">
            <Icon icon="mdi:lock" width={14} height={14} />
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0 flex flex-col justify-center">
        <div className="text-sm font-medium text-gray-900 leading-snug line-clamp-1">{title}</div>

        <div className="mt-2 flex items-center gap-2 flex-wrap">
          {abilityUnits.map((u, i) => (
            <span
              key={`${u.label}-${i}`}
              className={[
                "inline-flex w-8 h-8 rounded-full border items-center justify-center",
                active ? "bg-white border-gray-200 text-gray-700" : "bg-gray-100 border-gray-200 text-gray-400",
              ].join(" ")}
              title={u.label}
              aria-label={u.label}
            >
              <Icon icon={u.iconId} width={18} height={18} />
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

