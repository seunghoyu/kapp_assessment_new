type Skills = { [key: string]: number };

interface Department {
  name: string;
  skills: Skills;
}

interface Benchmark {
  name: string;
  skills: Skills;
}

interface TransformedData {
  positives: Insight[];
  negatives: Insight[];
}

export interface Insight {
  key: string;
  title: string;
  teamScore: number;
  industryScore: number;
  diff: number;
}

export const transformBenchmark = (
  department: Department,
  benchmark: Benchmark | undefined
): TransformedData => {
  const positives: Insight[] = [];
  const negatives: Insight[] = [];

  if (!department) {
    return { positives, negatives };
  }

  const benchmarkSkills = benchmark?.skills ?? {};

  for (const skill in department.skills) {
    const teamScore = department.skills[skill];
    const industryScore = benchmarkSkills[skill] ?? 80; // Default to 80 if not in benchmark
    const diff = Math.round(teamScore - industryScore);

    const insight: Insight = {
      key: skill,
      title: skill,
      teamScore,
      industryScore,
      diff,
    };

    if (diff > 0) {
      positives.push(insight);
    } else if (diff < 0) {
      negatives.push(insight);
    }
  }
  
  positives.sort((a, b) => b.diff - a.diff);
  negatives.sort((a, b) => a.diff - b.diff);

  return { positives, negatives };
};
