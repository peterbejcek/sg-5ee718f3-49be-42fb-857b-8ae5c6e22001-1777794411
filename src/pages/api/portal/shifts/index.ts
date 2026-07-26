import type { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { withAuth } from "@/lib/auth";
import { parseBody, serialize, withErrorHandler } from "@/lib/apiHelpers";
import { isoWeekDateRange } from "@/lib/fees";

const upsertSchema = z.object({
  driverId: z.coerce.number().int(),
  datum: z.string().min(8), // YYYY-MM-DD
  typ: z.enum(["DENNA", "NOCNA", "VOLNO"]),
  vehicleId: z.coerce.number().int().nullable().optional(),
  poplatokZaSmenu: z.coerce.number().min(0).nullable().optional(),
  poznamka: z.string().nullable().optional(),
});

function parseDateUTC(s: string): Date {
  return new Date(`${s.slice(0, 10)}T00:00:00.000Z`);
}

// MAJITEL aj DISPECER môžu čítať a editovať rozpis smien.
export default withErrorHandler(
  withAuth(["MAJITEL", "DISPECER"], async (req: NextApiRequest, res: NextApiResponse, ctx) => {
    if (req.method === "GET") {
      const rok = Number(req.query.rok);
      const tyzden = Number(req.query.tyzden);
      if (!Number.isInteger(rok) || !Number.isInteger(tyzden)) {
        return res.status(400).json({ message: "Chýba ?rok=&tyzden=" });
      }
      const { from, to } = isoWeekDateRange(rok, tyzden);
      const shifts = await prisma.shift.findMany({
        where: { datum: { gte: from, lte: to } },
        include: {
          driver: { select: { id: true, meno: true, priezvisko: true, volaciZnak: true } },
          vehicle: { select: { id: true, nazov: true, spz: true, poplatokZaSmenu: true } },
        },
        orderBy: { datum: "asc" },
      });
      return res.status(200).json({ shifts: serialize(shifts) });
    }

    if (req.method === "POST") {
      const body = parseBody(req, res, upsertSchema);
      if (!body) return;
      const datum = parseDateUTC(body.datum);

      // Ak poplatok za smenu nie je zadaný, prevezmi predvolený z vozidla.
      let poplatok = body.poplatokZaSmenu ?? null;
      if (poplatok === null && body.vehicleId) {
        const v = await prisma.vehicle.findUnique({ where: { id: body.vehicleId } });
        if (v) poplatok = Number(v.poplatokZaSmenu);
      }

      const shift = await prisma.shift.upsert({
        where: { driverId_datum: { driverId: body.driverId, datum } },
        create: {
          driverId: body.driverId,
          datum,
          typ: body.typ,
          vehicleId: body.vehicleId ?? null,
          poplatokZaSmenu: poplatok,
          poznamka: body.poznamka ?? null,
          createdById: ctx.userId,
        },
        update: {
          typ: body.typ,
          vehicleId: body.vehicleId ?? null,
          // poplatokZaSmenu prepíš iba ak bol explicitne poslaný
          ...(body.poplatokZaSmenu !== undefined ? { poplatokZaSmenu: body.poplatokZaSmenu } : {}),
          poznamka: body.poznamka ?? null,
        },
        include: {
          driver: { select: { id: true, meno: true, priezvisko: true, volaciZnak: true } },
          vehicle: { select: { id: true, nazov: true, spz: true } },
        },
      });
      return res.status(200).json({ shift: serialize(shift) });
    }

    return res.status(405).json({ message: "Method not allowed" });
  })
);
