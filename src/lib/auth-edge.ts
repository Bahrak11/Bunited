export const COOKIE_NAMES = {
  student: "bunited_session",
  admin: "bunited_admin_session",
} as const;

export interface JWTPayload {
  userId: string;
  email: string;
  role: string;
  mustChangePassword?: boolean;
  exp?: number;
}

export function verifyTokenEdge(token: string): JWTPayload | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;

    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );

    const payload = JSON.parse(jsonPayload) as JWTPayload;

    if (payload.exp && Date.now() >= payload.exp * 1000) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}
