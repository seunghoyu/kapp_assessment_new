"use client";

import React from 'react';
import Button from '@/components/ui/Button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  const handlePrev = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  return (
    <div className="flex items-center justify-end space-x-2 pt-4">
      <Button
        variant="secondary"
        size="sm"
        onClick={handlePrev}
        disabled={currentPage === 1}
      >
        <ChevronLeft className="h-4 w-4 mr-1" />
        이전
      </Button>
      <div className="flex items-center space-x-1">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
          <Button
            key={page}
            variant={currentPage === page ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => onPageChange(page)}
            className="w-9 h-9"
          >
            {page}
          </Button>
        ))}
      </div>
      <Button
        variant="secondary"
        size="sm"
        onClick={handleNext}
        disabled={currentPage === totalPages}
      >
        다음
        <ChevronRight className="h-4 w-4 ml-1" />
      </Button>
    </div>
  );
}
