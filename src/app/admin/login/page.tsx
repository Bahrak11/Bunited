"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Badge from "@/components/ui/Badge";
import { ShieldAlert, KeyRound, Lock, ArrowRight, CheckCircle2 } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();

  // Login form state
  const [email, setEmail] = useState("Bgoldern99@gmail.com");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Force Change Password State
  const [mustChange, setMustChange] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [changingPass, setChangingPass] = useState(false);
  const [passError, setPassError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Admin authentication failed");
      }

      if (data.data?.user?.mustChangePassword) {
        setCurrentPassword(password);
        setMustChange(true);
      } else {
        router.push("/admin/dashboard");
      }
    } catch (err: any) {
      setError(err.message || "Failed to log in as Admin");
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setPassError("New passwords do not match");
      return;
    }

    setChangingPass(true);
    setPassError("");

    try {
      const res = await fetch("/api/auth/admin/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to change password");

      router.push("/admin/dashboard");
    } catch (err: any) {
      setPassError(err.message || "Failed to change password");
    } finally {
      setChangingPass(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 font-sans p-4">
      <div className="w-full max-w-md bg-slate-800 border border-slate-700 p-8 rounded-3xl shadow-2xl text-white">
        {!mustChange ? (
          <div>
            <div className="text-center mb-8">
              <div className="w-14 h-14 rounded-2xl bg-blue-600/20 border border-blue-500/30 text-blue-400 flex items-center justify-center mx-auto mb-3">
                <ShieldAlert className="w-7 h-7" />
              </div>
              <Badge variant="primary" className="mb-2">Admin Portal</Badge>
              <h1 className="text-2xl font-extrabold">Bunited Control Panel</h1>
              <p className="text-xs text-slate-400 mt-1">Authorized personnel authentication</p>
            </div>

            {error && (
              <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-medium">
                {error}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Admin Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <Button type="submit" isLoading={loading} className="w-full rounded-xl py-3 bg-blue-600 hover:bg-blue-500 flex items-center justify-center gap-2">
                Authenticate Admin <ArrowRight className="w-4 h-4" />
              </Button>
            </form>
          </div>
        ) : (
          <div>
            <div className="text-center mb-8">
              <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto mb-3">
                <KeyRound className="w-7 h-7" />
              </div>
              <Badge variant="warning" className="mb-2">Mandatory Action</Badge>
              <h1 className="text-xl font-extrabold">Change Admin Password</h1>
              <p className="text-xs text-slate-400 mt-1">First-time login security protocol</p>
            </div>

            {passError && (
              <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-medium">
                {passError}
              </div>
            )}

            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">New Password (min 8 chars)</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Confirm New Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <Button type="submit" isLoading={changingPass} className="w-full rounded-xl py-3 bg-amber-600 hover:bg-amber-500 flex items-center justify-center gap-2">
                Update & Proceed to Dashboard <CheckCircle2 className="w-4 h-4" />
              </Button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
