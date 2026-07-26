import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAuthCookie } from "@/lib/cookies";
import { verifyToken } from "@/lib/auth";

export async function GET() {
  try {
    const token = await getAuthCookie();

    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const payload = verifyToken(token);

    if (!payload) {
      return NextResponse.json(
        { error: "Invalid token" },
        { status: 401 }
      );
    }

    const wallet = await prisma.wallet.findUnique({
      where: {
        userId: payload.userId,
      },
    });

    const openTrades = await prisma.trade.count({
      where: {
        userId: payload.userId,
        status: "OPEN",
      },
    });

    const closedTrades = await prisma.trade.count({
      where: {
        userId: payload.userId,
        status: "CLOSED",
      },
    });

    const deposits = await prisma.deposit.aggregate({
      _sum: {
        amount: true,
      },
      where: {
        userId: payload.userId,
        status: "APPROVED",
      },
    });

    const withdrawals = await prisma.withdrawal.aggregate({
      _sum: {
        amount: true,
      },
      where: {
        userId: payload.userId,
        status: "APPROVED",
      },
    });

    return NextResponse.json({
      balance: wallet?.balance ?? 0,
      totalDeposits: deposits._sum.amount ?? 0,
      totalWithdrawals: withdrawals._sum.amount ?? 0,
      openTrades,
      closedTrades,
    });

  } catch (error) {

    console.error(error);

    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}