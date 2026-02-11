"use client";

import { useState } from "react";
import Header from "@/components/layout/Header";
import Card, { CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import Table, {
  TableHeader,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/Table";
import Badge from "@/components/ui/Badge";
import Icon from "@/components/ui/Icon";
import {
  employeesData,
  type EmployeeRow,
} from "@/data/employeesData";

const trainingStatusLabel: Record<string, string> = {
  in_progress: "진행중",
  not_started: "미시작",
  completed: "완료",
};

const trainingStatusVariant: Record<string, "blue" | "yellow" | "purple"> = {
  in_progress: "blue",
  not_started: "yellow",
  completed: "purple",
};

export default function EmployeesPage() {
  const [showRaw, setShowRaw] = useState(false);
  const { tableMeta, rows } = employeesData;

  return (
    <>
      <Header
        title="직원 관리"
        subtitle="전체 직원 현황 및 Raw 데이터 확인"
        actions={
          <button
            type="button"
            onClick={() => setShowRaw((v) => !v)}
            className="flex items-center gap-2 rounded-md border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            <Icon name="insights" size={16} />
            {showRaw ? "테이블 보기" : "Raw JSON 보기"}
          </button>
        }
      />
      <main className="flex-1 overflow-y-auto bg-[#fdfdfd] w-full">
        <div className="w-full p-4 sm:p-6 lg:p-8">
          {!showRaw ? (
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Icon name="users" size={18} className="text-blue-600" />
                  <CardTitle>직원 목록</CardTitle>
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  data/employeesData.ts 기반 현황 ({rows.length}명)
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
                      {rows.map((row) => (
                        <TableRow key={row.id}>
                          <TableCell className="font-medium text-gray-900">
                            {row.name}
                          </TableCell>
                          <TableCell>{row.department}</TableCell>
                          <TableCell>{row.role}</TableCell>
                          <TableCell>
                            <span className="font-semibold">
                              {row.overallScore}
                            </span>
                          </TableCell>
                          <TableCell>{row.strength || "-"}</TableCell>
                          <TableCell>{row.weakness || "-"}</TableCell>
                          <TableCell>
                            <Badge
                              variant={trainingStatusVariant[row.trainingStatus]}
                              size="md"
                            >
                              {trainingStatusLabel[row.trainingStatus]}
                            </Badge>
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
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Icon name="insights" size={18} className="text-blue-600" />
                  <CardTitle>Raw 데이터 (employeesData)</CardTitle>
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  data/employeesData.ts 원본 구조
                </p>
              </CardHeader>
              <CardContent>
                <pre className="overflow-x-auto rounded-lg bg-gray-900 text-gray-100 p-4 text-xs sm:text-sm font-mono max-h-[70vh] overflow-y-auto">
                  {JSON.stringify(employeesData, null, 2)}
                </pre>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </>
  );
}
