import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "aieltstalk.s3.eu-central-1.amazonaws.com",
      },
    ],
  },
};

export default nextConfig;
