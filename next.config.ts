import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Output mode - standalone for containerized deployments
  output: "standalone",

  // Image optimization settings
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "leetcode.com",
      },
    ],
  },

  // Disable source maps in production for smaller bundles
  productionBrowserSourceMaps: false,

  // Enable experimental features for better performance
  experimental: {
    optimizePackageImports: ["lucide-react", "@radix-ui/react-icons"],
  },

  // Headers for caching and security
  async headers() {
    return [
      {
        // Static assets - cache forever
        source: "/:all*(svg|jpg|jpeg|png|gif|ico|webp|mp4|ttf|otf|woff|woff2)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        // JavaScript and CSS bundles
        source: "/_next/static/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        // HTML pages - enable security headers
        source: "/:path*",
        headers: [
          {
            key: "X-DNS-Prefetch-Control",
            value: "on",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
        ],
      },
      {
        // SEO pages with ISR caching
        source: "/company/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, s-maxage=86400, stale-while-revalidate=604800",
          },
        ],
      },
      {
        source: "/topic/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, s-maxage=86400, stale-while-revalidate=604800",
          },
        ],
      },
      {
        source: "/problem/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, s-maxage=604800, stale-while-revalidate=2592000",
          },
        ],
      },
      {
        source: "/companies",
        headers: [
          {
            key: "Cache-Control",
            value: "public, s-maxage=86400, stale-while-revalidate=604800",
          },
        ],
      },
      {
        source: "/topics",
        headers: [
          {
            key: "Cache-Control",
            value: "public, s-maxage=86400, stale-while-revalidate=604800",
          },
        ],
      },
      {
        source: "/problems",
        headers: [
          {
            key: "Cache-Control",
            value: "public, s-maxage=86400, stale-while-revalidate=604800",
          },
        ],
      },
      {
        source: "/sitemap.xml",
        headers: [
          {
            key: "Cache-Control",
            value: "public, s-maxage=86400, stale-while-revalidate=604800",
          },
        ],
      },
      {
        source: "/robots.txt",
        headers: [
          {
            key: "Cache-Control",
            value: "public, s-maxage=86400, stale-while-revalidate=604800",
          },
        ],
      },
    ];
  },

  // Redirects for SEO consistency
  async redirects() {
    return [
      {
        source: "/facebook/:path*",
        destination: "/company/meta/:path*",
        permanent: true,
      },
    ];
  },

  // Logging for debugging builds
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
};

export default nextConfig;
