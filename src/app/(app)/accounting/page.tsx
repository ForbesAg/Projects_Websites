"use client";

import { useState } from "react";
import { TopBar } from "@/components/layout/TopBar";
import { Badge } from "@/components/ui/Badge";
import { accountingEntries, expenses, sales } from "@/lib/mockData";
import {
  BookOpen, TrendingUp, TrendingDown, DollarSign,
  Plus, Search, Download, Filter, X, Save,
  CreditCard, Receipt, FileText, BarChart2
} from "lucide-react";

const tabs = ["Journal Entries", "Expenses", "P&L Statement", "Balance Sheet"];

const plData = {
  revenue: {
    sales: 1250000,
    otherIncome: 15000,
  },
  cogs: {
    purchases: 780000,
    stockAdjustments: 12000,
  },
  expenses: {
    rent: 45000,
    salaries: 120000,
    utilities: 8500,
    transport: 3500,
    maintenance: 5000,
    marketing: 12000,
    other: 8000,
  },
};

const totalRevenue = Object.values(plData.revenue).reduce((a, b) => a + b, 0);
const totalCOGS = Object.values(plData.cogs).reduce((a, b) => a + b, 0);
const grossProfit = totalRevenue - totalCOGS;
const totalExpenses = Object.values(plData.expenses).reduce((a, b) => a + b, 0);
const netProfit = grossProfit - totalExpenses;

