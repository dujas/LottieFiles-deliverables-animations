import * as path from "path";
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default ({ mode }: { mode: string }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };
  // https://vitejs.dev/config/
  return defineConfig({
    plugins: [
      react(),
      VitePWA({
        registerType: "autoUpdate",
        includeAssets: [
          "favicon.ico",
          "apple-touch-icon.png",
          "mask-icon.svg",
          "env.json",
        ],
        manifest: {
          name: "lottie-animations",
          short_name: "Lottie",
          icons: [
            {
              src: "/pwa-192x192.png",
              sizes: "192x192",
              type: "image/png",
              purpose: "any",
            },
            {
              src: "/pwa-512x512.png",
              sizes: "512x512",
              type: "image/png",
              purpose: "any",
            },
            {
              src: "/pwa-maskable-192x192.png",
              sizes: "192x192",
              type: "image/png",
              purpose: "maskable",
            },
            {
              src: "/pwa-maskable-512x512.png",
              sizes: "512x512",
              type: "image/png",
              purpose: "maskable",
            },
          ],
          start_url: "/",
          display: "standalone",
          background_color: "#FFFFFF",
          theme_color: "#FFFFFF",
          description: "POC lottie animations",
        },
        workbox: {
          runtimeCaching: [
            {
              urlPattern:
                /^https:\/\/.*\.s3\..*\.amazonaws\.com\/.+\.json(\?.*)?$/,
              handler: "NetworkFirst",
              options: {
                networkTimeoutSeconds: 10,
                cacheName: "s3-json-cache",
                expiration: {
                  maxEntries: 50,
                  maxAgeSeconds: 60 * 60 * 24, // 1 day
                },
                cacheableResponse: {
                  statuses: [0, 200],
                },
              },
            },
          ],
        },
      }),
    ],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    server: {
      open: false,
      port: 3000,
    },
    build: {
      outDir: "build",
    },
    define: {
      "process.env": process.env,
      VITE_BUILD_NUMBER: process.env.VITE_BUILD_NUMBER,
    },
    optimizeDeps: {
      include: ["tailwind.config.js"],
    },
  });
};
