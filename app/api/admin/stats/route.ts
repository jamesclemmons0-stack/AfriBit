import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import { getAuthCookie } from "../../../../lib/cookies";
import { verifyToken } from "../../../../lib/auth";

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

    const [
      totalUsers,
      totalDeposits,
      pendingDeposits,
      approvedDeposits,
      rejectedDeposits,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.deposit.count(),
      prisma.deposit.count({
        where: {
          status: "PENDING",
        },
      }),
      prisma.deposit.count({
        where: {
          status: "APPROVED",
        },
      }),
      prisma.deposit.count({
        where: {
          status: "REJECTED",
        },
      }),
    ]);

    return NextResponse.json({
      totalUsers,
      totalDeposits,
      pendingDeposits,
      approvedDeposits,
      rejectedDeposits,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { message: "Failed to load statistics." },
      { status: 500 }
    );
  }
}