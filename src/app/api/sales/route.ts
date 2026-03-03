import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { sales, saleItems, products, accountingEntries } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { getSession } from "@/lib/auth";
import { ensureDbReady } from "@/lib/db-init";

export async function GET() {
  try {
    await ensureDbReady();
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

    const allSales = await db.select().from(sales).orderBy(desc(sales.createdAt)).limit(100);

    // Get items for each sale
    const salesWithItems = await Promise.all(
      allSales.map(async (sale) => {
        const items = await db.select().from(saleItems).where(eq(saleItems.saleId, sale.id));
        return { ...sale, items };
      })
    );

    return NextResponse.json({ sales: salesWithItems });
  } catch (error) {
    console.error("Get sales error:", error);
    return NextResponse.json({ error: "Failed to fetch sales" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await ensureDbReady();
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

    const { items, customer, paymentMethod, discountAmount, branchId } = await request.json();

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "No items in sale" }, { status: 400 });
    }

    // Calculate totals
    let totalAmount = 0;
    let vatAmount = 0;

    for (const item of items) {
      totalAmount += item.totalPrice;
      vatAmount += item.vatAmount * item.quantity;
    }

    const discount = parseFloat(discountAmount) || 0;
    totalAmount = totalAmount - discount;

    // Generate sale reference
    const now = new Date();
    const saleRef = `S-${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${Date.now().toString().slice(-6)}`;

    // Create sale
    const [newSale] = await db.insert(sales).values({
      saleRef,
      branchId: branchId || 1,
      cashierId: session.id,
      cashierName: session.name,
      customer: customer || null,
      totalAmount,
      vatAmount,
      discountAmount: discount,
      paymentMethod,
      paymentStatus: "Paid",
    }).returning();

    // Create sale items and update inventory
    for (const item of items) {
      await db.insert(saleItems).values({
        saleId: newSale.id,
        productId: item.productId,
        productName: item.productName,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        vatAmount: item.vatAmount,
        totalPrice: item.totalPrice,
      });

      // Update product quantity
      const product = await db.select().from(products).where(eq(products.id, item.productId)).get();
      if (product && product.trackInventory) {
        await db.update(products)
          .set({ quantity: Math.max(0, product.quantity - item.quantity), updatedAt: new Date() })
          .where(eq(products.id, item.productId));
      }
    }

    // Create accounting entry
    const debitAccount = paymentMethod === "Cash" ? "Cash" : paymentMethod === "M-Pesa" ? "M-Pesa Account" : "Bank Account";
    await db.insert(accountingEntries).values({
      date: now.toISOString().split("T")[0],
      description: `Sale ${saleRef} - ${paymentMethod}`,
      transactionType: "Sale",
      debitAccount,
      creditAccount: "Sales Revenue",
      amount: totalAmount,
      reference: saleRef,
    });

    if (vatAmount > 0) {
      await db.insert(accountingEntries).values({
        date: now.toISOString().split("T")[0],
        description: `VAT on Sale ${saleRef}`,
        transactionType: "VAT",
        debitAccount: "Sales Revenue",
        creditAccount: "VAT Payable",
        amount: vatAmount,
        reference: saleRef,
      });
    }

    return NextResponse.json({ sale: { ...newSale, items } }, { status: 201 });
  } catch (error) {
    console.error("Create sale error:", error);
    return NextResponse.json({ error: "Failed to create sale" }, { status: 500 });
  }
}
