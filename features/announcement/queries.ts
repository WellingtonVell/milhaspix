import { useQuery } from "@tanstack/react-query";
import type { RankingItem } from "@/features/announcement/types";

/**
 * Fetches competitive ranking data for mile pricing
 * @param mileValue - Price per thousand miles to compare against competitors
 * @returns Promise resolving to array of ranking items with competitor data
 * @throws {Error} When API request fails or returns non-200 status
 */
const fetchRankingData = async (mileValue: number): Promise<RankingItem[]> => {
  const response = await fetch(`/api/simulate-ranking?mile_value=${mileValue}`);

  if (!response.ok) {
    throw new Error(`Failed to fetch ranking data: ${response.status}`);
  }

  return response.json();
};

/**
 * React Query hook for fetching and caching mile pricing ranking data
 * Automatically refetches when mile value changes and caches results for performance
 * @param mileValue - Price per thousand miles (enables query only when > 0)
 * @returns Query result with ranking data, loading state, and error handling
 */
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
