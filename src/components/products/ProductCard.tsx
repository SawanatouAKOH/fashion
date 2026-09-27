import Image from "next/image";
import Link from "next/link";

import { formatPrice } from "@/lib/constants";
import type { Product } from "@/types/product";

export function ProductCard({ product }: { product: Product }) {
  const productImage =
    product.images.find((image) => typeof image === "string" && image.trim().length > 0) ??
    "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=80";

  return (
    <article className="group overflow-hidden rounded-[30px] border border-[#f3dfe8] bg-white p-3 shadow-[0_12px_32px_rgba(18,18,18,0.05)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_42px_rgba(18,18,18,0.09)]">
      <div className="relative overflow-hidden rounded-[24px] bg-[#fff6fa]">
        <Link href={`/products/${product.id}`} aria-label={`Voir le produit ${product.name}`} className="block">
          <Image
            src={productImage}
            alt={product.name}
            width={800}
            height={900}
            sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
            className="h-72 w-full object-cover transition duration-500 group-hover:scale-105"
            priority={false}
          />
        </Link>

        <div className="absolute inset-x-3 top-3 flex items-center justify-between">
          {product.isNew ? (
            <span className="rounded-full bg-[#d95d8d] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-white">
              Nouveau
            </span>
          ) : (
            <span className="rounded-full bg-white/80 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#4d474a] backdrop-blur-sm">
              Best seller
            </span>
          )}

          {product.status === "COMING_SOON" ? (
            <span className="rounded-full bg-[#fff3f8] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#b14d6c]">
              Bientôt
            </span>
          ) : null}
        </div>
      </div>

      <div className="space-y-4 p-2 pt-4">
        <div className="flex items-center justify-between gap-3">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#9b8f96]">{product.category}</p>
          <span className="text-lg font-semibold text-[#1b1b1b]">
            {product.status === "COMING_SOON" ? "À venir" : formatPrice(product.price)}
          </span>
        </div>

        <Link href={`/products/${product.id}`} className="block text-xl font-semibold text-[#181818] transition hover:text-[#d95d8d]">
          {product.name}
        </Link>

        <div className="flex min-h-6 items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2">
            {product.colors.slice(0, 4).map((color) => (
              <span
                key={`${product.id}-${color.name}`}
                aria-label={color.name}
                title={color.name}
                className="inline-block h-5 w-5 rounded-full border border-[#e4dfe3] shadow-sm"
                style={{ backgroundColor: color.hex }}
              />
            ))}
          </div>
          <span className="text-xs font-medium text-[#6a6368]">{product.stock} en stock</span>
        </div>

        <Link
          href={`/products/${product.id}`}
          className="inline-flex w-full items-center justify-center rounded-full bg-[#f6d8e5] px-4 py-3 text-sm font-semibold text-[#1d1d1d] transition hover:bg-[#f2c8d9]"
        >
          {product.status === "COMING_SOON" ? "Voir la pièce" : "Voir la pièce"}
        </Link>
      </div>
    </article>
  );
}
