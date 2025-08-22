// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getSessionCookie } from "better-auth/cookies";
import { paths } from "./paths";
import createIntlMiddleware from "next-intl/middleware";
import { routing } from './i18n/routing';

const intlMiddleware = createIntlMiddleware(routing);

export function middleware(req: NextRequest) {
    // First, run i18n middleware (do not return yet so we can add auth)
    const intlResponse = intlMiddleware(req);

    // Auth guard for account pages (works with /:locale/account/*)
    const pathname = req.nextUrl.pathname;
    const isAccountPath = pathname.includes("/account");
    if (isAccountPath) {
        const sessionCookie = getSessionCookie(req);
        if (!sessionCookie) {
            const loginUrl = req.nextUrl.clone();
            loginUrl.pathname = paths.auth.login;
            loginUrl.searchParams.set("from", req.nextUrl.pathname + req.nextUrl.search);
            return NextResponse.redirect(loginUrl);
        }
    }

    // Fall back to i18n response
    return intlResponse;
}

export const config = {
    // Run on all paths except for the ones starting with api, _next or static files
    matcher: [
        "/((?!api|_next|.*\\..*).*)",
        '/((?!api|trpc|_next|_vercel|.*\\..*).*)',
    ],
};
