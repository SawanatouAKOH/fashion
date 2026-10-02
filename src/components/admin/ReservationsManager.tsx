"use client";

import { Eye, Ticket, Trash2 } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";

import { AdminPageHeader } from "@/components/admin/AdminPageHeader";

type ReservationItem = {
  id: string;
  productName: string;
  size?: string | null;
  color?: string | null;
  quantity: number;
  price: number;
};

type Reservation = {
  id: string;
  customerName: string;
  phone: string;
  city?: string | null;
  district?: string | null;
  deliveryAddress: string;
  notes?: string | null;
  status: "PENDING" | "CONFIRMED" | "EXPIRED" | "CANCELLED";
  createdAt: string;
  items: ReservationItem[];
};

const statusOptions = ["ALL", "PENDING", "CONFIRMED", "EXPIRED", "CANCELLED"] as const;
const statusLabels: Record<Exclude<(typeof statusOptions)[number], "ALL">, string> = {
  PENDING: "En attente",
  CONFIRMED: "Confirmée",
  EXPIRED: "Expirée",
  CANCELLED: "Annulée",
};

export function ReservationsManager() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<(typeof statusOptions)[number]>("ALL");
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [actionError, setActionError] = useState("");
  const [actionMessage, setActionMessage] = useState("");

  const loadReservations = useCallback(async () => {
    const params = new URLSearchParams();
    if (search.trim()) params.set("search", search.trim());
    if (statusFilter !== "ALL") params.set("status", statusFilter);

    try {
      const response = await fetch(`/api/admin/reservations${params.toString() ? `?${params.toString()}` : ""}`);
      const data = (await response.json()) as Reservation[];
      setReservations(data);
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter]);

  useEffect(() => {
    void loadReservations();
  }, [loadReservations]);

  async function openDetails(id: string) {
    const response = await fetch(`/api/admin/reservations?id=${id}`);
    const data = (await response.json()) as Reservation;
    setSelectedReservation(data);
  }

  async function updateStatus(id: string, nextStatus: Reservation["status"]) {
    setActionError("");
    setActionMessage("");
    setUpdatingId(id);
    const response = await fetch("/api/admin/reservations", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status: nextStatus }),
    });

    if (response.ok) {
      const updated = (await response.json()) as Reservation;
      setReservations((current) => current.map((reservation) => (reservation.id === updated.id ? updated : reservation)));
      if (selectedReservation?.id === updated.id) {
        setSelectedReservation(updated);
      }
    }

    setUpdatingId(null);
  }

  async function deleteReservation(reservation: Reservation) {
    if (!window.confirm(`Supprimer définitivement la réservation #${reservation.id.slice(0, 8)} de ${reservation.customerName} ?`)) {
      return;
    }

    setActionError("");
    setActionMessage("");
    setDeletingId(reservation.id);

    try {
      const response = await fetch(`/api/admin/reservations?id=${encodeURIComponent(reservation.id)}`, { method: "DELETE" });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error ?? "Impossible de supprimer cette réservation.");

      setReservations((current) => current.filter((item) => item.id !== reservation.id));
      if (selectedReservation?.id === reservation.id) setSelectedReservation(null);
      setActionMessage("Réservation supprimée.");
    } catch (error) {
      setActionError(error instanceof Error ? error.message : "Impossible de supprimer cette réservation.");
    } finally {
      setDeletingId(null);
    }
  }

  const visibleReservations = useMemo(() => {
    const normalized = search.trim().toLowerCase();
    if (!normalized && statusFilter === "ALL") return reservations;

    return reservations.filter((reservation) => {
      const matchesSearch =
        normalized.length === 0 ||
        reservation.customerName.toLowerCase().includes(normalized) ||
        reservation.phone.includes(normalized) ||
        reservation.id.toLowerCase().includes(normalized);

      const matchesStatus = statusFilter === "ALL" || reservation.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [reservations, search, statusFilter]);

  return (
    <div className="space-y-6">
      <div>
        <AdminPageHeader
          eyebrow="Ventes"
          title="Réservations"
          description="Suivez les demandes pour les articles à venir et confirmez leur disponibilité."
          actions={
            <>
            <input value={search} onChange={(event) => { setLoading(true); setSearch(event.target.value); }} placeholder="Rechercher client, téléphone..." className="w-full rounded-full border border-[#ecdfe6] bg-[#fffafc] px-3 py-2 text-sm outline-none transition focus:border-[#d95d8d] sm:w-64" />
            <select value={statusFilter} onChange={(event) => { setLoading(true); setStatusFilter(event.target.value as (typeof statusOptions)[number]); }} className="w-full rounded-full border border-[#ecdfe6] bg-[#fffafc] px-3 py-2 text-sm outline-none transition focus:border-[#d95d8d] sm:w-auto">
              {statusOptions.map((option) => (
                <option key={option} value={option}>{option === "ALL" ? "Tous les statuts" : statusLabels[option]}</option>
              ))}
            </select>
            </>
          }
        />
        <div className="mt-5 flex flex-wrap gap-2 text-xs">
          <span className="rounded-full bg-[#fff1f6] px-3 py-1.5 font-semibold text-[#bd4e77]">{reservations.length} réservations</span>
          <span className="rounded-full border border-[#f1dfe7] px-3 py-1.5 text-[#665b61]">{reservations.filter((reservation) => reservation.status === "PENDING").length} à traiter</span>
        </div>
        {actionError ? <p role="alert" className="mt-4 rounded-xl bg-[#fff1f3] px-3 py-2 text-sm text-[#a33c57]">{actionError}</p> : null}
        {actionMessage ? <p role="status" className="mt-4 rounded-xl bg-[#f1faf3] px-3 py-2 text-sm text-[#286842]">{actionMessage}</p> : null}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.5fr_0.9fr]">
        <div className="overflow-hidden rounded-xl border border-[#e9e1e5] bg-white">
          <div className="flex items-center justify-between border-b border-[#f3e1ea] px-5 py-4">
            <h2 className="text-xl font-semibold text-[#191919]">Réservations</h2>
            <span className="rounded-full bg-[#fff0f5] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#c06589]">{visibleReservations.length}</span>
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
                  <th className="px-4 py-3 font-semibold">Statut</th>
                  <th className="px-4 py-3 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center text-[#676164]">Chargement des réservations...</td>
                  </tr>
                ) : visibleReservations.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center text-[#676164]">Aucune réservation correspondante.</td>
                  </tr>
                ) : (
                  visibleReservations.map((reservation) => (
                    <tr key={reservation.id} className="border-t border-[#f5e4ed] align-top">
                      <td className="px-4 py-3 font-medium text-[#1f1d1e]">#{reservation.id.slice(0, 8)}</td>
                      <td className="px-4 py-3">{reservation.customerName}</td>
                      <td className="px-4 py-3">{reservation.phone}</td>
                      <td className="px-4 py-3">{reservation.city ?? "-"}</td>
                      <td className="px-4 py-3">{new Date(reservation.createdAt).toLocaleDateString("fr-FR")}</td>
                      <td className="px-4 py-3">
                        <select value={reservation.status} onChange={(event) => void updateStatus(reservation.id, event.target.value as Reservation["status"])} disabled={updatingId === reservation.id} className="rounded-full border border-[#ecdfe6] bg-[#fffafc] px-2 py-1 text-xs font-medium outline-none focus:border-[#d95d8d]">
                          {statusOptions.filter((option) => option !== "ALL").map((option) => (
                            <option key={option} value={option}>{statusLabels[option]}</option>
                          ))}
                        </select>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                        <button type="button" onClick={() => void openDetails(reservation.id)} className="inline-flex items-center gap-2 rounded-full border border-[#efdfe6] bg-[#fffafc] px-3 py-2 text-xs font-medium text-[#2d2a2c]">
                          <Eye className="h-3.5 w-3.5" />
                          Voir
                        </button>
                        <button type="button" onClick={() => void deleteReservation(reservation)} disabled={deletingId === reservation.id} aria-label={`Supprimer la réservation ${reservation.id.slice(0, 8)}`} title="Supprimer cette réservation" className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#f0d8de] text-[#a33c57] transition hover:bg-[#fff1f3] disabled:opacity-50">
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

        <aside className="rounded-xl border border-[#e9e1e5] bg-white p-5">
          <div className="mb-4 flex items-center gap-2">
            <Ticket className="h-5 w-5 text-[#d95d8d]" />
            <h2 className="text-xl font-semibold text-[#191919]">Détail réservation</h2>
          </div>

          {!selectedReservation ? (
            <p className="text-sm text-[#5f5a5c]">Sélectionnez une réservation pour voir ses détails.</p>
          ) : (
            <div className="space-y-4 text-sm text-[#2d2a2c]">
              <div className="rounded-2xl bg-[#fffafc] p-3">
                <p className="text-xs uppercase tracking-[0.2em] text-[#a36d85]">Réservation</p>
                <p className="mt-2 text-lg font-semibold">#{selectedReservation.id.slice(0, 8)}</p>
                <div className="mt-2 flex items-center justify-between text-[#5d5557]">
                  <span>Statut</span>
                  <span className="rounded-full bg-[#f7edf2] px-2 py-1 text-[10px] font-semibold tracking-[0.08em] text-[#c06589]">{statusLabels[selectedReservation.status]}</span>
                </div>
              </div>

              <div className="space-y-2 rounded-2xl border border-[#f3e1ea] p-3">
                <p className="font-semibold text-[#191919]">Client</p>
                <p>{selectedReservation.customerName}</p>
                <p>{selectedReservation.phone}</p>
                <p>{selectedReservation.city ?? "-"}</p>
                <p>{selectedReservation.district ?? "-"}</p>
                <p>{selectedReservation.deliveryAddress}</p>
              </div>

              <div className="space-y-2 rounded-2xl border border-[#f3e1ea] p-3">
                <p className="font-semibold text-[#191919]">Produit(s)</p>
                {selectedReservation.items.map((item) => (
                  <div key={item.id} className="rounded-xl border border-[#f3e1ea] bg-[#fffafc] p-2">
                    <p className="font-medium text-[#1d1a1b]">{item.productName}</p>
                    <p className="text-xs text-[#655d60]">Taille : {item.size ?? "-"} · Couleur : {item.color ?? "-"} · Qté : {item.quantity}</p>
                    <p className="mt-1 font-medium">{(Number(item.price) * item.quantity).toLocaleString("fr-FR")} DH <span className="font-normal text-[#777]">({Number(item.price).toLocaleString("fr-FR")} DH / pièce)</span></p>
                  </div>
                ))}
              </div>

              <div className="rounded-2xl border border-[#f3e1ea] p-3">
                <p className="font-semibold text-[#191919]">Notes</p>
                <p className="mt-2 text-[#5b5557]">{selectedReservation.notes || "Aucune note."}</p>
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
