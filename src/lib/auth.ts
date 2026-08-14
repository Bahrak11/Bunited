import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";
import prisma from "./db";
import type { UserRole } from "@prisma/client";

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-change-me";

export interface JWTPayload {
  userId: string;
  email: string;
  role: UserRole;
  mustChangePassword?: boolean;
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function signToken(payload: JWTPayload, isAdmin = false): string {
  const expiresIn = isAdmin ? "8h" : "7d";
  return jwt.sign(payload, JWT_SECRET, { expiresIn: expiresIn as any });
}

export function verifyToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload;
  } catch {
    return null;
  }
}

export const COOKIE_NAMES = {
  student: "bunited_session",
  admin: "bunited_admin_session",
} as const;

export async function setAuthCookie(token: string, isAdmin = false) {
  const cookieStore = await cookies();
  cookieStore.set(isAdmin ? COOKIE_NAMES.admin : COOKIE_NAMES.student, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: isAdmin ? 8 * 60 * 60 : 7 * 24 * 60 * 60,
    path: "/",
  });
}

export async function clearAuthCookie(isAdmin = false) {
  const cookieStore = await cookies();
  cookieStore.delete(isAdmin ? COOKIE_NAMES.admin : COOKIE_NAMES.student);
}

export async function getSession(isAdmin = false): Promise<JWTPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(
    isAdmin ? COOKIE_NAMES.admin : COOKIE_NAMES.student
  )?.value;
  if (!token) return null;
  return verifyToken(token);
}

export function getTokenFromRequest(
  request: NextRequest,
  isAdmin = false
): string | null {
  const cookieName = isAdmin ? COOKIE_NAMES.admin : COOKIE_NAMES.student;
  return request.cookies.get(cookieName)?.value || null;
}

export async function getSessionFromRequest(
  request: NextRequest,
  isAdmin = false
): Promise<JWTPayload | null> {
  const token = getTokenFromRequest(request, isAdmin);
  if (!token) return null;
  return verifyToken(token);
}

export async function requireAuth(
  request: NextRequest,
  roles?: UserRole[]
): Promise<{ session: JWTPayload } | { error: string; status: number }> {
  const isAdminRoute = request.nextUrl.pathname.startsWith("/api/admin");
  const session = await getSessionFromRequest(request, isAdminRoute);

  if (!session) {
    return { error: "Unauthorized", status: 401 };
  }

  if (roles && !roles.includes(session.role)) {
    return { error: "Forbidden", status: 403 };
  }

  return { session };
}

export async function createAuditLog(params: {
  action: string;
  entity: string;
  entityId?: string;
  details?: Record<string, unknown>;
  userId?: string;
  ipAddress?: string;
}) {
  await prisma.auditLog.create({
    data: {
      action: params.action,
      entity: params.entity,
      entityId: params.entityId,
      details: params.details ? (params.details as any) : undefined,
      userId: params.userId,
      ipAddress: params.ipAddress,
    },
  });
}
