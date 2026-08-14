import { NextRequest } from "next/server";
import prisma from "@/lib/db";
import { verifyPassword, setAuthCookie, signToken } from "@/lib/auth";
import { apiError, apiSuccess } from "@/lib/api-response";
import { checkRateLimit } from "@/lib/rate-limit";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for") || "127.0.0.1";
    const rateLimitKey = `login:student:${ip}`;
    if (!checkRateLimit(req, "login:student", 5, 900000).success) {
      return apiError("Too many login attempts. Please try again later.", 429);
    }

    const body = await req.json();
    const parsed = loginSchema.safeParse(body);

    if (!parsed.success) {
      return apiError(parsed.error.issues[0].message, 400);
    }

    const { email, password } = parsed.data;

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      include: { student: true },
    });

    if (!user || user.role !== "STUDENT") {
      return apiError("Invalid email or password", 401);
    }

    const isValid = await verifyPassword(password, user.passwordHash);
    if (!isValid) {
      return apiError("Invalid email or password", 401);
    }

    const token = signToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    await setAuthCookie(token, false);

    return apiSuccess({
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        student: user.student,
      },
    }, "Login successful");
  } catch (error: any) {
    console.error("Login Error:", error);
    return apiError(error.message || "Failed to log in", 500);
  }
}
