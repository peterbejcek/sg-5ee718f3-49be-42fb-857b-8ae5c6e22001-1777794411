import type { NextApiRequest, NextApiResponse } from "next";
import { query } from "@/lib/db";
import { withAuth } from "@/lib/auth";
import { withErrorHandler } from "@/lib/apiHelpers";
import { periodRange, weeksInRange, isoWeekParts, type Obdobie } from "@/lib/fees";
import { expenseAmountInRange, type ExpenseInterval } from "@/lib/expenses";

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
    const obdobie = (["tyzden", "mesiac", "rok"].includes(String(req.query.obdobie))
      ? req.query.obdobie
      : "tyzden") as Obdobie;
    const rok = req.query.rok ? Number(req.query.rok) : cur.isoRok;
    const tyzden = req.query.tyzden ? Number(req.query.tyzden) : cur.isoTyzden;
    const mesiac = req.query.mesiac ? Number(req.query.mesiac) : new Date().getUTCMonth() + 1;
    const range = periodRange(obdobie, { rok, tyzden, mesiac });
    const from = range.from;
    const to = range.to;
    const pocetDni = range.dni;

    const isOwner = ctx.session.roles.includes("MAJITEL");

    const vehicles = await query<{ id: number; nazov: string; spz: string }>(
      "SELECT `id`, `nazov`, `spz` FROM `Vehicle` WHERE `aktivne` = 1 ORDER BY `nazov` ASC"
    );
    const drivers = await query<{ id: number; meno: string; priezvisko: string; volaciZnak: string | null }>(
      "SELECT u.`id`, u.`meno`, u.`priezvisko`, u.`volaciZnak` FROM `User` u " +
        "JOIN `UserRole` ur ON ur.`userId` = u.`id` AND ur.`role` = 'VODIC' " +
        "WHERE u.`aktivny` = 1 ORDER BY (u.`volaciZnak` IS NULL), u.`volaciZnak` ASC, u.`priezvisko` ASC"
    );
    const shifts = await query<ShiftRow>(
      "SELECT s.`id`, s.`datum`, s.`typ`, s.`driverId`, s.`vehicleId`, s.`poplatokZaSmenu`, s.`poplatokUhradeny`, " +
        "d.`meno` AS d_meno, d.`priezvisko` AS d_priezvisko, d.`volaciZnak` AS d_volaciZnak " +
        "FROM `Shift` s JOIN `User` d ON d.`id` = s.`driverId` WHERE s.`datum` BETWEEN ? AND ?",
      [ymd(from), ymd(to)]
    );

    const worked = shifts.filter((s) => s.typ !== "VOLNO");
    const maxSlots = pocetDni * 2;

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
      obdobie: { typ: obdobie, rok, tyzden, mesiac, label: range.label, from: ymd(from), to: ymd(to) },
      vytazenost: { vozidla: vehicleUtilization, vodici: driverUtilization },
      poplatkyZaSmeny: {
        vyzbierane: shiftFeesCollected,
        neuhradene: shiftFeesOutstanding,
        podlaVodicov: Array.from(byDriver.values()),
      },
    };

    if (isOwner) {
      const weeks = weeksInRange(from, to);
      const weekKeys = weeks.map((w) => w.isoRok * 100 + w.isoTyzden);
      const placeholders = weekKeys.length ? weekKeys.map(() => "?").join(",") : "NULL";
      const weekRevenues = weekKeys.length
        ? await query<{
            driverId: number; celkovaTrzba: number; poplatokApp: number; provizia: number;
            uhradene: number; celkovyPoplatokRow: number;
          }>(
            "SELECT `driverId`, `trzba` AS celkovaTrzba, `poplatokApp`, `provizia`, `celkovyPoplatok` AS celkovyPoplatokRow, `uhradene` " +
              `FROM \`Revenue\` WHERE (\`isoRok\` * 100 + \`isoTyzden\`) IN (${placeholders})`,
            weekKeys
          )
        : [];
      const sumBy = (arr: typeof weekRevenues, key: keyof (typeof weekRevenues)[number]) =>
        arr.reduce((s, r) => s + Number(r[key]), 0);
      const pocetVodicov = new Set(weekRevenues.map((r) => r.driverId)).size;

      response.tyzden = {
        pocetVodicov,
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

      // ── Výdavky za obdobie (pravidelné sa rozvinú na počet výskytov) ─────────
      const expenseRows = await query<{
        datum: string; suma: number; pravidelny: number; interval: string | null; c_nazov: string;
      }>(
        "SELECT e.`datum`, e.`suma`, e.`pravidelny`, e.`interval`, c.`nazov` AS c_nazov " +
          "FROM `Expense` e JOIN `ExpenseCategory` c ON c.`id` = e.`categoryId`"
      );
      const byCat = new Map<string, number>();
      let vydavkySpolu = 0;
      for (const e of expenseRows) {
        const amount = expenseAmountInRange(
          { datum: e.datum, suma: Number(e.suma), pravidelny: e.pravidelny === 1, interval: (e.interval as ExpenseInterval | null) },
          from,
          to
        );
        if (amount === 0) continue;
        vydavkySpolu += amount;
        byCat.set(e.c_nazov, (byCat.get(e.c_nazov) ?? 0) + amount);
      }
      const vydavkyPodlaKategorii = Array.from(byCat.entries())
        .map(([kategoria, suma]) => ({ kategoria, suma: Math.round(suma * 10) / 10 }))
        .sort((a, b) => b.suma - a.suma);

      // Príjem firmy = poplatky od vodičov (nie tržba): týždenné poplatky + poplatky za smeny.
      const prijmy = sumBy(weekRevenues, "celkovyPoplatokRow") + shiftFeesCollected + shiftFeesOutstanding;
      const vydavky = Math.round(vydavkySpolu * 10) / 10;
      const zisk = Math.round((prijmy - vydavky) * 10) / 10;

      response.financie = {
        prijmy: Math.round(prijmy * 10) / 10,
        vydavky,
        zisk,
        vydavkyPodlaKategorii,
      };
    }

    return res.status(200).json(response);
  })
);
