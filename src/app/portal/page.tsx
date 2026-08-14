"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import {
  PROGRESS_STEPS,
  APPLICATION_STATUSES,
  DOCUMENT_TYPES,
} from "@/lib/constants";
import {
  CheckCircle2,
  Clock,
  AlertCircle,
  FileText,
  MessageSquare,
  CreditCard,
  Bell,
  Upload,
  Send,
  Building2,
  GraduationCap,
  LogOut,
  UserCheck,
} from "lucide-react";

export default function StudentDashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [applications, setApplications] = useState<any[]>([]);
  const [selectedApp, setSelectedApp] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Messaging state
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [sendingMsg, setSendingMsg] = useState(false);

  // Payment state
  const [paying, setPaying] = useState(false);

  // File upload state
  const [uploadingDoc, setUploadingDoc] = useState(false);

  useEffect(() => {
    async function loadDashboard() {
      try {
        const meRes = await fetch("/api/auth/me");
        const meData = await meRes.json();
        if (!meRes.ok || !meData.data?.user) {
          router.push("/portal/login");
          return;
        }
        setUser(meData.data.user);

        const appRes = await fetch("/api/applications");
        const appData = await appRes.json();
        if (appData.data?.applications) {
          setApplications(appData.data.applications);
          if (appData.data.applications.length > 0) {
            setSelectedApp(appData.data.applications[0]);
          }
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadDashboard();
  }, [router]);

  useEffect(() => {
    if (selectedApp) {
      fetchMessages(selectedApp.id);
    }
  }, [selectedApp]);

  async function fetchMessages(appId: string) {
    try {
      const res = await fetch(`/api/messages?applicationId=${appId}`);
      const data = await res.json();
      if (data.data?.messages) setMessages(data.data.messages);
    } catch (e) {
      console.error(e);
    }
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedApp) return;
    setSendingMsg(true);
    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: newMessage,
          applicationId: selectedApp.id,
        }),
      });
      const data = await res.json();
      if (data.data?.message) {
        setMessages([...messages, data.data.message]);
        setNewMessage("");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSendingMsg(false);
    }
  };

  const handlePayFee = async () => {
    if (!selectedApp) return;
    setPaying(true);
    try {
      const res = await fetch("/api/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          applicationId: selectedApp.id,
          amount: 150,
          currency: "USD",
          description: `Application Processing Fee (${selectedApp.applicationNumber})`,
        }),
      });
      const data = await res.json();
      if (data.data?.payment) {
        // Refresh app state
        const appRes = await fetch("/api/applications");
        const appData = await appRes.json();
        if (appData.data?.applications) {
          setApplications(appData.data.applications);
          setSelectedApp(appData.data.applications.find((a: any) => a.id === selectedApp.id));
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setPaying(false);
    }
  };

  const handleFileUpload = async (type: string, file: File) => {
    if (!selectedApp || !file) return;
    setUploadingDoc(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("type", type);
      formData.append("applicationId", selectedApp.id);

      await fetch("/api/documents/upload", {
        method: "POST",
        body: formData,
      });

      // Refresh applications
      const appRes = await fetch("/api/applications");
      const appData = await appRes.json();
      if (appData.data?.applications) {
        setApplications(appData.data.applications);
        setSelectedApp(appData.data.applications.find((a: any) => a.id === selectedApp.id));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setUploadingDoc(false);
    }
  };

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Header />
        <div className="flex-1 flex items-center justify-center text-slate-500">Loading student dashboard...</div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans">
      <Header />

      <main className="flex-1 py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        {/* STUDENT TOP BAR */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-blue-600 text-white font-extrabold text-xl flex items-center justify-center">
              {user?.student?.firstName?.[0] || "S"}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-slate-900">
                  Welcome, {user?.student?.firstName} {user?.student?.lastName}
                </h1>
                <Badge variant="info">Student</Badge>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">{user?.email} • {user?.student?.nationality || "International Student"}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/apply">
              <Button size="sm" className="rounded-xl flex items-center gap-1">
                + New Application
              </Button>
            </Link>
            <Button size="sm" variant="outline" onClick={handleLogout} className="rounded-xl text-red-600 border-red-200 hover:bg-red-50 flex items-center gap-1">
              <LogOut className="w-3.5 h-3.5" /> Logout
            </Button>
          </div>
        </div>

        {applications.length === 0 ? (
          <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center max-w-lg mx-auto">
            <GraduationCap className="w-16 h-16 text-blue-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-slate-900 mb-2">No Applications Found</h2>
            <p className="text-xs text-slate-500 mb-6">You haven't submitted any university application yet.</p>
            <Link href="/apply">
              <Button size="lg" className="rounded-xl px-8">Start Your Application Now</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* LEFT 2 COLUMNS: TRACKER & DETAILS */}
            <div className="lg:col-span-2 space-y-8">
              {/* SELECT APPLICATION DROPDOWN */}
              {applications.length > 1 && (
                <div className="flex items-center gap-3 bg-white p-4 rounded-2xl border border-slate-200">
                  <span className="text-xs font-bold text-slate-700">Select Application:</span>
                  <select
                    value={selectedApp?.id}
                    onChange={(e) => setSelectedApp(applications.find((a) => a.id === e.target.value))}
                    className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-900"
                  >
                    {applications.map((app) => (
                      <option key={app.id} value={app.id}>
                        {app.applicationNumber} - {app.university?.name || "Pending Selection"} ({app.status})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* 7-STAGE VISUAL APPLICATION PROGRESS TRACKER */}
              <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
                  <div>
                    <span className="text-xs text-slate-400 font-semibold block">Application Reference</span>
                    <h2 className="text-2xl font-extrabold text-blue-700 tracking-wide">{selectedApp?.applicationNumber}</h2>
                  </div>
                  <Badge variant="primary" className="text-sm px-4 py-1.5">
                    {selectedApp?.status.replace(/_/g, " ")}
                  </Badge>
                </div>

                <h3 className="text-sm font-bold text-slate-900 mb-6">Application Stage Tracker</h3>

                {/* 7 STEP PROGRESS BAR */}
                <div className="space-y-4">
                  {PROGRESS_STEPS.map((step) => {
                    const isCompleted = selectedApp?.progressStep > step.id;
                    const isCurrent = selectedApp?.progressStep === step.id;

                    return (
                      <div key={step.id} className="flex items-center gap-4">
                        <div
                          className={`w-9 h-9 rounded-full font-extrabold text-xs flex items-center justify-center shrink-0 ${
                            isCompleted
                              ? "bg-emerald-500 text-white"
                              : isCurrent
                              ? "bg-blue-600 text-white ring-4 ring-blue-100 animate-pulse"
                              : "bg-slate-100 text-slate-400 border border-slate-200"
                          }`}
                        >
                          {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : step.id}
                        </div>

                        <div className="flex-1">
                          <span className={`text-sm font-bold block ${isCurrent ? "text-blue-600" : isCompleted ? "text-slate-900" : "text-slate-400"}`}>
                            {step.label}
                          </span>
                        </div>

                        {isCurrent && (
                          <span className="px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold">
                            Current Stage
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* APPLICATION CHOICES CARD */}
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <span className="text-xs text-slate-400 font-semibold block mb-1">Selected University</span>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 border p-1 flex items-center justify-center">
                      <Building2 className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">{selectedApp?.university?.name || "Not Specified Yet"}</h4>
                      <p className="text-xs text-slate-500">{selectedApp?.university?.city || "Türkiye"}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <span className="text-xs text-slate-400 font-semibold block mb-1">Selected Program & Degree</span>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 border p-1 flex items-center justify-center">
                      <GraduationCap className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">{selectedApp?.program?.name || "General Application"}</h4>
                      <p className="text-xs text-slate-500">{selectedApp?.degreeLevel} Degree</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* UPLOADED & MISSING DOCUMENTS */}
              <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-blue-600" /> Application Documents
                  </h3>
                  <span className="text-xs text-slate-500">
                    {selectedApp?.documents?.length || 0} document(s) uploaded
                  </span>
                </div>

                <div className="space-y-4">
                  {Object.entries(DOCUMENT_TYPES).map(([typeKey, typeLabel]) => {
                    const docMatch = selectedApp?.documents?.find((d: any) => d.type === typeKey);

                    return (
                      <div key={typeKey} className="p-4 rounded-2xl border border-slate-200 bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-900 text-sm">{typeLabel}</span>
                            {docMatch ? (
                              <Badge variant={docMatch.status === "APPROVED" ? "success" : docMatch.status === "REJECTED" ? "danger" : "warning"}>
                                {docMatch.status}
                              </Badge>
                            ) : (
                              <Badge variant="secondary">Missing</Badge>
                            )}
                          </div>
                          {docMatch && (
                            <p className="text-xs text-slate-500 mt-1">File: {docMatch.document?.originalName}</p>
                          )}
                        </div>

                        <label className="cursor-pointer bg-white px-4 py-2 rounded-xl border border-slate-300 hover:bg-slate-100 text-xs font-bold text-slate-700 flex items-center gap-2 shrink-0 self-start sm:self-auto">
                          <Upload className="w-3.5 h-3.5 text-blue-600" />
                          <span>{docMatch ? "Replace Document" : "Upload File"}</span>
                          <input
                            type="file"
                            accept=".pdf,.jpg,.jpeg,.png,.webp"
                            onChange={(e) => {
                              if (e.target.files?.[0]) handleFileUpload(typeKey, e.target.files[0]);
                            }}
                            className="hidden"
                          />
                        </label>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: MESSAGES, PAYMENTS & NOTIFICATIONS */}
            <div className="space-y-8">
              {/* MESSAGING SYSTEM */}
              <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 flex flex-col h-[480px]">
                <div className="flex items-center gap-2 pb-4 border-b border-slate-100">
                  <MessageSquare className="w-5 h-5 text-blue-600" />
                  <h3 className="font-bold text-slate-900 text-base">Advisor Chat</h3>
                </div>

                <div className="flex-1 overflow-y-auto py-4 space-y-3 text-xs">
                  {messages.length === 0 ? (
                    <p className="text-slate-400 text-center py-10">No messages yet. Ask our team anything regarding your application!</p>
                  ) : (
                    messages.map((m) => (
                      <div
                        key={m.id}
                        className={`p-3 rounded-2xl max-w-[85%] ${
                          m.isFromAdmin
                            ? "bg-slate-100 text-slate-900 self-start"
                            : "bg-blue-600 text-white ml-auto"
                        }`}
                      >
                        <p>{m.content}</p>
                        <span className={`text-[10px] block mt-1 ${m.isFromAdmin ? "text-slate-400" : "text-blue-200"}`}>
                          {m.isFromAdmin ? "Bunited Support" : "You"}
                        </span>
                      </div>
                    ))
                  )}
                </div>

                <form onSubmit={handleSendMessage} className="pt-3 border-t border-slate-100 flex gap-2">
                  <input
                    type="text"
                    placeholder="Type a message to your advisor..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <Button type="submit" isLoading={sendingMsg} size="sm" className="rounded-xl px-4">
                    <Send className="w-3.5 h-3.5" />
                  </Button>
                </form>
              </div>

              {/* PAYMENT STATUS & MOCK CHECKOUT */}
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-blue-600" />
                  <h3 className="font-bold text-slate-900 text-base">Payment Status</h3>
                </div>

                {selectedApp?.payments?.length > 0 ? (
                  <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs space-y-1">
                    <div className="flex items-center justify-between font-bold">
                      <span>Status: COMPLETED</span>
                      <span>$150 USD</span>
                    </div>
                    <p className="text-[11px]">Transaction ID: {selectedApp.payments[0].transactionId}</p>
                  </div>
                ) : (
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900">Application Fee</span>
                      <span className="font-extrabold text-blue-600">$150 USD</span>
                    </div>
                    <p className="text-slate-500 text-[11px]">Secure processing & university evaluation fee.</p>
                    <Button onClick={handlePayFee} isLoading={paying} className="w-full rounded-xl py-2.5 bg-blue-600 text-xs">
                      Pay $150 Fee Now (Mock Payment)
                    </Button>
                  </div>
                )}
              </div>

              {/* NOTIFICATIONS CENTER */}
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center gap-2">
                  <Bell className="w-5 h-5 text-blue-600" />
                  <h3 className="font-bold text-slate-900 text-base">Recent Notifications</h3>
                </div>

                <div className="space-y-3 max-h-60 overflow-y-auto text-xs">
                  {selectedApp?.notifications?.length === 0 ? (
                    <p className="text-slate-400 text-center py-4">No notifications yet.</p>
                  ) : (
                    selectedApp?.notifications?.map((n: any) => (
                      <div key={n.id} className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                        <h4 className="font-bold text-slate-900">{n.title}</h4>
                        <p className="text-slate-600 mt-0.5">{n.message}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
