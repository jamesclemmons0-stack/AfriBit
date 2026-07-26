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

    if (payload.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Access denied" },
        { status: 403 }
      );
    }

    const users = await prisma.user.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        wallets: true,
      },
    });

    return NextResponse.json(users);

  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed to fetch users." },
      { status: 500 }
    );
  }
}