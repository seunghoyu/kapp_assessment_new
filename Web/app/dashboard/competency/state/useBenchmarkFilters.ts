
import { useState } from 'react';
import { loadBenchmarkData } from '@/data/benchmark/loadBenchmarkData';

const { departments, benchmarks } = loadBenchmarkData();

export type DepartmentKey = keyof typeof departments;
export type IndustryKey = keyof typeof benchmarks | 'retail' | 'manufacturing';

export const useBenchmarkFilters = (
    initialDept: DepartmentKey = 'dev',
    initialIndustry: IndustryKey = 'it'
) => {
    const [selectedDepartment, setSelectedDepartment] = useState<DepartmentKey>(initialDept);
    const [selectedIndustry, setSelectedIndustry] = useState<IndustryKey>(initialIndustry);

    const departmentOptions = Object.entries(departments).map(([key, { name }]) => ({
        value: key,
        label: name,
    }));

    const industryOptions = [
        { value: 'it', label: 'IT/소프트웨어' },
        { value: 'finance', label: '금융' },
        { value: 'retail', label: '리테일' },
        { value: 'manufacturing', label: '제조업' },
    ];
    
    return {
        selectedDepartment,
        setSelectedDepartment,
        selectedIndustry,
        setSelectedIndustry,
        departmentOptions,
        industryOptions,
        currentDepartmentData: departments[selectedDepartment],
        currentIndustryData: (benchmarks as Record<IndustryKey, any>)[selectedIndustry],
    };
};
