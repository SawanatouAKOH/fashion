import { WHATSAPP_NUMBER } from "@/lib/constants";
import { formatPrice } from "@/lib/constants";
import type { CartLineItem } from "@/types/product";

export type CustomerOrderInformation = {
  fullName: string;
  phone: string;
  city: string;
  district: string;
  address: string;
  notes?: string;
};

export function buildWhatsAppOrderMessage(
  customer: CustomerOrderInformation,
  items: CartLineItem[],
  total: number,
) {
  const itemCount = items.reduce((count, item) => count + item.quantity, 0);
  const productsBlock = items
    .map((item, index) => [
      `*${String(index + 1).padStart(2, "0")} · ${item.name}*`,
      `Taille : ${item.size}`,
      `Couleur : ${item.color}`,
      `Quantité : ${item.quantity}`,
      `Prix unitaire : ${formatPrice(item.price)}`,
      `Sous-total : ${formatPrice(item.price * item.quantity)}`,
    ].join("\n"))
    .join("\n\n────────────────────\n\n");

  return [
    "*NOUVELLE COMMANDE | ADI'S FASHION*",
    "────────────────────────",
    "",
    "*CLIENT*",
    `Nom : ${customer.fullName}`,
    `Téléphone / WhatsApp : ${customer.phone}`,
    "",
    "*ADRESSE DE LIVRAISON*",
    `Ville : ${customer.city}`,
    `Quartier : ${customer.district}`,
    `Adresse : ${customer.address}`,
    customer.notes?.trim() ? `Instructions : ${customer.notes.trim()}` : "",
    "",
    `*ARTICLES (${itemCount})*`,
    productsBlock,
    "",
    "────────────────────────",
    `*TOTAL DE LA COMMANDE : ${formatPrice(total)}*`,
    "",
    "Merci de confirmer la disponibilité et les modalités de livraison.",
  ]
    .filter(Boolean)
    .join("\n");
}

export function openWhatsAppOrder(customer: CustomerOrderInformation, items: CartLineItem[], total: number) {
  const message = buildWhatsAppOrderMessage(customer, items, total);
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  window.open(url, "_blank", "noopener,noreferrer");
}
