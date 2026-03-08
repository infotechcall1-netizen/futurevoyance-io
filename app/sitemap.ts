import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://www.futurevoyance.io",
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: "https://www.futurevoyance.io/login",
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: "https://www.futurevoyance.io/privacy-policy",
      changeFrequency: "yearly",
      priority: 0.3,
    },
    // NOTE: /mon-espace/* excluded (authenticated pages, not indexable)
  ];
}
