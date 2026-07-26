import type { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { withAuth } from "@/lib/auth";
import { parseBody, serialize, withErrorHandler } from "@/lib/apiHelpers";

const updateSchema = z.object({
  typ: z.enum(["DENNA", "NOCNA", "VOLNO"]).optional(),
  vehicleId: z.coerce.number().int().nullable().optional(),
  poplatokZaSmenu: z.coerce.number().min(0).nullable().optional(),
  // Evidencia úhrady poplatku za smenu (prenájom auta):
  poplatokUhradeny: z.boolean().optional(),
  poznamka: z.string().nullable().optional(),
});

export default withErrorHandler(
  withAuth(["MAJITEL", "DISPECER"], async (req: NextApiRequest, res: NextApiResponse) => {
    const id = Number(req.query.id);
    if (!Number.isInteger(id)) return res.status(400).json({ message: "Neplatné ID" });

    if (req.method === "PUT") {
      const body = parseBody(req, res, updateSchema);
      if (!body) return;

      const data: Record<string, unknown> = {};
      if (body.typ !== undefined) data.typ = body.typ;
      if (body.vehicleId !== undefined) data.vehicleId = body.vehicleId;
      if (body.poplatokZaSmenu !== undefined) data.poplatokZaSmenu = body.poplatokZaSmenu;
      if (body.poznamka !== undefined) data.poznamka = body.poznamka;
      if (body.poplatokUhradeny !== undefined) {
        data.poplatokUhradeny = body.poplatokUhradeny;
        data.poplatokUhradenyDna = body.poplatokUhradeny ? new Date() : null;
      }

      const shift = await prisma.shift.update({
        where: { id },
        data,
        include: {
          driver: { select: { id: true, meno: true, priezvisko: true, volaciZnak: true } },
          vehicle: { select: { id: true, nazov: true, spz: true } },
        },
      });
      return res.status(200).json({ shift: serialize(shift) });
    }

    if (req.method === "DELETE") {
      await prisma.shift.delete({ where: { id } });
      return res.status(200).json({ ok: true });
    }

    return res.status(405).json({ message: "Method not allowed" });
  })
);
