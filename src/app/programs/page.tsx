"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import { Search, GraduationCap, MapPin, Building2, Filter, DollarSign, ArrowRight } from "lucide-react";
import { TURKISH_CITIES } from "@/lib/constants";

export default function ProgramsPage() {
  const [programs, setPrograms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState("");
  const [degreeLevel, setDegreeLevel] = useState("");
  const [field, setField] = useState("");
  const [city, setCity] = useState("");
  const [language, setLanguage] = useState("");
  const [maxTuition, setMaxTuition] = useState("");

  useEffect(() => {
    fetchPrograms();
  }, [degreeLevel, field, city, language, maxTuition]);

  async function fetchPrograms() {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (degreeLevel) params.set("degreeLevel", degreeLevel);
      if (field) params.set("field", field);
      if (city) params.set("city", city);
      if (language) params.set("language", language);
      if (maxTuition) params.set("maxTuition", maxTuition);

      const res = await fetch(`/api/programs?${params.toString()}`);
      const data = await res.json();
      if (data.data?.programs) {
        setPrograms(data.data.programs);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchPrograms();
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans">
      <Header />

      <main className="flex-1 py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="mb-10">
          <Badge variant="primary" className="mb-2">Program Finder</Badge>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900">Explore Degree Programs</h1>
          <p className="text-slate-600 mt-2">Find your ideal Bachelor's, Master's, or PhD program in Türkiye.</p>

          <form onSubmit={handleSearch} className="mt-8 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-4 lg:space-y-0 lg:flex lg:items-center lg:gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder='Search "Computer Engineering in Istanbul"...'
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-3 py-2.5 bg-slate-50 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <select
              value={degreeLevel}
              onChange={(e) => setDegreeLevel(e.target.value)}
              className="px-3 py-2.5 bg-slate-50 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Degrees</option>
              <option value="BACHELOR">Bachelor's</option>
              <option value="MASTER">Master's</option>
              <option value="PHD">PhD</option>
            </select>

            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="px-3 py-2.5 bg-slate-50 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Cities</option>
              {TURKISH_CITIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>

            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="px-3 py-2.5 bg-slate-50 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Languages</option>
              <option value="English">English</option>
              <option value="Turkish">Turkish</option>
            </select>

            <Button type="submit" className="rounded-xl px-6 flex items-center gap-2">
              <Filter className="w-4 h-4" /> Filter
            </Button>
          </form>
        </div>

        {/* RESULTS LIST */}
        {loading ? (
          <div className="py-20 text-center text-slate-500">Searching programs...</div>
        ) : programs.length === 0 ? (
          <div className="py-20 text-center bg-white rounded-2xl border p-8">
            <p className="text-slate-600 font-medium">No programs found matching your filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {programs.map((prog) => (
              <div key={prog.id} className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold">
                      {prog.degreeLevel}
                    </span>
                    <span className="text-xs text-slate-500 font-medium">
                      Language: {prog.language}
                    </span>
                  </div>

                  <h2 className="font-bold text-lg text-slate-900 mb-1">{prog.name}</h2>
                  <p className="text-xs font-semibold text-blue-600 mb-2">{prog.field}</p>

                  <div className="text-xs text-slate-500 flex items-center gap-1 mb-4">
                    <Building2 className="w-3.5 h-3.5 text-slate-400" />
                    <span>{prog.university?.name} ({prog.university?.city})</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-slate-400 block">Annual Tuition</span>
                    <span className="text-lg font-extrabold text-blue-600">${prog.tuitionFee} / yr</span>
                  </div>
                  <Link href={`/apply?programId=${prog.id}&universityId=${prog.universityId}`}>
                    <Button size="sm" className="rounded-xl flex items-center gap-1">
                      Apply <ArrowRight className="w-3.5 h-3.5" />
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
