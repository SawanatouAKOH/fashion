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

export async function GET() {
  const session = await requireAdmin();

  if (!session) {
    return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
  }

  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
    include: {
      products: {
        select: { id: true },
      },
    },
  });

  return NextResponse.json(categories.map((category) => ({
    ...category,
    productCount: category.products.length,
  })));
}

export async function POST(request: Request) {
  const session = await requireAdmin();

  if (!session) {
    return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
  }

  const body = await request.json();
  const name = String(body.name ?? "").trim();
  const slug = String(body.slug ?? "").trim();

  if (!name) {
    return NextResponse.json({ error: "Le nom de la catégorie est requis." }, { status: 400 });
  }

  const safeSlug = slug || name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

  const category = await prisma.category.create({
    data: {
      name,
      slug: safeSlug,
    },
  });

  revalidatePath("/admin");
  revalidatePath("/");

  return NextResponse.json(category, { status: 201 });
}

export async function PUT(request: Request) {
  const session = await requireAdmin();

  if (!session) {
    return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
  }

  const body = await request.json();
  const id = String(body.id ?? "");
  const name = String(body.name ?? "").trim();
  const slug = String(body.slug ?? "").trim();

  if (!id || !name) {
    return NextResponse.json({ error: "Catégorie invalide." }, { status: 400 });
  }

  const category = await prisma.category.update({
    where: { id },
    data: {
      name,
      slug: slug || name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, ""),
    },
  });

  revalidatePath("/admin");
  revalidatePath("/");

  return NextResponse.json(category);
}

export async function DELETE(request: Request) {
  const session = await requireAdmin();

  if (!session) {
    return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Catégorie introuvable." }, { status: 400 });
  }

  const productsCount = await prisma.product.count({ where: { categoryId: id } });

  if (productsCount > 0) {
    return NextResponse.json({ error: "Impossible de supprimer une catégorie qui contient encore des produits." }, { status: 400 });
  }

  await prisma.category.delete({ where: { id } });

  revalidatePath("/admin");
  revalidatePath("/");

  return NextResponse.json({ success: true });
}
