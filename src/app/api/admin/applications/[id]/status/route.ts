import { NextRequest } from "next/server";
import prisma from "@/lib/db";
import { apiError, apiSuccess } from "@/lib/api-response";
import { getSessionFromRequest, createAuditLog } from "@/lib/auth";
import { APPLICATION_STATUSES } from "@/lib/constants";

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
    const { status, note, assignedStaffId } = body;

    const application = await prisma.application.findUnique({
      where: { id },
      include: { student: true, program: true },
    });

    if (!application) {
      return apiError("Application not found", 404);
    }

    const updateData: any = {};
    if (status) {
      updateData.status = status;
      const statusMeta = (APPLICATION_STATUSES as any)[status];
      if (statusMeta) {
        updateData.progressStep = statusMeta.step + 1;
      }
    }

    if (assignedStaffId !== undefined) {
      updateData.assignedStaffId = assignedStaffId || null;
    }

    const updatedApplication = await prisma.application.update({
      where: { id },
      data: updateData,
      include: {
        student: true,
        university: true,
        program: true,
      },
    });

    // Add note if provided
    if (note && note.trim()) {
      const adminUser = await prisma.adminUser.findUnique({
        where: { userId: session.userId },
      });
      if (adminUser) {
        await prisma.applicationNote.create({
          data: {
            content: note,
            isInternal: true,
            applicationId: id,
            adminId: adminUser.id,
          },
        });
      }
    }

    // Send Notification to student
    if (status && status !== application.status) {
      await prisma.notification.create({
        data: {
          title: `Application Status Updated: ${status.replace(/_/g, " ")}`,
          message: `Your application (${application.applicationNumber}) status has changed to ${status.replace(/_/g, " ")}.`,
          type: "APPLICATION_UPDATE",
          studentId: application.studentId,
          applicationId: application.id,
        },
      });
    }

    await createAuditLog({
      action: "UPDATE_APPLICATION_STATUS",
      entity: "Application",
      entityId: id,
      details: { oldStatus: application.status, newStatus: status, note },
      userId: session.userId,
    });

    return apiSuccess({ application: updatedApplication }, "Status updated successfully");
  } catch (error: any) {
    console.error("Update Application Status Error:", error);
    return apiError(error.message || "Failed to update application status", 500);
  }
}
