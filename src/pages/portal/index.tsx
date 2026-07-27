"use client";

import { useEffect, useState } from "react";
import Head from "next/head";
import { PortalLayout } from "@/components/portal/PortalLayout";
import { apiFetch, formatEur, formatPoplatok } from "@/lib/portalClient";
import { isoWeekParts, type Obdobie } from "@/lib/fees";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const MESIACE = [
  "Január", "Február", "Marec", "Apríl", "Máj", "Jún",
  "Júl", "August", "September", "Október", "November", "December",
];

type Dashboard = {
  obdobie: { typ: Obdobie; rok: number; tyzden: number; mesiac: number; label: string };
  vytazenost: {
    vozidla: { vehicleId: number; nazov: string; spz: string; obsadenychSmien: number; maxSmien: number; vytazenostPct: number }[];
    vodici: { driverId: number; meno: string; priezvisko: string; volaciZnak: string | null; odpracovanychSmien: number; denne: number; nocne: number }[];
  };
  poplatkyZaSmeny: {
    vyzbierane: number;
    neuhradene: number;
    podlaVodicov: { driver: { meno: string; priezvisko: string; volaciZnak: string | null }; zaplatene: number; nezaplatene: number }[];
  };
  tyzden?: {
    pocetVodicov: number;
    celkovaTrzba: number;
    poplatokApp: number;
    provizia: number;
    celkovyPoplatok: number;
    uhradene: number;
    neuhradene: number;
  };
  neuhradenePoplatky?: { spolu: number; polozky: { id: number; isoRok: number; isoTyzden: number; celkovyPoplatok: number; driver: { meno: string; priezvisko: string; volaciZnak: string | null } }[] };
  neuhradenaRegistracia?: { id: number; meno: string; priezvisko: string; volaciZnak: string | null }[];
};

function Stat({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="text-sm text-muted-foreground">{label}</div>
        <div className="text-2xl font-bold">{value}</div>
        {hint && <div className="text-xs text-muted-foreground mt-1">{hint}</div>}
      </CardContent>
    </Card>
  );
}

