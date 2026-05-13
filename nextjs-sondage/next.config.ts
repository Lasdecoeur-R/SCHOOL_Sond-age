import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  /** Évite qu’adapter-pg / pg soient mal tracés dans l’image standalone (erreur 500 au runtime). */
  serverExternalPackages: ["@prisma/adapter-pg", "pg"],
  outputFileTracingIncludes: {
    "/tableau-de-bord": [
      "./node_modules/@prisma/adapter-pg/**/*",
      "./app/generated/prisma/**/*",
    ],
    "/sondages/nouveau": [
      "./node_modules/@prisma/adapter-pg/**/*",
      "./app/generated/prisma/**/*",
    ],
    "/sondages/[id]/vote": [
      "./node_modules/@prisma/adapter-pg/**/*",
      "./app/generated/prisma/**/*",
    ],
    "/sondages/[id]/resultats": [
      "./node_modules/@prisma/adapter-pg/**/*",
      "./app/generated/prisma/**/*",
    ],
    "/sondages/[id]/editer": [
      "./node_modules/@prisma/adapter-pg/**/*",
      "./app/generated/prisma/**/*",
    ],
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        pathname: "/**",
      },
    ],
  },
  async redirects() {
    return [
      { source: "/login", destination: "/connexion", permanent: false },
      { source: "/connection", destination: "/connexion", permanent: false },
      { source: "/signin", destination: "/connexion", permanent: false },
      { source: "/dashboard", destination: "/tableau-de-bord", permanent: false },
    ];
  },
};

export default nextConfig;
