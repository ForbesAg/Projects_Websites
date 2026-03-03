import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { products } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getSession } from "@/lib/auth";
import { ensureDbReady } from "@/lib/db-init";

export async function GET() {
  try {
    await ensureDbReady();
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

    const allProducts = await db
      .select()
      .from(products)
      .where(eq(products.isActive, true));

    return NextResponse.json({ products: allProducts });
  } catch (error) {
    console.error("Get products error:", error);
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await ensureDbReady();
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    if (!["Admin", "Manager"].includes(session.role)) {
      return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 });
    }

    const data = await request.json();
    const { name, sku, barcode, category, costPrice, sellingPrice, vatRate, trackInventory, quantity, reorderLevel, supplier, expiryDate } = data;

    if (!name || !sku || !barcode || !category) {
      return NextResponse.json({ error: "Name, SKU, barcode, and category are required" }, { status: 400 });
    }

    const [newProduct] = await db.insert(products).values({
      name,
      sku,
      barcode,
      category,
      costPrice: parseFloat(costPrice) || 0,
      sellingPrice: parseFloat(sellingPrice) || 0,
      vatRate: parseFloat(vatRate) || 16,
      trackInventory: trackInventory !== false,
      quantity: parseInt(quantity) || 0,
      reorderLevel: parseInt(reorderLevel) || 10,
      supplier: supplier || "",
      expiryDate: expiryDate || null,
      isActive: true,
    }).returning();

    return NextResponse.json({ product: newProduct }, { status: 201 });
  } catch (error: unknown) {
    if (error instanceof Error && error.message?.includes("UNIQUE")) {
      return NextResponse.json({ error: "SKU already exists" }, { status: 409 });
    }
    console.error("Create product error:", error);
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }
}
