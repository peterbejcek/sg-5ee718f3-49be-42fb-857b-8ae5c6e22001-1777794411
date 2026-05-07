import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const locales = ['sk', 'en', 'de', 'ru', 'uk', 'he', 'hu', 'ar']
const defaultLocale = 'sk'

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  
  // Check if pathname already has a locale
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  )

  if (pathnameHasLocale) {
    // Path already has locale, allow it through
    return NextResponse.next()
  }

  // No locale in pathname, redirect to default locale
  const locale = defaultLocale
  request.nextUrl.pathname = `/${locale}${pathname}`
  
  return NextResponse.redirect(request.nextUrl)
}

export const config = {
  matcher: [
    // Skip all internal paths (_next, api, etc)
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*|uploads).*)',
  ],
}