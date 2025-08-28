// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
// import createMiddleware from 'next-intl/middleware';
// import { locales } from './i18n';

// DISABLED FOR DEBUGGING - TEMPORARILY COMMENTED OUT
// const PUBLIC_FILE = /\.(.*)$/i
// const IGNORE_PREFIXES = [
//   '/_next',          // Next assets
//   '/api',            // API routes
//   '/favicon.ico',
//   '/robots.txt',
//   '/sitemap.xml',
//   '/__routes',       // your debug route
//   '/__health',       // your debug route
//   '/health',         // health check route
//   '/assets', '/images', '/icons' // your static dirs, adjust as needed
// ]

// const i18nMiddleware = createMiddleware({
//   locales: locales,
//   defaultLocale: 'en',
//   localePrefix: 'as-needed'
// });

export function middleware(req: NextRequest) {
  // DISABLED FOR DEBUGGING - TEMPORARILY RETURNING NEXT
  return NextResponse.next();
  
  // const { pathname } = req.nextUrl

  // // Skip public files (/file.ext)
  // if (PUBLIC_FILE.test(pathname)) return NextResponse.next()

  // // Skip known non-page prefixes
  // if (IGNORE_PREFIXES.some((p) => pathname.startsWith(p))) {
  //   return NextResponse.next()
  // }

  // // Apply i18n middleware for page routes
  // return i18nMiddleware(req)
}

export const config = {
  matcher: [
    '/((?!_next|api|__routes|__health|favicon\\.ico|robots\\.txt|sitemap\\.xml|assets|images|icons|.*\\..*).*)',
  ],
};
