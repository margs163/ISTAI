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
  async rewrites() {
    return [
      {
        source: "/api/:path*", // Proxy requests starting with /api/
        destination: "https://10e186148c02.ngrok-free.app/:path*", // Your FastAPI backend
      },
    ];
  },
};

export default nextConfig;
