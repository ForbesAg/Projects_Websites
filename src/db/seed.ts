/**
 * Database seed script - creates initial data for the Lexintel POS System
 * Run with: bun run src/db/seed.ts
 */
import { db } from "./index";
import { users, branches, categories, products, suppliers } from "./schema";
import bcrypt from "bcryptjs";

console.log("🌱 Seeding database...");

// Seed branches
console.log("Creating branches...");
const branchData = [
  { name: "Main Branch", location: "Nairobi CBD", phone: "+254 700 000 001" },
  { name: "Westlands Branch", location: "Westlands, Nairobi", phone: "+254 700 000 002" },
  { name: "Mombasa Branch", location: "Mombasa Town", phone: "+254 700 000 003" },
];

for (const branch of branchData) {
  try {
    await db.insert(branches).values(branch).onConflictDoNothing();
  } catch {
    // ignore duplicates
  }
}

// Seed admin user
console.log("Creating admin user...");
const adminPasswordHash = await bcrypt.hash("Admin@1234", 12);
try {
  await db.insert(users).values({
    name: "System Administrator",
    email: "admin@lexintel.local",
    passwordHash: adminPasswordHash,
    role: "Admin",
    branch: "Main Branch",
    mustChangePassword: false,
    isActive: true,
  }).onConflictDoNothing();
} catch {
  // ignore if already exists
}

// Seed demo users
const demoUsers = [
  { name: "Jane Wanjiku", email: "jane@lexintel.local", role: "Manager" as const, branch: "Main Branch" },
  { name: "Peter Kamau", email: "peter@lexintel.local", role: "Cashier" as const, branch: "Westlands Branch" },
  { name: "Mary Achieng", email: "mary@lexintel.local", role: "Accountant" as const, branch: "Main Branch" },
  { name: "John Mwangi", email: "john@lexintel.local", role: "Cashier" as const, branch: "Mombasa Branch" },
];

const defaultPasswordHash = await bcrypt.hash("Change@1234", 12);
for (const user of demoUsers) {
  try {
    await db.insert(users).values({
      ...user,
      passwordHash: defaultPasswordHash,
      mustChangePassword: true,
      isActive: true,
    }).onConflictDoNothing();
  } catch {
    // ignore duplicates
  }
}

// Seed categories
console.log("Creating categories...");
const categoryData = [
  "Flour & Grains", "Cooking Oils", "Sugar & Sweeteners", "Dairy", "Bakery",
  "Medicines", "Building Materials", "Hardware", "Beverages", "Detergents",
  "Electronics", "Clothing", "Stationery", "Household Items"
];

for (const name of categoryData) {
  try {
    await db.insert(categories).values({ name }).onConflictDoNothing();
  } catch {
    // ignore duplicates
  }
}

// Seed suppliers
console.log("Creating suppliers...");
const supplierData = [
  { name: "Unga Group Ltd", phone: "+254 20 6900000", email: "orders@unga.co.ke", kraPin: "P051234567A", address: "Industrial Area, Nairobi", balance: 45000 },
  { name: "Bidco Africa", phone: "+254 20 3500000", email: "sales@bidco.co.ke", kraPin: "P051234568A", address: "Thika Road, Nairobi", balance: 120000 },
  { name: "Mumias Sugar Co.", phone: "+254 56 6200000", email: "info@mumias.co.ke", kraPin: "P051234569A", address: "Mumias, Western Kenya", balance: 0 },
  { name: "Brookside Dairy", phone: "+254 20 4400000", email: "orders@brookside.co.ke", kraPin: "P051234570A", address: "Ruiru, Kiambu", balance: 28000 },
  { name: "Bamburi Cement", phone: "+254 41 4700000", email: "sales@bamburi.co.ke", kraPin: "P051234571A", address: "Mombasa", balance: 350000 },
  { name: "Unilever Kenya", phone: "+254 20 6600000", email: "orders@unilever.co.ke", kraPin: "P051234572A", address: "Nairobi", balance: 75000 },
  { name: "Supa Loaf", phone: "+254 20 3300000", email: "orders@supaloaf.co.ke", kraPin: "P051234573A", address: "Nairobi", balance: 15000 },
  { name: "Coca-Cola Kenya", phone: "+254 20 2200000", email: "orders@cocacola.co.ke", kraPin: "P051234574A", address: "Nairobi", balance: 85000 },
];

