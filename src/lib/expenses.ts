// Pomocníky pre výdavky: predvolené kategórie, intervaly pravidelných výdavkov
// a rozvinutie pravidelného predpisu do počtu výskytov v danom období.

export type ExpenseInterval = "TYZDENNE" | "MESACNE" | "STVRTROCNE" | "POLROCNE" | "ROCNE";

export const DEFAULT_EXPENSE_CATEGORIES = [
  "Lízing",
  "Poistenie",
  "Administratíva",
  "Servis",
  "Telefón",
  "Marketing",
  "Plat spoločníka",
  "Odvody",
];

export const INTERVAL_LABELS: Record<ExpenseInterval, string> = {
  TYZDENNE: "Týždenne",
  MESACNE: "Mesačne",
  STVRTROCNE: "Štvrťročne",
  POLROCNE: "Polročne",
  ROCNE: "Ročne",
};

function parseYmd(s: string): Date {
  return new Date(`${s.slice(0, 10)}T00:00:00.000Z`);
}

function stepDate(d: Date, interval: ExpenseInterval): Date {
  const n = new Date(d);
  switch (interval) {
    case "TYZDENNE": n.setUTCDate(n.getUTCDate() + 7); break;
    case "MESACNE": n.setUTCMonth(n.getUTCMonth() + 1); break;
    case "STVRTROCNE": n.setUTCMonth(n.getUTCMonth() + 3); break;
    case "POLROCNE": n.setUTCMonth(n.getUTCMonth() + 6); break;
    case "ROCNE": n.setUTCFullYear(n.getUTCFullYear() + 1); break;
  }
  return n;
}

/**
 * Počet výskytov výdavku v období [from, to].
 * - jednorazový: 1 ak datum spadá do obdobia, inak 0
 * - pravidelný: počet výskytov (datum, datum+interval, ...) v období
 */
export function occurrencesInRange(
  datumStr: string,
  pravidelny: boolean,
  interval: ExpenseInterval | null,
  from: Date,
  to: Date
): number {
  const start = parseYmd(datumStr);
  if (!pravidelny || !interval) {
    return start.getTime() >= from.getTime() && start.getTime() <= to.getTime() ? 1 : 0;
  }
  let count = 0;
  let d = new Date(start);
  let guard = 0;
  // Preskočí výskyty pred obdobím.
  while (d.getTime() < from.getTime() && guard < 100000) {
    d = stepDate(d, interval);
    guard++;
  }
  while (d.getTime() <= to.getTime() && guard < 100000) {
    count++;
    d = stepDate(d, interval);
    guard++;
  }
  return count;
}

export type ExpenseRowLike = {
  datum: string;
  suma: number;
  pravidelny: boolean;
  interval: ExpenseInterval | null;
};

/** Suma výdavku pripadajúca na obdobie (suma × počet výskytov). */
export function expenseAmountInRange(e: ExpenseRowLike, from: Date, to: Date): number {
  return Number(e.suma) * occurrencesInRange(e.datum, e.pravidelny, e.interval, from, to);
}
