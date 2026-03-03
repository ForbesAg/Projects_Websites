"use client";

import { Bell, Search, ChevronDown } from "lucide-react";

interface TopBarProps {
  title: string;
  subtitle?: string;
}

export function TopBar({ title, subtitle }: TopBarProps) {
  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 sticky top-0 z-30">
      <div>
        <h2 className="text-lg font-semibold text-slate-800">{title}</h2>
        {subtitle && <p className="text-xs text-slate-500">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
          <input
            type="text"
            placeholder="Search..."
            className="pl-9 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent w-56"
          />
        </div>

        {/* Branch selector */}
        <button className="flex items-center gap-2 px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors">
          <span className="text-slate-600 font-medium">Main Branch</span>
          <ChevronDown size={14} className="text-slate-400" />
        </button>

        {/* Notifications */}
        <button className="relative p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors">
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        {/* Date */}
        <div className="hidden lg:block text-right">
          <p className="text-xs text-slate-500">
            {new Date().toLocaleDateString("en-KE", { weekday: "short", day: "numeric", month: "short", year: "numeric" })}
          </p>
          <p className="text-xs font-medium text-slate-700">
            {new Date().toLocaleTimeString("en-KE", { hour: "2-digit", minute: "2-digit" })}
          </p>
        </div>
      </div>
    </header>
  );
}
