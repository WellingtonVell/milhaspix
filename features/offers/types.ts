export type Offer = {
  offerId: string;
  offerStatus: "Inativo" | "Ativa" | "Em Utilizacao";
  loyaltyProgram: string;
  offerType: string;
  accountLogin: string;
  createdAt: string;
  availableQuantity: number;
};

export type OffersResponse = {
  totalQuantityOffers: number;
  offers: Offer[];
};
