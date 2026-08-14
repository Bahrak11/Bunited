import { NextRequest } from "next/server";
import prisma from "@/lib/db";
import { apiError, apiSuccess } from "@/lib/api-response";
import { getSessionFromRequest } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const applicationId = searchParams.get("applicationId");
    const studentIdParam = searchParams.get("studentId");

    let session = await getSessionFromRequest(req, true);
    let isAdmin = true;

    if (!session) {
      session = await getSessionFromRequest(req, false);
      isAdmin = false;
    }

    if (!session) {
      return apiError("Unauthorized", 401);
    }

    let studentId: string | undefined;

    if (isAdmin) {
      studentId = studentIdParam || undefined;
    } else {
      const student = await prisma.student.findUnique({
        where: { userId: session.userId },
      });
      if (!student) return apiError("Student not found", 404);
      studentId = student.id;
    }

    const where: any = {};
    if (studentId) where.studentId = studentId;
    if (applicationId) where.applicationId = applicationId;

    const messages = await prisma.message.findMany({
      where,
      include: {
        admin: {
          select: { firstName: true, lastName: true },
        },
        student: {
          select: { firstName: true, lastName: true },
        },
      },
      orderBy: { createdAt: "asc" },
    });

    return apiSuccess({ messages });
  } catch (error: any) {
    return apiError(error.message || "Failed to fetch messages", 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    let session = await getSessionFromRequest(req, true);
    let isAdmin = true;

    if (!session) {
      session = await getSessionFromRequest(req, false);
      isAdmin = false;
    }

    if (!session) {
      return apiError("Unauthorized", 401);
    }

    const body = await req.json();
    const { content, applicationId, studentId: targetStudentId } = body;

    if (!content || !content.trim()) {
      return apiError("Message content is required", 400);
    }

    let studentId: string;
    let adminId: string | null = null;

    if (isAdmin) {
      if (!targetStudentId) {
        return apiError("Target student ID is required for admin message", 400);
      }
      studentId = targetStudentId;
      const adminUser = await prisma.adminUser.findUnique({
        where: { userId: session.userId },
      });
      adminId = adminUser?.id || null;
    } else {
      const student = await prisma.student.findUnique({
        where: { userId: session.userId },
      });
      if (!student) return apiError("Student not found", 404);
      studentId = student.id;
    }

    const message = await prisma.message.create({
      data: {
        content,
        isFromAdmin: isAdmin,
        studentId,
        adminId,
        applicationId: applicationId || null,
      },
      include: {
        admin: { select: { firstName: true, lastName: true } },
        student: { select: { firstName: true, lastName: true } },
      },
    });

    // Notify student if sent from admin
    if (isAdmin) {
      await prisma.notification.create({
        data: {
          title: "New Message from Bunited Support",
          message: content.length > 80 ? `${content.substring(0, 80)}...` : content,
          type: "MESSAGE",
          studentId,
          applicationId: applicationId || null,
        },
      });
    }

    return apiSuccess({ message }, "Message sent", 201);
  } catch (error: any) {
    return apiError(error.message || "Failed to send message", 500);
  }
}
