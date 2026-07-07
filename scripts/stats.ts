import getMongoClient from "../lib/mongodb";
import { SHOWS } from "../lib/shows";

interface ShowStats {
  isoDate: string;
  label: string;
  theater: string;
  reservations: {
    pending: { count: number; tickets: number; amount: number };
    paid: { count: number; tickets: number; amount: number };
    checkedIn: { count: number; tickets: number; amount: number };
  };
  caja: {
    confirmed: { count: number; tickets: number; amount: number };
    checkedIn: { count: number; tickets: number; amount: number };
  };
  taquilla: { count: number; tickets: number; amount: number };
}

interface SaleDoc {
  tickets: number;
  amount: number;
  status?: string;
  show?: { isoDate?: string };
}

function empty() {
  return { count: 0, tickets: 0, amount: 0 };
}

function add(acc: ReturnType<typeof empty>, doc: { tickets: number; amount: number }) {
  acc.count++;
  acc.tickets += doc.tickets;
  acc.amount += doc.amount;
}

function fmt(n: number) {
  return n.toFixed(2).padStart(8);
}

function row(label: string, s: ReturnType<typeof empty>) {
  if (s.count === 0) return;
  console.log(
    `    ${label.padEnd(28)} ${String(s.count).padStart(4)} reservas  ${String(s.tickets).padStart(4)} entradas  ${fmt(s.amount)} €`
  );
}

async function main() {
  const client = await getMongoClient();
  const db = client.db("losmutantes");

  const showDates = SHOWS.map((s) => s.isoDate);

  const statsMap = new Map<string, ShowStats>();
  for (const show of SHOWS) {
    statsMap.set(show.isoDate, {
      isoDate: show.isoDate,
      label: `${show.city} — ${show.date}`,
      theater: show.theater,
      reservations: {
        pending: empty(),
        paid: empty(),
        checkedIn: empty(),
      },
      caja: {
        confirmed: empty(),
        checkedIn: empty(),
      },
      taquilla: empty(),
    });
  }

  // ── reservations (online / bank transfer) ────────────────────────────────
  const reservationDocs = await db
    .collection<SaleDoc>("reservations")
    .find({ "show.isoDate": { $in: showDates } })
    .toArray();

  for (const doc of reservationDocs) {
    const s = doc.show?.isoDate ? statsMap.get(doc.show.isoDate) : undefined;
    if (!s) continue;
    if (doc.status === "pending_payment") add(s.reservations.pending, doc);
    else if (doc.status === "paid") add(s.reservations.paid, doc);
    else if (doc.status === "checked_in") add(s.reservations.checkedIn, doc);
  }

  // ── caja (cash sales via /registro) ─────────────────────────────────────
  const cajaDocs = await db
    .collection<SaleDoc>("caja")
    .find({ "show.isoDate": { $in: showDates } })
    .toArray();

  for (const doc of cajaDocs) {
    const s = doc.show?.isoDate ? statsMap.get(doc.show.isoDate) : undefined;
    if (!s) continue;
    if (doc.status === "checked_in") add(s.caja.checkedIn, doc);
    else add(s.caja.confirmed, doc);
  }

  // ── taquilla (on-site sales via /checkin) ────────────────────────────────
  const taquillaDocs = await db
    .collection<SaleDoc>("taquilla")
    .find({ "show.isoDate": { $in: showDates } })
    .toArray();

  for (const doc of taquillaDocs) {
    const s = doc.show?.isoDate ? statsMap.get(doc.show.isoDate) : undefined;
    if (!s) continue;
    add(s.taquilla, doc);
  }

  // ── print ────────────────────────────────────────────────────────────────
  const totals = {
    tickets: 0,
    amount: 0,
    checkedIn: 0,
  };

  const sorted = [...statsMap.values()].sort((a, b) =>
    a.isoDate.localeCompare(b.isoDate)
  );

  for (const s of sorted) {
    const showTickets =
      s.reservations.pending.tickets +
      s.reservations.paid.tickets +
      s.reservations.checkedIn.tickets +
      s.caja.confirmed.tickets +
      s.caja.checkedIn.tickets +
      s.taquilla.tickets;

    const showAmount =
      s.reservations.pending.amount +
      s.reservations.paid.amount +
      s.reservations.checkedIn.amount +
      s.caja.confirmed.amount +
      s.caja.checkedIn.amount +
      s.taquilla.amount;

    const showCheckedIn =
      s.reservations.checkedIn.tickets +
      s.caja.checkedIn.tickets;

    totals.tickets += showTickets;
    totals.amount += showAmount;
    totals.checkedIn += showCheckedIn;

    console.log(`\n${"─".repeat(72)}`);
    console.log(`  ${s.label}  [${s.theater}]`);
    console.log(`${"─".repeat(72)}`);

    console.log("  Online (transferencia bancaria):");
    row("  Pendiente de pago", s.reservations.pending);
    row("  Pagado (QR enviado)", s.reservations.paid);
    row("  Checked-in", s.reservations.checkedIn);

    console.log("  Caja (efectivo, /registro):");
    row("  Confirmado (QR enviado)", s.caja.confirmed);
    row("  Checked-in", s.caja.checkedIn);

    console.log("  Taquilla (en sitio, /checkin):");
    row("  Vendido en puerta", s.taquilla);

    console.log(
      `\n  TOTAL SHOW: ${showTickets} entradas  /  ${showAmount.toFixed(2)} €` +
        (showCheckedIn > 0 ? `  (${showCheckedIn} ya en sala)` : "")
    );
  }

  console.log(`\n${"═".repeat(72)}`);
  console.log(
    `  TOTAL GLOBAL: ${totals.tickets} entradas  /  ${totals.amount.toFixed(2)} €  /  ${totals.checkedIn} checked-in`
  );
  console.log(`${"═".repeat(72)}\n`);

  await client.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
