import Image from "next/image";
import Link from "next/link";

import { formatPrice } from "@/lib/constants";
import type { Product } from "@/types/product";

export function ProductCard({ product }: { product: Product }) {
  const productImage =
    product.images.find((image) => typeof image === "string" && image.trim().length > 0) ??
    "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=80";

  return (
    <article className="group min-w-0 overflow-hidden rounded-2xl border border-[#f1e3e9] bg-white p-1.5 shadow-[0_5px_18px_rgba(40,20,30,0.04)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_28px_rgba(40,20,30,0.09)] sm:rounded-[22px] sm:p-2">
      <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-[#fff6fa] sm:rounded-[17px]">
        <Link href={`/products/${product.id}`} aria-label={`Voir le produit ${product.name}`} className="block">
          <Image
            src={productImage}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
            className="object-cover transition duration-500 group-hover:scale-105"
            priority={false}
          />
        </Link>

        <div className="absolute inset-x-2 top-2 flex items-start justify-between gap-1 sm:inset-x-3 sm:top-3">
          {product.isNew ? (
            <span className="rounded-full bg-[#d95d8d] px-2 py-1 text-[9px] font-semibold uppercase text-white sm:px-2.5 sm:text-[10px]">
              Nouveau
            </span>
          ) : (
            <span className="rounded-full bg-white/90 px-2 py-1 text-[9px] font-semibold uppercase text-[#4d474a] backdrop-blur-sm sm:px-2.5 sm:text-[10px]">
              Populaire
            </span>
          )}

          {product.status === "COMING_SOON" ? (
            <span className="rounded-full bg-[#fff3f8] px-2 py-1 text-[9px] font-semibold uppercase text-[#b14d6c] sm:px-2.5 sm:text-[10px]">
              Bientôt
            </span>
          ) : null}
        </div>
      </div>

      <div className="space-y-2 p-1.5 pt-3 sm:space-y-3 sm:p-2 sm:pt-4">
        <div className="flex flex-wrap items-center justify-between gap-x-2 gap-y-1">
          <p className="truncate text-[9px] font-semibold uppercase text-[#9b8f96] sm:text-[10px]">{product.category}</p>
          <span className="text-sm font-bold text-[#1b1b1b] sm:text-lg">
            {product.status === "COMING_SOON" ? "À venir" : formatPrice(product.price)}
          </span>
        </div>

        <Link href={`/products/${product.id}`} className="block line-clamp-2 min-h-10 text-sm font-semibold leading-5 text-[#181818] transition hover:text-[#d95d8d] sm:min-h-12 sm:text-base sm:leading-6">
          {product.name}
        </Link>

        <div className="flex min-h-5 items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2">
            {product.colors.slice(0, 4).map((color) => (
              <span
                key={`${product.id}-${color.name}`}
                aria-label={color.name}
                title={color.name}
                className="inline-block h-4 w-4 rounded-full border border-[#e4dfe3] shadow-sm sm:h-5 sm:w-5"
                style={{ backgroundColor: color.hex }}
              />
            ))}
          </div>
        </div>

        <Link
          href={`/products/${product.id}`}
          className="inline-flex w-full items-center justify-center rounded-full bg-[#f6d8e5] px-2 py-2.5 text-xs font-semibold text-[#1d1d1d] transition hover:bg-[#f2c8d9] sm:px-4 sm:py-3 sm:text-sm"
        >
          {product.status === "COMING_SOON" ? "Voir la pièce" : "Voir la pièce"}
        </Link>
      </div>
    </article>
  );
}