for (const supplier of supplierData) {
  try {
    await db.insert(suppliers).values(supplier);
  } catch {
    // ignore duplicates
  }
}

// Seed products
console.log("Creating products...");
const productData = [
  { name: "Unga Pembe 2kg", sku: "UNG-001", barcode: "6001234567890", category: "Flour & Grains", costPrice: 145, sellingPrice: 175, vatRate: 16, trackInventory: true, quantity: 120, reorderLevel: 20, supplier: "Unga Group Ltd" },
  { name: "Cooking Oil 1L", sku: "OIL-001", barcode: "6001234567891", category: "Cooking Oils", costPrice: 210, sellingPrice: 250, vatRate: 16, trackInventory: true, quantity: 85, reorderLevel: 15, supplier: "Bidco Africa" },
  { name: "Sugar 1kg", sku: "SUG-001", barcode: "6001234567892", category: "Sugar & Sweeteners", costPrice: 120, sellingPrice: 145, vatRate: 0, trackInventory: true, quantity: 200, reorderLevel: 30, supplier: "Mumias Sugar Co." },
  { name: "Milk 500ml", sku: "MLK-001", barcode: "6001234567893", category: "Dairy", costPrice: 55, sellingPrice: 65, vatRate: 0, trackInventory: true, quantity: 8, reorderLevel: 20, supplier: "Brookside Dairy", expiryDate: "2026-03-10" },
  { name: "Bread Loaf", sku: "BRD-001", barcode: "6001234567894", category: "Bakery", costPrice: 48, sellingPrice: 60, vatRate: 0, trackInventory: true, quantity: 35, reorderLevel: 10, supplier: "Supa Loaf" },
  { name: "Paracetamol 500mg x10", sku: "MED-001", barcode: "6001234567895", category: "Medicines", costPrice: 25, sellingPrice: 40, vatRate: 0, trackInventory: true, quantity: 150, reorderLevel: 30, supplier: "Cosmos Pharmacy", expiryDate: "2027-06-30" },
  { name: "Cement 50kg", sku: "CEM-001", barcode: "6001234567896", category: "Building Materials", costPrice: 680, sellingPrice: 750, vatRate: 16, trackInventory: true, quantity: 45, reorderLevel: 10, supplier: "Bamburi Cement" },
  { name: "Nails 2 inch (1kg)", sku: "NAI-001", barcode: "6001234567897", category: "Hardware", costPrice: 120, sellingPrice: 160, vatRate: 16, trackInventory: true, quantity: 60, reorderLevel: 15, supplier: "Hardware Supplies Ltd" },
  { name: "Coca Cola 500ml", sku: "BEV-001", barcode: "6001234567898", category: "Beverages", costPrice: 55, sellingPrice: 70, vatRate: 16, trackInventory: true, quantity: 5, reorderLevel: 24, supplier: "Coca-Cola Kenya" },
  { name: "Washing Powder 1kg", sku: "DET-001", barcode: "6001234567899", category: "Detergents", costPrice: 180, sellingPrice: 220, vatRate: 16, trackInventory: true, quantity: 75, reorderLevel: 20, supplier: "Unilever Kenya" },
];

for (const product of productData) {
  try {
    await db.insert(products).values(product).onConflictDoNothing();
  } catch {
    // ignore duplicates
  }
}

console.log("✅ Database seeded successfully!");
console.log("");
console.log("📋 Login Credentials:");
console.log("  Admin:   admin@lexintel.local / Admin@1234");
console.log("  Others:  [email] / Change@1234 (must change on first login)");
