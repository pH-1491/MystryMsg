// src/middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

// This is what Next.js expects in middleware.ts
export async function middleware(request: NextRequest) {
    const token = await getToken({ req: request });
    const url = request.nextUrl;

    const isAuthRoute =
        url.pathname.startsWith("/sign-in") ||
        url.pathname.startsWith("/sign-up") ||
        url.pathname.startsWith("/verify");

    const isProtectedRoute =
        url.pathname.startsWith("/dashboard") ||
        url.pathname.startsWith("/home");

    //  Logged-in user trying to access auth pages → send to dashboard
    if (token && isAuthRoute) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    //  Not logged in, trying to access protected pages → send to sign-in
    if (!token && isProtectedRoute) {
        return NextResponse.redirect(new URL("/sign-in", request.url));
    }

    //  Otherwise, let the request continue
    return NextResponse.next();
}

export const config = {
    matcher: [
        "/sign-in",
        "/sign-up",
        "/verify/:path*",
        "/dashboard/:path*",
        "/home/:path*",
    ],
};
