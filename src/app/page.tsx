"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import { WHY_CHOOSE, APPLICATION_PROCESS, FAQ_ITEMS, TURKISH_CITIES } from "@/lib/constants";
import {
  GraduationCap,
  BookOpen,
  Award,
  Globe,
  Zap,
  MessageCircle,
  Search,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  ChevronDown,
  Building2,
  Users,
  ShieldCheck,
} from "lucide-react";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("");
  const [featuredUniversities, setFeaturedUniversities] = useState<any[]>([]);
  const [popularPrograms, setPopularPrograms] = useState<any[]>([]);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const uniRes = await fetch("/api/universities");
        const uniData = await uniRes.json();
        if (uniData.data?.universities) {
          setFeaturedUniversities(uniData.data.universities.slice(0, 6));
        }

        const progRes = await fetch("/api/programs");
        const progData = await progRes.json();
        if (progData.data?.programs) {
          setPopularPrograms(progData.data.programs.slice(0, 6));
        }
      } catch (e) {
        console.error("Error loading home data:", e);
      }
    }
    loadData();
  }, []);

  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case "GraduationCap": return <GraduationCap className="w-6 h-6 text-primary" />;
      case "BookOpen": return <BookOpen className="w-6 h-6 text-primary" />;
      case "Award": return <Award className="w-6 h-6 text-primary" />;
      case "Globe": return <Globe className="w-6 h-6 text-primary" />;
      case "Zap": return <Zap className="w-6 h-6 text-primary" />;
      case "MessageCircle": return <MessageCircle className="w-6 h-6 text-primary" />;
      default: return <GraduationCap className="w-6 h-6 text-primary" />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans">
      <Header />

      <main className="flex-1">
        {/* HERO SECTION */}
        <section className="relative overflow-hidden bg-slate-900 text-white py-24 lg:py-32">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/60 via-slate-900 to-indigo-950 opacity-90" />
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl" />

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-400/20 backdrop-blur-md mb-6">
                <Sparkles className="w-4 h-4 text-blue-400" />
                <span className="text-xs font-semibold tracking-wide text-blue-300 uppercase">
                  Official Higher Education Partner in Türkiye
                </span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight mb-6">
                Study in <span className="bg-gradient-to-r from-blue-400 via-sky-300 to-indigo-300 bg-clip-text text-transparent">Türkiye</span>
              </h1>

              <p className="text-lg sm:text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
                Your Gateway to Studying in Türkiye. Discover world-class universities, earn globally recognized degrees, and apply seamlessly with Bunited.
              </p>

              {/* SEARCH ENGINE WIDGET */}
              <div className="bg-white p-3 rounded-2xl shadow-2xl max-w-3xl mx-auto text-slate-900">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="relative">
                    <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Program or University..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-3 py-2.5 bg-slate-50 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <select
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-50 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">All Cities</option>
                    {TURKISH_CITIES.map((city) => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>

                  <Link
                    href={`/programs?search=${encodeURIComponent(searchQuery)}&city=${encodeURIComponent(selectedCity)}`}
                    className="w-full"
                  >
                    <Button className="w-full py-2.5 text-sm h-full flex items-center justify-center gap-2">
                      <Search className="w-4 h-4" />
                      Search Programs
                    </Button>
                  </Link>
                </div>
              </div>

              {/* STATS OVERVIEW */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mt-16 pt-12 border-t border-slate-800">
                <div>
                  <div className="text-3xl font-extrabold text-white mb-1">50+</div>
                  <div className="text-xs text-slate-400 uppercase tracking-wider">Partner Universities</div>
                </div>
                <div>
                  <div className="text-3xl font-extrabold text-blue-400 mb-1">500+</div>
                  <div className="text-xs text-slate-400 uppercase tracking-wider">Degree Programs</div>
                </div>
                <div>
                  <div className="text-3xl font-extrabold text-white mb-1">98%</div>
                  <div className="text-xs text-slate-400 uppercase tracking-wider">Admission Rate</div>
                </div>
                <div>
                  <div className="text-3xl font-extrabold text-blue-400 mb-1">$0</div>
                  <div className="text-xs text-slate-400 uppercase tracking-wider">Agency Fee Guarantees</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FEATURED UNIVERSITIES */}
        <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <Badge variant="info" className="mb-2">Top Destinations</Badge>
              <h2 className="text-3xl font-bold text-slate-900">Featured Universities in Türkiye</h2>
              <p className="text-slate-600 mt-2">Explore accredited state and private universities offering English-medium degrees.</p>
            </div>
            <Link href="/universities" className="mt-4 md:mt-0">
              <Button variant="outline" className="flex items-center gap-2">
                View All Universities <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredUniversities.map((uni) => (
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
                        <Badge variant="success">Scholarships Available</Badge>
                      </div>
                    )}
                  </div>

                  <div className="p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-lg border bg-white p-1 flex items-center justify-center shrink-0">
                        <Building2 className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900 line-clamp-1">{uni.name}</h3>
                        <p className="text-xs text-slate-500 flex items-center gap-1">
                          <Globe className="w-3 h-3" /> {uni.city}, Türkiye
                        </p>
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 line-clamp-3 mb-4">
                      {uni.description}
                    </p>
                  </div>
                </div>

                <div className="px-6 pb-6 pt-0 flex items-center justify-between border-t border-slate-100 mt-2">
                  <span className="text-xs font-semibold text-slate-500">
                    Rank: #{uni.ranking || "N/A"} in Türkiye
                  </span>
                  <Link href={`/universities/${uni.slug}`}>
                    <Button size="sm" variant="ghost" className="text-blue-600 hover:text-blue-700">
                      Learn More &rarr;
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* POPULAR PROGRAMS */}
        <section className="py-20 bg-slate-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <Badge variant="primary" className="mb-2">Academic Offerings</Badge>
              <h2 className="text-3xl font-bold text-slate-900">Popular Degree Programs</h2>
              <p className="text-slate-600 mt-2">Bachelor's, Master's, and PhD programs designed for international students.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {popularPrograms.map((prog) => (
                <div key={prog.id} className="bg-white rounded-2xl p-6 border border-slate-200 hover:shadow-lg transition-all duration-300 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold">
                        {prog.degreeLevel}
                      </span>
                      <span className="text-xs text-slate-500 font-medium">
                        Language: {prog.language}
                      </span>
                    </div>

                    <h3 className="font-bold text-lg text-slate-900 mb-2">{prog.name}</h3>
                    <p className="text-xs text-slate-600 mb-4">{prog.university?.name} ({prog.university?.city})</p>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="text-xs text-slate-400 block">Annual Tuition</span>
                      <span className="text-lg font-extrabold text-blue-600">${prog.tuitionFee} / yr</span>
                    </div>
                    <Link href={`/apply?programId=${prog.id}`}>
                      <Button size="sm" className="rounded-xl">Apply Now</Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center mt-12">
              <Link href="/programs">
                <Button variant="outline" size="lg" className="rounded-xl px-8">
                  Browse All 500+ Programs
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* WHY CHOOSE BUNITED */}
        <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <Badge variant="success" className="mb-2">Our Advantage</Badge>
            <h2 className="text-3xl font-bold text-slate-900">Why Choose Bunited?</h2>
            <p className="text-slate-600 mt-2">Comprehensive support from your first inquiry to arriving at your university campus.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {WHY_CHOOSE.map((item, idx) => (
              <div key={idx} className="p-8 rounded-2xl bg-white border border-slate-200/80 shadow-sm hover:shadow-md transition-all">
                <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center mb-6">
                  {getIconComponent(item.icon)}
                </div>
                <h3 className="font-bold text-xl text-slate-900 mb-2">{item.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* APPLICATION PROCESS TIMELINE */}
        <section className="py-20 bg-slate-900 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <Badge variant="info" className="mb-2">Simple Steps</Badge>
              <h2 className="text-3xl font-bold">Your Path to Admission</h2>
              <p className="text-slate-400 mt-2">How Bunited simplifies your university application journey.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6">
              {APPLICATION_PROCESS.map((step) => (
                <div key={step.step} className="bg-slate-800/60 p-6 rounded-2xl border border-slate-700/60 relative flex flex-col justify-between">
                  <div>
                    <div className="w-10 h-10 rounded-full bg-blue-600 text-white font-extrabold flex items-center justify-center text-sm mb-4">
                      0{step.step}
                    </div>
                    <h3 className="font-bold text-base text-white mb-2">{step.title}</h3>
                    <p className="text-xs text-slate-400 leading-relaxed">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-12 text-center">
              <Link href="/apply">
                <Button size="lg" className="rounded-xl px-10 bg-blue-600 hover:bg-blue-500">
                  Start Application Now &rarr;
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* FAQ ACCORDION */}
        <section className="py-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-2">Got Questions?</Badge>
            <h2 className="text-3xl font-bold text-slate-900">Frequently Asked Questions</h2>
            <p className="text-slate-600 mt-2">Everything you need to know about studying in Türkiye.</p>
          </div>

          <div className="space-y-4">
            {FAQ_ITEMS.map((item, idx) => (
              <div key={idx} className="border border-slate-200 rounded-2xl overflow-hidden bg-white">
                <button
                  onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                  className="w-full px-6 py-5 text-left font-bold text-slate-900 flex items-center justify-between focus:outline-none"
                >
                  <span>{item.question}</span>
                  <ChevronDown className={`w-5 h-5 text-slate-500 transition-transform ${activeFaq === idx ? "rotate-180" : ""}`} />
                </button>
                {activeFaq === idx && (
                  <div className="px-6 pb-5 text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-4">
                    {item.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* CTA WHATSAPP BANNER */}
        <section className="py-16 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
              <h2 className="text-3xl font-bold">Have Questions? Speak to an Educational Advisor</h2>
              <p className="text-blue-100 mt-2">Get free consultation regarding program choices, tuition fees, and visa procedures.</p>
            </div>
            <div className="flex gap-4 shrink-0">
              <a
                href="https://wa.me/905551234567"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button size="lg" className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl flex items-center gap-2">
                  <MessageCircle className="w-5 h-5" /> Chat on WhatsApp
                </Button>
              </a>
              <Link href="/apply">
                <Button size="lg" variant="outline" className="bg-white/10 hover:bg-white/20 border-white/20 text-white rounded-xl">
                  Apply Online
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
