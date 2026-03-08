import { NextResponse } from "next/server";
import { getServerAuthSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { findProduct } from "@/lib/microPurchases/catalog";
import { generateMicroContent } from "./generateContent";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const session = await getServerAuthSession();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Authentification requise" }, { status: 401 });
  }

  const body = await req.json();
  const purchaseId = typeof body?.purchaseId === "string" ? body.purchaseId : "";
  if (!purchaseId) {
    return NextResponse.json({ error: "purchaseId requis" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true },
  });
  if (!user) {
    return NextResponse.json({ error: "Utilisateur introuvable" }, { status: 404 });
  }

  // Verify purchase ownership and content not yet generated
  const purchase = await prisma.purchase.findUnique({
    where: { id: purchaseId },
  });
  if (!purchase || purchase.userId !== user.id) {
    return NextResponse.json({ error: "Achat introuvable" }, { status: 404 });
  }
  if (purchase.content) {
    return NextResponse.json({ content: purchase.content });
  }

  const product = findProduct(purchase.productId);
  if (!product) {
    return NextResponse.json({ error: "Produit introuvable" }, { status: 400 });
  }

  try {
    const content = await generateMicroContent(purchaseId, product, user.id);
    return NextResponse.json({ content });
  } catch (err) {
    console.error("[micro-purchase/generate] error:", err);
    return NextResponse.json(
      { error: "Erreur de génération du contenu" },
      { status: 500 }
    );
  }
}
