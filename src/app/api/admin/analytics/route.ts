import { NextRequest } from "next/server";
import prisma from "@/lib/db";
import { apiError, apiSuccess } from "@/lib/api-response";
import { getSessionFromRequest } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const session = await getSessionFromRequest(req, true);
    if (!session || session.role !== "ADMIN") {
      return apiError("Unauthorized", 401);
    }

    const totalStudents = await prisma.student.count();
    const totalApplications = await prisma.application.count();
    const newApplications = await prisma.application.count({ where: { status: "DOCUMENTS_REQUIRED" } });
    const underReview = await prisma.application.count({ where: { status: "UNDER_REVIEW" } });
    const accepted = await prisma.application.count({ where: { status: "ACCEPTED" } });
    const rejected = await prisma.application.count({ where: { status: "REJECTED" } });
    const pendingDocs = await prisma.applicationDocument.count({ where: { status: "PENDING" } });

    const totalRevenue = await prisma.payment.aggregate({
      _sum: { amount: true },
      where: { status: "COMPLETED" },
    });

    const applicationsByUniversityRaw = await prisma.application.groupBy({
      by: ["universityId"],
      _count: { id: true },
    });

    const universities = await prisma.university.findMany({
      select: { id: true, name: true },
    });

    const uniMap = new Map(universities.map((u) => [u.id, u.name]));
    const applicationsByUniversity = applicationsByUniversityRaw.map((item) => ({
      university: item.universityId ? uniMap.get(item.universityId) || "Unknown" : "Unspecified",
      count: item._count.id,
    }));

    const applicationsByStatus = await prisma.application.groupBy({
      by: ["status"],
      _count: { id: true },
    });

    // Mock/monthly stats for charts
    const monthlyStats = [
      { month: "Jan", applications: 12, revenue: 1800 },
      { month: "Feb", applications: 18, revenue: 2700 },
      { month: "Mar", applications: 25, revenue: 3750 },
      { month: "Apr", applications: 32, revenue: 4800 },
      { month: "May", applications: 45, revenue: 6750 },
      { month: "Jun", applications: 60, revenue: 9000 },
      { month: "Jul", applications: 52, revenue: 7800 },
      { month: "Aug", applications: 78, revenue: 11700 },
    ];

    const countryStats = [
      { country: "Nigeria", count: 42 },
      { country: "Somalia", count: 28 },
      { country: "Pakistan", count: 25 },
      { country: "Iran", count: 20 },
      { country: "Egypt", count: 18 },
      { country: "Others", count: 35 },
    ];

    return apiSuccess({
      metrics: {
        totalStudents,
        totalApplications,
        newApplications,
        underReview,
        accepted,
        rejected,
        pendingDocs,
        totalRevenue: totalRevenue._sum.amount || 0,
      },
      charts: {
        monthlyStats,
        applicationsByUniversity,
        applicationsByStatus,
        countryStats,
      },
    });
  } catch (error: any) {
    console.error("GET Analytics Error:", error);
    return apiError(error.message || "Failed to fetch analytics", 500);
  }
}
