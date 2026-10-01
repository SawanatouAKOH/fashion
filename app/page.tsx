import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Check, Sparkles, Star } from "lucide-react";

import { CategoryCard } from "@/components/products/CategoryCard";
import { ProductGrid } from "@/components/products/ProductGrid";
import { getCategories, getFeaturedProducts, getNewProducts } from "@/data/products";
import { APP_NAME } from "@/lib/constants";

export default async function HomePage() {
  const [featuredProducts, newProducts, categories] = await Promise.all([
    getFeaturedProducts(),
    getNewProducts(),
    getCategories(),
  ]);

  const highlights = [
    "Livraison en 48 h partout au Maroc",
    "Styles premium et élégants",
    "Commande facile via WhatsApp",
  ];

  const heroProducts = [...featuredProducts, ...newProducts]
    .filter((product, index, allProducts) =>
      product.featured &&
      product.images.some((image) => typeof image === "string" && image.trim()) &&
      allProducts.findIndex((candidate) => candidate.id === product.id) === index,
    )
    .slice(0, 2);

  return (
    <>
      <section className="mx-auto max-w-7xl px-4 pb-5 pt-5 sm:px-6 lg:px-8 lg:pb-8 lg:pt-8">
        <div className="overflow-hidden rounded-[30px] border border-[#f3dfe7] bg-gradient-to-br from-[#fff8fb] via-white to-[#fff3f7] p-4 shadow-[0_18px_42px_rgba(17,17,17,0.05)] sm:p-7 lg:rounded-[36px] lg:p-9">
          <div className="grid items-center gap-5 lg:grid-cols-[0.9fr_1.1fr] lg:gap-9">
            <div className="space-y-4 lg:space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#f2d9e5] bg-white px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#735e66]">
                <Sparkles className="h-3.5 w-3.5 text-[#d95d8d]" />
                Boutique premium
              </div>

              <div className="space-y-4">
                <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#c06589]">{APP_NAME}</p>
                <h1 className="text-3xl font-semibold leading-tight text-[#171719] sm:text-4xl lg:text-5xl">
                  Le tissu africain, autrement. Moderne. Élégant. Audacieux.
                </h1>
                <p className="max-w-xl text-sm leading-6 text-[#555459] sm:text-base sm:leading-7">
                  Des créations modernes qui célèbrent la richesse de nos tissus et de notre culture.
                </p>
              </div>

              <div className="flex flex-col gap-2 sm:flex-row">
                <Link href="/products" className="inline-flex items-center justify-center gap-2 rounded-full bg-[#d95d8d] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_12px_26px_rgba(217,93,141,0.25)] transition hover:bg-[#cd496f] sm:text-base">
                  Découvrir la boutique
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link href="/categories" className="inline-flex items-center justify-center rounded-full border border-[#efd8e2] bg-white px-5 py-2.5 text-sm font-semibold text-[#2b2b2d] transition hover:border-[#d8bfd0] hover:bg-[#fff8fb] sm:text-base">
                  Voir les catégories
                </Link>
              </div>

              <div className="hidden flex-wrap gap-2 pt-1 sm:flex">
                {highlights.map((item) => (
                  <span key={item} className="inline-flex items-center gap-2 rounded-full border border-[#f1dbe5] bg-white/80 px-3 py-1.5 text-sm text-[#4b4649]">
                    <Check className="h-4 w-4 text-[#d95d8d]" />
                    {item}
                  </span>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 sm:gap-3">
              {heroProducts.map((product, index) => {
                const image = product.images.find((candidate) => typeof candidate === "string" && candidate.trim());
                if (!image) return null;

                return (
                <div
                  key={product.id}
                  className={`relative aspect-[4/5] overflow-hidden rounded-[20px] border border-[#f2dfe8] bg-[#fff4f8] shadow-[0_12px_28px_rgba(17,17,17,0.05)] sm:rounded-[25px] ${index === 1 ? "mt-5 sm:mt-8" : ""}`}
                >
                  <Image src={image} alt={product.name} fill sizes="(max-width: 640px) 45vw, 30vw" priority={index === 0} className="object-cover" />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent px-3 pb-3 pt-10 sm:px-4 sm:pb-4">
                    <p className="line-clamp-1 text-xs font-semibold text-white sm:text-sm">{product.name}</p>
                  </div>
                </div>
                );
              })}
              {heroProducts.length === 0 ? (
                <div className="col-span-2 flex aspect-[4/3] items-center justify-center rounded-[20px] border border-dashed border-[#e8cbd8] bg-[#fff8fb] p-5 text-center text-sm text-[#76636c] sm:rounded-[25px]">
                  Les pièces mises en avant apparaîtront ici avec leurs photos.
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      <section id="nouveautes" className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8 lg:py-8">
        <div className="mb-6 flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#c06589]">Les nouveautés</p>
            <h2 className="mt-2 text-2xl font-semibold text-[#191919] sm:text-3xl">Nouveautés</h2>
          </div>
          <Link href="/products" className="text-sm font-medium text-[#d95d8d] hover:text-[#ca4f7a]">Voir plus</Link>
        </div>

        <ProductGrid products={newProducts.slice(0, 8)} />
      </section>

      <section className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8 lg:py-8">
        <div className="mb-6 flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#c06589]">Best sellers</p>
            <h2 className="mt-2 text-2xl font-semibold text-[#191919] sm:text-3xl">Produits populaires</h2>
          </div>
          <Link href="/products" className="text-sm font-medium text-[#d95d8d] hover:text-[#ca4f7a]">Voir toute la collection</Link>
        </div>

        <ProductGrid products={(featuredProducts.length > 0 ? featuredProducts : newProducts).slice(0, 4)} />
      </section>

      <section className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8 lg:py-8">
        <div className="rounded-[32px] border border-[#f4dfe8] bg-white p-6 shadow-[0_12px_28px_rgba(17,17,17,0.03)] sm:p-8">
          <div className="mb-6 flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#c06589]">Avis clients</p>
              <h2 className="mt-2 text-2xl font-semibold text-[#191919]">Le style que vous allez adorer</h2>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full bg-[#fff5f9] px-3 py-1.5 text-sm font-medium text-[#d95d8d]">
              <Star className="h-4 w-4 fill-[#d95d8d] text-[#d95d8d]" />
              4.9/5
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {[
              { quote: "La qualité est au rendez-vous et le look est encore plus beau en vrai.", name: "Sofia" },
              { quote: "Très belle boutique, très fluide à commander. J’ai reçu une pièce parfaite.", name: "Yasmine" },
              { quote: "Les finitions et les couleurs sont vraiment premium. J’adore.", name: "Nadia" },
            ].map((review) => (
              <div key={review.name} className="rounded-[24px] border border-[#f3e0ea] bg-[#fffafc] p-5">
                <div className="mb-3 flex items-center gap-1 text-[#d95d8d]">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Star key={`${review.name}-${index}`} className="h-4 w-4 fill-[#d95d8d] text-[#d95d8d]" />
                  ))}
                </div>
                <p className="text-sm leading-7 text-[#4d474a]">“{review.quote}”</p>
                <p className="mt-4 text-sm font-semibold text-[#191919]">{review.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#c06589]">Nos univers</p>
            <h2 className="mt-2 text-2xl font-semibold text-[#191919] sm:text-3xl">Catégories</h2>
          </div>
          <Link href="/categories" className="text-sm font-medium text-[#d95d8d] hover:text-[#ca4f7a]">Voir toutes</Link>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-5">
          {categories.map((category) => {
            const categoryProducts = [...newProducts, ...featuredProducts].filter((product) => product.category === category.name);
            return (
              <CategoryCard
                key={category.id}
                name={category.name}
                count={categoryProducts.length}
                image={categoryProducts[0]?.images[0]}
              />
            );
          })}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="rounded-[32px] border border-[#f3dfe7] bg-gradient-to-r from-[#fff7fa] to-[#ffffff] p-8 text-center shadow-[0_10px_26px_rgba(17,17,17,0.04)] sm:p-12">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#c06589]">La sélection premium</p>
          <h2 className="mt-4 text-3xl font-semibold text-[#191919] sm:text-4xl">Faites entrer l’élégance dans votre garde-robe.</h2>
          <Link href="/products" className="mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-[#d95d8d] px-6 py-3 text-base font-semibold text-white transition hover:bg-[#ca4f7a]">
            Découvrir toute la collection
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </>
  );
}
