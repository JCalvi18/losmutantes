import { NextResponse } from "next/server";
import getMongoClient from "@/lib/mongodb";
import { SHOWS } from "@/lib/shows";

function getRelevantShowDate(): string {
  const today = new Date().toISOString().split("T")[0];
  if (SHOWS.some((s) => s.isoDate === today)) return today;
  const next = SHOWS.filter((s) => s.isoDate > today).sort((a, b) =>
    a.isoDate.localeCompare(b.isoDate)
  )[0];
  return next?.isoDate ?? today;
}

export async function GET() {
  const showDate = getRelevantShowDate();
  const client = await getMongoClient();
  const db = client.db("losmutantes");
  const docs = await db
    .collection("reservations")
    .find({ status: "pending_payment" })
    .project({ name: 1, reservationId: 1, tickets: 1, isStudent: 1, "show.isoDate": 1, _id: 1 })
    .toArray();
  const entries = docs.map((doc) => ({
    mongoId: doc._id.toString(),
    name: doc.name,
    reservationId: doc.reservationId,
    tickets: doc.tickets,
    isStudent: doc.isStudent,
    showIsoDate: doc.show?.isoDate ?? "",
  }));
  return NextResponse.json({ entries, showDate });
}
