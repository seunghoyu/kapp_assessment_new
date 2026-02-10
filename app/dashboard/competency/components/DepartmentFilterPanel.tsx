
"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";

interface DepartmentFilterPanelProps {
  departments: string[];
  selectedDepartments: string[];
  onApply: (selected: string[]) => void;
  onClose: () => void;
}

export default function DepartmentFilterPanel({
  departments,
  selectedDepartments,
  onApply,
  onClose,
}: DepartmentFilterPanelProps) {
  const [draft, setDraft] = useState(selectedDepartments);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredDepartments = departments.filter((d) =>
    d.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleToggle = (department: string) => {
    setDraft((prev) =>
      prev.includes(department)
        ? prev.filter((d) => d !== department)
        : [...prev, department]
    );
  };

  const handleSelectAll = () => {
    setDraft(departments);
  };

  const handleClearAll = () => {
    setDraft([]);
  };

  const handleApply = () => {
    onApply(draft);
    onClose();
  };

  return (
    <Card className="absolute z-10 mt-2 w-72 bg-white shadow-lg">
      <div className="p-4">
        <input
          type="text"
          placeholder="부서 검색..."
          className="mb-2 w-full rounded border px-2 py-1"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div className="flex justify-between text-sm mb-2">
            <Button variant="link" onClick={handleSelectAll}>모두 선택</Button>
            <Button variant="link" onClick={handleClearAll}>모두 해제</Button>
        </div>
        <div className="max-h-60 overflow-y-auto">
          {filteredDepartments.map((d) => (
            <div key={d} className="flex items-center gap-2 p-1">
              <input
                type="checkbox"
                id={`dept-${d}`}
                checked={draft.includes(d)}
                onChange={() => handleToggle(d)}
              />
              <label htmlFor={`dept-${d}`} className="text-sm">
                {d}
              </label>
            </div>
          ))}
        </div>
      </div>
      <div className="flex justify-end gap-2 border-t bg-gray-50 p-4">
        <Button variant="ghost" onClick={onClose}>
          취소
        </Button>
        <Button onClick={handleApply}>적용</Button>
      </div>
    </Card>
  );
}
