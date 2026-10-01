"use client";

import Image from "next/image";
import Link from "next/link";
import { Menu, Search, ShoppingBag, X } from "lucide-react";
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
    <header className="sticky top-0 z-50 border-b border-[#f1dce5] bg-white/95 backdrop-blur-md">
      <div className="bg-[#d95d8d] px-4 py-2 text-center text-xs font-semibold text-white">
        Livraison en 48 h partout au Maroc · Découvrez les nouvelles pièces
      </div>
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3 sm:px-6 lg:px-8">
        <button
          type="button"
          onClick={() => setMobileOpen((current) => !current)}
          className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#f0d6e0] bg-[#fff8fb] text-[#2f2f30] md:hidden"
          aria-label={mobileOpen ? "Fermer le menu" : "Ouvrir le menu"}
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>

        <Link href="/" className="flex shrink-0 items-center gap-2" aria-label="Adi's Fashion, accueil">
          <div className="relative h-10 w-10 overflow-hidden rounded-full bg-[#fff8fb] ring-1 ring-[#f3dbe6]">
            <Image src="/images/adi-fashion-logo.png" alt="Logo Adi's Fashion" width={40} height={40} priority />
          </div>
          <div>
            <p className="text-sm font-semibold text-[#191919]">ADI&apos;S</p>
            <p className="text-[9px] font-semibold uppercase text-[#c06589]">Fashion</p>
          </div>
        </Link>

        <form action="/products" className="mx-auto hidden min-w-0 max-w-xl flex-1 md:block">
          <label className="flex h-11 items-center gap-2 rounded-full border border-[#efdce5] bg-[#fff9fb] px-4 text-[#8b7c83] focus-within:border-[#d95d8d]">
            <Search className="h-4 w-4 shrink-0" />
            <input name="search" placeholder="Rechercher une pièce, une collection..." className="min-w-0 flex-1 bg-transparent text-sm text-[#252326] outline-none placeholder:text-[#9a8d93]" />
          </label>
        </form>

        <nav aria-label="Navigation principale" className="hidden items-center gap-1 lg:flex">
          {navItems.slice(0, 3).map((item) => (
            <Link key={item.href} href={item.href} className="rounded-full px-3 py-2 text-sm font-medium text-[#373236] transition hover:bg-[#fff5f9] hover:text-[#c14f78]">
              {item.label}
            </Link>
          ))}
        </nav>

        <Link href="/cart" className="relative ml-auto inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#f8dfe9] text-[#201f20] transition hover:bg-[#f2cbdc] md:ml-0" aria-label={`Voir le panier${itemCount ? `, ${itemCount} articles` : ""}`}>
          <ShoppingBag className="h-5 w-5" />
          {itemCount > 0 ? <span className="absolute -right-1 -top-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-[#d95d8d] px-1 text-[10px] font-semibold text-white">{itemCount}</span> : null}
        </Link>
      </div>

      <nav aria-label="Collections" className="scrollbar-none border-t border-[#f7eaf0] bg-white">
        <div className="mx-auto flex max-w-7xl items-center gap-2 overflow-x-auto px-4 py-2 text-xs font-medium text-[#655960] sm:px-6 lg:px-8">
          <Link href="/products" className="shrink-0 rounded-full bg-[#fff1f6] px-3 py-1.5 text-[#bd4e77]">Tout voir</Link>
          <Link href="/categories" className="shrink-0 rounded-full px-3 py-1.5 hover:bg-[#fff7fa] hover:text-[#bd4e77]">Nos catégories</Link>
          <Link href="/#nouveautes" className="shrink-0 rounded-full px-3 py-1.5 hover:bg-[#fff7fa] hover:text-[#bd4e77]">Nouveautés</Link>
          <Link href="/cart" className="shrink-0 rounded-full px-3 py-1.5 hover:bg-[#fff7fa] hover:text-[#bd4e77] lg:hidden">Mon panier</Link>
        </div>
      </nav>

      {mobileOpen ? (
        <nav aria-label="Navigation mobile" className="border-t border-[#f6e7ee] bg-white px-4 py-4 md:hidden">
          <div className="flex flex-col gap-1 text-sm font-medium text-[#2f2f30]">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} onClick={() => setMobileOpen(false)} className="rounded-xl px-3 py-3 hover:bg-[#fff7fa] hover:text-[#d95d8d]">
                {item.label}
              </Link>
            ))}
          </div>
          <form action="/products" className="mt-3">
            <label className="flex h-11 items-center gap-2 rounded-full border border-[#efdce5] bg-[#fff9fb] px-4 text-[#8b7c83]">
              <Search className="h-4 w-4 shrink-0" />
              <input name="search" placeholder="Rechercher une pièce..." className="min-w-0 flex-1 bg-transparent text-sm outline-none" />
            </label>
          </form>
        </nav>
      ) : null}
    </header>
  );
}
