import { NextResponse } from "next/server";
import { getAuthCookie } from "../../../lib/cookies";
import { verifyToken } from "../../../lib/auth";
import prisma from "@/lib/prisma";
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

    const user = await prisma.user.findUnique({
      where: {
        id: payload.userId,
      },
      include: {
        wallets: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { message: "User not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      id: user.id,
      name: user.name,
      email: user.email,
      wallets: user.wallets,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { message: "Failed to fetch user." },
      { status: 500 }
    );
  }
}