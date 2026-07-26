import { getMarketPrice } from "@/lib/market";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAuthCookie } from "@/lib/cookies";
import { verifyToken } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const token = await getAuthCookie();

    if (!token) {
      return NextResponse.json(
        { message: "Not authenticated." },
        { status: 401 }
      );
    }

    const payload = verifyToken(token);

    if (!payload) {
      return NextResponse.json(
        { message: "Invalid session." },
        { status: 401 }
      );
    }

    const { id } = await request.json();

    const trade = await prisma.trade.findUnique({
      where: {
        id,
      },
    });

    if (!trade) {
      return NextResponse.json(
        { message: "Trade not found." },
        { status: 404 }
      );
    }

    if (trade.userId !== payload.userId) {
      return NextResponse.json(
        { message: "Unauthorized." },
        { status: 403 }
      );
    }

    if (trade.status === "CLOSED") {
      return NextResponse.json(
        { message: "Trade already closed." },
        { status: 400 }
      );
    }

    const wallet = await prisma.wallet.findUnique({
      where: {
        userId: payload.userId,
      },
    });

    if (!wallet) {
      return NextResponse.json(
        { message: "Wallet not found." },
        { status: 404 }
      );
    }

    const exitPrice = await getMarketPrice(trade.pair);

    let pnl = 0;

    if (trade.side === "BUY") {
      pnl = (exitPrice - trade.entryPrice) * trade.quantity;
    } else {
      pnl = (trade.entryPrice - exitPrice) * trade.quantity;
    }

    const investedAmount = trade.quantity * trade.entryPrice;

    await prisma.$transaction(async (tx) => {
      await tx.trade.update({
        where: {
          id: trade.id,
        },
        data: {
          currentPrice: exitPrice,
          exitPrice,
          pnl,
          status: "CLOSED",
          closedAt: new Date(),
        },
      });

      await tx.wallet.update({
        where: {
          userId: payload.userId,
        },
        data: {
          balance: {
            increment: investedAmount + pnl,
          },
        },
      });

      await tx.transaction.create({
        data: {
          userId: payload.userId,
          type: "TRADE_CLOSE",
          amount: investedAmount + pnl,
          description: `Closed ${trade.side} ${trade.pair}`,
        },
      });
    });

    return NextResponse.json({
      message: "Trade closed successfully.",
      exitPrice,
      pnl,
    });
  } catch (error: any) {
    console.error(error);

    return NextResponse.json(
      {
        message: error.message || "Failed to close trade.",
      },
      {
        status: 500,
      }
    );
  }
}