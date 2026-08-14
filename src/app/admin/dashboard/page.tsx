"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import {
  Users,
  FileText,
  Clock,
  CheckCircle2,
  XCircle,
  FileSearch,
  DollarSign,
  Building2,
  GraduationCap,
  LogOut,
  BarChart2,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";

const COLORS = ["#2563EB", "#059669", "#D97706", "#DC2626", "#8B5CF6", "#06B6D4"];

export default function AdminDashboardPage() {
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAnalytics() {
      try {
        const meRes = await fetch("/api/auth/me");
        const meData = await meRes.json();
        if (!meRes.ok || meData.data?.user?.role !== "ADMIN") {
          router.push("/admin/login");
          return;
        }

        const res = await fetch("/api/admin/analytics");
        const analyticsData = await res.json();
        if (analyticsData.data) {
          setData(analyticsData.data);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadAnalytics();
  }, [router]);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center font-sans">
        Loading Admin Control Center...
      </div>
    );
  }

  const { metrics, charts } = data || {};

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col">
      {/* ADMIN NAV BAR */}
      <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center font-bold text-white">
              B
            </div>
            <span className="font-extrabold text-lg tracking-tight">Bunited Admin</span>
          </div>

          <nav className="hidden md:flex items-center gap-6 text-xs font-bold text-slate-300">
            <Link href="/admin/dashboard" className="text-blue-400">Dashboard</Link>
            <Link href="/admin/applications" className="hover:text-white transition-colors">Applications</Link>
            <Link href="/admin/students" className="hover:text-white transition-colors">Students</Link>
            <Link href="/admin/universities" className="hover:text-white transition-colors">Universities & Programs</Link>
          </nav>

          <Button size="sm" variant="outline" onClick={handleLogout} className="rounded-xl border-slate-700 text-slate-300 hover:bg-slate-800">
            <LogOut className="w-3.5 h-3.5 mr-1" /> Logout
          </Button>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-8">
        <div>
          <Badge variant="primary" className="mb-2">Admin Analytics</Badge>
          <h1 className="text-3xl font-extrabold text-white">Executive Control Dashboard</h1>
          <p className="text-xs text-slate-400 mt-1">Real-time statistics across all Turkish university applications.</p>
        </div>

        {/* METRICS CARDS GRID */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">Total Students</span>
              <Users className="w-4 h-4 text-blue-400" />
            </div>
            <div className="text-3xl font-extrabold text-white">{metrics?.totalStudents || 0}</div>
          </div>

          <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">New Applications</span>
              <FileText className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-3xl font-extrabold text-amber-400">{metrics?.newApplications || 0}</div>
          </div>

          <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">Under Review</span>
              <Clock className="w-4 h-4 text-sky-400" />
            </div>
            <div className="text-3xl font-extrabold text-sky-400">{metrics?.underReview || 0}</div>
          </div>

          <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">Accepted Students</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-3xl font-extrabold text-emerald-400">{metrics?.accepted || 0}</div>
          </div>

          <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">Rejected Apps</span>
              <XCircle className="w-4 h-4 text-red-400" />
            </div>
            <div className="text-3xl font-extrabold text-red-400">{metrics?.rejected || 0}</div>
          </div>

          <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">Pending Documents</span>
              <FileSearch className="w-4 h-4 text-purple-400" />
            </div>
            <div className="text-3xl font-extrabold text-purple-400">{metrics?.pendingDocs || 0}</div>
          </div>

          <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 lg:col-span-2">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">Total Service Revenue</span>
              <DollarSign className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-3xl font-extrabold text-emerald-400">${metrics?.totalRevenue || 0} USD</div>
          </div>
        </div>

        {/* CHARTS SECTION */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* CHART 1: MONTHLY APPLICATIONS */}
          <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800">
            <h3 className="text-base font-bold text-white mb-6">Applications Growth (Monthly)</h3>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={charts?.monthlyStats || []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} />
                  <YAxis stroke="#94a3b8" fontSize={12} />
                  <Tooltip contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155", borderRadius: "12px", color: "#fff" }} />
                  <Bar dataKey="applications" fill="#3b82f6" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* CHART 2: REVENUE TREND */}
          <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800">
            <h3 className="text-base font-bold text-white mb-6">Revenue Trend (USD)</h3>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={charts?.monthlyStats || []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} />
                  <YAxis stroke="#94a3b8" fontSize={12} />
                  <Tooltip contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155", borderRadius: "12px", color: "#fff" }} />
                  <Line type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={3} dot={{ fill: "#10b981" }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* CHART 3: COUNTRY DEMOGRAPHICS */}
          <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800">
            <h3 className="text-base font-bold text-white mb-6">Student Applicants by Country</h3>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={charts?.countryStats || []}
                    dataKey="count"
                    nameKey="country"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label={(props: any) => `${props.payload?.country || props.name || ""}: ${props.value || props.count || 0}`}
                  >
                    {(charts?.countryStats || []).map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155", borderRadius: "12px", color: "#fff" }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* CHART 4: APPLICATIONS BY UNIVERSITY */}
          <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800">
            <h3 className="text-base font-bold text-white mb-6">Applications by University</h3>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={charts?.applicationsByUniversity || []} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis type="number" stroke="#94a3b8" fontSize={12} />
                  <YAxis dataKey="university" type="category" stroke="#94a3b8" fontSize={11} width={130} />
                  <Tooltip contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155", borderRadius: "12px", color: "#fff" }} />
                  <Bar dataKey="count" fill="#8b5cf6" radius={[0, 6, 6, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* QUICK LINK TO APPLICATIONS */}
        <div className="p-6 rounded-3xl bg-blue-600 text-white flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-bold">Manage Student Applications</h3>
            <p className="text-xs text-blue-100 mt-1">Review documents, update application stages, and communicate with applicants.</p>
          </div>
          <Link href="/admin/applications">
            <Button size="lg" className="bg-white text-blue-700 hover:bg-blue-50 rounded-xl px-8 font-bold">
              Open Application Management &rarr;
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
}
