import { clerkMiddleware } from "@clerk/nextjs/server";

// Public-by-default: clerkMiddleware only attaches auth context; it gates nothing.
// /api/progress does its own `auth()` check and returns empty for signed-out users,
// so signed-out browsing and static /data/*.json fetches are never blocked.
export default clerkMiddleware();

export const config = {
  matcher: [
    // Run on everything except Next internals and static assets (incl. .json data files).
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|txt|xml|webmanifest)).*)",
    // Always run on API routes.
    "/(api|trpc)(.*)",
  ],
};
