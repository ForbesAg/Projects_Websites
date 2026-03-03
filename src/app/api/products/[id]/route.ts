import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { products } from "@/db/schema";
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
    const productId = parseInt(id);
    const data = await request.json();

    const updateData: Partial<typeof products.$inferInsert> = {
      updatedAt: new Date(),
    };

    if (data.name !== undefined) updateData.name = data.name;
    if (data.sku !== undefined) updateData.sku = data.sku;
    if (data.barcode !== undefined) updateData.barcode = data.barcode;
    if (data.category !== undefined) updateData.category = data.category;
    if (data.costPrice !== undefined) updateData.costPrice = parseFloat(data.costPrice);
    if (data.sellingPrice !== undefined) updateData.sellingPrice = parseFloat(data.sellingPrice);
    if (data.vatRate !== undefined) updateData.vatRate = parseFloat(data.vatRate);
    if (data.trackInventory !== undefined) updateData.trackInventory = data.trackInventory;
    if (data.quantity !== undefined) updateData.quantity = parseInt(data.quantity);
    if (data.reorderLevel !== undefined) updateData.reorderLevel = parseInt(data.reorderLevel);
    if (data.supplier !== undefined) updateData.supplier = data.supplier;
    if (data.expiryDate !== undefined) updateData.expiryDate = data.expiryDate || null;

    await db.update(products).set(updateData).where(eq(products.id, productId));

    const updated = await db.select().from(products).where(eq(products.id, productId)).get();
    return NextResponse.json({ product: updated });
  } catch (error) {
    console.error("Update product error:", error);
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    if (!["Admin", "Manager"].includes(session.role)) {
      return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 });
    }

    const { id } = await params;
    const productId = parseInt(id);

    // Soft delete
    await db.update(products).set({ isActive: false, updatedAt: new Date() }).where(eq(products.id, productId));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete product error:", error);
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
  }
}
