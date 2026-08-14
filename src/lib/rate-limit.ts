const store = new Map<string, { count: number; resetTime: number }>();

export function rateLimit(
  key: string,
  maxRequests: number,
  windowMs: number
): { success: boolean; remaining: number; resetTime: number } {
  const now = Date.now();
  const entry = store.get(key);

  if (!entry || now > entry.resetTime) {
    store.set(key, { count: 1, resetTime: now + windowMs });
    return { success: true, remaining: maxRequests - 1, resetTime: now + windowMs };
  }

  if (entry.count >= maxRequests) {
    return { success: false, remaining: 0, resetTime: entry.resetTime };
  }

  entry.count++;
  return {
    success: true,
    remaining: maxRequests - entry.count,
    resetTime: entry.resetTime,
  };
}

export function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return request.headers.get("x-real-ip") || "unknown";
}

export function checkRateLimit(
  arg1: string | Request,
  arg2?: string | number,
  arg3?: number,
  arg4?: number
): { success: boolean; remaining: number; resetTime: number } {
  let key: string;
  let max = 100;
  let win = 900000;

  if (typeof arg1 === "string") {
    key = arg1;
    if (typeof arg2 === "number") max = arg2;
    if (typeof arg3 === "number") win = arg3;
  } else {
    const ip = getClientIp(arg1);
    const prefix = typeof arg2 === "string" ? arg2 : "rate";
    key = `${prefix}:${ip}`;
    if (typeof arg3 === "number") max = arg3;
    if (typeof arg4 === "number") win = arg4;
  }

  return rateLimit(key, max, win);
}

export function checkLoginRateLimit(request: Request) {
  const ip = getClientIp(request);
  return rateLimit(
    `login:${ip}`,
    parseInt(process.env.LOGIN_RATE_LIMIT_MAX || "5"),
    parseInt(process.env.LOGIN_RATE_LIMIT_WINDOW_MS || "900000")
  );
}
