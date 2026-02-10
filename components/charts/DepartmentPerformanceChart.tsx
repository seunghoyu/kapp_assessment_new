"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { departmentPerformanceData } from "@/data/departmentPerformance";

export default function DepartmentPerformanceChart() {
  const data = departmentPerformanceData.series;

  return (
    <ResponsiveContainer width="100%" height={256}>
      <BarChart
        data={data}
        barCategoryGap={24}
        barGap={6}
        margin={{
          top: 20,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis
          dataKey="department"
          tick={{ fill: "#6b7280", fontSize: 13 }}
          axisLine={{ stroke: "#e5e7eb" }}
        />
        <YAxis
          tick={{ fill: "#6b7280", fontSize: 13 }}
          axisLine={{ stroke: "#e5e7eb" }}
          domain={[0, 100]}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "white",
            border: "1px solid #e5e7eb",
            borderRadius: "6px",
            fontSize: "12px",
            padding: "8px 12px",
          }}
          labelStyle={{ color: "#374151", fontWeight: 600 }}
          formatter={(value) => [`${value ?? 0}점`, "성과"]}
        />
        <Bar
          dataKey="value"
          fill="#3b82f6"
          barSize={50}
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
