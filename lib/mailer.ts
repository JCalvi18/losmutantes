import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.ionos.de",
  port: 465,
  secure: true,
  auth: {
    user: process.env.IONOS_EMAIL,
    pass: process.env.IONOS_PASSWORD,
  },
});

type Language = "es" | "en" | "de";

const content = {
  es: {
    subject: "Reserva recibida — Los Mutantes",
    heading: "¡Reserva recibida!",
    greeting: (name: string) => `Hola <strong>${name}</strong>,`,
    intro:
      "Detalles de la reserva.",
    banktransfer: "Para confirmarla, realiza una transferencia bancaria con los siguientes datos:",
    fields: {
      show: "Función",
      date: "Fecha",
      tickets: "Entradas",
      total: "Total a transferir",
      reservationId: "ID de reserva (usar como referencia)",
      holder: "Titular",
      iban: "IBAN",
    },
    reference: (id: string) =>
      `Usa <strong>${id}</strong> como referencia de la transferencia para que podamos identificar tu pago.`,
    studentNote:
      "Recuerda presentar tu carnet de estudiante el día de la función.",
    footer:
      "Una vez recibido el pago, te enviaremos un mail de confirmaciòn. ¡Nos vemos en la función!",
    subfooter: "Los Mutantes — Teatro amateur en español, Universidad del Saarland",
  },
  en: {
    subject: "Reservation received — Los Mutantes",
    heading: "Reservation received!",
    greeting: (name: string) => `Hi <strong>${name}</strong>,`,
    intro:
      "Reservation details.",
    banktransfer:
      "To confirm it, please make a bank transfer using the details below:",
    fields: {
      show: "Show",
      date: "Date",
      tickets: "Tickets",
      total: "Amount to transfer",
      reservationId: "Reservation ID (use as payment reference)",
      holder: "Account holder",
      iban: "IBAN",
    },
    reference: (id: string) =>
      `Please use <strong>${id}</strong> as the transfer reference so we can identify your payment.`,
    studentNote:
      "Remember to bring your student ID on the day of the show.",
    footer:
      "Once we receive the payment, we will send you a confirmation email. See you at the show!",
    subfooter: "Los Mutantes — Amateur Spanish-language theatre, Saarland University",
  },
  de: {
    subject: "Reservierung erhalten — Los Mutantes",
    heading: "Reservierung erhalten!",
    greeting: (name: string) => `Hallo <strong>${name}</strong>,`,
    intro:
      "Reservierungsdetails.",
    banktransfer:
      "Um sie zu bestätigen, überweise bitte den Betrag mit folgenden Bankdaten:",
    fields: {
      show: "Vorstellung",
      date: "Datum",
      tickets: "Tickets",
      total: "Zu überweisender Betrag",
      reservationId: "Reservierungs-ID (als Verwendungszweck angeben)",
      holder: "Kontoinhaber",
      iban: "IBAN",
    },
    reference: (id: string) =>
      `Bitte gib <strong>${id}</strong> als Verwendungszweck an, damit wir deine Zahlung zuordnen können.`,
    studentNote:
      "Denk daran, deinen Studentenausweis am Vorstellungstag mitzubringen.",
    footer:
      "Sobald wir die Zahlung erhalten haben, schicken wir dir eine Bestätigungs-E-Mail. Bis zur Vorstellung!",
    subfooter: "Los Mutantes — Amateurtheater auf Spanisch, Universität des Saarlandes",
  },
};

const colors = {
  background: "#25683d",
  orange: "#f39019",
  blue: "#95d6f6",
  yellow: "#fde442",
};

function row(label: string, value: string, highlight = false) {
  const cellStyle = `padding:8px;border:1px solid ${colors.blue};color:${colors.yellow};${highlight ? `background:#1e5433;font-weight:bold;` : ""}`;
  return `
    <tr>
      <td style="${cellStyle}"><strong>${label}</strong></td>
      <td style="${cellStyle}font-family:monospace;">${value}</td>
    </tr>`;
}

export async function sendConfirmation(
  email: string,
  name: string,
  show: { city: string; theater: string; date: string },
  tickets: number,
  amount: number,
  reservationId: string,
  language: Language = "es",
  isStudent = false
) {
  const c = content[language] ?? content.es;
  const iban = process.env.BANK_IBAN ?? "";
  const holder = process.env.BANK_HOLDER ?? "";

  const html = `
    <div style="font-family:sans-serif;max-width:600px;margin:0 auto;background:${colors.background};padding:32px;border-radius:8px;">      
      <h1 style="color:${colors.orange};margin-top:0;">Laberinto</h1>
      <h2 style="color:${colors.orange};">${c.heading}</h2>
      <p style="color:${colors.yellow};">${c.greeting(name)}</p>
      <p style="color:${colors.yellow};">${c.intro}</p>
      <table style="border-collapse:collapse;width:100%;margin-top:12px;">
      ${row(c.fields.show, show.city)}
      ${row(c.fields.date, show.date)}
      ${row(c.fields.tickets, String(tickets))}      
      </table>
      <p style="color:${colors.yellow};">${c.banktransfer}</p>
      <table style="border-collapse:collapse;width:100%;margin-top:12px;">      
      ${row(c.fields.holder, holder)}
      ${row(c.fields.iban, iban)}
      ${row(c.fields.reservationId, reservationId, true)}
      ${row(c.fields.total, `€${amount.toFixed(2)}`)}
      </table>
      
      <p style="color:${colors.yellow};margin-top:20px;">${c.reference(reservationId)}</p>
      ${isStudent ? `<p style="color:#000;background:${colors.orange};padding:10px;border-radius:4px;margin-top:12px;">${c.studentNote}</p>` : ""}
      <p style="color:${colors.yellow};">${c.footer}</p>
      <p style="color:${colors.blue};font-size:12px;">${c.subfooter}</p>
    </div>
  `;

  await transporter.sendMail({
    from: `"Los Mutantes" <${process.env.IONOS_EMAIL}>`,
    to: email,
    subject: c.subject,
    html,
  });
}
