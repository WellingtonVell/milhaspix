import { NextResponse } from "next/server";

interface Offer {
  offerId: string;
  offerStatus: string;
  loyaltyProgram: string;
  offerType: string;
  accountLogin: string;
  createdAt: string;
  availableQuantity: number;
}

interface OffersResponse {
  totalQuantityOffers: number;
  offers: Offer[];
}

export async function GET() {
  try {
    const response = await fetch(
      "https://api.milhaspix.com/simulate-offers-list",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        next: { revalidate: 300 },
      },
    );

    if (!response.ok) {
      throw new Error(`External API responded with status: ${response.status}`);
    }

    const data: OffersResponse = await response.json();

    return NextResponse.json(data, {
      status: 200,
      headers: {
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
      },
    });
  } catch (error) {
    console.error("Error fetching offers list:", error);

    return NextResponse.json(
      {
        error: "Failed to fetch offers list",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
