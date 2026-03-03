"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Zap, Eye, EyeOff, Lock, Mail, Shield, Wifi, WifiOff } from "lucide-react";
import { useAuth } from "@/lib/auth-context";

export default function LoginPage() {
  const router = useRouter();
  const { login, user, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Redirect if already logged in
  useEffect(() => {
    if (!loading && user) {
      if (user.mustChangePassword) {
        router.push("/change-password");
      } else {
        router.push("/dashboard");
      }
    }
  }, [user, loading, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    const result = await login(email, password);

    if (result.success) {
      // Redirect handled by useEffect above
    } else {
      setError(result.error || "Login failed");
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#f0f4f8" }}>
        <div className="text-center">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: "#1a3a5c" }}>
            <Zap className="w-7 h-7 text-white" />
          </div>
          <p className="text-slate-500 text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: "#f0f4f8" }}>
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 relative overflow-hidden" style={{ backgroundColor: "#1a3a5c" }}>
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full opacity-10" style={{ backgroundColor: "#0ea5e9" }}></div>
          <div className="absolute -bottom-32 -left-16 w-80 h-80 rounded-full opacity-10" style={{ backgroundColor: "#0ea5e9" }}></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full opacity-5" style={{ backgroundColor: "#f59e0b" }}></div>
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-12">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: "#0ea5e9" }}>
              <Zap className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-white font-bold text-2xl leading-none">Lexintel</h1>
              <p className="text-blue-300 text-sm">by Forbes Agencies Limited</p>
            </div>
          </div>

          <h2 className="text-white text-4xl font-bold leading-tight mb-4">
            Integrated Business<br />Management System
          </h2>
          <p className="text-blue-200 text-lg leading-relaxed">
            Point of Sale · Accounting · Inventory<br />
            All in one powerful platform.
          </p>
        </div>

        <div className="relative z-10 grid grid-cols-2 gap-4">
          {[
            { label: "POS Transactions", value: "Fast Checkout" },
            { label: "Accounting", value: "Auto-Integrated" },
            { label: "Inventory", value: "Real-time" },
            { label: "Reports", value: "Instant Analytics" },
          ].map((item) => (
            <div key={item.label} className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
              <p className="text-blue-300 text-xs font-medium">{item.label}</p>
              <p className="text-white font-semibold mt-1">{item.value}</p>
            </div>
          ))}
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <Wifi size={14} className="text-emerald-400" />
            <p className="text-emerald-400 text-sm font-medium">Local Network Mode</p>
          </div>
          <p className="text-blue-400 text-sm">
            Works offline · No internet required · LAN ready
          </p>
          <p className="text-blue-500 text-xs mt-2">
            © 2026 Forbes Agencies Limited · www.forbesa.co.ke
          </p>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="flex items-center gap-3 mb-8 lg:hidden">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: "#1a3a5c" }}>
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-xl text-slate-800">Lexintel</h1>
              <p className="text-slate-500 text-xs">by Forbes Agencies Limited</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-slate-800">Welcome back</h3>
              <p className="text-slate-500 mt-1">Sign in to your Lexintel account</p>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
                    placeholder="your@email.com"
                    required
                    autoComplete="email"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-12 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
                    placeholder="••••••••"
                    required
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 rounded-xl text-white font-semibold text-sm transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                style={{ backgroundColor: submitting ? "#64748b" : "#1a3a5c" }}
              >
                {submitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Signing in...
                  </span>
                ) : (
                  "Sign In"
                )}
              </button>
            </form>

            <div className="mt-6 p-4 bg-slate-50 rounded-xl">
              <div className="flex items-center gap-2 mb-2">
                <Shield size={14} className="text-slate-500" />
                <p className="text-xs font-medium text-slate-600">Default Admin Credentials</p>
              </div>
              <p className="text-xs text-slate-500">Email: admin@lexintel.local</p>
              <p className="text-xs text-slate-500">Password: Admin@1234</p>
              <p className="text-xs text-amber-600 mt-1">⚠ Change password after first login</p>
            </div>
          </div>

          <div className="flex items-center justify-center gap-2 mt-6">
            <WifiOff size={12} className="text-slate-400" />
            <p className="text-center text-xs text-slate-400">
              Local deployment · No internet required · Secured by Lexintel
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
