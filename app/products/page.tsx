import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { ProductGrid } from "@/components/products/ProductGrid";
import { getProducts } from "@/data/products";

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; filter?: string }>;
}) {
  const { search = "", filter = "" } = await searchParams;
  const products = await getProducts();
  const newArrivalsOnly = filter === "new";
  const normalizedSearch = search.trim().toLocaleLowerCase("fr");
  const filteredProducts = newArrivalsOnly ? products.filter((product) => product.isNew) : products;
  const visibleProducts = normalizedSearch
    ? filteredProducts.filter((product) => `${product.name} ${product.category} ${product.description}`.toLocaleLowerCase("fr").includes(normalizedSearch))
    : filteredProducts;

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <section className="mb-7 border-b border-[#f1dfe7] pb-6 sm:mb-9 sm:pb-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#c06589]">{newArrivalsOnly ? "La collection" : "Catalogue"}</p>
            <h1 className="mt-2 text-3xl font-semibold text-[#181818] sm:text-4xl">{newArrivalsOnly ? "Les nouveautés" : "Découvrir la collection"}</h1>
            <p className="mt-3 max-w-2xl text-base leading-7 text-[#5d5a5d]">
              {newArrivalsOnly
                ? "Retrouvez les pièces récemment ajoutées à la boutique."
                : "Explorez des pièces conçues pour mettre en valeur votre style, avec des matières élégantes et des silhouettes premium."}
            </p>
          </div>

          <Link href="/" className="inline-flex items-center gap-2 text-sm font-medium text-[#4d4346] hover:text-[#d95d8d]">
            Retour à l’accueil
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <nav aria-label="Filtrer le catalogue" className="flex flex-wrap gap-2 text-sm font-medium">
          <Link
            href="/products"
            aria-current={!newArrivalsOnly ? "page" : undefined}
            className={`rounded-full px-4 py-2 transition ${!newArrivalsOnly ? "bg-[#d95d8d] text-white" : "border border-[#f2dfe7] bg-white text-[#51464b] hover:bg-[#fff7fa]"}`}
          >
            Tout voir
          </Link>
          <Link
            href="/products?filter=new"
            aria-current={newArrivalsOnly ? "page" : undefined}
            className={`rounded-full px-4 py-2 transition ${newArrivalsOnly ? "bg-[#d95d8d] text-white" : "border border-[#f2dfe7] bg-white text-[#51464b] hover:bg-[#fff7fa]"}`}
          >
            Nouveautés
          </Link>
        </nav>
        <span className="rounded-full bg-[#fff1f7] px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-[#c06589]">
          {visibleProducts.length} articles
        </span>
      </div>

      <ProductGrid
        products={visibleProducts}
        emptyTitle={normalizedSearch ? "Aucun résultat" : newArrivalsOnly ? "Pas encore de nouveautés" : undefined}
        emptyMessage={normalizedSearch
          ? `Aucun article ne correspond à « ${search.trim()} ».`
          : newArrivalsOnly
            ? "Les nouvelles pièces apparaîtront ici dès qu’elles seront ajoutées au catalogue."
            : undefined}
      />
    </main>
  );
}
