import { NextRequest } from "next/server";
import prisma from "@/lib/db";
import { apiError, apiSuccess } from "@/lib/api-response";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const scholarships = await prisma.scholarship.findMany({
      where: { isActive: true },
      orderBy: { createdAt: "desc" },
    });

    return apiSuccess({ scholarships });
  } catch (error: any) {
    return apiError(error.message || "Failed to fetch scholarships", 500);
  }
}
