import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAuthCookie } from "@/lib/cookies";
import { verifyToken } from "@/lib/auth";

const MIN_WITHDRAWAL = 100;
const NETWORK = "ERC20";

export async function POST(req: NextRequest) {
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

    const body = await req.json();

    const amount = Number(body.amount);
    const walletAddress = body.walletAddress?.trim();

    if (!amount || isNaN(amount)) {
      return NextResponse.json(
        { error: "Please enter a valid withdrawal amount." },
        { status: 400 }
      );
    }

    if (amount < MIN_WITHDRAWAL) {
      return NextResponse.json(
        {
          error: `Minimum withdrawal amount is ${MIN_WITHDRAWAL} USDT.`,
        },
        { status: 400 }
      );
    }

    if (!walletAddress) {
      return NextResponse.json(
        { error: "Destination wallet address is required." },
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
        { error: "Wallet not found." },
        { status: 404 }
      );
    }

    if (wallet.balance < amount) {
      return NextResponse.json(
        { error: "Insufficient wallet balance." },
        { status: 400 }
      );
    }

    const withdrawal = await prisma.withdrawal.create({
      data: {
        amount,
        network: NETWORK,
        walletAddress,
        userId: payload.userId,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Withdrawal request submitted successfully.",
      withdrawal,
    });
  } catch (error) {
    console.error("Withdrawal Error:", error);

    return NextResponse.json(
      {
        error: "An unexpected server error occurred.",
      },
      { status: 500 }
    );
  }
}