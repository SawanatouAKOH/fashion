import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { getCategorySlug } from "@/lib/constants";

const categoryBackgrounds: Record<string, string> = {
  Robes: "from-[#f7dde8] via-[#fff8fb] to-[#fff4f8]",
  Ensembles: "from-[#f8ebf3] via-[#fffafc] to-[#fef5fb]",
  Hauts: "from-[#fdf1f6] via-[#fffafc] to-[#fff5f7]",
  Pantalons: "from-[#fbe7ef] via-[#fffafa] to-[#fff5f8]",
  Accessoires: "from-[#f9ecf2] via-[#fffafc] to-[#fff4f8]",
};

const categoryBadges: Record<string, string> = {
  Robes: "Élégance de soirée",
  Ensembles: "Looks assortis",
  Hauts: "Essentials premium",
  Pantalons: "Silhouette sculptée",
  Accessoires: "Détails chic",
};

export function CategoryCard({
  name,
  count,
}: {
  name: string;
  count: number;
}) {
  const href = `/categories/${getCategorySlug(name)}`;

  return (
    <Link
      href={href}
      className={`group block overflow-hidden rounded-[30px] border border-[#f7dfe9] bg-gradient-to-br ${categoryBackgrounds[name] ?? "from-[#fbeaf1] to-[#fffafc]"} p-5 text-left shadow-[0_10px_30px_rgba(17,17,17,0.04)] transition hover:-translate-y-1 hover:shadow-[0_16px_36px_rgba(17,17,17,0.06)]`}
    >
      <div className="mb-5 flex items-center justify-between">
        <span className="rounded-full bg-white/80 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#555]">
          {count} pièces
        </span>
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/80 text-[#d95d8d] shadow-sm">
          <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
        </span>
      </div>

      <div className="rounded-[22px] bg-white/55 p-4 backdrop-blur-sm">
        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#a36d85]">{categoryBadges[name] ?? "Collection"}</p>
        <h3 className="mt-2 text-2xl font-semibold text-[#181818]">{name}</h3>
        <p className="mt-2 text-sm leading-6 text-[#5d5d5d]">Découvrir la sélection {name.toLowerCase()} et trouver la pièce qui vous ressemble.</p>
      </div>
    </Link>
  );
}
