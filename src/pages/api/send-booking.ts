import type { NextApiRequest, NextApiResponse } from "next";

type BookingData = {
  pickup: string;
  destination: string;
  datetime: string;
  passengers: number;
  phone?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { pickup, destination, datetime, passengers, phone }: BookingData = req.body;

    // Validate required fields
    if (!pickup || !destination || !datetime || !passengers) {
      return res.status(400).json({ message: "Chýbajú povinné polia" });
    }

    // Format email content
    const emailContent = `
Nová objednávka taxíka z webu E-TAXI Košice

────────────────────────────────
DETAILY OBJEDNÁVKY
────────────────────────────────

📍 Miesto vyzdvihnutia: ${pickup}
📍 Cieľ: ${destination}
🕐 Dátum a čas: ${new Date(datetime).toLocaleString("sk-SK")}
👥 Počet pasažierov: ${passengers}
${phone ? `📞 Telefón: ${phone}` : ""}

────────────────────────────────
Odoslané: ${new Date().toLocaleString("sk-SK")}
    `.trim();

    // For now, using a simple email sending approach
    // You can integrate with Resend, SendGrid, or Nodemailer later
    
    // Option 1: Using Resend (recommended for production)
    // Install: npm install resend
    // Set RESEND_API_KEY in .env.local
    
    if (process.env.RESEND_API_KEY) {
      const { Resend } = await import("resend");
      const resend = new Resend(process.env.RESEND_API_KEY);

      await resend.emails.send({
        from: "E-TAXI Košice <booking@e-taxike.sk>",
        to: "dispecing@e-taxike.sk",
        subject: `Nová objednávka: ${pickup} → ${destination}`,
        text: emailContent,
      });

      return res.status(200).json({ 
        message: "Objednávka bola úspešne odoslaná",
        success: true 
      });
    }

    // Option 2: Fallback - log to console (development only)
    console.log("📧 Email notification:");
    console.log(emailContent);

    return res.status(200).json({ 
      message: "Objednávka bola prijatá. Pre aktiváciu emailov pridajte RESEND_API_KEY do .env.local",
      success: true,
      note: "Email funkcia vyžaduje nastavenie RESEND_API_KEY"
    });

  } catch (error) {
    console.error("Error sending booking:", error);
    return res.status(500).json({ 
      message: "Chyba pri odosielaní objednávky. Skúste zavolať na +421 911 606 206",
      success: false 
    });
  }
}