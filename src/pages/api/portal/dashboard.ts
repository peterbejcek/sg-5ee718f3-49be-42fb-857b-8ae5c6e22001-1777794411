import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import { withAuth } from "@/lib/auth";
import { serialize, withErrorHandler } from "@/lib/apiHelpers";
import { isoWeekDateRange, isoWeekParts } from "@/lib/fees";

// Dashboard: finančné súhrny (len MAJITEL) + vyťaženosť (MAJITEL a DISPECER).
export default withErrorHandler(
  withAuth(["MAJITEL", "DISPECER"], async (req: NextApiRequest, res: NextApiResponse, ctx) => {
    if (req.method !== "GET") return res.status(405).json({ message: "Method not allowed" });

    const now = new Date();
    const cur = isoWeekParts(now);
    const rok = req.query.rok ? Number(req.query.rok) : cur.isoRok;
    const tyzden = req.query.tyzden ? Number(req.query.tyzden) : cur.isoTyzden;
    const { from, to, dni } = isoWeekDateRange(rok, tyzden);

    const isOwner = ctx.session.roles.includes("MAJITEL");

    // ── Vyťaženosť áut a vodičov (týždeň) ─────────────────────────────────────
    const [vehicles, drivers, shifts] = await Promise.all([
      prisma.vehicle.findMany({ where: { aktivne: true }, orderBy: { nazov: "asc" } }),
      prisma.user.findMany({
        where: { aktivny: true, roles: { some: { role: "VODIC" } } },
        select: { id: true, meno: true, priezvisko: true, volaciZnak: true },
        orderBy: [{ priezvisko: "asc" }],
      }),
      prisma.shift.findMany({
        where: { datum: { gte: from, lte: to } },
        include: {
          driver: { select: { id: true, meno: true, priezvisko: true, volaciZnak: true } },
          vehicle: { select: { id: true, nazov: true, spz: true } },
        },
      }),
    ]);

    const worked = shifts.filter((s) => s.typ !== "VOLNO");
    const maxSlots = dni.length * 2; // deň + noc na auto/týždeň

    const vehicleUtilization = vehicles.map((v) => {
      const vShifts = worked.filter((s) => s.vehicleId === v.id);
      return {
        vehicleId: v.id,
        nazov: v.nazov,
        spz: v.spz,
        obsadenychSmien: vShifts.length,
        maxSmien: maxSlots,
        vytazenostPct: maxSlots ? Math.round((vShifts.length / maxSlots) * 100) : 0,
      };
    });

    const driverUtilization = drivers.map((d) => {
      const dShifts = worked.filter((s) => s.driverId === d.id);
      return {
        driverId: d.id,
        meno: d.meno,
        priezvisko: d.priezvisko,
        volaciZnak: d.volaciZnak,
        odpracovanychSmien: dShifts.length,
        denne: dShifts.filter((s) => s.typ === "DENNA").length,
        nocne: dShifts.filter((s) => s.typ === "NOCNA").length,
      };
    });

    // ── Poplatky za smeny (prenájom auta) — kto zaplatil ──────────────────────
    const shiftFeesAll = shifts.filter((s) => s.poplatokZaSmenu != null);
    const shiftFeesCollected = shiftFeesAll
      .filter((s) => s.poplatokUhradeny)
      .reduce((sum, s) => sum + Number(s.poplatokZaSmenu ?? 0), 0);
    const shiftFeesOutstanding = shiftFeesAll
      .filter((s) => !s.poplatokUhradeny)
      .reduce((sum, s) => sum + Number(s.poplatokZaSmenu ?? 0), 0);

    // Kto zaplatil poplatok za prenájom (po vodičoch).
    const shiftFeeByDriver = new Map<
      number,
      { driver: (typeof shifts)[number]["driver"]; zaplatene: number; nezaplatene: number }
    >();
    for (const s of shiftFeesAll) {
      const rec =
        shiftFeeByDriver.get(s.driverId) ??
        { driver: s.driver, zaplatene: 0, nezaplatene: 0 };
      if (s.poplatokUhradeny) rec.zaplatene += Number(s.poplatokZaSmenu ?? 0);
      else rec.nezaplatene += Number(s.poplatokZaSmenu ?? 0);
      shiftFeeByDriver.set(s.driverId, rec);
    }

    const response: Record<string, unknown> = {
      obdobie: { rok, tyzden, from, to },
      vytazenost: { vozidla: vehicleUtilization, vodici: driverUtilization },
      poplatkyZaSmeny: {
        vyzbierane: shiftFeesCollected,
        neuhradene: shiftFeesOutstanding,
        podlaVodicov: Array.from(shiftFeeByDriver.values()),
      },
    };

    // ── Finančné súhrny (len majiteľ) ─────────────────────────────────────────
    if (isOwner) {
      const [weekRevenues, allUnpaidRevenues, driversNeuhradenaReg] = await Promise.all([
        prisma.revenue.findMany({
          where: { isoRok: rok, isoTyzden: tyzden },
          include: {
            driver: { select: { id: true, meno: true, priezvisko: true, volaciZnak: true } },
          },
        }),
        prisma.revenue.findMany({
          where: { uhradene: false },
          include: {
            driver: { select: { id: true, meno: true, priezvisko: true, volaciZnak: true } },
          },
          orderBy: [{ isoRok: "desc" }, { isoTyzden: "desc" }],
        }),
        prisma.user.findMany({
          where: { registracnyPoplatokUhradeny: false, roles: { some: { role: "VODIC" } }, aktivny: true },
          select: { id: true, meno: true, priezvisko: true, volaciZnak: true },
        }),
      ]);

      const sum = (arr: typeof weekRevenues, key: "trzba" | "poplatokApp" | "provizia" | "celkovyPoplatok") =>
        arr.reduce((s, r) => s + Number(r[key]), 0);

      response.tyzden = {
        pocetVodicov: weekRevenues.length,
        celkovaTrzba: sum(weekRevenues, "trzba"),
        poplatokApp: sum(weekRevenues, "poplatokApp"),
        provizia: sum(weekRevenues, "provizia"),
        celkovyPoplatok: sum(weekRevenues, "celkovyPoplatok"),
        uhradene: weekRevenues.filter((r) => r.uhradene).reduce((s, r) => s + Number(r.celkovyPoplatok), 0),
        neuhradene: weekRevenues.filter((r) => !r.uhradene).reduce((s, r) => s + Number(r.celkovyPoplatok), 0),
      };
      response.neuhradenePoplatky = {
        spolu: allUnpaidRevenues.reduce((s, r) => s + Number(r.celkovyPoplatok), 0),
        polozky: allUnpaidRevenues,
      };
      response.neuhradenaRegistracia = driversNeuhradenaReg;
    }

    return res.status(200).json(serialize(response));
  })
);
