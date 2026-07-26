import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAuthCookie } from "../../../lib/cookies";
import { verifyToken } from "../../../lib/auth";

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

    const deposits = await prisma.deposit.findMany({
      where: {
        userId: payload.userId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(deposits);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { message: "Failed to load deposits." },
      { status: 500 }
    );
  }
}