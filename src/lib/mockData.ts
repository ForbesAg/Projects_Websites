import type { Product, Sale, Supplier, Purchase, AccountingEntry, Expense, Branch, User } from "./types";

export const branches: Branch[] = [
  { id: "b1", name: "Main Branch", location: "Nairobi CBD", phone: "+254 700 000 001" },
  { id: "b2", name: "Westlands Branch", location: "Westlands, Nairobi", phone: "+254 700 000 002" },
  { id: "b3", name: "Mombasa Branch", location: "Mombasa Town", phone: "+254 700 000 003" },
];

export const users: User[] = [
  { id: "u1", name: "Admin User", email: "admin@lexintel.co.ke", role: "Admin", branch: "Main Branch" },
  { id: "u2", name: "Jane Wanjiku", email: "jane@lexintel.co.ke", role: "Manager", branch: "Main Branch" },
  { id: "u3", name: "Peter Kamau", email: "peter@lexintel.co.ke", role: "Cashier", branch: "Westlands Branch" },
  { id: "u4", name: "Mary Achieng", email: "mary@lexintel.co.ke", role: "Accountant", branch: "Main Branch" },
  { id: "u5", name: "John Mwangi", email: "john@lexintel.co.ke", role: "Cashier", branch: "Mombasa Branch" },
];

export const products: Product[] = [
  { id: "p1", name: "Unga Pembe 2kg", sku: "UNG-001", barcode: "6001234567890", category: "Flour & Grains", costPrice: 145, sellingPrice: 175, vatRate: 16, trackInventory: true, quantity: 120, reorderLevel: 20, supplier: "Unga Group Ltd" },
  { id: "p2", name: "Cooking Oil 1L", sku: "OIL-001", barcode: "6001234567891", category: "Cooking Oils", costPrice: 210, sellingPrice: 250, vatRate: 16, trackInventory: true, quantity: 85, reorderLevel: 15, supplier: "Bidco Africa" },
  { id: "p3", name: "Sugar 1kg", sku: "SUG-001", barcode: "6001234567892", category: "Sugar & Sweeteners", costPrice: 120, sellingPrice: 145, vatRate: 0, trackInventory: true, quantity: 200, reorderLevel: 30, supplier: "Mumias Sugar Co." },
  { id: "p4", name: "Milk 500ml", sku: "MLK-001", barcode: "6001234567893", category: "Dairy", costPrice: 55, sellingPrice: 65, vatRate: 0, trackInventory: true, quantity: 8, reorderLevel: 20, supplier: "Brookside Dairy", expiryDate: "2026-03-10" },
  { id: "p5", name: "Bread Loaf", sku: "BRD-001", barcode: "6001234567894", category: "Bakery", costPrice: 48, sellingPrice: 60, vatRate: 0, trackInventory: true, quantity: 35, reorderLevel: 10, supplier: "Supa Loaf" },
  { id: "p6", name: "Paracetamol 500mg x10", sku: "MED-001", barcode: "6001234567895", category: "Medicines", costPrice: 25, sellingPrice: 40, vatRate: 0, trackInventory: true, quantity: 150, reorderLevel: 30, supplier: "Cosmos Pharmacy", expiryDate: "2027-06-30" },
  { id: "p7", name: "Cement 50kg", sku: "CEM-001", barcode: "6001234567896", category: "Building Materials", costPrice: 680, sellingPrice: 750, vatRate: 16, trackInventory: true, quantity: 45, reorderLevel: 10, supplier: "Bamburi Cement" },
  { id: "p8", name: "Nails 2 inch (1kg)", sku: "NAI-001", barcode: "6001234567897", category: "Hardware", costPrice: 120, sellingPrice: 160, vatRate: 16, trackInventory: true, quantity: 60, reorderLevel: 15, supplier: "Hardware Supplies Ltd" },
  { id: "p9", name: "Coca Cola 500ml", sku: "BEV-001", barcode: "6001234567898", category: "Beverages", costPrice: 55, sellingPrice: 70, vatRate: 16, trackInventory: true, quantity: 5, reorderLevel: 24, supplier: "Coca-Cola Kenya" },
  { id: "p10", name: "Washing Powder 1kg", sku: "DET-001", barcode: "6001234567899", category: "Detergents", costPrice: 180, sellingPrice: 220, vatRate: 16, trackInventory: true, quantity: 75, reorderLevel: 20, supplier: "Unilever Kenya" },
];

