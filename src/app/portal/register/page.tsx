"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Badge from "@/components/ui/Badge";
import { ArrowRight } from "lucide-react";

export default function StudentRegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phone: "",
    nationality: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Registration failed");

      router.push("/portal");
    } catch (err: any) {
      setError(err.message || "Failed to register");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans">
      <Header />

      <main className="flex-1 flex items-center justify-center py-16 px-4">
        <div className="w-full max-w-lg bg-white p-8 rounded-3xl border border-slate-200 shadow-xl">
          <div className="text-center mb-8">
            <Badge variant="primary" className="mb-2">Student Account</Badge>
            <h1 className="text-2xl font-extrabold text-slate-900">Create Student Account</h1>
            <p className="text-xs text-slate-500 mt-1">Register to start and track your applications in Türkiye.</p>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="First Name"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
              <Input
                label="Last Name"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
              />
            </div>

            <Input
              label="Email Address"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="student@example.com"
              required
            />

            <Input
              label="Password (min 6 chars)"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
            />

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Phone / WhatsApp"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+1 234 567 8900"
              />
              <Input
                label="Nationality"
                name="nationality"
                value={formData.nationality}
                onChange={handleChange}
                placeholder="e.g. Nigerian"
              />
            </div>

            <Button type="submit" isLoading={loading} className="w-full rounded-xl py-3 flex items-center justify-center gap-2">
              Register Account <ArrowRight className="w-4 h-4" />
            </Button>
          </form>

          <div className="mt-6 text-center text-xs text-slate-500">
            Already have an account?{" "}
            <Link href="/portal/login" className="font-bold text-blue-600 hover:underline">
              Log In
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
