"use client";

import Image from "next/image";
import Link from "next/link";
import { Menu, ShoppingBag, X } from "lucide-react";
import { useState } from "react";

import { useCart } from "@/components/providers/CartProvider";

const navItems = [
  { href: "/", label: "Accueil" },
  { href: "/products", label: "Catalogue" },
  { href: "/categories", label: "Catégories" },
  { href: "/cart", label: "Panier" },
];

export function Header() {
  const { itemCount } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-[#f2d7e2] bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3" aria-label="Aller à l'accueil">
          <div className="relative h-12 w-12 overflow-hidden rounded-full bg-[#fff8fb] ring-1 ring-[#f3dbe6]">
            <Image src="/images/logo-adis-fashion.png" alt="Logo Adi's Fashion" width={48} height={48} priority />
          </div>
          <div className="hidden sm:block">
            <p className="text-lg font-semibold tracking-[0.12em] text-[#191919]">ADI&apos;S</p>
            <p className="text-[10px] font-semibold uppercase tracking-[0.32em] text-[#c06589]">Fashion</p>
          </div>
        </Link>

        <nav aria-label="Navigation principale" className="hidden items-center gap-6 md:flex">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="text-sm font-medium text-[#2f2f30] transition hover:text-[#d95d8d]">
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setMobileOpen((current) => !current)}
            className="inline-flex items-center justify-center rounded-full border border-[#f0d6e0] p-2 text-[#2f2f30] md:hidden"
            aria-label={mobileOpen ? "Fermer le menu" : "Ouvrir le menu"}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>

          <Link
            href="/cart"
            className="relative inline-flex items-center justify-center rounded-full bg-[#f8dfe9] p-3 text-[#201f20] shadow-sm transition hover:bg-[#f7d2e3]"
            aria-label="Voir le panier"
          >
            <ShoppingBag className="h-5 w-5" />
            {itemCount > 0 ? (
              <span className="absolute -right-1 -top-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-[#d95d8d] px-1 text-[10px] font-semibold text-white">
                {itemCount}
              </span>
            ) : null}
          </Link>
        </div>
      </div>

      {mobileOpen ? (
        <nav aria-label="Navigation mobile" className="border-t border-[#f6e7ee] bg-white px-4 py-4 md:hidden">
          <div className="flex flex-col gap-3 text-sm font-medium text-[#2f2f30]">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} onClick={() => setMobileOpen(false)} className="rounded-full px-3 py-2 hover:bg-[#fff7fa] hover:text-[#d95d8d]">
                {item.label}
              </Link>
            ))}
          </div>
        </nav>
      ) : null}
    </header>
  );
}
