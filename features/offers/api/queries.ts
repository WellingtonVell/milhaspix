import { useQuery } from "@tanstack/react-query";
import { OFFERS_KEYS } from "@/features/offers/api/keys";
import type { OffersResponse } from "@/features/offers/types";

/**
 * Fetches offers data from the API
 * @returns Promise resolving to offers data
 * @throws {Error} When API request fails or returns non-200 status
 */
export const fetchOffersData = async (): Promise<OffersResponse> => {
  const response = await fetch(`/api/simulate-offers-list`);

  if (!response.ok) {
    throw new Error(`Failed to fetch offers data: ${response.status}`);
  }

  return response.json();
};

/**
 * React Query hook for fetching and caching offers data
 * Automatically refetches and caches results for performance
 * @returns Query result with offers data, loading state, and error handling
 */
export function useOffersData() {
  return useQuery({
    queryKey: OFFERS_KEYS.lists(),
    queryFn: () => fetchOffersData(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 1,
  });
}