export const sales: Sale[] = [
  {
    id: "S-2026-001", branchId: "b1", cashier: "Peter Kamau", customer: "Walk-in Customer",
    items: [
      { productId: "p1", productName: "Unga Pembe 2kg", quantity: 2, unitPrice: 175, vatAmount: 48.28, totalPrice: 350 },
      { productId: "p3", productName: "Sugar 1kg", quantity: 1, unitPrice: 145, vatAmount: 0, totalPrice: 145 },
    ],
    totalAmount: 495, vatAmount: 48.28, discountAmount: 0, paymentMethod: "Cash", paymentStatus: "Paid",
    createdAt: "2026-03-03T08:30:00Z"
  },
  {
    id: "S-2026-002", branchId: "b1", cashier: "Peter Kamau", customer: "John Doe",
    items: [
      { productId: "p2", productName: "Cooking Oil 1L", quantity: 3, unitPrice: 250, vatAmount: 103.45, totalPrice: 750 },
      { productId: "p5", productName: "Bread Loaf", quantity: 2, unitPrice: 60, vatAmount: 0, totalPrice: 120 },
    ],
    totalAmount: 870, vatAmount: 103.45, discountAmount: 0, paymentMethod: "M-Pesa", paymentStatus: "Paid",
    reference: "QHJ7K9L2", createdAt: "2026-03-03T09:15:00Z"
  },
  {
    id: "S-2026-003", branchId: "b2", cashier: "Jane Wanjiku", customer: "Mary Njeri",
    items: [
      { productId: "p7", productName: "Cement 50kg", quantity: 5, unitPrice: 750, vatAmount: 517.24, totalPrice: 3750 },
      { productId: "p8", productName: "Nails 2 inch (1kg)", quantity: 2, unitPrice: 160, vatAmount: 44.14, totalPrice: 320 },
    ],
    totalAmount: 4070, vatAmount: 561.38, discountAmount: 200, paymentMethod: "Card", paymentStatus: "Paid",
    createdAt: "2026-03-03T10:00:00Z"
  },
  {
    id: "S-2026-004", branchId: "b1", cashier: "Peter Kamau",
    items: [
      { productId: "p6", productName: "Paracetamol 500mg x10", quantity: 3, unitPrice: 40, vatAmount: 0, totalPrice: 120 },
      { productId: "p4", productName: "Milk 500ml", quantity: 4, unitPrice: 65, vatAmount: 0, totalPrice: 260 },
    ],
    totalAmount: 380, vatAmount: 0, discountAmount: 0, paymentMethod: "Cash", paymentStatus: "Paid",
    createdAt: "2026-03-03T11:30:00Z"
  },
  {
    id: "S-2026-005", branchId: "b3", cashier: "John Mwangi",
    items: [
      { productId: "p9", productName: "Coca Cola 500ml", quantity: 10, unitPrice: 70, vatAmount: 96.55, totalPrice: 700 },
      { productId: "p10", productName: "Washing Powder 1kg", quantity: 2, unitPrice: 220, vatAmount: 60.69, totalPrice: 440 },
    ],
    totalAmount: 1140, vatAmount: 157.24, discountAmount: 0, paymentMethod: "Cash", paymentStatus: "Paid",
    createdAt: "2026-03-02T14:00:00Z"
  },
];

export const suppliers: Supplier[] = [
  { id: "s1", name: "Unga Group Ltd", phone: "+254 20 6900000", email: "orders@unga.co.ke", kraPin: "P051234567A", address: "Industrial Area, Nairobi", balance: 45000 },
  { id: "s2", name: "Bidco Africa", phone: "+254 20 3500000", email: "sales@bidco.co.ke", kraPin: "P051234568A", address: "Thika Road, Nairobi", balance: 120000 },
  { id: "s3", name: "Mumias Sugar Co.", phone: "+254 56 6200000", email: "info@mumias.co.ke", kraPin: "P051234569A", address: "Mumias, Western Kenya", balance: 0 },
  { id: "s4", name: "Brookside Dairy", phone: "+254 20 4400000", email: "orders@brookside.co.ke", kraPin: "P051234570A", address: "Ruiru, Kiambu", balance: 28000 },
  { id: "s5", name: "Bamburi Cement", phone: "+254 41 4700000", email: "sales@bamburi.co.ke", kraPin: "P051234571A", address: "Mombasa", balance: 350000 },
  { id: "s6", name: "Unilever Kenya", phone: "+254 20 6600000", email: "orders@unilever.co.ke", kraPin: "P051234572A", address: "Nairobi", balance: 75000 },
];

