"use client";

import { useState, useMemo } from "react";
import Card, { CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Icon from "@/components/ui/Icon";
import Button from "@/components/ui/Button";
import { progressPrograms, type ProgressProgram, type ProgressStatus } from "@/data/progressPrograms";

type FilterValue = "all" | ProgressStatus;

export default function ProgressSection() {
  const [filter, setFilter] = useState<FilterValue>("all");

  const filtered = useMemo(() => {
    if (filter === "all") return progressPrograms;
    return progressPrograms.filter((p) => p.status === filter);
  }, [filter]);

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
          <Icon name="tasks" size={22} className="text-blue-600" />
          역량 개발 진행 현황
        </h2>
        <div className="flex gap-2">
          <Button
            variant={filter === "all" ? "primary" : "secondary"}
            size="sm"
            onClick={() => setFilter("all")}
          >
            전체
          </Button>
          <Button
            variant={filter === "ongoing" ? "primary" : "secondary"}
            size="sm"
            onClick={() => setFilter("ongoing")}
          >
            진행중
          </Button>
          <Button
            variant={filter === "completed" ? "primary" : "secondary"}
            size="sm"
            onClick={() => setFilter("completed")}
          >
            완료
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((program) => (
          <ProgressCard key={program.id} program={program} />
        ))}
      </div>
    </section>
  );
}

function ProgressCard({ program }: { program: ProgressProgram }) {
  const isCompleted = program.status === "completed";
  return (
    <Card className="bg-white border border-gray-200 shadow-sm rounded-lg p-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h4 className="text-base font-semibold text-gray-900">{program.name}</h4>
          <p className="text-sm text-gray-500 mt-0.5">{program.participantLabel}</p>
        </div>
        <Badge variant={isCompleted ? "success" : "yellow"} size="md">
          {isCompleted ? "완료" : "진행중"}
        </Badge>
      </div>
      <div className="h-3 bg-gray-100 rounded-full overflow-hidden mb-4">
        <div
          className={`h-full rounded-full transition-all duration-500 ${
            isCompleted ? "bg-green-500" : "bg-blue-500"
          }`}
          style={{ width: `${program.progressPercent}%` }}
        />
      </div>
      <div className="flex justify-between text-sm font-medium text-gray-600">
        <span>평균 {program.averageScore}점</span>
        <span>{program.goalLabel}</span>
      </div>
    </Card>
  );
}
