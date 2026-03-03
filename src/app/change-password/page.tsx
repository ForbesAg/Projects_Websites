"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Zap, Eye, EyeOff, Lock, CheckCircle, AlertCircle } from "lucide-react";
import { useAuth } from "@/lib/auth-context";

export default function ChangePasswordPage() {
  const router = useRouter();
  const { user, loading, refreshUser } = useAuth();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  const passwordStrength = (pwd: string) => {
    let score = 0;
    if (pwd.length >= 8) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[a-z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;
    return score;
  };

  const strength = passwordStrength(newPassword);
  const strengthLabel = ["", "Very Weak", "Weak", "Fair", "Strong", "Very Strong"][strength];
  const strengthColor = ["", "#ef4444", "#f97316", "#eab308", "#22c55e", "#16a34a"][strength];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (newPassword !== confirmPassword) {
      setError("New passwords do not match");
      return;
    }

    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    if (strength < 3) {
      setError("Password is too weak. Use uppercase, lowercase, and numbers.");
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess(true);
        await refreshUser();
        setTimeout(() => router.push("/dashboard"), 2000);
      } else {
        setError(data.error || "Failed to change password");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return null;

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: "#f0f4f8" }}>
      <div className="w-full max-w-md">
        <div className="flex items-center gap-3 mb-8 justify-center">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: "#1a3a5c" }}>
            <Zap className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-xl text-slate-800">Lexintel</h1>
            <p className="text-slate-500 text-xs">by Forbes Agencies Limited</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          {success ? (
            <div className="text-center py-4">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle size={32} className="text-emerald-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">Password Changed!</h3>
              <p className="text-slate-500 text-sm">Redirecting to dashboard...</p>
            </div>
          ) : (
            <>
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle size={18} className="text-amber-500" />
                  <h3 className="text-xl font-bold text-slate-800">Change Your Password</h3>
                </div>
                {user?.mustChangePassword && (
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                    <p className="text-amber-700 text-sm">
                      <strong>Action Required:</strong> You must change your password before continuing.
                    </p>
                  </div>
                )}
                {!user?.mustChangePassword && (
                  <p className="text-slate-500 text-sm mt-1">Update your account password</p>
                )}
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Current Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input
                      type={showCurrent ? "text" : "password"}
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="w-full pl-10 pr-12 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                      placeholder="Enter current password"
                      required
                    />
                    <button type="button" onClick={() => setShowCurrent(!showCurrent)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                      {showCurrent ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    New Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input
                      type={showNew ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full pl-10 pr-12 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                      placeholder="Min 8 chars, uppercase, number"
                      required
                    />
                    <button type="button" onClick={() => setShowNew(!showNew)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                      {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {newPassword && (
                    <div className="mt-2">
                      <div className="flex gap-1 mb-1">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <div
                            key={i}
                            className="h-1 flex-1 rounded-full transition-all"
                            style={{ backgroundColor: i <= strength ? strengthColor : "#e2e8f0" }}
                          />
                        ))}
                      </div>
                      <p className="text-xs" style={{ color: strengthColor }}>{strengthLabel}</p>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className={`w-full pl-10 pr-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 ${
                        confirmPassword && confirmPassword !== newPassword ? "border-red-300" : "border-slate-200"
                      }`}
                      placeholder="Repeat new password"
                      required
                    />
                  </div>
                  {confirmPassword && confirmPassword !== newPassword && (
                    <p className="text-xs text-red-500 mt-1">Passwords do not match</p>
                  )}
                </div>

                <div className="p-3 bg-slate-50 rounded-lg text-xs text-slate-500 space-y-1">
                  <p className="font-medium text-slate-600">Password requirements:</p>
                  <p className={newPassword.length >= 8 ? "text-emerald-600" : ""}>✓ At least 8 characters</p>
                  <p className={/[A-Z]/.test(newPassword) ? "text-emerald-600" : ""}>✓ One uppercase letter</p>
                  <p className={/[a-z]/.test(newPassword) ? "text-emerald-600" : ""}>✓ One lowercase letter</p>
                  <p className={/[0-9]/.test(newPassword) ? "text-emerald-600" : ""}>✓ One number</p>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3 rounded-xl text-white font-semibold text-sm transition-all disabled:opacity-70"
                  style={{ backgroundColor: "#1a3a5c" }}
                >
                  {submitting ? "Changing Password..." : "Change Password"}
                </button>

                {!user?.mustChangePassword && (
                  <button
                    type="button"
                    onClick={() => router.push("/dashboard")}
                    className="w-full py-2.5 border border-slate-200 rounded-xl text-sm text-slate-600 hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                )}
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
