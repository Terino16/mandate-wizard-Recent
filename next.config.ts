import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["better-auth", "@prisma/client"],
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
};

export default nextConfig;
