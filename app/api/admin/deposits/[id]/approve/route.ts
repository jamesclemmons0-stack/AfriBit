import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAuthCookie } from "@/lib/cookies";
import { verifyToken } from "@/lib/auth";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = await getAuthCookie();

    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const payload = verifyToken(token);

    if (!payload || payload.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      );
    }

    const { id } = await params;
    const depositId = Number(id);

    if (Number.isNaN(depositId)) {
      return NextResponse.json(
        { error: "Invalid deposit ID." },
        { status: 400 }
      );
    }

    const deposit = await prisma.deposit.findUnique({
      where: {
        id: depositId,
      },
    });

    if (!deposit) {
      return NextResponse.json(
        { error: "Deposit not found." },
        { status: 404 }
      );
    }

    if (deposit.status === "APPROVED") {
      return NextResponse.json(
        { error: "Deposit already approved." },
        { status: 400 }
      );
    }

    await prisma.$transaction(async (tx) => {
      // Approve deposit
      await tx.deposit.update({
        where: {
          id: depositId,
        },
        data: {
          status: "APPROVED",
        },
      });

      // Credit wallet
      await tx.wallet.update({
        where: {
          userId: deposit.userId,
        },
        data: {
          balance: {
            increment: deposit.amount,
          },
        },
      });

      // Record transaction
      await tx.transaction.create({
        data: {
          userId: deposit.userId,
          type: "DEPOSIT",
          amount: deposit.amount,
          description: `Deposit approved (${deposit.network})`,
        },
      });
    });

    return NextResponse.json({
      success: true,
      message: "Deposit approved successfully.",
    });
  } catch (error) {
    console.error("Approve Deposit Error:", error);

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