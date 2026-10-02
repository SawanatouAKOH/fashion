import { APP_NAME, APP_URL, WHATSAPP_NUMBER, formatPrice } from "@/lib/constants";
import { formatOrderReference } from "@/lib/order-reference";
import type { CartLineItem } from "@/types/product";

export type CustomerOrderInformation = {
  fullName: string;
  phone: string;
  city: string;
  district: string;
  address: string;
  notes?: string;
};

function getItemLinks(item: CartLineItem) {
  const baseUrl = APP_URL.replace(/\/+$/, "");
  const imageUrl = item.image
    ? /^https?:\/\//i.test(item.image)
      ? item.image
      : `${baseUrl}${item.image.startsWith("/") ? "" : "/"}${item.image}`
    : "";

  return [
    imageUrl,
  ].filter(Boolean);
}

export function buildWhatsAppOrderMessage(
  customer: CustomerOrderInformation,
  items: CartLineItem[],
  total: number,
  orderReference?: string,
  includeImageLinks = true,
) {
  const itemCount = items.reduce((count, item) => count + item.quantity, 0);
  const productsBlock = items
    .map((item) => [
      `• *${item.name}* — ${item.size}, ${item.color} × ${item.quantity} | ${formatPrice(item.price * item.quantity)}`,
      ...(includeImageLinks ? getItemLinks(item) : []),
    ].join("\n"))
    .join("\n");

  return [
    `Bonjour, voici ma commande *${APP_NAME}*.`,
    orderReference ? `Réf. : ${formatOrderReference(orderReference)}` : "",
    `Client : ${customer.fullName} | ${customer.phone}`,
    `Livraison : ${customer.city}, ${customer.district}`,
    customer.address,
    customer.notes?.trim() ? `Note : ${customer.notes.trim()}` : "",
    `Articles (${itemCount}) :`,
    productsBlock,
    `Total : *${formatPrice(total)}*`,
    "Merci de confirmer la disponibilité et la livraison.",
  ]
    .filter(Boolean)
    .join("\n");
}

export function getWhatsAppOrderUrl(
  customer: CustomerOrderInformation,
  items: CartLineItem[],
  total: number,
  orderReference: string,
  includeImageLinks = true,
) {
  const message = buildWhatsAppOrderMessage(customer, items, total, orderReference, includeImageLinks);
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export function getWhatsAppReservationUrl(
  customer: CustomerOrderInformation,
  item: CartLineItem,
  reservationReference: string,
) {
  const message = [
    `*DEMANDE DE RÉSERVATION | ${APP_NAME.toUpperCase()}*`,
    "────────────────────────",
    `Référence : #${reservationReference.slice(0, 8).toUpperCase()}`,
    "",
    "*CLIENT*",
    `Nom : ${customer.fullName}`,
    `Téléphone / WhatsApp : ${customer.phone}`,
    "",
    "*ARTICLE À RÉSERVER*",
    `Produit : ${item.name}`,
    `Taille : ${item.size || "À préciser"}`,
    `Couleur : ${item.color || "À préciser"}`,
    `Quantité : ${item.quantity}`,
    `Prix indicatif : ${formatPrice(item.price)}`,
    ...getItemLinks(item),
    "",
    "*LIVRAISON SOUHAITÉE*",
    `Ville : ${customer.city || "À préciser"}`,
    `Quartier : ${customer.district || "À préciser"}`,
    `Adresse : ${customer.address}`,
    customer.notes?.trim() ? `Instructions : ${customer.notes.trim()}` : "",
    "",
    "Merci de confirmer la réservation et la date de disponibilité.",
  ].filter(Boolean).join("\n");

  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
