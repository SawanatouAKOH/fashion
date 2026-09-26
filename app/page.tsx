import Link from "next/link";
import { ArrowRight, Check, Sparkles, Star } from "lucide-react";

import { CategoryCard } from "@/components/products/CategoryCard";
import { ProductGrid } from "@/components/products/ProductGrid";
import { getCategories, getFeaturedProducts, getNewProducts } from "@/data/products";
import { APP_NAME, APP_TAGLINE } from "@/lib/constants";

export default async function HomePage() {
  const [featuredProducts, newProducts, categories] = await Promise.all([
    getFeaturedProducts(),
    getNewProducts(),
    getCategories(),
  ]);

  const highlights = [
    "Livraison rapide au Maroc",
    "Styles premium et élégants",
    "Commande facile via WhatsApp",
  ];

  const editorialHighlights = [
    { value: "4.9/5", label: "Avis clients" },
    { value: "24h", label: "Traitement rapide" },
    { value: "+200", label: "Pièces sélectionnées" },
  ];

  const heroImages = [
    {
      src: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=900&q=80",
      alt: "Modèle en tenue élégante",
    },
    {
      src: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=900&q=80",
      alt: "Portrait de mode premium",
    },
  ];

  return (
    <>
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <div className="grid items-center gap-8 overflow-hidden rounded-[36px] border border-[#f4dfe8] bg-gradient-to-br from-[#fff8fb] via-white to-[#fff4f8] p-6 shadow-[0_12px_35px_rgba(19,19,19,0.04)] lg:grid-cols-[1.1fr_0.9fr] lg:p-10">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#f3d9e6] bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-[#6f5661]">
              <Sparkles className="h-3.5 w-3.5 text-[#d95d8d]" />
              Boutique premium
            </div>

            <div className="space-y-4">
              <h1 className="text-4xl font-semibold leading-tight text-[#181818] sm:text-5xl lg:text-6xl">
                {APP_NAME}
              </h1>
              <p className="text-xl font-medium text-[#d95d8d]">{APP_TAGLINE}</p>
              <p className="max-w-xl text-base leading-7 text-[#5d5a5d]">
                Une sélection de pièces raffinées pour sublimer chaque moment : élégance, confort et assurance dans chaque détail.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link href="/products" className="inline-flex items-center justify-center gap-2 rounded-full bg-[#d95d8d] px-6 py-3 text-base font-semibold text-white transition hover:bg-[#ca4f7a]">
                Découvrir la collection
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/categories" className="inline-flex items-center justify-center rounded-full border border-[#efdae4] bg-white px-6 py-3 text-base font-semibold text-[#2a2a2b] transition hover:border-[#d8c3ce]">
                Explorer les catégories
              </Link>
            </div>

            <div className="flex flex-wrap gap-3 pt-2 text-sm text-[#4a4347]">
              {highlights.map((item) => (
                <span key={item} className="inline-flex items-center gap-2 rounded-full border border-[#f1dbe5] bg-white/80 px-3 py-1.5">
                  <Check className="h-4 w-4 text-[#d95d8d]" />
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {heroImages.map((image, index) => (
              <div
                key={image.alt}
                className={`overflow-hidden rounded-[30px] border border-[#f2dde8] bg-white p-2 shadow-[0_12px_28px_rgba(17,17,17,0.04)] ${index === 1 ? "mt-10" : ""}`}
              >
                <img src={image.src} alt={image.alt} className="h-64 w-full rounded-[24px] object-cover object-center" />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6 overflow-hidden rounded-[30px] border border-[#f4dfe8] bg-gradient-to-br from-[#fff7fa] via-white to-[#fff1f6] p-5 shadow-[0_14px_32px_rgba(17,17,17,0.04)] sm:p-7">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#c06589]">Sélection du moment</p>
              <h2 className="mt-2 text-2xl font-semibold text-[#191919] sm:text-3xl">Une mode qui raconte votre style.</h2>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              {editorialHighlights.map((item) => (
                <div key={item.label} className="rounded-[22px] border border-[#f3dfe7] bg-white px-4 py-3 text-center shadow-sm">
                  <p className="text-xl font-semibold text-[#1d1b1c]">{item.value}</p>
                  <p className="mt-1 text-xs uppercase tracking-[0.16em] text-[#7a6a71]">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#c06589]">Les nouveautés</p>
            <h2 className="mt-2 text-2xl font-semibold text-[#191919] sm:text-3xl">Nouveautés</h2>
          </div>
          <Link href="/products" className="text-sm font-medium text-[#d95d8d] hover:text-[#ca4f7a]">Voir plus</Link>
        </div>

        <ProductGrid products={newProducts} />
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#c06589]">Best sellers</p>
            <h2 className="mt-2 text-2xl font-semibold text-[#191919] sm:text-3xl">Produits populaires</h2>
          </div>
          <Link href="/products" className="text-sm font-medium text-[#d95d8d] hover:text-[#ca4f7a]">Voir toute la collection</Link>
        </div>

        <ProductGrid products={featuredProducts.length > 0 ? featuredProducts : newProducts} />
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
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
          {categories.map((category) => (
            <CategoryCard key={category.id} name={category.name} count={0} />
          ))}
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
