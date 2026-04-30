import Link from "next/link";
import { ROUTES } from "@/lib/routes";

export default function Navbar() {
  return (
    <nav className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center">
          <Link href={ROUTES.HOME} className="text-xl font-semibold text-gray-900">
            Kapp Assessment
          </Link>
        </div>
        <div className="flex items-center gap-6">
          <Link
            href={ROUTES.HOME}
            className="text-sm font-medium text-gray-700 hover:text-gray-900"
          >
            홈
          </Link>
          <Link
            href={ROUTES.ADMIN}
            className="text-sm font-medium text-gray-700 hover:text-gray-900"
          >
            관리자
          </Link>
        </div>
      </div>
    </nav>
  );
}
