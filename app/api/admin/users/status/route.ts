import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAuthCookie } from "@/lib/cookies";
import { verifyToken } from "@/lib/auth";

export async function PATCH(request: Request) {
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
        { error: "Access denied" },
        { status: 403 }
      );
    }

    const { userId, isActive } = await request.json();

    if (payload.userId === userId) {
  return NextResponse.json(
    {
      error: "You cannot suspend or activate your own account.",
    },
    { status: 400 }
  );
}

    const user = await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        isActive,
      },
    });

    return NextResponse.json({
      message: "User status updated successfully.",
      user,
    });

  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed to update user status." },
      { status: 500 }
    );
  }
}