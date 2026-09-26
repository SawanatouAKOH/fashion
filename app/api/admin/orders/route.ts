import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

async function requireAdmin() {
  const session = await auth();

  if (!session?.user || session.user.role !== "ADMIN") {
    return null;
  }

  return session;
}

export async function GET(request: Request) {
  const session = await requireAdmin();

  if (!session) {
    return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  const search = (searchParams.get("search") ?? "").trim();
  const status = searchParams.get("status") ?? "ALL";

  if (id) {
    const order = await prisma.order.findUnique({
      where: { id },
      include: { items: true },
    });

    if (!order) {
      return NextResponse.json({ error: "Commande introuvable" }, { status: 404 });
    }

    return NextResponse.json({
      ...order,
      total: Number(order.total),
      items: order.items.map((item) => ({
        ...item,
        price: Number(item.price),
      })),
    });
  }

  const orders = await prisma.order.findMany({
    where: {
      ...(status !== "ALL" ? { status: status as "PENDING" | "CONFIRMED" | "PROCESSING" | "SHIPPED" | "COMPLETED" | "CANCELLED" } : {}),
      ...(search
        ? {
            OR: [
              { customerName: { contains: search } },
              { phone: { contains: search } },
              { deliveryAddress: { contains: search } },
            ],
          }
        : {}),
    },
    include: { items: true },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(
    orders.map((order) => ({
      ...order,
      total: Number(order.total),
      items: order.items.map((item) => ({
        ...item,
        price: Number(item.price),
      })),
    })),
  );
}

export async function PUT(request: Request) {
  const session = await requireAdmin();

  if (!session) {
    return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
  }

  const body = await request.json();
  const id = String(body.id ?? "").trim();
  const status = String(body.status ?? "").trim();

  if (!id || !status) {
    return NextResponse.json({ error: "Commande ou statut invalide." }, { status: 400 });
  }

  const order = await prisma.order.update({
    where: { id },
    data: { status: status as "PENDING" | "CONFIRMED" | "PROCESSING" | "SHIPPED" | "COMPLETED" | "CANCELLED" },
    include: { items: true },
  });

  return NextResponse.json({
    ...order,
    total: Number(order.total),
    items: order.items.map((item) => ({
      ...item,
      price: Number(item.price),
    })),
  });
}
