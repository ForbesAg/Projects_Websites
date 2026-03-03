export type UserRole = "Admin" | "Manager" | "Cashier" | "Accountant";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  branch: string;
  avatar?: string;
}

export interface Branch {
  id: string;
  name: string;
  location: string;
  phone: string;
}

export interface Category {
  id: string;
  name: string;
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  barcode: string;
  category: string;
  costPrice: number;
  sellingPrice: number;
  vatRate: number;
  trackInventory: boolean;
  quantity: number;
  reorderLevel: number;
  supplier: string;
  expiryDate?: string;
}

export interface SaleItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  vatAmount: number;
  totalPrice: number;
}

export interface Sale {
  id: string;
  branchId: string;
  cashier: string;
  customer?: string;
  items: SaleItem[];
  totalAmount: number;
  vatAmount: number;
  discountAmount: number;
  paymentMethod: "Cash" | "Card" | "M-Pesa";
  paymentStatus: "Paid" | "Pending" | "Refunded";
  reference?: string;
  createdAt: string;
}

export interface Supplier {
  id: string;
  name: string;
  phone: string;
  email: string;
  kraPin: string;
  address: string;
  balance: number;
}

export interface Purchase {
  id: string;
  supplierId: string;
  supplierName: string;
  branchId: string;
  items: { productName: string; quantity: number; unitCost: number; total: number }[];
  totalAmount: number;
  status: "Received" | "Pending" | "Partial";
  createdAt: string;
}

export interface AccountingEntry {
  id: string;
  date: string;
  description: string;
  transactionType: string;
  debitAccount: string;
  creditAccount: string;
  amount: number;
  reference: string;
}

export interface Expense {
  id: string;
  date: string;
  category: string;
  description: string;
  amount: number;
  paidBy: string;
  branch: string;
}
