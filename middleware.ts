// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getSessionCookie } from "better-auth/cookies";
import { paths } from "./paths";
import createIntlMiddleware from "next-intl/middleware";
import { routing } from './i18n/routing';

const intlMiddleware = createIntlMiddleware(routing);

export function middleware(req: NextRequest) {
    // First, ensure a locale prefix is present
    const intlResponse = intlMiddleware(req);
    if (intlResponse) return intlResponse;

    // Auth guard for account pages (works with /:locale/account/*)
    const pathname = req.nextUrl.pathname;
    const isAccountPath = /\/(?:[a-zA-Z-]{2,5})\/account(\/.*)?$/.test(pathname) || pathname.startsWith("/account");
    if (isAccountPath) {
        const sessionCookie = getSessionCookie(req);
        if (!sessionCookie) {
            const loginUrl = req.nextUrl.clone();
            loginUrl.pathname = paths.auth.login;
            loginUrl.searchParams.set("from", req.nextUrl.pathname + req.nextUrl.search);
            return NextResponse.redirect(loginUrl);
        }
    }

    return NextResponse.next();
}

export const config = {
    // Run on all paths except for the ones starting with api, _next or static files
    matcher: [
        "/((?!api|_next|.*\\..*).*)",
        '/((?!api|trpc|_next|_vercel|.*\\..*).*)',
    ],
};
