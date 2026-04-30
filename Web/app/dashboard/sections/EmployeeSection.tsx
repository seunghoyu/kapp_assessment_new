"use client";

import { useState, useMemo } from "react";
import Card, { CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Icon from "@/components/ui/Icon";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import { employeesData, type Employee } from "@/data/employees/employees";

interface EmployeeSectionProps {
  onNotify?: (message: string, type?: "info" | "success") => void;
}

export default function EmployeeSection({ onNotify }: EmployeeSectionProps) {
  const [search, setSearch] = useState("");
  const [addModalOpen, setAddModalOpen] = useState(false);

  const filtered = useMemo(() => {
    if (!search.trim()) return employeesData;
    const q = search.trim().toLowerCase();
    return employeesData.filter(
      (e) =>
        e.name.toLowerCase().includes(q) ||
        e.department.toLowerCase().includes(q) ||
        e.position.toLowerCase().includes(q)
    );
  }, [search]);

  const handleView = (name: string) => {
    onNotify?.(`${name}의 상세 정보를 조회합니다.`, "info");
  };
  const handleAssign = (name: string) => {
    onNotify?.(`${name}에게 교육을 배정합니다.`, "success");
  };
  const handleReport = (name: string) => {
    onNotify?.(`${name}의 리포트를 다운로드합니다.`, "info");
  };

  return (
    <section className="space-y-4">
      <Card className="bg-white border border-gray-200 shadow-sm rounded-lg overflow-hidden p-0">
        <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-4 border-b border-gray-200 px-6 py-4 mb-0">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <Icon name="users" size={22} className="text-blue-600" />
            임직원 역량 현황
          </h2>
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Icon name="search" size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="검색..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-48"
              />
            </div>
            <Button variant="primary" size="sm" onClick={() => setAddModalOpen(true)} icon={<Icon name="userPlus" size={14} />}>
              임직원 추가
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left text-sm font-semibold text-gray-900 px-6 py-3 border-b border-gray-200">이름</th>
                  <th className="text-left text-sm font-semibold text-gray-900 px-6 py-3 border-b border-gray-200">부서</th>
                  <th className="text-left text-sm font-semibold text-gray-900 px-6 py-3 border-b border-gray-200">직급</th>
                  <th className="text-left text-sm font-semibold text-gray-900 px-6 py-3 border-b border-gray-200">종합 점수</th>
                  <th className="text-left text-sm font-semibold text-gray-900 px-6 py-3 border-b border-gray-200">강점 역량</th>
                  <th className="text-left text-sm font-semibold text-gray-900 px-6 py-3 border-b border-gray-200">개선 필요</th>
                  <th className="text-left text-sm font-semibold text-gray-900 px-6 py-3 border-b border-gray-200">교육 현황</th>
                  <th className="text-left text-sm font-semibold text-gray-900 px-6 py-3 border-b border-gray-200">액션</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((emp) => (
                  <EmployeeRow
                    key={emp.id}
                    employee={emp}
                    onView={handleView}
                    onAssign={handleAssign}
                    onReport={handleReport}
                  />
                ))}
              </tbody>
            </table>
          </div>
          {filtered.length === 0 && (
            <div className="px-6 py-8 text-center text-gray-500 text-sm">검색 결과가 없습니다.</div>
          )}
        </CardContent>
      </Card>

      <Modal open={addModalOpen} onClose={() => setAddModalOpen(false)} title="임직원 추가">
        <p className="text-gray-700 text-sm">
          임직원 추가 기능은 인사 시스템 또는 엑셀 업로드와 연동 후 이용할 수 있습니다. 담당자에게 문의하세요.
        </p>
        <div className="mt-4 flex justify-end">
          <Button variant="primary" size="sm" onClick={() => setAddModalOpen(false)}>
            확인
          </Button>
        </div>
      </Modal>
    </section>
  );
}

function EmployeeRow({
  employee,
  onView,
  onAssign,
  onReport,
}: {
  employee: Employee;
  onView: (name: string) => void;
  onAssign: (name: string) => void;
  onReport: (name: string) => void;
}) {
  const scoreVariant = employee.score >= 80 ? "success" : employee.score >= 70 ? "yellow" : "destructive";
  return (
    <tr className="hover:bg-gray-50 border-b border-gray-100 last:border-b-0">
      <td className="px-6 py-4 text-sm font-semibold text-gray-900">{employee.name}</td>
      <td className="px-6 py-4 text-sm text-gray-700">{employee.department}</td>
      <td className="px-6 py-4 text-sm text-gray-700">{employee.position}</td>
      <td className="px-6 py-4">
        <Badge variant={scoreVariant} size="md">{employee.score}점</Badge>
      </td>
      <td className="px-6 py-4 text-sm text-gray-700">
        <span className="inline-block px-2 py-0.5 rounded bg-blue-100 text-blue-700 text-xs font-medium">
          {employee.strength}
        </span>
      </td>
      <td className="px-6 py-4 text-sm text-gray-700">
        <span className="inline-block px-2 py-0.5 rounded bg-gray-100 text-gray-700 text-xs font-medium">
          {employee.weakness}
        </span>
      </td>
      <td className="px-6 py-4 text-sm text-gray-600">{employee.education}</td>
      <td className="px-6 py-4">
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => onView(employee.name)}
            className="p-2 rounded-md text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors"
            title="상세보기"
            aria-label={`${employee.name} 상세보기`}
          >
            <Icon name="eye" size={16} />
          </button>
          <button
            type="button"
            onClick={() => onAssign(employee.name)}
            className="p-2 rounded-md text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors"
            title="교육 배정"
            aria-label={`${employee.name} 교육 배정`}
          >
            <Icon name="programs" size={16} />
          </button>
          <button
            type="button"
            onClick={() => onReport(employee.name)}
            className="p-2 rounded-md text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors"
            title="리포트"
            aria-label={`${employee.name} 리포트 다운로드`}
          >
            <Icon name="download" size={16} />
          </button>
        </div>
      </td>
    </tr>
  );
}
