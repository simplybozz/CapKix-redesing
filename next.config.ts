import type { NextConfig } from "next";

/**
 * Exportación estática: el sitio se puede publicar en GitHub Pages, Netlify o
 * Vercel sin servidor. Para producción con base de datos real ver README.
 */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  basePath,
  images: { unoptimized: true },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
