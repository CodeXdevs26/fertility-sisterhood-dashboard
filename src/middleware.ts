import { NextResponse, NextRequest } from "next/server";
import { jwtDecode } from "jwt-decode";
import { TDecodedUser } from "./interface/global.interface";

const DASHBOARD_PATH = /^\/dashboard(\/.*)?$/;
const AUTH_PATH = /^\/auth(\/.*)?$/;

export async function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  const token = request.cookies.get("accessToken")?.value;

  // Token expiry is NOT checked here: an expired access token is refreshed by the
  // API layer (refresh cookie). We only check that an admin token exists.
  let isAuthenticated = false;
  if (token) {
    try {
      const decodedUser = jwtDecode<TDecodedUser>(token);
      isAuthenticated = decodedUser?.role === "ADMIN";
    } catch {
      isAuthenticated = false;
    }
  }

  // "/" has no page of its own: go to the dashboard, or to login when not logged in
  if (pathname === "/") {
    return NextResponse.redirect(new URL(isAuthenticated ? "/dashboard" : "/auth/login", request.url));
  }

  // Not logged in -> login page, remembering the page they tried to visit
  if (DASHBOARD_PATH.test(pathname) && !isAuthenticated) {
    const loginUrl = new URL("/auth/login", request.url);
    loginUrl.searchParams.set("redirect", pathname + (searchParams.toString() ? `?${searchParams}` : ""));
    return NextResponse.redirect(loginUrl);
  }

  // Already logged in -> auth pages are not accessible, go to the dashboard
  if (AUTH_PATH.test(pathname) && isAuthenticated) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/auth/:path*", "/"],
};
