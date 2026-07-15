import { NextRequest, NextResponse } from "next/server";
import { geocodeQuery } from "@/lib/geocode";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q") ?? "";
  try {
    const results = await geocodeQuery(q);
    return NextResponse.json({ results });
  } catch {
    return NextResponse.json({ error: "Geocoding failed" }, { status: 502 });
  }
}
