"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Badge from "@/components/ui/Badge";
import { Lock, Mail, ArrowRight } from "lucide-react";

export default function StudentLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Login failed");

      router.push("/portal");
    } catch (err: any) {
      setError(err.message || "Failed to log in");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans">
      <Header />

      <main className="flex-1 flex items-center justify-center py-16 px-4">
        <div className="w-full max-w-md bg-white p-8 rounded-3xl border border-slate-200 shadow-xl">
          <div className="text-center mb-8">
            <Badge variant="primary" className="mb-2">Student Portal</Badge>
            <h1 className="text-2xl font-extrabold text-slate-900">Welcome Back</h1>
            <p className="text-xs text-slate-500 mt-1">Log in to track your university applications.</p>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="student@example.com"
              required
            />

            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />

            <Button type="submit" isLoading={loading} className="w-full rounded-xl py-3 flex items-center justify-center gap-2">
              Log In to Portal <ArrowRight className="w-4 h-4" />
            </Button>
          </form>

          <div className="mt-6 text-center text-xs text-slate-500">
            Don't have an account yet?{" "}
            <Link href="/portal/register" className="font-bold text-blue-600 hover:underline">
              Create Account
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
