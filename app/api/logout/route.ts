import { NextResponse } from "next/server";
import { removeAuthCookie } from "../../../lib/cookies";

export async function POST() {
  try {
    await removeAuthCookie();

    return NextResponse.json({
      message: "Logged out successfully.",
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { message: "Logout failed." },
      { status: 500 }
    );
  }
}