import fs from "fs";
import path from "path";
import nodemailer from "nodemailer";
import getMongoClient from "../lib/mongodb";

// ─── Config ──────────────────────────────────────────────────────────────────
const DRY_RUN = false; // set to false to actually send emails
// ─────────────────────────────────────────────────────────────────────────────

type Language = "es" | "en" | "de";

const colors = {
  background: "#25683d",
  orange: "#f39019",
  blue: "#95d6f6",
  yellow: "#fde442",
};

const PRIVACY_URL = "https://www.losmutantes.de/datenschutz";

const socialIcons = `
  <table cellpadding="0" cellspacing="0" style="margin-top:20px;">
    <tr>
      <td style="padding-right:14px;">
        <a href="mailto:info@losmutantes.de" style="color:${colors.blue};text-decoration:none;" title="Email">
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="${colors.blue}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="2" y="4" width="20" height="16" rx="2"/>
            <path d="M22 7l-10 7L2 7"/>
          </svg>
        </a>
      </td>
      <td>
        <a href="https://www.instagram.com/losmutantesteatro" style="color:${colors.blue};text-decoration:none;" title="Instagram">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="${colors.blue}">
            <path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5Zm5 5a5 5 0 1 0 0 10 5 5 0 0 0 0-10Zm6.5-.75a1.25 1.25 0 1 0 0 2.5 1.25 1.25 0 0 0 0-2.5Zm-6.5 2A3 3 0 1 1 12 15a3 3 0 0 1 0-6Z"/>
          </svg>
        </a>
      </td>
    </tr>
  </table>
`;

const content: Record<Language, { subject: string; heading: string; greeting: (name: string) => string; body: string; gift: string; signoff: string; subfooter: string }> = {
  es: {
    subject: "Hasta pronto — tus datos en Los Mutantes",
    heading: "¡Salimos del laberinto!",
    greeting: (name: string) => `Hola <strong>${name}</strong>,`,
    body: `Gracias por haber formado parte de esta temporada. Como no te suscribiste a nuestro boletín, hemos eliminado tu reserva y tu dirección de correo electrónico de nuestros sistemas. Puedes consultar nuestra <a href="${PRIVACY_URL}" style="color:${colors.blue};">política de privacidad</a> para más información.<br/><br/>Nuestra temporada ha concluido y nos tomamos una pausa hasta septiembre. ¡Esperamos volverte a ver pronto en el laberinto!`,
    gift: "Te dejamos un recuerdo de la función.",
    signoff: `Un abrazo,<br/><strong>La junta directiva de Los Mutantes e.V.</strong>`,
    subfooter: "Los Mutantes — Teatro amateur en español, Universidad del Saarland",
  },
  en: {
    subject: "Until next time — your data at Los Mutantes",
    heading: "Out of the labyrinth!",
    greeting: (name: string) => `Hi <strong>${name}</strong>,`,
    body: `Thank you for being part of this season. Since you didn't subscribe to our newsletter, we have deleted your reservation and email address from our systems. You can read our <a href="${PRIVACY_URL}" style="color:${colors.blue};">privacy policy</a> for more details.<br/><br/>Our season has wrapped up and we are taking a break until September. We hope to see you again soon in the labyrinth!`,
    gift: "We leave you with a memory from the show.",
    signoff: `Warm regards,<br/><strong>The board of Los Mutantes e.V.</strong>`,
    subfooter: "Los Mutantes — Amateur Spanish-language theatre, Saarland University",
  },
  de: {
    subject: "Bis bald — deine Daten bei Los Mutantes",
    heading: "Raus aus dem Labyrinth!",
    greeting: (name: string) => `Hallo <strong>${name}</strong>,`,
    body: `Danke, dass du Teil dieser Spielzeit warst. Da du dich nicht für unseren Newsletter angemeldet hast, haben wir deine Reservierung und E-Mail-Adresse aus unseren Systemen gelöscht. Weitere Informationen findest du in unserer <a href="${PRIVACY_URL}" style="color:${colors.blue};">Datenschutzerklärung</a>.<br/><br/>Unsere Spielzeit ist zu Ende und wir machen eine Pause bis September. Wir freuen uns, dich bald wieder im Labyrinth zu sehen!`,
    gift: "Wir lassen dir eine Erinnerung an die Vorstellung.",
    signoff: `Herzliche Grüße,<br/><strong>Der Vorstand von Los Mutantes e.V.</strong>`,
    subfooter: "Los Mutantes — Amateurtheater auf Spanisch, Universität des Saarlandes",
  },
};

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

