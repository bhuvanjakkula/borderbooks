import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/server/db/client";
import { fetchMidRate, fetchRateHistory } from "@/server/fx";

export async function GET(request: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = request.nextUrl;
  const base = (searchParams.get("base") ?? "USD").toUpperCase();
  const quote = (searchParams.get("quote") ?? "EUR").toUpperCase();
  const date = searchParams.get("date") ?? undefined;
  const history = searchParams.get("history") === "true";

  try {
    if (history) {
      const days = Math.min(365, Math.max(7, Number(searchParams.get("days") ?? 30)));
      const rates = await fetchRateHistory(db as any, base, quote, days);
      return NextResponse.json({ base, quote, history: rates });
    }

    const result = await fetchMidRate(db as any, base, quote, date ?? new Date());
    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to fetch FX rate";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
