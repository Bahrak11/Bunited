import { NextRequest } from "next/server";
import prisma from "@/lib/db";
import { apiError, apiSuccess } from "@/lib/api-response";
import { getSessionFromRequest } from "@/lib/auth";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const university = await prisma.university.findFirst({
      where: {
        OR: [{ id }, { slug: id }],
      },
      include: {
        faculties: {
          include: {
            programs: true,
          },
        },
        programs: true,
      },
    });

    if (!university) {
      return apiError("University not found", 404);
    }

    return apiSuccess({ university });
  } catch (error: any) {
    return apiError(error.message || "Failed to fetch university details", 500);
  }
}

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

    const university = await prisma.university.update({
      where: { id },
      data: body,
    });

    return apiSuccess({ university }, "University updated successfully");
  } catch (error: any) {
    return apiError(error.message || "Failed to update university", 500);
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSessionFromRequest(req, true);
    if (!session || session.role !== "ADMIN") {
      return apiError("Unauthorized", 401);
    }

    const { id } = await params;
    await prisma.university.delete({ where: { id } });

    return apiSuccess({ success: true }, "University deleted successfully");
  } catch (error: any) {
    return apiError(error.message || "Failed to delete university", 500);
  }
}
