"use client";

import { Pencil, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";

type Category = {
  id: string;
  name: string;
  slug: string;
  productCount: number;
  createdAt?: string;
};

export function CategoryManager() {
  const [items, setItems] = useState<Category[]>([]);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function loadCategories() {
    const response = await fetch("/api/admin/categories");
    const data = (await response.json()) as Category[];
    setItems(data);
  }

  useEffect(() => {
    void loadCategories();
  }, []);

  function resetForm() {
    setEditingId(null);
    setName("");
    setSlug("");
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!name.trim()) {
      setError("Le nom de la catégorie est obligatoire.");
      return;
    }

    setLoading(true);

    const response = await fetch("/api/admin/categories", {
      method: editingId ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: editingId, name, slug }),
    });

    const payload = await response.json();

    if (!response.ok) {
      setError(payload.error ?? "Une erreur est survenue.");
      setLoading(false);
      return;
    }

    setSuccess(editingId ? "Catégorie modifiée avec succès." : "Catégorie ajoutée avec succès.");
    resetForm();
    await loadCategories();
    setLoading(false);
  }

  async function handleDelete(id: string) {
    setError("");
    setSuccess("");

    const response = await fetch(`/api/admin/categories?id=${id}`, {
      method: "DELETE",
    });

    const payload = await response.json();

    if (!response.ok) {
      setError(payload.error ?? "Impossible de supprimer la catégorie.");
      return;
    }

    setSuccess("Catégorie supprimée.");
    await loadCategories();
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
      <form onSubmit={handleSubmit} className="space-y-5 rounded-[28px] border border-[#f1dfe7] bg-white p-5 shadow-[0_12px_28px_rgba(18,18,18,0.03)]">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-xl font-semibold text-[#191919]">{editingId ? "Modifier la catégorie" : "Nouvelle catégorie"}</h2>
          {editingId ? (
            <button type="button" onClick={resetForm} className="rounded-full border border-[#efd7e5] px-3 py-1.5 text-sm font-medium text-[#4d4547]">
              Annuler
            </button>
          ) : null}
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-[#3a3739]">Nom</label>
          <input value={name} onChange={(event) => setName(event.target.value)} className="w-full rounded-2xl border border-[#ecdfe6] bg-[#fffafc] px-4 py-3 outline-none transition focus:border-[#d95d8d]" placeholder="Robes, Ensembles..." />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-[#3a3739]">Slug</label>
          <input value={slug} onChange={(event) => setSlug(event.target.value)} className="w-full rounded-2xl border border-[#ecdfe6] bg-[#fffafc] px-4 py-3 outline-none transition focus:border-[#d95d8d]" placeholder="robes" />
        </div>

        {error ? <p className="rounded-2xl border border-[#f0d0da] bg-[#fff7fa] px-3 py-2 text-sm text-[#b14d6c]">{error}</p> : null}
        {success ? <p className="rounded-2xl border border-[#d8eedb] bg-[#f4fbf5] px-3 py-2 text-sm text-[#246b46]">{success}</p> : null}

        <button type="submit" disabled={loading} className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#d95d8d] px-5 py-3 text-base font-semibold text-white transition hover:bg-[#ca4f7a] disabled:cursor-not-allowed disabled:opacity-70">
          <Plus className="h-4 w-4" />
          {loading ? "Enregistrement..." : editingId ? "Enregistrer" : "Ajouter la catégorie"}
        </button>
      </form>

      <div className="overflow-hidden rounded-[28px] border border-[#f2dfe7] bg-white shadow-[0_12px_28px_rgba(18,18,18,0.03)]">
        <div className="border-b border-[#f3e1ea] px-5 py-4">
          <h2 className="text-xl font-semibold text-[#191919]">Catégories existantes</h2>
        </div>

        <div className="divide-y divide-[#f7e6ef]">
          {items.length === 0 ? (
            <div className="p-5 text-sm text-[#655d60]">Aucune catégorie pour le moment.</div>
          ) : (
            items.map((category) => (
              <div key={category.id} className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-semibold text-[#1a1a1a]">{category.name}</p>
                  <div className="mt-1 flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.12em] text-[#9b8f96]">
                    <span>{category.slug}</span>
                    <span className="rounded-full bg-[#fff0f5] px-2 py-0.5 text-[10px] font-semibold text-[#c06589]">{category.productCount} produit{category.productCount > 1 ? "s" : ""}</span>
                  </div>
                  {category.createdAt ? <p className="mt-2 text-xs text-[#6c6367]">Créée le {new Date(category.createdAt).toLocaleDateString("fr-FR")}</p> : null}
                </div>

                <div className="flex items-center gap-2">
                  <button type="button" onClick={() => { setEditingId(category.id); setName(category.name); setSlug(category.slug); }} className="inline-flex items-center gap-1 rounded-full border border-[#efdfe6] bg-[#fffafc] px-3 py-2 text-sm font-medium text-[#2d2a2c]">
                    <Pencil className="h-4 w-4" />
                    Modifier
                  </button>
                  <button type="button" onClick={() => void handleDelete(category.id)} className="inline-flex items-center gap-1 rounded-full border border-[#f1d9e5] bg-[#fff7fa] px-3 py-2 text-sm font-medium text-[#b14d6c]">
                    <Trash2 className="h-4 w-4" />
                    Supprimer
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
