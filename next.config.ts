import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // Completely ignore ESLint during builds
    ignoreDuringBuilds: true,
    dirs: [], // Don't run ESLint on any directories
  },
  typescript: {
    // Completely ignore TypeScript errors during builds
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
