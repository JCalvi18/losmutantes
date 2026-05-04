import { NextRequest, NextResponse } from "next/server";
import getMongoClient from "@/lib/mongodb";
import { sendConfirmation } from "@/lib/mailer";
import { getTicketPrice } from "@/lib/shows";

export async function POST(req: NextRequest) {
  const { name, email, show, tickets, isStudent, paypalOrderId } = await req.json();

  if (!name || !email || !show || !tickets || !paypalOrderId || isStudent === undefined) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const today = new Date().toISOString().split("T")[0];
  const isDayOf = show.isoDate === today;
  const pricePerTicket = getTicketPrice(isStudent, isDayOf);
  const amount = tickets * pricePerTicket;

  const client = await getMongoClient();
  const db = client.db("losmutantes");
  const result = await db.collection("reservations").insertOne({
    name,
    email,
    show,
    tickets,
    isStudent,
    isDayOf,
    pricePerTicket,
    amount,
    paypalOrderId,
    status: "confirmed",
    createdAt: new Date(),
  });

  const reservationId = result.insertedId.toString();

  try {
    await sendConfirmation(email, name, show, tickets, amount, reservationId);
  } catch (err) {
    console.error("Failed to send confirmation email:", err);
  }

  return NextResponse.json({ reservationId }, { status: 201 });
}
