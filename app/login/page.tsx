"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/lib/routes";

const STORAGE_KEY = "kapp_consumer_accounts";
const CONSENTS_KEY = "kapp_consumer_consents";

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

export type ConsentRecord = {
  agree_required_privacy: boolean;
  agree_marketing_email: boolean;
  agree_marketing_phone: boolean;
  agreed_at: string;
};

function getStoredConsents(): Record<string, ConsentRecord> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(CONSENTS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function setStoredConsents(consents: Record<string, ConsentRecord>) {
  if (typeof window === "undefined") return;
  localStorage.setItem(CONSENTS_KEY, JSON.stringify(consents));
}

// 공통 하단 문구 (각 약관 모달 하단에 표시)
const COMMON_FOOTER = (
  <div className="mt-6 pt-4 border-t border-gray-200 space-y-3 text-xs text-gray-600">
    <p className="font-semibold text-gray-700">① 개인정보 처리 위탁</p>
    <p>회사는 원칙적으로 이용자의 개인정보를 외부에 위탁하지 않습니다.</p>
    <p className="font-semibold text-gray-700">② 제3자 제공</p>
    <p>회사는 원칙적으로 이용자의 개인정보를 제3자에게 제공하지 않습니다. 제공이 필요한 경우, 별도의 동의를 받습니다.</p>
    <p className="font-semibold text-gray-700">③ 이용자의 권리</p>
    <p>이용자는 언제든지 본인의 개인정보에 대해 열람, 수정, 삭제, 처리정지를 요청할 수 있습니다. 마케팅 수신 동의는 마이페이지 또는 고객센터를 통해 언제든지 철회할 수 있습니다.</p>
    <p className="font-semibold text-gray-700">④ 개인정보 보호책임자</p>
    <p>개인정보 보호책임자 정보(직책/부서/이메일 등)는 서비스 내 공지사항 또는 고객센터에서 확인할 수 있습니다.</p>
  </div>
);

// (필수) 개인정보 수집·이용 동의 전문
const REQUIRED_PRIVACY_CONTENT = (
  <div className="space-y-3 text-sm text-gray-700">
    <p><strong>제공받는 자:</strong> (주)챔프스터디</p>
    <p className="font-semibold text-gray-800">[수집 항목]</p>
    <p>이메일 주소, 전화번호</p>
    <p className="font-semibold text-gray-800">[수집 및 이용 목적]</p>
    <ul className="list-disc list-inside space-y-1">
      <li>회원 가입 및 본인 확인</li>
      <li>서비스 제공 및 이용 안내</li>
      <li>고객 문의 응대 및 공지사항 전달</li>
      <li>서비스 운영 및 관리</li>
    </ul>
    <p className="font-semibold text-gray-800">[보유 및 이용 기간]</p>
    <p>회원 탈퇴 시까지. 단, 관계 법령에 따라 보관이 필요한 경우 해당 법령에서 정한 기간 동안 보관합니다.</p>
    <p className="font-semibold text-gray-800">[동의 거부 권리 및 불이익]</p>
    <p>이용자는 개인정보 수집·이용에 대한 동의를 거부할 권리가 있습니다. 다만, 필수 항목에 대한 동의를 거부할 경우 회원가입 및 서비스 이용이 제한됩니다.</p>
    {COMMON_FOOTER}
  </div>
);

// (선택) 이메일 마케팅 활용 동의 전문
const EMAIL_MARKETING_CONTENT = (
  <div className="space-y-3 text-sm text-gray-700">
    <p><strong>제공받는 자:</strong> (주)챔프스터디</p>
    <p className="font-semibold text-gray-800">[수집 항목]</p>
    <p>이메일 주소</p>
    <p className="font-semibold text-gray-800">[이용 목적]</p>
    <ul className="list-disc list-inside space-y-1">
      <li>뉴스레터 발송</li>
      <li>이벤트, 프로모션, 신규 서비스 안내</li>
      <li>마케팅 및 광고성 정보 제공</li>
    </ul>
    <p className="font-semibold text-gray-800">[보유 및 이용 기간]</p>
    <p>회원 탈퇴 또는 마케팅 수신 동의 철회 시까지</p>
    <p className="font-semibold text-gray-800">[동의 거부 권리 및 불이익]</p>
    <p>이용자는 본 동의를 거부할 수 있으며, 동의하지 않더라도 회원가입 및 서비스 이용에는 제한이 없습니다.</p>
    {COMMON_FOOTER}
  </div>
);

// (선택) 전화번호 마케팅 및 홍보 활용 동의 전문
const PHONE_MARKETING_CONTENT = (
  <div className="space-y-3 text-sm text-gray-700">
    <p><strong>제공받는 자:</strong> (주)챔프스터디</p>
    <p className="font-semibold text-gray-800">[수집 항목]</p>
    <p>전화번호</p>
    <p className="font-semibold text-gray-800">[이용 목적]</p>
    <ul className="list-disc list-inside space-y-1">
      <li>문자(SMS/MMS) 및 전화 등을 통한 이벤트, 프로모션, 신규 서비스 안내</li>
      <li>마케팅 및 광고성 정보 제공</li>
    </ul>
    <p className="font-semibold text-gray-800">[보유 및 이용 기간]</p>
    <p>회원 탈퇴 또는 마케팅 수신 동의 철회 시까지</p>
    <p className="font-semibold text-gray-800">[동의 거부 권리 및 불이익]</p>
    <p>이용자는 본 동의를 거부할 수 있으며, 동의하지 않더라도 회원가입 및 서비스 이용에는 제한이 없습니다.</p>
    {COMMON_FOOTER}
  </div>
);

type ModalType = "required" | "email" | "phone" | null;

export default function ConsumerLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isReturning, setIsReturning] = useState(false);
  const [agreeAll, setAgreeAll] = useState(false);
  const [agreeRequired, setAgreeRequired] = useState(false);
  const [agreeEmail, setAgreeEmail] = useState(false);
  const [agreePhone, setAgreePhone] = useState(false);
  const [modal, setModal] = useState<ModalType>(null);
  const router = useRouter();

  useEffect(() => {
    const accounts = getStoredAccounts();
    setIsReturning(accounts[email] != null);
  }, [email]);

  const allChecked = agreeRequired && agreeEmail && agreePhone;
  useEffect(() => {
    setAgreeAll(allChecked);
  }, [allChecked]);

  const handleAgreeAll = useCallback((checked: boolean) => {
    setAgreeAll(checked);
    setAgreeRequired(checked);
    setAgreeEmail(checked);
    setAgreePhone(checked);
  }, []);

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
        if (!agreeRequired) {
          setError("필수 개인정보 수집·이용 동의에 체크해주세요.");
          setIsLoading(false);
          return;
        }
        setStoredAccounts({ ...accounts, [email]: password });
        const consents = getStoredConsents();
        setStoredConsents({
          ...consents,
          [email]: {
            agree_required_privacy: true,
            agree_marketing_email: agreeEmail,
            agree_marketing_phone: agreePhone,
            agreed_at: new Date().toISOString(),
          },
        });
      }
      localStorage.setItem("kapp_consumer_email", email);
      setIsLoading(false);
      router.push(ROUTES.APP_DIAGNOSIS);
    }, 800);
  };

  const canSubmit = isReturning
    ? true
    : agreeRequired && !isLoading;

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 py-8">
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
            KAPP 진단을 시작하려면 계정 정보를 입력해주세요
          </p>
          <p className="text-xs text-gray-400 text-center">
            {isReturning
              ? "이미 가입된 계정입니다. 비밀번호로 로그인하세요."
              : "최초 진입 시 비밀번호를 설정해주세요. (이메일 = 아이디)"}
          </p>
        </div>

        <div className="w-full max-w-xl bg-white border border-gray-200 rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 text-center mb-6">
            {isReturning ? "로그인" : "회원가입"}
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

            {/* 회원가입 시에만 개인정보 동의 영역 표시 */}
            {!isReturning && (
              <div className="rounded-lg border border-gray-200 bg-gray-50/50 p-4 space-y-3">
                <p className="text-xs font-semibold text-gray-700">개인정보 수집·이용 및 마케팅 동의</p>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={agreeAll}
                    onChange={(e) => handleAgreeAll(e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 shrink-0"
                  />
                  <span className="text-sm font-medium text-gray-900">전체 동의</span>
                </label>

                <div className="h-px bg-gray-200" />

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={agreeRequired}
                    onChange={(e) => setAgreeRequired(e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 shrink-0"
                  />
                  <span className="text-sm text-gray-800 flex-1 min-w-0">
                    <span className="inline-block px-1.5 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-700 mr-1.5 shrink-0">필수</span>
                    회원가입 및 서비스 이용을 위한 개인정보 수집·이용 동의
                  </span>
                  <button
                    type="button"
                    onClick={() => setModal("required")}
                    className="text-xs text-blue-600 hover:underline shrink-0 whitespace-nowrap"
                  >
                    내용 보기
                  </button>
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={agreeEmail}
                    onChange={(e) => setAgreeEmail(e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 shrink-0"
                  />
                  <span className="text-sm text-gray-800 flex-1 min-w-0">
                    <span className="inline-block px-1.5 py-0.5 rounded text-xs font-medium bg-gray-200 text-gray-600 mr-1.5 shrink-0">선택</span>
                    이메일 마케팅 활용 동의
                  </span>
                  <button
                    type="button"
                    onClick={() => setModal("email")}
                    className="text-xs text-blue-600 hover:underline shrink-0 whitespace-nowrap"
                  >
                    내용 보기
                  </button>
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={agreePhone}
                    onChange={(e) => setAgreePhone(e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 shrink-0"
                  />
                  <span className="text-sm text-gray-800 flex-1 min-w-0">
                    <span className="inline-block px-1.5 py-0.5 rounded text-xs font-medium bg-gray-200 text-gray-600 mr-1.5 shrink-0">선택</span>
                    전화번호 마케팅 및 홍보 활용 동의 (문자/전화)
                  </span>
                  <button
                    type="button"
                    onClick={() => setModal("phone")}
                    className="text-xs text-blue-600 hover:underline shrink-0 whitespace-nowrap"
                  >
                    내용 보기
                  </button>
                </label>
              </div>
            )}

            {error && (
              <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-md">{error}</p>
            )}

            <button
              type="submit"
              className="mt-6 w-full rounded-md bg-gray-900 text-white py-2.5 text-sm font-medium hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading || !canSubmit}
            >
              {isLoading ? "처리 중..." : isReturning ? "로그인" : "회원가입"}
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

      {/* 약관 전문 보기 모달 */}
      {modal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
          onClick={() => setModal(null)}
        >
          <div
            className="bg-white rounded-xl shadow-lg max-w-lg w-full max-h-[85vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between shrink-0">
              <h3 className="text-base font-semibold text-gray-900">
                {modal === "required" && "개인정보 수집·이용 동의 (필수)"}
                {modal === "email" && "이메일 마케팅 활용 동의 (선택)"}
                {modal === "phone" && "전화번호 마케팅 및 홍보 활용 동의 (선택)"}
              </h3>
              <button
                type="button"
                onClick={() => setModal(null)}
                className="p-1 rounded hover:bg-gray-100 text-gray-500"
                aria-label="닫기"
              >
                <span className="text-lg leading-none">×</span>
              </button>
            </div>
            <div className="p-5 overflow-y-auto flex-1 min-h-0">
              {modal === "required" && REQUIRED_PRIVACY_CONTENT}
              {modal === "email" && EMAIL_MARKETING_CONTENT}
              {modal === "phone" && PHONE_MARKETING_CONTENT}
            </div>
            <div className="px-5 py-3 border-t border-gray-200 shrink-0">
              <button
                type="button"
                onClick={() => setModal(null)}
                className="w-full py-2 rounded-md bg-gray-900 text-white text-sm font-medium hover:bg-gray-800"
              >
                확인
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
