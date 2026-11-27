import { NextResponse } from "next/server";
import { stripeClient, appUrl } from "@/server/billing/stripe";

const PAID_COOKIE = "bb_paid_access";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const sessionId = url.searchParams.get("session_id");
  const origin = appUrl();

  if (!sessionId) {
    return NextResponse.redirect(`${origin}/app/billing?paywall=1`);
  }

  try {
    const stripe = stripeClient();
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    const isPaid =
      session.payment_status === "paid" ||
      session.status === "complete";

    if (isPaid) {
      const response = NextResponse.redirect(`${origin}/app`);
      const token = process.env.PAID_ACCESS_TOKEN || "bb_verified_subscription_v1";
      response.cookies.set(PAID_COOKIE, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 30, // 30 days
      });
      return response;
    }
  } catch (error) {
    console.error("Error verifying Stripe checkout session:", error);
  }

  return NextResponse.redirect(`${origin}/app/billing?paywall=1`);
}
