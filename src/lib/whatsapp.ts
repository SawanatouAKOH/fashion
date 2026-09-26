import { WHATSAPP_NUMBER } from "@/lib/constants";
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
  const productsBlock = items
    .map(
      (item) =>
        `${item.name}\nTaille : ${item.size}\nCouleur : ${item.color}\nQuantité : ${item.quantity}\nPrix : ${item.price} DH`,
    )
    .join("\n\n");

  return [
    "🛍️ NOUVELLE COMMANDE — ADI'S FASHION",
    "",
    `👤 Client :\n${customer.fullName}`,
    `📞 Téléphone :\n${customer.phone}`,
    "",
    "📍 Livraison :",
    `${customer.city}`,
    `${customer.district}`,
    `${customer.address}`,
    customer.notes ? `ℹ️ Informations complémentaires :\n${customer.notes}` : "",
    "",
    "📦 PRODUITS :",
    productsBlock,
    "",
    `💰 TOTAL : ${total} DH`,
  ]
    .filter(Boolean)
    .join("\n");
}

export function openWhatsAppOrder(customer: CustomerOrderInformation, items: CartLineItem[], total: number) {
  const message = buildWhatsAppOrderMessage(customer, items, total);
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  window.open(url, "_blank", "noopener,noreferrer");
}
