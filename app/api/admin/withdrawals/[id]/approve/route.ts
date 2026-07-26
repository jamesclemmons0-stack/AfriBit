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
    const withdrawalId = Number(id);

    if (Number.isNaN(withdrawalId)) {
      return NextResponse.json(
        { error: "Invalid withdrawal ID." },
        { status: 400 }
      );
    }

    const withdrawal = await prisma.withdrawal.findUnique({
      where: {
        id: withdrawalId,
      },
    });

    if (!withdrawal) {
      return NextResponse.json(
        { error: "Withdrawal not found." },
        { status: 404 }
      );
    }

    if (withdrawal.status === "APPROVED") {
      return NextResponse.json(
        { error: "Withdrawal has already been approved." },
        { status: 400 }
      );
    }

    if (withdrawal.status === "REJECTED") {
      return NextResponse.json(
        { error: "Withdrawal has already been rejected." },
        { status: 400 }
      );
    }

    const wallet = await prisma.wallet.findUnique({
      where: {
        userId: withdrawal.userId,
      },
    });

    if (!wallet) {
      return NextResponse.json(
        { error: "User wallet not found." },
        { status: 404 }
      );
    }

    if (wallet.balance < withdrawal.amount) {
      return NextResponse.json(
        { error: "Insufficient wallet balance to approve this withdrawal." },
        { status: 400 }
      );
    }

    await prisma.$transaction(async (tx) => {
      await tx.withdrawal.update({
        where: {
          id: withdrawalId,
        },
        data: {
          status: "APPROVED",
        },
      });

      await tx.wallet.update({
        where: {
          userId: withdrawal.userId,
        },
        data: {
          balance: {
            decrement: withdrawal.amount,
          },
        },
      });
    });

    return NextResponse.json({
      success: true,
      message: "Withdrawal approved successfully.",
    });
  } catch (error) {
    console.error("Approve Withdrawal Error:", error);

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