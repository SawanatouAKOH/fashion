import Link from "next/link";
import Image from "next/image";
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
  image,
}: {
  name: string;
  count: number;
  image?: string;
}) {
  const href = `/categories/${getCategorySlug(name)}`;

  return (
    <Link
      href={href}
      className="group relative block aspect-[4/3] overflow-hidden rounded-[22px] border border-[#f7dfe9] bg-[#fff4f8] text-left shadow-[0_10px_30px_rgba(17,17,17,0.04)] transition hover:-translate-y-1 hover:shadow-[0_16px_36px_rgba(17,17,17,0.08)]"
    >
      {image ? <Image src={image} alt={`Collection ${name}`} fill sizes="(max-width: 768px) 50vw, 33vw" className="object-cover transition duration-500 group-hover:scale-105" /> : null}
      <div className={`absolute inset-0 ${image ? "bg-gradient-to-t from-black/70 via-black/10 to-transparent" : `bg-gradient-to-br ${categoryBackgrounds[name] ?? "from-[#fbeaf1] to-[#fffafc]"}`}`} />
      <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-4 sm:p-5">
        <div>
          <p className={`text-[10px] font-semibold uppercase ${image ? "text-white/80" : "text-[#a36d85]"}`}>{categoryBadges[name] ?? "Collection"} · {count} pièces</p>
          <h3 className={`mt-1 text-xl font-semibold ${image ? "text-white" : "text-[#181818]"}`}>{name}</h3>
        </div>
        <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-[#d95d8d] shadow-sm">
          <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  );
}
