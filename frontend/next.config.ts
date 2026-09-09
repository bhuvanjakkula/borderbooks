import type { NextConfig } from "next";

const config: NextConfig = {
  experimental: { serverActions: { bodySizeLimit: "10mb" } },
  serverExternalPackages: ["pdfkit", "fontkit", "iconv-lite", "restructure"],
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"}/api/:path*`,
      },
    ];
  },
};

export default config;
