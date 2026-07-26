import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAuthCookie } from "@/lib/cookies";
import { verifyToken } from "@/lib/auth";
import {
  calculateQuantity,
} from "@/lib/trading";

export async function GET() {
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

    const trades = await prisma.trade.findMany({
      where: {
        userId: payload.userId,
        status: "OPEN",
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(trades);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { message: "Failed to fetch trades." },
      { status: 500 }
    );
  }
}

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

    const {
      pair,
      side,
      amount,
      entryPrice,
    } = await request.json();

    if (!pair || !side) {
      return NextResponse.json(
        { message: "Missing trade information." },
        { status: 400 }
      );
    }

    if (!amount || amount <= 0) {
      return NextResponse.json(
        { message: "Invalid trade amount." },
        { status: 400 }
      );
    }

    if (!entryPrice || entryPrice <= 0) {
      return NextResponse.json(
        { message: "Invalid market price." },
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

    if (wallet.balance < amount) {
      return NextResponse.json(
        { message: "Insufficient wallet balance." },
        { status: 400 }
      );
    }

    const quantity = calculateQuantity(
      amount,
      entryPrice
    );

    const result = await prisma.$transaction(async (tx) => {
      const trade = await tx.trade.create({
        data: {
          pair,
          side,
          quantity,
          entryPrice,
          currentPrice: entryPrice,
          pnl: 0,
          status: "OPEN",
          userId: payload.userId,
        },
      });

      await tx.wallet.update({
        where: {
          userId: payload.userId,
        },
        data: {
          balance: {
            decrement: amount,
          },
        },
      });

      await tx.transaction.create({
        data: {
          userId: payload.userId,
          type: "TRADE_OPEN",
          amount,
          description: `Opened ${side} ${pair}`,
        },
      });

      return trade;
    });

    return NextResponse.json(result);

  } catch (error: any) {
    console.error(error);

    return NextResponse.json(
      {
        message: error.message ?? "Internal Server Error",
      },
      {
        status: 500,
      }
    );
  }
}