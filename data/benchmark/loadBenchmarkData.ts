import organizationData from "./organizationData.json";
import industryBenchmarks from "./industryBenchmarks.json";

export const loadBenchmarkData = () => {
  return {
    departments: organizationData.departments,
    benchmarks: industryBenchmarks,
  };
};
