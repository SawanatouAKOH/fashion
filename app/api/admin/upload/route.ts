import { mkdir, writeFile } from "fs/promises";
import path from "path";

import { put } from "@vercel/blob";
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
  console.log("UPLOAD_DEBUG_START", {
    isVercel: Boolean(process.env.VERCEL),
    hasBlobToken: Boolean(process.env.BLOB_READ_WRITE_TOKEN),
    hasBlobStoreId: Boolean(process.env.BLOB_STORE_ID),
    contentType: request.headers.get("content-type"),
  });

  try {
    const session = await requireAdmin();

    if (!session) {
      console.log("UPLOAD_DEBUG_AUTH_DENIED");
      return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
    }

    console.log("UPLOAD_DEBUG_AUTH_OK", { email: session.user?.email });

    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      console.log("UPLOAD_DEBUG_NO_FILE");
      return NextResponse.json({ error: "Aucun fichier reçu." }, { status: 400 });
    }

    if (!file.type.startsWith("image/")) {
      console.log("UPLOAD_DEBUG_INVALID_MIME", { type: file.type });
      return NextResponse.json({ error: "Le fichier doit être une image." }, { status: 400 });
    }

    const safeName = file.name
      .replace(/[^a-zA-Z0-9._-]/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "") || "image";

    const extension = path.extname(safeName) || ".png";
    const uniqueName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}${extension}`;

    console.log("UPLOAD_DEBUG_FILE", {
      name: file.name,
      type: file.type,
      size: file.size,
      uniqueName,
    });

    if (process.env.VERCEL && !process.env.BLOB_READ_WRITE_TOKEN) {
      console.error("UPLOAD_DEBUG_BLOB_CONFIG_MISSING", {
        hasBlobToken: false,
        hasBlobStoreId: Boolean(process.env.BLOB_STORE_ID),
      });
      return NextResponse.json(
        { error: "Le stockage Vercel Blob n’est pas configuré. Ajoutez BLOB_READ_WRITE_TOKEN sur Vercel." },
        { status: 500 },
      );
    }

    if (process.env.BLOB_READ_WRITE_TOKEN) {
      console.log("UPLOAD_DEBUG_BLOB_CALL", {
        fileName: file.name,
        contentType: file.type || "image/png",
        hasToken: true,
        hasStoreId: Boolean(process.env.BLOB_STORE_ID),
      });

      const blob = await put(`products/${uniqueName}`, file, {
        access: "public",
        contentType: file.type || "image/png",
        token: process.env.BLOB_READ_WRITE_TOKEN,
        ...(process.env.BLOB_STORE_ID ? { storeId: process.env.BLOB_STORE_ID } : {}),
      });

      console.log("UPLOAD_DEBUG_BLOB_SUCCESS", { url: blob.url });
      return NextResponse.json({ url: blob.url });
    }

    if (!process.env.VERCEL) {
      const uploadDir = path.join(process.cwd(), "public", "uploads", "products");
      await mkdir(uploadDir, { recursive: true });

      const filePath = path.join(uploadDir, uniqueName);
      const bytes = await file.arrayBuffer();
      await writeFile(filePath, Buffer.from(bytes));

      console.log("UPLOAD_DEBUG_LOCAL_FALLBACK", { path: `/uploads/products/${uniqueName}` });
      return NextResponse.json({ url: `/uploads/products/${uniqueName}` });
    }

    console.error("UPLOAD_DEBUG_RUNTIME_UNSUPPORTED", {
      isVercel: Boolean(process.env.VERCEL),
      hasBlobToken: Boolean(process.env.BLOB_READ_WRITE_TOKEN),
    });
    return NextResponse.json({ error: "Impossible de téléverser l’image sur ce runtime." }, { status: 500 });
  } catch (error) {
    console.error("UPLOAD_DEBUG_ERROR", {
      name: error instanceof Error ? error.name : "UnknownError",
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });
    return NextResponse.json(
      { error: "Impossible de téléverser l’image. Vérifiez la configuration Vercel Blob et la validité du token." },
      { status: 500 },
    );
  }
}
