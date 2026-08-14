"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Badge from "@/components/ui/Badge";
import { CheckCircle2, Upload, ArrowRight, ArrowLeft, FileText, Sparkles, Building2 } from "lucide-react";
import { TURKISH_CITIES } from "@/lib/constants";

function ApplyFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [submittedApp, setSubmittedApp] = useState<any>(null);

  // Data sources
  const [universities, setUniversities] = useState<any[]>([]);
  const [programs, setPrograms] = useState<any[]>([]);

  // Form State
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    nationality: "",
    dateOfBirth: "",
    degreeLevel: "BACHELOR",
    preferredCity: "",
    universityId: searchParams.get("universityId") || "",
    programId: searchParams.get("programId") || "",
    gpa: "",
    previousSchool: "",
    graduationYear: "",
    languageScore: "",
  });

  const [files, setFiles] = useState<{ [key: string]: File | null }>({
    PASSPORT: null,
    DIPLOMA: null,
    TRANSCRIPT: null,
    PASSPORT_PHOTO: null,
    LANGUAGE_CERTIFICATE: null,
  });

  useEffect(() => {
    async function loadData() {
      try {
        const uniRes = await fetch("/api/universities");
        const uniData = await uniRes.json();
        if (uniData.data?.universities) setUniversities(uniData.data.universities);

        const progRes = await fetch("/api/programs");
        const progData = await progRes.json();
        if (progData.data?.programs) setPrograms(progData.data.programs);
      } catch (e) {
        console.error(e);
      }
    }
    loadData();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (type: string, file: File | null) => {
    setFiles({ ...files, [type]: file });
  };

  const nextStep = () => {
    setError("");
    if (step === 1) {
      if (!formData.fullName || !formData.email) {
        setError("Full Name and Email address are required.");
        return;
      }
    }
    setStep(step + 1);
  };

  const prevStep = () => setStep(step - 1);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      // 1. Submit Application details
      const res = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          nationality: formData.nationality,
          dateOfBirth: formData.dateOfBirth,
          degreeLevel: formData.degreeLevel,
          preferredCity: formData.preferredCity,
          universityId: formData.universityId || undefined,
          programId: formData.programId || undefined,
          academicInfo: {
            gpa: formData.gpa,
            previousSchool: formData.previousSchool,
            graduationYear: formData.graduationYear,
            languageScore: formData.languageScore,
          },
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to submit application");
      }

      const application = data.data.application;
      setSubmittedApp(application);

      // 2. Upload documents if present
      for (const [type, file] of Object.entries(files)) {
        if (file) {
          const fileData = new FormData();
          fileData.append("file", file);
          fileData.append("type", type);
          fileData.append("applicationId", application.id);

          await fetch("/api/documents/upload", {
            method: "POST",
            body: fileData,
          });
        }
      }

      setStep(6); // Success Step
    } catch (err: any) {
      setError(err.message || "An error occurred during submission.");
    } finally {
      setSubmitting(false);
    }
  };

  const selectedUniObj = universities.find((u) => u.id === formData.universityId);
  const selectedProgObj = programs.find((p) => p.id === formData.programId);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans">
      <Header />

      <main className="flex-1 py-12 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        {step < 6 && (
          <div className="mb-10 text-center">
            <Badge variant="primary" className="mb-2">Online Application</Badge>
            <h1 className="text-3xl font-extrabold text-slate-900">Apply to Turkish Universities</h1>
            <p className="text-slate-600 mt-1">Complete your 5-step application to secure your admission.</p>

            {/* PROGRESS WIZARD INDICATOR */}
            <div className="flex items-center justify-between mt-8 max-w-xl mx-auto">
              {[1, 2, 3, 4, 5].map((s) => (
                <div key={s} className="flex items-center">
                  <div
                    className={`w-9 h-9 rounded-full font-bold text-sm flex items-center justify-center transition-colors ${
                      step >= s ? "bg-blue-600 text-white" : "bg-slate-200 text-slate-500"
                    }`}
                  >
                    {s}
                  </div>
                  {s < 5 && (
                    <div className={`w-12 sm:w-16 h-1 mx-1 rounded ${step > s ? "bg-blue-600" : "bg-slate-200"}`} />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm font-medium">
            {error}
          </div>
        )}

        {/* STEP 1: PERSONAL INFORMATION */}
        {step === 1 && (
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
            <h2 className="text-xl font-bold text-slate-900 border-b border-slate-100 pb-4">Step 1: Personal Information</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <Input
                label="Full Name (as in Passport)"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                placeholder="e.g. Alexander Vance"
                required
              />
              <Input
                label="Email Address"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="alexander@example.com"
                required
              />
              <Input
                label="Phone / WhatsApp Number"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="+1 234 567 8900"
              />
              <Input
                label="Nationality"
                name="nationality"
                value={formData.nationality}
                onChange={handleInputChange}
                placeholder="e.g. Nigerian, Egyptian, Canadian"
              />
              <Input
                label="Date of Birth"
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleInputChange}
              />
            </div>

            <div className="flex justify-end pt-4">
              <Button onClick={nextStep} className="rounded-xl px-8 flex items-center gap-2">
                Next: Program Choice <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}

        {/* STEP 2: PROGRAM & UNIVERSITY CHOICE */}
        {step === 2 && (
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
            <h2 className="text-xl font-bold text-slate-900 border-b border-slate-100 pb-4">Step 2: Program & University Selection</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <Select
                label="Degree Level"
                name="degreeLevel"
                value={formData.degreeLevel}
                onChange={handleInputChange}
                options={[
                  { value: "BACHELOR", label: "Bachelor's Degree" },
                  { value: "MASTER", label: "Master's Degree" },
                  { value: "PHD", label: "PhD Degree" },
                ]}
              />

              <Select
                label="Preferred City"
                name="preferredCity"
                value={formData.preferredCity}
                onChange={handleInputChange}
                options={[
                  { value: "", label: "Any City in Türkiye" },
                  ...TURKISH_CITIES.map((c) => ({ value: c, label: c })),
                ]}
              />

              <Select
                label="Preferred University"
                name="universityId"
                value={formData.universityId}
                onChange={handleInputChange}
                options={[
                  { value: "", label: "-- Select University --" },
                  ...universities.map((u) => ({ value: u.id, label: `${u.name} (${u.city})` })),
                ]}
              />

              <Select
                label="Desired Program"
                name="programId"
                value={formData.programId}
                onChange={handleInputChange}
                options={[
                  { value: "", label: "-- Select Program --" },
                  ...programs
                    .filter((p) => !formData.universityId || p.universityId === formData.universityId)
                    .map((p) => ({ value: p.id, label: `${p.name} - $${p.tuitionFee}/yr (${p.degreeLevel})` })),
                ]}
              />
            </div>

            <div className="flex justify-between pt-4">
              <Button variant="outline" onClick={prevStep} className="rounded-xl flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" /> Back
              </Button>
              <Button onClick={nextStep} className="rounded-xl px-8 flex items-center gap-2">
                Next: Academic Info <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}

        {/* STEP 3: ACADEMIC INFORMATION */}
        {step === 3 && (
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
            <h2 className="text-xl font-bold text-slate-900 border-b border-slate-100 pb-4">Step 3: Academic Background</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <Input
                label="High School / Previous Institution Name"
                name="previousSchool"
                value={formData.previousSchool}
                onChange={handleInputChange}
                placeholder="e.g. International High School"
              />
              <Input
                label="GPA / Average Grade (%)"
                name="gpa"
                value={formData.gpa}
                onChange={handleInputChange}
                placeholder="e.g. 85% or 3.6 / 4.0"
              />
              <Input
                label="Graduation Year"
                name="graduationYear"
                value={formData.graduationYear}
                onChange={handleInputChange}
                placeholder="e.g. 2024"
              />
              <Input
                label="Language Test Score (IELTS, TOEFL, TÖMER, or None)"
                name="languageScore"
                value={formData.languageScore}
                onChange={handleInputChange}
                placeholder="e.g. IELTS 6.5 or Not Taken Yet"
              />
            </div>

            <div className="flex justify-between pt-4">
              <Button variant="outline" onClick={prevStep} className="rounded-xl flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" /> Back
              </Button>
              <Button onClick={nextStep} className="rounded-xl px-8 flex items-center gap-2">
                Next: Upload Documents <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}

        {/* STEP 4: UPLOAD DOCUMENTS */}
        {step === 4 && (
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
            <h2 className="text-xl font-bold text-slate-900 border-b border-slate-100 pb-4">Step 4: Upload Required Documents</h2>
            <p className="text-xs text-slate-500 mb-6">Supported formats: PDF, JPG, PNG (Max 10MB each). You can also upload missing documents later in your portal.</p>

            <div className="space-y-4">
              {[
                { type: "PASSPORT", label: "Valid Passport (Bio Page)" },
                { type: "DIPLOMA", label: "High School / Bachelor Diploma" },
                { type: "TRANSCRIPT", label: "Official Academic Transcript" },
                { type: "PASSPORT_PHOTO", label: "Biometric Passport Photo" },
                { type: "LANGUAGE_CERTIFICATE", label: "English / Turkish Certificate (Optional)" },
              ].map((doc) => (
                <div key={doc.type} className="p-4 rounded-2xl border border-slate-200 bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <span className="font-bold text-slate-900 text-sm block">{doc.label}</span>
                    <span className="text-xs text-slate-500">
                      {files[doc.type] ? files[doc.type]?.name : "No file chosen"}
                    </span>
                  </div>

                  <label className="cursor-pointer bg-white px-4 py-2 rounded-xl border border-slate-300 hover:bg-slate-100 text-xs font-bold text-slate-700 flex items-center gap-2 shrink-0">
                    <Upload className="w-3.5 h-3.5 text-blue-600" />
                    <span>Choose File</span>
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png,.webp"
                      onChange={(e) => handleFileChange(doc.type, e.target.files?.[0] || null)}
                      className="hidden"
                    />
                  </label>
                </div>
              ))}
            </div>

            <div className="flex justify-between pt-4">
              <Button variant="outline" onClick={prevStep} className="rounded-xl flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" /> Back
              </Button>
              <Button onClick={nextStep} className="rounded-xl px-8 flex items-center gap-2">
                Next: Review Application <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}

        {/* STEP 5: REVIEW & SUBMIT */}
        {step === 5 && (
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
            <h2 className="text-xl font-bold text-slate-900 border-b border-slate-100 pb-4">Step 5: Review & Submit Application</h2>

            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-xs text-slate-400 block">Full Name</span>
                  <span className="font-bold text-slate-900">{formData.fullName}</span>
                </div>
                <div>
                  <span className="text-xs text-slate-400 block">Email</span>
                  <span className="font-bold text-slate-900">{formData.email}</span>
                </div>
                <div>
                  <span className="text-xs text-slate-400 block">Degree Level</span>
                  <span className="font-bold text-slate-900">{formData.degreeLevel}</span>
                </div>
                <div>
                  <span className="text-xs text-slate-400 block">Selected University</span>
                  <span className="font-bold text-slate-900">{selectedUniObj?.name || "Any Suitable University"}</span>
                </div>
                <div>
                  <span className="text-xs text-slate-400 block">Selected Program</span>
                  <span className="font-bold text-slate-900">{selectedProgObj?.name || "Any Suitable Program"}</span>
                </div>
                <div>
                  <span className="text-xs text-slate-400 block">Uploaded Documents</span>
                  <span className="font-bold text-slate-900">
                    {Object.values(files).filter(Boolean).length} file(s) attached
                  </span>
                </div>
              </div>
            </div>

            <div className="flex justify-between pt-4">
              <Button variant="outline" onClick={prevStep} className="rounded-xl flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" /> Back
              </Button>
              <Button onClick={handleSubmit} isLoading={submitting} className="rounded-xl px-10 bg-emerald-600 hover:bg-emerald-500">
                Submit Application Now
              </Button>
            </div>
          </div>
        )}

        {/* STEP 6: SUCCESS CONFIRMATION */}
        {step === 6 && submittedApp && (
          <div className="bg-white p-10 rounded-3xl border border-slate-200 shadow-xl text-center space-y-6">
            <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <h2 className="text-3xl font-extrabold text-slate-900">Application Submitted!</h2>
            <p className="text-slate-600 max-w-md mx-auto">
              Your application has been received and registered under application number:
            </p>

            <div className="inline-block px-6 py-3 rounded-2xl bg-blue-50 border border-blue-200 font-extrabold text-2xl text-blue-700 tracking-wider">
              {submittedApp.applicationNumber}
            </div>

            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              An account has been created for your email. You can now log into your Student Portal to track real-time progress, chat with advisors, and upload missing documents.
            </p>

            <div className="pt-4 flex justify-center gap-4">
              <Button onClick={() => router.push("/portal")} size="lg" className="rounded-xl px-8">
                Go to Student Portal &rarr;
              </Button>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default function ApplyPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-slate-500">Loading application...</div>}>
      <ApplyFormContent />
    </Suspense>
  );
}
