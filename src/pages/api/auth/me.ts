import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { withErrorHandler, serialize } from "@/lib/apiHelpers";

export default withErrorHandler(async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSession(req);
  if (!session) return res.status(200).json({ user: null });

  const user = await prisma.user.findUnique({
    where: { id: session.uid },
    include: { roles: true },
  });
  if (!user || !user.aktivny) return res.status(200).json({ user: null });

  return res.status(200).json({
    user: serialize({
      id: user.id,
      email: user.email,
      meno: user.meno,
      priezvisko: user.priezvisko,
      volaciZnak: user.volaciZnak,
      telefon: user.telefon,
      roles: user.roles.map((r) => r.role),
      registracnyPoplatokUhradeny: user.registracnyPoplatokUhradeny,
    }),
  });
});
