import { NextRequest, NextResponse } from "next/server";
import { verifyTokenEdge, COOKIE_NAMES } from "@/lib/auth-edge";

const ADMIN_PATHS = ["/admin"];
const ADMIN_PUBLIC_PATHS = ["/admin/login"];
const PORTAL_PATHS = ["/portal"];
const PORTAL_PUBLIC_PATHS = ["/portal/login", "/portal/register"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const response = NextResponse.next();

  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=()"
  );

  if (process.env.NODE_ENV === "production") {
    response.headers.set(
      "Strict-Transport-Security",
      "max-age=31536000; includeSubDomains"
    );
  }

  // Admin protection
  const isAdminPath = ADMIN_PATHS.some(
    (p) => pathname.startsWith(p) && !ADMIN_PUBLIC_PATHS.some((pp) => pathname.startsWith(pp))
  );

  if (isAdminPath) {
    const token = request.cookies.get(COOKIE_NAMES.admin)?.value;
    if (!token) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
    const payload = verifyTokenEdge(token);
    if (!payload || (payload.role !== "ADMIN" && payload.role !== "STAFF")) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  // Student Portal protection
  const isPortalPath = PORTAL_PATHS.some(
    (p) => pathname.startsWith(p) && !PORTAL_PUBLIC_PATHS.some((pp) => pathname.startsWith(pp))
  );

  if (isPortalPath) {
    const token = request.cookies.get(COOKIE_NAMES.student)?.value;
    if (!token) {
      return NextResponse.redirect(new URL("/portal/login", request.url));
    }
    const payload = verifyTokenEdge(token);
    if (!payload || payload.role !== "STUDENT") {
      return NextResponse.redirect(new URL("/portal/login", request.url));
    }
  }

  // Auth pages redirect if already logged in
  const isPortalAuthPath = PORTAL_PUBLIC_PATHS.some((p) => pathname.startsWith(p));
  if (isPortalAuthPath) {
    const token = request.cookies.get(COOKIE_NAMES.student)?.value;
    if (token && verifyTokenEdge(token)) {
      return NextResponse.redirect(new URL("/portal", request.url));
    }
  }

  return response;
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/portal/:path*",
  ],
};
