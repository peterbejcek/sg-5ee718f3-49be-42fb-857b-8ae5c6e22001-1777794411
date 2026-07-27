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
  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });
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
