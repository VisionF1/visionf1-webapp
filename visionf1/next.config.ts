import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/apple-touch-icon.png",
        destination: "/apple-icon.png",
      },
      {
        source: "/apple-touch-icon-precomposed.png",
        destination: "/apple-icon.png",
      },
      {
        source: "/apple-touch-icon-120x120.png",
        destination: "/apple-icon.png",
      },
      {
        source: "/apple-touch-icon-120x120-precomposed.png",
        destination: "/apple-icon.png",
      },
    ];
  },
};

export default nextConfig;
