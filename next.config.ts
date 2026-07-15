import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  outputFileTracingRoot: process.cwd(),
  turbopack: {
    root: process.cwd(),
  },
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [
          {
            type: "host",
            value: "rickyrecalcati.com",
          },
        ],
        destination: "https://www.rickyrecalcati.com/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
