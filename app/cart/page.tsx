"use client";

import Link from "next/link";
import { ArrowLeft, ShoppingBag } from "lucide-react";

import { CartItem } from "@/components/cart/CartItem";
import { CartSummary } from "@/components/cart/CartSummary";
import { useCart } from "@/components/providers/CartProvider";

export default function CartPage() {
  const { items } = useCart();

  return (
    <main className="mx-auto min-h-[60vh] max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
      <div className="mb-8 flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#c06589]">Panier</p>
          <h1 className="mt-2 text-3xl font-semibold text-[#181818] sm:text-4xl">Votre sélection</h1>
        </div>

        <Link href="/products" className="inline-flex items-center gap-2 text-sm font-medium text-[#4d4346] hover:text-[#d95d8d]">
          <ArrowLeft className="h-4 w-4" />
          Continuer les achats
        </Link>
      </div>

      {items.length === 0 ? (
        <div className="border-y border-[#f2dfe7] bg-[#fffafc] p-8 text-center sm:p-12">
          <ShoppingBag className="mx-auto h-12 w-12 text-[#d95d8d]" />
          <h2 className="mt-4 text-2xl font-semibold text-[#1d1d1d]">Votre panier est vide</h2>
          <p className="mt-2 text-[#5d5d5d]">Ajoutez une pièce à votre sélection pour la commander.</p>
          <Link href="/products" className="mt-6 inline-flex rounded-full bg-[#d95d8d] px-5 py-3 text-sm font-semibold text-white hover:bg-[#ca4f7a]">
            Découvrir la collection
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-4">
            {items.map((item) => (
              <CartItem key={`${item.productId}-${item.size}-${item.color}`} {...item} />
            ))}
          </div>

          <CartSummary />
        </div>
      )}
    </main>
  );
}
