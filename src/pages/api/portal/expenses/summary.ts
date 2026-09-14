// Súhrn výdavkov za zvolené obdobie (týždeň / mesiac / rok) — celkový súčet
// a rozloženie podľa kategórií. Pravidelné výdavky sa rozpočítajú cez
// occurrencesInRange (rovnako ako v dashboarde). Len majiteľ.
import type { NextApiRequest, NextApiResponse } from "next";
import { query } from "@/lib/db";
import { withAuth } from "@/lib/auth";
import { withErrorHandler } from "@/lib/apiHelpers";
import { periodRange, isoWeekParts, type Obdobie } from "@/lib/fees";
import { expenseAmountInRange, type ExpenseInterval } from "@/lib/expenses";

const ymd = (d: Date) => d.toISOString().slice(0, 10);

export default withErrorHandler(
  withAuth(["MAJITEL"], async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method !== "GET") return res.status(405).json({ message: "Method not allowed" });

    const cur = isoWeekParts(new Date());
    const obdobie = (["tyzden", "mesiac", "rok"].includes(String(req.query.obdobie))
      ? req.query.obdobie
      : "mesiac") as Obdobie;
    const rok = req.query.rok ? Number(req.query.rok) : cur.isoRok;
    const tyzden = req.query.tyzden ? Number(req.query.tyzden) : cur.isoTyzden;
    const mesiac = req.query.mesiac ? Number(req.query.mesiac) : new Date().getUTCMonth() + 1;
    const range = periodRange(obdobie, { rok, tyzden, mesiac });

    const rows = await query<{ datum: string; suma: number; pravidelny: number; interval: string | null; c_nazov: string }>(
      "SELECT e.`datum`, e.`suma`, e.`pravidelny`, e.`interval`, c.`nazov` AS c_nazov " +
        "FROM `Expense` e JOIN `ExpenseCategory` c ON c.`id` = e.`categoryId`"
    );

    const byCat = new Map<string, number>();
    let spolu = 0;
    for (const e of rows) {
      const amount = expenseAmountInRange(
        { datum: e.datum, suma: Number(e.suma), pravidelny: e.pravidelny === 1, interval: e.interval as ExpenseInterval | null },
        range.from,
        range.to
      );
      if (amount === 0) continue;
      spolu += amount;
      byCat.set(e.c_nazov, (byCat.get(e.c_nazov) ?? 0) + amount);
    }

    return res.status(200).json({
      obdobie: { typ: obdobie, rok, tyzden, mesiac, label: range.label, from: ymd(range.from), to: ymd(range.to) },
      spolu: Math.round(spolu * 10) / 10,
      podlaKategorii: Array.from(byCat.entries())
        .map(([kategoria, suma]) => ({ kategoria, suma: Math.round(suma * 10) / 10 }))
        .sort((a, b) => b.suma - a.suma),
    });
  })
);
