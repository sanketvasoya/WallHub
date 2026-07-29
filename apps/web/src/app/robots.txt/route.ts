import { SITE_URL } from "@/lib/constants";

export async function GET() {
  const robots = `User-agent: *
Allow: /
Disallow: /api/
Disallow: /admin/
Disallow: /_next/
Disallow: /favorites
Disallow: /downloads
Disallow: /settings

User-agent: Googlebot
Allow: /
Disallow: /api/
Disallow: /admin/
Disallow: /_next/
Disallow: /favorites
Disallow: /downloads
Disallow: /settings

User-agent: Bingbot
Allow: /
Disallow: /api/
Disallow: /admin/
Disallow: /_next/
Disallow: /favorites
Disallow: /downloads
Disallow: /settings

User-agent: DuckDuckBot
Allow: /
Disallow: /api/
Disallow: /admin/
Disallow: /_next/
Disallow: /favorites
Disallow: /downloads
Disallow: /settings

Sitemap: ${SITE_URL}/sitemap.xml
`;

  return new Response(robots, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
