import { NextResponse } from "next/server";
import { db } from "@/db";
import { sales, products, expenses } from "@/db/schema";
import { gte, sql } from "drizzle-orm";
import { getSession } from "@/lib/auth";
import { ensureDbReady } from "@/lib/db-init";

export async function GET() {
  try {
    await ensureDbReady();
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayStart = today;

    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);

    // Today's sales
    const todaySales = await db
      .select({
        total: sql<number>`COALESCE(SUM(total_amount), 0)`,
        count: sql<number>`COUNT(*)`,
      })
      .from(sales)
      .where(gte(sales.createdAt, todayStart))
      .get();

    // Monthly sales
    const monthlySales = await db
      .select({
        total: sql<number>`COALESCE(SUM(total_amount), 0)`,
        count: sql<number>`COUNT(*)`,
      })
      .from(sales)
      .where(gte(sales.createdAt, monthStart))
      .get();

    // Monthly expenses
    const monthlyExpenses = await db
      .select({
        total: sql<number>`COALESCE(SUM(amount), 0)`,
      })
      .from(expenses)
      .where(gte(expenses.createdAt, monthStart))
      .get();

    // Inventory stats
    const allProducts = await db.select().from(products);
    const inventoryValue = allProducts.reduce((sum, p) => sum + p.quantity * p.costPrice, 0);
    const lowStockItems = allProducts.filter((p) => p.quantity <= p.reorderLevel && p.quantity > 0);
    const outOfStockItems = allProducts.filter((p) => p.quantity === 0);

    // Recent sales (last 10)
    const recentSales = await db
      .select()
      .from(sales)
      .orderBy(sql`created_at DESC`)
      .limit(10);

    // Payment method breakdown (this month)
    const paymentBreakdown = await db
      .select({
        method: sales.paymentMethod,
        total: sql<number>`COALESCE(SUM(total_amount), 0)`,
        count: sql<number>`COUNT(*)`,
      })
      .from(sales)
      .where(gte(sales.createdAt, monthStart))
      .groupBy(sales.paymentMethod);

    // Top products (by quantity sold this month)
    const topProducts = await db
      .select({
        productName: sql<string>`product_name`,
        totalQty: sql<number>`SUM(quantity)`,
        totalRevenue: sql<number>`SUM(total_price)`,
      })
      .from(sql`sale_items si JOIN sales s ON si.sale_id = s.id`)
      .where(gte(sales.createdAt, monthStart))
      .groupBy(sql`product_name`)
      .orderBy(sql`SUM(total_price) DESC`)
      .limit(5);

    return NextResponse.json({
      todaySales: {
        total: todaySales?.total || 0,
        count: todaySales?.count || 0,
      },
      monthlySales: {
        total: monthlySales?.total || 0,
        count: monthlySales?.count || 0,
      },
      monthlyExpenses: monthlyExpenses?.total || 0,
      inventory: {
        totalProducts: allProducts.length,
        inventoryValue,
        lowStockCount: lowStockItems.length,
        outOfStockCount: outOfStockItems.length,
        lowStockItems: lowStockItems.slice(0, 5),
      },
      recentSales,
      paymentBreakdown,
      topProducts,
    });
  } catch (error) {
    console.error("Dashboard error:", error);
    return NextResponse.json({ error: "Failed to fetch dashboard data" }, { status: 500 });
  }
}
