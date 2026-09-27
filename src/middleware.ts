import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const isAdminPage = pathname.startsWith("/admin") || pathname.startsWith("/api/admin");
  const isLoginPage = pathname === "/admin/login";

  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET ?? process.env.AUTH_SECRET,
  });

  const isAdmin = token?.role === "ADMIN";

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
