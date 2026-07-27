"use client";

import { useEffect, useState } from "react";
import Head from "next/head";
import { PortalLayout } from "@/components/portal/PortalLayout";
import { apiFetch, formatPoplatok, SHIFT_LABELS } from "@/lib/portalClient";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

type Shift = {
  id: number; datum: string; typ: "DENNA" | "NOCNA" | "VOLNO";
  poplatokZaSmenu: number | null; poplatokUhradeny: boolean;
  vehicle: { nazov: string; spz: string } | null;
};

export default function MojeSmenyPage() {
  const [shifts, setShifts] = useState<Shift[]>([]);
  useEffect(() => {
    apiFetch<{ shifts: Shift[] }>("/api/portal/me/shifts").then((d) => setShifts(d.shifts));
  }, []);

  return (
    <PortalLayout title="Moje smeny">
      <Head><title>Moje smeny — E-TAXI Portál</title></Head>
      <div className="bg-white rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Dátum</TableHead><TableHead>Smena</TableHead>
              <TableHead>Vozidlo</TableHead><TableHead>Poplatok za prenájom</TableHead><TableHead>Stav úhrady</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {shifts.map((s) => (
              <TableRow key={s.id}>
                <TableCell>{s.datum.slice(0, 10)}</TableCell>
                <TableCell>{SHIFT_LABELS[s.typ]}</TableCell>
                <TableCell>{s.vehicle ? `${s.vehicle.nazov} (${s.vehicle.spz})` : "—"}</TableCell>
                <TableCell>{s.poplatokZaSmenu != null ? formatPoplatok(s.poplatokZaSmenu) : "—"}</TableCell>
                <TableCell>
                  {s.typ === "VOLNO" || s.poplatokZaSmenu == null ? "—"
                    : s.poplatokUhradeny ? <Badge className="bg-green-600">Uhradený</Badge> : <Badge variant="destructive">Neuhradený</Badge>}
                </TableCell>
              </TableRow>
            ))}
            {shifts.length === 0 && <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground py-6">Zatiaľ žiadne smeny.</TableCell></TableRow>}
          </TableBody>
        </Table>
      </div>
    </PortalLayout>
  );
}
