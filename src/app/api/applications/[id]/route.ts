import { NextRequest } from "next/server";
import prisma from "@/lib/db";
import { requireAuth } from "@/lib/auth";
import { apiSuccess, apiError } from "@/lib/api-response";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAuth(request);
  if ("error" in auth) return apiError(auth.error, auth.status);

  try {
    const { id } = await params;

    const application = await prisma.application.findFirst({
      where: {
        OR: [{ id }, { applicationNumber: id }],
      },
      include: {
        university: true,
        program: true,
        student: true,
        documents: { include: { document: true } },
        payments: true,
        messages: { orderBy: { createdAt: "asc" } },
      },
    });

    if (!application) return apiError("Application not found", 404);

    if (auth.session.role === "STUDENT") {
      const student = await prisma.student.findUnique({
        where: { userId: auth.session.userId },
      });
      if (application.studentId !== student?.id) {
        return apiError("Forbidden", 403);
      }
    }

    return apiSuccess(application);
  } catch {
    return apiError("Failed to fetch application", 500);
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAuth(request, ["STUDENT"]);
  if ("error" in auth) return apiError(auth.error, auth.status);

  try {
    const { id } = await params;
    const body = await request.json();
    const { step, data, submit } = body;

    const student = await prisma.student.findUnique({
      where: { userId: auth.session.userId },
    });
    if (!student) return apiError("Student not found", 404);

    const existing = await prisma.application.findFirst({
      where: { OR: [{ id }, { applicationNumber: id }], studentId: student.id },
    });
    if (!existing) return apiError("Application not found", 404);

    const updateData: Record<string, unknown> = { progressStep: step || existing.progressStep };

    if (data) {
      if (data.degreeLevel) updateData.degreeLevel = data.degreeLevel;
      if (data.universityId) updateData.universityId = data.universityId;
      if (data.programId) updateData.programId = data.programId;
      if (data.preferredCity) updateData.preferredCity = data.preferredCity;
      if (data.academicInfo) updateData.academicInfo = data.academicInfo;
    }

    if (submit) {
      updateData.status = "DOCUMENTS_REQUIRED";
      updateData.submittedAt = new Date();
      updateData.progressStep = 2;

      await prisma.notification.create({
        data: {
          title: "Application Submitted",
          message: `Your application ${existing.applicationNumber} has been submitted successfully.`,
          type: "APPLICATION_UPDATE",
          studentId: student.id,
          applicationId: existing.id,
        },
      });
    }

    const application = await prisma.application.update({
      where: { id: existing.id },
      data: updateData,
      include: { university: true, program: true },
    });

    return apiSuccess(application);
  } catch {
    return apiError("Failed to update application", 500);
  }
}
