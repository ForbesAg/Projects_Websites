"use client";

import { useState } from "react";
import { TopBar } from "@/components/layout/TopBar";
import { Badge } from "@/components/ui/Badge";
import { sales, products, monthlyRevenueData, topProductsData, salesChartData, paymentMethodData } from "@/lib/mockData";
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, AreaChart, Area
} from "recharts";
import {
  BarChart3, TrendingUp, Package, DollarSign,
  Download, Calendar, Filter, ArrowUpRight, ArrowDownRight
} from "lucide-react";

const reportTypes = [
  "Sales Summary",
  "Inventory Status",
  "Branch Performance",
  "Payment Analysis",
];

const branchData = [
  { branch: "Main Branch", sales: 520000, transactions: 245, avgSale: 2122 },
  { branch: "Westlands", sales: 380000, transactions: 178, avgSale: 2135 },
  { branch: "Mombasa", sales: 350000, transactions: 162, avgSale: 2160 },
];

const slowMovingProducts = products
  .filter((p) => p.quantity > p.reorderLevel * 3)
  .map((p) => ({ ...p, daysInStock: Math.floor(Math.random() * 60) + 30 }));

export default function ReportsPage() {
  const [activeReport, setActiveReport] = useState("Sales Summary");
  const [dateRange, setDateRange] = useState("This Month");

  const exportToPDF = () => {
    // Open print dialog for PDF export
    window.print();
  };

  const totalSales = sales.reduce((sum, s) => sum + s.totalAmount, 0);
  const totalTransactions = sales.length;
  const avgSaleValue = totalSales / totalTransactions;
  const totalVat = sales.reduce((sum, s) => sum + s.vatAmount, 0);

  return (
    <div>
      <TopBar title="Reports & Analytics" subtitle="Data-driven business insights" />

      <div className="p-6 space-y-5">
        {/* Report Type Selector */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
          <div className="flex flex-wrap gap-3 items-center justify-between">
            <div className="flex gap-2 flex-wrap">
              {reportTypes.map((type) => (
                <button
                  key={type}
                  onClick={() => setActiveReport(type)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    activeReport === type
                      ? "text-white shadow-sm"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                  style={activeReport === type ? { backgroundColor: "#1a3a5c" } : {}}
                >
                  {type}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
              >
                <option>Today</option>
                <option>This Week</option>
                <option>This Month</option>
                <option>Last 3 Months</option>
                <option>This Year</option>
              </select>
              <button 
                onClick={exportToPDF}
                className="flex items-center gap-2 px-3 py-2 text-sm border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50"
              >
                <Download size={14} />
                Export PDF
              </button>
            </div>
          </div>
        </div>

        {/* Sales Summary Report */}
        {activeReport === "Sales Summary" && (
          <div className="space-y-5">
            {/* KPIs */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: "Total Revenue", value: `KES ${totalSales.toLocaleString()}`, change: "+12.5%", up: true },
                { label: "Transactions", value: totalTransactions.toString(), change: "+8.3%", up: true },
                { label: "Avg Sale Value", value: `KES ${avgSaleValue.toFixed(0)}`, change: "+3.8%", up: true },
                { label: "VAT Collected", value: `KES ${totalVat.toFixed(0)}`, change: "+12.5%", up: true },
              ].map((kpi) => (
                <div key={kpi.label} className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
                  <p className="text-xs text-slate-500 font-medium">{kpi.label}</p>
                  <p className="text-xl font-bold text-slate-800 mt-1">{kpi.value}</p>
                  <span className={`flex items-center gap-1 text-xs font-medium mt-1 ${kpi.up ? "text-emerald-600" : "text-red-600"}`}>
                    {kpi.up ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                    {kpi.change} vs last period
                  </span>
                </div>
              ))}
            </div>

            {/* Sales Trend */}
            <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
              <h3 className="font-semibold text-slate-800 mb-4">Daily Sales Trend</h3>
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={salesChartData}>
                  <defs>
                    <linearGradient id="salesGrad2" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#1a3a5c" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#1a3a5c" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="day" tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
                  <Tooltip formatter={(v) => [`KES ${Number(v).toLocaleString()}`, ""]} contentStyle={{ borderRadius: "8px", fontSize: "12px" }} />
                  <Area type="monotone" dataKey="sales" stroke="#1a3a5c" strokeWidth={2.5} fill="url(#salesGrad2)" name="Sales" />
                  <Area type="monotone" dataKey="target" stroke="#0ea5e9" strokeWidth={1.5} strokeDasharray="4 4" fill="none" name="Target" />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Top Products & Monthly Revenue */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
                <h3 className="font-semibold text-slate-800 mb-4">Top Products by Revenue</h3>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={topProductsData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
                    <XAxis type="number" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
                    <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: "#64748b" }} axisLine={false} tickLine={false} width={120} />
                    <Tooltip formatter={(v) => [`KES ${Number(v).toLocaleString()}`, "Revenue"]} contentStyle={{ borderRadius: "8px", fontSize: "12px" }} />
                    <Bar dataKey="revenue" fill="#1a3a5c" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
                <h3 className="font-semibold text-slate-800 mb-4">Monthly Revenue vs Expenses</h3>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={monthlyRevenueData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
                    <Tooltip formatter={(v) => [`KES ${Number(v).toLocaleString()}`, ""]} contentStyle={{ borderRadius: "8px", fontSize: "12px" }} />
                    <Legend wrapperStyle={{ fontSize: "12px" }} />
                    <Bar dataKey="revenue" fill="#1a3a5c" radius={[4, 4, 0, 0]} name="Revenue" />
                    <Bar dataKey="expenses" fill="#0ea5e9" radius={[4, 4, 0, 0]} name="Expenses" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Sales Transactions Table */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-100">
              <div className="p-5 border-b border-slate-100">
                <h3 className="font-semibold text-slate-800">Sales Transactions</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-slate-50">
                      {["Sale ID", "Date", "Cashier", "Items", "Subtotal", "VAT", "Discount", "Total", "Payment", "Status"].map((h) => (
                        <th key={h} className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-4 py-3">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {sales.map((sale) => (
                      <tr key={sale.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-4 py-3 text-sm font-mono text-sky-700">{sale.id}</td>
                        <td className="px-4 py-3 text-sm text-slate-600">{new Date(sale.createdAt).toLocaleDateString("en-KE")}</td>
                        <td className="px-4 py-3 text-sm text-slate-700">{sale.cashier}</td>
                        <td className="px-4 py-3 text-sm text-slate-600">{sale.items.length}</td>
                        <td className="px-4 py-3 text-sm text-slate-700">KES {sale.totalAmount.toLocaleString()}</td>
                        <td className="px-4 py-3 text-sm text-slate-600">KES {sale.vatAmount.toFixed(2)}</td>
                        <td className="px-4 py-3 text-sm text-emerald-600">KES {sale.discountAmount}</td>
                        <td className="px-4 py-3 text-sm font-bold text-slate-800">KES {sale.totalAmount.toLocaleString()}</td>
                        <td className="px-4 py-3">
                          <Badge variant={sale.paymentMethod === "Cash" ? "default" : sale.paymentMethod === "M-Pesa" ? "success" : "info"}>
                            {sale.paymentMethod}
                          </Badge>
                        </td>
                        <td className="px-4 py-3">
                          <Badge variant="success">{sale.paymentStatus}</Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Inventory Status Report */}
        {activeReport === "Inventory Status" && (
          <div className="space-y-5">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: "Total SKUs", value: products.length.toString() },
                { label: "Total Units", value: products.reduce((s, p) => s + p.quantity, 0).toString() },
                { label: "Inventory Value", value: `KES ${products.reduce((s, p) => s + p.quantity * p.costPrice, 0).toLocaleString()}` },
                { label: "Low Stock Items", value: products.filter((p) => p.quantity <= p.reorderLevel).length.toString() },
              ].map((kpi) => (
                <div key={kpi.label} className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
                  <p className="text-xs text-slate-500 font-medium">{kpi.label}</p>
                  <p className="text-xl font-bold text-slate-800 mt-1">{kpi.value}</p>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-100">
              <div className="p-5 border-b border-slate-100">
                <h3 className="font-semibold text-slate-800">Stock Status Report</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-slate-50">
                      {["Product", "SKU", "Category", "Cost Price", "Selling Price", "Stock", "Reorder Level", "Stock Value", "Status"].map((h) => (
                        <th key={h} className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-4 py-3">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {products.map((product) => {
                      const isLow = product.quantity <= product.reorderLevel;
                      const isOut = product.quantity === 0;
                      return (
                        <tr key={product.id} className="hover:bg-slate-50 transition-colors">
                          <td className="px-4 py-3 text-sm font-medium text-slate-800">{product.name}</td>
                          <td className="px-4 py-3 text-sm font-mono text-slate-600">{product.sku}</td>
                          <td className="px-4 py-3 text-sm text-slate-600">{product.category}</td>
                          <td className="px-4 py-3 text-sm text-slate-700">KES {product.costPrice}</td>
                          <td className="px-4 py-3 text-sm text-slate-700">KES {product.sellingPrice}</td>
                          <td className="px-4 py-3 text-sm font-bold" style={{ color: isOut ? "#ef4444" : isLow ? "#f59e0b" : "#10b981" }}>
                            {product.quantity}
                          </td>
                          <td className="px-4 py-3 text-sm text-slate-600">{product.reorderLevel}</td>
                          <td className="px-4 py-3 text-sm font-medium text-slate-800">
                            KES {(product.quantity * product.costPrice).toLocaleString()}
                          </td>
                          <td className="px-4 py-3">
                            <Badge variant={isOut ? "danger" : isLow ? "warning" : "success"}>
                              {isOut ? "Out of Stock" : isLow ? "Low Stock" : "In Stock"}
                            </Badge>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Branch Performance */}
        {activeReport === "Branch Performance" && (
          <div className="space-y-5">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {branchData.map((branch) => (
                <div key={branch.branch} className="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
                  <h4 className="font-semibold text-slate-800 mb-4">{branch.branch}</h4>
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-slate-500">Total Sales</p>
                      <p className="text-2xl font-bold" style={{ color: "#1a3a5c" }}>KES {branch.sales.toLocaleString()}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-slate-50 rounded-lg p-3">
                        <p className="text-xs text-slate-500">Transactions</p>
                        <p className="text-lg font-bold text-slate-800">{branch.transactions}</p>
                      </div>
                      <div className="bg-slate-50 rounded-lg p-3">
                        <p className="text-xs text-slate-500">Avg Sale</p>
                        <p className="text-lg font-bold text-slate-800">KES {branch.avgSale.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
              <h3 className="font-semibold text-slate-800 mb-4">Branch Sales Comparison</h3>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={branchData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="branch" tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
                  <Tooltip formatter={(v) => [`KES ${Number(v).toLocaleString()}`, ""]} contentStyle={{ borderRadius: "8px", fontSize: "12px" }} />
                  <Bar dataKey="sales" fill="#1a3a5c" radius={[6, 6, 0, 0]} name="Sales" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Payment Analysis */}
        {activeReport === "Payment Analysis" && (
          <div className="space-y-5">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
                <h3 className="font-semibold text-slate-800 mb-4">Payment Method Distribution</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={paymentMethodData}
                      cx="50%"
                      cy="50%"
                      outerRadius={90}
                      paddingAngle={3}
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}%`}
                      labelLine={false}
                    >
                      {paymentMethodData.map((entry, index) => (
                        <Cell key={index} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(v) => [`${v}%`, ""]} contentStyle={{ borderRadius: "8px", fontSize: "12px" }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
                <h3 className="font-semibold text-slate-800 mb-4">Payment Method Summary</h3>
                <div className="space-y-4">
                  {[
                    { method: "Cash", count: 12, amount: 28500, pct: 45, color: "#1a3a5c" },
                    { method: "M-Pesa", count: 9, amount: 24150, pct: 38, color: "#0ea5e9" },
                    { method: "Card", count: 4, amount: 10800, pct: 17, color: "#f59e0b" },
                  ].map((item) => (
                    <div key={item.method} className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                          <span className="text-sm font-medium text-slate-700">{item.method}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-sm font-bold text-slate-800">KES {item.amount.toLocaleString()}</span>
                          <span className="text-xs text-slate-400 ml-2">({item.count} txns)</span>
                        </div>
                      </div>
                      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${item.pct}%`, backgroundColor: item.color }}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
