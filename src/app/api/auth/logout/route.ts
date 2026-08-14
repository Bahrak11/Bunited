import { NextRequest } from "next/server";
import { clearAuthCookie } from "@/lib/auth";
import { apiSuccess } from "@/lib/api-response";

export async function POST(req: NextRequest) {
  await clearAuthCookie(false);
  await clearAuthCookie(true);
  return apiSuccess({ success: true }, "Logged out successfully");
}
