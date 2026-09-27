import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const TOKEN_COOKIE_NAMES = [
  "next-auth.session-token",
  "__Secure-next-auth.session-token",
  "authjs.session-token",
  "__Secure-authjs.session-token",
];

function getSessionToken(request: NextRequest) {
  for (const name of TOKEN_COOKIE_NAMES) {
    const value = request.cookies.get(name)?.value;
    if (value) {
      return value;
    }
  }

  return null;
}

function decodeJwtPayload(token: string) {
  try {
    const parts = token.split(".");
    if (parts.length < 2) {
      return null;
    }

    const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64 + "=".repeat((4 - (base64.length % 4)) % 4);
    const normalized = atob(padded);
    const json = decodeURIComponent(
      Array.from(normalized, (char) => `%${char.charCodeAt(0).toString(16).padStart(2, "0")}`).join(""),
    );

    return JSON.parse(json) as { role?: string };
  } catch {
    return null;
  }
}

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const isAdminPage = pathname.startsWith("/admin") || pathname.startsWith("/api/admin");
  const isLoginPage = pathname === "/admin/login";

  const token = getSessionToken(request);
  const payload = token ? decodeJwtPayload(token) : null;
  const isAdmin = payload?.role === "ADMIN";

  if (pathname.startsWith("/api/admin") && !token) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  if (pathname.startsWith("/api/admin") && token && !isAdmin) {
    return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
  }

  if (isAdminPage && !isLoginPage && !token) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  if (isAdminPage && !isLoginPage && token && !isAdmin) {
    return NextResponse.redirect(new URL("/admin/login?error=forbidden", request.url));
  }

  if (isLoginPage && token && isAdmin) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
