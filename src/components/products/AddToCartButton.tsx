"use client";

import { ShoppingCart } from "lucide-react";

import { useCart } from "@/components/providers/CartProvider";
import type { Product } from "@/types/product";

export function AddToCartButton({
  product,
  selectedSize,
  selectedColor,
  quantity,
  onAdded,
}: {
  product: Product;
  selectedSize: string;
  selectedColor: string;
  quantity: number;
  onAdded?: () => void;
}) {
  const { addItem } = useCart();

  const isDisabled = !selectedSize || !selectedColor;

  const handleAddToCart = () => {
    if (isDisabled) {
      return;
    }

    addItem({
      productId: product.id,
      name: product.name,
      size: selectedSize,
      color: selectedColor,
      price: product.price,
      quantity,
      image: product.images[0],
    });

    onAdded?.();
  };

  return (
    <button
      type="button"
      onClick={handleAddToCart}
      disabled={isDisabled}
      className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#d95d8d] px-5 py-3 text-base font-semibold text-white transition hover:bg-[#ca4f7a] disabled:cursor-not-allowed disabled:bg-[#f2d7e3] disabled:text-[#7f767b]"
    >
      <ShoppingCart className="h-5 w-5" />
      Ajouter au panier
    </button>
  );
}
