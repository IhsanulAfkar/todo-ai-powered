import type { NextConfig } from 'next';

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

const nextConfig: NextConfig = {
  devIndicators: false,
  reactStrictMode: false,
};

if (backendUrl) {
  const url = new URL(backendUrl);

  nextConfig.images = {
    remotePatterns: [
      {
        protocol: url.protocol.replace(':', '') as 'http' | 'https',
        hostname: url.hostname,
        port: url.port || undefined,
        pathname: '/**',
      },
    ],
  };
}

export default nextConfig;
