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

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status") || "";
    const search = searchParams.get("search") || "";

    const where: any = {};

    if (status) {
      where.status = status;
    }

    if (search) {
      where.OR = [
        { applicationNumber: { contains: search } },
        { student: { firstName: { contains: search } } },
        { student: { lastName: { contains: search } } },
        { student: { user: { email: { contains: search } } } },
        { university: { name: { contains: search } } },
        { program: { name: { contains: search } } },
      ];
    }

    const applications = await prisma.application.findMany({
      where,
      include: {
        student: {
          include: { user: { select: { email: true } } },
        },
        university: true,
        program: true,
        documents: {
          include: { document: true },
        },
        assignedStaff: true,
        notes: {
          include: { admin: true },
          orderBy: { createdAt: "desc" },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return apiSuccess({ applications });
  } catch (error: any) {
    console.error("GET Admin Applications Error:", error);
    return apiError(error.message || "Failed to fetch admin applications", 500);
  }
}