export const purchases: Purchase[] = [
  {
    id: "PO-2026-001", supplierId: "s1", supplierName: "Unga Group Ltd", branchId: "b1",
    items: [{ productName: "Unga Pembe 2kg", quantity: 100, unitCost: 145, total: 14500 }],
    totalAmount: 14500, status: "Received", createdAt: "2026-03-01T09:00:00Z"
  },
  {
    id: "PO-2026-002", supplierId: "s2", supplierName: "Bidco Africa", branchId: "b1",
    items: [{ productName: "Cooking Oil 1L", quantity: 50, unitCost: 210, total: 10500 }],
    totalAmount: 10500, status: "Received", createdAt: "2026-03-01T10:00:00Z"
  },
  {
    id: "PO-2026-003", supplierId: "s5", supplierName: "Bamburi Cement", branchId: "b2",
    items: [{ productName: "Cement 50kg", quantity: 30, unitCost: 680, total: 20400 }],
    totalAmount: 20400, status: "Pending", createdAt: "2026-03-02T11:00:00Z"
  },
];

export const accountingEntries: AccountingEntry[] = [
  { id: "AE-001", date: "2026-03-03", description: "Sale S-2026-001 - Cash", transactionType: "Sale", debitAccount: "Cash", creditAccount: "Sales Revenue", amount: 495, reference: "S-2026-001" },
  { id: "AE-002", date: "2026-03-03", description: "VAT on Sale S-2026-001", transactionType: "VAT", debitAccount: "Sales Revenue", creditAccount: "VAT Payable", amount: 48.28, reference: "S-2026-001" },
  { id: "AE-003", date: "2026-03-03", description: "Sale S-2026-002 - M-Pesa", transactionType: "Sale", debitAccount: "M-Pesa Account", creditAccount: "Sales Revenue", amount: 870, reference: "S-2026-002" },
  { id: "AE-004", date: "2026-03-03", description: "Sale S-2026-003 - Card", transactionType: "Sale", debitAccount: "Bank Account", creditAccount: "Sales Revenue", amount: 4070, reference: "S-2026-003" },
  { id: "AE-005", date: "2026-03-01", description: "Purchase PO-2026-001", transactionType: "Purchase", debitAccount: "Inventory", creditAccount: "Accounts Payable", amount: 14500, reference: "PO-2026-001" },
  { id: "AE-006", date: "2026-03-01", description: "Purchase PO-2026-002", transactionType: "Purchase", debitAccount: "Inventory", creditAccount: "Accounts Payable", amount: 10500, reference: "PO-2026-002" },
];

export const expenses: Expense[] = [
  { id: "EXP-001", date: "2026-03-01", category: "Rent", description: "Monthly rent - Main Branch", amount: 45000, paidBy: "Admin User", branch: "Main Branch" },
  { id: "EXP-002", date: "2026-03-01", category: "Utilities", description: "Electricity bill", amount: 8500, paidBy: "Admin User", branch: "Main Branch" },
  { id: "EXP-003", date: "2026-03-02", category: "Salaries", description: "Staff salaries - March", amount: 120000, paidBy: "Admin User", branch: "Main Branch" },
  { id: "EXP-004", date: "2026-03-02", category: "Transport", description: "Delivery costs", amount: 3500, paidBy: "Jane Wanjiku", branch: "Westlands Branch" },
  { id: "EXP-005", date: "2026-03-03", category: "Maintenance", description: "Equipment repair", amount: 5000, paidBy: "Admin User", branch: "Main Branch" },
];

export const salesChartData = [
  { day: "Mon", sales: 45200, target: 50000 },
  { day: "Tue", sales: 52800, target: 50000 },
  { day: "Wed", sales: 48600, target: 50000 },
  { day: "Thu", sales: 61200, target: 50000 },
  { day: "Fri", sales: 73500, target: 50000 },
  { day: "Sat", sales: 89200, target: 70000 },
  { day: "Sun", sales: 34100, target: 30000 },
];

export const monthlyRevenueData = [
  { month: "Sep", revenue: 820000, expenses: 620000 },
  { month: "Oct", revenue: 940000, expenses: 680000 },
  { month: "Nov", revenue: 1050000, expenses: 720000 },
  { month: "Dec", revenue: 1380000, expenses: 850000 },
  { month: "Jan", revenue: 920000, expenses: 690000 },
  { month: "Feb", revenue: 1100000, expenses: 740000 },
  { month: "Mar", revenue: 1250000, expenses: 780000 },
];

export const topProductsData = [
  { name: "Cement 50kg", sales: 245, revenue: 183750 },
  { name: "Cooking Oil 1L", sales: 380, revenue: 95000 },
  { name: "Unga Pembe 2kg", sales: 420, revenue: 73500 },
  { name: "Sugar 1kg", sales: 510, revenue: 73950 },
  { name: "Washing Powder 1kg", sales: 180, revenue: 39600 },
];

export const paymentMethodData = [
  { name: "Cash", value: 45, color: "#1a3a5c" },
  { name: "M-Pesa", value: 38, color: "#0ea5e9" },
  { name: "Card", value: 17, color: "#f59e0b" },
];
