import type { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { withAuth } from "@/lib/auth";
import { parseBody, serialize, withErrorHandler } from "@/lib/apiHelpers";
import { generateToken, sendPasswordSetupEmail } from "@/lib/email";

const role = z.enum(["MAJITEL", "DISPECER", "VODIC"]);

const createSchema = z.object({
  email: z.string().email(),
  meno: z.string().min(1),
  priezvisko: z.string().min(1),
  telefon: z.string().optional(),
  volaciZnak: z.string().optional(),
  roles: z.array(role).min(1),
  registracnyPoplatokUhradeny: z.boolean().default(false),
  sendInvite: z.boolean().default(true),
});

export default withErrorHandler(
  withAuth(["MAJITEL"], async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === "GET") {
      const users = await prisma.user.findMany({
        include: { roles: true },
        orderBy: [{ priezvisko: "asc" }, { meno: "asc" }],
      });
      return res.status(200).json({
        users: serialize(
          users.map((u) => ({
            id: u.id,
            email: u.email,
            meno: u.meno,
            priezvisko: u.priezvisko,
            telefon: u.telefon,
            volaciZnak: u.volaciZnak,
            aktivny: u.aktivny,
            mustSetPassword: u.mustSetPassword,
            registracnyPoplatokUhradeny: u.registracnyPoplatokUhradeny,
            registracnyPoplatokDna: u.registracnyPoplatokDna,
            roles: u.roles.map((r) => r.role),
          }))
        ),
      });
    }

    if (req.method === "POST") {
      const body = parseBody(req, res, createSchema);
      if (!body) return;

      const email = body.email.toLowerCase().trim();
      const existing = await prisma.user.findUnique({ where: { email } });
      if (existing) return res.status(409).json({ message: "Používateľ s týmto e-mailom už existuje." });

      const token = generateToken();
      const user = await prisma.user.create({
        data: {
          email,
          meno: body.meno.trim(),
          priezvisko: body.priezvisko.trim(),
          telefon: body.telefon?.trim() || null,
          volaciZnak: body.volaciZnak?.trim().toUpperCase() || null,
          mustSetPassword: true,
          registracnyPoplatokUhradeny: body.registracnyPoplatokUhradeny,
          registracnyPoplatokDna: body.registracnyPoplatokUhradeny ? new Date() : null,
          passwordResetToken: token,
          passwordResetExpires: new Date(Date.now() + 48 * 60 * 60 * 1000),
          roles: { create: body.roles.map((r) => ({ role: r })) },
        },
        include: { roles: true },
      });

      let inviteLink: string | undefined;
      if (body.sendInvite) {
        const r = await sendPasswordSetupEmail({ to: email, meno: body.meno, token });
        if (!r.sent) inviteLink = r.link; // vráť odkaz, ak SMTP nie je nastavené
      }

      return res.status(201).json({
        user: serialize({
          id: user.id,
          email: user.email,
          meno: user.meno,
          priezvisko: user.priezvisko,
          roles: user.roles.map((x) => x.role),
        }),
        inviteLink,
      });
    }

    return res.status(405).json({ message: "Method not allowed" });
  })
);
