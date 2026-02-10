
import { Insight } from '@/data/transformBenchmark';
import InsightCard from './InsightCard';

interface InsightListProps {
  title: string;
  insights: Insight[];
  isNegative: boolean;
  emptyPlaceholder: string;
}

export default function InsightList({ title, insights, isNegative, emptyPlaceholder }: InsightListProps) {
  const titleColor = isNegative ? 'text-red-600' : 'text-green-700';

  if (!insights || insights.length === 0) {
    return (
        <div>
             <h4 className={`font-medium ${titleColor}`}>{title}</h4>
             <p className="mt-2 text-sm text-gray-500">{emptyPlaceholder}</p>
        </div>
    );
  }

  return (
    <div>
      <h4 className={`font-medium ${titleColor}`}>{title}</h4>
      <div className="mt-2 space-y-3">
        {insights.map((insight) => (
          <InsightCard key={insight.key} insight={insight} isNegative={isNegative} />
        ))}
      </div>
    </div>
  );
}
