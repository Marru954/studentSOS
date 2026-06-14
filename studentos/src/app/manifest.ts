import type { MetadataRoute } from "next";

/** PWA manifest — makes StudentOS installable to the home screen and lets it
 *  launch standalone (offline-first, served from the service-worker cache). */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "StudentOS — il tuo sistema operativo universitario",
    short_name: "StudentOS",
    description:
      "Orari, appelli, libretto, note e focus in un unico strumento. Offline, senza account.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#0a0a0f",
    theme_color: "#0a0a0f",
    lang: "it",
    categories: ["education", "productivity"],
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
    ],
  };
}
