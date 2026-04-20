"use client";

import { Icon } from "@iconify/react";
import type { SkillState, SkillVisual } from "@/lib/skillTree/skillVisual.types";
import SkillIcon from "./SkillIcon";

type Props = {
  title: string;
  skillState: SkillState;
  visual: SkillVisual;
  abilityUnits: { label: string; visual: SkillVisual }[];
};

export default function SkillTreeNode({ title, skillState, visual, abilityUnits }: Props) {
  const locked = skillState === "locked";

  return (
    <div className="flex items-stretch gap-3 w-full">
      <div className="relative flex-shrink-0" aria-label={title} title={title}>
        <SkillIcon visual={visual} state={skillState} size="md" />
        {locked && (
          <div className="absolute -top-1.5 -right-1.5 z-[4] flex h-6 w-6 items-center justify-center rounded-full border border-slate-600 bg-slate-800 text-[10px] text-slate-200 shadow-md">
            <Icon icon="mdi:lock" width={14} height={14} />
          </div>
        )}
      </div>

      <div className="flex min-w-0 flex-1 flex-col justify-center">
        <div className="line-clamp-1 text-sm font-medium leading-snug text-gray-900">{title}</div>

        <div className="mt-2 flex flex-wrap items-center gap-2">
          {abilityUnits.map((u, i) => (
            <span key={`${u.label}-${i}`} title={u.label} aria-label={u.label}>
              <SkillIcon visual={u.visual} state={skillState} size="sm" />
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
