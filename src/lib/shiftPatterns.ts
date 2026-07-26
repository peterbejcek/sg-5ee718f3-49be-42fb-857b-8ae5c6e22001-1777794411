// Rotačné vzory smien podľa Google tabuľky E-TAXI Košice (rozpis pre 4 vodičov
// na firemné vozidlo). Každý vzor je 28-dňový (4-týždňový) cyklus, ktorý sa
// opakuje. D = denná, N = nočná, V = voľno.
//
// Vzory zodpovedajú stĺpcom "Vodič 1–4" v tabuľke — každý deň je práve jeden
// vodič na dennej a jeden na nočnej, dvaja majú voľno.

export type PatternCode = "D" | "N" | "V";
export type TypSmeny = "DENNA" | "NOCNA" | "VOLNO";

export const CODE_TO_TYP: Record<PatternCode, TypSmeny> = {
  D: "DENNA",
  N: "NOCNA",
  V: "VOLNO",
};

function toArr(s: string): PatternCode[] {
  return s.replace(/\s+/g, "").split("") as PatternCode[];
}

export type ShiftPattern = {
  key: string;
  label: string;
  dni: PatternCode[]; // 28 dní
};

// Zdroj: hárok "Rozpis smien" (od pondelka).
export const SHIFT_PATTERNS: ShiftPattern[] = [
  {
    key: "P1",
    label: "Vzor 1 (Po: Voľno → Str/Štv nočná)",
    dni: toArr("VVNNVVV DDVVNNN VVDDVVV NNVVDDD"),
  },
  {
    key: "P2",
    label: "Vzor 2 (Po/Ut denná)",
    dni: toArr("DDVVNNN VVDDVVV NNVVDDD VVNNVVV"),
  },
  {
    key: "P3",
    label: "Vzor 3 (Po/Ut nočná)",
    dni: toArr("NNVVDDD VVNNVVV DDVVNNN VVDDVVV"),
  },
  {
    key: "P4",
    label: "Vzor 4 (Po: Voľno → Str/Štv denná)",
    dni: toArr("VVDDVVV NNVVDDD VVNNVVV DDVVNNN"),
  },
];

export function getPattern(key: string): ShiftPattern | undefined {
  return SHIFT_PATTERNS.find((p) => p.key === key);
}

/** Kód smeny pre daný deň (index od začiatku obdobia) podľa vzoru (cyklus 28 dní). */
export function patternCodeForDay(pattern: ShiftPattern, dayIndex: number): PatternCode {
  return pattern.dni[((dayIndex % 28) + 28) % 28];
}
