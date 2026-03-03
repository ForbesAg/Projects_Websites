import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getSession } from "@/lib/auth";
import { ensureDbReady } from "@/lib/db-init";

export async function GET() {
  try {
    await ensureDbReady();
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

    const allUsers = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        role: users.role,
        branch: users.branch,
        isActive: users.isActive,
        mustChangePassword: users.mustChangePassword,
        createdAt: users.createdAt,
      })
      .from(users);

    return NextResponse.json({ users: allUsers });
  } catch (error) {
    console.error("Get users error:", error);
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await ensureDbReady();
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    if (session.role !== "Admin") return NextResponse.json({ error: "Admin access required" }, { status: 403 });

    const { name, email, role, branch, password } = await request.json();

    if (!name || !email || !role || !branch || !password) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    if (password.length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters" }, { status: 400 });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const [newUser] = await db.insert(users).values({
      name,
      email: email.toLowerCase().trim(),
      passwordHash,
      role,
      branch,
      mustChangePassword: true,
      isActive: true,
    }).returning({
      id: users.id,
      name: users.name,
      email: users.email,
      role: users.role,
      branch: users.branch,
      isActive: users.isActive,
      mustChangePassword: users.mustChangePassword,
    });

    return NextResponse.json({ user: newUser }, { status: 201 });
  } catch (error: unknown) {
    if (error instanceof Error && error.message?.includes("UNIQUE")) {
      return NextResponse.json({ error: "Email already exists" }, { status: 409 });
    }
    console.error("Create user error:", error);
    return NextResponse.json({ error: "Failed to create user" }, { status: 500 });
  }
}
