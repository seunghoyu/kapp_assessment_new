"use client";

import { useState } from "react";
import Card, { CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import Icon from "@/components/ui/Icon";

const AI_INSIGHTS = [
  { title: "스킬 갭 감지", desc: "개발팀에서 React 스킬이 부족합니다", variant: "yellow" as const, label: "경고" },
  { title: "교육 추천", desc: "마케팅팀을 위한 디지털 마케팅 과정", variant: "purple" as const, label: "추천" },
  { title: "신규 인사이트", desc: "고성과자 패턴 분석 완료", variant: "blue" as const, label: "신규" },
];

export default function RightPanel() {
  const [insightModalOpen, setInsightModalOpen] = useState(false);
  const [isPanelOpen, setIsPanelOpen] = useState(true);

  /* 접은 상태: 펼치기 버튼만 오른쪽 끝에 고정 */
  if (!isPanelOpen) {
    return (
      <>
        <button
          type="button"
          onClick={() => setIsPanelOpen(true)}
          className="hidden lg:flex fixed right-0 top-1/2 -translate-y-1/2 z-30 w-10 h-14 items-center justify-center rounded-l-lg border border-r-0 border-gray-200 bg-white shadow-md text-gray-600 hover:bg-gray-50 hover:text-blue-600 transition-colors"
          aria-label="우측 패널 펼치기"
        >
          <Icon name="chevronLeft" size={20} />
        </button>
      </>
    );
  }

  return (
    <>
      <aside className="hidden lg:flex lg:flex-col lg:w-64 xl:w-72 flex-shrink-0 border-l border-gray-200 bg-white sticky top-0 self-start h-screen">
        <div className="flex-1 overflow-y-auto py-6 px-4 space-y-5">
          {/* 패널 상단 고정 영역: 직관적 네이밍 제안 반영 → "빠른 메뉴" */}
          <div className="pb-2 border-b border-gray-200">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
              빠른 메뉴
            </h2>
          </div>

          {/* 빠른 액션: 필터 설정 / 분석 보기 제거 */}
          <Card className="p-4">
            <CardHeader className="p-0 mb-3">
              <div className="flex items-center gap-2">
                <Icon name="plus" size={16} className="text-gray-500" />
                <CardTitle className="text-sm font-semibold">빠른 액션</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="space-y-2">
                <Button
                  variant="primary"
                  size="sm"
                  className="w-full justify-start"
                  icon={<Icon name="plus" size={14} />}
                >
                  직원 추가
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  className="w-full justify-start"
                  icon={<Icon name="download" size={14} />}
                >
                  리포트 다운로드
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* AI 인사이트: 카드 축소, 클릭 시 모달 */}
          <div
            role="button"
            tabIndex={0}
            onClick={() => setInsightModalOpen(true)}
            onKeyDown={(e) => e.key === "Enter" && setInsightModalOpen(true)}
            className="cursor-pointer"
          >
            <Card className="p-4 hover:shadow-md transition-shadow border-blue-100">
              <CardHeader className="p-0 mb-1">
                <div className="flex items-center gap-2">
                  <Icon name="insights" size={16} className="text-blue-600" />
                  <CardTitle className="text-sm font-semibold">AI 인사이트</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <p className="text-xs text-gray-500">
                  인사이트 {AI_INSIGHTS.length}건 · 클릭하여 보기
                </p>
              </CardContent>
            </Card>
          </div>

          {/* 최근 활동 */}
          <Card className="p-4">
            <CardHeader className="p-0 mb-3">
              <div className="flex items-center gap-2">
                <Icon name="bell" size={16} className="text-gray-500" />
                <CardTitle className="text-sm font-semibold">최근 활동</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="space-y-2">
                {[
                  { text: "새로운 직원이 추가되었습니다", time: "2시간 전" },
                  { text: "교육 프로그램이 완료되었습니다", time: "5시간 전" },
                  { text: "AI 인사이트가 생성되었습니다", time: "1일 전" },
                  { text: "리포트가 업데이트되었습니다", time: "2일 전" },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-2 py-2 border-b border-gray-100 last:border-0">
                    <div className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5" />
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-medium text-gray-900 truncate">{item.text}</div>
                      <div className="text-xs text-gray-400">{item.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 접기 버튼: 패널 하단 좌측 */}
        <div className="flex justify-start p-4 border-t border-gray-200 bg-gray-50/80">
          <button
            type="button"
            onClick={() => setIsPanelOpen(false)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:bg-gray-200 hover:text-gray-900 transition-colors"
            aria-label="우측 패널 접기"
          >
            <Icon name="chevronRight" size={18} />
            <span>패널 접기</span>
          </button>
        </div>
      </aside>

      {/* AI 인사이트 모달 */}
      {insightModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
          onClick={() => setInsightModalOpen(false)}
        >
          <div
            className="bg-white rounded-lg shadow-xl border border-gray-200 w-full max-w-md max-h-[85vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">AI 인사이트</h3>
              <button
                type="button"
                onClick={() => setInsightModalOpen(false)}
                className="p-1 rounded-md text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                aria-label="닫기"
              >
                <Icon name="x" size={20} />
              </button>
            </div>
            <div className="overflow-y-auto max-h-[calc(85vh-4rem)] p-6 space-y-3">
              {AI_INSIGHTS.map((item, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 p-4 rounded-lg border border-gray-200 bg-gray-50/50 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-gray-900">{item.title}</div>
                    <div className="text-sm text-gray-600 mt-1">{item.desc}</div>
                  </div>
                  <Badge variant={item.variant}>{item.label}</Badge>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
