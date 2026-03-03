"use client";

import { TopBar } from "@/components/layout/TopBar";
import { Badge } from "@/components/ui/Badge";
import {
  TrendingUp, TrendingDown, ShoppingCart, Package,
  DollarSign, AlertTriangle, ArrowUpRight, ArrowDownRight,
  Users, RefreshCw
} from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from "recharts";
import { salesChartData, monthlyRevenueData, topProductsData, paymentMethodData, products, sales } from "@/lib/mockData";

const kpiCards = [
  {
    title: "Today's Sales",
    value: "KES 6,955",
    change: "+12.5%",
    trend: "up",
    icon: ShoppingCart,
    color: "#1a3a5c",
    bg: "#e8f0f8",
    sub: "23 transactions",
  },
  {
    title: "Monthly Revenue",
    value: "KES 1,250,000",
    change: "+13.6%",
    trend: "up",
    icon: DollarSign,
    color: "#10b981",
    bg: "#d1fae5",
    sub: "vs last month",
  },
  {
    title: "Inventory Value",
    value: "KES 485,200",
    change: "-2.1%",
    trend: "down",
    icon: Package,
    color: "#f59e0b",
    bg: "#fef3c7",
    sub: "10 products tracked",
  },
  {
    title: "Active Customers",
    value: "1,284",
    change: "+8.3%",
    trend: "up",
    icon: Users,
    color: "#8b5cf6",
    bg: "#ede9fe",
    sub: "This month",
  },
];

const lowStockProducts = products.filter((p) => p.quantity <= p.reorderLevel);
const recentSales = sales.slice(0, 4);

