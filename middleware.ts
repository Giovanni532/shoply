import { NextRequest, NextResponse } from 'next/server';
import { paths } from '@/paths';

// Routes d'API qui ne nécessitent pas d'authentification
const publicApiRoutes = ['/api/auth'];


export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Permettre l'accès aux routes d'API publiques
    if (publicApiRoutes.some(route => pathname.startsWith(route))) {
        return NextResponse.next();
    }

}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        '/((?!_next/static|_next/image|favicon.ico).*)',
    ],
}; 