import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((request) => {
  const pathname = request.nextUrl.pathname;
  const isAdminPage = pathname.startsWith("/admin") || pathname.startsWith("/api/admin");
  const isLoginPage = pathname === "/admin/login";
  const isAdmin = request.auth?.user?.role === "ADMIN";

  if (pathname.startsWith("/api/admin") && !request.auth) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  if (pathname.startsWith("/api/admin") && request.auth && !isAdmin) {
    return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
  }

  if (isAdminPage && !isLoginPage && !request.auth) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  if (isAdminPage && !isLoginPage && request.auth && !isAdmin) {
    return NextResponse.redirect(new URL("/admin/login?error=forbidden", request.url));
  }

  if (isLoginPage && request.auth && isAdmin) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
