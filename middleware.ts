import { NextResponse, type NextRequest } from "next/server";

const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

export function middleware(request: NextRequest) {
  if (!request.nextUrl.pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  const ip = request.headers.get("x-forwarded-for") ?? "local";
  const now = Date.now();
  const current = rateLimitMap.get(ip);

  if (!current || current.resetAt < now) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + 60_000 });
    return NextResponse.next();
  }

  if (current.count >= 100) {
    return NextResponse.json({ message: "Rate limit exceeded" }, { status: 429 });
  }

  current.count += 1;
  rateLimitMap.set(ip, current);
  return NextResponse.next();
}

export const config = {
  matcher: "/api/:path*"
};
