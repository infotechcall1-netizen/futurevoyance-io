import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";

export const runtime = "nodejs";

type RegisterPayload = {
  username: string;
  email: string;
  phone?: string;
  password: string;
};

function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function validateUsername(username: string): boolean {
  // Username: alphanumeric, dashes, underscores, 3-30 chars
  const usernameRegex = /^[a-zA-Z0-9_-]{3,30}$/;
  return usernameRegex.test(username);
}

export async function POST(req: Request) {
  try {
    const body: RegisterPayload = await req.json();

    const username = (body.username || "").trim();
    const email = (body.email || "").trim().toLowerCase();
    const phone = (body.phone || "").trim();
    const password = body.password || "";

    // Validation
    if (!username || !validateUsername(username)) {
      return NextResponse.json(
        { error: "Nom d'utilisateur invalide (3-30 caractères alphanumériques, - ou _)." },
        { status: 400 }
      );
    }

    if (!email || !validateEmail(email)) {
      return NextResponse.json({ error: "Email invalide." }, { status: 400 });
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: "Le mot de passe doit contenir au moins 8 caractères." },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Un compte existe déjà avec cet email." },
        { status: 409 }
      );
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 12);

    // Create user in database
    const user = await prisma.user.create({
      data: {
        name: username,
        email,
        phone: phone || null,
        passwordHash,
      },
    });

    console.log("[register] User created:", { id: user.id, email: user.email });

    // Return success (do NOT return passwordHash)
    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("[register] Error:", error);
    return NextResponse.json(
      { error: "Erreur lors de la création du compte." },
      { status: 500 }
    );
  }
}
