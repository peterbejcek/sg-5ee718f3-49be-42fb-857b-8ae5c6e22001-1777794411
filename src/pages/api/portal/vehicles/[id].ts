import type { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { withAuth } from "@/lib/auth";
import { parseBody, serialize, withErrorHandler } from "@/lib/apiHelpers";

const druhPohonu = z.enum(["ELEKTRO", "HYBRID", "BENZIN", "DIESEL", "LPG", "CNG"]);

const updateSchema = z.object({
  nazov: z.string().min(1).optional(),
  znacka: z.string().min(1).optional(),
  model: z.string().min(1).optional(),
  farba: z.string().min(1).optional(),
  spz: z.string().min(1).optional(),
  druhPohonu: druhPohonu.optional(),
  poplatokZaSmenu: z.coerce.number().min(0).optional(),
  aktivne: z.boolean().optional(),
});

export default withErrorHandler(
  withAuth(["MAJITEL"], async (req: NextApiRequest, res: NextApiResponse) => {
    const id = Number(req.query.id);
    if (!Number.isInteger(id)) return res.status(400).json({ message: "Neplatné ID" });

    if (req.method === "PUT") {
      const body = parseBody(req, res, updateSchema);
      if (!body) return;
      const data = { ...body };
      if (data.spz) data.spz = data.spz.toUpperCase().trim();
      const vehicle = await prisma.vehicle.update({ where: { id }, data });
      return res.status(200).json({ vehicle: serialize(vehicle) });
    }
    if (req.method === "DELETE") {
      await prisma.vehicle.delete({ where: { id } });
      return res.status(200).json({ ok: true });
    }
    return res.status(405).json({ message: "Method not allowed" });
  })
);
