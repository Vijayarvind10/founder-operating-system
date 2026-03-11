import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // No static export — Vercel AI SDK streaming and Prisma require a Node.js runtime.
};

export default nextConfig;
