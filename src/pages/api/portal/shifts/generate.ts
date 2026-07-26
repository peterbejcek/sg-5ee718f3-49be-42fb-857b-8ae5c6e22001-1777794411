// Hromadné vygenerovanie rozpisu smien pre vodiča podľa rotačného vzoru
// (kľúč z Google tabuľky). Denné/nočné smeny dostanú vozidlo a poplatok za smenu.
import type { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { withAuth } from "@/lib/auth";
import { parseBody, serialize, withErrorHandler } from "@/lib/apiHelpers";
import { getPattern, patternCodeForDay, CODE_TO_TYP } from "@/lib/shiftPatterns";

const schema = z.object({
  driverId: z.coerce.number().int(),
  patternKey: z.string().min(1),
  startDate: z.string().min(8), // YYYY-MM-DD (odporúčaný pondelok)
  weeks: z.coerce.number().int().min(1).max(26),
  vehicleId: z.coerce.number().int().nullable().optional(),
  overwrite: z.boolean().default(true), // prepísať existujúce smeny v období
});

function dateUTC(s: string): Date {
  return new Date(`${s.slice(0, 10)}T00:00:00.000Z`);
}

export default withErrorHandler(
  withAuth(["MAJITEL", "DISPECER"], async (req: NextApiRequest, res: NextApiResponse, ctx) => {
    if (req.method !== "POST") return res.status(405).json({ message: "Method not allowed" });

    const body = parseBody(req, res, schema);
    if (!body) return;

    const pattern = getPattern(body.patternKey);
    if (!pattern) return res.status(400).json({ message: "Neznámy vzor rozpisu." });

    // Poplatok za smenu z vozidla (prednastavený pre denné/nočné smeny).
    let vehicleFee: number | null = null;
    if (body.vehicleId) {
      const v = await prisma.vehicle.findUnique({ where: { id: body.vehicleId } });
      if (!v) return res.status(400).json({ message: "Vozidlo neexistuje." });
      vehicleFee = Number(v.poplatokZaSmenu);
    }

    const start = dateUTC(body.startDate);
    const totalDays = body.weeks * 7;

    let vytvorene = 0;
    for (let i = 0; i < totalDays; i++) {
      const datum = new Date(start);
      datum.setUTCDate(start.getUTCDate() + i);
      const code = patternCodeForDay(pattern, i);
      const typ = CODE_TO_TYP[code];
      const jeVolno = typ === "VOLNO";

      const vehicleId = jeVolno ? null : body.vehicleId ?? null;
      const poplatok = jeVolno ? null : vehicleFee;

      if (body.overwrite) {
        await prisma.shift.upsert({
          where: { driverId_datum: { driverId: body.driverId, datum } },
          create: {
            driverId: body.driverId,
            datum,
            typ,
            vehicleId,
            poplatokZaSmenu: poplatok,
            createdById: ctx.userId,
          },
          update: { typ, vehicleId, poplatokZaSmenu: poplatok },
        });
      } else {
        const exists = await prisma.shift.findUnique({
          where: { driverId_datum: { driverId: body.driverId, datum } },
        });
        if (exists) continue;
        await prisma.shift.create({
          data: {
            driverId: body.driverId,
            datum,
            typ,
            vehicleId,
            poplatokZaSmenu: poplatok,
            createdById: ctx.userId,
          },
        });
      }
      vytvorene++;
    }

    return res.status(200).json(serialize({ ok: true, pocet: vytvorene }));
  })
);
