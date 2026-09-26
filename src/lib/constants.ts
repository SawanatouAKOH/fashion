export const WHATSAPP_NUMBER = "212693267744";
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

export const APP_NAME = "Adi's Fashion";
export const APP_TAGLINE = "L'élégance et la qualité";

export const CATEGORY_SLUGS: Record<string, string> = {
  Robes: "robes",
  Ensembles: "ensembles",
  Hauts: "hauts",
  Pantalons: "pantalons",
  Accessoires: "accessoires",
};

export function getCategorySlug(category: string) {
  return CATEGORY_SLUGS[category] ?? category.toLowerCase().replace(/\s+/g, "-");
}

export function formatPrice(value: number) {
  return `${new Intl.NumberFormat("fr-MA").format(value)} DH`;
}
