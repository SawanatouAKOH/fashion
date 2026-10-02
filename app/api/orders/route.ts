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
    const orderReference = String(body.orderReference ?? "").trim();
    const submittedItems = Array.isArray(body.items) ? body.items as SubmittedItem[] : [];

    if (!/^CMD-[A-Z0-9-]{8,32}$/.test(orderReference)) {
      return NextResponse.json({ error: "La référence de commande est invalide." }, { status: 400 });
    }

    if (!customerName || !phone || !city || !district || !deliveryAddress) {
      return NextResponse.json({ error: "Les coordonnées et l’adresse de livraison sont obligatoires." }, { status: 400 });
    }

    if (customerName.length > 150 || phone.length > 40 || deliveryAddress.length > 2000 || submittedItems.length === 0 || submittedItems.length > 30) {
      return NextResponse.json({ error: "Les informations de commande sont invalides." }, { status: 400 });
    }

    const validItems = submittedItems.every((item) =>
      typeof item.productId === "string" &&
      Number.isInteger(item.quantity) && item.quantity > 0 && item.quantity <= 20 &&
      typeof item.size === "string" && typeof item.color === "string",
    );

    if (!validItems) {
      return NextResponse.json({ error: "Un article ou une quantité est invalide." }, { status: 400 });
    }

    const productIds = [...new Set(submittedItems.map((item) => item.productId))];
    const products = await prisma.product.findMany({ where: { id: { in: productIds } } });
    const productsById = new Map(products.map((product) => [product.id, product]));

    if (products.length !== productIds.length) {
      return NextResponse.json({ error: "Un ou plusieurs articles ne sont plus disponibles." }, { status: 400 });
    }

    const quantityByProduct = new Map<string, number>();
    for (const item of submittedItems) {
      const product = productsById.get(item.productId)!;
      quantityByProduct.set(item.productId, (quantityByProduct.get(item.productId) ?? 0) + item.quantity);

      if (product.status !== "AVAILABLE") {
        return NextResponse.json({ error: `${product.name} n’est pas disponible à la commande.` }, { status: 400 });
      }
    }

    for (const [productId, quantity] of quantityByProduct) {
      const product = productsById.get(productId)!;
      if (quantity > product.stock) {
        return NextResponse.json({ error: `Stock insuffisant pour ${product.name}.` }, { status: 400 });
      }
    }

    const total = submittedItems.reduce((sum, item) => {
      return sum + Number(productsById.get(item.productId)!.price) * item.quantity;
    }, 0);
    const traceNote = "Trace : commande créée depuis le site avant ouverture de WhatsApp. Envoi WhatsApp non vérifiable.";

    const order = await prisma.order.create({
      data: {
        id: orderReference,
        customerName,
        phone,
        city,
        district,
        deliveryAddress,
        notes: [customerNotes ? `Note client : ${customerNotes}` : "", traceNote].filter(Boolean).join("\n"),
        total,
        status: "PENDING",
        items: {
          create: submittedItems.map((item) => {
            const product = productsById.get(item.productId)!;
            return {
              productId: product.id,
              productName: product.name,
              size: item.size,
              color: item.color,
              quantity: item.quantity,
              price: product.price,
            };
          }),
        },
      },
      select: { id: true, total: true, createdAt: true },
    });

    return NextResponse.json({ id: order.id, total: Number(order.total), createdAt: order.createdAt }, { status: 201 });
  } catch (error) {
    console.error("Public order tracking error", error);
    if (typeof error === "object" && error !== null && "code" in error && error.code === "P2002") {
      return NextResponse.json({ error: "Cette référence de commande existe déjà. Réessayez." }, { status: 409 });
    }
    return NextResponse.json({ error: "Impossible d’enregistrer la trace de commande." }, { status: 500 });
  }
}