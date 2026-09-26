"use client";

import Link from "next/link";

import { useCart } from "@/components/providers/CartProvider";
import { formatPrice } from "@/lib/constants";

export function CartSummary() {
  const { subtotal, itemCount } = useCart();

  return (
    <aside className="rounded-[28px] border border-[#f1dfe8] bg-[#fff9fb] p-6 shadow-[0_8px_18px_rgba(18,18,18,0.04)]">
      <h2 className="text-xl font-semibold text-[#171717]">Résumé</h2>
      <div className="mt-4 space-y-3 text-sm text-[#555]">
        <div className="flex items-center justify-between">
          <span>Produits</span>
          <span>{itemCount}</span>
        </div>
        <div className="flex items-center justify-between border-t border-[#f1dfe7] pt-3 text-[#1c1c1c]">
          <span className="font-medium">Sous-total</span>
          <span className="font-semibold">{formatPrice(subtotal)}</span>
        </div>
      </div>

      <Link
        href="/checkout"
        className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-[#d95d8d] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#c74d77]"
      >
        Passer la commande
      </Link>
    </aside>
  );
}
