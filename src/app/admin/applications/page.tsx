"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import Input from "@/components/ui/Input";
import { APPLICATION_STATUSES } from "@/lib/constants";
import {
  Search,
  Filter,
  FileText,
  CheckCircle2,
  XCircle,
  Clock,
  User,
  Building2,
  GraduationCap,
  MessageSquare,
  FileSearch,
  Send,
  LogOut,
} from "lucide-react";

export default function AdminApplicationsPage() {
  const router = useRouter();
  const [applications, setApplications] = useState<any[]>([]);
  const [selectedApp, setSelectedApp] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Filter state
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  // Edit action state
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [newStatus, setNewStatus] = useState("");
  const [internalNote, setInternalNote] = useState("");

  // Document action state
  const [reviewingDocId, setReviewingDocId] = useState<string | null>(null);
  const [docNote, setDocNote] = useState("");

  useEffect(() => {
    fetchApplications();
  }, [statusFilter]);

  async function fetchApplications() {
    setLoading(true);
    try {
      const meRes = await fetch("/api/auth/me");
      const meData = await meRes.json();
      if (!meRes.ok || meData.data?.user?.role !== "ADMIN") {
        router.push("/admin/login");
        return;
      }

      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (statusFilter) params.set("status", statusFilter);

      const res = await fetch(`/api/admin/applications?${params.toString()}`);
      const data = await res.json();
      if (data.data?.applications) {
        setApplications(data.data.applications);
        if (data.data.applications.length > 0 && !selectedApp) {
          setSelectedApp(data.data.applications[0]);
          setNewStatus(data.data.applications[0].status);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchApplications();
  };

  const handleUpdateStatus = async () => {
    if (!selectedApp || !newStatus) return;
    setUpdatingStatus(true);
    try {
      const res = await fetch(`/api/admin/applications/${selectedApp.id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: newStatus,
          note: internalNote,
        }),
      });

      const data = await res.json();
      if (data.data?.application) {
        setInternalNote("");
        fetchApplications();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleDocumentReview = async (docId: string, status: string) => {
    try {
      const res = await fetch(`/api/admin/documents/${docId}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status,
          reviewNote: docNote,
        }),
      });

      if (res.ok) {
        setDocNote("");
        setReviewingDocId(null);
        fetchApplications();
      }
    } catch (e) {
      console.error(e);
    }
  };

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
            <Link href="/admin/dashboard" className="hover:text-white transition-colors">Dashboard</Link>
            <Link href="/admin/applications" className="text-blue-400">Applications</Link>
            <Link href="/admin/students" className="hover:text-white transition-colors">Students</Link>
            <Link href="/admin/universities" className="hover:text-white transition-colors">Universities & Programs</Link>
          </nav>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-6">
        <div>
          <Badge variant="primary" className="mb-2">Application Pipeline</Badge>
          <h1 className="text-3xl font-extrabold text-white">Application Management</h1>
          <p className="text-xs text-slate-400 mt-1">Review student documents, update stages, and manage university submissions.</p>
        </div>

        {/* SEARCH & FILTERS */}
        <form onSubmit={handleSearchSubmit} className="bg-slate-900 p-4 rounded-2xl border border-slate-800 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by student name, email, application number..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs font-bold text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Statuses</option>
            {Object.entries(APPLICATION_STATUSES).map(([key, val]) => (
              <option key={key} value={key}>{val.label}</option>
            ))}
          </select>

          <Button type="submit" size="sm" className="rounded-xl px-6">
            Filter Results
          </Button>
        </form>

        {loading ? (
          <div className="py-20 text-center text-slate-500">Loading applications...</div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* APPLICATIONS TABLE / LIST */}
            <div className="lg:col-span-1 bg-slate-900 rounded-3xl border border-slate-800 p-4 max-h-[700px] overflow-y-auto space-y-3">
              <span className="text-xs font-bold text-slate-400 px-2 block mb-2">
                Showing {applications.length} Application(s)
              </span>

              {applications.map((app) => (
                <div
                  key={app.id}
                  onClick={() => {
                    setSelectedApp(app);
                    setNewStatus(app.status);
                  }}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    selectedApp?.id === app.id
                      ? "bg-blue-600/10 border-blue-500 text-white"
                      : "bg-slate-950/60 border-slate-800/80 text-slate-300 hover:border-slate-700"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-extrabold text-xs text-blue-400">{app.applicationNumber}</span>
                    <Badge variant="primary" className="text-[10px] px-2 py-0.5">
                      {app.status.replace(/_/g, " ")}
                    </Badge>
                  </div>
                  <h4 className="font-bold text-sm text-white">{app.student?.firstName} {app.student?.lastName}</h4>
                  <p className="text-[11px] text-slate-400 line-clamp-1">{app.program?.name || "Program Not Set"} ({app.university?.name || "University Not Set"})</p>
                </div>
              ))}
            </div>

            {/* SELECTED APPLICATION DETAIL PANEL */}
            {selectedApp && (
              <div className="lg:col-span-2 space-y-6">
                {/* APPLICATION SUMMARY HEADER */}
                <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800 pb-4 gap-4">
                    <div>
                      <span className="text-xs text-slate-400 font-semibold block">Application Reference</span>
                      <h2 className="text-2xl font-extrabold text-blue-400">{selectedApp.applicationNumber}</h2>
                      <p className="text-xs text-slate-300 mt-1">
                        Student: <span className="font-bold text-white">{selectedApp.student?.firstName} {selectedApp.student?.lastName}</span> ({selectedApp.student?.user?.email})
                      </p>
                    </div>

                    <div className="space-y-1">
                      <span className="text-xs text-slate-400 block">Current Status</span>
                      <Badge variant="primary" className="text-xs px-3 py-1">
                        {selectedApp.status.replace(/_/g, " ")}
                      </Badge>
                    </div>
                  </div>

                  {/* STATUS UPDATE & INTERNAL NOTE FORM */}
                  <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-4">
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider">Update Status & Progress</h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs text-slate-400 font-semibold mb-1">Select New Status</label>
                        <select
                          value={newStatus}
                          onChange={(e) => setNewStatus(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs font-bold text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          {Object.entries(APPLICATION_STATUSES).map(([k, v]) => (
                            <option key={k} value={k}>{v.label}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs text-slate-400 font-semibold mb-1">Internal Note / Reason</label>
                        <input
                          type="text"
                          placeholder="e.g. Documents verified, submitted to admissions department"
                          value={internalNote}
                          onChange={(e) => setInternalNote(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>

                    <Button onClick={handleUpdateStatus} isLoading={updatingStatus} size="sm" className="rounded-xl px-6 bg-blue-600">
                      Save & Notify Student
                    </Button>
                  </div>
                </div>

                {/* DOCUMENTS REVIEW PIPELINE */}
                <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 space-y-4">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <FileSearch className="w-5 h-5 text-blue-400" /> Uploaded Student Documents
                  </h3>

                  {selectedApp.documents?.length === 0 ? (
                    <p className="text-xs text-slate-500">No documents uploaded by applicant yet.</p>
                  ) : (
                    <div className="space-y-4">
                      {selectedApp.documents?.map((appDoc: any) => (
                        <div key={appDoc.id} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                          <div className="flex items-center justify-between">
                            <div>
                              <span className="font-bold text-sm text-white block">{appDoc.type}</span>
                              <span className="text-xs text-slate-400">File: {appDoc.document?.originalName}</span>
                            </div>

                            <div className="flex items-center gap-2">
                              <Badge variant={appDoc.status === "APPROVED" ? "success" : appDoc.status === "REJECTED" ? "danger" : "warning"}>
                                {appDoc.status}
                              </Badge>

                              {appDoc.document?.path && (
                                <a
                                  href={appDoc.document.path}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-xs font-bold text-blue-400 hover:underline px-2"
                                >
                                  View / Download
                                </a>
                              )}
                            </div>
                          </div>

                          {/* ACTION BUTTONS */}
                          <div className="flex items-center gap-2 pt-2 border-t border-slate-800/80">
                            <Button
                              size="sm"
                              onClick={() => handleDocumentReview(appDoc.id, "APPROVED")}
                              className="rounded-xl text-xs bg-emerald-600 hover:bg-emerald-500 py-1 px-3"
                            >
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDocumentReview(appDoc.id, "REJECTED")}
                              className="rounded-xl text-xs border-red-500/40 text-red-400 hover:bg-red-500/10 py-1 px-3"
                            >
                              Reject
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDocumentReview(appDoc.id, "REPLACEMENT_REQUESTED")}
                              className="rounded-xl text-xs border-amber-500/40 text-amber-400 hover:bg-amber-500/10 py-1 px-3"
                            >
                              Request Replacement
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* INTERNAL NOTES HISTORY */}
                <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 space-y-4">
                  <h3 className="text-base font-bold text-white">Internal Notes & History</h3>
                  <div className="space-y-3 text-xs max-h-48 overflow-y-auto">
                    {selectedApp.notes?.length === 0 ? (
                      <p className="text-slate-500">No notes added yet.</p>
                    ) : (
                      selectedApp.notes?.map((n: any) => (
                        <div key={n.id} className="p-3 rounded-2xl bg-slate-950 border border-slate-800/80">
                          <p className="text-slate-300">{n.content}</p>
                          <span className="text-[10px] text-slate-500 block mt-1">
                            Added by {n.admin?.firstName} • {new Date(n.createdAt).toLocaleString()}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
