
import Select from '@/components/ui/Select';
import { DepartmentKey, IndustryKey } from '../state/useBenchmarkFilters';

interface BenchmarkFiltersProps {
    selectedDepartment: DepartmentKey;
    onDepartmentChange: (value: DepartmentKey) => void;
    departmentOptions: { value: string; label: string }[];
    selectedIndustry: IndustryKey;
    onIndustryChange: (value: IndustryKey) => void;
    industryOptions: { value: string; label: string }[];
}

export default function BenchmarkFilters({
    selectedDepartment,
    onDepartmentChange,
    departmentOptions,
    selectedIndustry,
    onIndustryChange,
    industryOptions,
}: BenchmarkFiltersProps) {
    return (
        <div className="flex gap-2">
            <Select
                value={selectedDepartment}
                onChange={(e) => onDepartmentChange(e.target.value as DepartmentKey)}
                options={departmentOptions}
            />
            <Select
                value={selectedIndustry}
                onChange={(e) => onIndustryChange(e.target.value as IndustryKey)}
                options={industryOptions}
            />
        </div>
    );
}
