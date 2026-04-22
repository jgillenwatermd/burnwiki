import { NextResponse, type NextRequest } from "next/server";
import { createServiceClient } from "@/lib/supabase";
import type { SupabaseClient } from "@supabase/supabase-js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

let cachedClient: SupabaseClient | null = null;
function getClient(): SupabaseClient {
  if (!cachedClient) cachedClient = createServiceClient();
  return cachedClient;
}

const MAX_QUERY_LEN = 200;

export async function POST(req: NextRequest) {
  let body: { query?: unknown; result_count?: unknown; referrer?: unknown };
  try {
    body = await req.json();
  } catch {
    return new NextResponse(null, { status: 400 });
  }

  const query =
    typeof body.query === "string" ? body.query.trim() : "";
  if (!query || query.length > MAX_QUERY_LEN) {
    return new NextResponse(null, { status: 400 });
  }

  const result_count =
    typeof body.result_count === "number" ? body.result_count : -1;
  if (result_count < 0 || !Number.isInteger(result_count)) {
    return new NextResponse(null, { status: 400 });
  }

  let referrer_origin: string | null = null;
  if (typeof body.referrer === "string" && body.referrer.length > 0) {
    try {
      referrer_origin = new URL(body.referrer).origin;
    } catch {
      referrer_origin = null;
    }
  }

  try {
    await getClient().from("search_queries").insert({
      query,
      result_count,
      referrer_origin,
    });
  } catch {
    // Fire-and-forget from caller; swallow insert errors to avoid leaking
    // detail and to keep the 204 contract stable.
  }

  return new NextResponse(null, { status: 204 });
}
