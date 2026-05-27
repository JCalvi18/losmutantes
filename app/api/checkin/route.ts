import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import getMongoClient from "@/lib/mongodb";

async function findReservation(mongoId: string) {
  let oid: ObjectId;
  try {
    oid = new ObjectId(mongoId);
  } catch {
    return null;
  }

  const client = await getMongoClient();
  const db = client.db("losmutantes");

  for (const collName of ["reservations", "caja"]) {
    const doc = await db.collection(collName).findOne({ _id: oid });
    if (doc) return { doc, collName, db };
  }
  return null;
}

export async function GET(req: NextRequest) {
  const mongoId = req.nextUrl.searchParams.get("mongoId") ?? "";
  if (!mongoId) return NextResponse.json({ error: "Missing mongoId" }, { status: 400 });

  let oid: ObjectId;
  try {
    oid = new ObjectId(mongoId);
  } catch {
    return NextResponse.json({ found: false, error: "invalid_id" });
  }

  const client = await getMongoClient();
  const db = client.db("losmutantes");

  for (const collName of ["reservations", "caja"]) {
    const doc = await db.collection(collName).findOne({ _id: oid });
    if (doc) {
      return NextResponse.json({
        found: true,
        collection: collName,
        status: doc.status,
        name: doc.name,
        show: doc.show,
        tickets: doc.tickets,
        isStudent: doc.isStudent,
        checkedInAt: doc.checkedInAt ?? null,
      });
    }
  }

  return NextResponse.json({ found: false });
}

export async function PATCH(req: NextRequest) {
  const { mongoId } = await req.json();
  if (!mongoId) return NextResponse.json({ error: "Missing mongoId" }, { status: 400 });

  let oid: ObjectId;
  try {
    oid = new ObjectId(mongoId);
  } catch {
    return NextResponse.json({ error: "invalid_id" }, { status: 400 });
  }

  const client = await getMongoClient();
  const db = client.db("losmutantes");
  const result = await db.collection("reservations").updateOne(
    { _id: oid, status: "pending_payment" },
    { $set: { status: "check_in", checkedInAt: new Date() } }
  );

  if (result.matchedCount === 0) {
    return NextResponse.json({ error: "not_found_or_wrong_status" }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}

export async function POST(req: NextRequest) {
  const { mongoId } = await req.json();
  if (!mongoId) return NextResponse.json({ error: "Missing mongoId" }, { status: 400 });

  const hit = await findReservation(mongoId);
  if (!hit) return NextResponse.json({ error: "invalid_id_or_not_found" }, { status: 404 });

  const { doc, collName, db } = hit;

  if (doc.status === "checked_in") {
    return NextResponse.json(
      { alreadyCheckedIn: true, checkedInAt: doc.checkedInAt },
      { status: 409 }
    );
  }

  await db.collection(collName).updateOne(
    { _id: doc._id },
    { $set: { status: "checked_in", checkedInAt: new Date() } }
  );

  return NextResponse.json({ ok: true });
}
