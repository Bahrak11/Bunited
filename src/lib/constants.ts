export const APPLICATION_STATUSES = {
  DRAFT: { label: "Draft", color: "gray", step: 0 },
  DOCUMENTS_REQUIRED: { label: "Documents Required", color: "amber", step: 1 },
  UNDER_REVIEW: { label: "Under Review", color: "blue", step: 2 },
  SUBMITTED_TO_UNIVERSITY: { label: "Submitted to University", color: "indigo", step: 3 },
  CONDITIONAL_ADMISSION: { label: "Conditional Admission", color: "purple", step: 4 },
  ACCEPTED: { label: "Accepted", color: "green", step: 5 },
  REJECTED: { label: "Rejected", color: "red", step: 4 },
  COMPLETED: { label: "Completed", color: "emerald", step: 6 },
} as const;

export const PROGRESS_STEPS = [
  { id: 1, label: "Application Started", key: "started" },
  { id: 2, label: "Documents Uploaded", key: "documents" },
  { id: 3, label: "Bunited Review", key: "review" },
  { id: 4, label: "University Application", key: "university" },
  { id: 5, label: "Admission Decision", key: "decision" },
  { id: 6, label: "Visa Preparation", key: "visa" },
  { id: 7, label: "Enrollment Complete", key: "enrollment" },
] as const;

export const DOCUMENT_TYPES = {
  PASSPORT: "Passport",
  DIPLOMA: "Diploma / Certificate",
  TRANSCRIPT: "Academic Transcript",
  PASSPORT_PHOTO: "Passport Photo",
  LANGUAGE_CERTIFICATE: "English/Turkish Certificate",
  OTHER: "Other Supporting Documents",
} as const;

export const DEGREE_LEVELS = {
  BACHELOR: "Bachelor's",
  MASTER: "Master's",
  PHD: "PhD",
} as const;

export const UNIVERSITY_TYPES = {
  PUBLIC: "Public",
  PRIVATE: "Private",
} as const;

export const TURKISH_CITIES = [
  "Istanbul",
  "Ankara",
  "Izmir",
  "Antalya",
  "Bursa",
  "Konya",
  "Adana",
  "Gaziantep",
  "Trabzon",
  "Eskisehir",
] as const;

export const ALLOWED_FILE_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp",
] as const;

export const MAX_FILE_SIZE = parseInt(process.env.MAX_FILE_SIZE_MB || "10") * 1024 * 1024;

export const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/universities", label: "Universities" },
  { href: "/programs", label: "Programs" },
  { href: "/scholarships", label: "Scholarships" },
  { href: "/apply", label: "Apply Now" },
] as const;

export const WHY_CHOOSE = [
  {
    title: "Expert Guidance",
    description: "Dedicated advisors with deep knowledge of Turkish higher education and visa processes.",
    icon: "GraduationCap",
  },
  {
    title: "500+ Programs",
    description: "Access to hundreds of accredited programs across public and private universities.",
    icon: "BookOpen",
  },
  {
    title: "Scholarship Support",
    description: "We help you identify and apply for scholarships to reduce your tuition costs.",
    icon: "Award",
  },
  {
    title: "End-to-End Service",
    description: "From application to enrollment — we guide you through every step of your journey.",
    icon: "Globe",
  },
  {
    title: "Fast Processing",
    description: "Streamlined application process with real-time tracking and status updates.",
    icon: "Zap",
  },
  {
    title: "24/7 Support",
    description: "Reach us anytime via WhatsApp, email, or your personal student dashboard.",
    icon: "MessageCircle",
  },
] as const;

export const APPLICATION_PROCESS = [
  {
    step: 1,
    title: "Free Consultation",
    description: "Tell us about your goals and we'll recommend the best universities and programs.",
  },
  {
    step: 2,
    title: "Choose Your Program",
    description: "Browse our database and select your preferred university and degree program.",
  },
  {
    step: 3,
    title: "Submit Application",
    description: "Complete our online application form and upload required documents.",
  },
  {
    step: 4,
    title: "University Review",
    description: "We submit your application to the university and track the admission process.",
  },
  {
    step: 5,
    title: "Receive Offer",
    description: "Get your acceptance letter and begin visa and enrollment preparations.",
  },
  {
    step: 6,
    title: "Start Your Journey",
    description: "Arrive in Türkiye and begin your international education adventure!",
  },
] as const;

export const FAQ_ITEMS = [
  {
    question: "Why should I study in Türkiye?",
    answer: "Türkiye offers world-class universities, affordable tuition, rich cultural heritage, and strategic location bridging Europe and Asia. Many programs are taught in English, and the country welcomes international students with open arms.",
  },
  {
    question: "Do I need to speak Turkish?",
    answer: "Not necessarily. Many universities offer programs entirely in English. However, learning basic Turkish will enhance your experience. We can help you find programs in your preferred language.",
  },
  {
    question: "What documents do I need to apply?",
    answer: "Typically you'll need a valid passport, academic transcripts, diploma, passport photo, and language proficiency certificate (if applicable). Specific requirements vary by university and program.",
  },
  {
    question: "Are scholarships available for international students?",
    answer: "Yes! Türkiye Scholarships, university-specific grants, and Bunited partner scholarships are available. Our advisors will help you identify opportunities you qualify for.",
  },
  {
    question: "How long does the application process take?",
    answer: "The complete process typically takes 2-4 months from initial application to receiving an acceptance letter. Timeline varies by university and intake period.",
  },
  {
    question: "Can Bunited help with visa applications?",
    answer: "Absolutely. Once you receive your acceptance letter, we guide you through the student visa application process, document preparation, and pre-departure orientation.",
  },
] as const;
