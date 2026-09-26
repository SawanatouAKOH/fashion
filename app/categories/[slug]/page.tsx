import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";

import { ProductGrid } from "@/components/products/ProductGrid";
import { getCategories, getProducts } from "@/data/products";
import { getCategorySlug } from "@/lib/constants";

export default async function CategoryDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [categories, products] = await Promise.all([getCategories(), getProducts()]);
  const category = categories.find((item) => getCategorySlug(item.name) === slug);

  if (!category) {
    notFound();
  }

  const categoryProducts = products.filter((product) => product.category === category.name);

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <section className="mb-8 overflow-hidden rounded-[32px] border border-[#f4dfe8] bg-gradient-to-br from-[#fff8fb] via-white to-[#fff4f8] p-6 shadow-[0_12px_30px_rgba(18,18,18,0.04)] sm:p-8">
        <Link href="/categories" className="inline-flex items-center gap-2 text-sm font-medium text-[#4d4346] hover:text-[#d95d8d]">
          <ArrowLeft className="h-4 w-4" />
          Retour aux catégories
        </Link>

        <div className="mt-4 max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#c06589]">Catégorie</p>
          <h1 className="mt-2 text-3xl font-semibold text-[#181818] sm:text-4xl">{category.name}</h1>
          <p className="mt-3 text-base leading-7 text-[#5d5a5d]">
            Une sélection pensée pour mettre en valeur votre style avec des pièces élégantes et faciles à porter.
          </p>
        </div>
      </section>

      <div className="mb-6 flex flex-wrap items-center gap-3">
        <span className="rounded-full bg-[#fff1f7] px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-[#c06589]">
          {categoryProducts.length} articles
        </span>
      </div>

      <ProductGrid products={categoryProducts} />
    </main>
  );
}
