"use client";

import { useState } from "react";
import { TopBar } from "@/components/layout/TopBar";
import { Badge } from "@/components/ui/Badge";
import { suppliers as initialSuppliers, purchases as initialPurchases } from "@/lib/mockData";
import type { Supplier, Purchase } from "@/lib/types";
import {
  Search, Plus, Edit2, Trash2, X, Save,
  Truck, Phone, Mail, FileText, Package,
  ChevronRight, Building2
} from "lucide-react";

const tabs = ["Suppliers", "Purchase Orders"];

export default function SuppliersPage() {
  const [activeTab, setActiveTab] = useState("Suppliers");
  const [suppliers, setSuppliers] = useState<Supplier[]>(initialSuppliers);
  const [purchases] = useState<Purchase[]>(initialPurchases);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editSupplier, setEditSupplier] = useState<Supplier | null>(null);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  const [showPOModal, setShowPOModal] = useState(false);
  const [newPO, setNewPO] = useState({
    supplierId: "",
    items: "",
    notes: ""
  });

  const filteredSuppliers = suppliers.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.email.toLowerCase().includes(search.toLowerCase()) ||
      s.phone.includes(search)
  );

  const filteredPurchases = purchases.filter(
    (p) =>
      p.supplierName.toLowerCase().includes(search.toLowerCase()) ||
      p.id.toLowerCase().includes(search.toLowerCase())
  );

  const totalPayable = suppliers.reduce((sum, s) => sum + s.balance, 0);

  const openAdd = () => {
    setEditSupplier({ id: "", name: "", phone: "", email: "", kraPin: "", address: "", balance: 0 });
    setShowModal(true);
  };

  const openEdit = (supplier: Supplier) => {
    setEditSupplier({ ...supplier });
    setShowModal(true);
  };

  const saveSupplier = () => {
    if (!editSupplier) return;
    if (!editSupplier.id) {
      setSuppliers((prev) => [...prev, { ...editSupplier, id: `s${Date.now()}` }]);
    } else {
      setSuppliers((prev) => prev.map((s) => (s.id === editSupplier.id ? editSupplier : s)));
    }
    setShowModal(false);
    setEditSupplier(null);
  };

  const createPurchaseOrder = () => {
    if (!newPO.supplierId || !newPO.items) {
      alert("Please select a supplier and add items");
      return;
    }
    alert(`Purchase Order created! (Demo only - data not persisted)`);
    setShowPOModal(false);
    setNewPO({ supplierId: "", items: "", notes: "" });
  };

  return (
    <div>
      <TopBar title="Suppliers" subtitle="Supplier & purchase order management" />

      <div className="p-6 space-y-5">
        {/* Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Total Suppliers", value: suppliers.length.toString(), color: "#1a3a5c" },
            { label: "Total Payable", value: `KES ${totalPayable.toLocaleString()}`, color: "#ef4444" },
            { label: "Purchase Orders", value: purchases.length.toString(), color: "#f59e0b" },
            { label: "Pending Orders", value: purchases.filter((p) => p.status === "Pending").length.toString(), color: "#8b5cf6" },
          ].map((card) => (
            <div key={card.label} className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
              <p className="text-xs text-slate-500 font-medium">{card.label}</p>
              <p className="text-2xl font-bold mt-1" style={{ color: card.color }}>{card.value}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-100">
          <div className="flex border-b border-slate-100">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-3.5 text-sm font-medium transition-all border-b-2 ${
                  activeTab === tab
                    ? "border-sky-500 text-sky-700"
                    : "border-transparent text-slate-500 hover:text-slate-700"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="p-5">
            {/* Suppliers Tab */}
            {activeTab === "Suppliers" && (
              <div className="space-y-4">
                <div className="flex gap-3 items-center justify-between">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
                    <input
                      type="text"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Search suppliers..."
                      className="pl-9 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 w-64"
                    />
                  </div>
                  <button
                    onClick={openAdd}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-white rounded-lg font-medium"
                    style={{ backgroundColor: "#1a3a5c" }}
                  >
                    <Plus size={14} />
                    Add Supplier
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {filteredSuppliers.map((supplier) => (
                    <div
                      key={supplier.id}
                      className="border border-slate-200 rounded-xl p-4 hover:shadow-md transition-all cursor-pointer"
                      onClick={() => setSelectedSupplier(supplier)}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: "#e8f0f8" }}>
                            <Building2 size={18} style={{ color: "#1a3a5c" }} />
                          </div>
                          <div>
                            <h4 className="font-semibold text-slate-800 text-sm">{supplier.name}</h4>
                            <p className="text-xs text-slate-400">{supplier.kraPin}</p>
                          </div>
                        </div>
                        <div className="flex gap-1">
                          <button
                            onClick={(e) => { e.stopPropagation(); openEdit(supplier); }}
                            className="p-1.5 text-slate-400 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-colors"
                          >
                            <Edit2 size={13} />
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); setSuppliers((prev) => prev.filter((s) => s.id !== supplier.id)); }}
                            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                          <Phone size={12} />
                          {supplier.phone}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                          <Mail size={12} />
                          {supplier.email}
                        </div>
                      </div>

                      <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
                        <span className="text-xs text-slate-500">Outstanding Balance</span>
                        <span className={`text-sm font-bold ${supplier.balance > 0 ? "text-red-600" : "text-emerald-600"}`}>
                          KES {supplier.balance.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Purchase Orders Tab */}
            {activeTab === "Purchase Orders" && (
              <div className="space-y-4">
                <div className="flex gap-3 items-center justify-between">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
                    <input
                      type="text"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Search orders..."
                      className="pl-9 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 w-64"
                    />
                  </div>
                  <button
                    onClick={() => setShowPOModal(true)}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-white rounded-lg font-medium"
                    style={{ backgroundColor: "#1a3a5c" }}
                  >
                    <Plus size={14} />
                    New Purchase Order
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-slate-50">
                        {["PO Number", "Supplier", "Branch", "Items", "Total Amount", "Status", "Date"].map((h) => (
                          <th key={h} className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-4 py-3">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {filteredPurchases.map((purchase) => (
                        <tr key={purchase.id} className="hover:bg-slate-50 transition-colors">
                          <td className="px-4 py-3 text-sm font-mono text-sky-700">{purchase.id}</td>
                          <td className="px-4 py-3 text-sm font-medium text-slate-800">{purchase.supplierName}</td>
                          <td className="px-4 py-3 text-sm text-slate-600">
                            {purchase.branchId === "b1" ? "Main Branch" : purchase.branchId === "b2" ? "Westlands" : "Mombasa"}
                          </td>
                          <td className="px-4 py-3 text-sm text-slate-600">{purchase.items.length} items</td>
                          <td className="px-4 py-3 text-sm font-bold text-slate-800">KES {purchase.totalAmount.toLocaleString()}</td>
                          <td className="px-4 py-3">
                            <Badge variant={purchase.status === "Received" ? "success" : purchase.status === "Pending" ? "warning" : "info"}>
                              {purchase.status}
                            </Badge>
                          </td>
                          <td className="px-4 py-3 text-sm text-slate-600">
                            {new Date(purchase.createdAt).toLocaleDateString("en-KE")}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add/Edit Supplier Modal */}
      {showModal && editSupplier && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <h3 className="text-lg font-semibold text-slate-800">
                {editSupplier.id ? "Edit Supplier" : "Add New Supplier"}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              {[
                { label: "Company Name", key: "name", type: "text" },
                { label: "Phone Number", key: "phone", type: "tel" },
                { label: "Email Address", key: "email", type: "email" },
                { label: "KRA PIN", key: "kraPin", type: "text" },
                { label: "Address", key: "address", type: "text" },
                { label: "Opening Balance (KES)", key: "balance", type: "number" },
              ].map((field) => (
                <div key={field.key}>
                  <label className="block text-xs font-medium text-slate-600 mb-1">{field.label}</label>
                  <input
                    type={field.type}
                    value={String((editSupplier as unknown as Record<string, unknown>)[field.key] ?? "")}
                    onChange={(e) =>
                      setEditSupplier((prev) =>
                        prev ? { ...prev, [field.key]: field.type === "number" ? parseFloat(e.target.value) || 0 : e.target.value } : prev
                      )
                    }
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
              ))}
            </div>
            <div className="flex gap-3 p-6 border-t border-slate-100">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={saveSupplier}
                className="flex-1 py-2.5 rounded-xl text-white text-sm font-semibold flex items-center justify-center gap-2"
                style={{ backgroundColor: "#1a3a5c" }}
              >
                <Save size={14} />
                Save Supplier
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Purchase Order Modal */}
      {showPOModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={(e) => {
          if (e.target === e.currentTarget) setShowPOModal(false);
        }}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <h3 className="text-lg font-semibold text-slate-800">Create Purchase Order</h3>
              <button onClick={() => setShowPOModal(false)} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Supplier *</label>
                <select
                  value={newPO.supplierId}
                  onChange={(e) => setNewPO({ ...newPO, supplierId: e.target.value })}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                >
                  <option value="">Select a supplier...</option>
                  {suppliers.map((s) => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Items *</label>
                <textarea
                  value={newPO.items}
                  onChange={(e) => setNewPO({ ...newPO, items: e.target.value })}
                  placeholder="Enter items (one per line: Product name, quantity, unit price)..."
                  rows={4}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Notes</label>
                <textarea
                  value={newPO.notes}
                  onChange={(e) => setNewPO({ ...newPO, notes: e.target.value })}
                  placeholder="Additional notes..."
                  rows={2}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>
            </div>
            <div className="flex gap-3 p-6 border-t border-slate-100">
              <button
                onClick={() => setShowPOModal(false)}
                className="flex-1 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={createPurchaseOrder}
                className="flex-1 py-2.5 rounded-xl text-white text-sm font-semibold flex items-center justify-center gap-2"
                style={{ backgroundColor: "#1a3a5c" }}
              >
                <FileText size={14} />
                Create Order
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
