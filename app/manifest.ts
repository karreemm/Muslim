import type { MetadataRoute } from "next";
import { SITE_NAME, siteDescription, siteTitle } from "@/lib/seo";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteTitle("en") || SITE_NAME,
    short_name: SITE_NAME,
    description: siteDescription("en"),
    start_url: "/",
    display: "standalone",
    background_color: "#f5f8f7",
    theme_color: "#cf9d40",
    lang: "ar",
    dir: "rtl",
    icons: [
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
