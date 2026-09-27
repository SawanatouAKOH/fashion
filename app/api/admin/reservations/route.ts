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
    const reservation = await prisma.reservation.findUnique({
      where: { id },
      include: { items: true },
    });

    if (!reservation) {
      return NextResponse.json({ error: "Réservation introuvable" }, { status: 404 });
    }

    return NextResponse.json({
      ...reservation,
      items: reservation.items.map((item) => ({
        ...item,
        price: Number(item.price),
      })),
    });
  }

  const reservations = await prisma.reservation.findMany({
    where: {
      ...(status !== "ALL" ? { status: status as "PENDING" | "CONFIRMED" | "EXPIRED" | "CANCELLED" } : {}),
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
    reservations.map((reservation) => ({
      ...reservation,
      items: reservation.items.map((item) => ({
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
    return NextResponse.json({ error: "Réservation ou statut invalide." }, { status: 400 });
  }

  const reservation = await prisma.reservation.update({
    where: { id },
    data: { status: status as "PENDING" | "CONFIRMED" | "EXPIRED" | "CANCELLED" },
    include: { items: true },
  });

  return NextResponse.json({
    ...reservation,
    items: reservation.items.map((item) => ({
      ...item,
      price: Number(item.price),
    })),
  });
}

export async function DELETE(request: Request) {
  const session = await requireAdmin();

  if (!session) {
    return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
  }

  const id = new URL(request.url).searchParams.get("id")?.trim();
  if (!id) {
    return NextResponse.json({ error: "Réservation introuvable." }, { status: 400 });
  }

  try {
    await prisma.reservation.delete({ where: { id } });
    return NextResponse.json({ success: true, id });
  } catch (error) {
    if (typeof error === "object" && error !== null && "code" in error && error.code === "P2025") {
      return NextResponse.json({ error: "Cette réservation n’existe plus." }, { status: 404 });
    }
    console.error("Admin delete reservation error", error);
    return NextResponse.json({ error: "Impossible de supprimer cette réservation." }, { status: 500 });
  }
}
