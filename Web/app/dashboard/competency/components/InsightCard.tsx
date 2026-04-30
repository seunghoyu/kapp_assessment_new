
import Badge from '@/components/ui/Badge';
import { Insight } from '@/data/benchmark/transformBenchmark';

interface InsightCardProps {
  insight: Insight;
  isNegative: boolean;
}

export default function InsightCard({ insight, isNegative }: InsightCardProps) {
  const badgeVariant = isNegative ? 'destructive' : 'success';
  const diffText = `${insight.diff > 0 ? '+' : ''}${insight.diff}점`;

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 flex items-center justify-between">
      <div className="flex-1">
        <p className="font-semibold text-gray-800">{insight.title}</p>
        <p className="text-sm text-gray-500">
          우리 팀: {insight.teamScore}점 | 업계 평균: {insight.industryScore}점
        </p>
      </div>
      <div className="flex items-center gap-4 ml-4">
        <Badge variant={badgeVariant} className="px-2 py-1 rounded-full text-sm font-medium">
            {diffText}
        </Badge>
      </div>
    </div>
  );
}
