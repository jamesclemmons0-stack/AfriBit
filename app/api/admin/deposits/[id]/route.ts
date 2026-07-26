import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAuthCookie } from "@/lib/cookies";
import { verifyToken } from "@/lib/auth";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const admin = await prisma.user.findUnique({
      where: {
        id: payload.userId,
      },
    });

    if (!admin || admin.role !== "ADMIN") {
      return NextResponse.json(
        { message: "Access denied." },
        { status: 403 }
      );
    }

    const { id } = await params;
    const depositId = Number(id);

    if (Number.isNaN(depositId)) {
      return NextResponse.json(
        { message: "Invalid deposit ID." },
        { status: 400 }
      );
    }

    const { status } = await request.json();

    if (!["APPROVED", "REJECTED"].includes(status)) {
      return NextResponse.json(
        { message: "Invalid status." },
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
        { message: "Deposit not found." },
        { status: 404 }
      );
    }

    if (deposit.status !== "PENDING") {
      return NextResponse.json(
        { message: "Deposit has already been processed." },
        { status: 400 }
      );
    }

    await prisma.$transaction(async (tx) => {
      await tx.deposit.update({
        where: {
          id: deposit.id,
        },
        data: {
          status,
        },
      });

      if (status === "APPROVED") {
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

        // Create transaction record if the model exists
        await tx.transaction.create({
          data: {
            userId: deposit.userId,
            type: "DEPOSIT",
            amount: deposit.amount,
            description: `Deposit approved (${deposit.network})`,
          },
        });
      }
    });

    return NextResponse.json({
      message: `Deposit ${status.toLowerCase()} successfully.`,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { message: "Something went wrong." },
      { status: 500 }
    );
  }
}