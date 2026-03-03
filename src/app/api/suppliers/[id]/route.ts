import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { suppliers } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getSession } from "@/lib/auth";

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    if (!["Admin", "Manager"].includes(session.role)) {
      return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 });
    }

    const { id } = await params;
    const supplierId = parseInt(id);
    const data = await request.json();

    const updateData: Partial<typeof suppliers.$inferInsert> = {};
    if (data.name !== undefined) updateData.name = data.name;
    if (data.phone !== undefined) updateData.phone = data.phone;
    if (data.email !== undefined) updateData.email = data.email;
    if (data.kraPin !== undefined) updateData.kraPin = data.kraPin;
    if (data.address !== undefined) updateData.address = data.address;
    if (data.balance !== undefined) updateData.balance = parseFloat(data.balance);

    await db.update(suppliers).set(updateData).where(eq(suppliers.id, supplierId));

    const updated = await db.select().from(suppliers).where(eq(suppliers.id, supplierId)).get();
    return NextResponse.json({ supplier: updated });
  } catch (error) {
    console.error("Update supplier error:", error);
    return NextResponse.json({ error: "Failed to update supplier" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    if (session.role !== "Admin") return NextResponse.json({ error: "Admin access required" }, { status: 403 });

    const { id } = await params;
    const supplierId = parseInt(id);

    await db.delete(suppliers).where(eq(suppliers.id, supplierId));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete supplier error:", error);
    return NextResponse.json({ error: "Failed to delete supplier" }, { status: 500 });
  }
}
