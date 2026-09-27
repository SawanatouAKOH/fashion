import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

type SubmittedItem = {
  productId: string;
  size: string;
  color: string;
  quantity: number;
};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const customer = body.customer ?? {};
    const customerName = String(customer.fullName ?? "").trim();
    const phone = String(customer.phone ?? "").trim();
    const city = String(customer.city ?? "").trim();
    const district = String(customer.district ?? "").trim();
    const deliveryAddress = String(customer.address ?? "").trim();
    const customerNotes = String(customer.notes ?? "").trim();
    const item = body.item as SubmittedItem | undefined;

    if (!customerName || !phone || !deliveryAddress) {
      return NextResponse.json({ error: "Le nom, le téléphone et l’adresse sont obligatoires pour réserver." }, { status: 400 });
    }

    if (customerName.length > 150 || phone.length > 40 || deliveryAddress.length > 2000 || !item || typeof item.productId !== "string" || !Number.isInteger(item.quantity) || item.quantity < 1 || item.quantity > 20) {
      return NextResponse.json({ error: "Les informations de réservation sont invalides." }, { status: 400 });
    }

    const product = await prisma.product.findUnique({ where: { id: item.productId } });
    if (!product || product.status !== "COMING_SOON") {
      return NextResponse.json({ error: "Ce produit ne peut pas être réservé actuellement." }, { status: 400 });
    }

    const traceNote = "Trace : réservation créée depuis le site avant ouverture de WhatsApp. Envoi WhatsApp non vérifiable.";
    const reservation = await prisma.reservation.create({
      data: {
        customerName,
        phone,
        city: city || null,
        district: district || null,
        deliveryAddress,
        notes: [customerNotes ? `Note client : ${customerNotes}` : "", traceNote].filter(Boolean).join("\n"),
        status: "PENDING",
        items: {
          create: {
            productId: product.id,
            productName: product.name,
            size: typeof item.size === "string" ? item.size : "",
            color: typeof item.color === "string" ? item.color : "",
            quantity: item.quantity,
            price: product.price,
          },
        },
      },
      select: { id: true, createdAt: true },
    });

    return NextResponse.json({ id: reservation.id, createdAt: reservation.createdAt }, { status: 201 });
  } catch (error) {
    console.error("Public reservation tracking error", error);
    return NextResponse.json({ error: "Impossible d’enregistrer la trace de réservation." }, { status: 500 });
  }
}