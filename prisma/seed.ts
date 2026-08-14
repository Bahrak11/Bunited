import { PrismaClient, UniversityType, DegreeLevel } from "@prisma/client";
import bcrypt from "bcryptjs";
import { slugify } from "../src/lib/utils";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding Bunited database...");

  const adminEmail = process.env.ADMIN_EMAIL || "Bgoldern99@gmail.com";
  const adminPassword = process.env.ADMIN_PASSWORD || "Cyrise99";

  const passwordHash = await bcrypt.hash(adminPassword, 12);

  const adminUser = await prisma.user.upsert({
    where: { email: adminEmail.toLowerCase() },
    update: {},
    create: {
      email: adminEmail.toLowerCase(),
      passwordHash,
      role: "ADMIN",
      adminUser: {
        create: {
          firstName: process.env.ADMIN_FIRST_NAME || "Admin",
          lastName: process.env.ADMIN_LAST_NAME || "Bunited",
          mustChangePassword: true,
        },
      },
    },
  });

  console.log(`✅ Admin user created: ${adminUser.email}`);

  const universities = [
    {
      name: "Istanbul Medipol University",
      city: "Istanbul",
      type: "PRIVATE" as UniversityType,
      description:
        "Istanbul Medipol University is a leading private university in Istanbul, renowned for its medical and health sciences programs. With state-of-the-art facilities and international accreditation, Medipol offers world-class education to students from over 100 countries.",
      logoUrl: "https://upload.wikimedia.org/wikipedia/en/thumb/8/8a/Medipol_University_logo.png/220px-Medipol_University_logo.png",
      coverImageUrl: "https://images.unsplash.com/photo-1562774053-701939374585?w=1200&h=600&fit=crop",
      ranking: 15,
      website: "https://www.medipol.edu.tr",
      hasScholarship: true,
      accommodationInfo:
        "On-campus dormitories available for international students. Monthly cost ranges from $200-$400 including utilities. Off-campus options also available in nearby districts.",
      scholarshipInfo:
        "Merit-based scholarships up to 50% tuition waiver. Türkiye Scholarships eligible. Early application discount of 10% available.",
      admissionRequirements:
        "High school diploma with minimum 60% average. Valid passport. English proficiency (IELTS 5.5+ or TOEFL 66+). For Turkish programs, TÖMER certificate required.",
    },
    {
      name: "Istanbul Technical University",
      city: "Istanbul",
      type: "PUBLIC" as UniversityType,
      description:
        "Founded in 1773, Istanbul Technical University (ITU) is one of Türkiye's oldest and most prestigious technical universities. ITU excels in engineering, architecture, and sciences with strong industry connections and research output.",
      logoUrl: "https://upload.wikimedia.org/wikipedia/en/thumb/4/4e/Istanbul_Technical_University_logo.svg/220px-Istanbul_Technical_University_logo.svg.png",
      coverImageUrl: "https://images.unsplash.com/photo-1541339907198-e08756dedf77?w=1200&h=600&fit=crop",
      ranking: 3,
      website: "https://www.itu.edu.tr",
      hasScholarship: true,
      accommodationInfo:
        "University dormitories in Maslak and Ayazağa campuses. Application required before semester start. Monthly fee approximately $150-$250.",
      scholarshipInfo:
        "Full tuition waiver for top academic performers. Türkiye Scholarships program partner. Research assistantships available for graduate students.",
      admissionRequirements:
        "High school diploma equivalent to Turkish system. YÖS exam or SAT scores. English proficiency for English-medium programs. Portfolio required for architecture.",
    },
    {
      name: "Middle East Technical University",
      city: "Ankara",
      type: "PUBLIC" as UniversityType,
      description:
        "Middle East Technical University (METU) is consistently ranked as Türkiye's top university. Located in Ankara, METU is known for rigorous academic standards, vibrant campus life, and producing leaders in engineering, natural sciences, and social sciences.",
      logoUrl: "https://upload.wikimedia.org/wikipedia/en/thumb/4/4f/Middle_East_Technical_University_logo.svg/220px-Middle_East_Technical_University_logo.svg.png",
      coverImageUrl: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1200&h=600&fit=crop",
      ranking: 1,
      website: "https://www.metu.edu.tr",
      hasScholarship: true,
      accommodationInfo:
        "Extensive dormitory network on campus. Priority given to international students. Monthly cost $100-$200. Cafeteria meal plans available.",
      scholarshipInfo:
        "Türkiye Scholarships fully cover tuition and living expenses. METU merit scholarships for exceptional candidates. Graduate research scholarships available.",
      admissionRequirements:
        "Recognized high school diploma. YÖS examination required. English proficiency (IELTS 6.0+). Strong mathematics background for engineering programs.",
    },
    {
      name: "Koç University",
      city: "Istanbul",
      type: "PRIVATE" as UniversityType,
      description:
        "Koç University is a leading private research university offering world-class education in English. With a beautiful campus on the Bosphorus, Koç provides an American-style liberal arts education combined with strong professional programs.",
      logoUrl: "https://upload.wikimedia.org/wikipedia/en/thumb/5/5e/Ko%C3%A7_University_logo.svg/220px-Ko%C3%A7_University_logo.svg.png",
      coverImageUrl: "https://images.unsplash.com/photo-1607237138185-eedd9c632b0f?w=1200&h=600&fit=crop",
      ranking: 5,
      website: "https://www.ku.edu.tr",
      hasScholarship: true,
      accommodationInfo:
        "Modern on-campus residences with single and double rooms. Full board options available. Monthly cost $400-$600.",
      scholarshipInfo:
        "Need-based and merit scholarships covering 25%-100% of tuition. Koç University International Scholarships for outstanding applicants.",
      admissionRequirements:
        "High school diploma with strong academic record. SAT or ACT scores recommended. English proficiency (IELTS 6.5+ or TOEFL 80+). Personal statement and recommendation letters.",
    },
    {
      name: "Ankara University",
      city: "Ankara",
      type: "PUBLIC" as UniversityType,
      description:
        "Ankara University, founded in 1946, is one of Türkiye's first modern universities. It offers a comprehensive range of programs in medicine, law, agriculture, and humanities with a strong tradition of academic excellence.",
      logoUrl: "https://upload.wikimedia.org/wikipedia/en/thumb/a/a7/Ankara_University_logo.svg/220px-Ankara_University_logo.svg.png",
      coverImageUrl: "https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?w=1200&h=600&fit=crop",
      ranking: 8,
      website: "https://www.ankara.edu.tr",
      hasScholarship: true,
      accommodationInfo:
        "Multiple dormitory buildings across campus locations. Affordable rates for international students at $80-$150/month.",
      scholarshipInfo:
        "Türkiye Scholarships available. University merit awards for top international applicants.",
      admissionRequirements:
        "Valid high school certificate. YÖS exam results. Language proficiency certificate. Health insurance documentation.",
    },
    {
      name: "Sabancı University",
      city: "Istanbul",
      type: "PRIVATE" as UniversityType,
      description:
        "Sabancı University offers an innovative, interdisciplinary education model. With all programs taught in English, Sabancı emphasizes research, entrepreneurship, and global perspectives in a stunning campus setting in Tuzla, Istanbul.",
      logoUrl: "https://upload.wikimedia.org/wikipedia/en/thumb/8/8d/Sabanc%C4%B1_University_logo.svg/220px-Sabanc%C4%B1_University_logo.svg.png",
      coverImageUrl: "https://images.unsplash.com/photo-1564981797816-1043664bf78d?w=1200&h=600&fit=crop",
      ranking: 6,
      website: "https://www.sabanciuniv.edu",
      hasScholarship: true,
      accommodationInfo:
        "On-campus housing with modern amenities. Single rooms with private bathrooms. Monthly cost $350-$500 including meals.",
      scholarshipInfo:
        "Full and partial scholarships based on academic merit. Sabancı University Scholarship Program covers up to 100% tuition.",
      admissionRequirements:
        "High school diploma with minimum GPA 3.0/4.0. SAT recommended. IELTS 6.5+ or TOEFL 80+. Online application with essays.",
    },
    {
      name: "Ege University",
      city: "Izmir",
      type: "PUBLIC" as UniversityType,
      description:
        "Located in the beautiful coastal city of Izmir, Ege University is one of Türkiye's largest and most comprehensive state universities. Known for agriculture, medicine, and engineering programs with strong Erasmus partnerships.",
      logoUrl: "https://upload.wikimedia.org/wikipedia/en/thumb/7/7e/Ege_University_logo.svg/220px-Ege_University_logo.svg.png",
      coverImageUrl: "https://images.unsplash.com/photo-1523580495183-7fccf8a2d1d0?w=1200&h=600&fit=crop",
      ranking: 12,
      website: "https://www.ege.edu.tr",
      hasScholarship: true,
      accommodationInfo:
        "University dormitories in Bornova campus. Low-cost options at $60-$120/month. Beautiful Mediterranean climate year-round.",
      scholarshipInfo:
        "Türkiye Scholarships partner. Erasmus+ grants for European exchange. Research scholarships for graduate students.",
      admissionRequirements:
        "High school diploma recognized by Turkish authorities. YÖS or equivalent exam. English/Turkish language certificate depending on program.",
    },
    {
      name: "Bahçeşehir University",
      city: "Istanbul",
      type: "PRIVATE" as UniversityType,
      description:
        "Bahçeşehir University (BAU) is a global university with campuses in Istanbul, Berlin, and other cities. Known for its cosmopolitan environment, BAU offers programs in English with strong industry connections and internship opportunities.",
      logoUrl: "https://upload.wikimedia.org/wikipedia/en/thumb/9/9e/Bah%C3%A7e%C5%9Fehir_University_logo.svg/220px-Bah%C3%A7e%C5%9Fehir_University_logo.svg.png",
      coverImageUrl: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1200&h=600&fit=crop",
      ranking: 18,
      website: "https://www.bau.edu.tr",
      hasScholarship: true,
      accommodationInfo:
        "Partner dormitories near Beşiktaş and Galata campuses. Assistance provided for finding suitable accommodation.",
      scholarshipInfo:
        "BAU Global Scholarship up to 50%. Early bird discounts. Sports and arts scholarships available.",
      admissionRequirements:
        "High school graduation certificate. English proficiency test. Online interview for some programs. Valid passport and photos.",
    },
  ];

  for (const uni of universities) {
    const slug = slugify(uni.name);
    await prisma.university.upsert({
      where: { slug },
      update: uni,
      create: {
        ...uni,
        slug,
        applicationDeadline: new Date("2026-09-01"),
        faculties: {
          create: [
            { name: "Faculty of Engineering" },
            { name: "Faculty of Medicine" },
            { name: "Faculty of Business" },
          ],
        },
      },
    });
  }

  console.log(`✅ ${universities.length} universities seeded`);

  const allUniversities = await prisma.university.findMany({
    include: { faculties: true },
  });

  const programs = [
    { name: "Computer Engineering", field: "Engineering", degreeLevel: "BACHELOR" as DegreeLevel, language: "English", tuitionFee: 4500, duration: "4 years" },
    { name: "Medicine", field: "Health Sciences", degreeLevel: "BACHELOR" as DegreeLevel, language: "English", tuitionFee: 18000, duration: "6 years" },
    { name: "Business Administration", field: "Business", degreeLevel: "BACHELOR" as DegreeLevel, language: "English", tuitionFee: 3500, duration: "4 years" },
    { name: "Mechanical Engineering", field: "Engineering", degreeLevel: "BACHELOR" as DegreeLevel, language: "English", tuitionFee: 4000, duration: "4 years" },
    { name: "Architecture", field: "Architecture", degreeLevel: "BACHELOR" as DegreeLevel, language: "English", tuitionFee: 5000, duration: "4 years" },
    { name: "International Relations", field: "Social Sciences", degreeLevel: "BACHELOR" as DegreeLevel, language: "English", tuitionFee: 3000, duration: "4 years" },
    { name: "Computer Engineering", field: "Engineering", degreeLevel: "MASTER" as DegreeLevel, language: "English", tuitionFee: 5500, duration: "2 years" },
    { name: "MBA", field: "Business", degreeLevel: "MASTER" as DegreeLevel, language: "English", tuitionFee: 8000, duration: "2 years" },
    { name: "Data Science", field: "Engineering", degreeLevel: "MASTER" as DegreeLevel, language: "English", tuitionFee: 6000, duration: "2 years" },
    { name: "Electrical Engineering", field: "Engineering", degreeLevel: "PHD" as DegreeLevel, language: "English", tuitionFee: 7000, duration: "4 years" },
  ];

  for (const uni of allUniversities) {
    const engineeringFaculty = uni.faculties.find((f) =>
      f.name.includes("Engineering")
    );
    const medicineFaculty = uni.faculties.find((f) =>
      f.name.includes("Medicine")
    );
    const businessFaculty = uni.faculties.find((f) =>
      f.name.includes("Business")
    );

    for (const prog of programs) {
      const slug = `${slugify(uni.name)}-${slugify(prog.name)}-${prog.degreeLevel.toLowerCase()}`;
      let facultyId = engineeringFaculty?.id;
      if (prog.field === "Health Sciences") facultyId = medicineFaculty?.id;
      if (prog.field === "Business") facultyId = businessFaculty?.id;

      const tuitionMultiplier = uni.type === "PUBLIC" ? 0.6 : 1;

      await prisma.program.upsert({
        where: { slug },
        update: {},
        create: {
          slug,
          name: prog.name,
          field: prog.field,
          degreeLevel: prog.degreeLevel,
          language: prog.language,
          tuitionFee: Math.round(prog.tuitionFee * tuitionMultiplier),
          duration: prog.duration,
          description: `${prog.name} program at ${uni.name}. A comprehensive ${prog.degreeLevel.toLowerCase()} degree program taught in ${prog.language}.`,
          requirements: "High school diploma, language proficiency certificate, valid passport.",
          hasScholarship: uni.hasScholarship,
          universityId: uni.id,
          facultyId,
        },
      });
    }
  }

  console.log("✅ Programs seeded");

  const scholarships = [
    {
      name: "Türkiye Scholarships",
      slug: "turkiye-scholarships",
      description: "The Türkiye Scholarships program provides comprehensive scholarships for international students to study at Turkish universities at all degree levels.",
      eligibility: "International students from all countries except Turkish citizens and those who have lost Turkish citizenship. Age limits: 21 for undergraduate, 30 for master's, 35 for PhD.",
      benefits: "Full tuition waiver, monthly stipend ($350-$600), accommodation, health insurance, one-year Turkish language course, and round-trip flight ticket.",
      requirements: "Online application, academic transcripts, language proficiency, motivation letter, and recommendation letters.",
      instructions: "Apply through the official Türkiye Scholarships portal at turkiyeburslari.gov.tr during the application period (usually January-March).",
      deadline: new Date("2026-03-15"),
    },
    {
      name: "Bunited Excellence Scholarship",
      slug: "bunited-excellence-scholarship",
      description: "Bunited offers exclusive scholarships to outstanding international students applying through our agency to partner universities.",
      eligibility: "Students with GPA above 3.5/4.0 applying to Bunited partner universities for undergraduate or graduate programs.",
      benefits: "Up to 30% tuition reduction at partner universities, free application processing, and priority admission support.",
      requirements: "Complete Bunited application, academic transcripts, two recommendation letters, and personal statement.",
      instructions: "Apply through Bunited's application portal. Scholarship consideration is automatic for eligible applicants.",
      deadline: new Date("2026-08-31"),
    },
    {
      name: "Medipol University Merit Scholarship",
      slug: "medipol-merit-scholarship",
      description: "Istanbul Medipol University offers merit-based scholarships for high-achieving international students in health sciences and engineering programs.",
      eligibility: "International students with strong academic records applying to Medipol University undergraduate or graduate programs.",
      benefits: "25%-50% tuition waiver for the entire program duration based on academic merit.",
      requirements: "Medipol University admission, GPA above 3.0, and scholarship application form.",
      instructions: "Apply to Medipol University through Bunited and indicate scholarship interest in your application.",
      deadline: new Date("2026-07-01"),
    },
    {
      name: "Koç University International Scholarship",
      slug: "koc-international-scholarship",
      description: "Koç University provides need-based and merit-based scholarships to talented international students from diverse backgrounds.",
      eligibility: "All international applicants to Koç University undergraduate programs with demonstrated financial need or academic excellence.",
      benefits: "Coverage from 25% to 100% of tuition fees. Renewable annually based on academic performance.",
      requirements: "Koç University application, financial need documentation (for need-based), academic records.",
      instructions: "Submit scholarship application alongside university admission application through Bunited.",
      deadline: new Date("2026-06-15"),
    },
  ];

  for (const scholarship of scholarships) {
    await prisma.scholarship.upsert({
      where: { slug: scholarship.slug },
      update: scholarship,
      create: scholarship,
    });
  }

  console.log(`✅ ${scholarships.length} scholarships seeded`);
  console.log("🎉 Seeding complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
