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
        { error: "Invalid token." },
        { status: 401 }
      );
    }

    const wallet = await prisma.wallet.findUnique({
      where: {
        userId: payload.userId,
      },
    });

    const approvedDeposits = await prisma.deposit.aggregate({
      _sum: {
        amount: true,
      },
      where: {
        userId: payload.userId,
        status: "APPROVED",
      },
    });

    const approvedWithdrawals = await prisma.withdrawal.aggregate({
      _sum: {
        amount: true,
      },
      where: {
        userId: payload.userId,
        status: "APPROVED",
      },
    });

    const pendingDeposits = await prisma.deposit.aggregate({
      _sum: {
        amount: true,
      },
      where: {
        userId: payload.userId,
        status: "PENDING",
      },
    });

    const pendingWithdrawals = await prisma.withdrawal.aggregate({
      _sum: {
        amount: true,
      },
      where: {
        userId: payload.userId,
        status: "PENDING",
      },
    });

    const transactions = await prisma.transaction.findMany({
      where: {
        userId: payload.userId,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 50,
    });

    return NextResponse.json({
      balance: wallet?.balance ?? 0,

      totalDeposits: approvedDeposits._sum.amount ?? 0,

      totalWithdrawals: approvedWithdrawals._sum.amount ?? 0,

      pendingDeposits: pendingDeposits._sum.amount ?? 0,

      pendingWithdrawals: pendingWithdrawals._sum.amount ?? 0,

      transactions,
    });
  } catch (error) {
    console.error("Wallet API Error:", error);

    return NextResponse.json(
      {
        error: "Internal server error.",
      },
      {
        status: 500,
      }
    );
  }
}