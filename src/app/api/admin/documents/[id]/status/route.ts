import { NextRequest } from "next/server";
import prisma from "@/lib/db";
import { apiError, apiSuccess } from "@/lib/api-response";
import { getSessionFromRequest } from "@/lib/auth";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSessionFromRequest(req, true);
    if (!session || session.role !== "ADMIN") {
      return apiError("Unauthorized", 401);
    }

    const { id } = await params;
    const body = await req.json();
    const { status, reviewNote } = body;

    if (!status) {
      return apiError("Document status is required", 400);
    }

    const appDoc = await prisma.applicationDocument.update({
      where: { id },
      data: {
        status,
        reviewNote: reviewNote || null,
        reviewedAt: new Date(),
      },
      include: {
        application: true,
      },
    });

    // Notify student
    await prisma.notification.create({
      data: {
        title: `Document Status Updated: ${appDoc.type}`,
        message: `Your ${appDoc.type} document has been set to ${status}. ${reviewNote ? `Note: ${reviewNote}` : ""}`,
        type: "DOCUMENT_UPDATE",
        studentId: appDoc.application.studentId,
        applicationId: appDoc.applicationId,
      },
    });

    return apiSuccess({ document: appDoc }, "Document status updated");
  } catch (error: any) {
    return apiError(error.message || "Failed to update document status", 500);
  }
}
