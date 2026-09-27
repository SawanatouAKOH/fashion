import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { ProductGrid } from "@/components/products/ProductGrid";
import { getProducts } from "@/data/products";

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string }>;
}) {
  const { search = "" } = await searchParams;
  const products = await getProducts();
  const normalizedSearch = search.trim().toLocaleLowerCase("fr");
  const visibleProducts = normalizedSearch
    ? products.filter((product) => `${product.name} ${product.category} ${product.description}`.toLocaleLowerCase("fr").includes(normalizedSearch))
    : products;

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <section className="mb-7 border-b border-[#f1dfe7] pb-6 sm:mb-9 sm:pb-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#c06589]">Catalogue</p>
            <h1 className="mt-2 text-3xl font-semibold text-[#181818] sm:text-4xl">Découvrir la collection</h1>
            <p className="mt-3 max-w-2xl text-base leading-7 text-[#5d5a5d]">
              Explorez des pièces conçues pour mettre en valeur votre style, avec des matières élégantes et des silhouettes premium.
            </p>
          </div>

          <Link href="/" className="inline-flex items-center gap-2 text-sm font-medium text-[#4d4346] hover:text-[#d95d8d]">
            Retour à l’accueil
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <div className="mb-6 flex flex-wrap items-center gap-3">
        <span className="rounded-full bg-[#fff1f7] px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-[#c06589]">
          {visibleProducts.length} articles
        </span>
        <span className="rounded-full border border-[#f2dfe7] bg-white px-3 py-1.5 text-xs font-medium text-[#4d474a]">Nouveautés</span>
        <span className="rounded-full border border-[#f2dfe7] bg-white px-3 py-1.5 text-xs font-medium text-[#4d474a]">Édition premium</span>
      </div>

      <ProductGrid products={visibleProducts} />
    </main>
  );
}
