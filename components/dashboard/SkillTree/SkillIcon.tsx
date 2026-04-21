"use client";

import { Icon } from "@iconify/react";
import type { SkillState, SkillVisual } from "@/lib/skillTree/skillVisual.types";
import {
  bgStyleLayerClasses,
  frameClasses,
  getSkillGlowStyle,
  themeAccentBlob,
  themeIconTint,
  themeSurface,
} from "@/lib/skillTree/skillVisual.themes";

type Size = "sm" | "md" | "lg";

type Props = {
  visual: SkillVisual;
  state: SkillState;
  size?: Size;
  className?: string;
  "aria-hidden"?: boolean;
};

const sizeMap: Record<
  Size,
  { box: string; icon: number; blob: string; rounded: string }
> = {
  sm: { box: "h-8 w-8", icon: 18, blob: "h-12 w-12", rounded: "rounded-lg" },
  md: { box: "h-16 w-16", icon: 30, blob: "h-20 w-20", rounded: "rounded-xl" },
  lg: { box: "h-20 w-20", icon: 36, blob: "h-24 w-24", rounded: "rounded-xl" },
};

export default function SkillIcon({ visual, state, size = "md", className = "", "aria-hidden": ariaHidden }: Props) {
  const s = sizeMap[size];
  const glowStyle = getSkillGlowStyle(visual.theme, visual.glow, state);
  const corner = size === "sm" ? "rounded-lg" : "rounded-xl";
  const frame = frameClasses(visual.theme, visual.frame, state, corner);
  const surface = themeSurface[visual.theme];
  const blob = themeAccentBlob[visual.theme];
  const tint = themeIconTint[visual.theme];
  const bgExtra = bgStyleLayerClasses(visual.bgStyle);

  const scaleClass =
    state === "active" ? "scale-[1.06] z-[1]" : state === "locked" ? "scale-100" : "scale-100";

  const stateOverlay =
    state === "locked"
      ? "bg-black/35 backdrop-blur-[1px]"
      : state === "mastered"
        ? "bg-white/10"
        : state === "active"
          ? "bg-white/10"
          : "bg-transparent";

  const iconDrop =
    visual.filled && state !== "locked"
      ? "drop-shadow-[0_0_8px_rgba(255,255,255,0.35)]"
      : "";

  return (
    <div
      className={[
        "relative flex flex-shrink-0 items-center justify-center overflow-hidden transition-all duration-200",
        s.box,
        frame,
        surface,
        scaleClass,
        state === "active" ? "brightness-110" : "",
        state === "locked" ? "grayscale-[0.35] brightness-[0.72]" : "",
        className,
      ].join(" ")}
      style={state === "locked" ? undefined : glowStyle}
      aria-hidden={ariaHidden ?? true}
    >
      {visual.bgStyle === "orb" && (
        <span className={[blob, "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2", s.blob, "rounded-full"].join(" ")} />
      )}
      <span className={[bgExtra, "absolute inset-0", s.rounded].filter(Boolean).join(" ")} />
      <span className={["absolute inset-0 shadow-[inset_0_2px_10px_rgba(0,0,0,0.16)]", s.rounded].join(" ")} />
      <span className={["pointer-events-none absolute inset-0", stateOverlay, s.rounded].join(" ")} />

      <Icon
        icon={visual.icon}
        width={s.icon}
        height={s.icon}
        className={[tint, "relative z-[2]", iconDrop, state === "locked" ? "opacity-55" : "opacity-95"].join(" ")}
      />

      {state === "mastered" && (
        <span
          className={[
            "pointer-events-none absolute inset-0 z-[3] rounded-[inherit] ring-1 ring-inset",
            visual.theme === "gold"
              ? "ring-amber-200/25"
              : visual.theme === "purple"
                ? "ring-violet-200/25"
                : "ring-sky-200/25",
          ].join(" ")}
        />
      )}
    </div>
  );
}
