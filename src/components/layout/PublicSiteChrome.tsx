"use client";

import { usePathname } from "next/navigation";

import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";

export function PublicSiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdminRoute = pathname.startsWith("/admin");

  return (
    <>
      {!isAdminRoute ? <Header /> : null}
      <main className="flex-1">{children}</main>
      {!isAdminRoute ? <Footer /> : null}
    </>
  );
}