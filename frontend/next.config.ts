import type { NextConfig } from "next";

const config: NextConfig = {
  experimental: { serverActions: { bodySizeLimit: "10mb" } },
  serverExternalPackages: ["pdfkit", "fontkit", "iconv-lite", "restructure"],
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "https://backend-peach-gamma-10.vercel.app/api/:path*",
      },
    ];
  },
};

export default config;
