"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false); // Add loading state
  const router = useRouter(); // Initialize useRouter

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true); // Set loading to true
    console.log("Login attempt:", { email, password });

    // Simulate an async login process
    setTimeout(() => {
      setIsLoading(false); // Set loading to false
      router.push("/dashboard"); // Redirect to dashboard page
    }, 1500); // 1.5 seconds delay
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="max-w-md w-full flex flex-col items-center gap-6">
        {/* Logo Area */}
        <div className="flex flex-col items-center gap-3">
          <Image
            src="/images/logo.png"
            alt="Logo"
            width={192} // Equivalent to w-48
            height={48} // Adjust height as needed, maintaining aspect ratio or setting a fixed height
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

        {/* Login Card */}
        <div className="w-full max-w-sm bg-white border border-gray-200 rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 text-center mb-6">
            로그인
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Input */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
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

            {/* Password Input */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
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

            {/* Login Button */}
            <button
              type="submit"
              className="mt-6 w-full rounded-md bg-white border border-gray-200 py-2.5 text-sm font-medium text-gray-900 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading} // Disable button when loading
            >
              {isLoading ? (
                "로그인 중..."
              ) : (
                <>
                  로그인
                  {/* Right Arrow Icon (inline SVG) */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="w-4 h-4"
                  >
                    <path
                      fillRule="evenodd"
                      d="M3 10a.75.75 0 01.75-.75h10.612L10.293 5.354a.75.75 0 111.06-1.06l5.25 5.25a.75.75 0 010 1.06l-5.25 5.25a.75.75 0 11-1.06-1.06l4.06-4.06H3.75A.75.75 0 013 10z"
                      clipRule="evenodd"
                    />
                  </svg>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}