import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand */}
        <div className="flex items-center">
          <Link href="/" className="text-xl font-semibold text-gray-900">
            Kapp Assessment
          </Link>
        </div>

        {/* Nav Links */}
        <div className="flex items-center gap-6">
          <Link
            href="/"
            className="text-sm font-medium text-gray-700 hover:text-gray-900"
          >
            Home
          </Link>
          <Link
            href="/admin"
            className="text-sm font-medium text-gray-700 hover:text-gray-900"
          >
            Admin Dashboard
          </Link>
        </div>
      </div>
    </nav>
  );
}
