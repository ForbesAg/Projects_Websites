"use client";

import { useState, useEffect } from "react";
import { TopBar } from "@/components/layout/TopBar";
import { Badge } from "@/components/ui/Badge";
import type { UserRole } from "@/lib/types";
import {
  Search, Plus, Edit2, Trash2, X, Save,
  Shield, CheckCircle, XCircle, RefreshCw, Key
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";

interface DBUser {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  branch: string;
  isActive: boolean;
  mustChangePassword: boolean;
}

const roles: UserRole[] = ["Admin", "Manager", "Cashier", "Accountant"];

const rolePermissions: Record<UserRole, string[]> = {
  Admin: ["Full system access", "User management", "All reports", "Settings", "Delete records", "Financial data"],
  Manager: ["Sales management", "Inventory management", "Branch reports", "Staff oversight", "Discount approval"],
  Cashier: ["Process sales", "View products", "Print receipts", "Basic reports"],
  Accountant: ["Financial reports", "Accounting entries", "Expense management", "P&L access", "Balance sheet"],
};

const roleColors: Record<UserRole, { bg: string; text: string }> = {
  Admin: { bg: "#fee2e2", text: "#dc2626" },
  Manager: { bg: "#dbeafe", text: "#2563eb" },
  Cashier: { bg: "#d1fae5", text: "#059669" },
  Accountant: { bg: "#ede9fe", text: "#7c3aed" },
};

const branches = ["Main Branch", "Westlands Branch", "Mombasa Branch"];

export default function UsersPage() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<DBUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState<string>("All");
  const [showModal, setShowModal] = useState(false);
  const [editUser, setEditUser] = useState<Partial<DBUser> & { password?: string; resetPassword?: string } | null>(null);
  const [activeTab, setActiveTab] = useState<"Users" | "Roles">("Users");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/users");
      if (res.ok) {
        const data = await res.json();
        setUsers(data.users);
      }
    } catch (err) {
      console.error("Failed to fetch users:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = users.filter((u) => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    const matchRole = filterRole === "All" || u.role === filterRole;
    return matchSearch && matchRole;
  });

  const openAdd = () => {
    setEditUser({ name: "", email: "", role: "Cashier", branch: "Main Branch", password: "" });
    setError("");
    setShowModal(true);
  };

  const openEdit = (user: DBUser) => {
    setEditUser({ ...user, resetPassword: "" });
    setError("");
    setShowModal(true);
  };

  const saveUser = async () => {
    if (!editUser) return;
    setSaving(true);
    setError("");

    try {
      let res;
      if (!editUser.id) {
        // Create new user
        res = await fetch("/api/users", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: editUser.name,
            email: editUser.email,
            role: editUser.role,
            branch: editUser.branch,
            password: editUser.password,
          }),
        });
      } else {
        // Update existing user
        res = await fetch(`/api/users/${editUser.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: editUser.name,
            email: editUser.email,
            role: editUser.role,
            branch: editUser.branch,
            isActive: editUser.isActive,
            resetPassword: editUser.resetPassword || undefined,
          }),
        });
      }

      const data = await res.json();
      if (res.ok) {
        await fetchUsers();
        setShowModal(false);
        setEditUser(null);
      } else {
        setError(data.error || "Failed to save user");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const deleteUser = async (userId: number) => {
    if (!confirm("Deactivate this user?")) return;
    try {
      const res = await fetch(`/api/users/${userId}`, { method: "DELETE" });
      if (res.ok) {
        await fetchUsers();
      }
    } catch (err) {
      console.error("Failed to delete user:", err);
    }
  };

  const getRoleVariant = (role: UserRole): "success" | "info" | "warning" | "danger" | "default" => {
    const map: Record<UserRole, "success" | "info" | "warning" | "danger" | "default"> = {
      Admin: "danger",
      Manager: "info",
      Cashier: "success",
      Accountant: "warning",
    };
    return map[role];
  };

  const isAdmin = currentUser?.role === "Admin";

  return (
    <div>
      <TopBar title="Users & Roles" subtitle="Role-based access control" />

      <div className="p-6 space-y-5">
        {/* Summary */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {roles.map((role) => {
            const count = users.filter((u) => u.role === role && u.isActive).length;
            const colors = roleColors[role];
            return (
              <div key={role} className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: colors.bg }}>
                    <Shield size={16} style={{ color: colors.text }} />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">{role}s</p>
                    <p className="text-2xl font-bold" style={{ color: colors.text }}>{count}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-100">
          <div className="flex border-b border-slate-100">
            {(["Users", "Roles"] as const).map((tab) => (
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
            {activeTab === "Users" && (
              <div className="space-y-4">
                <div className="flex flex-wrap gap-3 items-center justify-between">
                  <div className="flex gap-3">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
                      <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search users..."
                        className="pl-9 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 w-56"
                      />
                    </div>
                    <select
                      value={filterRole}
                      onChange={(e) => setFilterRole(e.target.value)}
                      className="px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                    >
                      <option value="All">All Roles</option>
                      {roles.map((r) => <option key={r}>{r}</option>)}
                    </select>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={fetchUsers}
                      className="flex items-center gap-2 px-3 py-2 text-sm border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50"
                    >
                      <RefreshCw size={14} />
                    </button>
                    {isAdmin && (
                      <button
                        onClick={openAdd}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-white rounded-lg font-medium"
                        style={{ backgroundColor: "#1a3a5c" }}
                      >
                        <Plus size={14} />
                        Add User
                      </button>
                    )}
                  </div>
                </div>

                {loading ? (
                  <div className="text-center py-8 text-slate-400">Loading users...</div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-slate-50">
                          {["User", "Email", "Role", "Branch", "Status", "Actions"].map((h) => (
                            <th key={h} className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-4 py-3">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                        {filteredUsers.map((user) => (
                          <tr key={user.id} className={`hover:bg-slate-50 transition-colors ${!user.isActive ? "opacity-50" : ""}`}>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-3">
                                <div
                                  className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
                                  style={{ backgroundColor: "#1a3a5c" }}
                                >
                                  {user.name.charAt(0)}
                                </div>
                                <div>
                                  <span className="text-sm font-medium text-slate-800">{user.name}</span>
                                  {user.mustChangePassword && (
                                    <span className="ml-2 text-xs text-amber-600">⚠ Must change pwd</span>
                                  )}
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-3 text-sm text-slate-600">{user.email}</td>
                            <td className="px-4 py-3">
                              <Badge variant={getRoleVariant(user.role)}>{user.role}</Badge>
                            </td>
                            <td className="px-4 py-3 text-sm text-slate-600">{user.branch}</td>
                            <td className="px-4 py-3">
                              <Badge variant={user.isActive ? "success" : "default"}>
                                {user.isActive ? "Active" : "Inactive"}
                              </Badge>
                            </td>
                            <td className="px-4 py-3">
                              {isAdmin && (
                                <div className="flex items-center gap-2">
                                  <button
                                    onClick={() => openEdit(user)}
                                    className="p-1.5 text-slate-400 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-colors"
                                    title="Edit user"
                                  >
                                    <Edit2 size={14} />
                                  </button>
                                  <button
                                    onClick={() => deleteUser(user.id)}
                                    className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                    disabled={user.id === currentUser?.id}
                                    title="Deactivate user"
                                  >
                                    <Trash2 size={14} />
                                  </button>
                                </div>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {activeTab === "Roles" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {roles.map((role) => {
                  const colors = roleColors[role];
                  const perms = rolePermissions[role];
                  return (
                    <div key={role} className="border border-slate-200 rounded-xl p-5">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: colors.bg }}>
                          <Shield size={18} style={{ color: colors.text }} />
                        </div>
                        <div>
                          <h4 className="font-semibold text-slate-800">{role}</h4>
                          <p className="text-xs text-slate-500">{users.filter((u) => u.role === role && u.isActive).length} active users</p>
                        </div>
                      </div>
                      <div className="space-y-2">
                        {perms.map((perm) => (
                          <div key={perm} className="flex items-center gap-2">
                            <CheckCircle size={13} style={{ color: colors.text }} />
                            <span className="text-sm text-slate-600">{perm}</span>
                          </div>
                        ))}
                        {role !== "Admin" && (
                          <>
                            {["Delete records", "System settings"].filter((p) => !perms.includes(p)).slice(0, 2).map((perm) => (
                              <div key={perm} className="flex items-center gap-2">
                                <XCircle size={13} className="text-slate-300" />
                                <span className="text-sm text-slate-400">{perm}</span>
                              </div>
                            ))}
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add/Edit User Modal */}
      {showModal && editUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <h3 className="text-lg font-semibold text-slate-800">
                {editUser.id ? "Edit User" : "Add New User"}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">{error}</div>
              )}
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Full Name</label>
                <input
                  type="text"
                  value={editUser.name || ""}
                  onChange={(e) => setEditUser((prev) => prev ? { ...prev, name: e.target.value } : prev)}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Email Address</label>
                <input
                  type="email"
                  value={editUser.email || ""}
                  onChange={(e) => setEditUser((prev) => prev ? { ...prev, email: e.target.value } : prev)}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Role</label>
                <select
                  value={editUser.role || "Cashier"}
                  onChange={(e) => setEditUser((prev) => prev ? { ...prev, role: e.target.value as UserRole } : prev)}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                >
                  {roles.map((r) => <option key={r}>{r}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Branch</label>
                <select
                  value={editUser.branch || "Main Branch"}
                  onChange={(e) => setEditUser((prev) => prev ? { ...prev, branch: e.target.value } : prev)}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                >
                  {branches.map((b) => <option key={b}>{b}</option>)}
                </select>
              </div>
              {!editUser.id && (
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">
                    Initial Password <span className="text-slate-400">(user must change on first login)</span>
                  </label>
                  <input
                    type="password"
                    value={editUser.password || ""}
                    onChange={(e) => setEditUser((prev) => prev ? { ...prev, password: e.target.value } : prev)}
                    placeholder="Min 8 characters"
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
              )}
              {editUser.id && (
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">
                    <Key size={12} className="inline mr-1" />
                    Reset Password <span className="text-slate-400">(leave blank to keep current)</span>
                  </label>
                  <input
                    type="password"
                    value={editUser.resetPassword || ""}
                    onChange={(e) => setEditUser((prev) => prev ? { ...prev, resetPassword: e.target.value } : prev)}
                    placeholder="New password (optional)"
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
              )}
              {editUser.id && (
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={editUser.isActive !== false}
                    onChange={(e) => setEditUser((prev) => prev ? { ...prev, isActive: e.target.checked } : prev)}
                    className="rounded"
                  />
                  <label htmlFor="isActive" className="text-sm text-slate-600">Account Active</label>
                </div>
              )}
            </div>
            <div className="flex gap-3 p-6 border-t border-slate-100">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={saveUser}
                disabled={saving}
                className="flex-1 py-2.5 rounded-xl text-white text-sm font-semibold flex items-center justify-center gap-2 disabled:opacity-70"
                style={{ backgroundColor: "#1a3a5c" }}
              >
                <Save size={14} />
                {saving ? "Saving..." : "Save User"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
