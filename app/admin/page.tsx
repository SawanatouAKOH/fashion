import Link from "next/link";
import { connection } from "next/server";

import { prisma } from "@/lib/prisma";
import { formatOrderReference } from "@/lib/order-reference";

export default async function AdminPage() {
  await connection();

  const [productsCount, availableCount, comingSoonCount, ordersCount, pendingOrdersCount, confirmedOrdersCount, reservationsCount, pendingReservationsCount, latestProducts, latestOrders, latestReservations] = await Promise.all([
    prisma.product.count(),
    prisma.product.count({ where: { status: "AVAILABLE" } }),
    prisma.product.count({ where: { status: "COMING_SOON" } }),
    prisma.order.count(),
    prisma.order.count({ where: { status: "PENDING" } }),
    prisma.order.count({ where: { status: "CONFIRMED" } }),
    prisma.reservation.count(),
    prisma.reservation.count({ where: { status: "PENDING" } }),
    prisma.product.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: { category: true },
    }),
    prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
    }),
    prisma.reservation.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
    }),
  ]);

  const stats = [
    { label: "Produits", value: productsCount, hint: "total" },
    { label: "Disponibles", value: availableCount, hint: "stock actif" },
    { label: "Bientôt dispo.", value: comingSoonCount, hint: "coming soon" },
    { label: "Commandes", value: ordersCount, hint: "total" },
    { label: "En attente", value: pendingOrdersCount, hint: "commandes" },
    { label: "Confirmées", value: confirmedOrdersCount, hint: "commandes" },
    { label: "Réservations", value: reservationsCount, hint: "total" },
    { label: "Réservations en attente", value: pendingReservationsCount, hint: "à traiter" },
  ];

  return (
    <main className="space-y-8">
      <section className="rounded-[32px] border border-[#f3dfe8] bg-gradient-to-r from-[#fff7fa] via-white to-white p-6 shadow-[0_14px_30px_rgba(17,17,17,0.04)] sm:p-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#c06589]">Administration</p>
            <h1 className="mt-3 text-3xl font-semibold text-[#191919] sm:text-4xl">Tableau de bord</h1>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link href="/admin/products" className="inline-flex items-center justify-center rounded-full bg-[#d95d8d] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#ca4f7a]">
              + Ajouter un produit
            </Link>
            <Link href="/admin/categories" className="inline-flex items-center justify-center rounded-full border border-[#efd7e5] bg-white px-4 py-2.5 text-sm font-semibold text-[#3c3638] transition hover:border-[#d95d8d]">
              Voir les catégories
            </Link>
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-[24px] border border-[#f1dde6] bg-white p-5 shadow-[0_12px_28px_rgba(16,16,16,0.03)]">
            <p className="text-sm font-medium text-[#6d6367]">{stat.label}</p>
            <div className="mt-4 flex items-end justify-between gap-3">
              <span className="text-3xl font-semibold text-[#191919]">{stat.value}</span>
              <span className="rounded-full bg-[#fff0f6] px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#c06589]">{stat.hint}</span>
            </div>
          </div>
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-[28px] border border-[#f2dfe7] bg-white p-5 shadow-[0_12px_28px_rgba(18,18,18,0.03)]">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="text-xl font-semibold text-[#191919]">Derniers produits</h2>
            <Link href="/admin/products" className="text-sm font-semibold text-[#d95d8d]">Voir tout</Link>
          </div>

          <div className="space-y-3">
            {latestProducts.length === 0 ? (
              <p className="rounded-2xl border border-dashed border-[#ecd2dc] bg-[#fffafc] p-4 text-sm text-[#5d5557]">Aucun produit pour le moment.</p>
            ) : (
              latestProducts.map((product) => {
                const productImages = Array.isArray(product.images) ? product.images : [];
                const firstImage = productImages.find((image) => typeof image === "string");
                const imageSrc = typeof firstImage === "string" ? firstImage : "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=80";

                return (
                  <div key={product.id} className="flex items-center justify-between gap-3 rounded-2xl border border-[#f3e2ea] bg-[#fffafc] p-3">
                    <div className="flex items-center gap-3">
                      <img src={imageSrc} alt={product.name} className="h-12 w-12 rounded-xl object-cover" />
                      <div>
                        <p className="font-semibold text-[#1b1b1b]">{product.name}</p>
                        <p className="text-xs text-[#72696d]">{product.category?.name ?? "Catégorie"}</p>
                      </div>
                    </div>
                    <span className="text-sm font-semibold text-[#1e1d1e]">{Number(product.price).toLocaleString("fr-FR")} DH</span>
                  </div>
                );
              })
            )}
          </div>
        </div>

        <div className="rounded-[28px] border border-[#f2dfe7] bg-white p-5 shadow-[0_12px_28px_rgba(18,18,18,0.03)]">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="text-xl font-semibold text-[#191919]">Dernières commandes</h2>
            <Link href="/admin/orders" className="text-sm font-semibold text-[#d95d8d]">Voir tout</Link>
          </div>

          <div className="space-y-3">
            {latestOrders.length === 0 ? (
              <p className="rounded-2xl border border-dashed border-[#ecd2dc] bg-[#fffafc] p-4 text-sm text-[#5d5557]">Aucune commande enregistrée.</p>
            ) : (
              latestOrders.map((order) => (
                <div key={order.id} className="rounded-2xl border border-[#f3e2ea] bg-[#fffafc] p-3">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-semibold text-[#1b1b1b]">{formatOrderReference(order.id)}</p>
                    <span className="rounded-full bg-[#f7edf2] px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#c06589]">{order.status}</span>
                  </div>
                  <p className="mt-2 text-sm text-[#5d5557]">{order.customerName} • {order.phone}</p>
                  <p className="mt-1 text-sm font-semibold text-[#1d1b1c]">{Number(order.total).toLocaleString("fr-FR")} DH</p>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      <section className="rounded-[28px] border border-[#f2dfe7] bg-white p-5 shadow-[0_12px_28px_rgba(18,18,18,0.03)]">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="text-xl font-semibold text-[#191919]">Dernières réservations</h2>
          <Link href="/admin/reservations" className="text-sm font-semibold text-[#d95d8d]">Voir tout</Link>
        </div>

        <div className="space-y-3">
          {latestReservations.length === 0 ? (
            <p className="rounded-2xl border border-dashed border-[#ecd2dc] bg-[#fffafc] p-4 text-sm text-[#5d5557]">Aucune réservation enregistrée.</p>
          ) : (
            latestReservations.map((reservation) => (
              <div key={reservation.id} className="flex items-center justify-between gap-3 rounded-2xl border border-[#f3e2ea] bg-[#fffafc] p-3">
                <div>
                  <p className="font-semibold text-[#1b1b1b]">{reservation.customerName}</p>
                  <p className="text-sm text-[#5d5557]">{reservation.phone} • {reservation.city ?? "Ville non renseignée"}</p>
                </div>
                <span className="rounded-full bg-[#f7edf2] px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#c06589]">{reservation.status}</span>
              </div>
            ))
          )}
        </div>
      </section>
    </main>
  );
}
