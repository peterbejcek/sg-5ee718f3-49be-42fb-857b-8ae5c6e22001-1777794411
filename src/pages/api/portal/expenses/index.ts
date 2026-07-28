import type { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";
import { query, execute, toBool } from "@/lib/db";
import { withAuth } from "@/lib/auth";
import { parseBody, withErrorHandler } from "@/lib/apiHelpers";

const interval = z.enum(["TYZDENNE", "MESACNE", "STVRTROCNE", "POLROCNE", "ROCNE"]);

const createSchema = z.object({
  datum: z.string().min(8), // YYYY-MM-DD
  popis: z.string().min(1),
  categoryId: z.coerce.number().int(),
  suma: z.coerce.number().min(0),
  uhradene: z.boolean().default(false),
  pravidelny: z.boolean().default(false),
  interval: interval.nullable().optional(),
});

type ExpenseRow = {
  id: number; datum: string; popis: string; suma: number; uhradene: number;
  uhradeneDna: string | null; pravidelny: number; interval: string | null;
  categoryId: number; c_nazov: string; vehicleId: number | null; v_nazov: string | null; zdroj: string;
};

const SELECT_JOIN =
  "SELECT e.*, c.`nazov` AS c_nazov, v.`nazov` AS v_nazov " +
  "FROM `Expense` e JOIN `ExpenseCategory` c ON c.`id` = e.`categoryId` " +
  "LEFT JOIN `Vehicle` v ON v.`id` = e.`vehicleId` ";

export function mapExpense(e: ExpenseRow) {
  return {
    id: e.id, datum: e.datum, popis: e.popis, suma: Number(e.suma),
    uhradene: toBool(e.uhradene), uhradeneDna: e.uhradeneDna,
    pravidelny: toBool(e.pravidelny), interval: e.interval,
    categoryId: e.categoryId, kategoria: e.c_nazov,
    vehicleId: e.vehicleId, vozidlo: e.v_nazov, zdroj: e.zdroj,
  };
}

export default withErrorHandler(
  withAuth(["MAJITEL"], async (req: NextApiRequest, res: NextApiResponse, ctx) => {
    if (req.method === "GET") {
      const where: string[] = [];
      const params: any[] = [];
      if (req.query.rok) { where.push("YEAR(e.`datum`) = ?"); params.push(Number(req.query.rok)); }
      if (req.query.categoryId) { where.push("e.`categoryId` = ?"); params.push(Number(req.query.categoryId)); }
      const whereSql = where.length ? "WHERE " + where.join(" AND ") : "";
      const rows = await query<ExpenseRow>(
        SELECT_JOIN + whereSql + " ORDER BY e.`datum` DESC, e.`id` DESC",
        params
      );
      return res.status(200).json({ expenses: rows.map(mapExpense) });
    }

    if (req.method === "POST") {
      const body = parseBody(req, res, createSchema);
      if (!body) return;
      const r = await execute(
        "INSERT INTO `Expense` (`datum`,`popis`,`suma`,`uhradene`,`uhradeneDna`,`pravidelny`,`interval`,`categoryId`,`zdroj`,`createdById`,`createdAt`,`updatedAt`) " +
          "VALUES (?,?,?,?,?,?,?,?,'MANUAL',?,NOW(3),NOW(3))",
        [
          body.datum.slice(0, 10), body.popis.trim(), body.suma,
          body.uhradene ? 1 : 0, body.uhradene ? new Date() : null,
          body.pravidelny ? 1 : 0, body.pravidelny ? body.interval ?? "MESACNE" : null,
          body.categoryId, ctx.userId,
        ]
      );
      const rows = await query<ExpenseRow>(SELECT_JOIN + "WHERE e.`id` = ?", [r.insertId]);
      return res.status(201).json({ expense: rows.length ? mapExpense(rows[0]) : null });
    }

    return res.status(405).json({ message: "Method not allowed" });
  })
);
