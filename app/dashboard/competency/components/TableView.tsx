"use client";

import { useState, useMemo } from 'react';
import { BarData } from '../hooks/useCompetencyFilter';
import { competencyTypes } from '@/data/competencyRawData';
import ScoreBarCell from './ScoreBarCell';
import Pagination from './Pagination';
import { ArrowUpDown } from 'lucide-react';

const ITEMS_PER_PAGE = 5;

type SortConfig = {
  key: keyof BarData;
  direction: 'asc' | 'desc';
} | null;

export default function TableView({ data }: { data: BarData[] }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'value', direction: 'desc' });

  const sortedData = useMemo(() => {
    let sortableData = [...data];
    if (sortConfig !== null) {
      sortableData.sort((a, b) => {
        const { key, direction } = sortConfig;
        
        if (key === 'department') {
            const aVal = a.department || '';
            const bVal = b.department || '';
            return direction === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
        }

        const aVal = a[key] ?? 0;
        const bVal = b[key] ?? 0;

        if (aVal < bVal) return direction === 'asc' ? -1 : 1;
        if (aVal > bVal) return direction === 'asc' ? 1 : -1;
        
        return 0;
      });
    }
    return sortableData;
  }, [data, sortConfig]);
  
  const totalPages = Math.ceil(sortedData.length / ITEMS_PER_PAGE);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return sortedData.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [sortedData, currentPage]);

  const pageMinMax = useMemo(() => {
    if (paginatedData.length === 0) return { minScore: 0, maxScore: 100 };
    let minScore = 101;
    let maxScore = -1;
    paginatedData.forEach(row => {
        const scores = [...competencyTypes.map(c => row[c] ?? 0), row.value];
        scores.forEach(score => {
            if (score < minScore) minScore = score;
            if (score > maxScore) maxScore = score;
        });
    });
    return { minScore, maxScore };
  }, [paginatedData]);

  const requestSort = (key: keyof BarData) => {
    if (key === 'department') {
        // Allow department sorting as well
        let direction: 'asc' | 'desc' = 'asc';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    } else {
        let direction: 'asc' | 'desc' = 'desc';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'desc') {
            direction = 'asc';
        }
        setSortConfig({ key, direction });
    }
    setCurrentPage(1);
  };
  
  const headers: { key: keyof BarData, label: string }[] = [
    { key: 'department', label: '부서' },
    { key: 'value', label: '종합 평균' },
    ...competencyTypes.map(c => ({ key: c, label: c }))
  ];

  return (
    <div className="w-full">
      <div className="overflow-x-auto border border-gray-200 rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {headers.map(header => (
                <th 
                  key={header.key}
                  scope="col" 
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => requestSort(header.key)}
                >
                  <div className="flex items-center gap-1">
                    {header.label}
                    <ArrowUpDown className="w-3 h-3 text-gray-400" />
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedData.length > 0 ? paginatedData.map((row) => (
              <tr key={row.department} className="hover:bg-gray-50">
                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-800">{row.department}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm w-40">
                  <ScoreBarCell 
                    score={row.value}
                    isHighest={row.value === pageMinMax.maxScore}
                    isLowest={row.value === pageMinMax.minScore}
                  />
                </td>
                {competencyTypes.map(c => (
                   <td key={c} className="px-4 py-3 whitespace-nowrap text-sm w-40">
                    <ScoreBarCell 
                      score={row[c] ?? 0}
                      isHighest={(row[c] ?? 0) === pageMinMax.maxScore}
                      isLowest={(row[c] ?? 0) === pageMinMax.minScore}
                    />
                  </td>
                ))}
              </tr>
            )) : (
              <tr>
                <td colSpan={headers.length} className="text-center py-10 text-sm text-gray-500">
                  표시할 데이터가 없습니다.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
    </div>
  );
}
