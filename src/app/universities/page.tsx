"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import { Search, Building2, MapPin, Award, ArrowRight, Filter } from "lucide-react";
import { TURKISH_CITIES } from "@/lib/constants";

export default function UniversitiesPage() {
  const [universities, setUniversities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState("");
  const [city, setCity] = useState("");
  const [type, setType] = useState("");
  const [hasScholarship, setHasScholarship] = useState(false);

  useEffect(() => {
    fetchUniversities();
  }, [city, type, hasScholarship]);

  async function fetchUniversities() {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (city) params.set("city", city);
      if (type) params.set("type", type);
      if (hasScholarship) params.set("hasScholarship", "true");

      const res = await fetch(`/api/universities?${params.toString()}`);
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

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchUniversities();
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans">
      <Header />

      <main className="flex-1 py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        {/* HEADER & FILTER BAR */}
        <div className="mb-10">
          <Badge variant="primary" className="mb-2">University Database</Badge>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900">Universities in Türkiye</h1>
          <p className="text-slate-600 mt-2">Discover world-class public and private universities across Türkiye.</p>

          <form onSubmit={handleSearchSubmit} className="mt-8 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-4 sm:space-y-0 sm:flex sm:items-center sm:gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search by university name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-3 py-2.5 bg-slate-50 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

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
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="px-3 py-2.5 bg-slate-50 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Types</option>
              <option value="PUBLIC">Public State</option>
              <option value="PRIVATE">Private Foundation</option>
            </select>

            <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer px-2">
              <input
                type="checkbox"
                checked={hasScholarship}
                onChange={(e) => setHasScholarship(e.target.checked)}
                className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              Scholarships Only
            </label>

            <Button type="submit" className="rounded-xl px-6 flex items-center gap-2">
              <Filter className="w-4 h-4" /> Filter
            </Button>
          </form>
        </div>

        {/* RESULTS GRID */}
        {loading ? (
          <div className="py-20 text-center text-slate-500">Loading universities...</div>
        ) : universities.length === 0 ? (
          <div className="py-20 text-center bg-white rounded-2xl border p-8">
            <p className="text-slate-600 font-medium">No universities found matching your search criteria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {universities.map((uni) => (
              <Card key={uni.id} className="hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between overflow-hidden group">
                <div>
                  <div className="relative h-48 bg-slate-100 overflow-hidden">
                    <img
                      src={uni.coverImageUrl || "https://images.unsplash.com/photo-1541339907198-e08756dedf77?w=800"}
                      alt={uni.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3">
                      <Badge variant={uni.type === "PUBLIC" ? "primary" : "secondary"}>
                        {uni.type}
                      </Badge>
                    </div>
                    {uni.hasScholarship && (
                      <div className="absolute top-3 right-3">
                        <Badge variant="success">Scholarships</Badge>
                      </div>
                    )}
                  </div>

                  <div className="p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-lg border bg-white p-1 flex items-center justify-center shrink-0">
                        <Building2 className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <h2 className="font-bold text-slate-900 line-clamp-1">{uni.name}</h2>
                        <p className="text-xs text-slate-500 flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-slate-400" /> {uni.city}, Türkiye
                        </p>
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 line-clamp-3 mb-4">
                      {uni.description}
                    </p>

                    <div className="flex items-center gap-4 text-xs text-slate-500 font-medium">
                      <span>Ranking: #{uni.ranking || "N/A"}</span>
                      <span>Programs: {uni._count?.programs || 10}+</span>
                    </div>
                  </div>
                </div>

                <div className="px-6 pb-6 pt-0 flex items-center justify-between border-t border-slate-100 mt-2">
                  <Link href={`/universities/${uni.slug}`} className="w-full">
                    <Button variant="outline" className="w-full justify-center flex items-center gap-2 rounded-xl">
                      View Details & Programs <ArrowRight className="w-4 h-4" />
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
