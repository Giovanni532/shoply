// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getSessionCookie } from "better-auth/cookies";
import { paths } from "./paths";

export function middleware(req: NextRequest) {
    // Vérifie simplement l'existence du cookie de session (pas une validation complète)
    const sessionCookie = getSessionCookie(req);

    // Si pas loggé -> redirige vers /login?from=/account/...
    if (!sessionCookie) {
        const loginUrl = new URL(paths.auth.login, req.url);
        loginUrl.searchParams.set("from", req.nextUrl.pathname + req.nextUrl.search);
        return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
}

// Le middleware ne tourne que sur /account/*
export const config = {
    matcher: ["/account/:path*"],
};
