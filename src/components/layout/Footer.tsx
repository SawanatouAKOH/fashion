import Image from "next/image";
import Link from "next/link";
import { MessageCircleMore, Music2, Phone } from "lucide-react";

import { APP_NAME, APP_TAGLINE } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="border-t border-[#f5dfe8] bg-[#fff9fb]">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-10 sm:px-6 lg:grid-cols-4 lg:px-8">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="relative h-12 w-12 overflow-hidden rounded-full bg-white ring-1 ring-[#f1dae4]">
              <Image src="/images/adi-fashion-logo.png" alt="Logo Adi's Fashion" width={48} height={48} />
            </div>
            <div>
              <p className="text-lg font-semibold text-[#1a1a1a]">{APP_NAME}</p>
              <p className="text-sm text-[#6f6d70]">{APP_TAGLINE}</p>
            </div>
          </div>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-[#2f2f30]">Navigation</h3>
          <ul className="space-y-3 text-sm text-[#555]">
            <li><Link href="/products" className="hover:text-[#d95d8d]">Catalogue</Link></li>
            <li><Link href="/categories" className="hover:text-[#d95d8d]">Catégories</Link></li>
            <li><Link href="/cart" className="hover:text-[#d95d8d]">Panier</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-[#2f2f30]">Contact</h3>
          <ul className="space-y-3 text-sm text-[#555]">
            <li className="flex items-center gap-2"><Phone className="h-4 w-4 text-[#25d366]" /> WhatsApp</li>
            <li className="flex items-center gap-2"><Music2 className="h-4 w-4 text-[#111111]" /> TikTok</li>
          </ul>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-[#2f2f30]">Informations</h3>
          <p className="text-sm leading-6 text-[#555]">
            Livraison partout au Maroc. Qualité premium, styles élégants et pièces pensées pour chaque moment.
          </p>
        </div>
      </div>

      <div className="border-t border-[#f3d8e4] bg-white/60">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-4 text-sm text-[#555] sm:flex-row sm:px-6 lg:px-8">
          <p>© 2026 Adi&apos;s Fashion</p>
          <div className="flex items-center gap-4">
            <a href="https://wa.me/212600000000" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 hover:text-[#25d366]">
              <MessageCircleMore className="h-4 w-4" /> WhatsApp
            </a>
            <a href="https://www.tiktok.com" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 hover:text-[#111111]">
              <Music2 className="h-4 w-4" /> TikTok
            </a>
          </div>
        </div>

        <div className="border-t border-[#f6e1ea] bg-white/40">
          <p className="mx-auto max-w-7xl px-4 py-3 text-center text-[11px] tracking-[0.08em] text-[#7d7278] sm:px-6 lg:px-8">
            Créé par <a href="https://www.linkedin.com/company/sawana-digital-agency/" target="_blank" rel="noreferrer" className="font-semibold text-[#3d3a3d] transition hover:text-[#d95d8d]">Sawana Tech</a>
          </p>
        </div>
      </div>
    </footer>
  );
}
