"use client";

import Link from "next/link";
import { ArrowLeft, CalendarClock, ShoppingBag } from "lucide-react";
import { useMemo, useState, type FormEvent } from "react";

import { AddToCartButton } from "@/components/products/AddToCartButton";
import { ColorSelector } from "@/components/products/ColorSelector";
import { ProductGallery } from "@/components/products/ProductGallery";
import { SizeSelector } from "@/components/products/SizeSelector";
import { formatPrice } from "@/lib/constants";
import { getWhatsAppReservationUrl, type CustomerOrderInformation } from "@/lib/whatsapp";
import type { Product } from "@/types/product";

export function ProductDetailClient({ product }: { product: Product }) {
  const [selectedSize, setSelectedSize] = useState(product.sizes[0] ?? "");
  const [selectedColor, setSelectedColor] = useState(product.colors[0]?.name ?? "");
  const [quantity, setQuantity] = useState(1);
  const [reservationCustomer, setReservationCustomer] = useState<CustomerOrderInformation>({
    fullName: "",
    phone: "",
    city: "",
    district: "",
    address: "",
    notes: "",
  });
  const [isReserving, setIsReserving] = useState(false);
  const [reservationError, setReservationError] = useState("");

  const isComingSoon = product.status === "COMING_SOON";
  const price = useMemo(() => product.price * quantity, [product.price, quantity]);

  async function handleReservation(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setReservationError("");

    const whatsappWindow = window.open("about:blank", "_blank");
    if (!whatsappWindow) {
      setReservationError("Autorisez les fenêtres pop-up pour ouvrir WhatsApp et envoyer votre réservation.");
      return;
    }

    whatsappWindow.opener = null;
    setIsReserving(true);

    try {
      const response = await fetch("/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer: reservationCustomer,
          item: {
            productId: product.id,
            size: selectedSize,
            color: selectedColor,
            quantity,
          },
        }),
      });
      const result = await response.json();

      if (!response.ok || typeof result.id !== "string") {
        throw new Error(result.error ?? "Impossible d’enregistrer la réservation.");
      }

      whatsappWindow.location.href = getWhatsAppReservationUrl(
        reservationCustomer,
        {
          productId: product.id,
          name: product.name,
          size: selectedSize,
          color: selectedColor,
          price: product.price,
          quantity,
          image: product.images[0] ?? "",
        },
        result.id,
      );
    } catch (submitError) {
      whatsappWindow.close();
      setReservationError(submitError instanceof Error ? submitError.message : "Impossible de préparer la réservation.");
    } finally {
      setIsReserving(false);
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Link href="/products" className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-[#4a3f45] hover:text-[#d95d8d]">
        <ArrowLeft className="h-4 w-4" />
        Retour au catalogue
      </Link>

      <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10">
        <ProductGallery images={product.images} name={product.name} />

        <div className="space-y-5 lg:py-3">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-[#a06d85]">{product.category}</p>
            <h1 className="mt-2 text-3xl font-semibold text-[#191919] sm:text-4xl">{product.name}</h1>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-3xl font-bold text-[#1d1d1d]">
              {isComingSoon ? "À venir" : formatPrice(product.price)}
            </span>
            {product.isNew ? <span className="rounded-full bg-[#f7e2eb] px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[#d95d8d]">Nouveau</span> : null}
            {isComingSoon ? <span className="rounded-full bg-[#fff0f5] px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[#b14d6c]">Bientôt disponible</span> : null}
          </div>

          <p className="text-base leading-7 text-[#4c4c4c]">{product.description}</p>

          {isComingSoon && product.estimatedArrival ? (
            <div className="flex items-center gap-2 rounded-2xl border border-[#f1dfe8] bg-[#fff7fa] px-4 py-3 text-sm text-[#4a3f45]">
              <CalendarClock className="h-4 w-4 text-[#d95d8d]" />
              Date estimée d’arrivée : {new Date(product.estimatedArrival).toLocaleDateString("fr-FR")}
            </div>
          ) : null}

          <div className="space-y-6 border-y border-[#f2dfe7] bg-[#fffafc] p-5 sm:rounded-2xl sm:border">
            {product.sizes.length > 0 ? (
              <SizeSelector sizes={product.sizes} selectedSize={selectedSize} onSelect={setSelectedSize} />
            ) : null}

            {product.colors.length > 0 ? (
              <ColorSelector colors={product.colors} selectedColor={selectedColor} onSelect={setSelectedColor} />
            ) : null}

            {!isComingSoon ? (
              <>
                <div className="space-y-3">
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#666]">Quantité</p>
                  <div className="flex w-fit items-center gap-3 rounded-full border border-[#f0dfe6] bg-white px-3 py-2">
                    <button
                      type="button"
                      onClick={() => setQuantity((current) => Math.max(1, current - 1))}
                      className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f8ebf1] text-lg text-[#2f2f30]"
                      aria-label="Réduire la quantité"
                    >
                      -
                    </button>
                    <span className="min-w-8 text-center text-base font-semibold text-[#1d1d1d]">{quantity}</span>
                    <button
                      type="button"
                      onClick={() => setQuantity((current) => Math.min(product.stock, current + 1))}
                      className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f8ebf1] text-lg text-[#2f2f30]"
                      aria-label="Augmenter la quantité"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="rounded-2xl border border-[#f3dfe7] bg-white p-4">
                  <p className="text-sm text-[#666]">Prix total</p>
                  <p className="mt-1 text-2xl font-bold text-[#191919]">{formatPrice(price)}</p>
                </div>

                <AddToCartButton
                  product={product}
                  selectedSize={selectedSize}
                  selectedColor={selectedColor}
                  quantity={quantity}
                  onAdded={() => {
                    setQuantity(1);
                  }}
                />
              </>
            ) : (
              <form onSubmit={(event) => void handleReservation(event)} className="space-y-3 border-t border-[#f2dfe7] pt-5">
                <div>
                  <p className="font-semibold text-[#252125]">Réserver cette pièce</p>
                  <p className="mt-1 text-xs leading-5 text-[#70656b]">Laissez vos coordonnées pour que le vendeur puisse confirmer la disponibilité.</p>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <input required maxLength={150} value={reservationCustomer.fullName} onChange={(event) => setReservationCustomer((current) => ({ ...current, fullName: event.target.value }))} placeholder="Nom et prénom" aria-label="Nom et prénom" className="w-full rounded-xl border border-[#efdae5] bg-white px-3 py-2.5 text-sm outline-none focus:border-[#d95d8d]" />
                  <input required maxLength={40} type="tel" value={reservationCustomer.phone} onChange={(event) => setReservationCustomer((current) => ({ ...current, phone: event.target.value }))} placeholder="Téléphone / WhatsApp" aria-label="Téléphone ou WhatsApp" className="w-full rounded-xl border border-[#efdae5] bg-white px-3 py-2.5 text-sm outline-none focus:border-[#d95d8d]" />
                  <input value={reservationCustomer.city} onChange={(event) => setReservationCustomer((current) => ({ ...current, city: event.target.value }))} placeholder="Ville" aria-label="Ville" className="w-full rounded-xl border border-[#efdae5] bg-white px-3 py-2.5 text-sm outline-none focus:border-[#d95d8d]" />
                  <input value={reservationCustomer.district} onChange={(event) => setReservationCustomer((current) => ({ ...current, district: event.target.value }))} placeholder="Quartier" aria-label="Quartier" className="w-full rounded-xl border border-[#efdae5] bg-white px-3 py-2.5 text-sm outline-none focus:border-[#d95d8d]" />
                </div>
                <textarea required maxLength={2000} value={reservationCustomer.address} onChange={(event) => setReservationCustomer((current) => ({ ...current, address: event.target.value }))} placeholder="Adresse de livraison" aria-label="Adresse de livraison" rows={2} className="w-full rounded-xl border border-[#efdae5] bg-white px-3 py-2.5 text-sm outline-none focus:border-[#d95d8d]" />
                <textarea value={reservationCustomer.notes} onChange={(event) => setReservationCustomer((current) => ({ ...current, notes: event.target.value }))} placeholder="Précision facultative" aria-label="Précision facultative" rows={2} className="w-full rounded-xl border border-[#efdae5] bg-white px-3 py-2.5 text-sm outline-none focus:border-[#d95d8d]" />
                {reservationError ? <p role="alert" className="text-sm text-[#b14d6c]">{reservationError}</p> : null}
                <button type="submit" disabled={isReserving} className="inline-flex w-full items-center justify-center rounded-full bg-[#d95d8d] px-5 py-3 text-base font-semibold text-white transition hover:bg-[#ca4f7a] disabled:cursor-wait disabled:opacity-70">
                  {isReserving ? "Enregistrement..." : "Enregistrer et réserver sur WhatsApp"}
                </button>
              </form>
            )}
          </div>

          <div className="flex items-center gap-2 rounded-2xl bg-[#fff7fa] p-4 text-sm text-[#4f4a4c]">
            <ShoppingBag className="h-5 w-5 text-[#d95d8d]" />
            {isComingSoon ? "Ce produit est bientôt disponible. Réservez-le dès maintenant." : "Livraison en 48 h partout au Maroc. Commande simple via WhatsApp."}
          </div>
        </div>
      </div>
    </div>
  );
}
