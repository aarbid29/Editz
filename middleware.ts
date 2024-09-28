import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
// import type { NextRequest } from "next/server";

const isPublicRoute = createRouteMatcher([
  "/sign-in",
  "/sign-up",
  "/home",
  "/",
]);

const isPublicApiRoute = createRouteMatcher(["/api/videos"]);

export default clerkMiddleware((auth: any, req: any) => {
  const { userId } = auth();
  const currentUrl = new URL(req.url);

  const isHome = currentUrl.pathname === "/home";
  const isApiRequest = currentUrl.pathname.startsWith("/api");

  // If the user is logged in and accessing a public route (but not home) go  to home
  if (userId && isPublicRoute(req) && !isHome) {
    return NextResponse.redirect(new URL("/home", req.url));
  }

  // If the user is not logged in
  if (!userId) {
    // If the request is for a protected route
    if (!isPublicRoute(req)) {
      return NextResponse.redirect(new URL("/sign-in", req.url));
    }

    // If the request is for a protected API route
    if (isApiRequest && !isPublicApiRoute(req)) {
      return NextResponse.redirect(new URL("/sign-in", req.url));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?j|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
