"use client";

import Card, { CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import Icon from "@/components/ui/Icon";

export default function RightPanel() {
  return (
    <aside className="hidden lg:block w-64 xl:w-72 flex-shrink-0 border-l border-gray-200 bg-white">
      <div className="sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto p-6 space-y-6">
        {/* 빠른 액션 */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Icon name="plus" size={18} className="text-gray-500" />
              <CardTitle>빠른 액션</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Button
                variant="primary"
                className="w-full justify-start"
                icon={<Icon name="plus" size={16} />}
              >
                직원 추가
              </Button>
              <Button
                variant="secondary"
                className="w-full justify-start"
                icon={<Icon name="download" size={16} />}
              >
                리포트 다운로드
              </Button>
              <Button
                variant="secondary"
                className="w-full justify-start"
                icon={<Icon name="analytics" size={16} />}
              >
                분석 보기
              </Button>
              <Button
                variant="secondary"
                className="w-full justify-start"
                icon={<Icon name="filter" size={16} />}
              >
                필터 설정
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* AI 인사이트 */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Icon name="insights" size={18} className="text-gray-500" />
              <CardTitle>AI 인사이트</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 rounded-md hover:bg-gray-50 transition-colors cursor-pointer">
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-900">
                    스킬 갭 감지
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    개발팀에서 React 스킬이 부족합니다
                  </div>
                </div>
                <Badge variant="yellow">경고</Badge>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-md hover:bg-gray-50 transition-colors cursor-pointer">
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-900">
                    교육 추천
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    마케팅팀을 위한 디지털 마케팅 과정
                  </div>
                </div>
                <Badge variant="purple">추천</Badge>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-md hover:bg-gray-50 transition-colors cursor-pointer">
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-900">
                    신규 인사이트
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    고성과자 패턴 분석 완료
                  </div>
                </div>
                <Badge variant="blue">신규</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 최근 활동 */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Icon name="bell" size={18} className="text-gray-500" />
              <CardTitle>최근 활동</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-start gap-3 pb-3 border-b border-gray-200 last:border-0">
                <div className="flex-shrink-0 w-2 h-2 rounded-full bg-blue-500 mt-1.5"></div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-900">
                    새로운 직원이 추가되었습니다
                  </div>
                  <div className="text-xs text-gray-500 mt-1">2시간 전</div>
                </div>
              </div>
              <div className="flex items-start gap-3 pb-3 border-b border-gray-200 last:border-0">
                <div className="flex-shrink-0 w-2 h-2 rounded-full bg-blue-500 mt-1.5"></div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-900">
                    교육 프로그램이 완료되었습니다
                  </div>
                  <div className="text-xs text-gray-500 mt-1">5시간 전</div>
                </div>
              </div>
              <div className="flex items-start gap-3 pb-3 border-b border-gray-200 last:border-0">
                <div className="flex-shrink-0 w-2 h-2 rounded-full bg-blue-500 mt-1.5"></div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-900">
                    AI 인사이트가 생성되었습니다
                  </div>
                  <div className="text-xs text-gray-500 mt-1">1일 전</div>
                </div>
              </div>
              <div className="flex items-start gap-3 pb-3 border-b border-gray-200 last:border-0">
                <div className="flex-shrink-0 w-2 h-2 rounded-full bg-blue-500 mt-1.5"></div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-900">
                    리포트가 업데이트되었습니다
                  </div>
                  <div className="text-xs text-gray-500 mt-1">2일 전</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </aside>
  );
}
