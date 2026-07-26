import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAuthCookie } from "@/lib/cookies";
import { verifyToken } from "@/lib/auth";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const withdrawal = await prisma.withdrawal.findUnique({
    where: {
      id: Number(id),
    },
  });

  if (!withdrawal) {
    return NextResponse.json(
      { error: "Withdrawal not found" },
      { status: 404 }
    );
  }

  return NextResponse.json(withdrawal);
}

export async function PATCH(
  req: NextRequest,
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

    if (!payload) {
      return NextResponse.json(
        { error: "Invalid token" },
        { status: 401 }
      );
    }

    const admin = await prisma.user.findUnique({
      where: {
        id: payload.userId,
      },
    });

    if (!admin || admin.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      );
    }

    const { id } = await params;
    const { status } = await req.json();

    if (!["APPROVED", "REJECTED"].includes(status)) {
      return NextResponse.json(
        { error: "Invalid status." },
        { status: 400 }
      );
    }

    const withdrawal = await prisma.withdrawal.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!withdrawal) {
      return NextResponse.json(
        { error: "Withdrawal not found." },
        { status: 404 }
      );
    }

    if (withdrawal.status !== "PENDING") {
      return NextResponse.json(
        { error: "Withdrawal already processed." },
        { status: 400 }
      );
    }

    await prisma.$transaction(async (tx) => {
      await tx.withdrawal.update({
        where: {
          id: withdrawal.id,
        },
        data: {
          status,
        },
      });

      if (status === "APPROVED") {
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
      }
    });

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Server error." },
      { status: 500 }
    );
  }
}