import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { suppliers } from "@/db/schema";
import { getSession } from "@/lib/auth";
import { ensureDbReady } from "@/lib/db-init";

export async function GET() {
  try {
    await ensureDbReady();
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

    const allSuppliers = await db.select().from(suppliers);
    return NextResponse.json({ suppliers: allSuppliers });
  } catch (error) {
    console.error("Get suppliers error:", error);
    return NextResponse.json({ error: "Failed to fetch suppliers" }, { status: 500 });
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

    const { name, phone, email, kraPin, address, balance } = await request.json();

    if (!name || !phone) {
      return NextResponse.json({ error: "Name and phone are required" }, { status: 400 });
    }

    const [newSupplier] = await db.insert(suppliers).values({
      name,
      phone,
      email: email || "",
      kraPin: kraPin || "",
      address: address || "",
      balance: parseFloat(balance) || 0,
    }).returning();

    return NextResponse.json({ supplier: newSupplier }, { status: 201 });
  } catch (error) {
    console.error("Create supplier error:", error);
    return NextResponse.json({ error: "Failed to create supplier" }, { status: 500 });
  }
}
