"use client";

import { Eye, PackageCheck, Trash2 } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";

import { formatOrderReference } from "@/lib/order-reference";

type OrderItem = {
  id: string;
  productName: string;
  size?: string | null;
  color?: string | null;
  quantity: number;
  price: number;
};

type Order = {
  id: string;
  customerName: string;
  phone: string;
  city?: string | null;
  district?: string | null;
  deliveryAddress: string;
  notes?: string | null;
  total: number;
  status: "PENDING" | "CONFIRMED" | "PROCESSING" | "SHIPPED" | "COMPLETED" | "CANCELLED";
  createdAt: string;
  items: OrderItem[];
};

const statusOptions = ["ALL", "PENDING", "CONFIRMED", "PROCESSING", "SHIPPED", "COMPLETED", "CANCELLED"] as const;
const statusLabels: Record<Exclude<(typeof statusOptions)[number], "ALL">, string> = {
  PENDING: "En attente",
  CONFIRMED: "Confirmée",
  PROCESSING: "En préparation",
  SHIPPED: "Expédiée",
  COMPLETED: "Terminée",
  CANCELLED: "Annulée",
};

export function OrdersManager() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<(typeof statusOptions)[number]>("ALL");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [actionError, setActionError] = useState("");
  const [actionMessage, setActionMessage] = useState("");

  const loadOrders = useCallback(async () => {
    const params = new URLSearchParams();
    if (search.trim()) params.set("search", search.trim());
    if (statusFilter !== "ALL") params.set("status", statusFilter);

    try {
      const response = await fetch(`/api/admin/orders${params.toString() ? `?${params.toString()}` : ""}`);
      const data = (await response.json()) as Order[];
      setOrders(data);
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter]);

  useEffect(() => {
    void loadOrders();
  }, [loadOrders]);

  async function openDetails(id: string) {
    const response = await fetch(`/api/admin/orders?id=${id}`);
    const data = (await response.json()) as Order;
    setSelectedOrder(data);
  }

  async function updateStatus(id: string, nextStatus: Order["status"]) {
    setActionError("");
    setActionMessage("");
    setUpdatingId(id);
    const response = await fetch("/api/admin/orders", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status: nextStatus }),
    });

    if (response.ok) {
      const updated = (await response.json()) as Order;
      setOrders((current) => current.map((order) => (order.id === updated.id ? updated : order)));
      if (selectedOrder?.id === updated.id) {
        setSelectedOrder(updated);
      }
    }

    setUpdatingId(null);
  }

  async function deleteOrder(order: Order) {
    if (!window.confirm(`Supprimer définitivement la commande ${formatOrderReference(order.id)} de ${order.customerName} ?`)) {
      return;
    }

    setActionError("");
    setActionMessage("");
    setDeletingId(order.id);

    try {
      const response = await fetch(`/api/admin/orders?id=${encodeURIComponent(order.id)}`, { method: "DELETE" });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error ?? "Impossible de supprimer cette commande.");

      setOrders((current) => current.filter((item) => item.id !== order.id));
      if (selectedOrder?.id === order.id) setSelectedOrder(null);
      setActionMessage("Commande supprimée.");
    } catch (error) {
      setActionError(error instanceof Error ? error.message : "Impossible de supprimer cette commande.");
    } finally {
      setDeletingId(null);
    }
  }

  const visibleOrders = useMemo(() => {
    const normalized = search.trim().toLowerCase();
    if (!normalized && statusFilter === "ALL") return orders;

    return orders.filter((order) => {
      const matchesSearch =
        normalized.length === 0 ||
        order.customerName.toLowerCase().includes(normalized) ||
        order.phone.includes(normalized) ||
        order.id.toLowerCase().includes(normalized);

      const matchesStatus = statusFilter === "ALL" || order.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [orders, search, statusFilter]);

  return (
    <div className="space-y-6">
      <div className="border-b border-[#f2dfe7] bg-white pb-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#c06589]">Commandes</p>
            <h1 className="mt-2 text-3xl font-semibold text-[#191919]">Gestion des commandes</h1>
          </div>

          <div className="flex flex-wrap gap-3">
            <input value={search} onChange={(event) => { setLoading(true); setSearch(event.target.value); }} placeholder="Rechercher client, téléphone..." className="rounded-full border border-[#ecdfe6] bg-[#fffafc] px-3 py-2 text-sm outline-none transition focus:border-[#d95d8d]" />
            <select value={statusFilter} onChange={(event) => { setLoading(true); setStatusFilter(event.target.value as (typeof statusOptions)[number]); }} className="rounded-full border border-[#ecdfe6] bg-[#fffafc] px-3 py-2 text-sm outline-none transition focus:border-[#d95d8d]">
              {statusOptions.map((option) => (
                <option key={option} value={option}>{option === "ALL" ? "Tous les statuts" : statusLabels[option]}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="mt-5 flex flex-wrap gap-2 text-xs">
          <span className="rounded-full bg-[#fff1f6] px-3 py-1.5 font-semibold text-[#bd4e77]">{orders.length} commandes</span>
          <span className="rounded-full border border-[#f1dfe7] px-3 py-1.5 text-[#665b61]">{orders.filter((order) => order.status === "PENDING").length} à traiter</span>
        </div>
        {actionError ? <p role="alert" className="mt-4 rounded-xl bg-[#fff1f3] px-3 py-2 text-sm text-[#a33c57]">{actionError}</p> : null}
        {actionMessage ? <p role="status" className="mt-4 rounded-xl bg-[#f1faf3] px-3 py-2 text-sm text-[#286842]">{actionMessage}</p> : null}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.5fr_0.9fr]">
        <div className="overflow-hidden rounded-[28px] border border-[#f2dfe7] bg-white shadow-[0_12px_28px_rgba(18,18,18,0.03)]">
          <div className="flex items-center justify-between border-b border-[#f3e1ea] px-5 py-4">
            <h2 className="text-xl font-semibold text-[#191919]">Commandes</h2>
            <span className="rounded-full bg-[#fff0f5] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#c06589]">{visibleOrders.length}</span>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm text-[#2d2a2c]">
              <thead className="bg-[#fffafc] text-[#5b5557]">
                <tr>
                  <th className="px-4 py-3 font-semibold">ID</th>
                  <th className="px-4 py-3 font-semibold">Client</th>
                  <th className="px-4 py-3 font-semibold">Téléphone</th>
                  <th className="px-4 py-3 font-semibold">Ville</th>
                  <th className="px-4 py-3 font-semibold">Date</th>
                  <th className="px-4 py-3 font-semibold">Total</th>
                  <th className="px-4 py-3 font-semibold">Statut</th>
                  <th className="px-4 py-3 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-8 text-center text-[#676164]">Chargement des commandes...</td>
                  </tr>
                ) : visibleOrders.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-8 text-center text-[#676164]">Aucune commande correspondante.</td>
                  </tr>
                ) : (
                  visibleOrders.map((order) => (
                    <tr key={order.id} className="border-t border-[#f5e4ed] align-top">
                      <td className="px-4 py-3 font-medium text-[#1f1d1e]">{formatOrderReference(order.id)}</td>
                      <td className="px-4 py-3">{order.customerName}</td>
                      <td className="px-4 py-3">{order.phone}</td>
                      <td className="px-4 py-3">{order.city ?? "-"}</td>
                      <td className="px-4 py-3">{new Date(order.createdAt).toLocaleDateString("fr-FR")}</td>
                      <td className="px-4 py-3 font-semibold">{Number(order.total).toLocaleString("fr-FR")} DH</td>
                      <td className="px-4 py-3">
                        <select value={order.status} onChange={(event) => void updateStatus(order.id, event.target.value as Order["status"])} disabled={updatingId === order.id} className="rounded-full border border-[#ecdfe6] bg-[#fffafc] px-2 py-1 text-xs font-medium outline-none focus:border-[#d95d8d]">
                          {statusOptions.filter((option) => option !== "ALL").map((option) => (
                            <option key={option} value={option}>{statusLabels[option]}</option>
                          ))}
                        </select>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                        <button type="button" onClick={() => void openDetails(order.id)} className="inline-flex items-center gap-2 rounded-full border border-[#efdfe6] bg-[#fffafc] px-3 py-2 text-xs font-medium text-[#2d2a2c]">
                          <Eye className="h-3.5 w-3.5" />
                          Voir
                        </button>
                        <button type="button" onClick={() => void deleteOrder(order)} disabled={deletingId === order.id} aria-label={`Supprimer la commande ${formatOrderReference(order.id)}`} title="Supprimer cette commande" className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#f0d8de] text-[#a33c57] transition hover:bg-[#fff1f3] disabled:opacity-50">
                          <Trash2 className="h-4 w-4" />
                        </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <aside className="rounded-[28px] border border-[#f2dfe7] bg-white p-5 shadow-[0_12px_28px_rgba(18,18,18,0.03)]">
          <div className="mb-4 flex items-center gap-2">
            <PackageCheck className="h-5 w-5 text-[#d95d8d]" />
            <h2 className="text-xl font-semibold text-[#191919]">Détail commande</h2>
          </div>

          {!selectedOrder ? (
            <p className="text-sm text-[#5f5a5c]">Sélectionnez une commande pour voir ses détails.</p>
          ) : (
            <div className="space-y-4 text-sm text-[#2d2a2c]">
              <div className="rounded-2xl bg-[#fffafc] p-3">
                <p className="text-xs uppercase tracking-[0.2em] text-[#a36d85]">Commande</p>
                <p className="mt-2 text-lg font-semibold">{formatOrderReference(selectedOrder.id)}</p>
                <div className="mt-2 flex items-center justify-between text-[#5d5557]">
                  <span>Status</span>
                  <span className="rounded-full bg-[#f7edf2] px-2 py-1 text-[10px] font-semibold tracking-[0.08em] text-[#c06589]">{statusLabels[selectedOrder.status]}</span>
                </div>
              </div>

              <div className="space-y-2 rounded-2xl border border-[#f3e1ea] p-3">
                <p className="font-semibold text-[#191919]">Client</p>
                <p>{selectedOrder.customerName}</p>
                <p>{selectedOrder.phone}</p>
                <p>{selectedOrder.city ?? "-"}</p>
                <p>{selectedOrder.district ?? "-"}</p>
                <p>{selectedOrder.deliveryAddress}</p>
              </div>

              <div className="space-y-2 rounded-2xl border border-[#f3e1ea] p-3">
                <p className="font-semibold text-[#191919]">Produits</p>
                {selectedOrder.items.map((item) => (
                  <div key={item.id} className="rounded-xl border border-[#f3e1ea] bg-[#fffafc] p-2">
                    <p className="font-medium text-[#1d1a1b]">{item.productName}</p>
                    <p className="text-xs text-[#655d60]">Taille: {item.size ?? "-"} • Couleur: {item.color ?? "-"} • Qty: {item.quantity}</p>
                    <p className="mt-1 font-medium">{Number(item.price).toLocaleString("fr-FR")} DH</p>
                  </div>
                ))}
              </div>

              <div className="rounded-2xl border border-[#f3e1ea] p-3">
                <p className="font-semibold text-[#191919]">Notes</p>
                <p className="mt-2 text-[#5b5557]">{selectedOrder.notes || "Aucune note."}</p>
              </div>

              <div className="rounded-2xl border border-[#f3e1ea] bg-[#fffafc] p-3">
                <div className="flex items-center justify-between text-[#5b5557]">
                  <span>Total</span>
                  <span className="text-lg font-semibold text-[#1d1a1b]">{Number(selectedOrder.total).toLocaleString("fr-FR")} DH</span>
                </div>
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
