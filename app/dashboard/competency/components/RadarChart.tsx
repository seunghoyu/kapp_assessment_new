
"use client";

import { useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';
import type { Chart as ChartType, ChartData } from 'chart.js';

Chart.register(...registerables);

interface RadarChartProps {
  data: ChartData<'radar'>;
}

export default function RadarChart({ data }: RadarChartProps) {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstanceRef = useRef<ChartType | null>(null);

  useEffect(() => {
    if (chartRef.current) {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
      const ctx = chartRef.current.getContext('2d');
      if (ctx) {
        chartInstanceRef.current = new Chart(ctx, {
          type: 'radar',
          data: data,
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              r: {
                min: 0,
                max: 100,
                stepSize: 20,
                pointLabels: {
                  font: {
                    size: 12,
                  }
                },
                ticks: {
                  backdropColor: 'transparent',
                }
              },
            },
            plugins: {
              legend: {
                position: 'top',
              },
            },
          },
        });
      }
    }
    
    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
        chartInstanceRef.current = null;
      }
    };
  }, [data]);

  return <div className="h-[450px]"><canvas ref={chartRef} /></div>;
}
