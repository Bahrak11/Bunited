import { NextRequest } from "next/server";
import prisma from "@/lib/db";
import { apiError, apiSuccess } from "@/lib/api-response";
import { getSessionFromRequest, hashPassword, setAuthCookie, signToken } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const session = await getSessionFromRequest(req, false);
    if (!session) {
      return apiError("Unauthorized", 401);
    }

    const student = await prisma.student.findUnique({
      where: { userId: session.userId },
    });

    if (!student) {
      return apiError("Student profile not found", 404);
    }

    const applications = await prisma.application.findMany({
      where: { studentId: student.id },
      include: {
        university: {
          select: { name: true, logoUrl: true, city: true },
        },
        program: {
          select: { name: true, degreeLevel: true, tuitionFee: true, language: true },
        },
        documents: {
          include: { document: true },
        },
        payments: true,
        messages: {
          orderBy: { createdAt: "asc" },
        },
        notifications: {
          orderBy: { createdAt: "desc" },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return apiSuccess({ applications });
  } catch (error: any) {
    return apiError(error.message || "Failed to fetch student applications", 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      fullName,
      email,
      phone,
      nationality,
      dateOfBirth,
      degreeLevel,
      programId,
      universityId,
      preferredCity,
      academicInfo,
    } = body;

    let session = await getSessionFromRequest(req, false);
    let studentId: string;

    if (session) {
      const student = await prisma.student.findUnique({
        where: { userId: session.userId },
      });
      if (!student) return apiError("Student profile not found", 404);
      studentId = student.id;
    } else {
      if (!email || !fullName) {
        return apiError("Email and Full Name are required to submit an application", 400);
      }

      // Auto-create user account if not logged in
      const existingUser = await prisma.user.findUnique({
        where: { email: email.toLowerCase() },
        include: { student: true },
      });

      if (existingUser && existingUser.student) {
        studentId = existingUser.student.id;
      } else {
        const nameParts = fullName.trim().split(" ");
        const firstName = nameParts[0] || "Applicant";
        const lastName = nameParts.slice(1).join(" ") || "Student";
        const defaultPasswordHash = await hashPassword("Bunited2026!");

        const newUser = await prisma.user.create({
          data: {
            email: email.toLowerCase(),
            passwordHash: defaultPasswordHash,
            role: "STUDENT",
            student: {
              create: {
                firstName,
                lastName,
                phone: phone || null,
                nationality: nationality || null,
                dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
              },
            },
          },
          include: { student: true },
        });

        studentId = newUser.student!.id;

        const token = signToken({
          userId: newUser.id,
          email: newUser.email,
          role: newUser.role,
        });

        await setAuthCookie(token, false);
      }
    }

    const applicationNumber = `BUN-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;

    const application = await prisma.application.create({
      data: {
        applicationNumber,
        status: "DOCUMENTS_REQUIRED",
        degreeLevel,
        preferredCity,
        academicInfo,
        progressStep: 2,
        submittedAt: new Date(),
        studentId,
        universityId: universityId || null,
        programId: programId || null,
      },
      include: {
        university: true,
        program: true,
      },
    });

    // Create initial notification
    await prisma.notification.create({
      data: {
        title: "Application Submitted Successfully",
        message: `Your application (${applicationNumber}) for ${application.program?.name || "chosen program"} has been received.`,
        type: "APPLICATION_UPDATE",
        studentId,
        applicationId: application.id,
      },
    });

    return apiSuccess({ application }, "Application created successfully", 201);
  } catch (error: any) {
    console.error("POST Application Error:", error);
    return apiError(error.message || "Failed to submit application", 500);
  }
}
