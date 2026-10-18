import type { Product } from "@/types/product";
import { ProductCard } from "@/components/products/ProductCard";

export function ProductGrid({
  products,
  emptyTitle = "Aucun article pour le moment",
  emptyMessage = "Les prochaines pièces de la collection arrivent bientôt.",
}: {
  products: Product[];
  emptyTitle?: string;
  emptyMessage?: string;
}) {
  if (products.length === 0) {
    return (
      <div className="border-y border-[#f1dfe7] py-14 text-center">
        <p className="text-lg font-semibold text-[#282327]">{emptyTitle}</p>
        <p className="mt-2 text-sm text-[#746970]">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
