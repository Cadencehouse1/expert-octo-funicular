import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      // Allow resume uploads (5 MB file limit + form fields + encoding overhead).
      bodySizeLimit: "8mb",
    },
  },
};

export default nextConfig;
