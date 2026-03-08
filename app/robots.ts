import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/mon-espace/", "/api/"],
    },
    sitemap: "https://www.futurevoyance.io/sitemap.xml",
  };
}
