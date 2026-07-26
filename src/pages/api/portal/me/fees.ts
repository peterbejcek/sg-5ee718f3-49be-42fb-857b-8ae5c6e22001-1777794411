import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import { withAuth } from "@/lib/auth";
import { serialize, withErrorHandler } from "@/lib/apiHelpers";
import { getRegistrationFee } from "@/lib/settings";

// Vodič vidí len svoje poplatky (týždenné + registračný + poplatky za smeny/prenájom).
export default withErrorHandler(
  withAuth(["VODIC", "DISPECER", "MAJITEL"], async (req: NextApiRequest, res: NextApiResponse, ctx) => {
    if (req.method !== "GET") return res.status(405).json({ message: "Method not allowed" });

    const [user, revenues, shiftFees, registrationFee] = await Promise.all([
      prisma.user.findUnique({
        where: { id: ctx.userId },
        select: {
          registracnyPoplatokUhradeny: true,
          registracnyPoplatokDna: true,
        },
      }),
      prisma.revenue.findMany({
        where: { driverId: ctx.userId },
        orderBy: [{ isoRok: "desc" }, { isoTyzden: "desc" }],
      }),
      prisma.shift.findMany({
        where: { driverId: ctx.userId, poplatokZaSmenu: { not: null } },
        include: { vehicle: { select: { nazov: true, spz: true } } },
        orderBy: { datum: "desc" },
      }),
      getRegistrationFee(),
    ]);

    const totalPoplatky = revenues.reduce((s, r) => s + Number(r.celkovyPoplatok), 0);
    const neuhradenePoplatky = revenues
      .filter((r) => !r.uhradene)
      .reduce((s, r) => s + Number(r.celkovyPoplatok), 0);
    const neuhradeneSmeny = shiftFees
      .filter((s) => !s.poplatokUhradeny)
      .reduce((s, x) => s + Number(x.poplatokZaSmenu ?? 0), 0);

    return res.status(200).json(
      serialize({
        registracia: {
          poplatok: registrationFee,
          uhradeny: user?.registracnyPoplatokUhradeny ?? false,
          uhradenyDna: user?.registracnyPoplatokDna ?? null,
        },
        suhrn: {
          spoluTyzdennePoplatky: totalPoplatky,
          neuhradeneTyzdennePoplatky: neuhradenePoplatky,
          neuhradenePoplatkyZaSmeny: neuhradeneSmeny,
        },
        revenues,
        shiftFees,
      })
    );
  })
);
