import { NextRequest, NextResponse } from "next/server";
import getMongoClient from "@/lib/mongodb";
import { getTicketPrice } from "@/lib/shows";
import { sendTicketConfirmation } from "@/lib/mailer";

export async function POST(req: NextRequest) {
  const { name, email, show, tickets, isStudent, language } = await req.json();

  if (!name || !show || !tickets || isStudent === undefined) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const today = new Date().toISOString().split("T")[0];
  const isDayOf = show.isoDate === today;
  const pricePerTicket = getTicketPrice(isStudent, isDayOf, show.theater);
  const amount = tickets * pricePerTicket;

  const reservationId = String(Math.floor(100000 + Math.random() * 900000));

  const client = await getMongoClient();
  const db = client.db("losmutantes");
  const result = await db.collection("caja").insertOne({
    reservationId,
    name,
    email: email || null,
    show,
    tickets,
    isStudent,
    isDayOf,
    pricePerTicket,
    amount,
    language: language ?? "es",
    paymentMethod: "cash",
    status: "confirmed",
    createdAt: new Date(),
  });

  if (email) {
    try {
      await sendTicketConfirmation(
        email,
        name,
        show,
        tickets,
        amount,
        reservationId,
        result.insertedId.toString(),
        language ?? "es",
        isStudent
      );
    } catch (err) {
      console.error("Failed to send ticket email:", err);
    }
  }

  return NextResponse.json({ reservationId }, { status: 201 });
}
