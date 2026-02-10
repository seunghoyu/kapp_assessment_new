
"use client";

import {

  LineChart,

  Line,

  XAxis,

  YAxis,

  CartesianGrid,

  Tooltip,

  ResponsiveContainer,

  Legend,

} from "recharts";

import { competencyTypes, CompetencyType } from "@/data/competencyRawData";

import { CustomTooltip } from "./CustomTooltip";

import { useEffect } from "react";



type TrendItem = {

  date: string;

} & {

  [key in CompetencyType]?: number;

};



const competencyColors: Record<CompetencyType, string> = {

    "지식": "#3b82f6",

    "적용": "#60a5fa",

    "성과": "#facc15",

    "생산성": "#8b5cf6",

};



export default function TrendLineChart({ data }: { data: TrendItem[] }) {

  useEffect(() => {

    if (!data || data.length === 0) {

      console.warn("TrendLineChart received no data or an empty array. Chart will not render.");

    }

  }, [data]);



  if (!data || data.length === 0) {

    return (

      <div className="flex items-center justify-center h-[280px] bg-gray-50 rounded-lg">

        <p className="text-sm text-gray-500">선택한 기간에 해당하는 데이터가 없습니다.</p>

      </div>

    );

  }



  return (

    <ResponsiveContainer width="100%" height={280}>

      <LineChart

        data={data}

        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}

      >

        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />

        <XAxis

          dataKey="date"

          tick={{ fill: "#6b7280", fontSize: 12 }}

          axisLine={{ stroke: "#e5e7eb" }}

        />

        <YAxis

          tick={{ fill: "#6b7280", fontSize: 13 }}

          axisLine={{ stroke: "#e5e7eb" }}

          domain={[0, 100]}

        />

        <Tooltip

          cursor={{ stroke: "#a1a1aa", strokeDasharray: "3 3" }}

          content={<CustomTooltip />}

        />

        <Legend wrapperStyle={{fontSize: "14px", paddingTop: '20px'}}/>

        {competencyTypes.map((c) => (

            <Line

                key={c}

                type="monotone"

                dataKey={c}

                stroke={competencyColors[c]}

                strokeWidth={2}

                dot={{ r: 2 }}

                activeDot={{ r: 5 }}

            />

        ))}

      </LineChart>

    </ResponsiveContainer>

  );

}

