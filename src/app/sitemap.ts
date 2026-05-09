import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return ["", "/pricing", "/app", "/app/logs", "/app/trends", "/app/nap-timer", "/app/snore-check", "/app/watch", "/app/settings"].map(
    (route) => ({
      url: `https://sleep-log.local${route}`,
      changeFrequency: route === "" ? "weekly" : "daily",
      priority: route === "" ? 1 : 0.7,
      lastModified: new Date(),
    }),
  );
}
