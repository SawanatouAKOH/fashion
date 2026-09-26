"use client";

import Image from "next/image";
import { Minus, Plus, Trash2 } from "lucide-react";

import { useCart } from "@/components/providers/CartProvider";
import { formatPrice } from "@/lib/constants";

export function CartItem({
  productId,
  name,
  size,
  color,
  price,
  quantity,
  image,
}: {
  productId: string;
  name: string;
  size: string;
  color: string;
  price: number;
  quantity: number;
  image: string;
}) {
  const { updateQuantity, removeItem } = useCart();

  return (
    <div className="flex items-center gap-4 rounded-[24px] border border-[#f2dfe7] bg-white p-3 shadow-[0_8px_18px_rgba(18,18,18,0.03)]">
      <div className="relative h-24 w-20 overflow-hidden rounded-[18px] bg-[#fff6fa]">
        <Image src={image} alt={name} width={180} height={220} className="h-full w-full object-cover" />
      </div>

      <div className="flex-1 space-y-2">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-base font-semibold text-[#1d1d1d]">{name}</h3>
            <p className="text-sm text-[#5e5c5f]">Taille : {size}</p>
            <p className="text-sm text-[#5e5c5f]">Couleur : {color}</p>
          </div>

          <button
            type="button"
            onClick={() => removeItem(productId, size, color)}
            aria-label="Supprimer le produit du panier"
            className="rounded-full bg-[#fff3f7] p-2 text-[#d95d8d] transition hover:bg-[#f8dfe8]"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>

        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 rounded-full border border-[#f0dfe6] bg-[#fffafc] px-2 py-1">
            <button
              type="button"
              onClick={() => updateQuantity(productId, size, color, -1)}
              className="flex h-7 w-7 items-center justify-center rounded-full bg-[#f5e3eb] text-[#1d1d1d]"
              aria-label="Diminuer la quantité"
            >
              <Minus className="h-4 w-4" />
            </button>
            <span className="min-w-6 text-center text-sm font-semibold text-[#1d1d1d]">{quantity}</span>
            <button
              type="button"
              onClick={() => updateQuantity(productId, size, color, 1)}
              className="flex h-7 w-7 items-center justify-center rounded-full bg-[#f5e3eb] text-[#1d1d1d]"
              aria-label="Augmenter la quantité"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>

          <span className="text-base font-semibold text-[#181818]">{formatPrice(price * quantity)}</span>
        </div>
      </div>
    </div>
  );
}
