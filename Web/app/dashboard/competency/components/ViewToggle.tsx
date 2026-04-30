"use client";
import React from 'react';
import Button from '@/components/ui/Button'; 
import { List, BarChart } from 'lucide-react';

type View = 'chart' | 'table';

type ViewToggleProps = {
  view: View;
  setView: (view: View) => void;
};

export default function ViewToggle({ view, setView }: ViewToggleProps) {
  return (
    <div className="flex items-center p-1 bg-gray-100 rounded-lg">
      <Button
        variant={view === 'chart' ? 'primary' : 'ghost'}
        size="sm"
        onClick={() => setView('chart')}
      >
        <BarChart className="w-4 h-4" />
        그래프형
      </Button>
      <Button
        variant={view === 'table' ? 'primary' : 'ghost'}
        size="sm"
        onClick={() => setView('table')}
      >
        <List className="w-4 h-4" />
        표형
      </Button>
    </div>
  );
}
