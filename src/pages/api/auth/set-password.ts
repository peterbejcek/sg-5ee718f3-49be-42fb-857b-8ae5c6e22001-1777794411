// Nastavenie hesla cez pozývací/reset token (nový vodič alebo reset).
import type { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth";
import { verifyTurnstile } from "@/lib/turnstile";
import { parseBody, getClientIp, withErrorHandler } from "@/lib/apiHelpers";

const schema = z.object({
  token: z.string().min(10),
  password: z.string().min(8, "Heslo musí mať aspoň 8 znakov"),
  turnstileToken: z.string().optional(),
});

export default withErrorHandler(async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "POST") return res.status(405).json({ message: "Method not allowed" });

  const body = parseBody(req, res, schema);
  if (!body) return;

  const human = await verifyTurnstile(body.turnstileToken, getClientIp(req));
  if (!human) return res.status(400).json({ message: "Overenie, že ste človek, zlyhalo." });

  const user = await prisma.user.findFirst({
    where: {
      passwordResetToken: body.token,
      passwordResetExpires: { gt: new Date() },
    },
  });
  if (!user) return res.status(400).json({ message: "Neplatný alebo expirovaný odkaz." });

  await prisma.user.update({
    where: { id: user.id },
    data: {
      passwordHash: await hashPassword(body.password),
      mustSetPassword: false,
      passwordResetToken: null,
      passwordResetExpires: null,
    },
  });

  return res.status(200).json({ ok: true });
});