function pickRandomImage(): { filename: string; content: Buffer } {
  const publicDir = path.join(__dirname, "../public");
  const images = fs.readdirSync(publicDir).filter((f) => /\.(jpe?g|png|webp)$/i.test(f));
  if (images.length === 0) throw new Error("No images found in /public");
  const chosen = images[Math.floor(Math.random() * images.length)];
  return { filename: chosen, content: fs.readFileSync(path.join(publicDir, chosen)) };
}

function buildHtml(c: (typeof content)[Language], name: string): string {
  return `
    <div style="font-family:sans-serif;max-width:600px;margin:0 auto;background:${colors.background};padding:32px;border-radius:8px;">
      <h1 style="color:${colors.orange};margin-top:0;">Laberinto</h1>
      <h2 style="color:${colors.orange};">${c.heading}</h2>
      <p style="color:${colors.yellow};">${c.greeting(name)}</p>
      <p style="color:${colors.yellow};line-height:1.6;">${c.body}</p>
      <p style="color:${colors.yellow};margin-top:24px;">${c.gift}</p>
      <div style="text-align:center;margin-top:16px;">
        <img src="cid:gift" style="max-width:100%;border-radius:8px;" alt="Los Mutantes" />
      </div>
      <p style="color:${colors.yellow};margin-top:28px;line-height:1.8;">${c.signoff}</p>
      ${socialIcons}
      <p style="color:${colors.blue};font-size:12px;margin-top:24px;">${c.subfooter}</p>
    </div>
  `;
}

async function main() {
  const client = await getMongoClient();
  const db = client.db("losmutantes");

  const seen = new Set<string>();
  const recipients: { email: string; name: string; language: Language }[] = [];

  const addRecipient = (doc: Record<string, unknown>) => {
    const email = (typeof doc.email === "string" ? doc.email : "").trim();
    if (!email) return;
    const key = email.toLowerCase();
    if (seen.has(key)) return;
    seen.add(key);
    recipients.push({
      email,
      name: typeof doc.name === "string" ? doc.name : "",
      language: (doc.language as Language) ?? "es",
    });
  };

  // reservations: only those who did not subscribe to the newsletter
  const reservationsCursor = db.collection("reservations").find(
    { newsletter: { $ne: true } },
    { projection: { email: 1, name: 1, language: 1 } }
  );
  for await (const doc of reservationsCursor) addRecipient(doc);

  // caja: cash sales — no newsletter field, include all
  const cajaCursor = db.collection("caja").find(
    {},
    { projection: { email: 1, name: 1, language: 1 } }
  );
  for await (const doc of cajaCursor) addRecipient(doc);

  await client.close();

  console.log(`Found ${recipients.length} recipients.`);

  if (DRY_RUN) {
    console.log("DRY RUN — no emails will be sent.");
    for (const r of recipients) console.log(`  ${r.email} (${r.language})`);
    return;
  }

  // Resume support: skip anyone already recorded in the sent log, and record
  // each successful send so a crash mid-run can be resumed without duplicates.
  const sentPath = path.join(__dirname, "sent-emails.txt");
  const failedPath = path.join(__dirname, "failed-emails.txt");
  const alreadySent = new Set<string>(
    (fs.existsSync(sentPath) ? fs.readFileSync(sentPath, "utf8") : "")
      .split("\n")
      .map((l) => l.trim().toLowerCase())
      .filter(Boolean)
  );

  const transporter = nodemailer.createTransport({
    host: "smtp.ionos.de",
    port: 465,
    secure: true,
    auth: { user: process.env.IONOS_EMAIL, pass: process.env.IONOS_PASSWORD },
  });

  for (const { email, name, language } of recipients) {
    if (alreadySent.has(email.toLowerCase())) {
      console.log(`[SKIP] Already sent: ${email}`);
      continue;
    }

    const c = content[language] ?? content.es;
    const image = pickRandomImage();
    const html = buildHtml(c, name);

    try {
      await transporter.sendMail({
        from: `"Los Mutantes" <${process.env.IONOS_EMAIL}>`,
        to: email,
        subject: c.subject,
        html,
        attachments: [{ filename: "regalito.jpg", content: image.content, cid: "gift" }],
      });

      fs.appendFileSync(sentPath, `${email}\n`);
      alreadySent.add(email.toLowerCase());
      console.log(`[OK] Sent to ${email}`);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      fs.appendFileSync(failedPath, `${email}\t${message.replace(/\s+/g, " ")}\n`);
      console.error(`[FAIL] ${email}: ${message}`);
    }

    await sleep(1000);
  }

  transporter.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
