"use client";

import { useCallback, useEffect, useState } from "react";
import Head from "next/head";
import { PortalLayout } from "@/components/portal/PortalLayout";
import { apiFetch, formatPoplatok, DAY_NAMES } from "@/lib/portalClient";
import { isoWeekParts, isoWeekDateRange } from "@/lib/fees";
import { SHIFT_PATTERNS } from "@/lib/shiftPatterns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

type Driver = { id: number; meno: string; priezvisko: string; volaciZnak: string | null };
type Vehicle = { id: number; nazov: string; spz: string; poplatokZaSmenu: number };
type Shift = {
  id: number; driverId: number; datum: string; typ: "DENNA" | "NOCNA" | "VOLNO";
  vehicleId: number | null; poplatokZaSmenu: number | null; poplatokUhradeny: boolean;
};

const TYP_SKRATKA: Record<string, string> = { DENNA: "D", NOCNA: "N", VOLNO: "V" };
const TYP_COLOR: Record<string, string> = {
  DENNA: "bg-amber-100 text-amber-800", NOCNA: "bg-indigo-100 text-indigo-800", VOLNO: "bg-gray-100 text-gray-500",
};

function ymd(d: Date) { return d.toISOString().slice(0, 10); }

export default function SmenyPage() {
  const { toast } = useToast();
  const now = isoWeekParts(new Date());
  const [rok, setRok] = useState(now.isoRok);
  const [tyzden, setTyzden] = useState(now.isoTyzden);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [edit, setEdit] = useState<{ driver: Driver; datum: string; shift?: Shift } | null>(null);
  const [genOpen, setGenOpen] = useState(false);

  const { dni } = isoWeekDateRange(rok, tyzden);

  const load = useCallback(() => {
    apiFetch<{ drivers: Driver[]; vehicles: Vehicle[] }>("/api/portal/refs").then((d) => {
      setDrivers(d.drivers); setVehicles(d.vehicles);
    });
    apiFetch<{ shifts: Shift[] }>(`/api/portal/shifts?rok=${rok}&tyzden=${tyzden}`).then((d) => setShifts(d.shifts));
  }, [rok, tyzden]);
  useEffect(load, [load]);

  function cellShift(driverId: number, datum: string): Shift | undefined {
    return shifts.find((s) => s.driverId === driverId && s.datum.slice(0, 10) === datum);
  }

  return (
    <PortalLayout title="Rozpis smien">
      <Head><title>Rozpis smien — E-TAXI Portál</title></Head>

      <div className="flex flex-wrap gap-3 items-end mb-4">
        <div><Label>Rok</Label><Input type="number" className="w-24" value={rok} onChange={(e) => setRok(Number(e.target.value))} /></div>
        <div><Label>ISO týždeň</Label><Input type="number" min={1} max={53} className="w-24" value={tyzden} onChange={(e) => setTyzden(Number(e.target.value))} /></div>
        <Badge variant="secondary" className="mb-2">Týždeň {tyzden}/{rok}</Badge>
        <Button className="mb-2" onClick={() => setGenOpen(true)}>Generovať rozpis podľa vzoru</Button>
        <span className="text-xs text-muted-foreground mb-2">D = denná · N = nočná · V = voľno. Kliknite na bunku pre úpravu.</span>
      </div>

      <div className="bg-white rounded-md border overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/40">
              <th className="text-left p-2 sticky left-0 bg-muted/40">Vodič</th>
              {dni.map((d, i) => (
                <th key={i} className="p-2 text-center whitespace-nowrap">
                  {DAY_NAMES[i]}<br /><span className="text-xs text-muted-foreground">{d.getUTCDate()}.{d.getUTCMonth() + 1}.</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {drivers.map((dr) => (
              <tr key={dr.id} className="border-b">
                <td className="p-2 font-medium whitespace-nowrap sticky left-0 bg-white">
                  {dr.priezvisko} {dr.meno}{dr.volaciZnak ? <span className="text-muted-foreground"> · {dr.volaciZnak}</span> : null}
                </td>
                {dni.map((d) => {
                  const datum = ymd(d);
                  const s = cellShift(dr.id, datum);
                  const veh = s?.vehicleId ? vehicles.find((v) => v.id === s.vehicleId) : undefined;
                  return (
                    <td key={datum} className="p-1 text-center">
                      <button
                        className={`w-full rounded px-1 py-2 hover:ring-2 ring-[#282462]/40 ${s ? TYP_COLOR[s.typ] : "bg-gray-50 text-gray-300"}`}
                        onClick={() => setEdit({ driver: dr, datum, shift: s })}
                        title={veh ? `${veh.nazov}` : ""}
                      >
                        <div className="font-bold">{s ? TYP_SKRATKA[s.typ] : "—"}</div>
                        {veh && <div className="text-[10px] leading-tight">{veh.nazov}</div>}
                        {s && s.typ !== "VOLNO" && s.poplatokZaSmenu != null && (
                          <div className={`text-[10px] ${s.poplatokUhradeny ? "text-green-600" : "text-red-500"}`}>
                            {s.poplatokUhradeny ? "✓" : "€"}
                          </div>
                        )}
                      </button>
                    </td>
                  );
                })}
              </tr>
            ))}
            {drivers.length === 0 && <tr><td colSpan={8} className="text-center text-muted-foreground py-6">Žiadni aktívni vodiči.</td></tr>}
          </tbody>
        </table>
      </div>

      {edit && (
        <ShiftEditor
          driver={edit.driver}
          datum={edit.datum}
          shift={edit.shift}
          vehicles={vehicles}
          onClose={() => setEdit(null)}
          onSaved={() => { setEdit(null); load(); toast({ title: "Uložené" }); }}
          onError={(m) => toast({ title: "Chyba", description: m, variant: "destructive" })}
        />
      )}

      {genOpen && (
        <GeneratorDialog
          drivers={drivers}
          vehicles={vehicles}
          defaultStart={dni[0] ? ymd(dni[0]) : ""}
          onClose={() => setGenOpen(false)}
          onDone={(pocet) => {
            setGenOpen(false);
            load();
            toast({ title: "Rozpis vygenerovaný", description: `Doplnených ${pocet} dní.` });
          }}
          onError={(m) => toast({ title: "Chyba", description: m, variant: "destructive" })}
        />
      )}
    </PortalLayout>
  );
}

function GeneratorDialog({
  drivers, vehicles, defaultStart, onClose, onDone, onError,
}: {
  drivers: Driver[];
  vehicles: Vehicle[];
  defaultStart: string;
  onClose: () => void;
  onDone: (pocet: number) => void;
  onError: (m: string) => void;
}) {
  const [driverId, setDriverId] = useState<string>(drivers[0] ? String(drivers[0].id) : "");
  const [patternKey, setPatternKey] = useState<string>(SHIFT_PATTERNS[0].key);
  const [vehicleId, setVehicleId] = useState<string>("none");
  const [startDate, setStartDate] = useState<string>(defaultStart);
  const [weeks, setWeeks] = useState<number>(4);
  const [overwrite, setOverwrite] = useState<boolean>(true);
  const [busy, setBusy] = useState(false);

  async function generate() {
    if (!driverId) { onError("Vyberte vodiča."); return; }
    setBusy(true);
    try {
      const r = await apiFetch<{ pocet: number }>("/api/portal/shifts/generate", {
        method: "POST",
        body: JSON.stringify({
          driverId: Number(driverId),
          patternKey,
          startDate,
          weeks,
          vehicleId: vehicleId === "none" ? null : Number(vehicleId),
          overwrite,
        }),
      });
      onDone(r.pocet);
    } catch (e) {
      onError(e instanceof Error ? e.message : "Generovanie zlyhalo");
    } finally {
      setBusy(false);
    }
  }

  const pattern = SHIFT_PATTERNS.find((p) => p.key === patternKey);

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Generovať rozpis podľa vzoru</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <div>
            <Label>Vodič</Label>
            <Select value={driverId} onValueChange={setDriverId}>
              <SelectTrigger><SelectValue placeholder="Vyberte vodiča" /></SelectTrigger>
              <SelectContent>
                {drivers.map((d) => (
                  <SelectItem key={d.id} value={String(d.id)}>
                    {d.priezvisko} {d.meno}{d.volaciZnak ? ` · ${d.volaciZnak}` : ""}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Vzor rotácie (kľúč)</Label>
            <Select value={patternKey} onValueChange={setPatternKey}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {SHIFT_PATTERNS.map((p) => (
                  <SelectItem key={p.key} value={p.key}>{p.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {pattern && (
              <div className="text-[11px] text-muted-foreground mt-1 font-mono">
                1. týždeň: {pattern.dni.slice(0, 7).join(" ")}
              </div>
            )}
          </div>
          <div>
            <Label>Vozidlo (poplatok za smenu sa načíta z neho)</Label>
            <Select value={vehicleId} onValueChange={setVehicleId}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="none">— žiadne —</SelectItem>
                {vehicles.map((v) => (
                  <SelectItem key={v.id} value={String(v.id)}>{v.nazov} ({v.spz})</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Od dátumu (pondelok)</Label>
              <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
            </div>
            <div>
              <Label>Počet týždňov</Label>
              <Input type="number" min={1} max={26} value={weeks} onChange={(e) => setWeeks(Number(e.target.value))} />
            </div>
          </div>
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <Checkbox checked={overwrite} onCheckedChange={(v) => setOverwrite(!!v)} />
            Prepísať existujúce smeny v tomto období
          </label>
        </div>
        <DialogFooter>
          <Button onClick={generate} disabled={busy}>{busy ? "Generujem…" : "Generovať"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function ShiftEditor({
  driver, datum, shift, vehicles, onClose, onSaved, onError,
}: {
  driver: Driver; datum: string; shift?: Shift; vehicles: Vehicle[];
  onClose: () => void; onSaved: () => void; onError: (m: string) => void;
}) {
  const [typ, setTyp] = useState<Shift["typ"]>(shift?.typ ?? "VOLNO");
  const [vehicleId, setVehicleId] = useState<string>(shift?.vehicleId ? String(shift.vehicleId) : "none");
  const [poplatok, setPoplatok] = useState<string>(shift?.poplatokZaSmenu != null ? String(shift.poplatokZaSmenu) : "");
  const [uhradeny, setUhradeny] = useState<boolean>(shift?.poplatokUhradeny ?? false);

  function vehDefaultFee(id: string) {
    const v = vehicles.find((x) => String(x.id) === id);
    return v ? String(v.poplatokZaSmenu) : "";
  }

  async function save() {
    try {
      // upsert typ + vozidlo + poplatok
      await apiFetch("/api/portal/shifts", {
        method: "POST",
        body: JSON.stringify({
          driverId: driver.id, datum, typ,
          vehicleId: vehicleId === "none" ? null : Number(vehicleId),
          poplatokZaSmenu: poplatok === "" ? null : Number(poplatok),
        }),
      });
      // úhrada poplatku sa nastavuje cez PUT (potrebuje id) — načítaj po upserte
      if (shift?.id !== undefined) {
        await apiFetch(`/api/portal/shifts/${shift.id}`, { method: "PUT", body: JSON.stringify({ poplatokUhradeny: uhradeny }) });
      } else if (uhradeny) {
        // nový shift — dohľadaj a označ
        const wk = isoWeekParts(new Date(`${datum}T00:00:00Z`));
        const d = await apiFetch<{ shifts: Shift[] }>(`/api/portal/shifts?rok=${wk.isoRok}&tyzden=${wk.isoTyzden}`);
        const found = d.shifts.find((s) => s.driverId === driver.id && s.datum.slice(0, 10) === datum);
        if (found) await apiFetch(`/api/portal/shifts/${found.id}`, { method: "PUT", body: JSON.stringify({ poplatokUhradeny: true }) });
      }
      onSaved();
    } catch (e) {
      onError(e instanceof Error ? e.message : "Uloženie zlyhalo");
    }
  }

  async function remove() {
    if (!shift?.id) { onClose(); return; }
    try { await apiFetch(`/api/portal/shifts/${shift.id}`, { method: "DELETE" }); onSaved(); }
    catch (e) { onError(e instanceof Error ? e.message : ""); }
  }

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{driver.priezvisko} {driver.meno} — {datum}</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <div>
            <Label>Typ smeny</Label>
            <Select value={typ} onValueChange={(v) => setTyp(v as Shift["typ"])}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="DENNA">Denná (D)</SelectItem>
                <SelectItem value="NOCNA">Nočná (N)</SelectItem>
                <SelectItem value="VOLNO">Voľno (V)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {typ !== "VOLNO" && (
            <>
              <div>
                <Label>Vozidlo</Label>
                <Select value={vehicleId} onValueChange={(v) => { setVehicleId(v); if (poplatok === "") setPoplatok(vehDefaultFee(v)); }}>
                  <SelectTrigger><SelectValue placeholder="—" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">— žiadne —</SelectItem>
                    {vehicles.map((v) => <SelectItem key={v.id} value={String(v.id)}>{v.nazov} ({v.spz})</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Poplatok za smenu / prenájom (€)</Label>
                <Input type="number" step="0.01" value={poplatok} onChange={(e) => setPoplatok(e.target.value)} placeholder="predvolené z vozidla" />
              </div>
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <Checkbox checked={uhradeny} onCheckedChange={(v) => setUhradeny(!!v)} />
                Poplatok uhradený {poplatok && `(${formatPoplatok(Number(poplatok))})`}
              </label>
            </>
          )}
        </div>
        <DialogFooter className="justify-between">
          {shift?.id ? <Button variant="ghost" className="text-red-600" onClick={remove}>Zmazať</Button> : <span />}
          <Button onClick={save}>Uložiť</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
