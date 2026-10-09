import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Modern browsers receive AVIF first, then WebP. Older browsers receive a
    // compatible optimized fallback automatically from next/image.
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.pexels.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
