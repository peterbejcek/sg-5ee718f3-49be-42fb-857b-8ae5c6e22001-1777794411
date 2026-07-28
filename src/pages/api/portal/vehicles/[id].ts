import type { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";
import { query, execute } from "@/lib/db";
import { withAuth } from "@/lib/auth";
import { parseBody, withErrorHandler } from "@/lib/apiHelpers";
import { syncVehicleExpenses } from "@/lib/vehicleExpenses";

const druhPohonu = z.enum(["ELEKTRO", "HYBRID", "BENZIN", "DIESEL", "LPG", "CNG"]);

const updateSchema = z.object({
  nazov: z.string().min(1).optional(),
  znacka: z.string().min(1).optional(),
  model: z.string().min(1).optional(),
  farba: z.string().min(1).optional(),
  spz: z.string().min(1).optional(),
  druhPohonu: druhPohonu.optional(),
  poplatokZaSmenu: z.coerce.number().min(0).optional(),
  lizing: z.coerce.number().min(0).optional(),
  poistenie: z.coerce.number().min(0).optional(),
  aktivne: z.boolean().optional(),
});

type VehicleRow = {
  id: number; nazov: string; znacka: string; model: string; farba: string;
  spz: string; druhPohonu: string; poplatokZaSmenu: number; lizing: number; poistenie: number; aktivne: number;
};

function mapVehicle(v: VehicleRow) {
  return {
    ...v,
    poplatokZaSmenu: Number(v.poplatokZaSmenu),
    lizing: Number(v.lizing),
    poistenie: Number(v.poistenie),
    aktivne: v.aktivne === 1,
  };
}

export default withErrorHandler(
  withAuth(["MAJITEL"], async (req: NextApiRequest, res: NextApiResponse) => {
    const id = Number(req.query.id);
    if (!Number.isInteger(id)) return res.status(400).json({ message: "Neplatné ID" });

    if (req.method === "PUT") {
      const body = parseBody(req, res, updateSchema);
      if (!body) return;

      const sets: string[] = [];
      const params: any[] = [];
      const add = (col: string, val: unknown) => { sets.push(`\`${col}\` = ?`); params.push(val); };
      if (body.nazov !== undefined) add("nazov", body.nazov);
      if (body.znacka !== undefined) add("znacka", body.znacka);
      if (body.model !== undefined) add("model", body.model);
      if (body.farba !== undefined) add("farba", body.farba);
      if (body.spz !== undefined) add("spz", body.spz.toUpperCase().trim());
      if (body.druhPohonu !== undefined) add("druhPohonu", body.druhPohonu);
      if (body.poplatokZaSmenu !== undefined) add("poplatokZaSmenu", body.poplatokZaSmenu);
      if (body.lizing !== undefined) add("lizing", body.lizing);
      if (body.poistenie !== undefined) add("poistenie", body.poistenie);
      if (body.aktivne !== undefined) add("aktivne", body.aktivne ? 1 : 0);

      if (sets.length) {
        sets.push("`updatedAt` = NOW(3)");
        params.push(id);
        await execute(`UPDATE \`Vehicle\` SET ${sets.join(", ")} WHERE \`id\` = ?`, params);
      }
      const rows = await query<VehicleRow>("SELECT * FROM `Vehicle` WHERE `id` = ?", [id]);
      if (!rows.length) return res.status(404).json({ message: "Vozidlo neexistuje" });
      const v = mapVehicle(rows[0]);
      // Zosynchronizuj naviazané výdavky (lízing/poistenie) podľa aktuálnych hodnôt.
      await syncVehicleExpenses(v.id, v.nazov, v.lizing, v.poistenie);
      return res.status(200).json({ vehicle: v });
    }

    if (req.method === "DELETE") {
      await execute("DELETE FROM `Vehicle` WHERE `id` = ?", [id]);
      return res.status(200).json({ ok: true });
    }

    return res.status(405).json({ message: "Method not allowed" });
  })
);
