import { useQuery } from "@tanstack/react-query";
import type { RankingItem } from "@/features/announcement/types";

const fetchRankingData = async (mileValue: number): Promise<RankingItem[]> => {
  const response = await fetch(`/api/simulate-ranking?mile_value=${mileValue}`);

  if (!response.ok) {
    throw new Error(`Failed to fetch ranking data: ${response.status}`);
  }

  return response.json();
};

export function useRankingData(mileValue: number | undefined) {
  return useQuery({
    queryKey: ["ranking", mileValue],
    queryFn: () => fetchRankingData(mileValue as number),
    enabled: !!mileValue && mileValue > 0,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 1,
  });
}
