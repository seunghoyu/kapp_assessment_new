"use client";

import DepartmentSkillChart from "./DepartmentSkillChart";

interface DepartmentSkillChartWithFilterProps {
  data: Array<{ department: string; value: number }>;
}

export default function DepartmentSkillChartWithFilter({
  data,
}: DepartmentSkillChartWithFilterProps) {
  return <DepartmentSkillChart data={data} />;
}
