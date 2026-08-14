import { NextRequest } from "next/server";
import { randomBytes } from "crypto";
import prisma from "@/lib/db";
import { apiSuccess, apiError } from "@/lib/api-response";
import { forgotPasswordSchema } from "@/lib/validation/schemas";
import { checkRateLimit } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  const rate = checkRateLimit(request, "forgot-password", 5, 900000);
  if (!rate.success) return apiError("Too many requests", 429);

  try {
    const body = await request.json();
    const parsed = forgotPasswordSchema.safeParse(body);
    if (!parsed.success) return apiError("Invalid email", 400);

    const user = await prisma.user.findUnique({
      where: { email: parsed.data.email.toLowerCase() },
    });

    if (user) {
      const token = randomBytes(32).toString("hex");
      await prisma.passwordResetToken.create({
        data: {
          token,
          userId: user.id,
          expiresAt: new Date(Date.now() + 60 * 60 * 1000),
        },
      });
    }

    return apiSuccess({ message: "If the email exists, a reset link has been sent." });
  } catch {
    return apiError("Request failed", 500);
  }
}
