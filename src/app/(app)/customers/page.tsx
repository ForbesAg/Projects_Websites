"use client";

import { useState, useEffect } from "react";
import { TopBar } from "@/components/layout/TopBar";
import { Badge } from "@/components/ui/Badge";
import {
  Search, Plus, Edit2, Trash2, User, Phone, Mail, MapPin,
  DollarSign, FileText, X, Save, ChevronUp, ChevronDown, History
} from "lucide-react";

interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  balance: number;
  creditLimit: number;
  status: "Active" | "Suspended";
  createdAt: string;
}

interface Transaction {
  id: string;
  date: string;
  type: "Deposit" | "Purchase" | "Payment";
  amount: number;
  reference: string;
  balance: number;
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showTransactions, setShowTransactions] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [editCustomer, setEditCustomer] = useState<Partial<Customer> | null>(null);
  const [filterStatus, setFilterStatus] = useState("All");
  const [sortField, setSortField] = useState<keyof Customer>("name");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [saving, setSaving] = useState(false);

  // Load customers from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("lexintel-customers");
    if (saved) {
      try {
        setCustomers(JSON.parse(saved));
      } catch {
        setCustomers([]);
      }
    }
    setLoading(false);
  }, []);

  // Save customers to localStorage
  const saveCustomers = (data: Customer[]) => {
    localStorage.setItem("lexintel-customers", JSON.stringify(data));
    setCustomers(data);
  };

  const filtered = customers
    .filter((c) => {
      const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) || 
        c.phone.includes(search) || c.email.toLowerCase().includes(search.toLowerCase());
      const matchStatus = filterStatus === "All" || c.status === filterStatus;
      return matchSearch && matchStatus;
    })
    .sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];
      if (typeof aVal === "string" && typeof bVal === "string") {
        return sortDir === "asc" ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      }
      if (typeof aVal === "number" && typeof bVal === "number") {
        return sortDir === "asc" ? aVal - bVal : bVal - aVal;
      }
      return 0;
    });

  const totalDebt = customers.reduce((sum, c) => sum + Math.max(0, c.balance), 0);
  const activeCustomers = customers.filter(c => c.status === "Active").length;

  const handleSort = (field: keyof Customer) => {
    if (sortField === field) setSortDir(sortDir === "asc" ? "desc" : "asc");
    else { setSortField(field); setSortDir("asc"); }
  };

  const SortIcon = ({ field }: { field: keyof Customer }) => {
    if (sortField !== field) return <ChevronUp size={12} className="text-slate-300" />;
    return sortDir === "asc" ? <ChevronUp size={12} className="text-slate-600" /> : <ChevronDown size={12} className="text-slate-600" />;
  };

  const openAdd = () => {
    setEditCustomer({
      name: "", phone: "", email: "", address: "",
      balance: 0, creditLimit: 10000, status: "Active"
    });
    setShowModal(true);
  };

  const openEdit = (customer: Customer) => {
    setEditCustomer({ ...customer });
    setShowModal(true);
  };

  const saveCustomer = async () => {
    if (!editCustomer?.name) return;
    setSaving(true);

    const now = new Date().toISOString();
    if (editCustomer.id) {
      // Update existing
      const updated = customers.map(c => 
        c.id === editCustomer.id ? { ...c, ...editCustomer } as Customer : c
      );
      saveCustomers(updated);
    } else {
      // Add new
      const newCustomer: Customer = {
        ...editCustomer as Customer,
        id: `CUST-${Date.now()}`,
        createdAt: now,
      };
      saveCustomers([...customers, newCustomer]);
    }

    setShowModal(false);
    setEditCustomer(null);
    setSaving(false);
  };

  const deleteCustomer = (id: string) => {
    if (confirm("Delete this customer? This action cannot be undone.")) {
      saveCustomers(customers.filter(c => c.id !== id));
    }
  };

  const viewTransactions = (customer: Customer) => {
    setSelectedCustomer(customer);
    // Generate sample transactions based on customer balance
    const sampleTransactions: Transaction[] = [
      { id: "1", date: "2026-03-03", type: "Purchase", amount: 500, reference: "SALE-001", balance: customer.balance },
      { id: "2", date: "2026-03-01", type: "Deposit", amount: 1000, reference: "DEP-001", balance: customer.balance + 500 },
      { id: "3", date: "2026-02-28", type: "Purchase", amount: 300, reference: "SALE-002", balance: customer.balance + 1500 },
      { id: "4", date: "2026-02-25", type: "Deposit", amount: 2000, reference: "DEP-002", balance: customer.balance + 1800 },
    ];
    setTransactions(sampleTransactions);
    setShowTransactions(true);
  };

  const addDeposit = (customer: Customer) => {
    const amount = prompt("Enter deposit amount:");
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) return;
    
    const deposit = Number(amount);
    const updated = customers.map(c => 
      c.id === customer.id 
        ? { ...c, balance: c.balance - deposit } as Customer 
        : c
    );
    saveCustomers(updated);
    alert(`Deposit of KES ${deposit.toFixed(2)} recorded! New balance: KES ${(customer.balance - deposit).toFixed(2)}`);
  };

  return (
    <div>
      <TopBar title="Customers" subtitle="Manage customer accounts & deposits" />

      <div className="p-6 space-y-5">
        {/* Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Total Customers", value: customers.length.toString(), color: "#1a3a5c", bg: "#e8f0f8" },
            { label: "Active Customers", value: activeCustomers.toString(), color: "#10b981", bg: "#d1fae5" },
            { label: "Total Credit", value: `KES ${totalDebt.toLocaleString()}`, color: "#f59e0b", bg: "#fef3c7" },
            { label: "Suspended", value: (customers.length - activeCustomers).toString(), color: "#ef4444", bg: "#fee2e2" },
          ].map((card) => (
            <div key={card.label} className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
              <p className="text-xs text-slate-500 font-medium">{card.label}</p>
              <p className="text-2xl font-bold mt-1" style={{ color: card.color }}>{card.value}</p>
            </div>
          ))}
        </div>

        {/* Filters & Actions */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
          <div className="flex flex-wrap gap-3 items-center justify-between">
            <div className="flex flex-wrap gap-3 flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search customers..."
                  className="pl-9 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 w-56"
                />
              </div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
              >
                <option value="All">All Status</option>
                <option value="Active">Active</option>
                <option value="Suspended">Suspended</option>
              </select>
            </div>
            <button
              onClick={openAdd}
              className="flex items-center gap-2 px-4 py-2 text-sm text-white rounded-lg font-medium"
              style={{ backgroundColor: "#1a3a5c" }}
            >
              <Plus size={14} />
              Add Customer
            </button>
          </div>
        </div>

        {/* Customers Table */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
          {loading ? (
            <div className="text-center py-12 text-slate-400">Loading customers...</div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              {customers.length === 0 ? "No customers yet. Add your first customer!" : "No customers match your search."}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                    {[
                      { label: "Customer", field: "name" as keyof Customer },
                      { label: "Phone", field: "phone" as keyof Customer },
                      { label: "Email", field: "email" as keyof Customer },
                      { label: "Balance", field: "balance" as keyof Customer },
                      { label: "Credit Limit", field: "creditLimit" as keyof Customer },
                      { label: "Status", field: null },
                      { label: "Actions", field: null },
                    ].map((col) => (
                      <th
                        key={col.label}
                        className={`text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-4 py-3 ${col.field ? "cursor-pointer hover:text-slate-700" : ""}`}
                        onClick={() => col.field && handleSort(col.field)}
                      >
                        <div className="flex items-center gap-1">
                          {col.label}
                          {col.field && <SortIcon field={col.field} />}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filtered.map((customer) => (
                    <tr key={customer.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
                            <User size={14} className="text-slate-500" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-slate-800">{customer.name}</p>
                            <p className="text-xs text-slate-400">Since {new Date(customer.createdAt).toLocaleDateString()}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-600">{customer.phone}</td>
                      <td className="px-4 py-3 text-sm text-slate-600">{customer.email}</td>
                      <td className="px-4 py-3">
                        <span className={`text-sm font-bold ${customer.balance > 0 ? "text-red-600" : "text-emerald-600"}`}>
                          KES {customer.balance.toLocaleString()}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-600">KES {customer.creditLimit.toLocaleString()}</td>
                      <td className="px-4 py-3">
                        <Badge variant={customer.status === "Active" ? "success" : "danger"}>
                          {customer.status}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => viewTransactions(customer)}
                            className="p-1.5 text-slate-400 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-colors"
                            title="View Transactions"
                          >
                            <History size={14} />
                          </button>
                          <button
                            onClick={() => addDeposit(customer)}
                            className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                            title="Add Deposit"
                          >
                            <DollarSign size={14} />
                          </button>
                          <button
                            onClick={() => openEdit(customer)}
                            className="p-1.5 text-slate-400 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-colors"
                          >
                            <Edit2 size={14} />
                          </button>
                          <button
                            onClick={() => deleteCustomer(customer.id)}
                            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Customer Modal */}
      {showModal && editCustomer && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <h3 className="text-lg font-semibold text-slate-800">
                {editCustomer.id ? "Edit Customer" : "Add New Customer"}
              </h3>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-slate-100 rounded-lg">
                <X size={18} className="text-slate-500" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Customer Name *</label>
                <input
                  type="text"
                  value={editCustomer.name || ""}
                  onChange={(e) => setEditCustomer({ ...editCustomer, name: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-sky-500 focus:outline-none"
                  placeholder="Enter customer name"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Phone</label>
                  <input
                    type="text"
                    value={editCustomer.phone || ""}
                    onChange={(e) => setEditCustomer({ ...editCustomer, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-sky-500 focus:outline-none"
                    placeholder="+254..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={editCustomer.email || ""}
                    onChange={(e) => setEditCustomer({ ...editCustomer, email: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-sky-500 focus:outline-none"
                    placeholder="email@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Address</label>
                <input
                  type="text"
                  value={editCustomer.address || ""}
                  onChange={(e) => setEditCustomer({ ...editCustomer, address: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-sky-500 focus:outline-none"
                  placeholder="Physical address"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Credit Limit</label>
                  <input
                    type="number"
                    value={editCustomer.creditLimit || 0}
                    onChange={(e) => setEditCustomer({ ...editCustomer, creditLimit: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-sky-500 focus:outline-none"
                    placeholder="10000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
                  <select
                    value={editCustomer.status || "Active"}
                    onChange={(e) => setEditCustomer({ ...editCustomer, status: e.target.value as "Active" | "Suspended" })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-sky-500 focus:outline-none"
                  >
                    <option value="Active">Active</option>
                    <option value="Suspended">Suspended</option>
                  </select>
                </div>
              </div>

              {editCustomer.id && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Current Balance</label>
                  <input
                    type="number"
                    value={editCustomer.balance || 0}
                    onChange={(e) => setEditCustomer({ ...editCustomer, balance: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-sky-500 focus:outline-none"
                    placeholder="0"
                  />
                </div>
              )}
            </div>

            <div className="flex gap-3 p-6 border-t border-slate-100">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 px-4 py-2 border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={saveCustomer}
                disabled={saving || !editCustomer.name}
                className="flex-1 px-4 py-2 text-white rounded-lg font-medium disabled:opacity-50"
                style={{ backgroundColor: "#1a3a5c" }}
              >
                {saving ? "Saving..." : editCustomer.id ? "Update Customer" : "Add Customer"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Transactions Modal */}
      {showTransactions && selectedCustomer && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <div>
                <h3 className="text-lg font-semibold text-slate-800">Account Statement</h3>
                <p className="text-sm text-slate-500">{selectedCustomer.name}</p>
              </div>
              <button onClick={() => setShowTransactions(false)} className="p-2 hover:bg-slate-100 rounded-lg">
                <X size={18} className="text-slate-500" />
              </button>
            </div>

            <div className="p-6">
              <div className="flex justify-between mb-4 p-4 bg-slate-50 rounded-xl">
                <div>
                  <p className="text-xs text-slate-500">Current Balance</p>
                  <p className={`text-xl font-bold ${selectedCustomer.balance > 0 ? "text-red-600" : "text-emerald-600"}`}>
                    KES {selectedCustomer.balance.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Credit Limit</p>
                  <p className="text-xl font-bold text-slate-800">
                    KES {selectedCustomer.creditLimit.toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-slate-700">Recent Transactions</h4>
                {transactions.map((tx) => (
                  <div key={tx.id} className="flex items-center justify-between p-3 border border-slate-100 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-slate-800">{tx.type}</p>
                      <p className="text-xs text-slate-400">{tx.date} · {tx.reference}</p>
                    </div>
                    <div className="text-right">
                      <p className={`text-sm font-bold ${tx.type === "Deposit" ? "text-emerald-600" : "text-slate-800"}`}>
                        {tx.type === "Deposit" ? "+" : "-"} KES {tx.amount.toLocaleString()}
                      </p>
                      <p className="text-xs text-slate-400">Bal: KES {tx.balance.toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-6 border-t border-slate-100">
              <button
                onClick={() => { setShowTransactions(false); addDeposit(selectedCustomer); }}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 text-white rounded-lg font-medium"
                style={{ backgroundColor: "#1a3a5c" }}
              >
                <DollarSign size={16} />
                Add Deposit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
