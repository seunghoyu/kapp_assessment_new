"use client";

import { useRouter } from "next/navigation";
import { ROUTES } from "@/lib/routes";

export default function HeroCtaLink() {
  const router = useRouter();

  const handleClick = () => {
    router.push(ROUTES.APP_DIAGNOSIS);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className="group inline-flex items-center gap-3 text-gray-900 text-2xl font-bold tracking-tight hover:opacity-80 transition-all duration-300 hover:translate-x-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-50 rounded md:text-3xl"
    >
      <span>KAPP 진단 시작하기</span>
      <span className="inline-block transition-transform duration-300 group-hover:translate-x-1" aria-hidden>
        →
      </span>
    </button>
  );
}
