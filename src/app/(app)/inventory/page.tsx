"use client";

import { useState, useEffect } from "react";
import { TopBar } from "@/components/layout/TopBar";
import { Badge } from "@/components/ui/Badge";
import type { Product } from "@/lib/types";
import {
  Search, Plus, Edit2, Trash2, AlertTriangle, Package,
  Download, Upload, X, Save, ChevronUp, ChevronDown, RefreshCw
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";

interface DBProduct {
  id: number;
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
  expiryDate: string | null;
}

export default function InventoryPage() {
  const { user } = useAuth();
  const [products, setProducts] = useState<DBProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");
  const [filterStock, setFilterStock] = useState("All");
  const [showModal, setShowModal] = useState(false);
  const [editProduct, setEditProduct] = useState<Partial<DBProduct> | null>(null);
  const [sortField, setSortField] = useState<keyof DBProduct>("name");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const canEdit = user?.role === "Admin" || user?.role === "Manager";

  const fetchProducts = async () => {
    try {
      const res = await fetch("/api/products");
      if (res.ok) {
        const data = await res.json();
        setProducts(data.products);
      }
    } catch (err) {
      console.error("Failed to fetch products:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const categories = ["All", ...Array.from(new Set(products.map((p) => p.category)))];

  const filtered = products
    .filter((p) => {
      const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase()) || p.barcode.includes(search);
      const matchCat = filterCategory === "All" || p.category === filterCategory;
      const matchStock =
        filterStock === "All" ||
        (filterStock === "Low" && p.quantity <= p.reorderLevel && p.quantity > 0) ||
        (filterStock === "Out" && p.quantity === 0) ||
        (filterStock === "OK" && p.quantity > p.reorderLevel);
      return matchSearch && matchCat && matchStock;
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

  const totalValue = products.reduce((sum, p) => sum + p.quantity * p.costPrice, 0);
  const lowStockCount = products.filter((p) => p.quantity <= p.reorderLevel && p.quantity > 0).length;
  const outOfStockCount = products.filter((p) => p.quantity === 0).length;

  const handleSort = (field: keyof DBProduct) => {
    if (sortField === field) setSortDir(sortDir === "asc" ? "desc" : "asc");
    else { setSortField(field); setSortDir("asc"); }
  };

  const SortIcon = ({ field }: { field: keyof DBProduct }) => {
    if (sortField !== field) return <ChevronUp size={12} className="text-slate-300" />;
    return sortDir === "asc" ? <ChevronUp size={12} className="text-slate-600" /> : <ChevronDown size={12} className="text-slate-600" />;
  };

  const openAdd = () => {
    setEditProduct({
      name: "", sku: "", barcode: "", category: "General", costPrice: 0,
      sellingPrice: 0, vatRate: 16, trackInventory: true, quantity: 0,
      reorderLevel: 10, supplier: ""
    });
    setError("");
    setShowModal(true);
  };

  const openEdit = (product: DBProduct) => {
    if (!canEdit) return;
    setEditProduct({ ...product });
    setError("");
    setShowModal(true);
  };

  const saveProduct = async () => {
    if (!editProduct) return;
    setSaving(true);
    setError("");

    try {
      let res;
      if (!editProduct.id) {
        res = await fetch("/api/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(editProduct),
        });
      } else {
        res = await fetch(`/api/products/${editProduct.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(editProduct),
        });
      }

      const data = await res.json();
      if (res.ok) {
        await fetchProducts();
        setShowModal(false);
        setEditProduct(null);
      } else {
        setError(data.error || "Failed to save product");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const deleteProduct = async (id: number) => {
    if (!confirm("Deactivate this product?")) return;
    try {
      const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
      if (res.ok) {
        await fetchProducts();
      }
    } catch (err) {
      console.error("Failed to delete product:", err);
    }
  };

  const getStockStatus = (product: DBProduct) => {
    if (product.quantity === 0) return { label: "Out of Stock", variant: "danger" as const };
    if (product.quantity <= product.reorderLevel) return { label: "Low Stock", variant: "warning" as const };
    return { label: "In Stock", variant: "success" as const };
  };

  return (
    <div>
      <TopBar title="Inventory Management" subtitle="Real-time stock tracking" />

      <div className="p-6 space-y-5">
        {/* Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Total Products", value: products.length.toString(), color: "#1a3a5c", bg: "#e8f0f8" },
            { label: "Inventory Value", value: `KES ${totalValue.toLocaleString()}`, color: "#10b981", bg: "#d1fae5" },
            { label: "Low Stock Items", value: lowStockCount.toString(), color: "#f59e0b", bg: "#fef3c7" },
            { label: "Out of Stock", value: outOfStockCount.toString(), color: "#ef4444", bg: "#fee2e2" },
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
                  placeholder="Search products..."
                  className="pl-9 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 w-56"
                />
              </div>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
              >
                {categories.map((c) => <option key={c}>{c}</option>)}
              </select>
              <select
                value={filterStock}
                onChange={(e) => setFilterStock(e.target.value)}
                className="px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
              >
                <option value="All">All Stock</option>
                <option value="OK">In Stock</option>
                <option value="Low">Low Stock</option>
                <option value="Out">Out of Stock</option>
              </select>
            </div>
            <div className="flex gap-2">
              <button
                onClick={fetchProducts}
                className="flex items-center gap-2 px-3 py-2 text-sm border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50"
              >
                <RefreshCw size={14} />
              </button>
              <button className="flex items-center gap-2 px-3 py-2 text-sm border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50">
                <Download size={14} />
                Export
              </button>
              {canEdit && (
                <button
                  onClick={openAdd}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-white rounded-lg font-medium"
                  style={{ backgroundColor: "#1a3a5c" }}
                >
                  <Plus size={14} />
                  Add Product
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Products Table */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
          {loading ? (
            <div className="text-center py-12 text-slate-400">Loading products...</div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100">
                      {[
                        { label: "Product", field: "name" as keyof DBProduct },
                        { label: "SKU", field: "sku" as keyof DBProduct },
                        { label: "Category", field: "category" as keyof DBProduct },
                        { label: "Cost", field: "costPrice" as keyof DBProduct },
                        { label: "Price", field: "sellingPrice" as keyof DBProduct },
                        { label: "Stock", field: "quantity" as keyof DBProduct },
                        { label: "Reorder", field: "reorderLevel" as keyof DBProduct },
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
                    {filtered.map((product) => {
                      const status = getStockStatus(product);
                      return (
                        <tr key={product.id} className="hover:bg-slate-50 transition-colors">
                          <td className="px-4 py-3">
                            <div>
                              <p className="text-sm font-medium text-slate-800">{product.name}</p>
                              <p className="text-xs text-slate-400">{product.barcode}</p>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-sm font-mono text-slate-600">{product.sku}</td>
                          <td className="px-4 py-3 text-sm text-slate-600">{product.category}</td>
                          <td className="px-4 py-3 text-sm text-slate-700">KES {product.costPrice}</td>
                          <td className="px-4 py-3 text-sm font-semibold text-slate-800">KES {product.sellingPrice}</td>
                          <td className="px-4 py-3">
                            <span className={`text-sm font-bold ${product.quantity === 0 ? "text-red-600" : product.quantity <= product.reorderLevel ? "text-amber-600" : "text-slate-800"}`}>
                              {product.quantity}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm text-slate-600">{product.reorderLevel}</td>
                          <td className="px-4 py-3">
                            <Badge variant={status.variant}>{status.label}</Badge>
                          </td>
                          <td className="px-4 py-3">
                            {canEdit && (
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => openEdit(product)}
                                  className="p-1.5 text-slate-400 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-colors"
                                >
                                  <Edit2 size={14} />
                                </button>
                                <button
                                  onClick={() => deleteProduct(product.id)}
                                  className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <div className="px-4 py-3 border-t border-slate-100 flex items-center justify-between">
                <p className="text-xs text-slate-500">Showing {filtered.length} of {products.length} products</p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showModal && editProduct && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <h3 className="text-lg font-semibold text-slate-800">
                {editProduct.id ? "Edit Product" : "Add New Product"}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">{error}</div>
              )}
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: "Product Name", key: "name", type: "text", full: true },
                  { label: "SKU", key: "sku", type: "text" },
                  { label: "Barcode", key: "barcode", type: "text" },
                  { label: "Category", key: "category", type: "text" },
                  { label: "Supplier", key: "supplier", type: "text" },
                  { label: "Cost Price (KES)", key: "costPrice", type: "number" },
                  { label: "Selling Price (KES)", key: "sellingPrice", type: "number" },
                  { label: "VAT Rate (%)", key: "vatRate", type: "number" },
                  { label: "Current Stock", key: "quantity", type: "number" },
                  { label: "Reorder Level", key: "reorderLevel", type: "number" },
                  { label: "Expiry Date", key: "expiryDate", type: "date" },
                ].map((field) => (
                  <div key={field.key} className={field.full ? "col-span-2" : ""}>
                    <label className="block text-xs font-medium text-slate-600 mb-1">{field.label}</label>
                    <input
                      type={field.type}
                      value={String(editProduct[field.key as keyof DBProduct] ?? "")}
                      onChange={(e) =>
                        setEditProduct((prev) =>
                          prev ? { ...prev, [field.key]: field.type === "number" ? parseFloat(e.target.value) || 0 : e.target.value } : prev
                        )
                      }
                      className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                    />
                  </div>
                ))}
              </div>
            </div>
            <div className="flex gap-3 p-6 border-t border-slate-100">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={saveProduct}
                disabled={saving}
                className="flex-1 py-2.5 rounded-xl text-white text-sm font-semibold flex items-center justify-center gap-2 disabled:opacity-70"
                style={{ backgroundColor: "#1a3a5c" }}
              >
                <Save size={14} />
                {saving ? "Saving..." : "Save Product"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
