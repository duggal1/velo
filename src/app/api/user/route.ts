import { NextRequest, NextResponse } from "next/server";
import { createOrGetUser } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { clerkId, email } = body;

    if (!clerkId || !email) {
      return NextResponse.json(
        { error: "Missing clerkId or email" },
        { status: 400 }
      );
    }

    console.log("Creating or getting user:", { clerkId, email });
    const user = await createOrGetUser(clerkId, email);

    return NextResponse.json({ user });
  } catch (err) {
    console.error("Failed to create user", err);
    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 }
    );
  }
}
