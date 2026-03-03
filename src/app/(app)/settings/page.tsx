"use client";

import { useState } from "react";
import { TopBar } from "@/components/layout/TopBar";
import { branches } from "@/lib/mockData";
import {
  Building2, Bell, Shield, Printer, Globe, Database,
  Save, Plus, Edit2, Trash2, X, CheckCircle, Zap
} from "lucide-react";

const settingsTabs = ["Business Info", "Branches", "Notifications", "Receipt Settings", "System"];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("Business Info");
  const [saved, setSaved] = useState(false);

  const [businessInfo, setBusinessInfo] = useState({
    name: "Forbes Agencies Limited",
    tradingName: "Lexintel POS",
    kraPin: "P051234567A",
    vatNumber: "VAT/001/2024",
    phone: "+254 700 000 000",
    email: "info@forbesa.co.ke",
    website: "www.forbesa.co.ke",
    address: "Nairobi, Kenya",
    currency: "KES",
    timezone: "Africa/Nairobi",
    fiscalYear: "January - December",
  });

  const [receiptSettings, setReceiptSettings] = useState({
    showLogo: true,
    showVAT: true,
    showBarcode: false,
    footerMessage: "Thank you for shopping with us!",
    headerMessage: "LEXINTEL POS",
    printCopies: "1",
  });

  const [notifications, setNotifications] = useState({
    lowStockAlerts: true,
    dailySalesReport: true,
    newUserAlert: true,
    paymentConfirmation: true,
    emailReports: false,
    smsAlerts: false,
  });

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div>
      <TopBar title="Settings" subtitle="System configuration & preferences" />

      <div className="p-6">
        <div className="flex gap-6">
          {/* Settings Sidebar */}
          <div className="w-56 flex-shrink-0">
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
              {settingsTabs.map((tab) => {
                const icons: Record<string, React.ReactNode> = {
                  "Business Info": <Building2 size={16} />,
                  "Branches": <Globe size={16} />,
                  "Notifications": <Bell size={16} />,
                  "Receipt Settings": <Printer size={16} />,
                  "System": <Database size={16} />,
                };
                return (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-all text-left border-l-2 ${
                      activeTab === tab
                        ? "border-sky-500 text-sky-700 bg-sky-50"
                        : "border-transparent text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <span className={activeTab === tab ? "text-sky-600" : "text-slate-400"}>
                      {icons[tab]}
                    </span>
                    {tab}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Settings Content */}
          <div className="flex-1">
            {/* Business Info */}
            {activeTab === "Business Info" && (
              <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="font-semibold text-slate-800">Business Information</h3>
                    <p className="text-xs text-slate-500 mt-0.5">Your company details and registration info</p>
                  </div>
                  <div className="flex items-center gap-3">
                    {saved && (
                      <div className="flex items-center gap-2 text-emerald-600 text-sm">
                        <CheckCircle size={16} />
                        Saved!
                      </div>
                    )}
                    <button
                      onClick={handleSave}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-white rounded-lg font-medium"
                      style={{ backgroundColor: "#1a3a5c" }}
                    >
                      <Save size={14} />
                      Save Changes
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-5">
                  {[
                    { label: "Company Name", key: "name" },
                    { label: "Trading Name", key: "tradingName" },
                    { label: "KRA PIN", key: "kraPin" },
                    { label: "VAT Number", key: "vatNumber" },
                    { label: "Phone Number", key: "phone" },
                    { label: "Email Address", key: "email" },
                    { label: "Website", key: "website" },
                    { label: "Physical Address", key: "address" },
                    { label: "Currency", key: "currency" },
                    { label: "Timezone", key: "timezone" },
                    { label: "Fiscal Year", key: "fiscalYear" },
                  ].map((field) => (
                    <div key={field.key} className={field.key === "address" ? "col-span-2" : ""}>
                      <label className="block text-xs font-medium text-slate-600 mb-1.5">{field.label}</label>
                      <input
                        type="text"
                        value={(businessInfo as Record<string, string>)[field.key]}
                        onChange={(e) => setBusinessInfo((prev) => ({ ...prev, [field.key]: e.target.value }))}
                        className="w-full px-3 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Branches */}
            {activeTab === "Branches" && (
              <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="font-semibold text-slate-800">Branch Management</h3>
                    <p className="text-xs text-slate-500 mt-0.5">Manage your business locations</p>
                  </div>
                  <button
                    className="flex items-center gap-2 px-4 py-2 text-sm text-white rounded-lg font-medium"
                    style={{ backgroundColor: "#1a3a5c" }}
                  >
                    <Plus size={14} />
                    Add Branch
                  </button>
                </div>

                <div className="space-y-3">
                  {branches.map((branch) => (
                    <div key={branch.id} className="flex items-center justify-between p-4 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: "#e8f0f8" }}>
                          <Building2 size={18} style={{ color: "#1a3a5c" }} />
                        </div>
                        <div>
                          <p className="font-medium text-slate-800">{branch.name}</p>
                          <p className="text-xs text-slate-500">{branch.location} · {branch.phone}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button className="p-2 text-slate-400 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-colors">
                          <Edit2 size={14} />
                        </button>
                        <button className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Notifications */}
            {activeTab === "Notifications" && (
              <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="font-semibold text-slate-800">Notification Preferences</h3>
                    <p className="text-xs text-slate-500 mt-0.5">Configure alerts and notifications</p>
                  </div>
                  <button
                    onClick={handleSave}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-white rounded-lg font-medium"
                    style={{ backgroundColor: "#1a3a5c" }}
                  >
                    <Save size={14} />
                    Save
                  </button>
                </div>

                <div className="space-y-4">
                  {Object.entries(notifications).map(([key, value]) => {
                    const labels: Record<string, { label: string; desc: string }> = {
                      lowStockAlerts: { label: "Low Stock Alerts", desc: "Get notified when products reach reorder level" },
                      dailySalesReport: { label: "Daily Sales Report", desc: "Receive end-of-day sales summary" },
                      newUserAlert: { label: "New User Alert", desc: "Notify when a new user is added" },
                      paymentConfirmation: { label: "Payment Confirmation", desc: "Confirm each payment transaction" },
                      emailReports: { label: "Email Reports", desc: "Send reports to registered email" },
                      smsAlerts: { label: "SMS Alerts", desc: "Send critical alerts via SMS" },
                    };
                    const info = labels[key];
                    return (
                      <div key={key} className="flex items-center justify-between p-4 border border-slate-100 rounded-xl">
                        <div>
                          <p className="text-sm font-medium text-slate-800">{info.label}</p>
                          <p className="text-xs text-slate-500 mt-0.5">{info.desc}</p>
                        </div>
                        <button
                          onClick={() => setNotifications((prev) => ({ ...prev, [key]: !value }))}
                          className={`relative w-11 h-6 rounded-full transition-colors ${value ? "bg-sky-500" : "bg-slate-200"}`}
                        >
                          <span
                            className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${value ? "translate-x-5" : "translate-x-0.5"}`}
                          ></span>
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Receipt Settings */}
            {activeTab === "Receipt Settings" && (
              <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="font-semibold text-slate-800">Receipt Configuration</h3>
                    <p className="text-xs text-slate-500 mt-0.5">Customize your receipt layout</p>
                  </div>
                  <button
                    onClick={handleSave}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-white rounded-lg font-medium"
                    style={{ backgroundColor: "#1a3a5c" }}
                  >
                    <Save size={14} />
                    Save
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-4">
                    {[
                      { key: "showLogo", label: "Show Logo" },
                      { key: "showVAT", label: "Show VAT Breakdown" },
                      { key: "showBarcode", label: "Show Barcode" },
                    ].map((toggle) => (
                      <div key={toggle.key} className="flex items-center justify-between">
                        <span className="text-sm text-slate-700">{toggle.label}</span>
                        <button
                          onClick={() => setReceiptSettings((prev) => ({ ...prev, [toggle.key]: !prev[toggle.key as keyof typeof prev] }))}
                          className={`relative w-11 h-6 rounded-full transition-colors ${receiptSettings[toggle.key as keyof typeof receiptSettings] ? "bg-sky-500" : "bg-slate-200"}`}
                        >
                          <span
                            className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${receiptSettings[toggle.key as keyof typeof receiptSettings] ? "translate-x-5" : "translate-x-0.5"}`}
                          ></span>
                        </button>
                      </div>
                    ))}
                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1">Print Copies</label>
                      <select
                        value={receiptSettings.printCopies}
                        onChange={(e) => setReceiptSettings((prev) => ({ ...prev, printCopies: e.target.value }))}
                        className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                      >
                        <option value="1">1 copy</option>
                        <option value="2">2 copies</option>
                        <option value="3">3 copies</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1">Header Message</label>
                      <input
                        type="text"
                        value={receiptSettings.headerMessage}
                        onChange={(e) => setReceiptSettings((prev) => ({ ...prev, headerMessage: e.target.value }))}
                        className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1">Footer Message</label>
                      <input
                        type="text"
                        value={receiptSettings.footerMessage}
                        onChange={(e) => setReceiptSettings((prev) => ({ ...prev, footerMessage: e.target.value }))}
                        className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                      />
                    </div>
                  </div>

                  {/* Receipt Preview */}
                  <div>
                    <p className="text-xs font-medium text-slate-600 mb-3">Receipt Preview</p>
                    <div className="border border-slate-200 rounded-xl p-4 font-mono text-xs bg-slate-50 space-y-1">
                      <p className="text-center font-bold text-sm">{receiptSettings.headerMessage}</p>
                      <p className="text-center text-slate-500">Main Branch · Nairobi</p>
                      <p className="text-center text-slate-400">{new Date().toLocaleDateString("en-KE")}</p>
                      <div className="border-t border-dashed border-slate-300 my-2"></div>
                      <div className="flex justify-between"><span>Unga Pembe 2kg x2</span><span>KES 350</span></div>
                      <div className="flex justify-between"><span>Sugar 1kg x1</span><span>KES 145</span></div>
                      <div className="border-t border-dashed border-slate-300 my-2"></div>
                      {receiptSettings.showVAT && (
                        <div className="flex justify-between text-slate-500"><span>VAT (16%)</span><span>KES 48.28</span></div>
                      )}
                      <div className="flex justify-between font-bold"><span>TOTAL</span><span>KES 495</span></div>
                      <div className="border-t border-dashed border-slate-300 my-2"></div>
                      <p className="text-center text-slate-500">{receiptSettings.footerMessage}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* System */}
            {activeTab === "System" && (
              <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
                <h3 className="font-semibold text-slate-800 mb-6">System Information</h3>
                <div className="space-y-4">
                  {[
                    { label: "System Version", value: "Lexintel v1.0.0" },
                    { label: "Deployment", value: "Cloud (SaaS)" },
                    { label: "Database", value: "PostgreSQL (Managed)" },
                    { label: "Last Backup", value: "Today, 02:00 AM" },
                    { label: "License", value: "Enterprise · Forbes Agencies Limited" },
                    { label: "Support", value: "support@forbesa.co.ke" },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center justify-between py-3 border-b border-slate-50">
                      <span className="text-sm text-slate-600">{item.label}</span>
                      <span className="text-sm font-medium text-slate-800">{item.value}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-6 grid grid-cols-2 gap-3">
                  <button className="flex items-center justify-center gap-2 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-600 hover:bg-slate-50">
                    <Database size={14} />
                    Backup Now
                  </button>
                  <button className="flex items-center justify-center gap-2 py-2.5 border border-red-200 rounded-xl text-sm text-red-600 hover:bg-red-50">
                    <X size={14} />
                    Clear Cache
                  </button>
                </div>

                <div className="mt-4 p-4 bg-sky-50 rounded-xl border border-sky-100">
                  <div className="flex items-center gap-2 mb-2">
                    <Zap size={16} className="text-sky-600" />
                    <p className="text-sm font-semibold text-sky-800">Lexintel POS System</p>
                  </div>
                  <p className="text-xs text-sky-600">
                    Developed by Forbes Agencies Limited · www.forbesa.co.ke<br />
                    Integrated POS, Accounting & Inventory Management
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