export default function DashboardPage() {
  return (
    <div>
      <TopBar title="Dashboard" subtitle="Welcome back, Admin User" />

      <div className="p-6 space-y-6">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {kpiCards.map((card) => {
            const Icon = card.icon;
            const isUp = card.trend === "up";
            return (
              <div key={card.title} className="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
                <div className="flex items-start justify-between mb-4">
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: card.bg }}
                  >
                    <Icon size={20} style={{ color: card.color }} />
                  </div>
                  <span
                    className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full ${
                      isUp ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"
                    }`}
                  >
                    {isUp ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                    {card.change}
                  </span>
                </div>
                <p className="text-2xl font-bold text-slate-800">{card.value}</p>
                <p className="text-sm font-medium text-slate-600 mt-0.5">{card.title}</p>
                <p className="text-xs text-slate-400 mt-1">{card.sub}</p>
              </div>
            );
          })}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
          {/* Weekly Sales Chart */}
          <div className="xl:col-span-2 bg-white rounded-xl p-5 shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="font-semibold text-slate-800">Weekly Sales Performance</h3>
                <p className="text-xs text-slate-500 mt-0.5">Sales vs Target this week</p>
              </div>
              <button className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-700 px-3 py-1.5 border border-slate-200 rounded-lg">
                <RefreshCw size={12} />
                Refresh
              </button>
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={salesChartData}>
                <defs>
                  <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1a3a5c" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#1a3a5c" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="targetGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="day" tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
                <Tooltip
                  formatter={(value) => [`KES ${Number(value).toLocaleString()}`, ""]}
                  contentStyle={{ borderRadius: "8px", border: "1px solid #e2e8f0", fontSize: "12px" }}
                />
                <Area type="monotone" dataKey="target" stroke="#0ea5e9" strokeWidth={1.5} strokeDasharray="4 4" fill="url(#targetGrad)" name="Target" />
                <Area type="monotone" dataKey="sales" stroke="#1a3a5c" strokeWidth={2} fill="url(#salesGrad)" name="Sales" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Payment Methods */}
          <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
            <div className="mb-5">
              <h3 className="font-semibold text-slate-800">Payment Methods</h3>
              <p className="text-xs text-slate-500 mt-0.5">This month breakdown</p>
            </div>
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie
                  data={paymentMethodData}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={70}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {paymentMethodData.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(v) => [`${v}%`, ""]} contentStyle={{ borderRadius: "8px", fontSize: "12px" }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2 mt-2">
              {paymentMethodData.map((item) => (
                <div key={item.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }}></div>
                    <span className="text-sm text-slate-600">{item.name}</span>
                  </div>
                  <span className="text-sm font-semibold text-slate-800">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
          {/* Monthly Revenue */}
          <div className="xl:col-span-2 bg-white rounded-xl p-5 shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="font-semibold text-slate-800">Revenue vs Expenses</h3>
                <p className="text-xs text-slate-500 mt-0.5">Last 7 months</p>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={monthlyRevenueData} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
                <Tooltip
                  formatter={(value) => [`KES ${Number(value).toLocaleString()}`, ""]}
                  contentStyle={{ borderRadius: "8px", border: "1px solid #e2e8f0", fontSize: "12px" }}
                />
                <Legend wrapperStyle={{ fontSize: "12px" }} />
                <Bar dataKey="revenue" fill="#1a3a5c" radius={[4, 4, 0, 0]} name="Revenue" />
                <Bar dataKey="expenses" fill="#0ea5e9" radius={[4, 4, 0, 0]} name="Expenses" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Low Stock Alerts */}
          <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-semibold text-slate-800">Stock Alerts</h3>
                <p className="text-xs text-slate-500 mt-0.5">Items needing reorder</p>
              </div>
              <Badge variant="danger">{lowStockProducts.length} items</Badge>
            </div>
            <div className="space-y-3">
              {lowStockProducts.map((product) => (
                <div key={product.id} className="flex items-center gap-3 p-3 bg-red-50 rounded-lg border border-red-100">
                  <AlertTriangle size={16} className="text-red-500 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-800 truncate">{product.name}</p>
                    <p className="text-xs text-slate-500">
                      Stock: <span className="text-red-600 font-semibold">{product.quantity}</span> / Min: {product.reorderLevel}
                    </p>
                  </div>
                </div>
              ))}
              {lowStockProducts.length === 0 && (
                <p className="text-sm text-slate-500 text-center py-4">All stock levels are healthy ✓</p>
              )}
            </div>
          </div>
        </div>

        {/* Recent Sales */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-100">
          <div className="flex items-center justify-between p-5 border-b border-slate-100">
            <div>
              <h3 className="font-semibold text-slate-800">Recent Transactions</h3>
              <p className="text-xs text-slate-500 mt-0.5">Latest sales across all branches</p>
            </div>
            <a href="/pos" className="text-sm font-medium text-sky-600 hover:text-sky-700">View all →</a>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50">
                  <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-5 py-3">Sale ID</th>
                  <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-5 py-3">Cashier</th>
                  <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-5 py-3">Branch</th>
                  <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-5 py-3">Amount</th>
                  <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-5 py-3">Payment</th>
                  <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-5 py-3">Status</th>
                  <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-5 py-3">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {recentSales.map((sale) => (
                  <tr key={sale.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-5 py-3.5 text-sm font-mono font-medium text-sky-700">{sale.id}</td>
                    <td className="px-5 py-3.5 text-sm text-slate-700">{sale.cashier}</td>
                    <td className="px-5 py-3.5 text-sm text-slate-600">
                      {sale.branchId === "b1" ? "Main Branch" : sale.branchId === "b2" ? "Westlands" : "Mombasa"}
                    </td>
                    <td className="px-5 py-3.5 text-sm font-semibold text-slate-800">
                      KES {sale.totalAmount.toLocaleString()}
                    </td>
                    <td className="px-5 py-3.5">
                      <Badge variant={sale.paymentMethod === "Cash" ? "default" : sale.paymentMethod === "M-Pesa" ? "success" : "info"}>
                        {sale.paymentMethod}
                      </Badge>
                    </td>
                    <td className="px-5 py-3.5">
                      <Badge variant="success">{sale.paymentStatus}</Badge>
                    </td>
                    <td className="px-5 py-3.5 text-xs text-slate-500">
                      {new Date(sale.createdAt).toLocaleTimeString("en-KE", { hour: "2-digit", minute: "2-digit" })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-semibold text-slate-800">Top Selling Products</h3>
              <p className="text-xs text-slate-500 mt-0.5">This month</p>
            </div>
          </div>
          <div className="space-y-3">
            {topProductsData.map((product, index) => {
              const maxRevenue = Math.max(...topProductsData.map((p) => p.revenue));
              const pct = (product.revenue / maxRevenue) * 100;
              return (
                <div key={product.name} className="flex items-center gap-4">
                  <span className="text-sm font-bold text-slate-400 w-5">{index + 1}</span>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-slate-700">{product.name}</span>
                      <span className="text-sm font-semibold text-slate-800">KES {product.revenue.toLocaleString()}</span>
                    </div>
                    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{ width: `${pct}%`, backgroundColor: index === 0 ? "#1a3a5c" : index === 1 ? "#0ea5e9" : "#f59e0b" }}
                      ></div>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">{product.sales} units sold</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
