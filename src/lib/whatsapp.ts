import { APP_NAME, APP_URL, WHATSAPP_NUMBER, formatPrice } from "@/lib/constants";
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
    imageUrl ? `Photo : ${imageUrl}` : "",
    `Fiche produit : ${baseUrl}/products/${encodeURIComponent(item.productId)}`,
  ].filter(Boolean);
}

export function buildWhatsAppOrderMessage(
  customer: CustomerOrderInformation,
  items: CartLineItem[],
  total: number,
  orderReference?: string,
) {
  const itemCount = items.reduce((count, item) => count + item.quantity, 0);
  const productsBlock = items
    .map((item, index) => [
      `${index + 1}. *${item.name}*`,
      `Taille : ${item.size} | Couleur : ${item.color}`,
      `Quantité : ${item.quantity} | Prix unitaire : ${formatPrice(item.price)}`,
      `Total article : ${formatPrice(item.price * item.quantity)}`,
      ...getItemLinks(item),
    ].join("\n"))
    .join("\n\n");

  return [
    `Bonjour, je souhaite passer une commande auprès de *${APP_NAME}*.`,
    "",
    orderReference ? `*Référence :* #${orderReference.slice(0, 8).toUpperCase()}` : "",
    `*Client :* ${customer.fullName}`,
    `*Téléphone :* ${customer.phone}`,
    "",
    "*Adresse de livraison*",
    `${customer.city} - ${customer.district}`,
    customer.address,
    customer.notes?.trim() ? `*Précisions :* ${customer.notes.trim()}` : "",
    "",
    `*Articles commandés (${itemCount})*`,
    productsBlock,
    "",
    `*Total de la commande : ${formatPrice(total)}*`,
    "",
    "Merci de me confirmer la disponibilité des articles et le délai de livraison.",
  ]
    .filter(Boolean)
    .join("\n");
}

export function getWhatsAppOrderUrl(
  customer: CustomerOrderInformation,
  items: CartLineItem[],
  total: number,
  orderReference: string,
) {
  const message = buildWhatsAppOrderMessage(customer, items, total, orderReference);
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
