import type { MetadataRoute } from "next";
import prisma from "@/lib/db";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://bunited.com";

  const staticPages = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 1 },
    { url: `${baseUrl}/universities`, lastModified: new Date(), changeFrequency: "daily" as const, priority: 0.9 },
    { url: `${baseUrl}/programs`, lastModified: new Date(), changeFrequency: "daily" as const, priority: 0.9 },
    { url: `${baseUrl}/scholarships`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.8 },
    { url: `${baseUrl}/apply`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.9 },
    { url: `${baseUrl}/login`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.5 },
    { url: `${baseUrl}/register`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.5 },
  ];

  try {
    const universities = await prisma.university.findMany({
      where: { isActive: true },
      select: { slug: true, updatedAt: true },
    });

    const programs = await prisma.program.findMany({
      where: { isActive: true },
      select: { slug: true, updatedAt: true },
    });

    const scholarships = await prisma.scholarship.findMany({
      where: { isActive: true },
      select: { slug: true, updatedAt: true },
    });

    return [
      ...staticPages,
      ...universities.map((u) => ({
        url: `${baseUrl}/universities/${u.slug}`,
        lastModified: u.updatedAt,
        changeFrequency: "weekly" as const,
        priority: 0.8,
      })),
      ...programs.map((p) => ({
        url: `${baseUrl}/programs/${p.slug}`,
        lastModified: p.updatedAt,
        changeFrequency: "weekly" as const,
        priority: 0.7,
      })),
      ...scholarships.map((s) => ({
        url: `${baseUrl}/scholarships/${s.slug}`,
        lastModified: s.updatedAt,
        changeFrequency: "monthly" as const,
        priority: 0.6,
      })),
    ];
  } catch {
    return staticPages;
  }
}
