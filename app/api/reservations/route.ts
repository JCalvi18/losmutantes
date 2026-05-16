import { NextRequest, NextResponse } from "next/server";
import getMongoClient from "@/lib/mongodb";
import { sendConfirmation } from "@/lib/mailer";
import { getTicketPrice } from "@/lib/shows";

export async function POST(req: NextRequest) {
  const { name, email, show, tickets, isStudent, newsletter, language } = await req.json();

  if (!name || !email || !show || !tickets || isStudent === undefined) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const today = new Date().toISOString().split("T")[0];
  const isDayOf = show.isoDate === today;
  const pricePerTicket = getTicketPrice(isStudent, isDayOf, show.theater);
  const amount = tickets * pricePerTicket;

  const reservationId = String(Math.floor(100000 + Math.random() * 900000));

  const client = await getMongoClient();
  const db = client.db("losmutantes");
  await db.collection("reservations").insertOne({
    reservationId,
    name,
    email,
    show,
    tickets,
    isStudent,
    isDayOf,
    pricePerTicket,
    amount,
    newsletter: newsletter ?? false,
    language: language ?? "es",
    status: "pending_payment",
    createdAt: new Date(),
  });

  try {
    await sendConfirmation(email, name, show, tickets, amount, reservationId, language ?? "es", isStudent);
  } catch (err) {
    console.error("Failed to send confirmation email:", err);
  }

  return NextResponse.json({ reservationId }, { status: 201 });
}
