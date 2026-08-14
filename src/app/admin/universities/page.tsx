"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Textarea from "@/components/ui/Textarea";
import { TURKISH_CITIES } from "@/lib/constants";
import { Building2, Plus, Edit3, Trash2, GraduationCap, ArrowRight } from "lucide-react";

export default function AdminUniversitiesPage() {
  const router = useRouter();
  const [universities, setUniversities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal / Form state for Add University
  const [showAddUni, setShowAddUni] = useState(false);
  const [uniForm, setUniForm] = useState({
    name: "",
    city: "Istanbul",
    type: "PRIVATE",
    description: "",
    logoUrl: "",
    coverImageUrl: "",
    ranking: "",
    website: "",
    accommodationInfo: "",
    scholarshipInfo: "",
    admissionRequirements: "",
  });
  const [submittingUni, setSubmittingUni] = useState(false);

  // Form state for Add Program
  const [showAddProg, setShowAddProg] = useState(false);
  const [selectedUniId, setSelectedUniId] = useState("");
  const [progForm, setProgForm] = useState({
    name: "",
    field: "Engineering",
    degreeLevel: "BACHELOR",
    language: "English",
    tuitionFee: "",
    duration: "4 years",
    description: "",
  });
  const [submittingProg, setSubmittingProg] = useState(false);

  useEffect(() => {
    fetchUniversities();
  }, []);

  async function fetchUniversities() {
    setLoading(true);
    try {
      const meRes = await fetch("/api/auth/me");
      const meData = await meRes.json();
      if (!meRes.ok || meData.data?.user?.role !== "ADMIN") {
        router.push("/admin/login");
        return;
      }

      const res = await fetch("/api/universities");
      const data = await res.json();
      if (data.data?.universities) {
        setUniversities(data.data.universities);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  const handleCreateUniversity = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingUni(true);

    try {
      const res = await fetch("/api/universities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(uniForm),
      });

      if (res.ok) {
        setShowAddUni(false);
        setUniForm({
          name: "",
          city: "Istanbul",
          type: "PRIVATE",
          description: "",
          logoUrl: "",
          coverImageUrl: "",
          ranking: "",
          website: "",
          accommodationInfo: "",
          scholarshipInfo: "",
          admissionRequirements: "",
        });
        fetchUniversities();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSubmittingUni(false);
    }
  };

  const handleCreateProgram = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUniId) return;
    setSubmittingProg(true);

    try {
      const res = await fetch("/api/programs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...progForm,
          universityId: selectedUniId,
        }),
      });

      if (res.ok) {
        setShowAddProg(false);
        setProgForm({
          name: "",
          field: "Engineering",
          degreeLevel: "BACHELOR",
          language: "English",
          tuitionFee: "",
          duration: "4 years",
          description: "",
        });
        fetchUniversities();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSubmittingProg(false);
    }
  };

  const handleDeleteUniversity = async (id: string) => {
    if (!confirm("Are you sure you want to delete this university?")) return;
    try {
      await fetch(`/api/universities/${id}`, { method: "DELETE" });
      fetchUniversities();
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
            <Link href="/admin/applications" className="hover:text-white transition-colors">Applications</Link>
            <Link href="/admin/students" className="hover:text-white transition-colors">Students</Link>
            <Link href="/admin/universities" className="text-blue-400">Universities & Programs</Link>
          </nav>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <Badge variant="primary" className="mb-2">Academic Database</Badge>
            <h1 className="text-3xl font-extrabold text-white">University & Program Management</h1>
            <p className="text-xs text-slate-400 mt-1">Add, edit, or remove partner universities, degree programs, and tuition fees.</p>
          </div>

          <div className="flex gap-3">
            <Button onClick={() => setShowAddUni(true)} className="rounded-xl flex items-center gap-2 bg-blue-600">
              <Plus className="w-4 h-4" /> Add University
            </Button>
          </div>
        </div>

        {/* MODAL: ADD UNIVERSITY */}
        {showAddUni && (
          <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 space-y-4">
            <h3 className="text-lg font-bold text-white border-b border-slate-800 pb-3">Add New Turkish University</h3>
            <form onSubmit={handleCreateUniversity} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">University Name</label>
                  <input
                    type="text"
                    required
                    value={uniForm.name}
                    onChange={(e) => setUniForm({ ...uniForm, name: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">City</label>
                  <select
                    value={uniForm.city}
                    onChange={(e) => setUniForm({ ...uniForm, city: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                  >
                    {TURKISH_CITIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Type</label>
                  <select
                    value={uniForm.type}
                    onChange={(e) => setUniForm({ ...uniForm, type: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                  >
                    <option value="PUBLIC">PUBLIC</option>
                    <option value="PRIVATE">PRIVATE</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Description</label>
                <textarea
                  rows={3}
                  value={uniForm.description}
                  onChange={(e) => setUniForm({ ...uniForm, description: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <Button variant="outline" onClick={() => setShowAddUni(false)} className="rounded-xl border-slate-700 text-slate-300">
                  Cancel
                </Button>
                <Button type="submit" isLoading={submittingUni} className="rounded-xl bg-blue-600">
                  Save University
                </Button>
              </div>
            </form>
          </div>
        )}

        {/* MODAL: ADD PROGRAM */}
        {showAddProg && (
          <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 space-y-4">
            <h3 className="text-lg font-bold text-white border-b border-slate-800 pb-3">Add Program to University</h3>
            <form onSubmit={handleCreateProgram} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Program Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Computer Science"
                    value={progForm.name}
                    onChange={(e) => setProgForm({ ...progForm, name: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Degree Level</label>
                  <select
                    value={progForm.degreeLevel}
                    onChange={(e) => setProgForm({ ...progForm, degreeLevel: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                  >
                    <option value="BACHELOR">BACHELOR</option>
                    <option value="MASTER">MASTER</option>
                    <option value="PHD">PHD</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Annual Tuition Fee ($)</label>
                  <input
                    type="number"
                    required
                    placeholder="4500"
                    value={progForm.tuitionFee}
                    onChange={(e) => setProgForm({ ...progForm, tuitionFee: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <Button variant="outline" onClick={() => setShowAddProg(false)} className="rounded-xl border-slate-700 text-slate-300">
                  Cancel
                </Button>
                <Button type="submit" isLoading={submittingProg} className="rounded-xl bg-blue-600">
                  Add Program
                </Button>
              </div>
            </form>
          </div>
        )}

        {/* UNIVERSITIES LIST */}
        {loading ? (
          <div className="py-20 text-center text-slate-500">Loading university list...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {universities.map((uni) => (
              <div key={uni.id} className="bg-slate-900 rounded-3xl p-6 border border-slate-800 space-y-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <Badge variant={uni.type === "PUBLIC" ? "primary" : "secondary"}>
                      {uni.type}
                    </Badge>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDeleteUniversity(uni.id)}
                      className="text-red-400 border-red-500/30 hover:bg-red-500/10 rounded-xl p-1.5"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>

                  <h3 className="font-bold text-lg text-white mb-1">{uni.name}</h3>
                  <p className="text-xs text-slate-400 mb-3">{uni.city}, Türkiye • Rank #{uni.ranking || "N/A"}</p>
                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">{uni.description}</p>
                </div>

                <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                  <span className="text-xs text-slate-400">{uni._count?.programs || 10}+ Programs</span>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setSelectedUniId(uni.id);
                      setShowAddProg(true);
                    }}
                    className="rounded-xl border-slate-700 text-xs text-blue-400"
                  >
                    + Add Program
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
