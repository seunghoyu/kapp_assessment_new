"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/lib/routes";

const STORAGE_KEY = "kapp_consumer_accounts";

function getStoredAccounts(): Record<string, string> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function setStoredAccounts(accounts: Record<string, string>) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(accounts));
}

export default function ConsumerLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isReturning, setIsReturning] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const accounts = getStoredAccounts();
    setIsReturning(accounts[email] != null);
  }, [email]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    const accounts = getStoredAccounts();

    setTimeout(() => {
      if (accounts[email] != null) {
        if (accounts[email] !== password) {
          setError("비밀번호가 일치하지 않습니다.");
          setIsLoading(false);
          return;
        }
      } else {
        if (password.length < 6) {
          setError("비밀번호는 6자 이상 입력해주세요.");
          setIsLoading(false);
          return;
        }
        setStoredAccounts({ ...accounts, [email]: password });
      }
      localStorage.setItem("kapp_consumer_email", email);
      setIsLoading(false);
      router.push(ROUTES.APP);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="max-w-md w-full flex flex-col items-center gap-6">
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
            KAPP 진단을 시작하려면 계정 정보를 입력해주세요
          </p>
          <p className="text-xs text-gray-400 text-center">
            {isReturning
              ? "이미 가입된 계정입니다. 비밀번호로 로그인하세요."
              : "최초 진입 시 비밀번호를 설정해주세요. (이메일 = 아이디)"}
          </p>
        </div>

        <div className="w-full max-w-sm bg-white border border-gray-200 rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 text-center mb-6">
            {isReturning ? "로그인" : "시작하기"}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                이메일 (아이디)
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
                {isReturning ? "비밀번호" : "비밀번호 설정 (6자 이상)"}
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

            {error && (
              <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-md">{error}</p>
            )}

            <button
              type="submit"
              className="mt-6 w-full rounded-md bg-gray-900 text-white py-2.5 text-sm font-medium hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              {isLoading ? "처리 중..." : isReturning ? "로그인" : "시작하기"}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <Link
              href={ROUTES.ADMIN}
              className="block w-full text-center text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
              관리자 페이지로 이동 →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
