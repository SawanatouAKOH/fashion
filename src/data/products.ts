import { prisma } from "@/lib/prisma";
import type { Product, ProductStatus } from "@/types/product";

function mapProductRowToProduct(row: any): Product {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description ?? "",
    price: Number(row.price ?? 0),
    images: Array.isArray(row.images) ? (row.images as string[]) : [],
    category: row.category?.name ?? "Autres",
    categoryId: row.categoryId ?? row.category?.id,
    sizes: Array.isArray(row.sizes) ? (row.sizes as string[]) : [],
    colors: Array.isArray(row.colors)
      ? (row.colors as Array<{ name: string; hex: string }>)
      : [],
    stock: Number(row.stock ?? 0),
    featured: Boolean(row.featured),
    isNew: Boolean(row.isNew),
    status: (row.status as ProductStatus) ?? "AVAILABLE",
    estimatedArrival: row.estimatedArrival ? new Date(row.estimatedArrival).toISOString() : null,
  };
}

export async function getCategories() {
  return prisma.category.findMany({
    orderBy: { name: "asc" },
  });
}

export async function getProducts(): Promise<Product[]> {
  const products = await prisma.product.findMany({
    include: { category: true },
    orderBy: { createdAt: "desc" },
  });

  return products.map(mapProductRowToProduct);
}

export async function getFeaturedProducts(): Promise<Product[]> {
  const products = await getProducts();
  const featured = products.filter((product) => product.featured);
  return featured.length > 0 ? featured : products;
}

export async function getNewProducts(): Promise<Product[]> {
  const products = await getProducts();
  const newProducts = products.filter((product) => product.isNew);
  return newProducts.length > 0 ? newProducts : products;
}

export async function getProductById(id: string): Promise<Product | undefined> {
  const product = await prisma.product.findUnique({
    where: { id },
    include: { category: true },
  });

  return product ? mapProductRowToProduct(product) : undefined;
}

export async function getProductBySlug(slug: string): Promise<Product | undefined> {
  const product = await prisma.product.findUnique({
    where: { slug },
    include: { category: true },
  });

  return product ? mapProductRowToProduct(product) : undefined;
}

export async function getProductsByCategory(category: string): Promise<Product[]> {
  const products = await prisma.product.findMany({
    where: { category: { name: category } },
    include: { category: true },
    orderBy: { createdAt: "desc" },
  });

  return products.map(mapProductRowToProduct);
}
