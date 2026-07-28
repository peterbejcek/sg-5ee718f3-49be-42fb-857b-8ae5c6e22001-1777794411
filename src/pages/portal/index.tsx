"use client";

import { useEffect, useState } from "react";
import Head from "next/head";
import { PortalLayout, useCurrentUser } from "@/components/portal/PortalLayout";
import { apiFetch, formatEur } from "@/lib/portalClient";
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
  obdobie: { typ?: Obdobie; rok: number; tyzden: number; mesiac?: number; label?: string };
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
  financie?: {
    prijmy: number;
    vydavky: number;
    zisk: number;
    vydavkyPodlaKategorii: { kategoria: string; suma: number }[];
  };
};

const CHART_COLORS = [
  "#282462", "#ff9500", "#28a745", "#e83e8c", "#17a2b8",
  "#6f42c1", "#fd7e14", "#20c997", "#dc3545", "#6610f2",
];

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
  const { user } = useCurrentUser();
  const isOwner = user?.roles.includes("MAJITEL") ?? false;
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
        {/* Prepínač obdobia je len pre majiteľa */}
        {isOwner && (
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
        )}
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
        <Badge variant="secondary" className="mb-2">{data?.obdobie.label ?? `Týždeň ${tyzden}/${rok}`}</Badge>
      </div>

      {error && <p className="text-red-600 mb-3">{error}</p>}
      {!data && !error ? (
        <p className="text-muted-foreground">Načítavam…</p>
      ) : !data ? null : (
        <div className="space-y-6">
          {data.tyzden && (
            <>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <Stat label={`Celková tržba ${suffix}`} value={formatEur(data.tyzden.celkovaTrzba)} hint={`${data.tyzden.pocetVodicov} vodičov`} />
                <Stat label={`Poplatky spolu ${suffix}`} value={formatEur(data.tyzden.celkovyPoplatok)} hint={`App ${formatEur(data.tyzden.poplatokApp)} + provízia ${formatEur(data.tyzden.provizia)}`} />
                <Stat label="Uhradené poplatky" value={formatEur(data.tyzden.uhradene)} />
                <Stat label="Neuhradené poplatky" value={formatEur(data.tyzden.neuhradene)} />
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <Stat label="Vyzbierané za smeny (prenájom)" value={formatEur(data.poplatkyZaSmeny.vyzbierane)} hint="uhradené poplatky za smeny" />
                <Stat label="Neuhradené za smeny" value={formatEur(data.poplatkyZaSmeny.neuhradene)} />
                <Stat label="Neuhradené poplatky (spolu)" value={formatEur(data.neuhradenePoplatky?.spolu ?? 0)} hint="všetky týždne" />
                <Stat label="Neuhradená registrácia" value={String(data.neuhradenaRegistracia?.length ?? 0)} hint="vodičov" />
              </div>
            </>
          )}

          {data.financie && (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                <Stat label={`Príjmy (poplatky) ${suffix}`} value={formatEur(data.financie.prijmy)} hint="poplatky od vodičov" />
                <Stat label={`Výdavky ${suffix}`} value={formatEur(data.financie.vydavky)} />
                <Card>
                  <CardContent className="p-4">
                    <div className="text-sm text-muted-foreground">Zisk / strata {suffix}</div>
                    <div className={`text-2xl font-bold ${data.financie.zisk >= 0 ? "text-green-600" : "text-red-600"}`}>
                      {formatEur(data.financie.zisk)}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">príjmy − výdavky</div>
                  </CardContent>
                </Card>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader><CardTitle className="text-lg">Rozloženie výdavkov</CardTitle></CardHeader>
                  <CardContent>
                    {data.financie.vydavkyPodlaKategorii.length === 0 ? (
                      <p className="text-muted-foreground text-sm">Žiadne výdavky za obdobie.</p>
                    ) : (
                      <DonutChart data={data.financie.vydavkyPodlaKategorii.map((c, i) => ({
                        label: c.kategoria, value: c.suma, color: CHART_COLORS[i % CHART_COLORS.length],
                      }))} />
                    )}
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader><CardTitle className="text-lg">Zisk / strata</CardTitle></CardHeader>
                  <CardContent>
                    <ProfitChart prijmy={data.financie.prijmy} vydavky={data.financie.vydavky} zisk={data.financie.zisk} />
                  </CardContent>
                </Card>
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
                        <Badge className="bg-green-600">Zaplatené {formatEur(p.zaplatene)}</Badge>
                        {p.nezaplatene > 0 && <Badge variant="destructive">Dlží {formatEur(p.nezaplatene)}</Badge>}
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

// ── Jednoduché SVG grafy (bez externých knižníc) ───────────────────────────────

function DonutChart({ data }: { data: { label: string; value: number; color: string }[] }) {
  const total = data.reduce((s, d) => s + d.value, 0);
  const R = 60, r = 38, cx = 70, cy = 70;
  let angle = -Math.PI / 2;
  const arcs = data.map((d) => {
    const frac = total > 0 ? d.value / total : 0;
    const start = angle;
    const end = angle + frac * 2 * Math.PI;
    angle = end;
    const large = end - start > Math.PI ? 1 : 0;
    const x1 = cx + R * Math.cos(start), y1 = cy + R * Math.sin(start);
    const x2 = cx + R * Math.cos(end), y2 = cy + R * Math.sin(end);
    const xi2 = cx + r * Math.cos(end), yi2 = cy + r * Math.sin(end);
    const xi1 = cx + r * Math.cos(start), yi1 = cy + r * Math.sin(start);
    const dPath = `M ${x1} ${y1} A ${R} ${R} 0 ${large} 1 ${x2} ${y2} L ${xi2} ${yi2} A ${r} ${r} 0 ${large} 0 ${xi1} ${yi1} Z`;
    return { d, dPath, frac };
  });
  return (
    <div className="flex flex-col sm:flex-row items-center gap-4">
      <svg width="140" height="140" viewBox="0 0 140 140" className="shrink-0">
        {total === 0 ? (
          <circle cx={cx} cy={cy} r={R} fill="none" stroke="#e5e7eb" strokeWidth={R - r} />
        ) : (
          arcs.map((a, i) => <path key={i} d={a.dPath} fill={data[i].color} />)
        )}
      </svg>
      <div className="space-y-1 text-sm w-full">
        {data.map((d, i) => (
          <div key={i} className="flex items-center justify-between gap-2">
            <span className="flex items-center gap-2">
              <span className="inline-block w-3 h-3 rounded-sm" style={{ background: d.color }} />
              {d.label}
            </span>
            <span className="text-muted-foreground">
              {formatEur(d.value)} · {total > 0 ? Math.round((d.value / total) * 100) : 0}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ProfitChart({ prijmy, vydavky, zisk }: { prijmy: number; vydavky: number; zisk: number }) {
  const max = Math.max(prijmy, vydavky, Math.abs(zisk), 1);
  const bar = (label: string, value: number, color: string) => (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span>{label}</span><span className="font-medium">{formatEur(value)}</span>
      </div>
      <div className="h-4 rounded bg-muted overflow-hidden">
        <div className="h-full rounded" style={{ width: `${Math.min(100, (Math.abs(value) / max) * 100)}%`, background: color }} />
      </div>
    </div>
  );
  return (
    <div className="space-y-3">
      {bar("Príjmy (poplatky)", prijmy, "#28a745")}
      {bar("Výdavky", vydavky, "#dc3545")}
      {bar("Zisk / strata", zisk, zisk >= 0 ? "#282462" : "#dc3545")}
    </div>
  );
}
