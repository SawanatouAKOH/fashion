import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

async function requireAdmin() {
  const session = await auth();

  if (!session?.user || session.user.role !== "ADMIN") {
    return null;
  }

  return session;
}

function normalizeSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function getAvailableProductSlug(value: string, excludedProductId?: string) {
  const baseSlug = normalizeSlug(value) || "produit";
  let slug = baseSlug;
  let suffix = 2;

  while (await prisma.product.findFirst({
    where: {
      slug,
      ...(excludedProductId ? { id: { not: excludedProductId } } : {}),
    },
    select: { id: true },
  })) {
    slug = `${baseSlug}-${suffix}`;
    suffix += 1;
  }

  return slug;
}

function isUniqueConstraintError(error: unknown): error is { code: string } {
  return typeof error === "object" && error !== null && "code" in error && error.code === "P2002";
}

function getCategoryId(nameOrId: string | undefined) {
  if (!nameOrId) {
    return null;
  }

  if (nameOrId.length >= 20 && nameOrId.includes("-")) {
    return nameOrId;
  }

  return nameOrId;
}

function normalizeEstimatedArrival(value: string | null | undefined, status: "AVAILABLE" | "COMING_SOON") {
  if (!value) {
    if (status === "COMING_SOON") {
      const fallback = new Date();
      fallback.setDate(fallback.getDate() + 30);
      return fallback;
    }
    return null;
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    throw new Error("Date d’arrivée invalide.");
  }

  return date;
}

export async function GET(request: Request) {
  const session = await requireAdmin();

  if (!session) {
    return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search") ?? "";
  const status = searchParams.get("status") ?? "all";
  const categoryId = searchParams.get("categoryId") ?? "";

  const products = await prisma.product.findMany({
    where: {
      ...(search ? { name: { contains: search } } : {}),
      ...(status !== "all" ? { status: status as "AVAILABLE" | "COMING_SOON" } : {}),
      ...(categoryId ? { categoryId } : {}),
    },
    include: { category: true },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(products.map((product) => ({
    ...product,
    images: Array.isArray(product.images) ? product.images : [],
    sizes: Array.isArray(product.sizes) ? product.sizes : [],
    colors: Array.isArray(product.colors) ? product.colors : [],
    category: product.category,
  })));
}

export async function POST(request: Request) {
  const session = await requireAdmin();

  if (!session) {
    return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
  }

  try {
    const payload = await request.json();
    const name = String(payload.name ?? "").trim();
    const description = String(payload.description ?? "").trim();
    const price = Number(payload.price ?? 0);
    const stock = Number(payload.stock ?? 0);
    const categoryId = getCategoryId(payload.categoryId);
    const status = payload.status === "COMING_SOON" ? "COMING_SOON" : "AVAILABLE";
    const images = Array.isArray(payload.images) ? payload.images.filter(Boolean) : [];
    const sizes = Array.isArray(payload.sizes) ? payload.sizes.filter(Boolean) : [];
    const colors = Array.isArray(payload.colors) ? payload.colors.filter(Boolean) : [];
    const estimatedArrival = normalizeEstimatedArrival(payload.estimatedArrival, status);

    if (!name || !description || !categoryId || price <= 0 || images.length === 0) {
      return NextResponse.json({ error: "Nom, description, catégorie, prix et au moins une image sont obligatoires." }, { status: 400 });
    }

    if (status === "COMING_SOON" && !estimatedArrival) {
      return NextResponse.json({ error: "Une date d’arrivée est obligatoire pour un produit à venir." }, { status: 400 });
    }

    const slug = await getAvailableProductSlug(String(payload.slug || name));

    const product = await prisma.product.create({
      data: {
        name,
        slug,
        description,
        price,
        stock,
        categoryId,
        status,
        images,
        sizes,
        colors,
        featured: Boolean(payload.featured),
        isNew: Boolean(payload.isNew),
        estimatedArrival,
      },
      include: { category: true },
    });

    revalidatePath("/admin");
    revalidatePath("/products");
    revalidatePath("/");

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error("Admin create product error", error);
    if (isUniqueConstraintError(error)) {
      return NextResponse.json({ error: "Ce slug vient d’être utilisé. Réessayez l’enregistrement." }, { status: 409 });
    }
    return NextResponse.json({ error: error instanceof Error ? error.message : "Impossible de créer le produit." }, { status: 400 });
  }
}

export async function PUT(request: Request) {
  const session = await requireAdmin();

  if (!session) {
    return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
  }

  try {
    const payload = await request.json();
    const id = String(payload.id ?? "");
    const name = String(payload.name ?? "").trim();
    const description = String(payload.description ?? "").trim();
    const price = Number(payload.price ?? 0);
    const stock = Number(payload.stock ?? 0);
    const categoryId = getCategoryId(payload.categoryId);
    const status = payload.status === "COMING_SOON" ? "COMING_SOON" : "AVAILABLE";
    const images = Array.isArray(payload.images) ? payload.images.filter(Boolean) : [];
    const sizes = Array.isArray(payload.sizes) ? payload.sizes.filter(Boolean) : [];
    const colors = Array.isArray(payload.colors) ? payload.colors.filter(Boolean) : [];
    const estimatedArrival = normalizeEstimatedArrival(payload.estimatedArrival, status);

    if (!id || !name || !description || !categoryId || price <= 0 || images.length === 0) {
      return NextResponse.json({ error: "Produit invalide. Vérifiez les champs requis." }, { status: 400 });
    }

    if (status === "COMING_SOON" && !estimatedArrival) {
      return NextResponse.json({ error: "Une date d’arrivée est obligatoire pour un produit à venir." }, { status: 400 });
    }

    const slug = await getAvailableProductSlug(String(payload.slug || name), id);

    const product = await prisma.product.update({
      where: { id },
      data: {
        name,
        slug,
        description,
        price,
        stock,
        categoryId,
        status,
        images,
        sizes,
        colors,
        featured: Boolean(payload.featured),
        isNew: Boolean(payload.isNew),
        estimatedArrival,
      },
      include: { category: true },
    });

    revalidatePath("/admin");
    revalidatePath("/products");
    revalidatePath("/");

    return NextResponse.json(product);
  } catch (error) {
    console.error("Admin update product error", error);
    if (isUniqueConstraintError(error)) {
      return NextResponse.json({ error: "Ce slug vient d’être utilisé. Réessayez l’enregistrement." }, { status: 409 });
    }
    return NextResponse.json({ error: error instanceof Error ? error.message : "Impossible de modifier le produit." }, { status: 400 });
  }
}

export async function DELETE(request: Request) {
  const session = await requireAdmin();

  if (!session) {
    return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Produit introuvable." }, { status: 400 });
  }

  await prisma.product.delete({ where: { id } });

  revalidatePath("/admin");
  revalidatePath("/products");
  revalidatePath("/");

  return NextResponse.json({ success: true });
}
