// Priama dátová vrstva cez mysql2 (bez Prisma query engine).
// Dôvod: Prisma Rust engine na zdieľanom hostingu (nízky NPROC) padal na
// "PANIC: timer has gone away". mysql2 je čistý JS driver — žiadne natívne
// vlákna, stabilné aj pod prísnym procesným limitom.
//
// Prisma sa naďalej používa IBA na migrácie schémy (prisma migrate deploy),
// nie za behu aplikácie.
import mysql from "mysql2/promise";

/** Prípustné typy SQL parametrov (náhrada za any[] v dopytoch). */
export type SqlParam = string | number | boolean | Date | null | undefined;

export type Role = "MAJITEL" | "DISPECER" | "VODIC";
export type TypSmeny = "DENNA" | "NOCNA" | "VOLNO";
export type DruhPohonu = "ELEKTRO" | "HYBRID" | "BENZIN" | "DIESEL" | "LPG" | "CNG";

const globalForDb = globalThis as unknown as { etaxiPool?: mysql.Pool };

export function getPool(): mysql.Pool {
  if (globalForDb.etaxiPool) return globalForDb.etaxiPool;

  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL nie je nastavený.");

  const u = new URL(url);
  const pool = mysql.createPool({
    host: u.hostname,
    port: Number(u.port || 3306),
    user: decodeURIComponent(u.username),
    password: decodeURIComponent(u.password),
    database: u.pathname.replace(/^\//, ""),
    connectionLimit: 5,
    waitForConnections: true,
    // queueLimit obmedzený, aby požiadavka radšej zlyhala než visela donekonečna,
    // ak by spojenia nedokázali vzniknúť (napr. zaseknuté spojenia po páde appky).
    queueLimit: 30,
    connectTimeout: 10000, // 10 s na nadviazanie spojenia, potom chyba (nie hang)
    idleTimeout: 30000, // zavri nečinné spojenia po 30 s
    maxIdle: 2,
    enableKeepAlive: true,
    keepAliveInitialDelay: 10000,
    decimalNumbers: true, // DECIMAL -> number (nie string)
    dateStrings: true, // DATE/DATETIME -> string (bez posunov časových pásiem)
    charset: "utf8mb4",
  });
  globalForDb.etaxiPool = pool;
  return pool;
}

/** SELECT vracajúci pole riadkov. */
export async function query<T = Record<string, unknown>>(
  sql: string,
  params: SqlParam[] = []
): Promise<T[]> {
  const [rows] = await getPool().query(sql, params);
  return rows as T[];
}

/** SELECT vracajúci prvý riadok alebo null. */
export async function queryOne<T = Record<string, unknown>>(
  sql: string,
  params: SqlParam[] = []
): Promise<T | null> {
  const rows = await query<T>(sql, params);
  return rows.length ? rows[0] : null;
}

/** INSERT/UPDATE/DELETE — vracia hlavičku výsledku (insertId, affectedRows). */
export async function execute(
  sql: string,
  params: SqlParam[] = []
): Promise<mysql.ResultSetHeader> {
  const [result] = await getPool().execute(sql, params);
  return result as mysql.ResultSetHeader;
}

/** Transakcia — callback dostane spojenie s query/execute helpermi. */
export async function withTransaction<T>(
  fn: (tx: mysql.PoolConnection) => Promise<T>
): Promise<T> {
  const conn = await getPool().getConnection();
  try {
    await conn.beginTransaction();
    const result = await fn(conn);
    await conn.commit();
    return result;
  } catch (e) {
    await conn.rollback();
    throw e;
  } finally {
    conn.release();
  }
}

/** Prevedie 0/1 z MySQL na boolean. */
export function toBool(v: unknown): boolean {
  return v === 1 || v === true || v === "1";
}

// ── Zdieľané dopyty ────────────────────────────────────────────────────────────

export type UserRow = {
  id: number;
  email: string;
  passwordHash: string | null;
  meno: string;
  priezvisko: string;
  telefon: string | null;
  volaciZnak: string | null;
  aktivny: number;
  mustSetPassword: number;
  registracnyPoplatokUhradeny: number;
  registracnyPoplatokDna: string | null;
};

/** Načíta používateľa aj s rolami (pole). */
export async function getUserWithRoles(
  id: number
): Promise<(UserRow & { roles: Role[] }) | null> {
  const user = await queryOne<UserRow>("SELECT * FROM `User` WHERE `id` = ?", [id]);
  if (!user) return null;
  const roleRows = await query<{ role: Role }>(
    "SELECT `role` FROM `UserRole` WHERE `userId` = ?",
    [id]
  );
  return { ...user, roles: roleRows.map((r) => r.role) };
}

export async function getUserRoles(userId: number): Promise<Role[]> {
  const rows = await query<{ role: Role }>(
    "SELECT `role` FROM `UserRole` WHERE `userId` = ?",
    [userId]
  );
  return rows.map((r) => r.role);
}
