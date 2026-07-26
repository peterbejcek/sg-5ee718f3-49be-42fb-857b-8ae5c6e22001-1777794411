import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import { withAuth } from "@/lib/auth";
import { serialize, withErrorHandler } from "@/lib/apiHelpers";

// Číselníky pre rozpis smien — vodiči a vozidlá. Dostupné majiteľovi aj dispečerovi.
export default withErrorHandler(
  withAuth(["MAJITEL", "DISPECER"], async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method !== "GET") return res.status(405).json({ message: "Method not allowed" });
    const [drivers, vehicles] = await Promise.all([
      prisma.user.findMany({
        where: { aktivny: true, roles: { some: { role: "VODIC" } } },
        select: { id: true, meno: true, priezvisko: true, volaciZnak: true },
        orderBy: [{ priezvisko: "asc" }, { meno: "asc" }],
      }),
      prisma.vehicle.findMany({
        where: { aktivne: true },
        select: { id: true, nazov: true, spz: true, poplatokZaSmenu: true },
        orderBy: { nazov: "asc" },
      }),
    ]);
    return res.status(200).json({ drivers: serialize(drivers), vehicles: serialize(vehicles) });
  })
);
