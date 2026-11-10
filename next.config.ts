import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Remote photography is referenced with regular <img> tags so a new image
  // optimization service / account is not required for the local prototype.
};

export default nextConfig;
