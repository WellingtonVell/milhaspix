import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { Header } from "@/components/header";
import { OFFERS_KEYS } from "@/features/offers/api/keys";
import { fetchOffersData } from "@/features/offers/api/queries";
import { OffersList } from "@/features/offers/components/list";

export default async function Inicio() {
  const queryClient = new QueryClient();

  queryClient.prefetchQuery({
    queryKey: OFFERS_KEYS.lists(),
    queryFn: fetchOffersData,
  });

  return (
    <>
      <Header />
      <HydrationBoundary state={dehydrate(queryClient)}>
        <OffersList />
      </HydrationBoundary>
    </>
  );
}
