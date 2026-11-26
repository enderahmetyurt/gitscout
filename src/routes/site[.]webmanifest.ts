import { createFileRoute } from "@tanstack/react-router"

import { siteConfig } from "@/config/site.config"

export const Route = createFileRoute("/site.webmanifest")({
  server: {
    handlers: {
      GET: async () => {
        const manifest = {
          name: siteConfig.name,
          short_name: siteConfig.shortName,
          description: siteConfig.description,
          start_url: "/",
          display: "standalone",
          // Site yalnızca koyu temada; ana ekrandan açılışta da aynı zemin görünsün.
          background_color: "#0a0a0a",
          theme_color: "#0a0a0a",
          icons: [
            { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
            { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
            // Android ikonu daire ya da yuvarlak kareye kırpar; kart bu dosyada güvenli alanın içinde.
            {
              src: "/icon-maskable-512.png",
              sizes: "512x512",
              type: "image/png",
              purpose: "maskable"
            }
          ]
        }

        return Response.json(manifest, {
          headers: { "Content-Type": "application/manifest+json; charset=utf-8" }
        })
      }
    }
  }
})
