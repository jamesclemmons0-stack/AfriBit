import { NextResponse } from "next/server";
import { getAllMarketPrices } from "@/lib/market";

export async function GET() {
  try {
    const prices = await getAllMarketPrices();

    return NextResponse.json(prices);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        message: "Unable to fetch market prices.",
      },
      {
        status: 500,
      }
    );
  }
}