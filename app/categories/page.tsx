import { CategoryCard } from "@/components/products/CategoryCard";
import { getCategories, getProducts } from "@/data/products";

export default async function CategoriesPage() {
  const [categories, products] = await Promise.all([getCategories(), getProducts()]);

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <section className="mb-7 border-b border-[#f1dfe7] pb-6 sm:mb-9 sm:pb-8">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#c06589]">Catégories</p>
          <h1 className="mt-2 text-3xl font-semibold text-[#181818] sm:text-4xl">Explorez nos univers</h1>
          <p className="mt-3 text-base leading-7 text-[#5d5a5d]">
            Trouvez la pièce qui correspond à votre style avec des collections pensées pour chaque occasion, du quotidien à l’élégance premium.
          </p>
        </div>
      </section>

      <div className="mb-6 flex flex-wrap items-center gap-3">
        <span className="rounded-full bg-[#fff1f7] px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-[#c06589]">
          {categories.length} collections
        </span>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((category) => (
          <CategoryCard
            key={category.id}
            name={category.name}
            count={products.filter((product) => product.category === category.name).length}
              image={products.find((product) => product.category === category.name)?.images[0]}
          />
        ))}
      </div>
    </main>
  );
}
