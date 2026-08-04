import { NextResponse } from "next/server";
import { getPlaiceholder } from "plaiceholder";

const cache = new Map<string, { data: string; expires: number }>();
const TTL = 5 * 60 * 1000; // 5 minutes

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get("url");
  if (!url) {
    return NextResponse.json({ error: "Missing url param" }, { status: 400 });
  }

  const now = Date.now();
  const cached = cache.get(url);
  if (cached && cached.expires > now) {
    return NextResponse.json({ blurDataURL: cached.data });
  }

  try {
    const res = await fetch(url);
    if (!res.ok) {
      return NextResponse.json({ blurDataURL: null });
    }
    const buffer = Buffer.from(await res.arrayBuffer());
    const { base64 } = await getPlaiceholder(buffer);
    cache.set(url, { data: base64, expires: now + TTL });
    return NextResponse.json({ blurDataURL: base64 });
  } catch {
    return NextResponse.json({ blurDataURL: null });
  }
}
