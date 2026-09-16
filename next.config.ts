import path from "path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: path.resolve(__dirname),
  },

  images: {
    qualities: [75, 100],

    remotePatterns: [
      {
        protocol: "https",
        hostname: "s3.images-iherb.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "eg.bigramylabs.com",
        pathname: "/cdn/shop/**",
      },
      {
        protocol: "https",
        hostname: "www.bigramylabs.com",
        pathname: "/cdn/shop/**",
      },
    ],
  },

  allowedDevOrigins: [
    "192.168.1.13",
    "172.20.10.3",
  ],
};

export default nextConfig;