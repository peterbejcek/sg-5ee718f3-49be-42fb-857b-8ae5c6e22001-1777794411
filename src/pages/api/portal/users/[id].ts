import type { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { withAuth } from "@/lib/auth";
import { parseBody, serialize, withErrorHandler } from "@/lib/apiHelpers";
import { generateToken, sendPasswordSetupEmail } from "@/lib/email";

const role = z.enum(["MAJITEL", "DISPECER", "VODIC"]);

const updateSchema = z.object({
  meno: z.string().min(1).optional(),
  priezvisko: z.string().min(1).optional(),
  telefon: z.string().nullable().optional(),
  volaciZnak: z.string().nullable().optional(),
  aktivny: z.boolean().optional(),
  roles: z.array(role).min(1).optional(),
  registracnyPoplatokUhradeny: z.boolean().optional(),
  resendInvite: z.boolean().optional(),
});

export default withErrorHandler(
  withAuth(["MAJITEL"], async (req: NextApiRequest, res: NextApiResponse, ctx) => {
    const id = Number(req.query.id);
    if (!Number.isInteger(id)) return res.status(400).json({ message: "Neplatné ID" });

    if (req.method === "PUT") {
      const body = parseBody(req, res, updateSchema);
      if (!body) return;

      const current = await prisma.user.findUnique({ where: { id } });
      if (!current) return res.status(404).json({ message: "Používateľ neexistuje" });

      // Zmena stavu registračného poplatku -> nastav/zruš dátum úhrady.
      const regData: { registracnyPoplatokUhradeny?: boolean; registracnyPoplatokDna?: Date | null } = {};
      if (body.registracnyPoplatokUhradeny !== undefined) {
        regData.registracnyPoplatokUhradeny = body.registracnyPoplatokUhradeny;
        regData.registracnyPoplatokDna = body.registracnyPoplatokUhradeny
          ? current.registracnyPoplatokDna ?? new Date()
          : null;
      }

      const user = await prisma.$transaction(async (tx) => {
        if (body.roles) {
          await tx.userRole.deleteMany({ where: { userId: id } });
          await tx.userRole.createMany({ data: body.roles.map((r) => ({ userId: id, role: r })) });
        }
        return tx.user.update({
          where: { id },
          data: {
            meno: body.meno,
            priezvisko: body.priezvisko,
            telefon: body.telefon === undefined ? undefined : body.telefon,
            volaciZnak:
              body.volaciZnak === undefined
                ? undefined
                : body.volaciZnak
                  ? body.volaciZnak.toUpperCase().trim()
                  : null,
            aktivny: body.aktivny,
            ...regData,
          },
          include: { roles: true },
        });
      });

      let inviteLink: string | undefined;
      if (body.resendInvite) {
        const token = generateToken();
        await prisma.user.update({
          where: { id },
          data: {
            passwordResetToken: token,
            passwordResetExpires: new Date(Date.now() + 48 * 60 * 60 * 1000),
          },
        });
        const r = await sendPasswordSetupEmail({
          to: user.email,
          meno: user.meno,
          token,
          isReset: !user.mustSetPassword,
        });
        if (!r.sent) inviteLink = r.link;
      }

      return res.status(200).json({
        user: serialize({
          id: user.id,
          email: user.email,
          meno: user.meno,
          priezvisko: user.priezvisko,
          telefon: user.telefon,
          volaciZnak: user.volaciZnak,
          aktivny: user.aktivny,
          registracnyPoplatokUhradeny: user.registracnyPoplatokUhradeny,
          roles: user.roles.map((r) => r.role),
        }),
        inviteLink,
      });
    }

    if (req.method === "DELETE") {
      if (id === ctx.userId) {
        return res.status(400).json({ message: "Nemôžete zmazať vlastný účet." });
      }
      await prisma.user.delete({ where: { id } });
      return res.status(200).json({ ok: true });
    }

    return res.status(405).json({ message: "Method not allowed" });
  })
);
