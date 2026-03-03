/**
 * Database initialization - runs migrations and seeds on first startup
 */
import { migrate } from "drizzle-orm/better-sqlite3/migrator";
import { db, sqlite } from "@/db";
import { users } from "@/db/schema";
import path from "path";
import fs from "fs";

let initialized = false;

export async function ensureDbReady() {
  if (initialized) return;

  try {
    // Run migrations
    const migrationsFolder = path.join(process.cwd(), "src/db/migrations");
    if (fs.existsSync(migrationsFolder)) {
      migrate(db, { migrationsFolder });
    }

    // Check if we need to seed
    const userCount = sqlite.prepare("SELECT COUNT(*) as count FROM users").get() as { count: number };
    if (userCount.count === 0) {
      await seedDatabase();
    }

    initialized = true;
  } catch (error) {
    console.error("DB init error:", error);
    // Try to create tables directly if migrations fail
    await createTablesDirectly();
    initialized = true;
  }
}

async function createTablesDirectly() {
  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'Cashier',
      branch TEXT NOT NULL DEFAULT 'Main Branch',
      must_change_password INTEGER NOT NULL DEFAULT 1,
      is_active INTEGER NOT NULL DEFAULT 1,
      created_at INTEGER,
      updated_at INTEGER
    );

    CREATE TABLE IF NOT EXISTS branches (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      location TEXT NOT NULL,
      phone TEXT NOT NULL,
      created_at INTEGER
    );

    CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE
    );

    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      sku TEXT NOT NULL UNIQUE,
      barcode TEXT NOT NULL,
      category TEXT NOT NULL,
      cost_price REAL NOT NULL DEFAULT 0,
      selling_price REAL NOT NULL DEFAULT 0,
      vat_rate REAL NOT NULL DEFAULT 16,
      track_inventory INTEGER NOT NULL DEFAULT 1,
      quantity INTEGER NOT NULL DEFAULT 0,
      reorder_level INTEGER NOT NULL DEFAULT 10,
      supplier TEXT NOT NULL DEFAULT '',
      expiry_date TEXT,
      is_active INTEGER NOT NULL DEFAULT 1,
      created_at INTEGER,
      updated_at INTEGER
    );

    CREATE TABLE IF NOT EXISTS suppliers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      phone TEXT NOT NULL,
      email TEXT NOT NULL,
      kra_pin TEXT NOT NULL,
      address TEXT NOT NULL,
      balance REAL NOT NULL DEFAULT 0,
      created_at INTEGER
    );

    CREATE TABLE IF NOT EXISTS sales (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      sale_ref TEXT NOT NULL UNIQUE,
      branch_id INTEGER NOT NULL,
      cashier_id INTEGER NOT NULL,
      cashier_name TEXT NOT NULL,
      customer TEXT,
      total_amount REAL NOT NULL DEFAULT 0,
      vat_amount REAL NOT NULL DEFAULT 0,
      discount_amount REAL NOT NULL DEFAULT 0,
      payment_method TEXT NOT NULL DEFAULT 'Cash',
      payment_status TEXT NOT NULL DEFAULT 'Paid',
      reference TEXT,
      created_at INTEGER
    );

    CREATE TABLE IF NOT EXISTS sale_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      sale_id INTEGER NOT NULL,
      product_id INTEGER NOT NULL,
      product_name TEXT NOT NULL,
      quantity INTEGER NOT NULL DEFAULT 1,
      unit_price REAL NOT NULL DEFAULT 0,
      vat_amount REAL NOT NULL DEFAULT 0,
      total_price REAL NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS purchases (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      purchase_ref TEXT NOT NULL UNIQUE,
      supplier_id INTEGER NOT NULL,
      supplier_name TEXT NOT NULL,
      branch_id INTEGER NOT NULL,
      total_amount REAL NOT NULL DEFAULT 0,
      status TEXT NOT NULL DEFAULT 'Pending',
      created_at INTEGER
    );

    CREATE TABLE IF NOT EXISTS purchase_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      purchase_id INTEGER NOT NULL,
      product_name TEXT NOT NULL,
      quantity INTEGER NOT NULL DEFAULT 1,
      unit_cost REAL NOT NULL DEFAULT 0,
      total REAL NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS accounting_entries (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      date TEXT NOT NULL,
      description TEXT NOT NULL,
      transaction_type TEXT NOT NULL,
      debit_account TEXT NOT NULL,
      credit_account TEXT NOT NULL,
      amount REAL NOT NULL DEFAULT 0,
      reference TEXT NOT NULL,
      created_at INTEGER
    );

    CREATE TABLE IF NOT EXISTS expenses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      date TEXT NOT NULL,
      category TEXT NOT NULL,
      description TEXT NOT NULL,
      amount REAL NOT NULL DEFAULT 0,
      paid_by TEXT NOT NULL,
      branch TEXT NOT NULL,
      created_at INTEGER
    );

    CREATE TABLE IF NOT EXISTS sessions (
      id TEXT PRIMARY KEY,
      user_id INTEGER NOT NULL,
      expires_at INTEGER NOT NULL,
      created_at INTEGER
    );
  `);

  await seedDatabase();
}

async function seedDatabase() {
  const bcrypt = await import("bcryptjs");

  // Seed branches
  const branchStmt = sqlite.prepare("INSERT OR IGNORE INTO branches (name, location, phone, created_at) VALUES (?, ?, ?, ?)");
  const now = Date.now();
  branchStmt.run("Main Branch", "Nairobi CBD", "+254 700 000 001", now);
  branchStmt.run("Westlands Branch", "Westlands, Nairobi", "+254 700 000 002", now);
  branchStmt.run("Mombasa Branch", "Mombasa Town", "+254 700 000 003", now);

  // Seed admin user
  const adminHash = await bcrypt.hash("Admin@1234", 12);
  sqlite.prepare("INSERT OR IGNORE INTO users (name, email, password_hash, role, branch, must_change_password, is_active, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)").run(
    "System Administrator", "admin@lexintel.local", adminHash, "Admin", "Main Branch", 0, 1, now, now
  );

  // Seed demo users
  const defaultHash = await bcrypt.hash("Change@1234", 12);
  const demoUsers = [
    ["Jane Wanjiku", "jane@lexintel.local", "Manager", "Main Branch"],
    ["Peter Kamau", "peter@lexintel.local", "Cashier", "Westlands Branch"],
    ["Mary Achieng", "mary@lexintel.local", "Accountant", "Main Branch"],
    ["John Mwangi", "john@lexintel.local", "Cashier", "Mombasa Branch"],
  ];
  const userStmt = sqlite.prepare("INSERT OR IGNORE INTO users (name, email, password_hash, role, branch, must_change_password, is_active, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
  for (const [name, email, role, branch] of demoUsers) {
    userStmt.run(name, email, defaultHash, role, branch, 1, 1, now, now);
  }

  // Seed categories
  const catStmt = sqlite.prepare("INSERT OR IGNORE INTO categories (name) VALUES (?)");
  for (const cat of ["Flour & Grains", "Cooking Oils", "Sugar & Sweeteners", "Dairy", "Bakery", "Medicines", "Building Materials", "Hardware", "Beverages", "Detergents", "Electronics", "Clothing", "Stationery", "Household Items"]) {
    catStmt.run(cat);
  }

  // Seed suppliers
  const supStmt = sqlite.prepare("INSERT OR IGNORE INTO suppliers (name, phone, email, kra_pin, address, balance, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)");
  const supplierData = [
    ["Unga Group Ltd", "+254 20 6900000", "orders@unga.co.ke", "P051234567A", "Industrial Area, Nairobi", 45000],
    ["Bidco Africa", "+254 20 3500000", "sales@bidco.co.ke", "P051234568A", "Thika Road, Nairobi", 120000],
    ["Mumias Sugar Co.", "+254 56 6200000", "info@mumias.co.ke", "P051234569A", "Mumias, Western Kenya", 0],
    ["Brookside Dairy", "+254 20 4400000", "orders@brookside.co.ke", "P051234570A", "Ruiru, Kiambu", 28000],
    ["Bamburi Cement", "+254 41 4700000", "sales@bamburi.co.ke", "P051234571A", "Mombasa", 350000],
    ["Unilever Kenya", "+254 20 6600000", "orders@unilever.co.ke", "P051234572A", "Nairobi", 75000],
    ["Supa Loaf", "+254 20 3300000", "orders@supaloaf.co.ke", "P051234573A", "Nairobi", 15000],
    ["Coca-Cola Kenya", "+254 20 2200000", "orders@cocacola.co.ke", "P051234574A", "Nairobi", 85000],
    ["Hardware Supplies Ltd", "+254 20 1100000", "orders@hardware.co.ke", "P051234575A", "Nairobi", 0],
    ["Cosmos Pharmacy", "+254 20 9900000", "orders@cosmos.co.ke", "P051234576A", "Nairobi", 0],
  ];
  for (const sup of supplierData) {
    supStmt.run(...sup, now);
  }

  // Seed products
  const prodStmt = sqlite.prepare("INSERT OR IGNORE INTO products (name, sku, barcode, category, cost_price, selling_price, vat_rate, track_inventory, quantity, reorder_level, supplier, expiry_date, is_active, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
  const productData = [
    ["Unga Pembe 2kg", "UNG-001", "6001234567890", "Flour & Grains", 145, 175, 16, 1, 120, 20, "Unga Group Ltd", null],
    ["Cooking Oil 1L", "OIL-001", "6001234567891", "Cooking Oils", 210, 250, 16, 1, 85, 15, "Bidco Africa", null],
    ["Sugar 1kg", "SUG-001", "6001234567892", "Sugar & Sweeteners", 120, 145, 0, 1, 200, 30, "Mumias Sugar Co.", null],
    ["Milk 500ml", "MLK-001", "6001234567893", "Dairy", 55, 65, 0, 1, 8, 20, "Brookside Dairy", "2026-03-10"],
    ["Bread Loaf", "BRD-001", "6001234567894", "Bakery", 48, 60, 0, 1, 35, 10, "Supa Loaf", null],
    ["Paracetamol 500mg x10", "MED-001", "6001234567895", "Medicines", 25, 40, 0, 1, 150, 30, "Cosmos Pharmacy", "2027-06-30"],
    ["Cement 50kg", "CEM-001", "6001234567896", "Building Materials", 680, 750, 16, 1, 45, 10, "Bamburi Cement", null],
    ["Nails 2 inch (1kg)", "NAI-001", "6001234567897", "Hardware", 120, 160, 16, 1, 60, 15, "Hardware Supplies Ltd", null],
    ["Coca Cola 500ml", "BEV-001", "6001234567898", "Beverages", 55, 70, 16, 1, 5, 24, "Coca-Cola Kenya", null],
    ["Washing Powder 1kg", "DET-001", "6001234567899", "Detergents", 180, 220, 16, 1, 75, 20, "Unilever Kenya", null],
  ];
  for (const prod of productData) {
    prodStmt.run(...prod, 1, now, now);
  }

  console.log("✅ Database initialized with seed data");
}
