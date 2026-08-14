import { NextRequest } from "next/server";
import prisma from "@/lib/db";
import { getSessionFromRequest } from "@/lib/auth";
import { apiError, apiSuccess } from "@/lib/api-response";

export async function GET(req: NextRequest) {
  try {
    let session = await getSessionFromRequest(req, true);
    let isAdmin = true;

    if (!session) {
      session = await getSessionFromRequest(req, false);
      isAdmin = false;
    }

    if (!session) {
      return apiError("Not authenticated", 401);
    }

    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      include: {
        student: true,
        adminUser: true,
      },
    });

    if (!user) {
      return apiError("User not found", 404);
    }

    return apiSuccess({
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        student: user.student,
        adminUser: user.adminUser,
        mustChangePassword: user.adminUser?.mustChangePassword ?? false,
      },
    });
  } catch (error: any) {
    return apiError(error.message || "Failed to fetch user session", 500);
  }
}
