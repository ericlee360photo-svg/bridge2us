// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
// import createMiddleware from 'next-intl/middleware';
// import { locales } from './i18n';

// const PUBLIC_FILE = /\.(.*)$/i;
// const IGNORE_PREFIXES = ['/_next','/api','/__routes','/__health','/favicon.ico','/robots.txt','/sitemap.xml','/assets','/images','/icons','/auth','/signup'];

// const intl = createMiddleware({
//   locales,
//   defaultLocale: 'en',
//   localePrefix: 'as-needed',
// });

export default function middleware() {
  // Ignore everything - return next for all requests
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next|api|__routes|__health|favicon\\.ico|robots\\.txt|sitemap\\.xml|assets|images|icons|auth|signup|.*\\..*).*)',
  ],
};
