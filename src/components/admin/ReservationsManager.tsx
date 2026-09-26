"use client";

import { Eye, Ticket } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

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

export function ReservationsManager() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<(typeof statusOptions)[number]>("ALL");
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
  const [loading, setLoading] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  async function loadReservations() {
    setLoading(true);
    const params = new URLSearchParams();
    if (search.trim()) params.set("search", search.trim());
    if (statusFilter !== "ALL") params.set("status", statusFilter);

    const response = await fetch(`/api/admin/reservations${params.toString() ? `?${params.toString()}` : ""}`);
    const data = (await response.json()) as Reservation[];
    setReservations(data);
    setLoading(false);
  }

  useEffect(() => {
    void loadReservations();
  }, [search, statusFilter]);

  async function openDetails(id: string) {
    const response = await fetch(`/api/admin/reservations?id=${id}`);
    const data = (await response.json()) as Reservation;
    setSelectedReservation(data);
  }

  async function updateStatus(id: string, nextStatus: Reservation["status"]) {
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
      <div className="rounded-[28px] border border-[#f2dfe7] bg-white p-5 shadow-[0_12px_28px_rgba(18,18,18,0.03)]">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#c06589]">Réservations</p>
            <h1 className="mt-2 text-3xl font-semibold text-[#191919]">Gestion des réservations</h1>
          </div>

          <div className="flex flex-wrap gap-3">
            <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Rechercher client, téléphone..." className="rounded-full border border-[#ecdfe6] bg-[#fffafc] px-3 py-2 text-sm outline-none transition focus:border-[#d95d8d]" />
            <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value as (typeof statusOptions)[number])} className="rounded-full border border-[#ecdfe6] bg-[#fffafc] px-3 py-2 text-sm outline-none transition focus:border-[#d95d8d]">
              {statusOptions.map((option) => (
                <option key={option} value={option}>{option === "ALL" ? "Tous" : option}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.5fr_0.9fr]">
        <div className="overflow-hidden rounded-[28px] border border-[#f2dfe7] bg-white shadow-[0_12px_28px_rgba(18,18,18,0.03)]">
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
                            <option key={option} value={option}>{option}</option>
                          ))}
                        </select>
                      </td>
                      <td className="px-4 py-3">
                        <button type="button" onClick={() => void openDetails(reservation.id)} className="inline-flex items-center gap-2 rounded-full border border-[#efdfe6] bg-[#fffafc] px-3 py-2 text-xs font-medium text-[#2d2a2c]">
                          <Eye className="h-3.5 w-3.5" />
                          Voir
                        </button>
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
                  <span>Status</span>
                  <span className="rounded-full bg-[#f7edf2] px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#c06589]">{selectedReservation.status}</span>
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
                    <p className="text-xs text-[#655d60]">Taille: {item.size ?? "-"} • Couleur: {item.color ?? "-"} • Qty: {item.quantity}</p>
                    <p className="mt-1 font-medium">{Number(item.price).toLocaleString("fr-FR")} DH</p>
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
