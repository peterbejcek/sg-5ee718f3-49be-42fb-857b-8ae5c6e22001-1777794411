"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export type FreeSlotVehicle = {
  vehicleId: number;
  nazov: string;
  spz: string;
  volneSmeny: { datum: string; typ: "DENNA" | "NOCNA" }[];
  pocetVolnych: number;
  pocetCelkom: number;
};

const DEN_SKRATKA = ["Ne", "Po", "Ut", "St", "Št", "Pi", "So"];

function formatDatum(s: string): string {
  const d = new Date(`${s}T00:00:00Z`);
  return `${DEN_SKRATKA[d.getUTCDay()]} ${d.getUTCDate()}.${d.getUTCMonth() + 1}.`;
}

export function FreeSlotsView({ vozidla }: { vozidla: FreeSlotVehicle[] }) {
  if (!vozidla.length) {
    return <p className="text-muted-foreground text-sm">Žiadne aktívne vozidlá.</p>;
  }
  return (
    <div className="grid md:grid-cols-2 gap-3">
      {vozidla.map((v) => (
        <Card key={v.vehicleId}>
          <CardContent className="p-4">
            <div className="flex justify-between items-baseline mb-2">
              <span className="font-medium">{v.nazov} <span className="text-muted-foreground text-sm">({v.spz})</span></span>
              <span className="text-sm text-muted-foreground">{v.pocetVolnych} voľných / {v.pocetCelkom}</span>
            </div>
            {v.volneSmeny.length === 0 ? (
              <p className="text-sm text-green-600">Plne obsadené 👍</p>
            ) : (
              <div className="flex flex-wrap gap-1">
                {v.volneSmeny.map((s, i) => (
                  <Badge
                    key={i}
                    variant="outline"
                    className={s.typ === "DENNA" ? "border-amber-400 text-amber-700" : "border-indigo-400 text-indigo-700"}
                  >
                    {formatDatum(s.datum)} {s.typ === "DENNA" ? "D" : "N"}
                  </Badge>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
