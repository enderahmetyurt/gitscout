import { tanstackStart } from "@tanstack/react-start/plugin/vite"
import { paraglideVitePlugin } from "@inlang/paraglide-js"
import babel from "@rolldown/plugin-babel"
import tailwindcss from "@tailwindcss/vite"
import viteReact, { reactCompilerPreset } from "@vitejs/plugin-react"
import { nitro } from "nitro/vite"
import { defineConfig } from "vite"

const config = defineConfig({
  resolve: { tsconfigPaths: true },
  // Önizleme görselini çizen resvg native (.node) bir modül; paketlenmez, Node'dan doğrudan yüklenir.
  optimizeDeps: { exclude: ["@resvg/resvg-js"] },
  ssr: { external: ["@resvg/resvg-js"] },
  plugins: [
    tailwindcss(),
    tanstackStart(),
    // Sunucu çıktısını barındırma ortamına (Vercel) uygun üretir. Haftalık yenileme saatte bir çalışır;
    // derleme Vercel'in kendi çıktı biçimini ürettiği için cron tanımı buradan config.json'a yazılır.
    nitro({
      vercel: {
        config: { version: 3, crons: [{ path: "/api/cron/refresh", schedule: "0 * * * *" }] }
      }
    }),
    viteReact(),
    babel({ presets: [reactCompilerPreset()] }),
    paraglideVitePlugin({
      project: "./project.inlang",
      outdir: "./src/paraglide",
      // The URL alone decides the language: no redirect ever comes from a cookie or a header.
      strategy: ["url", "baseLocale"],
      urlPatterns: [
        // Without this entry, the Turkish home page comes out as `/tr/`, which the router redirects.
        {
          pattern: "/",
          localized: [
            ["tr", "/tr"],
            ["en", "/"]
          ]
        },
        {
          pattern: "/:path(.*)?",
          localized: [
            ["tr", "/tr/:path(.*)?"],
            ["en", "/:path(.*)?"]
          ]
        }
      ]
    })
  ]
})

export default config
