"use client";

import { Pencil, Plus, ShieldCheck, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

type CategoryOption = {
  id: string;
  name: string;
  slug: string;
};

type ProductStatus = "AVAILABLE" | "COMING_SOON";

type ProductItem = {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  stock: number;
  categoryId: string;
  category?: { id: string; name: string };
  images: string[];
  sizes: string[];
  colors: Array<{ name: string; hex: string }>;
  featured: boolean;
  isNew: boolean;
  status: ProductStatus;
  estimatedArrival?: string | null;
  createdAt?: string | Date;
};

type ProductDraft = {
  id?: string;
  name: string;
  slug: string;
  description: string;
  price: string;
  categoryId: string;
  stock: string;
  status: ProductStatus;
  estimatedArrival: string;
  sizes: string[];
  colors: Array<{ name: string; hex: string }>;
  images: string[];
  featured: boolean;
  isNew: boolean;
};

const EMPTY_DRAFT = (): ProductDraft => ({
  name: "",
  slug: "",
  description: "",
  price: "149",
  categoryId: "",
  stock: "10",
  status: "AVAILABLE",
  estimatedArrival: "",
  sizes: ["S", "M", "L"],
  colors: [{ name: "Noir", hex: "#111111" }],
  images: ["https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=80"],
  featured: false,
  isNew: true,
});

function normalizeSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function ProductManager() {
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [draft, setDraft] = useState<ProductDraft>(EMPTY_DRAFT());
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [sortBy, setSortBy] = useState("newest");

  const selectedCategoryName = useMemo(
    () => categories.find((category) => category.id === draft.categoryId)?.name ?? "",
    [categories, draft.categoryId],
  );

  const visibleProducts = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return [...products]
      .filter((product) => {
        const matchesSearch =
          normalizedSearch.length === 0 ||
          product.name.toLowerCase().includes(normalizedSearch) ||
          product.description.toLowerCase().includes(normalizedSearch);

        const matchesStatus = statusFilter === "ALL" || product.status === statusFilter;
        const matchesCategory = categoryFilter === "ALL" || product.categoryId === categoryFilter || product.category?.id === categoryFilter;

        return matchesSearch && matchesStatus && matchesCategory;
      })
      .sort((left, right) => {
        if (sortBy === "price-asc") {
          return left.price - right.price;
        }

        if (sortBy === "price-desc") {
          return right.price - left.price;
        }

        if (sortBy === "stock") {
          return right.stock - left.stock;
        }

        return new Date(right.createdAt ?? 0).getTime() - new Date(left.createdAt ?? 0).getTime();
      });
  }, [categoryFilter, products, search, sortBy, statusFilter]);

  async function loadCategories() {
    const response = await fetch("/api/admin/categories");
    if (!response.ok) {
      return;
    }

    const data = (await response.json()) as CategoryOption[];
    setCategories(data);

    if (!draft.categoryId && data[0]) {
      setDraft((current) => ({ ...current, categoryId: data[0].id }));
    }
  }

  async function loadProducts() {
    setIsLoading(true);
    const response = await fetch("/api/admin/products");
    const data = (await response.json()) as ProductItem[];
    setProducts(data);
    setIsLoading(false);
  }

  useEffect(() => {
    void Promise.all([loadCategories(), loadProducts()]);
  }, []);

  function resetDraft() {
    setDraft(EMPTY_DRAFT());
    if (categories[0]) {
      setDraft((current) => ({ ...current, categoryId: categories[0].id }));
    }
  }

  function fillForm(product: ProductItem) {
    setDraft({
      id: product.id,
      name: product.name,
      slug: product.slug,
      description: product.description,
      price: String(product.price),
      categoryId: product.categoryId || product.category?.id || "",
      stock: String(product.stock),
      status: product.status,
      estimatedArrival: product.estimatedArrival ? product.estimatedArrival.slice(0, 10) : "",
      sizes: product.sizes.length > 0 ? [...product.sizes] : ["M"],
      colors: product.colors.length > 0 ? [...product.colors] : [{ name: "Noir", hex: "#111111" }],
      images: product.images.length > 0 ? [...product.images] : [""],
      featured: product.featured,
      isNew: product.isNew,
    });
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSuccess("");

    const trimmedName = draft.name.trim();
    const trimmedDescription = draft.description.trim();
    const filteredImages = draft.images.filter(Boolean);
    const filteredSizes = draft.sizes.filter(Boolean);
    const filteredColors = draft.colors.filter((color) => color.name.trim() && color.hex.trim());

    if (!trimmedName || !trimmedDescription) {
      setError("Le nom et la description sont obligatoires.");
      return;
    }

    if (!draft.categoryId) {
      setError("Sélectionnez une catégorie.");
      return;
    }

    if (!filteredImages.length) {
      setError("Ajoutez au moins une image pour le produit.");
      return;
    }

    if (!filteredSizes.length || !filteredColors.length) {
      setError("Indiquez au moins une taille et une couleur.");
      return;
    }

    const payload = {
      id: draft.id,
      name: trimmedName,
      slug: draft.slug || normalizeSlug(trimmedName),
      description: trimmedDescription,
      price: Number(draft.price || 0),
      stock: Number(draft.stock || 0),
      categoryId: draft.categoryId,
      status: draft.status,
      estimatedArrival: draft.estimatedArrival || null,
      sizes: filteredSizes,
      colors: filteredColors,
      images: filteredImages,
      featured: draft.featured,
      isNew: draft.isNew,
    };

    setIsSaving(true);

    const response = await fetch("/api/admin/products", {
      method: draft.id ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const result = await response.json();

    if (!response.ok) {
      setError(result.error ?? "Une erreur est survenue.");
      setIsSaving(false);
      return;
    }

    setSuccess(draft.id ? "Produit modifié avec succès." : "Produit ajouté avec succès.");
    resetDraft();
    await loadProducts();
    setIsSaving(false);
  }

  async function uploadImageFile(file: File) {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("/api/admin/upload", {
      method: "POST",
      body: formData,
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error ?? "Impossible de téléverser l’image.");
    }

    return String(result.url || "");
  }

  async function handleDelete(id: string) {
    setError("");
    const response = await fetch(`/api/admin/products?id=${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      const result = await response.json();
      setError(result.error ?? "Impossible de supprimer le produit.");
      return;
    }

    setSuccess("Produit supprimé avec succès.");
    if (draft.id === id) {
      resetDraft();
    }
    await loadProducts();
  }

  return (
    <div className="mx-auto max-w-7xl space-y-8 px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-3 rounded-[28px] border border-[#f4dfe8] bg-gradient-to-r from-[#fff8fb] to-white p-6 shadow-[0_10px_30px_rgba(16,16,16,0.04)] sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#c06589]">Admin</p>
          <h1 className="mt-2 text-3xl font-semibold text-[#191919]">Gestion des produits</h1>
        </div>

        <div className="inline-flex items-center gap-2 rounded-full border border-[#ecdfe7] bg-white px-3 py-1.5 text-sm font-medium text-[#4f474a]">
          <ShieldCheck className="h-4 w-4 text-[#d95d8d]" />
          Prisma connecté
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="rounded-[28px] border border-[#f1dfe7] bg-white p-4 shadow-[0_12px_28px_rgba(18,18,18,0.03)]">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-xl font-semibold text-[#191919]">Catalogue</h2>
            <div className="flex flex-wrap gap-2">
              <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Rechercher..." className="rounded-full border border-[#ecdfe6] bg-[#fffafc] px-3 py-2 text-sm outline-none transition focus:border-[#d95d8d]" />
              <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} className="rounded-full border border-[#ecdfe6] bg-[#fffafc] px-3 py-2 text-sm outline-none transition focus:border-[#d95d8d]">
                <option value="ALL">Tous</option>
                <option value="AVAILABLE">Disponible</option>
                <option value="COMING_SOON">Bientôt disponible</option>
              </select>
              <select value={categoryFilter} onChange={(event) => setCategoryFilter(event.target.value)} className="rounded-full border border-[#ecdfe6] bg-[#fffafc] px-3 py-2 text-sm outline-none transition focus:border-[#d95d8d]">
                <option value="ALL">Toutes catégories</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>{category.name}</option>
                ))}
              </select>
              <select value={sortBy} onChange={(event) => setSortBy(event.target.value)} className="rounded-full border border-[#ecdfe6] bg-[#fffafc] px-3 py-2 text-sm outline-none transition focus:border-[#d95d8d]">
                <option value="newest">Plus récents</option>
                <option value="price-asc">Prix croissant</option>
                <option value="price-desc">Prix décroissant</option>
                <option value="stock">Stock</option>
              </select>
            </div>
          </div>

          <div className="mb-4 rounded-2xl border border-[#f4dfe8] bg-[#fff9fb] p-3 text-sm text-[#5f5a5c]">
            {visibleProducts.length} produit{visibleProducts.length > 1 ? "s" : ""} affiché{visibleProducts.length > 1 ? "s" : ""}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 rounded-[28px] border border-[#f1dfe7] bg-white p-5 shadow-[0_12px_28px_rgba(18,18,18,0.03)]">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-xl font-semibold text-[#191919]">{draft.id ? "Modifier le produit" : "Nouveau produit"}</h2>
            {draft.id ? (
              <button type="button" onClick={resetDraft} className="rounded-full border border-[#efd7e5] px-3 py-1.5 text-sm font-medium text-[#4d4547]">
                Annuler
              </button>
            ) : null}
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-[#3a3739]">Nom</label>
            <input value={draft.name} onChange={(event) => setDraft((current) => ({ ...current, name: event.target.value, slug: current.slug || normalizeSlug(event.target.value) }))} className="w-full rounded-2xl border border-[#ecdfe6] bg-[#fffafc] px-4 py-3 outline-none transition focus:border-[#d95d8d]" placeholder="Ex : Robe longue élégante" />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-[#3a3739]">Slug</label>
            <input value={draft.slug} onChange={(event) => setDraft((current) => ({ ...current, slug: event.target.value }))} className="w-full rounded-2xl border border-[#ecdfe6] bg-[#fffafc] px-4 py-3 outline-none transition focus:border-[#d95d8d]" placeholder="robe-longue-elegante" />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-[#3a3739]">Description</label>
            <textarea value={draft.description} onChange={(event) => setDraft((current) => ({ ...current, description: event.target.value }))} rows={5} className="w-full rounded-2xl border border-[#ecdfe6] bg-[#fffafc] px-4 py-3 outline-none transition focus:border-[#d95d8d]" placeholder="Décrivez le produit..." />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-[#3a3739]">Prix (DH)</label>
              <input type="number" value={draft.price} onChange={(event) => setDraft((current) => ({ ...current, price: event.target.value }))} className="w-full rounded-2xl border border-[#ecdfe6] bg-[#fffafc] px-4 py-3 outline-none transition focus:border-[#d95d8d]" />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-[#3a3739]">Stock</label>
              <input type="number" value={draft.stock} onChange={(event) => setDraft((current) => ({ ...current, stock: event.target.value }))} className="w-full rounded-2xl border border-[#ecdfe6] bg-[#fffafc] px-4 py-3 outline-none transition focus:border-[#d95d8d]" />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-[#3a3739]">Catégorie</label>
              <select value={draft.categoryId} onChange={(event) => setDraft((current) => ({ ...current, categoryId: event.target.value }))} className="w-full rounded-2xl border border-[#ecdfe6] bg-[#fffafc] px-4 py-3 outline-none transition focus:border-[#d95d8d]">
                {categories.length === 0 ? <option value="">Aucune catégorie</option> : categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-[#3a3739]">Statut</label>
              <select value={draft.status} onChange={(event) => setDraft((current) => ({ ...current, status: event.target.value as ProductStatus }))} className="w-full rounded-2xl border border-[#ecdfe6] bg-[#fffafc] px-4 py-3 outline-none transition focus:border-[#d95d8d]">
                <option value="AVAILABLE">AVAILABLE</option>
                <option value="COMING_SOON">COMING_SOON</option>
              </select>
            </div>
          </div>

          {draft.status === "COMING_SOON" ? (
            <div className="space-y-2">
              <label className="block text-sm font-medium text-[#3a3739]">Date estimée d'arrivée</label>
              <input type="date" value={draft.estimatedArrival} onChange={(event) => setDraft((current) => ({ ...current, estimatedArrival: event.target.value }))} className="w-full rounded-2xl border border-[#ecdfe6] bg-[#fffafc] px-4 py-3 outline-none transition focus:border-[#d95d8d]" />
            </div>
          ) : null}

          <div className="space-y-3">
            <label className="block text-sm font-medium text-[#3a3739]">Tailles</label>
            {draft.sizes.map((size, index) => (
              <div key={`size-${index}`} className="flex gap-2">
                <input value={size} onChange={(event) => setDraft((current) => ({ ...current, sizes: current.sizes.map((value, innerIndex) => (innerIndex === index ? event.target.value : value)) }))} className="w-full rounded-2xl border border-[#ecdfe6] bg-[#fffafc] px-4 py-3 outline-none transition focus:border-[#d95d8d]" placeholder="S, M, L..." />
                <button type="button" onClick={() => setDraft((current) => ({ ...current, sizes: current.sizes.filter((_, innerIndex) => innerIndex !== index) }))} className="rounded-full border border-[#f1d9e5] bg-[#fff7fa] px-3 py-2 text-sm font-medium text-[#b14d6c]">Supprimer</button>
              </div>
            ))}
            <button type="button" onClick={() => setDraft((current) => ({ ...current, sizes: [...current.sizes, ""] }))} className="inline-flex items-center gap-2 rounded-full border border-[#efd7e5] px-3 py-2 text-sm font-medium text-[#4d4547]">
              <Plus className="h-4 w-4" />
              Ajouter une taille
            </button>
          </div>

          <div className="space-y-3">
            <label className="block text-sm font-medium text-[#3a3739]">Couleurs</label>
            {draft.colors.map((color, index) => (
              <div key={`color-${index}`} className="grid gap-2 sm:grid-cols-[1fr_120px_120px]">
                <input value={color.name} onChange={(event) => setDraft((current) => ({ ...current, colors: current.colors.map((value, innerIndex) => innerIndex === index ? { ...value, name: event.target.value } : value) }))} className="rounded-2xl border border-[#ecdfe6] bg-[#fffafc] px-4 py-3 outline-none transition focus:border-[#d95d8d]" placeholder="Rouge" />
                <input type="color" value={color.hex || "#111111"} onChange={(event) => setDraft((current) => ({ ...current, colors: current.colors.map((value, innerIndex) => innerIndex === index ? { ...value, hex: event.target.value } : value) }))} className="h-[50px] w-full rounded-2xl border border-[#ecdfe6] bg-[#fffafc] px-1 py-2" />
                <button type="button" onClick={() => setDraft((current) => ({ ...current, colors: current.colors.filter((_, innerIndex) => innerIndex !== index) }))} className="rounded-full border border-[#f1d9e5] bg-[#fff7fa] px-3 py-2 text-sm font-medium text-[#b14d6c]">Supprimer</button>
              </div>
            ))}
            <button type="button" onClick={() => setDraft((current) => ({ ...current, colors: [...current.colors, { name: "", hex: "#111111" }] }))} className="inline-flex items-center gap-2 rounded-full border border-[#efd7e5] px-3 py-2 text-sm font-medium text-[#4d4547]">
              <Plus className="h-4 w-4" />
              Ajouter une couleur
            </button>
          </div>

          <div className="space-y-3">
            <label className="block text-sm font-medium text-[#3a3739]">Images</label>
            {draft.images.map((image, index) => (
              <div key={`image-${index}`} className="flex flex-col gap-2 sm:flex-row sm:items-center">
                <input value={image} onChange={(event) => setDraft((current) => ({ ...current, images: current.images.map((value, innerIndex) => (innerIndex === index ? event.target.value : value)) }))} className="w-full rounded-2xl border border-[#ecdfe6] bg-[#fffafc] px-4 py-3 outline-none transition focus:border-[#d95d8d]" placeholder="https://..." />
                <div className="flex gap-2">
                  <label className="inline-flex cursor-pointer items-center justify-center rounded-full border border-[#efd7e5] bg-[#fffafc] px-3 py-2 text-sm font-medium text-[#4d4547]">
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={async (event) => {
                        const file = event.target.files?.[0];
                        if (!file) {
                          return;
                        }

                        try {
                          const uploadedUrl = await uploadImageFile(file);
                          setDraft((current) => ({
                            ...current,
                            images: current.images.map((value, innerIndex) => (innerIndex === index ? uploadedUrl : value)),
                          }));
                          setSuccess("Image téléversée avec succès.");
                        } catch (uploadError) {
                          setError(uploadError instanceof Error ? uploadError.message : "Impossible de téléverser l’image.");
                        }

                        event.target.value = "";
                      }}
                    />
                    Upload
                  </label>
                  <button type="button" onClick={() => setDraft((current) => ({ ...current, images: current.images.filter((_, innerIndex) => innerIndex !== index) }))} className="rounded-full border border-[#f1d9e5] bg-[#fff7fa] px-3 py-2 text-sm font-medium text-[#b14d6c]">Supprimer</button>
                </div>
              </div>
            ))}
            <button type="button" onClick={() => setDraft((current) => ({ ...current, images: [...current.images, ""] }))} className="inline-flex items-center gap-2 rounded-full border border-[#efd7e5] px-3 py-2 text-sm font-medium text-[#4d4547]">
              <Plus className="h-4 w-4" />
              Ajouter une image
            </button>
          </div>

          <div className="flex flex-wrap gap-4 pt-2">
            <label className="inline-flex items-center gap-2 text-sm font-medium text-[#3d3a3b]">
              <input type="checkbox" checked={draft.featured} onChange={(event) => setDraft((current) => ({ ...current, featured: event.target.checked }))} className="h-4 w-4 rounded border-[#d9c6d0] text-[#d95d8d]" />
              Produit mis en avant
            </label>

            <label className="inline-flex items-center gap-2 text-sm font-medium text-[#3d3a3b]">
              <input type="checkbox" checked={draft.isNew} onChange={(event) => setDraft((current) => ({ ...current, isNew: event.target.checked }))} className="h-4 w-4 rounded border-[#d9c6d0] text-[#d95d8d]" />
              Nouveau produit
            </label>
          </div>

          {error ? <p className="rounded-2xl border border-[#f0d0da] bg-[#fff7fa] px-3 py-2 text-sm text-[#b14d6c]">{error}</p> : null}
          {success ? <p className="rounded-2xl border border-[#d8eedb] bg-[#f4fbf5] px-3 py-2 text-sm text-[#246b46]">{success}</p> : null}

          <button type="submit" disabled={isSaving} className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#d95d8d] px-5 py-3 text-base font-semibold text-white transition hover:bg-[#ca4f7a] disabled:cursor-not-allowed disabled:opacity-70">
            <Plus className="h-4 w-4" />
            {isSaving ? "Enregistrement..." : draft.id ? "Enregistrer les modifications" : "Créer le produit"}
          </button>
        </form>

        <div className="overflow-hidden rounded-[28px] border border-[#f2dfe7] bg-white shadow-[0_12px_28px_rgba(18,18,18,0.03)]">
          <div className="border-b border-[#f3e1ea] px-5 py-4">
            <h2 className="text-xl font-semibold text-[#191919]">Catalogue actuel</h2>
          </div>

          <div className="max-h-[980px] overflow-auto">
            {isLoading ? (
              <div className="p-6 text-sm text-[#675f62]">Chargement des produits...</div>
            ) : visibleProducts.length === 0 ? (
              <div className="p-6 text-sm text-[#675f62]">Aucun produit ne correspond à ce filtre.</div>
            ) : (
              <div className="divide-y divide-[#f7e6ef]">
                {visibleProducts.map((product) => (
                  <div key={product.id} className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3">
                      <img src={product.images[0] ?? "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=80"} alt={product.name} className="h-16 w-16 rounded-2xl object-cover" />
                      <div>
                        <p className="font-semibold text-[#1a1a1a]">{product.name}</p>
                        <p className="text-sm text-[#655d60]">{product.category?.name ?? selectedCategoryName} • {product.stock} en stock • {product.status}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {product.status === "COMING_SOON" ? <span className="rounded-full bg-[#fff0f5] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#b14d6c]">Bientôt</span> : null}
                      <button type="button" onClick={() => fillForm(product)} className="inline-flex items-center gap-1 rounded-full border border-[#efdfe6] bg-[#fffafc] px-3 py-2 text-sm font-medium text-[#2d2a2c]">
                        <Pencil className="h-4 w-4" />
                        Modifier
                      </button>
                      <button type="button" onClick={() => void handleDelete(product.id)} className="inline-flex items-center gap-1 rounded-full border border-[#f1d9e5] bg-[#fff7fa] px-3 py-2 text-sm font-medium text-[#b14d6c]">
                        <Trash2 className="h-4 w-4" />
                        Supprimer
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
