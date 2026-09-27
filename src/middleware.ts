import { auth } from "@/auth";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const isLoginPage = pathname === "/admin/login";
  const isProtectedAdminPage = pathname.startsWith("/admin") && !isLoginPage;
  const isProtectedApiAdminRoute = pathname.startsWith("/api/admin");

  const session = await auth();
  const userRole = session?.user?.role ?? null;
  const isAdmin = userRole === "ADMIN";

  if (isProtectedApiAdminRoute && !session) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  if (isProtectedApiAdminRoute && session && !isAdmin) {
    return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
  }

  if (isProtectedAdminPage && !session) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  if (isProtectedAdminPage && session && !isAdmin) {
    return NextResponse.redirect(new URL("/admin/login?error=forbidden", request.url));
  }

  if (isLoginPage && session && isAdmin) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
