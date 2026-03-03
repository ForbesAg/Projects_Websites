"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  BookOpen,
  BarChart3,
  Truck,
  Users,
  Settings,
  LogOut,
  ChevronRight,
  Zap,
  GraduationCap,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard, roles: ["Admin", "Manager", "Cashier", "Accountant"] },
  { href: "/pos", label: "Point of Sale", icon: ShoppingCart, roles: ["Admin", "Manager", "Cashier"] },
  { href: "/inventory", label: "Inventory", icon: Package, roles: ["Admin", "Manager"] },
  { href: "/accounting", label: "Accounting", icon: BookOpen, roles: ["Admin", "Manager", "Accountant"] },
  { href: "/reports", label: "Reports", icon: BarChart3, roles: ["Admin", "Manager", "Accountant"] },
  { href: "/suppliers", label: "Suppliers", icon: Truck, roles: ["Admin", "Manager"] },
  { href: "/users", label: "Users & Roles", icon: Users, roles: ["Admin"] },
  { href: "/training", label: "Training", icon: GraduationCap, roles: ["Admin", "Manager", "Cashier", "Accountant"] },
  { href: "/settings", label: "Settings", icon: Settings, roles: ["Admin"] },
];

export function Sidebar({ className = "" }: { className?: string }) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  const visibleItems = navItems.filter((item) =>
    !user || item.roles.includes(user.role)
  );

  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
    : "?";

  return (
    <aside className={`fixed left-0 top-0 h-full w-64 flex flex-col z-40 ${className}`} style={{ backgroundColor: "#1a3a5c" }}>
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-white/10">
        <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: "#0ea5e9" }}>
          <Zap className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-white font-bold text-lg leading-none">Lexintel</h1>
          <p className="text-blue-300 text-xs mt-0.5">POS System</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto">
        <p className="text-blue-400 text-xs font-semibold uppercase tracking-wider px-3 mb-2">Main Menu</p>
        <ul className="space-y-0.5">
          {visibleItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group ${
                    isActive
                      ? "bg-sky-500 text-white shadow-sm"
                      : "text-blue-200 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <Icon className={`w-4.5 h-4.5 flex-shrink-0 ${isActive ? "text-white" : "text-blue-300 group-hover:text-white"}`} size={18} />
                  <span className="flex-1">{item.label}</span>
                  {isActive && <ChevronRight size={14} className="text-white/70" />}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User Info */}
      <div className="px-3 py-4 border-t border-white/10">
        {user && (
          <div className="mb-2 px-3 py-1">
            <p className="text-blue-400 text-xs font-semibold uppercase tracking-wider">Logged in as</p>
          </div>
        )}
        <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-white/5">
          <div className="w-8 h-8 rounded-full bg-sky-500 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-sm font-medium truncate">{user?.name || "Loading..."}</p>
            <p className="text-blue-300 text-xs truncate">{user?.role} · {user?.branch}</p>
          </div>
          <button
            onClick={handleLogout}
            className="text-blue-300 hover:text-white transition-colors"
            title="Logout"
          >
            <LogOut size={16} />
          </button>
        </div>
        {user?.mustChangePassword && (
          <Link
            href="/change-password"
            className="mt-2 flex items-center gap-2 px-3 py-2 rounded-lg bg-amber-500/20 text-amber-300 text-xs hover:bg-amber-500/30 transition-colors"
          >
            <span>⚠ Change password required</span>
          </Link>
        )}
      </div>
    </aside>
  );
}
