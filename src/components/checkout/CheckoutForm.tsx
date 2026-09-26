"use client";

import { useMemo, useState } from "react";

import { useCart } from "@/components/providers/CartProvider";
import { WhatsAppButton } from "@/components/checkout/WhatsAppButton";
import { formatPrice } from "@/lib/constants";

export function CheckoutForm() {
  const { items, total } = useCart();
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    city: "",
    district: "",
    address: "",
    notes: "",
  });

  const isValid = useMemo(
    () =>
      formData.fullName.trim() &&
      formData.phone.trim() &&
      formData.city.trim() &&
      formData.district.trim() &&
      formData.address.trim(),
    [formData],
  );

  const handleChange = (key: keyof typeof formData, value: string) => {
    setFormData((current) => ({ ...current, [key]: value }));
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
      <div className="rounded-[28px] border border-[#f3dfe8] bg-white p-5 shadow-[0_10px_24px_rgba(17,17,17,0.04)] sm:p-6">
        <h1 className="text-2xl font-semibold text-[#191919]">Informations de livraison</h1>

        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          <label className="space-y-2 text-sm text-[#434143] sm:col-span-1">
            <span className="font-medium">Nom et prénom</span>
            <input
              value={formData.fullName}
              onChange={(event) => handleChange("fullName", event.target.value)}
              className="w-full rounded-2xl border border-[#efdae5] bg-[#fffafc] px-4 py-3 outline-none transition focus:border-[#d95d8d]"
              placeholder="Sarah Doe"
            />
          </label>

          <label className="space-y-2 text-sm text-[#434143] sm:col-span-1">
            <span className="font-medium">Téléphone / WhatsApp</span>
            <input
              value={formData.phone}
              onChange={(event) => handleChange("phone", event.target.value)}
              className="w-full rounded-2xl border border-[#efdae5] bg-[#fffafc] px-4 py-3 outline-none transition focus:border-[#d95d8d]"
              placeholder="06 XX XX XX XX"
            />
          </label>

          <label className="space-y-2 text-sm text-[#434143] sm:col-span-1">
            <span className="font-medium">Ville</span>
            <input
              value={formData.city}
              onChange={(event) => handleChange("city", event.target.value)}
              className="w-full rounded-2xl border border-[#efdae5] bg-[#fffafc] px-4 py-3 outline-none transition focus:border-[#d95d8d]"
              placeholder="Casablanca"
            />
          </label>

          <label className="space-y-2 text-sm text-[#434143] sm:col-span-1">
            <span className="font-medium">Quartier</span>
            <input
              value={formData.district}
              onChange={(event) => handleChange("district", event.target.value)}
              className="w-full rounded-2xl border border-[#efdae5] bg-[#fffafc] px-4 py-3 outline-none transition focus:border-[#d95d8d]"
              placeholder="Maarif"
            />
          </label>

          <label className="space-y-2 text-sm text-[#434143] sm:col-span-2">
            <span className="font-medium">Adresse ou lieu de livraison</span>
            <textarea
              value={formData.address}
              onChange={(event) => handleChange("address", event.target.value)}
              className="min-h-24 w-full rounded-2xl border border-[#efdae5] bg-[#fffafc] px-4 py-3 outline-none transition focus:border-[#d95d8d]"
              placeholder="N° de rue, boulevard, code postal, etc."
            />
          </label>

          <label className="space-y-2 text-sm text-[#434143] sm:col-span-2">
            <span className="font-medium">Informations complémentaires</span>
            <textarea
              value={formData.notes}
              onChange={(event) => handleChange("notes", event.target.value)}
              className="min-h-20 w-full rounded-2xl border border-[#efdae5] bg-[#fffafc] px-4 py-3 outline-none transition focus:border-[#d95d8d]"
              placeholder="Ex. : interphone, heure de livraison, notes spéciales..."
            />
          </label>
        </div>
      </div>

      <aside className="rounded-[28px] border border-[#f2dfe7] bg-[#fff9fb] p-5 shadow-[0_10px_24px_rgba(17,17,17,0.04)]">
        <h2 className="text-xl font-semibold text-[#181818]">Résumé de la commande</h2>

        <div className="mt-5 space-y-4">
          {items.length === 0 ? (
            <p className="text-sm text-[#5e5c5f]">Votre panier est vide.</p>
          ) : (
            items.map((item) => (
              <div key={`${item.productId}-${item.size}-${item.color}`} className="rounded-2xl border border-[#f3dfe8] bg-white p-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-medium text-[#1f1f1f]">{item.name}</p>
                    <p className="text-sm text-[#666]">Taille : {item.size}</p>
                    <p className="text-sm text-[#666]">Couleur : {item.color}</p>
                    <p className="text-sm text-[#666]">Quantité : {item.quantity}</p>
                  </div>
                  <span className="font-semibold text-[#1d1d1d]">{formatPrice(item.price * item.quantity)}</span>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="mt-6 border-t border-[#f0dfe8] pt-4">
          <div className="flex items-center justify-between text-[#1d1d1d]">
            <span className="font-medium">Total</span>
            <span className="text-xl font-bold">{formatPrice(total)}</span>
          </div>
        </div>

        {isValid && items.length > 0 ? (
          <div className="mt-6">
            <WhatsAppButton
              customer={formData}
              items={items}
              total={total}
            />
          </div>
        ) : (
          <div className="mt-6 rounded-2xl bg-[#fff4f8] p-3 text-sm text-[#5d5d5d]">
            Remplissez les informations de livraison et ajoutez des articles pour finaliser votre commande.
          </div>
        )}
      </aside>
    </div>
  );
}
