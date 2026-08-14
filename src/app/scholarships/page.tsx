"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import { Award, Calendar, CheckCircle2, FileText, Gift, ArrowRight } from "lucide-react";
import { format } from "date-fns";

export default function ScholarshipsPage() {
  const [scholarships, setScholarships] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadScholarships() {
      try {
        const res = await fetch("/api/scholarships");
        const data = await res.json();
        if (data.data?.scholarships) {
          setScholarships(data.data.scholarships);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadScholarships();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans">
      <Header />

      <main className="flex-1 py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Badge variant="success" className="mb-2">Financial Aid</Badge>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900">Scholarships in Türkiye</h1>
          <p className="text-slate-600 mt-3 text-lg">
            Discover fully-funded government scholarships and exclusive Bunited tuition waivers.
          </p>
        </div>

        {loading ? (
          <div className="py-20 text-center text-slate-500">Loading scholarship opportunities...</div>
        ) : (
          <div className="space-y-8 max-w-4xl mx-auto">
            {scholarships.map((s) => (
              <div key={s.id} className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-all">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-6 border-b border-slate-100">
                  <div>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold mb-2">
                      <Award className="w-3.5 h-3.5" /> Featured Scholarship
                    </span>
                    <h2 className="text-2xl font-bold text-slate-900">{s.name}</h2>
                  </div>

                  {s.deadline && (
                    <div className="flex items-center gap-2 text-xs font-bold text-amber-700 bg-amber-50 px-4 py-2.5 rounded-xl self-start md:self-auto">
                      <Calendar className="w-4 h-4 text-amber-600" />
                      Deadline: {format(new Date(s.deadline), "MMMM d, yyyy")}
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 text-sm">
                  <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                    <h3 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
                      <Gift className="w-4 h-4 text-blue-600" /> Benefits & Coverage
                    </h3>
                    <p className="text-slate-600 text-xs leading-relaxed">{s.benefits}</p>
                  </div>

                  <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                    <h3 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-blue-600" /> Eligibility Criteria
                    </h3>
                    <p className="text-slate-600 text-xs leading-relaxed">{s.eligibility}</p>
                  </div>

                  <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                    <h3 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
                      <FileText className="w-4 h-4 text-blue-600" /> Requirements
                    </h3>
                    <p className="text-slate-600 text-xs leading-relaxed">{s.requirements}</p>
                  </div>

                  <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                    <h3 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
                      <ArrowRight className="w-4 h-4 text-blue-600" /> How to Apply
                    </h3>
                    <p className="text-slate-600 text-xs leading-relaxed">{s.instructions}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <span className="text-xs text-slate-500 font-medium">Automatic consideration for Bunited applicants</span>
                  <Link href="/apply">
                    <Button size="lg" className="rounded-xl flex items-center gap-2">
                      Apply via Bunited <ArrowRight className="w-4 h-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
