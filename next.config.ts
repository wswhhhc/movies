import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["prisma-adapter-sqlite"],
  allowedDevOrigins: ["*.trycloudflare.com"],
};

export default nextConfig;
