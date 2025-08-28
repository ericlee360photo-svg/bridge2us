// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import createMiddleware from 'next-intl/middleware';
import { locales } from './i18n';

const PUBLIC_FILE = /\.(.*)$/i;
const IGNORE_PREFIXES = ['/_next','/api','/__routes','/__health','/favicon.ico','/robots.txt','/sitemap.xml','/assets','/images','/icons'];

const intl = createMiddleware({
  locales,
  defaultLocale: 'en',
  localePrefix: 'as-needed',
});

export default function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (PUBLIC_FILE.test(pathname) || IGNORE_PREFIXES.some(p => pathname.startsWith(p))) {
    return NextResponse.next();
  }
  return intl(req);
}

export const config = {
  matcher: [
    '/((?!_next|api|__routes|__health|favicon\\.ico|robots\\.txt|sitemap\\.xml|assets|images|icons|.*\\..*).*)',
  ],
};
