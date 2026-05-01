import type { NextApiRequest, NextApiResponse } from "next";
import nodemailer from "nodemailer";

type BookingData = {
  pickup: string;
  destination: string;
  datetime: string;
  passengers: number;
  phone?: string;
  priceEstimateOnly?: boolean;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { pickup, destination, datetime, passengers, phone, priceEstimateOnly }: BookingData = req.body;

    // Validate required fields
    if (!pickup || !destination || !datetime || !passengers) {
      return res.status(400).json({ message: "Chýbajú povinné polia" });
    }

    // Validate environment variables
    if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
      console.error("⚠️ SMTP configuration missing. Please set SMTP_HOST, SMTP_USER, and SMTP_PASS in .env.local");
      
      // Development fallback - log to console
      const consoleLog = `
📧 EMAIL NOTIFICATION (SMTP not configured)
────────────────────────────────────────
From: ${process.env.SMTP_USER || "dispecing@e-taxike.sk"}
To: ${process.env.SMTP_USER || "dispecing@e-taxike.sk"}
────────────────────────────────────────
📍 Miesto vyzdvihnutia: ${pickup}
📍 Cieľ: ${destination}
🕐 Dátum a čas: ${new Date(datetime).toLocaleString("sk-SK")}
👥 Počet pasažierov: ${passengers}
${phone ? `📞 Telefón: ${phone}` : ""}
${priceEstimateOnly ? "💰 Iba cenová kalkulácia (bez objednávky)" : ""}
────────────────────────────────────────
      `.trim();
      
      console.log(consoleLog);

      return res.status(200).json({ 
        message: "Objednávka prijatá. Pre aktiváciu emailov nastavte SMTP_HOST, SMTP_USER a SMTP_PASS v .env.local",
        success: true,
        note: "SMTP nie je nakonfigurované - skontrolujte konzolu servera"
      });
    }

    // Create SMTP transporter
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || "465"),
      secure: true, // SSL/TLS
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // Format email content
    const emailSubject = priceEstimateOnly 
      ? `Cenová kalkulácia: ${pickup} → ${destination}`
      : `Nová objednávka: ${pickup} → ${destination}`;

    const emailText = `
Nová objednávka taxíka z webu E-TAXI Košice

────────────────────────────────────────
DETAILY OBJEDNÁVKY
────────────────────────────────────────

📍 Miesto vyzdvihnutia: ${pickup}
📍 Cieľ: ${destination}
🕐 Dátum a čas: ${new Date(datetime).toLocaleString("sk-SK")}
👥 Počet pasažierov: ${passengers}
${phone ? `📞 Telefón: ${phone}` : "📞 Telefón: Nezadané"}

${priceEstimateOnly ? "💰 TYP: Iba cenová kalkulácia (zákazník nežiada objednávku)" : "✅ TYP: Objednávka taxíka"}

────────────────────────────────────────
Odoslané: ${new Date().toLocaleString("sk-SK")}
Z webu: https://etaxi-kosice.sk
    `.trim();

    const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #282462; color: white; padding: 20px; text-align: center; }
    .content { background: #f9f9f9; padding: 20px; margin: 20px 0; }
    .detail { margin: 10px 0; padding: 10px; background: white; border-left: 4px solid #282462; }
    .label { font-weight: bold; color: #282462; }
    .footer { text-align: center; color: #666; font-size: 12px; margin-top: 20px; }
    ${priceEstimateOnly ? '.estimate-badge { background: #ff9500; color: white; padding: 10px; text-align: center; font-weight: bold; }' : ''}
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h2>🚕 E-TAXI Košice</h2>
      <p>${priceEstimateOnly ? 'Žiadosť o cenovú kalkuláciu' : 'Nová objednávka'}</p>
    </div>
    
    ${priceEstimateOnly ? '<div class="estimate-badge">💰 Iba cenová kalkulácia - NIE objednávka</div>' : ''}
    
    <div class="content">
      <div class="detail">
        <span class="label">📍 Miesto vyzdvihnutia:</span><br>
        ${pickup}
      </div>
      
      <div class="detail">
        <span class="label">📍 Cieľová adresa:</span><br>
        ${destination}
      </div>
      
      <div class="detail">
        <span class="label">🕐 Dátum a čas:</span><br>
        ${new Date(datetime).toLocaleString("sk-SK")}
      </div>
      
      <div class="detail">
        <span class="label">👥 Počet pasažierov:</span><br>
        ${passengers}
      </div>
      
      ${phone ? `
      <div class="detail">
        <span class="label">📞 Telefón:</span><br>
        <a href="tel:${phone}">${phone}</a>
      </div>
      ` : '<div class="detail"><span class="label">📞 Telefón:</span><br>Nezadané</div>'}
    </div>
    
    <div class="footer">
      <p>Odoslané: ${new Date().toLocaleString("sk-SK")}</p>
      <p>Z webu: <a href="https://etaxi-kosice.sk">etaxi-kosice.sk</a></p>
    </div>
  </div>
</body>
</html>
    `.trim();

    // Send email
    await transporter.sendMail({
      from: `"E-TAXI Košice - Web Objednávky" <${process.env.SMTP_USER}>`,
      to: process.env.SMTP_USER, // Send to same email (dispatching)
      subject: emailSubject,
      text: emailText,
      html: emailHtml,
    });

    console.log(`✅ Email sent successfully to ${process.env.SMTP_USER}`);

    return res.status(200).json({ 
      message: priceEstimateOnly 
        ? "Žiadosť o cenovú kalkuláciu bola odoslaná. Budeme vás kontaktovať s presnou cenou."
        : "Objednávka bola úspešne odoslaná! Čoskoro vás budeme kontaktovať.",
      success: true 
    });

  } catch (error) {
    console.error("❌ Error sending booking email:", error);
    return res.status(500).json({ 
      message: "Chyba pri odosielaní objednávky. Skúste zavolať na +421 911 606 206",
      success: false,
      error: process.env.NODE_ENV === "development" ? String(error) : undefined
    });
  }
}