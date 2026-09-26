"use client";

import Link from "next/link";
import { signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import { BarChart3, FolderTree, LogOut, Menu, Package, ShoppingBag, Ticket, UserCircle2, X } from "lucide-react";
import { useState } from "react";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: BarChart3 },
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
    <div className="min-h-screen bg-[#fffafc] text-[#1c1a1d]">
      <div className="lg:hidden">
        <div className="flex items-center justify-between border-b border-[#f2dfe7] bg-white px-4 py-3 shadow-sm">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[#c06589]">Adi&apos;s Fashion</p>
            <h1 className="text-base font-semibold text-[#1d1a1b]">Back-office</h1>
          </div>
          <button type="button" onClick={() => setMobileOpen((current) => !current)} className="rounded-full border border-[#efd7e5] bg-[#fffafc] p-2 text-[#2d2a2c]">
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
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

      <div className="mx-auto flex max-w-[1600px] gap-6 px-4 py-4 sm:px-6 lg:px-8">
        <aside className="hidden w-[280px] shrink-0 rounded-[30px] border border-[#f2dfe7] bg-white p-4 shadow-[0_14px_30px_rgba(17,17,17,0.04)] lg:flex lg:flex-col">
          <div className="mb-6 px-2 pt-2">
            <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[#c06589]">Adi&apos;s Fashion</p>
            <h1 className="mt-2 text-xl font-semibold text-[#191919]">Back-office</h1>
          </div>

          <nav className="space-y-2">
            {navItems.map(({ href, label, icon: Icon }) => {
              const active = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  prefetch={false}
                  scroll={false}
                  className={`flex items-center justify-between rounded-2xl px-3 py-2.5 text-sm font-medium transition ${
                    active ? "bg-[#fcecf3] text-[#d95d8d] shadow-[inset_0_0_0_1px_rgba(217,93,141,0.08)]" : "text-[#4a4547] hover:bg-[#fff7fa]"
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <Icon className="h-4 w-4" />
                    {label}
                  </span>
                  {active ? <span className="h-2.5 w-2.5 rounded-full bg-[#d95d8d]" /> : null}
                </Link>
              );
            })}
          </nav>

          <div className="mt-auto rounded-[24px] border border-[#f2dfe7] bg-[#fffafc] p-3">
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

        <div className="flex-1">{children}</div>
      </div>
    </div>
  );
}
