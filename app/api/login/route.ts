import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import prisma from "@/lib/prisma";
import { generateToken } from "../../../lib/auth";
import { setAuthCookie } from "../../../lib/cookies";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
      include: {
        wallets: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { message: "Invalid email or password." },
        { status: 401 }
      );
    }

    const passwordMatches = await bcrypt.compare(
      password,
      user.password
    );

    if (!passwordMatches) {
      return NextResponse.json(
        { message: "Invalid email or password." },
        { status: 401 }
      );
    }

    if (!user.isActive) {
  return NextResponse.json(
    { message: "Your account has been suspended. Please contact support." },
    { status: 403 }
  );
}

    // Create a JWT
const token = generateToken({
  userId: user.id,
  email: user.email,
  name: user.name,
  role: user.role,
});

    // Store it in a secure HTTP-only cookie
    await setAuthCookie(token);

    return NextResponse.json({
      message: "Login successful.",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        wallets: user.wallets,
      },
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { message: "Login failed." },
      { status: 500 }
    );
  }
}