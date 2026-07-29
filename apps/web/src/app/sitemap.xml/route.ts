import { SITE_URL } from "@/lib/constants";

export async function GET() {
  const staticRoutes = [
    { url: SITE_URL, priority: 1.0, changeFreq: "daily" as const },
    { url: `${SITE_URL}/search`, priority: 0.5, changeFreq: "weekly" as const },
    { url: `${SITE_URL}/favorites`, priority: 0.3, changeFreq: "weekly" as const },
    { url: `${SITE_URL}/downloads`, priority: 0.3, changeFreq: "weekly" as const },
    { url: `${SITE_URL}/settings`, priority: 0.2, changeFreq: "monthly" as const },
  ];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticRoutes
  .map(
    (route) => `  <url>
    <loc>${route.url}</loc>
    <changefreq>${route.changeFreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`
  )
  .join("\n")}
</urlset>`;

  return new Response(sitemap, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
