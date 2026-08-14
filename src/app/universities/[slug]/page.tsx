"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import { Building2, MapPin, Globe, Award, Home, FileText, Calendar, CheckCircle2, ArrowRight } from "lucide-react";

export default function UniversityDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const [university, setUniversity] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("programs");

  useEffect(() => {
    async function loadUniversity() {
      if (!slug) return;
      try {
        const res = await fetch(`/api/universities/${slug}`);
        const data = await res.json();
        if (data.data?.university) {
          setUniversity(data.data.university);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadUniversity();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Header />
        <div className="flex-1 flex items-center justify-center text-slate-500">Loading university details...</div>
        <Footer />
      </div>
    );
  }

  if (!university) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Header />
        <div className="flex-1 flex items-center justify-center text-slate-600 font-medium">University not found.</div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans">
      <Header />

      <main className="flex-1">
        {/* HERO COVER BANNER */}
        <section className="relative bg-slate-900 text-white">
          <div className="h-64 sm:h-80 w-full relative overflow-hidden">
            <img
              src={university.coverImageUrl || "https://images.unsplash.com/photo-1541339907198-e08756dedf77?w=1200"}
              alt={university.name}
              className="w-full h-full object-cover opacity-40"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent" />
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative -mt-20 pb-10">
            <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
              <div className="flex items-center gap-6">
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-white p-2 border-2 border-white shadow-xl flex items-center justify-center shrink-0">
                  <Building2 className="w-12 h-12 text-blue-600" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant={university.type === "PUBLIC" ? "primary" : "secondary"}>
                      {university.type} University
                    </Badge>
                    {university.hasScholarship && <Badge variant="success">Scholarships Available</Badge>}
                  </div>
                  <h1 className="text-2xl sm:text-4xl font-extrabold text-white">{university.name}</h1>
                  <p className="text-slate-300 text-sm flex items-center gap-2 mt-1">
                    <MapPin className="w-4 h-4 text-blue-400" /> {university.city}, Türkiye
                    {university.ranking && <span className="ml-2 font-semibold text-blue-300">• Rank #{university.ranking}</span>}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 w-full md:w-auto">
                <Link href={`/apply?universityId=${university.id}`} className="flex-1 md:flex-initial">
                  <Button size="lg" className="w-full rounded-xl bg-blue-600 hover:bg-blue-500 flex items-center justify-center gap-2">
                    Apply to {university.name} <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* CONTENT TABS */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex border-b border-slate-200 gap-8 overflow-x-auto mb-8">
            {[
              { id: "programs", label: "Programs & Fees" },
              { id: "overview", label: "Overview & Admission" },
              { id: "accommodation", label: "Accommodation" },
              { id: "scholarships", label: "Scholarships" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-3 text-sm font-bold border-b-2 whitespace-nowrap transition-colors ${
                  activeTab === tab.id
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-slate-500 hover:text-slate-900"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* TAB 1: PROGRAMS */}
          {activeTab === "programs" && (
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Available Degree Programs</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {university.programs?.map((prog: any) => (
                  <div key={prog.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold">
                          {prog.degreeLevel}
                        </span>
                        <span className="text-xs text-slate-500">Language: {prog.language}</span>
                      </div>
                      <h3 className="font-bold text-lg text-slate-900 mb-1">{prog.name}</h3>
                      <p className="text-xs text-slate-500 mb-4">{prog.field} Faculty</p>
                    </div>

                    <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                      <div>
                        <span className="text-xs text-slate-400 block">Annual Tuition</span>
                        <span className="text-xl font-extrabold text-blue-600">${prog.tuitionFee} / year</span>
                      </div>
                      <Link href={`/apply?programId=${prog.id}&universityId=${university.id}`}>
                        <Button size="sm" className="rounded-xl">Apply Now</Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: OVERVIEW */}
          {activeTab === "overview" && (
            <div className="space-y-8 max-w-4xl">
              <div className="bg-white p-8 rounded-2xl border border-slate-200">
                <h2 className="text-xl font-bold text-slate-900 mb-4">About {university.name}</h2>
                <p className="text-slate-600 text-sm leading-relaxed">{university.description}</p>
              </div>

              <div className="bg-white p-8 rounded-2xl border border-slate-200">
                <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-blue-600" /> Admission Requirements
                </h2>
                <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line">
                  {university.admissionRequirements || "High school diploma with minimum academic standards. IELTS/TOEFL for English medium programs."}
                </p>
              </div>
            </div>
          )}

          {/* TAB 3: ACCOMMODATION */}
          {activeTab === "accommodation" && (
            <div className="bg-white p-8 rounded-2xl border border-slate-200 max-w-4xl">
              <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Home className="w-5 h-5 text-blue-600" /> Student Housing & Accommodation
              </h2>
              <p className="text-slate-600 text-sm leading-relaxed">
                {university.accommodationInfo || "On-campus and off-campus housing facilities available for international students."}
              </p>
            </div>
          )}

          {/* TAB 4: SCHOLARSHIPS */}
          {activeTab === "scholarships" && (
            <div className="bg-white p-8 rounded-2xl border border-slate-200 max-w-4xl">
              <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Award className="w-5 h-5 text-blue-600" /> Scholarship Opportunities
              </h2>
              <p className="text-slate-600 text-sm leading-relaxed">
                {university.scholarshipInfo || "Merit-based scholarships available ranging from 25% to 50% tuition waiver."}
              </p>
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}
