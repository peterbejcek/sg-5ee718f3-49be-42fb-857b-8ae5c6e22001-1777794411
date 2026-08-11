// Priradenie voľnej smeny. Vodič si ju priradí sebe; majiteľ/dispečer môže
// vybrať vodiča. Nedá sa priradiť do minulosti ani na už obsadený slot.
import type { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";
import { queryOne, execute } from "@/lib/db";
import { withAuth } from "@/lib/auth";
import { parseBody, withErrorHandler } from "@/lib/apiHelpers";

const schema = z.object({
  vehicleId: z.coerce.number().int(),
  datum: z.string().min(8), // YYYY-MM-DD
  typ: z.enum(["DENNA", "NOCNA"]),
  driverId: z.coerce.number().int().optional(),
});

const ymdToday = () => new Date().toISOString().slice(0, 10);

export default withErrorHandler(
  withAuth(["VODIC", "DISPECER", "MAJITEL"], async (req: NextApiRequest, res: NextApiResponse, ctx) => {
    if (req.method !== "POST") return res.status(405).json({ message: "Method not allowed" });

    const body = parseBody(req, res, schema);
    if (!body) return;
    const datum = body.datum.slice(0, 10);

    if (datum < ymdToday()) {
      return res.status(400).json({ message: "Nedá sa priradiť smenu v minulosti." });
    }

    const canAssignOthers = ctx.session.roles.includes("MAJITEL") || ctx.session.roles.includes("DISPECER");
    let driverId = ctx.userId;
    if (body.driverId && body.driverId !== ctx.userId) {
      if (!canAssignOthers) {
        return res.status(403).json({ message: "Smenu si môžete priradiť len sebe." });
      }
      driverId = body.driverId;
    }

    const vehicle = await queryOne<{ poplatokZaSmenu: number; nazov: string }>(
      "SELECT `poplatokZaSmenu`, `nazov` FROM `Vehicle` WHERE `id` = ?",
      [body.vehicleId]
    );
    if (!vehicle) return res.status(404).json({ message: "Vozidlo neexistuje." });

    // Vozidlo nesmie byť v danom termíne blokované (nedostupné / servis).
    const block = await queryOne<{ typ: string }>(
      "SELECT `typ` FROM `VehicleBlock` WHERE `vehicleId` = ? AND ? BETWEEN `datumOd` AND `datumDo` LIMIT 1",
      [body.vehicleId, datum]
    );
    if (block) {
      return res.status(409).json({
        message: `Vozidlo je v tomto termíne ${block.typ === "SERVIS" ? "v servise" : "nedostupné"}.`,
      });
    }

    // Slot musí byť voľný.
    const occupied = await queryOne<{ id: number }>(
      "SELECT `id` FROM `Shift` WHERE `vehicleId` = ? AND `datum` = ? AND `typ` = ?",
      [body.vehicleId, datum, body.typ]
    );
    if (occupied) return res.status(409).json({ message: "Táto smena je už obsadená." });

    // Vodič môže mať v daný deň len jednu smenu.
    const sameDay = await queryOne<{ id: number; typ: string }>(
      "SELECT `id`, `typ` FROM `Shift` WHERE `driverId` = ? AND `datum` = ?",
      [driverId, datum]
    );
    if (sameDay && sameDay.typ !== "VOLNO") {
      return res.status(409).json({ message: canAssignOthers ? "Vodič už má smenu v tento deň." : "V tento deň už máte smenu." });
    }

    if (sameDay && sameDay.typ === "VOLNO") {
      // V daný deň má vodič voľno — prepíšeme ho na zvolenú smenu.
      await execute(
        "UPDATE `Shift` SET `typ` = ?, `vehicleId` = ?, `poplatokZaSmenu` = ?, `updatedAt` = NOW(3) WHERE `id` = ?",
        [body.typ, body.vehicleId, Number(vehicle.poplatokZaSmenu), sameDay.id]
      );
    } else {
      await execute(
        "INSERT INTO `Shift` (`driverId`,`datum`,`typ`,`vehicleId`,`poplatokZaSmenu`,`createdById`,`createdAt`,`updatedAt`) " +
          "VALUES (?,?,?,?,?,?,NOW(3),NOW(3))",
        [driverId, datum, body.typ, body.vehicleId, Number(vehicle.poplatokZaSmenu), ctx.userId]
      );
    }

    return res.status(200).json({ ok: true });
  })
);
