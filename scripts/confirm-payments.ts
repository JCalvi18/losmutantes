import getMongoClient from "../lib/mongodb";
import { sendPaymentConfirmed } from "../lib/mailer";

// ─── Edit this list before running ───────────────────────────────────────────
const RESERVATION_IDS: string[] = [
  "550710",
  "523583",
  "550542",
  "516990",
  "443530",
  "284953",
  "326391",
  "675693",
  "426929",
  "760887",
  "850137",
  "133818",
  "818962",
  "117430",
];
// ─────────────────────────────────────────────────────────────────────────────

async function main() {
  if (RESERVATION_IDS.length === 0) {
    console.error("No reservation IDs provided. Edit RESERVATION_IDS in the script.");
    process.exit(1);
  }

  const client = await getMongoClient();
  const db = client.db("losmutantes");
  const col = db.collection("reservations");

  for (const id of RESERVATION_IDS) {
    const reservation = await col.findOne({ reservationId: id });

    if (!reservation) {
      console.warn(`[SKIP] Not found: ${id}`);
      continue;
    }

    if (reservation.status === "paid") {
      console.log(`[SKIP] Already paid: ${id}`);
      continue;
    }

    await col.updateOne(
      { reservationId: id },
      { $set: { status: "paid", paidAt: new Date() } }
    );

    await sendPaymentConfirmed(
      reservation.email,
      reservation.name,
      reservation.show,
      reservation.tickets,
      reservation.amount,
      reservation.reservationId,
      reservation._id.toString(),
      reservation.language ?? "es",
      reservation.isStudent ?? false
    );

    console.log(`[OK] Confirmed and emailed: ${id} → ${reservation.email}`);
  }

  await client.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
