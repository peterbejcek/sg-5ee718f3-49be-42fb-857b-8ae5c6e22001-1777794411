import type { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { withAuth } from "@/lib/auth";
import { parseBody, serialize, withErrorHandler } from "@/lib/apiHelpers";
import { vypocitajPoplatky } from "@/lib/fees";
import { getFeeTiers, getProvisionRate } from "@/lib/settings";

const updateSchema = z.object({
  trzba: z.coerce.number().min(0).optional(),
  uhradene: z.boolean().optional(),
});

export default withErrorHandler(
  withAuth(["MAJITEL"], async (req: NextApiRequest, res: NextApiResponse) => {
    const id = Number(req.query.id);
    if (!Number.isInteger(id)) return res.status(400).json({ message: "Neplatné ID" });

    if (req.method === "PUT") {
      const body = parseBody(req, res, updateSchema);
      if (!body) return;

      const data: Record<string, unknown> = {};
      if (body.trzba !== undefined) {
        const tiers = await getFeeTiers();
        const rate = await getProvisionRate();
        const fees = vypocitajPoplatky(body.trzba, { tiers, provisionRate: rate });
        data.trzba = fees.trzba;
        data.poplatokApp = fees.poplatokApp;
        data.provizia = fees.provizia;
        data.celkovyPoplatok = fees.celkovyPoplatok;
      }
      if (body.uhradene !== undefined) {
        data.uhradene = body.uhradene;
        data.uhradeneDna = body.uhradene ? new Date() : null;
      }

      const revenue = await prisma.revenue.update({
        where: { id },
        data,
        include: {
          driver: { select: { id: true, meno: true, priezvisko: true, volaciZnak: true } },
        },
      });
      return res.status(200).json({ revenue: serialize(revenue) });
    }

    if (req.method === "DELETE") {
      await prisma.revenue.delete({ where: { id } });
      return res.status(200).json({ ok: true });
    }

    return res.status(405).json({ message: "Method not allowed" });
  })
);
