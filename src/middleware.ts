import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const SESSION_COOKIE_NAMES = [
  "next-auth.session-token",
  "__Secure-next-auth.session-token",
  "authjs.session-token",
  "__Secure-authjs.session-token",
];

function hasSessionCookie(request: NextRequest) {
  return SESSION_COOKIE_NAMES.some((name) => request.cookies.has(name));
}

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const isLoginPage = pathname === "/admin/login";
  const isProtectedAdminPage = pathname.startsWith("/admin") && !isLoginPage;
  const isProtectedApiAdminRoute = pathname.startsWith("/api/admin");

  if (isLoginPage) {
    return NextResponse.next();
  }

  if (isProtectedApiAdminRoute || isProtectedAdminPage) {
    if (!hasSessionCookie(request)) {
      if (isProtectedApiAdminRoute) {
        return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
      }

      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