export default function AccountingPage() {
  const [activeTab, setActiveTab] = useState("Journal Entries");
  const [search, setSearch] = useState("");
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [newExpense, setNewExpense] = useState({ date: "", category: "", description: "", amount: "", paidBy: "" });

  const filteredEntries = accountingEntries.filter(
    (e) =>
      e.description.toLowerCase().includes(search.toLowerCase()) ||
      e.reference.toLowerCase().includes(search.toLowerCase()) ||
      e.transactionType.toLowerCase().includes(search.toLowerCase())
  );

  const filteredExpenses = expenses.filter(
    (e) =>
      e.description.toLowerCase().includes(search.toLowerCase()) ||
      e.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <TopBar title="Accounting" subtitle="Integrated financial management" />

      <div className="p-6 space-y-5">
        {/* Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Total Revenue", value: `KES ${totalRevenue.toLocaleString()}`, icon: TrendingUp, color: "#10b981", bg: "#d1fae5" },
            { label: "Total Expenses", value: `KES ${totalExpenses.toLocaleString()}`, icon: TrendingDown, color: "#ef4444", bg: "#fee2e2" },
            { label: "Gross Profit", value: `KES ${grossProfit.toLocaleString()}`, icon: DollarSign, color: "#1a3a5c", bg: "#e8f0f8" },
            { label: "Net Profit", value: `KES ${netProfit.toLocaleString()}`, icon: BarChart2, color: "#8b5cf6", bg: "#ede9fe" },
          ].map((card) => {
            const Icon = card.icon;
            return (
              <div key={card.label} className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: card.bg }}>
                    <Icon size={18} style={{ color: card.color }} />
                  </div>
                  <p className="text-xs text-slate-500 font-medium">{card.label}</p>
                </div>
                <p className="text-xl font-bold" style={{ color: card.color }}>{card.value}</p>
              </div>
            );
          })}
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-100">
          <div className="flex border-b border-slate-100 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-shrink-0 px-5 py-3.5 text-sm font-medium transition-all border-b-2 ${
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
            {/* Journal Entries Tab */}
            {activeTab === "Journal Entries" && (
              <div className="space-y-4">
                <div className="flex gap-3 items-center justify-between">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
                    <input
                      type="text"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Search entries..."
                      className="pl-9 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 w-64"
                    />
                  </div>
                  <button className="flex items-center gap-2 px-3 py-2 text-sm border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50">
                    <Download size={14} />
                    Export
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-slate-50">
                        <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-4 py-3">Date</th>
                        <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-4 py-3">Description</th>
                        <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-4 py-3">Type</th>
                        <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-4 py-3">Debit Account</th>
                        <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-4 py-3">Credit Account</th>
                        <th className="text-right text-xs font-semibold text-slate-500 uppercase tracking-wider px-4 py-3">Amount</th>
                        <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-4 py-3">Reference</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {filteredEntries.map((entry) => (
                        <tr key={entry.id} className="hover:bg-slate-50 transition-colors">
                          <td className="px-4 py-3 text-sm text-slate-600">{entry.date}</td>
                          <td className="px-4 py-3 text-sm text-slate-800">{entry.description}</td>
                          <td className="px-4 py-3">
                            <Badge variant={entry.transactionType === "Sale" ? "success" : entry.transactionType === "Purchase" ? "warning" : "info"}>
                              {entry.transactionType}
                            </Badge>
                          </td>
                          <td className="px-4 py-3 text-sm text-emerald-700 font-medium">{entry.debitAccount}</td>
                          <td className="px-4 py-3 text-sm text-red-600 font-medium">{entry.creditAccount}</td>
                          <td className="px-4 py-3 text-sm font-semibold text-slate-800 text-right">
                            KES {entry.amount.toLocaleString()}
                          </td>
                          <td className="px-4 py-3 text-xs font-mono text-sky-700">{entry.reference}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Expenses Tab */}
            {activeTab === "Expenses" && (
              <div className="space-y-4">
                <div className="flex gap-3 items-center justify-between">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
                    <input
                      type="text"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Search expenses..."
                      className="pl-9 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 w-64"
                    />
                  </div>
                  <button
                    onClick={() => setShowExpenseModal(true)}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-white rounded-lg font-medium"
                    style={{ backgroundColor: "#1a3a5c" }}
                  >
                    <Plus size={14} />
                    Add Expense
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-slate-50">
                        <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-4 py-3">Date</th>
                        <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-4 py-3">Category</th>
                        <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-4 py-3">Description</th>
                        <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-4 py-3">Branch</th>
                        <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-4 py-3">Paid By</th>
                        <th className="text-right text-xs font-semibold text-slate-500 uppercase tracking-wider px-4 py-3">Amount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {filteredExpenses.map((expense) => (
                        <tr key={expense.id} className="hover:bg-slate-50 transition-colors">
                          <td className="px-4 py-3 text-sm text-slate-600">{expense.date}</td>
                          <td className="px-4 py-3">
                            <Badge variant="default">{expense.category}</Badge>
                          </td>
                          <td className="px-4 py-3 text-sm text-slate-800">{expense.description}</td>
                          <td className="px-4 py-3 text-sm text-slate-600">{expense.branch}</td>
                          <td className="px-4 py-3 text-sm text-slate-600">{expense.paidBy}</td>
                          <td className="px-4 py-3 text-sm font-semibold text-red-600 text-right">
                            KES {expense.amount.toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="bg-slate-50 border-t-2 border-slate-200">
                        <td colSpan={5} className="px-4 py-3 text-sm font-bold text-slate-700">Total Expenses</td>
                        <td className="px-4 py-3 text-sm font-bold text-red-600 text-right">
                          KES {filteredExpenses.reduce((sum, e) => sum + e.amount, 0).toLocaleString()}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            )}

            {/* P&L Statement */}
            {activeTab === "P&L Statement" && (
              <div className="max-w-2xl mx-auto">
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold text-slate-800">Profit & Loss Statement</h3>
                  <p className="text-sm text-slate-500">Period: March 2026</p>
                </div>

                <div className="space-y-4">
                  {/* Revenue */}
                  <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-100">
                    <h4 className="font-semibold text-emerald-800 mb-3 flex items-center gap-2">
                      <TrendingUp size={16} />
                      Revenue
                    </h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-600">Sales Revenue</span>
                        <span className="font-medium">KES {plData.revenue.sales.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-600">Other Income</span>
                        <span className="font-medium">KES {plData.revenue.otherIncome.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between font-bold text-emerald-800 pt-2 border-t border-emerald-200">
                        <span>Total Revenue</span>
                        <span>KES {totalRevenue.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  {/* COGS */}
                  <div className="bg-orange-50 rounded-xl p-4 border border-orange-100">
                    <h4 className="font-semibold text-orange-800 mb-3">Cost of Goods Sold</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-600">Purchases</span>
                        <span className="font-medium">KES {plData.cogs.purchases.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-600">Stock Adjustments</span>
                        <span className="font-medium">KES {plData.cogs.stockAdjustments.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between font-bold text-orange-800 pt-2 border-t border-orange-200">
                        <span>Total COGS</span>
                        <span>KES {totalCOGS.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  {/* Gross Profit */}
                  <div className="bg-sky-50 rounded-xl p-4 border border-sky-200">
                    <div className="flex justify-between font-bold text-sky-800 text-lg">
                      <span>Gross Profit</span>
                      <span>KES {grossProfit.toLocaleString()}</span>
                    </div>
                    <p className="text-xs text-sky-600 mt-1">Margin: {((grossProfit / totalRevenue) * 100).toFixed(1)}%</p>
                  </div>

                  {/* Operating Expenses */}
                  <div className="bg-red-50 rounded-xl p-4 border border-red-100">
                    <h4 className="font-semibold text-red-800 mb-3 flex items-center gap-2">
                      <TrendingDown size={16} />
                      Operating Expenses
                    </h4>
                    <div className="space-y-2">
                      {Object.entries(plData.expenses).map(([key, value]) => (
                        <div key={key} className="flex justify-between text-sm">
                          <span className="text-slate-600 capitalize">{key}</span>
                          <span className="font-medium">KES {value.toLocaleString()}</span>
                        </div>
                      ))}
                      <div className="flex justify-between font-bold text-red-800 pt-2 border-t border-red-200">
                        <span>Total Expenses</span>
                        <span>KES {totalExpenses.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  {/* Net Profit */}
                  <div className={`rounded-xl p-5 border-2 ${netProfit >= 0 ? "bg-emerald-50 border-emerald-300" : "bg-red-50 border-red-300"}`}>
                    <div className={`flex justify-between font-bold text-xl ${netProfit >= 0 ? "text-emerald-800" : "text-red-800"}`}>
                      <span>Net Profit</span>
                      <span>KES {netProfit.toLocaleString()}</span>
                    </div>
                    <p className={`text-sm mt-1 ${netProfit >= 0 ? "text-emerald-600" : "text-red-600"}`}>
                      Net Margin: {((netProfit / totalRevenue) * 100).toFixed(1)}%
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Balance Sheet */}
            {activeTab === "Balance Sheet" && (
              <div className="max-w-2xl mx-auto">
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold text-slate-800">Balance Sheet</h3>
                  <p className="text-sm text-slate-500">As at 3 March 2026</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Assets */}
                  <div className="bg-white rounded-xl p-4 border border-slate-200">
                    <h4 className="font-bold text-slate-800 mb-4 pb-2 border-b border-slate-100">ASSETS</h4>
                    <div className="space-y-3">
                      <div>
                        <p className="text-xs font-semibold text-slate-500 uppercase mb-2">Current Assets</p>
                        {[
                          { label: "Cash & Bank", value: 485000 },
                          { label: "M-Pesa Float", value: 125000 },
                          { label: "Accounts Receivable", value: 78000 },
                          { label: "Inventory", value: 485200 },
                        ].map((item) => (
                          <div key={item.label} className="flex justify-between text-sm py-1">
                            <span className="text-slate-600">{item.label}</span>
                            <span className="font-medium">KES {item.value.toLocaleString()}</span>
                          </div>
                        ))}
                      </div>
                      <div className="pt-2 border-t border-slate-100">
                        <p className="text-xs font-semibold text-slate-500 uppercase mb-2">Fixed Assets</p>
                        {[
                          { label: "Equipment", value: 250000 },
                          { label: "Furniture", value: 85000 },
                        ].map((item) => (
                          <div key={item.label} className="flex justify-between text-sm py-1">
                            <span className="text-slate-600">{item.label}</span>
                            <span className="font-medium">KES {item.value.toLocaleString()}</span>
                          </div>
                        ))}
                      </div>
                      <div className="flex justify-between font-bold text-slate-800 pt-2 border-t-2 border-slate-200">
                        <span>Total Assets</span>
                        <span>KES 1,508,200</span>
                      </div>
                    </div>
                  </div>

                  {/* Liabilities & Equity */}
                  <div className="bg-white rounded-xl p-4 border border-slate-200">
                    <h4 className="font-bold text-slate-800 mb-4 pb-2 border-b border-slate-100">LIABILITIES & EQUITY</h4>
                    <div className="space-y-3">
                      <div>
                        <p className="text-xs font-semibold text-slate-500 uppercase mb-2">Current Liabilities</p>
                        {[
                          { label: "Accounts Payable", value: 618000 },
                          { label: "VAT Payable", value: 45200 },
                          { label: "Accrued Expenses", value: 32000 },
                        ].map((item) => (
                          <div key={item.label} className="flex justify-between text-sm py-1">
                            <span className="text-slate-600">{item.label}</span>
                            <span className="font-medium">KES {item.value.toLocaleString()}</span>
                          </div>
                        ))}
                      </div>
                      <div className="pt-2 border-t border-slate-100">
                        <p className="text-xs font-semibold text-slate-500 uppercase mb-2">Equity</p>
                        {[
                          { label: "Share Capital", value: 500000 },
                          { label: "Retained Earnings", value: 313000 },
                        ].map((item) => (
                          <div key={item.label} className="flex justify-between text-sm py-1">
                            <span className="text-slate-600">{item.label}</span>
                            <span className="font-medium">KES {item.value.toLocaleString()}</span>
                          </div>
                        ))}
                      </div>
                      <div className="flex justify-between font-bold text-slate-800 pt-2 border-t-2 border-slate-200">
                        <span>Total L&E</span>
                        <span>KES 1,508,200</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Expense Modal */}
      {showExpenseModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <h3 className="text-lg font-semibold text-slate-800">Add Expense</h3>
              <button onClick={() => setShowExpenseModal(false)} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              {[
                { label: "Date", key: "date", type: "date" },
                { label: "Category", key: "category", type: "text" },
                { label: "Description", key: "description", type: "text" },
                { label: "Amount (KES)", key: "amount", type: "number" },
                { label: "Paid By", key: "paidBy", type: "text" },
              ].map((field) => (
                <div key={field.key}>
                  <label className="block text-xs font-medium text-slate-600 mb-1">{field.label}</label>
                  <input
                    type={field.type}
                    value={(newExpense as Record<string, string>)[field.key]}
                    onChange={(e) => setNewExpense((prev) => ({ ...prev, [field.key]: e.target.value }))}
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
              ))}
            </div>
            <div className="flex gap-3 p-6 border-t border-slate-100">
              <button
                onClick={() => setShowExpenseModal(false)}
                className="flex-1 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowExpenseModal(false)}
                className="flex-1 py-2.5 rounded-xl text-white text-sm font-semibold"
                style={{ backgroundColor: "#1a3a5c" }}
              >
                Save Expense
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
