import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAllMarketPrices } from "@/lib/market";
import { calculatePnL } from "@/lib/trading";

export async function GET() {
  try {
    const prices = await getAllMarketPrices();

    const openTrades = await prisma.trade.findMany({
      where: {
        status: "OPEN",
      },
    });

    for (const trade of openTrades) {
      let currentPrice = trade.currentPrice;

      switch (trade.pair) {
        case "BTC/USDT":
          currentPrice = prices.BTCUSDT;
          break;

        case "ETH/USDT":
          currentPrice = prices.ETHUSDT;
          break;

        case "SOL/USDT":
          currentPrice = prices.SOLUSDT;
          break;

        case "BNB/USDT":
          currentPrice = prices.BNBUSDT;
          break;
      }

      const pnl = calculatePnL(
        trade.side,
        trade.entryPrice,
        currentPrice,
        trade.quantity
      );

      await prisma.trade.update({
        where: {
          id: trade.id,
        },
        data: {
          currentPrice,
          pnl,
        },
      });
    }

    return NextResponse.json({
      message: "Live prices updated.",
    });

  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        message: "Failed to update trades.",
      },
      {
        status: 500,
      }
    );
  }
}