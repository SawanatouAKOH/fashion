import type { Product } from "@/types/product";
import { ProductCard } from "@/components/products/ProductCard";

export function ProductGrid({ products }: { products: Product[] }) {
  if (products.length === 0) {
    return (
      <div className="border-y border-[#f1dfe7] py-14 text-center">
        <p className="text-lg font-semibold text-[#282327]">Aucun article pour le moment</p>
        <p className="mt-2 text-sm text-[#746970]">Les prochaines pièces de la collection arrivent bientôt.</p>
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
