"use client";

import { MessageCircleMore } from "lucide-react";
import { useState } from "react";

import type { CartLineItem } from "@/types/product";
import { createOrderReference } from "@/lib/order-reference";
import { buildWhatsAppOrderMessage, getWhatsAppOrderUrl } from "@/lib/whatsapp";

async function loadOrderImages(items: CartLineItem[]) {
  const images = [...new Map(items.filter((item) => item.image).map((item) => [item.image, item])).values()];
  const files = await Promise.all(images.map(async (item, index) => {
    const response = await fetch(item.image);
    if (!response.ok) throw new Error("Une photo n’a pas pu être préparée pour le partage.");

    const blob = await response.blob();
    if (!blob.type.startsWith("image/")) throw new Error("Une photo produit n’est pas accessible au partage.");

    const extension = blob.type.split("/")[1]?.replace("jpeg", "jpg") || "jpg";
    const safeName = item.name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9-]/gi, "-").replace(/-+/g, "-").toLowerCase();
    return new File([blob], `${safeName || `article-${index + 1}`}.${extension}`, { type: blob.type });
  }));

  return files;
}

export function WhatsAppButton({
  customer,
  items,
  total,
}: {
  customer: {
    fullName: string;
    phone: string;
    city: string;
    district: string;
    address: string;
    notes?: string;
  };
  items: CartLineItem[];
  total: number;
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleOrder() {
    setError("");
    const whatsappWindow = window.open("about:blank", "_blank");

    if (!whatsappWindow) {
      setError("Autorisez les fenêtres pop-up pour ouvrir WhatsApp et envoyer votre demande.");
      return;
    }

    whatsappWindow.opener = null;
    setIsSubmitting(true);
    const orderReference = createOrderReference();

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customer, items, orderReference }),
      });
      const result = await response.json();

      if (!response.ok || typeof result.id !== "string") {
        throw new Error(result.error ?? "Impossible d’enregistrer la commande.");
      }

      try {
        const files = await loadOrderImages(items);
        const shareData: ShareData = {
          title: "Commande Adi's Fashion",
          text: buildWhatsAppOrderMessage(customer, items, total, result.id, false),
          files,
        };

        if (files.length > 0 && navigator.canShare?.({ files }) && navigator.share) {
          try {
            await navigator.share(shareData);
            whatsappWindow.close();
            return;
          } catch (shareError) {
            if (shareError instanceof DOMException && shareError.name === "AbortError") {
              whatsappWindow.close();
              setError(`Commande enregistrée (${result.id}), mais le partage a été annulé.`);
              return;
            }
          }
        }
      } catch {
        // If direct image sharing is unavailable, use the WhatsApp message with photo URLs.
      }

      whatsappWindow.location.href = getWhatsAppOrderUrl(customer, items, total, result.id);
    } catch (submitError) {
      whatsappWindow.close();
      setError(submitError instanceof Error ? submitError.message : "Impossible de préparer la commande.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div>
      <button
        type="button"
        onClick={() => void handleOrder()}
        disabled={isSubmitting}
        className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#25d366] px-5 py-3 text-base font-semibold text-white transition hover:bg-[#1fb85b] disabled:cursor-wait disabled:opacity-70"
      >
        <MessageCircleMore className="h-5 w-5" />
        {isSubmitting ? "Préparation de la commande..." : "Commander sur WhatsApp"}
      </button>
      {error ? <p role="alert" className="mt-3 text-sm text-[#b14d6c]">{error}</p> : null}
    </div>
  );
}
