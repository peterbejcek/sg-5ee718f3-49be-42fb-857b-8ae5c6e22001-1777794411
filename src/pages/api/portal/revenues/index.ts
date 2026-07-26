import type { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { withAuth } from "@/lib/auth";
import { parseBody, serialize, withErrorHandler } from "@/lib/apiHelpers";
import { vypocitajPoplatky } from "@/lib/fees";
import { getFeeTiers, getProvisionRate } from "@/lib/settings";

const upsertSchema = z.object({
  driverId: z.coerce.number().int(),
  isoRok: z.coerce.number().int(),
  isoTyzden: z.coerce.number().int().min(1).max(53),
  trzba: z.coerce.number().min(0),
});

export default withErrorHandler(
  withAuth(["MAJITEL"], async (req: NextApiRequest, res: NextApiResponse, ctx) => {
    if (req.method === "GET") {
      const where: Record<string, unknown> = {};
      if (req.query.rok) where.isoRok = Number(req.query.rok);
      if (req.query.tyzden) where.isoTyzden = Number(req.query.tyzden);
      if (req.query.driverId) where.driverId = Number(req.query.driverId);

      const revenues = await prisma.revenue.findMany({
        where,
        include: {
          driver: { select: { id: true, meno: true, priezvisko: true, volaciZnak: true } },
        },
        orderBy: [{ isoRok: "desc" }, { isoTyzden: "desc" }, { driverId: "asc" }],
      });
      return res.status(200).json({ revenues: serialize(revenues) });
    }

    if (req.method === "POST") {
      const body = parseBody(req, res, upsertSchema);
      if (!body) return;

      const tiers = await getFeeTiers();
      const rate = await getProvisionRate();
      const fees = vypocitajPoplatky(body.trzba, { tiers, provisionRate: rate });

      const revenue = await prisma.revenue.upsert({
        where: {
          driverId_isoRok_isoTyzden: {
            driverId: body.driverId,
            isoRok: body.isoRok,
            isoTyzden: body.isoTyzden,
          },
        },
        create: {
          driverId: body.driverId,
          isoRok: body.isoRok,
          isoTyzden: body.isoTyzden,
          trzba: fees.trzba,
          poplatokApp: fees.poplatokApp,
          provizia: fees.provizia,
          celkovyPoplatok: fees.celkovyPoplatok,
          createdById: ctx.userId,
        },
        update: {
          trzba: fees.trzba,
          poplatokApp: fees.poplatokApp,
          provizia: fees.provizia,
          celkovyPoplatok: fees.celkovyPoplatok,
        },
        include: {
          driver: { select: { id: true, meno: true, priezvisko: true, volaciZnak: true } },
        },
      });
      return res.status(200).json({ revenue: serialize(revenue) });
    }

    return res.status(405).json({ message: "Method not allowed" });
  })
);
