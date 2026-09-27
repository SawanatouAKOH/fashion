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
  const isProtectedAdminPage = pathname.startsWith("/admin") && pathname !== "/admin/login";
  const isProtectedApiAdminRoute = pathname.startsWith("/api/admin");
  const isLoginPage = pathname === "/admin/login";

  const token = getSessionToken(request);
  const payload = token ? decodeJwtPayload(token) : null;
  const payloadRole = (payload as { role?: string; user?: { role?: string } } | null)?.role ?? (payload as { role?: string; user?: { role?: string } } | null)?.user?.role ?? null;
  const isAdmin = payloadRole === "ADMIN";

  console.log("[AUTH DEBUG] middleware", {
    pathname,
    hasToken: Boolean(token),
    payloadRole,
    isAdmin,
    isLoginPage,
    isProtectedAdminPage,
    isProtectedApiAdminRoute,
  });

  if (isProtectedApiAdminRoute && !token) {
    console.log("[AUTH DEBUG] middleware decision", { pathname, authenticated: false, role: payloadRole, decision: "API_REDIRECT_401" });
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  if (isProtectedApiAdminRoute && token && !isAdmin) {
    console.log("[AUTH DEBUG] middleware decision", { pathname, authenticated: true, role: payloadRole, decision: "API_FORBIDDEN_403" });
    return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
  }

  if (isProtectedAdminPage && !token) {
    console.log("[AUTH DEBUG] middleware decision", { pathname, authenticated: false, role: payloadRole, decision: "REDIRECT_LOGIN" });
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  if (isProtectedAdminPage && token && !isAdmin) {
    console.log("[AUTH DEBUG] middleware decision", { pathname, authenticated: true, role: payloadRole, decision: "REDIRECT_FORBIDDEN" });
    return NextResponse.redirect(new URL("/admin/login?error=forbidden", request.url));
  }

  if (isLoginPage && token && isAdmin) {
    console.log("[AUTH DEBUG] middleware decision", { pathname, authenticated: true, role: payloadRole, decision: "REDIRECT_ADMIN_HOME" });
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  console.log("[AUTH DEBUG] middleware decision", { pathname, authenticated: Boolean(token), role: payloadRole, decision: "ALLOW" });
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
