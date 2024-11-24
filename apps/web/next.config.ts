import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        hostname:"xprpals.mypinata.cloud"
      }
    ]
  }
};

export default nextConfig;
