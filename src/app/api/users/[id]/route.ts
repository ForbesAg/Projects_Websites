import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getSession } from "@/lib/auth";

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    if (session.role !== "Admin") return NextResponse.json({ error: "Admin access required" }, { status: 403 });

    const { id } = await params;
    const userId = parseInt(id);
    const { name, email, role, branch, isActive, resetPassword } = await request.json();

    const updateData: Partial<typeof users.$inferInsert> = {
      updatedAt: new Date(),
    };

    if (name) updateData.name = name;
    if (email) updateData.email = email.toLowerCase().trim();
    if (role) updateData.role = role;
    if (branch) updateData.branch = branch;
    if (typeof isActive === "boolean") updateData.isActive = isActive;

    if (resetPassword) {
      const newHash = await bcrypt.hash(resetPassword, 12);
      updateData.passwordHash = newHash;
      updateData.mustChangePassword = true;
    }

    await db.update(users).set(updateData).where(eq(users.id, userId));

    const updated = await db.select({
      id: users.id,
      name: users.name,
      email: users.email,
      role: users.role,
      branch: users.branch,
      isActive: users.isActive,
      mustChangePassword: users.mustChangePassword,
    }).from(users).where(eq(users.id, userId)).get();

    return NextResponse.json({ user: updated });
  } catch (error) {
    console.error("Update user error:", error);
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    if (session.role !== "Admin") return NextResponse.json({ error: "Admin access required" }, { status: 403 });

    const { id } = await params;
    const userId = parseInt(id);

    if (userId === session.id) {
      return NextResponse.json({ error: "Cannot delete your own account" }, { status: 400 });
    }

    // Soft delete - deactivate instead of delete
    await db.update(users).set({ isActive: false, updatedAt: new Date() }).where(eq(users.id, userId));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete user error:", error);
    return NextResponse.json({ error: "Failed to delete user" }, { status: 500 });
  }
}