export default function DashboardPage() {
  const nowParts = isoWeekParts(new Date());
  const [obdobie, setObdobie] = useState<Obdobie>("tyzden");
  const [rok, setRok] = useState(nowParts.isoRok);
  const [tyzden, setTyzden] = useState(nowParts.isoTyzden);
  const [mesiac, setMesiac] = useState(new Date().getMonth() + 1);
  const [data, setData] = useState<Dashboard | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setError(null);
    apiFetch<Dashboard>(
      `/api/portal/dashboard?obdobie=${obdobie}&rok=${rok}&tyzden=${tyzden}&mesiac=${mesiac}`
    )
      .then(setData)
      .catch((e) => setError(e.message));
  }, [obdobie, rok, tyzden, mesiac]);

  const suffix = obdobie === "tyzden" ? "(týž.)" : obdobie === "mesiac" ? "(mes.)" : "(rok)";

  return (
    <PortalLayout title="Dashboard">
      <Head><title>Dashboard — E-TAXI Portál</title></Head>

      <div className="flex flex-wrap gap-3 items-end mb-4">
        <div>
          <Label>Obdobie</Label>
          <Select value={obdobie} onValueChange={(v) => setObdobie(v as Obdobie)}>
            <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="tyzden">Týždeň</SelectItem>
              <SelectItem value="mesiac">Mesiac</SelectItem>
              <SelectItem value="rok">Rok</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Rok</Label>
          <Input type="number" className="w-24" value={rok} onChange={(e) => setRok(Number(e.target.value))} />
        </div>
        {obdobie === "tyzden" && (
          <div>
            <Label>ISO týždeň</Label>
            <Input type="number" min={1} max={53} className="w-24" value={tyzden} onChange={(e) => setTyzden(Number(e.target.value))} />
          </div>
        )}
        {obdobie === "mesiac" && (
          <div>
            <Label>Mesiac</Label>
            <Select value={String(mesiac)} onValueChange={(v) => setMesiac(Number(v))}>
              <SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
              <SelectContent>
                {MESIACE.map((m, i) => <SelectItem key={i} value={String(i + 1)}>{m}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        )}
        <Badge variant="secondary" className="mb-2">{data?.obdobie.label ?? "…"}</Badge>
      </div>

      {error && <p className="text-red-600">{error}</p>}
      {!data ? (
        <p className="text-muted-foreground">Načítavam…</p>
      ) : (
        <div className="space-y-6">
          {data.tyzden && (
            <>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <Stat label={`Celková tržba ${suffix}`} value={formatEur(data.tyzden.celkovaTrzba)} hint={`${data.tyzden.pocetVodicov} vodičov`} />
                <Stat label={`Poplatky spolu ${suffix}`} value={formatPoplatok(data.tyzden.celkovyPoplatok)} hint={`App ${formatPoplatok(data.tyzden.poplatokApp)} + provízia ${formatPoplatok(data.tyzden.provizia)}`} />
                <Stat label="Uhradené poplatky" value={formatPoplatok(data.tyzden.uhradene)} />
                <Stat label="Neuhradené poplatky" value={formatPoplatok(data.tyzden.neuhradene)} />
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <Stat label="Vyzbierané za smeny (prenájom)" value={formatPoplatok(data.poplatkyZaSmeny.vyzbierane)} hint="uhradené poplatky za smeny" />
                <Stat label="Neuhradené za smeny" value={formatPoplatok(data.poplatkyZaSmeny.neuhradene)} />
                <Stat label="Neuhradené poplatky (spolu)" value={formatPoplatok(data.neuhradenePoplatky?.spolu ?? 0)} hint="všetky týždne" />
                <Stat label="Neuhradená registrácia" value={String(data.neuhradenaRegistracia?.length ?? 0)} hint="vodičov" />
              </div>
            </>
          )}

          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader><CardTitle className="text-lg">Vyťaženosť vozidiel</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                {data.vytazenost.vozidla.length === 0 && <p className="text-muted-foreground text-sm">Žiadne vozidlá.</p>}
                {data.vytazenost.vozidla.map((v) => (
                  <div key={v.vehicleId}>
                    <div className="flex justify-between text-sm mb-1">
                      <span>{v.nazov} <span className="text-muted-foreground">({v.spz})</span></span>
                      <span>{v.obsadenychSmien}/{v.maxSmien} · {v.vytazenostPct}%</span>
                    </div>
                    <Progress value={v.vytazenostPct} />
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle className="text-lg">Vyťaženosť vodičov</CardTitle></CardHeader>
              <CardContent>
                {data.vytazenost.vodici.length === 0 && <p className="text-muted-foreground text-sm">Žiadni vodiči.</p>}
                <div className="space-y-2">
                  {data.vytazenost.vodici.map((d) => (
                    <div key={d.driverId} className="flex justify-between text-sm">
                      <span>{d.priezvisko} {d.meno} {d.volaciZnak ? <span className="text-muted-foreground">· {d.volaciZnak}</span> : null}</span>
                      <span className="text-muted-foreground">{d.odpracovanychSmien} smien (D {d.denne} / N {d.nocne})</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Kto zaplatil poplatok za prenájom auta na smene */}
          {data.poplatkyZaSmeny.podlaVodicov.length > 0 && (
            <Card>
              <CardHeader><CardTitle className="text-lg">Poplatky za prenájom auta — podľa vodičov</CardTitle></CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {data.poplatkyZaSmeny.podlaVodicov.map((p, i) => (
                    <div key={i} className="flex justify-between text-sm items-center">
                      <span>{p.driver.priezvisko} {p.driver.meno} {p.driver.volaciZnak ? `· ${p.driver.volaciZnak}` : ""}</span>
                      <span className="flex gap-2">
                        <Badge className="bg-green-600">Zaplatené {formatPoplatok(p.zaplatene)}</Badge>
                        {p.nezaplatene > 0 && <Badge variant="destructive">Dlží {formatPoplatok(p.nezaplatene)}</Badge>}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {data.neuhradenaRegistracia && data.neuhradenaRegistracia.length > 0 && (
            <Card>
              <CardHeader><CardTitle className="text-lg">Neuhradený registračný poplatok</CardTitle></CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {data.neuhradenaRegistracia.map((d) => (
                    <Badge key={d.id} variant="outline">
                      {d.priezvisko} {d.meno} {d.volaciZnak ? `· ${d.volaciZnak}` : ""}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </PortalLayout>
  );
}
