import { NextRequest } from "next/server";
import prisma from "@/lib/db";
import { verifyPassword, setAuthCookie, signToken, createAuditLog } from "@/lib/auth";
import { apiError, apiSuccess } from "@/lib/api-response";
import { checkRateLimit } from "@/lib/rate-limit";
import { z } from "zod";

const adminLoginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(1, "Password is required"),
});

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "127.0.0.1";
    const rateLimitKey = `login:admin:${ip}`;

    if (!checkRateLimit(req, "login:admin", 5, 900000).success) {
      return apiError("Too many admin login attempts. Account temporarily protected. Try again in 15 minutes.", 429);
    }

    const body = await req.json();
    const parsed = adminLoginSchema.safeParse(body);

    if (!parsed.success) {
      return apiError(parsed.error.issues[0].message, 400);
    }

    const { email, password } = parsed.data;

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      include: { adminUser: true },
    });

    if (!user || user.role !== "ADMIN" || !user.adminUser) {
      return apiError("Invalid credentials", 401);
    }

    // Check account lockout
    if (user.adminUser.lockedUntil && user.adminUser.lockedUntil > new Date()) {
      return apiError("Account locked due to multiple failed attempts. Please try again later.", 423);
    }

    const isValid = await verifyPassword(password, user.passwordHash);

    if (!isValid) {
      const attempts = user.adminUser.failedLoginAttempts + 1;
      const lockedUntil = attempts >= 5 ? new Date(Date.now() + 15 * 60 * 1000) : null;

      await prisma.adminUser.update({
        where: { id: user.adminUser.id },
        data: {
          failedLoginAttempts: attempts,
          lockedUntil,
        },
      });

      return apiError("Invalid credentials", 401);
    }

    // Reset failed attempts & update last login
    await prisma.adminUser.update({
      where: { id: user.adminUser.id },
      data: {
        failedLoginAttempts: 0,
        lockedUntil: null,
        lastLoginAt: new Date(),
      },
    });

    const token = signToken(
      {
        userId: user.id,
        email: user.email,
        role: user.role,
        mustChangePassword: user.adminUser.mustChangePassword,
      },
      true
    );

    await setAuthCookie(token, true);

    await createAuditLog({
      action: "ADMIN_LOGIN",
      entity: "AdminUser",
      entityId: user.adminUser.id,
      userId: user.id,
      ipAddress: ip,
    });

    return apiSuccess(
      {
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
          mustChangePassword: user.adminUser.mustChangePassword,
          firstName: user.adminUser.firstName,
          lastName: user.adminUser.lastName,
        },
      },
      "Admin login successful"
    );
  } catch (error: any) {
    console.error("Admin Login Error:", error);
    return apiError(error.message || "Admin login failed", 500);
  }
}
