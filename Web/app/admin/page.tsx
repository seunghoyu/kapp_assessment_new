"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/lib/routes";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      router.push(ROUTES.DASHBOARD);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="max-w-xl w-full flex flex-col items-center gap-6">
        <div className="flex flex-col items-center gap-3">
          <Image
            src="/images/logo.png"
            alt="Logo"
            width={192}
            height={48}
            className="w-48 h-auto"
            priority
          />
          <p className="text-sm text-gray-500 text-center">
            계정 정보를 입력해 주세요
          </p>
          <p className="text-xs text-gray-400 text-center">
            NEXT GEN Solution 관리자 LMS입니다.
          </p>
        </div>

        <div className="w-full max-w-xl bg-white border border-gray-200 rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 text-center mb-6">
            로그인
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                이메일
              </label>
              <input
                type="email"
                id="email"
                className="w-full rounded-md border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="example@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                비밀번호
              </label>
              <input
                type="password"
                id="password"
                className="w-full rounded-md border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="mt-6 w-full rounded-md bg-white border border-gray-200 py-2.5 text-sm font-medium text-gray-900 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              {isLoading ? "로그인 중..." : "로그인"}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <Link
              href={ROUTES.HOME}
              className="block w-full text-center text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
              ← 홈으로 돌아가기
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
