
"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { competencyTypes } from "@/data/competency/competencyRawData";
import { CompetencyType } from "../types";

import { BarData } from "../hooks/useCompetencyFilter";
import { CustomTooltip } from "./CustomTooltip";

const competencyColors: Record<CompetencyType, string> = {
    "지식": "#3b82f6",
    "적용": "#60a5fa",
    "성과": "#facc15",
    "생산성": "#8b5cf6",
};

export default function DepartmentBarChart({ data }: { data: BarData[] }) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart
        data={data}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
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
          cursor={{ fill: "rgba(243, 244, 246, 0.5)" }}
          content={<CustomTooltip />}
        />
        <Legend wrapperStyle={{fontSize: "14px", paddingTop: '20px'}}/>
        {competencyTypes.map(c => (
            <Bar
                key={c}
                dataKey={c}
                fill={competencyColors[c]}
                barSize={12}
                radius={[4, 4, 0, 0]}
            />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
}

