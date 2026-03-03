import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";

// Users table
export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  role: text("role", { enum: ["Admin", "Manager", "Cashier", "Accountant"] }).notNull().default("Cashier"),
  branch: text("branch").notNull().default("Main Branch"),
  mustChangePassword: integer("must_change_password", { mode: "boolean" }).notNull().default(true),
  isActive: integer("is_active", { mode: "boolean" }).notNull().default(true),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

// Branches table
export const branches = sqliteTable("branches", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull().unique(),
  location: text("location").notNull(),
  phone: text("phone").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

// Categories table
export const categories = sqliteTable("categories", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull().unique(),
});

// Products table
export const products = sqliteTable("products", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  sku: text("sku").notNull().unique(),
  barcode: text("barcode").notNull(),
  category: text("category").notNull(),
  costPrice: real("cost_price").notNull().default(0),
  sellingPrice: real("selling_price").notNull().default(0),
  vatRate: real("vat_rate").notNull().default(16),
  trackInventory: integer("track_inventory", { mode: "boolean" }).notNull().default(true),
  quantity: integer("quantity").notNull().default(0),
  reorderLevel: integer("reorder_level").notNull().default(10),
  supplier: text("supplier").notNull().default(""),
  expiryDate: text("expiry_date"),
  isActive: integer("is_active", { mode: "boolean" }).notNull().default(true),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

// Suppliers table
export const suppliers = sqliteTable("suppliers", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  phone: text("phone").notNull(),
  email: text("email").notNull(),
  kraPin: text("kra_pin").notNull(),
  address: text("address").notNull(),
  balance: real("balance").notNull().default(0),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

// Sales table
export const sales = sqliteTable("sales", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  saleRef: text("sale_ref").notNull().unique(),
  branchId: integer("branch_id").notNull(),
  cashierId: integer("cashier_id").notNull(),
  cashierName: text("cashier_name").notNull(),
  customer: text("customer"),
  totalAmount: real("total_amount").notNull().default(0),
  vatAmount: real("vat_amount").notNull().default(0),
  discountAmount: real("discount_amount").notNull().default(0),
  paymentMethod: text("payment_method", { enum: ["Cash", "Card", "M-Pesa"] }).notNull().default("Cash"),
  paymentStatus: text("payment_status", { enum: ["Paid", "Pending", "Refunded"] }).notNull().default("Paid"),
  reference: text("reference"),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

// Sale items table
export const saleItems = sqliteTable("sale_items", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  saleId: integer("sale_id").notNull(),
  productId: integer("product_id").notNull(),
  productName: text("product_name").notNull(),
  quantity: integer("quantity").notNull().default(1),
  unitPrice: real("unit_price").notNull().default(0),
  vatAmount: real("vat_amount").notNull().default(0),
  totalPrice: real("total_price").notNull().default(0),
});

// Purchases table
export const purchases = sqliteTable("purchases", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  purchaseRef: text("purchase_ref").notNull().unique(),
  supplierId: integer("supplier_id").notNull(),
  supplierName: text("supplier_name").notNull(),
  branchId: integer("branch_id").notNull(),
  totalAmount: real("total_amount").notNull().default(0),
  status: text("status", { enum: ["Received", "Pending", "Partial"] }).notNull().default("Pending"),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

// Purchase items table
export const purchaseItems = sqliteTable("purchase_items", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  purchaseId: integer("purchase_id").notNull(),
  productName: text("product_name").notNull(),
  quantity: integer("quantity").notNull().default(1),
  unitCost: real("unit_cost").notNull().default(0),
  total: real("total").notNull().default(0),
});

// Accounting entries table
export const accountingEntries = sqliteTable("accounting_entries", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  date: text("date").notNull(),
  description: text("description").notNull(),
  transactionType: text("transaction_type").notNull(),
  debitAccount: text("debit_account").notNull(),
  creditAccount: text("credit_account").notNull(),
  amount: real("amount").notNull().default(0),
  reference: text("reference").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

// Expenses table
export const expenses = sqliteTable("expenses", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  date: text("date").notNull(),
  category: text("category").notNull(),
  description: text("description").notNull(),
  amount: real("amount").notNull().default(0),
  paidBy: text("paid_by").notNull(),
  branch: text("branch").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

// Sessions table (for auth)
export const sessions = sqliteTable("sessions", {
  id: text("id").primaryKey(),
  userId: integer("user_id").notNull(),
  expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});
