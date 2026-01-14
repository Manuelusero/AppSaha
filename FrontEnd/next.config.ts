import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8000',
        pathname: '/uploads/**',
      },
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '8000',
        pathname: '/uploads/**',
      },
    ],
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    // Permitir localhost en desarrollo
    unoptimized: process.env.NODE_ENV === 'development',
  },
  // Permitir localhost en desarrollo
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3000', 'localhost:8000', '127.0.0.1:3000', '127.0.0.1:8000'],
    },
  },
};

export default nextConfig;
