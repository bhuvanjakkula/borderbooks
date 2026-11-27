import { NextRequest, NextResponse } from "next/server";

const PAID_COOKIE = "bb_paid_access";

function hasPaidAccess(request: NextRequest): boolean {
  const token = request.cookies.get(PAID_COOKIE)?.value;
  if (!token) return false;
  const expected = process.env.PAID_ACCESS_TOKEN || "bb_verified_subscription_v1";
  return token === expected;
}

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Always allow public landing page, billing page, billing APIs, and Stripe webhooks
  if (
    pathname === "/" ||
    pathname === "/app/billing" ||
    pathname.startsWith("/api/billing/") ||
    pathname === "/api/webhooks/stripe"
  ) {
    return NextResponse.next();
  }

  // Block all dashboard / workspace routes unless user has verified paid access
  if (pathname === "/app" || pathname.startsWith("/app/")) {
    if (!hasPaidAccess(request)) {
      const billingUrl = new URL("/app/billing?paywall=1", request.url);
      return NextResponse.redirect(billingUrl);
    }
  }

  // Block all workspace APIs unless user has verified paid access
  if (pathname.startsWith("/api/")) {
    if (!hasPaidAccess(request)) {
      return NextResponse.json(
        {
          error: "Active paid subscription required to access BorderBooks workspace.",
          code: "PAYMENT_REQUIRED",
          billingUrl: "/app/billing",
        },
        { status: 402 }
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
