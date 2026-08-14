import { NextRequest } from "next/server";
import prisma from "@/lib/db";
import { hashPassword, verifyPassword, getSessionFromRequest, setAuthCookie, signToken } from "@/lib/auth";
import { apiError, apiSuccess } from "@/lib/api-response";
import { z } from "zod";

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(8, "New password must be at least 8 characters long"),
});

export async function POST(req: NextRequest) {
  try {
    const session = await getSessionFromRequest(req, true);
    if (!session || session.role !== "ADMIN") {
      return apiError("Unauthorized", 401);
    }

    const body = await req.json();
    const parsed = changePasswordSchema.safeParse(body);

    if (!parsed.success) {
      return apiError(parsed.error.issues[0].message, 400);
    }

    const { currentPassword, newPassword } = parsed.data;

    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      include: { adminUser: true },
    });

    if (!user || !user.adminUser) {
      return apiError("Admin user not found", 404);
    }

    const isValid = await verifyPassword(currentPassword, user.passwordHash);
    if (!isValid) {
      return apiError("Incorrect current password", 400);
    }

    const newHash = await hashPassword(newPassword);

    await prisma.user.update({
      where: { id: user.id },
      data: { passwordHash: newHash },
    });

    await prisma.adminUser.update({
      where: { id: user.adminUser.id },
      data: { mustChangePassword: false },
    });

    const token = signToken(
      {
        userId: user.id,
        email: user.email,
        role: user.role,
        mustChangePassword: false,
      },
      true
    );

    await setAuthCookie(token, true);

    return apiSuccess({ success: true }, "Password changed successfully");
  } catch (error: any) {
    console.error("Change Password Error:", error);
    return apiError(error.message || "Failed to change password", 500);
  }
}
