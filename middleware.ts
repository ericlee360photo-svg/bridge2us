// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import createMiddleware from 'next-intl/middleware';
import { locales } from './i18n';

// If you're using next-intl or your own i18n, you'll still keep your i18n logic below.
// These guards just skip middleware for non-page routes.

const PUBLIC_FILE = /\.(.*)$/i
const IGNORE_PREFIXES = [
  '/_next',          // Next assets
  '/api',            // API routes
  '/favicon.ico',
  '/robots.txt',
  '/sitemap.xml',
  '/__routes',       // your debug route
  '/__health',       // your debug route
  '/health',         // health check route
  '/assets', '/images', '/icons' // your static dirs, adjust as needed
]

const i18nMiddleware = createMiddleware({
  locales: locales,
  defaultLocale: 'en',
  localePrefix: 'as-needed'
});

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Skip public files (/file.ext)
  if (PUBLIC_FILE.test(pathname)) return NextResponse.next()

  // Skip known non-page prefixes
  if (IGNORE_PREFIXES.some((p) => pathname.startsWith(p))) {
    return NextResponse.next()
  }

  // Apply i18n middleware for page routes
  return i18nMiddleware(req)
}

export const config = {
  // Match all paths except static files and API routes
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ]
};
