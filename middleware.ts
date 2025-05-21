import { createI18nMiddleware } from 'next-international/middleware';
import { NextRequest } from 'next/server';

const I18nMiddleware = createI18nMiddleware({
  locales: ['en', 'zh'],
  defaultLocale: 'en',
  // URL redirect strategy (optional, default is 'rewrite')
  // 'rewrite' means the URL will not change in the browser bar (e.g., /about stays /about even if lang is zh)
  // 'redirect' means the URL will change (e.g., /about becomes /zh/about)
  // For explicit language in URL, 'redirect' is often preferred for clarity and SEO.
  urlMappingStrategy: 'rewrite', // Let's start with rewrite, can change to redirect if preferred
});

export function middleware(request: NextRequest) {
  return I18nMiddleware(request);
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|images|assets).*)', // Exclude API, static files, etc.
  ],
}; 