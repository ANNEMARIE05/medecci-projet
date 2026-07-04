import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false, // Set to false to match dev behavior of Vite SPA and prevent double simulation runs
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true, // Prevents compile issues due to type discrepancies on migration stage
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'res.cloudinary.com' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
    ],
  },
};

export default nextConfig;
