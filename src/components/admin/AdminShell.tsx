"use client";

import Link from "next/link";
import { signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import { ArrowUpRight, BarChart3, FolderTree, LogOut, Menu, Package, ShoppingBag, Ticket, UserCircle2, X } from "lucide-react";
import { useState } from "react";

const navItems = [
  { href: "/admin", label: "Vue d’ensemble", icon: BarChart3 },
  { href: "/admin/products", label: "Produits", icon: Package },
  { href: "/admin/orders", label: "Commandes", icon: ShoppingBag },
  { href: "/admin/reservations", label: "Réservations", icon: Ticket },
  { href: "/admin/categories", label: "Catégories", icon: FolderTree },
] as const;

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  async function handleLogout() {
    await signOut({ callbackUrl: "/admin/login" });
  }

  return (
    <div className="min-h-screen bg-[#f8f6f7] text-[#1c1a1d]">
      <div className="lg:hidden">
        <div className="flex items-center justify-between border-b border-[#f2dfe7] bg-white px-4 py-3 shadow-sm">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[#c06589]">Adi&apos;s Fashion</p>
            <h1 className="text-base font-semibold text-[#1d1a1b]">Back-office</h1>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/" target="_blank" className="inline-flex items-center gap-1 rounded-full border border-[#efd7e5] bg-white px-3 py-2 text-xs font-medium text-[#4a4547]">
              Voir le site <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
            <button type="button" onClick={() => setMobileOpen((current) => !current)} className="rounded-full border border-[#efd7e5] bg-[#fffafc] p-2 text-[#2d2a2c]">
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {mobileOpen ? (
          <aside className="border-b border-[#f2dfe7] bg-white px-3 py-4">
            <nav className="space-y-2">
              {navItems.map(({ href, label, icon: Icon }) => {
                const active = pathname === href;
                return (
                  <Link
                    key={href}
                    href={href}
                    prefetch={false}
                    scroll={false}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center justify-between rounded-2xl px-3 py-2.5 text-sm font-medium transition ${
                      active ? "bg-[#fcecf3] text-[#d95d8d]" : "text-[#4a4547] hover:bg-[#fff7fa]"
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      <Icon className="h-4 w-4" />
                      {label}
                    </span>
                  </Link>
                );
              })}
            </nav>

            <div className="mt-5 rounded-2xl border border-[#f2dfe7] bg-[#fffafc] p-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#fbe8f1] text-[#d95d8d]">
                  <UserCircle2 className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#1d1a1b]">Administrateur</p>
                  <p className="text-xs text-[#766f72]">admin@adisfashion.com</p>
                </div>
              </div>
              <button type="button" onClick={() => void handleLogout()} className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-full border border-[#efd7e5] bg-white px-3 py-2 text-sm font-medium text-[#413d3f]">
                <LogOut className="h-4 w-4" />
                Déconnexion
              </button>
            </div>
          </aside>
        ) : null}
      </div>

      <div className="mx-auto flex max-w-[1680px] lg:min-h-screen">
        <aside className="sticky top-0 hidden h-screen w-[250px] shrink-0 border-r border-[#e9e1e5] bg-white p-5 lg:flex lg:flex-col">
          <div className="mb-7 px-1 pt-2">
            <p className="text-[10px] font-semibold uppercase text-[#a95b79]">Adi&apos;s Fashion</p>
            <h1 className="mt-1 text-xl font-semibold text-[#211d20]">Administration</h1>
            <Link href="/" target="_blank" className="mt-4 inline-flex items-center gap-2 rounded-lg border border-[#e9e1e5] px-3 py-2 text-sm font-medium text-[#4a4547] transition hover:border-[#d95d8d] hover:text-[#c14f78]">
              Voir le site <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>

          <nav aria-label="Navigation administration" className="space-y-1">
            {navItems.map(({ href, label, icon: Icon }) => {
              const active = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  prefetch={false}
                  scroll={false}
                  className={`flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                    active ? "bg-[#f8edf1] text-[#a94d6f]" : "text-[#51494d] hover:bg-[#f8f5f6]"
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <Icon className="h-4 w-4" />
                    {label}
                  </span>
                  {active ? <span className="h-2 w-2 rounded-full bg-[#bd6483]" /> : null}
                </Link>
              );
            })}
          </nav>

          <div className="mt-auto border-t border-[#eee6ea] pt-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#fbe8f1] text-[#d95d8d]">
                <UserCircle2 className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-[#1d1a1b]">Administrateur</p>
                <p className="text-xs text-[#766f72]">admin@adisfashion.com</p>
              </div>
            </div>
            <button type="button" onClick={() => void handleLogout()} className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-full border border-[#efd7e5] bg-white px-3 py-2 text-sm font-medium text-[#413d3f] transition hover:border-[#d95d8d]">
              <LogOut className="h-4 w-4" />
              Déconnexion
            </button>
          </div>
        </aside>

        <main className="min-w-0 flex-1 px-4 py-5 sm:px-6 lg:px-8 lg:py-8">{children}</main>
      </div>
    </div>
  );
}
