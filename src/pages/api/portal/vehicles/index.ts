import type { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { withAuth } from "@/lib/auth";
import { parseBody, serialize, withErrorHandler } from "@/lib/apiHelpers";

const druhPohonu = z.enum(["ELEKTRO", "HYBRID", "BENZIN", "DIESEL", "LPG", "CNG"]);

const createSchema = z.object({
  nazov: z.string().min(1),
  znacka: z.string().min(1),
  model: z.string().min(1),
  farba: z.string().min(1),
  spz: z.string().min(1),
  druhPohonu,
  poplatokZaSmenu: z.coerce.number().min(0).default(0),
  aktivne: z.boolean().default(true),
});

export default withErrorHandler(
  withAuth(["MAJITEL"], async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === "GET") {
      const vehicles = await prisma.vehicle.findMany({ orderBy: { nazov: "asc" } });
      return res.status(200).json({ vehicles: serialize(vehicles) });
    }
    if (req.method === "POST") {
      const body = parseBody(req, res, createSchema);
      if (!body) return;
      const vehicle = await prisma.vehicle.create({
        data: {
          nazov: body.nazov,
          znacka: body.znacka,
          model: body.model,
          farba: body.farba,
          spz: body.spz.toUpperCase().trim(),
          druhPohonu: body.druhPohonu,
          poplatokZaSmenu: body.poplatokZaSmenu,
          aktivne: body.aktivne,
        },
      });
      return res.status(201).json({ vehicle: serialize(vehicle) });
    }
    return res.status(405).json({ message: "Method not allowed" });
  })
);
