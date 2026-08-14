import { NextRequest } from "next/server";
import prisma from "@/lib/db";
import { hashPassword, setAuthCookie, signToken } from "@/lib/auth";
import { apiError, apiSuccess } from "@/lib/api-response";
import { z } from "zod";

const registerSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  phone: z.string().optional(),
  nationality: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
      return apiError(parsed.error.issues[0].message, 400);
    }

    const { email, password, firstName, lastName, phone, nationality } = parsed.data;

    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existingUser) {
      return apiError("An account with this email already exists", 400);
    }

    const passwordHash = await hashPassword(password);

    const user = await prisma.user.create({
      data: {
        email: email.toLowerCase(),
        passwordHash,
        role: "STUDENT",
        student: {
          create: {
            firstName,
            lastName,
            phone: phone || null,
            nationality: nationality || null,
          },
        },
      },
      include: {
        student: true,
      },
    });

    const token = signToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    await setAuthCookie(token, false);

    return apiSuccess(
      {
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
          student: user.student,
        },
      },
      "Registration successful",
      201
    );
  } catch (error: any) {
    console.error("Register Error:", error);
    return apiError(error.message || "Failed to register student", 500);
  }
}
