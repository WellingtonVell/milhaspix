import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

interface RankingItem {
  mile_value: number;
  description: string;
  position: number;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const mileValue = searchParams.get("mile_value");

    if (!mileValue) {
      return NextResponse.json(
        { error: "mile_value parameter is required" },
        { status: 400 },
      );
    }

    // Validate that mile_value is a valid number
    const numericMileValue = parseFloat(mileValue);
    if (Number.isNaN(numericMileValue)) {
      return NextResponse.json(
        { error: "mile_value must be a valid number" },
        { status: 400 },
      );
    }

    const response = await fetch(
      `https://api.milhaspix.com/simulate-ranking?mile_value=${numericMileValue}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    if (!response.ok) {
      throw new Error(`External API responded with status: ${response.status}`);
    }

    const data: RankingItem[] = await response.json();

    return NextResponse.json(data, {
      status: 200,
      headers: {
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
      },
    });
  } catch (error) {
    console.error("Error fetching ranking data:", error);

    return NextResponse.json(
      {
        error: "Failed to fetch ranking data",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
