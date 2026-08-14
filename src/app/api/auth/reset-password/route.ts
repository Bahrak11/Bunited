import { NextRequest } from "next/server";
import prisma from "@/lib/db";
import { requireAuth, hashPassword } from "@/lib/auth";
import { apiSuccess, apiError } from "@/lib/api-response";
import { resetPasswordSchema } from "@/lib/validation/schemas";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = resetPasswordSchema.safeParse(body);
    if (!parsed.success) return apiError("Validation failed", 400);

    const resetToken = await prisma.passwordResetToken.findUnique({
      where: { token: parsed.data.token },
    });

    if (!resetToken || resetToken.expiresAt < new Date()) {
      return apiError("Invalid or expired token", 400);
    }

    const passwordHash = await hashPassword(parsed.data.password);

    await prisma.user.update({
      where: { id: resetToken.userId },
      data: { passwordHash },
    });

    await prisma.passwordResetToken.delete({ where: { id: resetToken.id } });

    return apiSuccess({ message: "Password reset successfully" });
  } catch {
    return apiError("Reset failed", 500);
  }
}
