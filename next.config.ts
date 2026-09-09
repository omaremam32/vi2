import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: [
    "192.168.0.211",
  ],

  images: {
    qualities: [75, 100],

    remotePatterns: [
      {
        protocol: "https",
        hostname: "s3.images-iherb.com",
        pathname: "/**",
      },
    ],
  },

  turbopack: {
    root: process.cwd(),
  },
};

export default nextConfig;