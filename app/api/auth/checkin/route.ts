import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { password } = await req.json();

  if (!password) {
    return NextResponse.json({ error: "Missing password" }, { status: 400 });
  }

  const correct = process.env.CHECKIN_PASSWORD;
  if (!correct) {
    console.error("CHECKIN_PASSWORD env var is not set");
    return NextResponse.json({ error: "Server misconfigured" }, { status: 500 });
  }

  if (password !== correct) {
    return NextResponse.json({ error: "Incorrect password" }, { status: 401 });
  }

  return NextResponse.json({ ok: true }, { status: 200 });
}
