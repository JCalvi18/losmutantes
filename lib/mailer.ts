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

export async function sendConfirmation(
  email: string,
  name: string,
  show: { city: string; theater: string; date: string },
  tickets: number,
  amount: number,
  reservationId: string
) {
  await transporter.sendMail({
    from: `"Los Mutantes" <${process.env.IONOS_EMAIL}>`,
    to: email,
    subject: "Reserva confirmada — Los Mutantes",
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #991b1b;">Los Mutantes</h1>
        <h2>¡Reserva confirmada!</h2>
        <p>Hola <strong>${name}</strong>,</p>
        <p>Tu reserva ha sido confirmada. Aquí están los detalles:</p>
        <table style="border-collapse: collapse; width: 100%;">
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd;"><strong>Función</strong></td>
            <td style="padding: 8px; border: 1px solid #ddd;">${show.city}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd;"><strong>Fecha</strong></td>
            <td style="padding: 8px; border: 1px solid #ddd;">${show.date}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd;"><strong>Entradas</strong></td>
            <td style="padding: 8px; border: 1px solid #ddd;">${tickets}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd;"><strong>Total pagado</strong></td>
            <td style="padding: 8px; border: 1px solid #ddd;">€${amount.toFixed(2)}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd;"><strong>ID de reserva</strong></td>
            <td style="padding: 8px; border: 1px solid #ddd; font-family: monospace;">${reservationId}</td>
          </tr>
        </table>
        <p style="margin-top: 24px;">Guarda este correo como comprobante. ¡Nos vemos en la función!</p>
        <p style="color: #666; font-size: 12px;">Los Mutantes — Teatro amateur en español, Universidad del Saarland</p>
      </div>
    `,
  });
}
