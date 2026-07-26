import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import { withAuth } from "@/lib/auth";
import { serialize, withErrorHandler } from "@/lib/apiHelpers";
import { isoWeekDateRange } from "@/lib/fees";

// Vodič vidí len svoje smeny.
export default withErrorHandler(
  withAuth(["VODIC", "DISPECER", "MAJITEL"], async (req: NextApiRequest, res: NextApiResponse, ctx) => {
    if (req.method !== "GET") return res.status(405).json({ message: "Method not allowed" });

    const where: Record<string, unknown> = { driverId: ctx.userId };
    if (req.query.rok && req.query.tyzden) {
      const { from, to } = isoWeekDateRange(Number(req.query.rok), Number(req.query.tyzden));
      where.datum = { gte: from, lte: to };
    }

    const shifts = await prisma.shift.findMany({
      where,
      include: { vehicle: { select: { id: true, nazov: true, spz: true } } },
      orderBy: { datum: "asc" },
    });
    return res.status(200).json({ shifts: serialize(shifts) });
  })
);
