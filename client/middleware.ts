import { type NextRequest, NextResponse } from "next/server";

const allowedOrigins = ["https://sandbox.polar.sh"];

export default async function middleware(request: NextRequest) {
  const token = request.cookies.get("account-session");
  const pathname = request.nextUrl.pathname;

  const origin = request.headers.get("origin");
  const response = NextResponse.next();

  if (origin && allowedOrigins.includes(origin)) {
    response.headers.set("Access-Control-Allow-Origin", origin);
  }

  if (!token) {
    if (pathname === "/") {
      return response;
    }
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (pathname === "/") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return response;
}

export const config = {
  matcher: ["/dashboard/:path*", "/practice/:path*", "/results/:path*", "/"],
};
