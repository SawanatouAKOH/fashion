"use client";

import { useCart } from "@/components/providers/CartProvider";
import { CheckoutForm } from "@/components/checkout/CheckoutForm";

export default function CheckoutPage() {
  const { items } = useCart();

  if (items.length === 0) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-12 text-center sm:px-6 lg:px-8">
        <h1 className="text-3xl font-semibold text-[#191919]">Commande</h1>
        <p className="mt-3 text-[#58585b]">Ajoutez d’abord des produits à votre panier pour finaliser votre commande.</p>
      </main>
    );
  }

  return (
    <main className="mx-auto min-h-[60vh] max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
      <CheckoutForm />
    </main>
  );
}
