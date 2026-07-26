// Ochrana stránok portálu — presmeruje neprihlásených na /prihlasenie.
// Skutočná kontrola rolí je server-side (API withAuth + getServerSideProps).
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const SESSION_COOKIE = "etaxi_session";

// Verejné cesty v rámci /portal (bez prihlásenia).
const PUBLIC_PORTAL_PATHS = ["/portal/nastavit-heslo"];

async function isValidSession(token: string | undefined): Promise<boolean> {
  if (!token) return false;
  const secret = process.env.AUTH_JWT_SECRET;
  if (!secret) return false;
  try {
    await jwtVerify(token, new TextEncoder().encode(secret));
    return true;
  } catch {
    return false;
  }
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Normalizuj prípadný /en prefix (i18n).
  const path = pathname.replace(/^\/en/, "") || "/";

  if (PUBLIC_PORTAL_PATHS.some((p) => path.startsWith(p))) {
    return NextResponse.next();
  }

  const token = req.cookies.get(SESSION_COOKIE)?.value;
  if (await isValidSession(token)) {
    return NextResponse.next();
  }

  const loginUrl = req.nextUrl.clone();
  loginUrl.pathname = "/prihlasenie";
  loginUrl.search = `?redirect=${encodeURIComponent(pathname)}`;
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/portal/:path*", "/en/portal/:path*"],
};
