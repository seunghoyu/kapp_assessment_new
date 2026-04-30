"use client";
"use client";

import React from 'react';

type ScoreBarCellProps = {
  score: number;
  isHighest?: boolean;
  isLowest?: boolean;
};

const getScoreColor = (score: number): string => {
  if (score >= 90) return 'bg-blue-500';
  if (score >= 80) return 'bg-sky-400';
  if (score >= 70) return 'bg-teal-400';
  if (score >= 60) return 'bg-yellow-400';
  if (score >= 50) return 'bg-orange-400';
  return 'bg-red-500';
};

export default function ScoreBarCell({ 
  score, 
  isHighest = false, 
  isLowest = false,
}: ScoreBarCellProps) {
  const barWidth = `${score}%`;

  const cellClasses = [
    "relative w-full h-6 bg-gray-200/80 rounded-sm overflow-hidden",
    isHighest ? "ring-2 ring-offset-1 ring-blue-500" : "",
    isLowest ? "ring-1 ring-offset-1 ring-orange-500" : ""
  ].join(" ");

  const barClasses = "h-full transition-all duration-300 ease-out";
  const textClasses = "absolute inset-0 flex items-center justify-center text-xs font-bold text-white mix-blend-luminosity";

  return (
    <div className={cellClasses}>
      <div 
        className={`${barClasses} ${getScoreColor(score)}`}
        style={{ width: barWidth }}
      />
      <span className={textClasses}>
        {score}
      </span>
    </div>
  );
}
