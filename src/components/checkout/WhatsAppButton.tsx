"use client";

import { MessageCircleMore } from "lucide-react";
import { useState } from "react";

import type { CartLineItem } from "@/types/product";
import { getWhatsAppOrderUrl } from "@/lib/whatsapp";

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

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customer, items }),
      });
      const result = await response.json();

      if (!response.ok || typeof result.id !== "string") {
        throw new Error(result.error ?? "Impossible d’enregistrer la commande.");
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
