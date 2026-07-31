// Klientský fetch wrapper pre portálové API.
export type Role = "MAJITEL" | "DISPECER" | "VODIC";

export type CurrentUser = {
  id: number;
  email: string;
  meno: string;
  priezvisko: string;
  volaciZnak: string | null;
  telefon: string | null;
  roles: Role[];
  registracnyPoplatokUhradeny: boolean;
};

export async function apiFetch<T = unknown>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  // Timeout, aby požiadavka nikdy nevisela donekonečna (žiadne večné "Načítavam").
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 20000);
  let res: Response;
  try {
    res = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
    });
  } catch (e) {
    clearTimeout(timeout);
    if (e instanceof DOMException && e.name === "AbortError") {
      throw new Error("Časový limit požiadavky vypršal. Skúste to znova.");
    }
    throw e instanceof Error ? e : new Error("Chyba siete");
  }
  clearTimeout(timeout);
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error((data as { message?: string }).message || `Chyba ${res.status}`);
  }
  return data as T;
}

export async function fetchCurrentUser(): Promise<CurrentUser | null> {
  const data = await apiFetch<{ user: CurrentUser | null }>("/api/auth/me");
  return data.user;
}

export function formatEur(n: number | string | null | undefined): string {
  const v = Number(n ?? 0);
  return v.toLocaleString("sk-SK", { style: "currency", currency: "EUR" });
}

/** Dátum v tvare DD.MM.RRRR (zo vstupu 'YYYY-MM-DD' alebo ISO / Date). */
export function formatDate(value: string | Date | null | undefined): string {
  if (!value) return "—";
  const s = typeof value === "string" ? value.slice(0, 10) : value.toISOString().slice(0, 10);
  const [y, m, d] = s.split("-");
  if (!y || !m || !d) return s;
  return `${d.padStart(2, "0")}.${m.padStart(2, "0")}.${y}`;
}

export const ROLE_LABELS: Record<Role, string> = {
  MAJITEL: "Majiteľ",
  DISPECER: "Dispečer",
  VODIC: "Vodič",
};

export const DAY_NAMES = ["Po", "Ut", "St", "Št", "Pi", "So", "Ne"];

export const SHIFT_LABELS: Record<string, string> = {
  DENNA: "Denná (D)",
  NOCNA: "Nočná (N)",
  VOLNO: "Voľno (V)",
};
