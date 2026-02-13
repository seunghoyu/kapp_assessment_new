"use client";

import { useState, useMemo } from "react";
import Header from "@/components/layout/Header";
import Card, { CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import Table, {
  TableHeader,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/Table";
import Icon from "@/components/ui/Icon";
import Pagination from "@/app/dashboard/competency/components/Pagination";
import {
  employeesData,
  type EmployeeRow,
} from "@/data/employees/employeesData";

const PAGE_SIZE = 20;

export default function EmployeesPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const { tableMeta, rows } = employeesData;

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(rows.length / PAGE_SIZE)),
    [rows.length]
  );
  const paginatedRows = useMemo(
    () =>
      rows.slice(
        (currentPage - 1) * PAGE_SIZE,
        currentPage * PAGE_SIZE
      ),
    [rows, currentPage]
  );
  const rangeStart = (currentPage - 1) * PAGE_SIZE + 1;
  const rangeEnd = Math.min(currentPage * PAGE_SIZE, rows.length);

  const formatGoals = (goals?: string[]) => {
    if (!goals || goals.length === 0) return "-";
    const labels: Record<string, string> = {
      승진: "승진 준비",
      이직: "이직/전직 준비",
      스킬업: "직무 스킬 향상",
      커리어전환: "커리어 전환",
    };
    return goals.map((g) => labels[g] ?? g).join(", ");
  };

  return (
    <>
      <Header
        title="직원 관리"
        subtitle="진단 전 입력 기본정보 현황 (KAPP_DIAGNOSIS_DATA_REFERENCE 기준)"
      />
      <main className="flex-1 overflow-y-auto bg-[#fdfdfd] w-full">
        <div className="w-full p-4 sm:p-6 lg:p-8">
          <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Icon name="users" size={18} className="text-blue-600" />
                  <CardTitle>직원 목록</CardTitle>
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  data/employees/employeesData.json 기반 · {rangeStart}-{rangeEnd} / {rows.length}명 (페이지당 {PAGE_SIZE}명)
                </p>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow hover={false}>
                        {tableMeta.columns.map((col) => (
                          <TableHead key={col}>{col}</TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <tbody>
                      {paginatedRows.map((row: EmployeeRow) => (
                        <TableRow key={row.id}>
                          <TableCell className="font-medium text-gray-900">
                            {row.name}
                          </TableCell>
                          <TableCell className="text-gray-600">
                            {row.email || "-"}
                          </TableCell>
                          <TableCell>{row.industry}</TableCell>
                          <TableCell>{row.job}</TableCell>
                          <TableCell>{row.positionLevel}</TableCell>
                          <TableCell>{row.experienceYears}</TableCell>
                          <TableCell className="text-gray-600">
                            {row.companyName || "-"}
                          </TableCell>
                          <TableCell>{row.companySize}</TableCell>
                          <TableCell className="text-sm text-gray-600 max-w-[200px]">
                            {formatGoals(row.goals)}
                          </TableCell>
                          <TableCell>
                            <button
                              type="button"
                              className="text-blue-600 hover:underline text-sm"
                            >
                              보기
                            </button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </tbody>
                  </Table>
                </div>
                <div className="border-t border-gray-100 px-4 py-3 flex justify-center">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                  />
                </div>
              </CardContent>
            </Card>
        </div>
      </main>
    </>
  );
}
