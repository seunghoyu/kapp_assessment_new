"use client";

import { usePathname } from "next/navigation";

export default function AppPageTransition({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const pathname = usePathname();

  return (
    <div key={pathname} className={className ? `${className} page-enter` : "page-enter"}>
      {children}
    </div>
  );
}
