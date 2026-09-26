"use client";

import { MessageCircleMore } from "lucide-react";

import type { CartLineItem } from "@/types/product";
import { openWhatsAppOrder } from "@/lib/whatsapp";

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
  return (
    <button
      type="button"
      onClick={() => openWhatsAppOrder(customer, items, total)}
      className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#25d366] px-5 py-3 text-base font-semibold text-white transition hover:bg-[#1fb85b]"
    >
      <MessageCircleMore className="h-5 w-5" />
      Commander sur WhatsApp
    </button>
  );
}
