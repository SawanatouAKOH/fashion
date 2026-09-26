import { mkdir, writeFile } from "fs/promises";
import path from "path";

import { NextResponse } from "next/server";

import { auth } from "@/auth";

async function requireAdmin() {
  const session = await auth();

  if (!session?.user || session.user.role !== "ADMIN") {
    return null;
  }

  return session;
}

export async function POST(request: Request) {
  const session = await requireAdmin();

  if (!session) {
    return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
  }

  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Aucun fichier reçu." }, { status: 400 });
  }

  if (!file.type.startsWith("image/")) {
    return NextResponse.json({ error: "Le fichier doit être une image." }, { status: 400 });
  }

  const safeName = file.name
    .replace(/[^a-zA-Z0-9._-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "") || "image";

  const extension = path.extname(safeName) || ".png";
  const uniqueName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}${extension}`;
  const uploadDir = path.join(process.cwd(), "public", "uploads", "products");

  await mkdir(uploadDir, { recursive: true });

  const filePath = path.join(uploadDir, uniqueName);
  const bytes = await file.arrayBuffer();
  await writeFile(filePath, Buffer.from(bytes));

  return NextResponse.json({
    url: `/uploads/products/${uniqueName}`,
  });
}
