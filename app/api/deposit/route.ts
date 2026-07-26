import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAuthCookie } from "../../../lib/cookies";
import { verifyToken } from "../../../lib/auth";

export async function POST(request: Request) {
  try {
    // Check authentication
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

    const { amount, network, txHash } = await request.json();

    if (!amount || amount <= 0) {
      return NextResponse.json(
        { message: "Please enter a valid amount." },
        { status: 400 }
      );
    }

    if (!txHash || txHash.trim().length < 10) {
      return NextResponse.json(
        { message: "Please enter a valid transaction hash." },
        { status: 400 }
      );
    }

    const deposit = await prisma.deposit.create({
      data: {
        amount,
        network,
        txHash,
        status: "PENDING",
        userId: payload.userId,
      },
    });

    return NextResponse.json(
      {
        message: "Deposit submitted successfully.",
        deposit,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { message: "Failed to submit deposit." },
      { status: 500 }
    );
  }
}