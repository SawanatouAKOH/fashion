"use client";

import Link from "next/link";
import { ArrowLeft, CalendarClock, ShoppingBag } from "lucide-react";
import { useMemo, useState } from "react";

import { AddToCartButton } from "@/components/products/AddToCartButton";
import { ColorSelector } from "@/components/products/ColorSelector";
import { ProductGallery } from "@/components/products/ProductGallery";
import { SizeSelector } from "@/components/products/SizeSelector";
import { WHATSAPP_NUMBER } from "@/lib/constants";
import { formatPrice } from "@/lib/constants";
import type { Product } from "@/types/product";

export function ProductDetailClient({ product }: { product: Product }) {
  const [selectedSize, setSelectedSize] = useState(product.sizes[0] ?? "");
  const [selectedColor, setSelectedColor] = useState(product.colors[0]?.name ?? "");
  const [quantity, setQuantity] = useState(1);

  const isComingSoon = product.status === "COMING_SOON";
  const price = useMemo(() => product.price * quantity, [product.price, quantity]);

  const reservationLink = (() => {
    const message = [
      "Réservation Adi's Fashion",
      "",
      `Produit : ${product.name}`,
      `Taille : ${selectedSize || "À préciser"}`,
      `Couleur : ${selectedColor || "À préciser"}`,
      `Quantité : ${quantity}`,
      `Client : Je souhaite réserver ce produit.`,
      "",
      "Produit actuellement : Bientôt disponible",
    ].join("\n");

    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  })();

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Link href="/products" className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-[#4a3f45] hover:text-[#d95d8d]">
        <ArrowLeft className="h-4 w-4" />
        Retour au catalogue
      </Link>

      <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10">
        <ProductGallery images={product.images} name={product.name} />

        <div className="space-y-5 lg:py-3">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-[#a06d85]">{product.category}</p>
            <h1 className="mt-2 text-3xl font-semibold text-[#191919] sm:text-4xl">{product.name}</h1>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-3xl font-bold text-[#1d1d1d]">
              {isComingSoon ? "À venir" : formatPrice(product.price)}
            </span>
            {product.isNew ? <span className="rounded-full bg-[#f7e2eb] px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[#d95d8d]">Nouveau</span> : null}
            {isComingSoon ? <span className="rounded-full bg-[#fff0f5] px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[#b14d6c]">Bientôt disponible</span> : null}
          </div>

          <p className="text-base leading-7 text-[#4c4c4c]">{product.description}</p>

          {isComingSoon && product.estimatedArrival ? (
            <div className="flex items-center gap-2 rounded-2xl border border-[#f1dfe8] bg-[#fff7fa] px-4 py-3 text-sm text-[#4a3f45]">
              <CalendarClock className="h-4 w-4 text-[#d95d8d]" />
              Date estimée d’arrivée : {new Date(product.estimatedArrival).toLocaleDateString("fr-FR")}
            </div>
          ) : null}

          <div className="space-y-6 border-y border-[#f2dfe7] bg-[#fffafc] p-5 sm:rounded-2xl sm:border">
            {product.sizes.length > 0 ? (
              <SizeSelector sizes={product.sizes} selectedSize={selectedSize} onSelect={setSelectedSize} />
            ) : null}

            {product.colors.length > 0 ? (
              <ColorSelector colors={product.colors} selectedColor={selectedColor} onSelect={setSelectedColor} />
            ) : null}

            {!isComingSoon ? (
              <>
                <div className="space-y-3">
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#666]">Quantité</p>
                  <div className="flex w-fit items-center gap-3 rounded-full border border-[#f0dfe6] bg-white px-3 py-2">
                    <button
                      type="button"
                      onClick={() => setQuantity((current) => Math.max(1, current - 1))}
                      className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f8ebf1] text-lg text-[#2f2f30]"
                      aria-label="Réduire la quantité"
                    >
                      -
                    </button>
                    <span className="min-w-8 text-center text-base font-semibold text-[#1d1d1d]">{quantity}</span>
                    <button
                      type="button"
                      onClick={() => setQuantity((current) => Math.min(product.stock, current + 1))}
                      className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f8ebf1] text-lg text-[#2f2f30]"
                      aria-label="Augmenter la quantité"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="rounded-2xl border border-[#f3dfe7] bg-white p-4">
                  <p className="text-sm text-[#666]">Prix total</p>
                  <p className="mt-1 text-2xl font-bold text-[#191919]">{formatPrice(price)}</p>
                </div>

                <AddToCartButton
                  product={product}
                  selectedSize={selectedSize}
                  selectedColor={selectedColor}
                  quantity={quantity}
                  onAdded={() => {
                    setQuantity(1);
                  }}
                />
              </>
            ) : (
              <a
                href={reservationLink}
                target="_blank"
                rel="noreferrer"
                className="inline-flex w-full items-center justify-center rounded-full bg-[#d95d8d] px-5 py-3 text-base font-semibold text-white transition hover:bg-[#ca4f7a]"
              >
                Réserver
              </a>
            )}
          </div>

          <div className="flex items-center gap-2 rounded-2xl bg-[#fff7fa] p-4 text-sm text-[#4f4a4c]">
            <ShoppingBag className="h-5 w-5 text-[#d95d8d]" />
            {isComingSoon ? "Ce produit est bientôt disponible. Réservez-le dès maintenant." : "Livraison rapide et commande facile via WhatsApp."}
          </div>
        </div>
      </div>
    </div>
  );
}
