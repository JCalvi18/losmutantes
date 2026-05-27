import { NextRequest, NextResponse } from "next/server";
import getMongoClient from "@/lib/mongodb";
import { getTicketPrice } from "@/lib/shows";

export async function POST(req: NextRequest) {
  const { show, tickets, isStudent } = await req.json();

  if (!show || !tickets || isStudent === undefined) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }
  if (tickets < 1 || tickets > 10) {
    return NextResponse.json({ error: "Invalid ticket count" }, { status: 400 });
  }

  const pricePerTicket = getTicketPrice(isStudent, true, show.theater);
  const amount = tickets * pricePerTicket;

  const client = await getMongoClient();
  const db = client.db("losmutantes");
  await db.collection("taquilla").insertOne({
    show,
    tickets,
    isStudent,
    pricePerTicket,
    amount,
    status: "confirmed",
    createdAt: new Date(),
  });

  return NextResponse.json({ ok: true }, { status: 201 });
}
