"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import Input from "@/components/ui/Input";
import { Search, User, Mail, Phone, Globe, Send, FileText, ArrowRight } from "lucide-react";

export default function AdminStudentsPage() {
  const router = useRouter();
  const [students, setStudents] = useState<any[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // Direct Message State
  const [msgContent, setMsgContent] = useState("");
  const [sendingMsg, setSendingMsg] = useState(false);
  const [msgSuccess, setMsgSuccess] = useState(false);

  useEffect(() => {
    fetchStudents();
  }, []);

  async function fetchStudents() {
    setLoading(true);
    try {
      const meRes = await fetch("/api/auth/me");
      const meData = await meRes.json();
      if (!meRes.ok || meData.data?.user?.role !== "ADMIN") {
        router.push("/admin/login");
        return;
      }

      // Fetch student applications to get all students
      const res = await fetch("/api/admin/applications");
      const data = await res.json();
      if (data.data?.applications) {
        const studentMap = new Map();
        data.data.applications.forEach((app: any) => {
          if (app.student && !studentMap.has(app.student.id)) {
            studentMap.set(app.student.id, {
              ...app.student,
              applications: [app],
            });
          } else if (app.student) {
            studentMap.get(app.student.id).applications.push(app);
          }
        });
        const studentList = Array.from(studentMap.values());
        setStudents(studentList);
        if (studentList.length > 0) setSelectedStudent(studentList[0]);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  const handleSendDirectMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudent || !msgContent.trim()) return;
    setSendingMsg(true);
    setMsgSuccess(false);

    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: msgContent,
          studentId: selectedStudent.id,
          applicationId: selectedStudent.applications?.[0]?.id || null,
        }),
      });

      if (res.ok) {
        setMsgContent("");
        setMsgSuccess(true);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSendingMsg(false);
    }
  };

  const filteredStudents = students.filter((s) => {
    const query = search.toLowerCase();
    return (
      s.firstName?.toLowerCase().includes(query) ||
      s.lastName?.toLowerCase().includes(query) ||
      s.user?.email?.toLowerCase().includes(query) ||
      s.nationality?.toLowerCase().includes(query)
    );
  });

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
            <Link href="/admin/applications" className="hover:text-white transition-colors">Applications</Link>
            <Link href="/admin/students" className="text-blue-400">Students</Link>
            <Link href="/admin/universities" className="hover:text-white transition-colors">Universities & Programs</Link>
          </nav>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-6">
        <div>
          <Badge variant="primary" className="mb-2">Directory</Badge>
          <h1 className="text-3xl font-extrabold text-white">Student Management</h1>
          <p className="text-xs text-slate-400 mt-1">View applicant profiles, application histories, and send direct notifications.</p>
        </div>

        {/* SEARCH BAR */}
        <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800">
          <div className="relative">
            <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search student by name, email, nationality..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {loading ? (
          <div className="py-20 text-center text-slate-500">Loading student directory...</div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* STUDENT LIST */}
            <div className="lg:col-span-1 bg-slate-900 rounded-3xl border border-slate-800 p-4 max-h-[650px] overflow-y-auto space-y-3">
              <span className="text-xs font-bold text-slate-400 px-2 block mb-2">
                {filteredStudents.length} Student(s) Found
              </span>

              {filteredStudents.map((st) => (
                <div
                  key={st.id}
                  onClick={() => setSelectedStudent(st)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    selectedStudent?.id === st.id
                      ? "bg-blue-600/10 border-blue-500 text-white"
                      : "bg-slate-950/60 border-slate-800/80 text-slate-300 hover:border-slate-700"
                  }`}
                >
                  <h4 className="font-bold text-sm text-white">{st.firstName} {st.lastName}</h4>
                  <p className="text-[11px] text-slate-400">{st.user?.email || "No email"}</p>
                  <span className="text-[10px] text-blue-400 font-semibold block mt-1">
                    {st.applications?.length || 0} Application(s)
                  </span>
                </div>
              ))}
            </div>

            {/* SELECTED STUDENT DETAILS PANEL */}
            {selectedStudent && (
              <div className="lg:col-span-2 space-y-6">
                {/* PROFILE CARD */}
                <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-blue-600 font-bold text-lg text-white flex items-center justify-center">
                        {selectedStudent.firstName?.[0] || "S"}
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-white">{selectedStudent.firstName} {selectedStudent.lastName}</h2>
                        <p className="text-xs text-slate-400">{selectedStudent.user?.email}</p>
                      </div>
                    </div>

                    <Badge variant="info">{selectedStudent.nationality || "International"}</Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div>
                      <span className="text-slate-500 block">Phone / WhatsApp</span>
                      <span className="font-bold text-slate-200">{selectedStudent.phone || "N/A"}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Registered Date</span>
                      <span className="font-bold text-slate-200">{new Date(selectedStudent.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                {/* APPLICATION HISTORY */}
                <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 space-y-4">
                  <h3 className="text-base font-bold text-white">Application History</h3>
                  <div className="space-y-3">
                    {selectedStudent.applications?.map((app: any) => (
                      <div key={app.id} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                        <div>
                          <span className="font-extrabold text-xs text-blue-400">{app.applicationNumber}</span>
                          <h4 className="font-bold text-sm text-white">{app.program?.name || "Program Choice"}</h4>
                          <p className="text-[11px] text-slate-400">{app.university?.name || "University Choice"}</p>
                        </div>

                        <Badge variant="primary" className="text-xs px-3 py-1">
                          {app.status.replace(/_/g, " ")}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>

                {/* SEND DIRECT MESSAGE */}
                <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 space-y-4">
                  <h3 className="text-base font-bold text-white">Send Direct Message</h3>
                  {msgSuccess && (
                    <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs">
                      Message delivered to student dashboard.
                    </div>
                  )}

                  <form onSubmit={handleSendDirectMessage} className="space-y-3">
                    <textarea
                      rows={3}
                      placeholder="Write message to student..."
                      value={msgContent}
                      onChange={(e) => setMsgContent(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />

                    <Button type="submit" isLoading={sendingMsg} size="sm" className="rounded-xl px-6 bg-blue-600">
                      Send Message Now
                    </Button>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
