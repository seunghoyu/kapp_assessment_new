
"use client";

import { useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';
import type { Chart as ChartType, ChartData } from 'chart.js';

Chart.register(...registerables);

interface RadarChartProps {
  data: ChartData<'radar'>;
  /** 차트 컨테이너 높이/크기용 (반응형 시 부모에서 제어) */
  className?: string;
}

export default function RadarChart({ data, className }: RadarChartProps) {
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
            maintainAspectRatio: true,
            aspectRatio: 1,
            scales: {
              r: {
                min: 0,
                max: 100,
                ticks: {
                  stepSize: 20,
                  backdropColor: 'transparent',
                },
                pointLabels: {
                  font: {
                    size: 12,
                  }
                },
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

  return (
    <div className={className ?? "h-[280px] w-full max-w-[320px]"}>
      <canvas ref={chartRef} />
    </div>
  );
}
