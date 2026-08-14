import { NextRequest } from "next/server";
import prisma from "@/lib/db";
import { apiError, apiSuccess } from "@/lib/api-response";
import { getSessionFromRequest } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const session = await getSessionFromRequest(req, false);
    if (!session) {
      return apiError("Unauthorized", 401);
    }

    const student = await prisma.student.findUnique({
      where: { userId: session.userId },
    });

    if (!student) return apiError("Student not found", 404);

    const notifications = await prisma.notification.findMany({
      where: { studentId: student.id },
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    return apiSuccess({ notifications });
  } catch (error: any) {
    return apiError(error.message || "Failed to fetch notifications", 500);
  }
}
