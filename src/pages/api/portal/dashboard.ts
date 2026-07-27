import type { NextApiRequest, NextApiResponse } from "next";
import { query } from "@/lib/db";
import { withAuth } from "@/lib/auth";
import { withErrorHandler } from "@/lib/apiHelpers";
import { isoWeekDateRange, isoWeekParts } from "@/lib/fees";

const ymd = (d: Date) => d.toISOString().slice(0, 10);

type ShiftRow = {
  id: number; datum: string; typ: string; driverId: number; vehicleId: number | null;
  poplatokZaSmenu: number | null; poplatokUhradeny: number;
  d_meno: string; d_priezvisko: string; d_volaciZnak: string | null;
};

// Dashboard: finančné súhrny (len MAJITEL) + vyťaženosť (MAJITEL a DISPECER).
export default withErrorHandler(
  withAuth(["MAJITEL", "DISPECER"], async (req: NextApiRequest, res: NextApiResponse, ctx) => {
    if (req.method !== "GET") return res.status(405).json({ message: "Method not allowed" });

    const cur = isoWeekParts(new Date());
    const rok = req.query.rok ? Number(req.query.rok) : cur.isoRok;
    const tyzden = req.query.tyzden ? Number(req.query.tyzden) : cur.isoTyzden;
    const { from, to, dni } = isoWeekDateRange(rok, tyzden);

    const isOwner = ctx.session.roles.includes("MAJITEL");

    const vehicles = await query<{ id: number; nazov: string; spz: string }>(
      "SELECT `id`, `nazov`, `spz` FROM `Vehicle` WHERE `aktivne` = 1 ORDER BY `nazov` ASC"
    );
    const drivers = await query<{ id: number; meno: string; priezvisko: string; volaciZnak: string | null }>(
      "SELECT u.`id`, u.`meno`, u.`priezvisko`, u.`volaciZnak` FROM `User` u " +
        "JOIN `UserRole` ur ON ur.`userId` = u.`id` AND ur.`role` = 'VODIC' " +
        "WHERE u.`aktivny` = 1 ORDER BY u.`priezvisko` ASC"
    );
    const shifts = await query<ShiftRow>(
      "SELECT s.`id`, s.`datum`, s.`typ`, s.`driverId`, s.`vehicleId`, s.`poplatokZaSmenu`, s.`poplatokUhradeny`, " +
        "d.`meno` AS d_meno, d.`priezvisko` AS d_priezvisko, d.`volaciZnak` AS d_volaciZnak " +
        "FROM `Shift` s JOIN `User` d ON d.`id` = s.`driverId` WHERE s.`datum` BETWEEN ? AND ?",
      [ymd(from), ymd(to)]
    );

    const worked = shifts.filter((s) => s.typ !== "VOLNO");
    const maxSlots = dni.length * 2;

    const vehicleUtilization = vehicles.map((v) => {
      const vShifts = worked.filter((s) => s.vehicleId === v.id);
      return {
        vehicleId: v.id, nazov: v.nazov, spz: v.spz,
        obsadenychSmien: vShifts.length, maxSmien: maxSlots,
        vytazenostPct: maxSlots ? Math.round((vShifts.length / maxSlots) * 100) : 0,
      };
    });

    const driverUtilization = drivers.map((d) => {
      const dShifts = worked.filter((s) => s.driverId === d.id);
      return {
        driverId: d.id, meno: d.meno, priezvisko: d.priezvisko, volaciZnak: d.volaciZnak,
        odpracovanychSmien: dShifts.length,
        denne: dShifts.filter((s) => s.typ === "DENNA").length,
        nocne: dShifts.filter((s) => s.typ === "NOCNA").length,
      };
    });

    const shiftFeesAll = shifts.filter((s) => s.poplatokZaSmenu != null);
    const shiftFeesCollected = shiftFeesAll.filter((s) => s.poplatokUhradeny === 1)
      .reduce((sum, s) => sum + Number(s.poplatokZaSmenu ?? 0), 0);
    const shiftFeesOutstanding = shiftFeesAll.filter((s) => s.poplatokUhradeny !== 1)
      .reduce((sum, s) => sum + Number(s.poplatokZaSmenu ?? 0), 0);

    const byDriver = new Map<number, { driver: { meno: string; priezvisko: string; volaciZnak: string | null }; zaplatene: number; nezaplatene: number }>();
    for (const s of shiftFeesAll) {
      const rec = byDriver.get(s.driverId) ??
        { driver: { meno: s.d_meno, priezvisko: s.d_priezvisko, volaciZnak: s.d_volaciZnak }, zaplatene: 0, nezaplatene: 0 };
      if (s.poplatokUhradeny === 1) rec.zaplatene += Number(s.poplatokZaSmenu ?? 0);
      else rec.nezaplatene += Number(s.poplatokZaSmenu ?? 0);
      byDriver.set(s.driverId, rec);
    }

    const response: Record<string, unknown> = {
      obdobie: { rok, tyzden, from: ymd(from), to: ymd(to) },
      vytazenost: { vozidla: vehicleUtilization, vodici: driverUtilization },
      poplatkyZaSmeny: {
        vyzbierane: shiftFeesCollected,
        neuhradene: shiftFeesOutstanding,
        podlaVodicov: Array.from(byDriver.values()),
      },
    };

    if (isOwner) {
      const weekRevenues = await query<{
        celkovaTrzba: number; poplatokApp: number; provizia: number; celkovyPoplatok: number;
        uhradene: number; celkovyPoplatokRow: number;
      }>(
        "SELECT `trzba` AS celkovaTrzba, `poplatokApp`, `provizia`, `celkovyPoplatok` AS celkovyPoplatokRow, `uhradene` " +
          "FROM `Revenue` WHERE `isoRok` = ? AND `isoTyzden` = ?",
        [rok, tyzden]
      );
      const sumBy = (arr: typeof weekRevenues, key: keyof (typeof weekRevenues)[number]) =>
        arr.reduce((s, r) => s + Number(r[key]), 0);

      response.tyzden = {
        pocetVodicov: weekRevenues.length,
        celkovaTrzba: sumBy(weekRevenues, "celkovaTrzba"),
        poplatokApp: sumBy(weekRevenues, "poplatokApp"),
        provizia: sumBy(weekRevenues, "provizia"),
        celkovyPoplatok: sumBy(weekRevenues, "celkovyPoplatokRow"),
        uhradene: weekRevenues.filter((r) => r.uhradene === 1).reduce((s, r) => s + Number(r.celkovyPoplatokRow), 0),
        neuhradene: weekRevenues.filter((r) => r.uhradene !== 1).reduce((s, r) => s + Number(r.celkovyPoplatokRow), 0),
      };

      const unpaid = await query<{
        id: number; isoRok: number; isoTyzden: number; celkovyPoplatok: number;
        d_meno: string; d_priezvisko: string; d_volaciZnak: string | null;
      }>(
        "SELECT r.`id`, r.`isoRok`, r.`isoTyzden`, r.`celkovyPoplatok`, " +
          "d.`meno` AS d_meno, d.`priezvisko` AS d_priezvisko, d.`volaciZnak` AS d_volaciZnak " +
          "FROM `Revenue` r JOIN `User` d ON d.`id` = r.`driverId` " +
          "WHERE r.`uhradene` = 0 ORDER BY r.`isoRok` DESC, r.`isoTyzden` DESC",
        []
      );
      response.neuhradenePoplatky = {
        spolu: unpaid.reduce((s, r) => s + Number(r.celkovyPoplatok), 0),
        polozky: unpaid.map((r) => ({
          id: r.id, isoRok: r.isoRok, isoTyzden: r.isoTyzden, celkovyPoplatok: Number(r.celkovyPoplatok),
          driver: { meno: r.d_meno, priezvisko: r.d_priezvisko, volaciZnak: r.d_volaciZnak },
        })),
      };

      response.neuhradenaRegistracia = await query<{ id: number; meno: string; priezvisko: string; volaciZnak: string | null }>(
        "SELECT DISTINCT u.`id`, u.`meno`, u.`priezvisko`, u.`volaciZnak` FROM `User` u " +
          "JOIN `UserRole` ur ON ur.`userId` = u.`id` AND ur.`role` = 'VODIC' " +
          "WHERE u.`registracnyPoplatokUhradeny` = 0 AND u.`aktivny` = 1"
      );
    }

    return res.status(200).json(response);
  })
);
